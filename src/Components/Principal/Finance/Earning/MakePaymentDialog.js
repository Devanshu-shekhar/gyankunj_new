import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchPaymentModes, makeFeePayment } from "../../../../ApiClient";
import { showAlertMessage } from "../../../AlertMessage";

const MakePaymentDialog = ({
  isOpen,
  handleClose,
  feeDetails,
  isParentView,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [paymentModes, setPaymentModes] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isNormalizeFine, setIsNormalizeFine] = useState(false);

  useEffect(() => {
    fetchPaymentModesList();
  }, []);

  const fetchPaymentModesList = async () => {
    try {
      const response = await fetchPaymentModes();
      setPaymentModes(response.data.payment_modes || []);
    } catch (err) {
      console.error("Failed to fetch payment modes:", err);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      student_id: feeDetails.student_id || "",
      payment_mode_id: "",
      transaction_id: "",
      transaction_amount: "",
      normalize_fine: feeDetails.fines ? true : false,
      fee_amount: feeDetails.total_outstanding || "",
      normalized_fine_amount: "",
    },
    mode: "onChange",
  });

  const handleNormalizeFineChange = (e) => {
    const checked = e.target.checked;
    setValue("normalize_fine", checked);
    setIsNormalizeFine(checked);
  };

  const setFeeAmountBasedOnFine = (e) => {
    setValue("normalized_fine_amount", e.target.value);
    if (feeDetails?.total_outstanding) {
      const adjustedFeeAmount = e.target.value
        ? feeDetails.total_outstanding - e.target.value
        : feeDetails.total_outstanding;
      setValue("fee_amount", adjustedFeeAmount);
    }
  };

  const onSubmit = async (data) => {
    try {
      let paylaod = {
        ...data,
        transaction_amount: parseInt(data.transaction_amount),  // Convert to number
        fee_amount: parseInt(data.fee_amount), // Convert fee_amount to number
        normalized_fine_amount: data.normalized_fine_amount
          ? parseInt(data.normalized_fine_amount) // Convert normalized fine to number if it exists
          : undefined, 
      };
  
      // Delete fee_amount from the payload if it's not needed
      delete paylaod.fee_amount; 
      const res = await makeFeePayment(paylaod);
      if (res?.data?.status === "success") {
        setAlert({
          type: "success",
          message: "Payment processed successfully! The fee has been paid.",
        });
        setTimeout(() => {
          handleClose(true); // Close the modal and refresh the parent component
          setAlert({ type: "", message: "" }); // Clear the alert
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message:
            res?.data?.message ||
            "An error occurred during the payment process. Please try again.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message:
          "Unable to complete payment due to a technical issue. Please contact support.",
      });
    }
  };

  // Watch the payment_mode_id for conditional rendering
  const paymentModeId = watch("payment_mode_id");

  const handleModeChange = (e) => {
    const value = e.target.value;
    setValue("payment_mode_id", value);
    if (value === 1) {
      setValue("transaction_id", "");
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            maxWidth: isMobile ? "90%" : "60%",
            margin: "auto",
          },
        }}
      >
        <DialogTitle>
          Make Payment
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Student ID */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="student_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      error={!!error}
                      label="Admission ID"
                      disabled
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Payment Mode */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="payment_mode_id"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <InputLabel error={!!error}>Payment Mode</InputLabel>
                        <Select
                          {...field}
                          onChange={handleModeChange}
                          value={field.value || ""}
                          error={!!error}
                          label="Payment Mode"
                        >
                          {paymentModes.map((item) => (
                            <MenuItem
                              key={item.payment_mode_id}
                              value={item.payment_mode_id}
                            >
                              {item.payment_mode_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Transaction Amount */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="transaction_amount"
                  control={control}
                  rules={{ required: paymentModeId !== 1 }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      error={!!error}
                      type="number"
                      onChange={field.onChange}
                      value={field.value || ""}
                      label="Transaction Amount"
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Transaction ID (Conditionally Rendered) */}
              {paymentModeId !== 1 && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="transaction_id"
                    control={control}
                    rules={{ required: paymentModeId !== 1 }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error}
                        onChange={field.onChange}
                        value={field.value || ""}
                        type="text"
                        label="Transaction ID"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              )}

              {/* Fee Amount */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="fee_amount"
                  control={control}
                  rules={{ required: true }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      error={!!error}
                      type="number"
                      label="Total Outstanding Amount"
                      onChange={field.onChange}
                      value={field.value || ""}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              {/* Normalize Fine */}
              {!isParentView && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="normalize_fine"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label className="fw-bold text-primary-emphasis">
                          Normalize Fine
                        </label>
                        <Switch
                          checked={field.value}
                          onChange={handleNormalizeFineChange}
                        />
                      </>
                    )}
                  />
                </Grid>
              )}

              {/* Normalized Fine Amount */}
              {!isParentView && isNormalizeFine && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="normalized_fine_amount"
                    control={control}
                    rules={{ required: isNormalizeFine }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={!!error}
                        type="number"
                        label="Normalized Fine Amount"
                        onChange={setFeeAmountBasedOnFine}
                        value={field.value || ""}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => reset()}
              color="secondary"
              variant="outlined"
            >
              Reset
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Confirm Payment
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Alert Message */}
      {alert.type &&
        showAlertMessage({
          open: true,
          alertFor: alert.type,
          message: alert.message,
        })}
    </>
  );
};

export default MakePaymentDialog;
