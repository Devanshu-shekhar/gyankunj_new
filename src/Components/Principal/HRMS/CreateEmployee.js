import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  TextField,
  Grid,
  Button,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { updateUserInfo } from "../../../ApiClient";
import { showAlertMessage } from "../../AlertMessage";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { countries } from "countries-list";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    height: "calc(100% - 53px)",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    maxWidth: "90%",
    width: "75%",
    height: "100%",
    overflow: "hidden",
  },
}));

const CreateEmployee = ({ isOpen, handleClose, selectedData = {} }) => {
  const { handleSubmit, reset, control, watch } = useForm();
  const isEditMode = Object.keys(selectedData).length > 0;
  const countryList = Object.values(countries).map((country) => country.name);
  const [showAlert, setShowAlert] = useState("");
  const designationsList = localStorage.getItem("UserRoles") ? JSON.parse(localStorage.getItem("UserRoles")) : [];
  const isMarried = watch("is_married", false);
  const gendersList = [
    { value: "male", title: "Male" },
    { value: "female", title: "Female" },
    { value: "other", title: "Other" },
  ];

  useEffect(() => {
    if (Object.keys(selectedData).length > 0) {
      const tempSelectedData = {
        ...selectedData,
        date_of_birth: selectedData.date_of_birth ? dayjs(selectedData.date_of_birth) : null,
        date_of_joining: selectedData.date_of_joining ? dayjs(selectedData.date_of_joining) : null,
        license_expiry_date: selectedData.license_expiry_date
          ? dayjs(selectedData.license_expiry_date)
          : null,
      };
      reset(tempSelectedData);
    }
  }, [selectedData, reset]);

  const onSubmit = (data) => {
    // Common fields for both create and edit
    const payload = {
      name: data.name || "",
      phone_number: data.phone_number || null,
      email_id: data.email_id || null,
      date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth).format("YYYY-MM-DD") : null,
      date_of_joining: data.date_of_joining ? dayjs(data.date_of_joining).format("YYYY-MM-DD") : null,
      gender: data.gender || null,
      role_id: data.role_id || null,
      is_active: data.is_active ?? false,
      is_married: data.is_married ?? false,
      highest_qualification: data.highest_qualification || null,
      pan_card: data.pan_card || null,
      aadhar_number: data.aadhar_number || null,
      bank_account_number: data.bank_account_number || null,
      salary_scale: data.salary_scale || null,
      address: data.address || null,
      spouse_name: data.is_married ? data.spouse_name : null,
      fathers_name: !data.is_married ? data.fathers_name : null,
      country: data.country || null,
      license_number: data.license_number || null,
      license_expiry_date: data.license_expiry_date
        ? dayjs(data.license_expiry_date).format("YYYY-MM-DD")
        : null,
    };

    // Additional fields for create operation
    if (isEditMode) {
      payload.user_id = data.user_id || "";
    }

    // Submit the payload
    console.log(payload);
    // Perform the API request using the payload here
    updateUserInfo(isEditMode, payload)
      .then((res) => {
        setShowAlert(res?.data?.status === "success" ? "success" : "error");
        setTimeout(() => {
          handleClose(true);
          setTimeout(() => setShowAlert(""), 2000);
        }, 1000);
      })
      .catch(() => {
        setShowAlert("error");
        setTimeout(() => setShowAlert(""), 3000);
      });
  };

  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {isEditMode ? "Edit Employee Info" : "Add New Employee"}
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: "calc(100% - 64px)" }}
      >
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Employee Name"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            {isEditMode && (
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name="user_id"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        error={!!error}
                        onChange={onChange}
                        value={value || ""}
                        fullWidth
                        label="Employee Code"
                        variant="outlined"
                        placeholder="System-generated value"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}
            {/* Phone with Number Validation */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="phone_number"
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Phone"
                      variant="outlined"
                      type="number"
                      helperText={error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            {/* Email with Validation */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="email_id"
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Email"
                      variant="outlined"
                      helperText={error?.message}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="date_of_birth"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) => {
                      const selectedDate = dayjs(value);
                      const today = dayjs();
                      const age = today.diff(selectedDate, "year");
                      if (!selectedDate.isValid()) {
                        return "Invalid date";
                      }
                      if (age < 18) {
                        return "Employee must be at least 18 years old";
                      }
                      if (selectedDate.isAfter(today)) {
                        return "Date of Birth cannot be in the future";
                      }
                      return true;
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="YYYY-MM-DD"
                        label="Date of birth"
                        value={value || null}
                        onChange={onChange}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="date_of_joining"
                  control={control}
                  rules={{
                    required: true,
                    validate: (value) => {
                      const selectedDate = dayjs(value);
                      const today = dayjs();
                      if (!selectedDate.isValid()) {
                        return "Invalid date";
                      }
                      if (selectedDate.isAfter(today)) {
                        return "Date of Joining cannot be in the future";
                      }
                      return true;
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="YYYY-MM-DD"
                        label="Date of joining"
                        value={value || null}
                        onChange={onChange}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="Gender"
                      onChange={onChange}
                      value={value || ""}
                      error={!!error}
                      select
                      variant="outlined"
                      fullWidth
                    >
                      {gendersList?.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="role_id"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      label="Designation"
                      onChange={onChange}
                      value={value || ""}
                      error={!!error}
                      select
                      variant="outlined"
                      fullWidth
                    >
                     {designationsList?.map((item) =>
                        item.role_name !== 'Parent' && (
                          <MenuItem key={item.role_id} value={item.role_id}>
                            {item.role_name}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Controller
                      name="is_active"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <Checkbox
                          onChange={onChange}
                          checked={!!value}
                          color="primary"
                        />
                      )}
                    />
                  }
                  label="Active"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Controller
                      name="is_married"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <Checkbox
                          onChange={onChange}
                          checked={!!value}
                          color="primary"
                        />
                      )}
                    />
                  }
                  label="Married"
                />
              </FormControl>
            </Grid>
            {isMarried ? (
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name="spouse_name"
                    control={control}
                    rules={{ required: false }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        error={!!error}
                        onChange={onChange}
                        value={value || ""}
                        fullWidth
                        label="Spouse Name"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            ) : (
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name="fathers_name"
                    control={control}
                    rules={{ required: false }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        error={!!error}
                        onChange={onChange}
                        value={value || ""}
                        fullWidth
                        label="Father Name"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="highest_qualification"
                  control={control}
                  rules={{ required: false }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Highest Qualification"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="pan_card"
                  control={control}
                  rules={{ required: false }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Pan Card"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="aadhar_number"
                  control={control}
                  rules={{ required: false }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      type="number"
                      label="Aadhar Number"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="bank_account_number"
                  control={control}
                  rules={{ required: false }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      type="number"
                      label="Bank Account"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="salary_scale"
                  control={control}
                  rules={{ required: false }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Salary Scale"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="license_number"
                  control={control}
                  rules={{ required: false }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="License Number"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="license_expiry_date"
                  control={control}
                  rules={{
                    required: false,
                    validate: (value) => {
                      const selectedDate = dayjs(value);
                      const today = dayjs();
                      if (!selectedDate.isValid()) {
                        return "Invalid date";
                      }
                      if (selectedDate.isBefore(today)) {
                        return "The license expiry date cannot be in the past";
                      }
                      return true;
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="YYYY-MM-DD"
                        label="License Expiry Date"
                        value={value || null}
                        onChange={onChange}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      options={countryList}
                      onChange={(e, newValue) => onChange(newValue)}
                      value={value || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Country"
                          variant="outlined"
                          error={!!error}
                          helperText={error ? error.message : ""}
                          fullWidth
                        />
                      )}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: false }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      label="Address"
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </FormControl>
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
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `The employee ${isEditMode ? "updation" : "creation"} ${
            showAlert === "success" ? "succeeded" : "failed"
          }.`,
        })}
    </BootstrapDialog>
  );
};

export default CreateEmployee;
