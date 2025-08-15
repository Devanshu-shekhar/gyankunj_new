import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { createExpenses } from "../../../../ApiClient";
import { showAlertMessage } from "../../../AlertMessage";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";

const CreateExpense = ({ isOpen, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [alert, setAlert] = useState({ type: "", message: "" });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      item_name: "",
      bill_amount: "",
      received_by: "",
      bill_number: "",
      organization_name: "",
      release_date: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const formattedRelease_date = dayjs(data.release_date).format("YYYY-MM-DD");

    let payload = {
      ...data,
      release_date: formattedRelease_date,
    };
    try {
      const res = await createExpenses(payload);
      if (res?.data?.status === "success") {
        setAlert({
          type: "success",
          message: "Expense created successfully.",
        });
        setTimeout(() => {
          handleClose(true);
          setAlert({ type: "", message: "" });
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message: res?.data?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Failed to create expense." });
    }
  };

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="paper"
      PaperProps={{
        sx: {
          maxWidth: isMobile ? "90%" : "60%",
          width: "100%",
          margin: isMobile ? 1 : "auto",
        },
      }}
    >
      <DialogTitle>
        Create Expense
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="item_name"
                control={control}
                rules={{ required: "Item Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Item Name"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="bill_amount"
                control={control}
                rules={{
                  required: "Bill Amount is required",
                  validate: (value) =>
                    value > 0 ? true : "Amount must be positive",
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Bill Amount"
                    fullWidth
                    type="number"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="received_by"
                control={control}
                rules={{ required: "Received By is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Received By"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="bill_number"
                control={control}
                rules={{ required: "Bill Number is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Bill Number"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="organization_name"
                control={control}
                rules={{ required: "Organization Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Organization Name"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="release_date"
                control={control}
                rules={{ required: "Release Date is required" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="w-100"
                      label="Release Date"
                      value={value || null}
                      onChange={(newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" type="reset" onClick={() => reset()}>
            Reset
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isValid}
          >
            Submit
          </Button>
        </DialogActions>
      </form>

      {alert.type &&
        showAlertMessage({
          open: true,
          alertFor: alert.type,
          message: alert.message,
        })}
    </Dialog>
  );
};

export default CreateExpense;
