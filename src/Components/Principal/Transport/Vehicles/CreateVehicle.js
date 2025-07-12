import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Chip,
} from "@mui/material";
import { createVehicleType, getAllVehicleTypes, updateVehicles } from "../../../../ApiClient";
import dayjs from "dayjs";
import { showAlertMessage } from "../../../AlertMessage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    height: "calc(100% - 53px)",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    maxWidth: "50%",
    width: "500px",
    height: "100%",
    overflow: "hidden",
  },
}));

const CreateVehicle = ({ isOpen, handleClose, initialData = null }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vehicle_registration_number: "",
      vehicle_owner: "",
      vehicle_type_id: "",
      manufacturing_date: "",
      insurance_expiry_date: "",
      pollution_expiry_date: "",
    },
  });

  const [showAlert, setShowAlert] = useState("");
  const [showAlertForVehicleType, setShowAlertForVehicleType] = useState("");
  const [isVehicleTypeModalVisible, setIsVehicleTypeModalVisible] = useState(false);
  const [newVehicleTypes, setNewVehicleTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [vehicleTypeInput, setVehicleTypeInput] = useState("");
  const [refreshVehicleTypeList, setRefreshVehicleTypeList] = useState(false);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  useEffect(() => {
    getAllVehicleTypes()
      .then((res) => {
        setVehicleTypes([]);
        if (res?.data?.vehicle_types_data?.length > 0) {
          setVehicleTypes(res.data.vehicle_types_data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshVehicleTypeList]);

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);

    updateVehicles(data)
      .then((res) => {
        if (res?.data?.status === "success") {
          setShowAlert("success");
        } else {
          setShowAlert("error");
        }
        setTimeout(() => {
          handleClose(true);
          setTimeout(() => {
            setShowAlert("");
          }, 2000);
        }, 1000);
      })
      .catch((err) => {
        setShowAlert("error");
        setTimeout(() => {
          setShowAlert("");
        }, 3000);
      });
  };

  const handleVehicleTypeModalClose = () => {
    setIsVehicleTypeModalVisible(false);
    setNewVehicleTypes([]);
    setVehicleTypeInput("");
  };

  const handleSaveVehicleTypes = () => {
    const payload = {
      vehicle_types: newVehicleTypes,
    };

    // Mock API call to save vehicle types
    console.log("Saving Vehicle Types: ", payload);

    createVehicleType(payload)
      .then((res) => {
        if (res?.data?.status === "success") {
          setShowAlertForVehicleType("success");
          setRefreshVehicleTypeList(!refreshVehicleTypeList);
          handleVehicleTypeModalClose();       
        } else {
          setShowAlertForVehicleType("error");
        }
        setTimeout(() => {
          setTimeout(() => {
            setShowAlertForVehicleType("");
          }, 2000);
        }, 1000);
      })
      .catch((err) => {
        setShowAlertForVehicleType("error");
        setTimeout(() => {
          setShowAlertForVehicleType("");
        }, 3000);
      });
  };

  const handleAddVehicleType = () => {
    if (
      vehicleTypeInput.trim() &&
      !newVehicleTypes.includes(vehicleTypeInput)
    ) {
      setNewVehicleTypes((prev) => [...prev, vehicleTypeInput.trim()]);
      setVehicleTypeInput("");
    }
  };

  const handleDeleteVehicleTypeChip = (chipToDelete) => {
    setNewVehicleTypes((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        scroll="paper"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {initialData?.vehicle_id ? 'Edit' : 'Create'} Vehicle
        </DialogTitle>
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ height: "calc(100% - 64px)" }}
        >
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Vehicle Registration Number */}
              <Grid item xs={12}>
                <Controller
                  name="vehicle_registration_number"
                  control={control}
                  rules={{
                    required: "Vehicle Registration Number is required",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Vehicle Registration Number"
                      fullWidth
                      error={!!errors.vehicle_registration_number}
                    />
                  )}
                />
              </Grid>

              {/* Vehicle Owner */}
              <Grid item xs={12}>
                <Controller
                  name="vehicle_owner"
                  control={control}
                  rules={{ required: "Vehicle Owner is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Vehicle Owner"
                      fullWidth
                      error={!!errors.vehicle_owner}
                    />
                  )}
                />
              </Grid>

              {/* Vehicle Type */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Controller
                    name="vehicle_type_id"
                    control={control}
                    rules={{ required: "Vehicle Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Vehicle Type"
                        error={!!errors.vehicle_type_id}
                      >
                        {vehicleTypes.map((type) => (
                          <MenuItem key={type.vehicle_type_id} value={type.vehicle_type_id}>
                            {type.vehicle_type}
                          </MenuItem>
                        ))}
                        <MenuItem
                          value=""
                          onClick={() => setIsVehicleTypeModalVisible(true)}
                        >
                          <em>Add New Vehicle Type</em>
                        </MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Manufacturing Date */}
              <Grid item xs={12}>
                <Controller
                  name="manufacturing_date"
                  control={control}
                  rules={{
                    required: "Manufacturing Date is required",
                    validate: (value) =>
                      dayjs(value).isBefore(dayjs()) ||
                      "Date must be in the past",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Manufacturing Date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={!!errors.manufacturing_date}
                      helperText={errors.manufacturing_date?.message}
                    />
                  )}
                />
              </Grid>

              {/* Insurance Expiry Date */}
              <Grid item xs={12}>
                <Controller
                  name="insurance_expiry_date"
                  control={control}
                  rules={{
                    required: "Insurance Expiry Date is required",
                    validate: (value) =>
                      dayjs(value).isAfter(dayjs()) ||
                      "Date must be in the future",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Insurance Expiry Date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={!!errors.insurance_expiry_date}
                      helperText={errors.insurance_expiry_date?.message}
                    />
                  )}
                />
              </Grid>

              {/* Pollution Expiry Date */}
              <Grid item xs={12}>
                <Controller
                  name="pollution_expiry_date"
                  control={control}
                  rules={{
                    required: "Pollution Expiry Date is required",
                    validate: (value) =>
                      dayjs(value).isAfter(dayjs()) ||
                      "Date must be in the future",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="date"
                      label="Pollution Expiry Date"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      error={!!errors.pollution_expiry_date}
                      helperText={errors.pollution_expiry_date?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" type="reset" onClick={() => reset()}>
              Reset
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
      {isVehicleTypeModalVisible && (
        <Dialog
          open={isVehicleTypeModalVisible}
          onClose={handleVehicleTypeModalClose}
          minWidth="sm"
          fullWidth
        >
          <DialogTitle>Create Vehicle Type</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                marginBottom: 2,
              }}
            >
              {newVehicleTypes.map((type, index) => (
                <Chip
                  key={index}
                  label={type}
                  onDelete={() => handleDeleteVehicleTypeChip(type)}
                  color="primary"
                />
              ))}
            </Box>
            <TextField
              label="Add Vehicle Type"
              fullWidth
              value={vehicleTypeInput}
              error={vehicleTypes?.some(
                (type) =>
                  type.vehicle_type.toLowerCase() ===
                  vehicleTypeInput.trim().toLowerCase()
              )}
              helperText={
                vehicleTypes?.some(
                  (type) =>
                    type.vehicle_type.toLowerCase() ===
                    vehicleTypeInput.trim().toLowerCase()
                )
                  ? "The vehicle type you entered already exists."
                  : ""
              }
              onChange={(e) => setVehicleTypeInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !vehicleTypes?.some(
                    (type) =>
                      type.vehicle_type.toLowerCase() ===
                      vehicleTypeInput.trim().toLowerCase()
                  )
                ) {
                  handleAddVehicleType();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVehicleTypeModalClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSaveVehicleTypes}
              disabled={newVehicleTypes.length === 0}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `Vehicle updation ${showAlert === "success" ? "succeeded" : "failed"
            }.`,
        })
      }

      {showAlertForVehicleType &&
        showAlertMessage({
          open: true,
          alertFor: showAlertForVehicleType,
          message: `Vehicle type creation ${showAlertForVehicleType === "success" ? "succeeded" : "failed"
            }.`,
        })
      }

    </React.Fragment>
  );
};

export default CreateVehicle;
