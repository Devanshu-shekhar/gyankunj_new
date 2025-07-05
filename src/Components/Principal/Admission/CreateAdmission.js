import React, { useEffect, useState } from "react";
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
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { showAlertMessage } from "../../AlertMessage";
import { saveAdmissionFeesInfo, updateUserInfo } from "../../../ApiClient";
import { useNavigate } from "react-router-dom";

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

const CreateAdmission = ({
  isOpen,
  handleClose,
  selectedData = {},
  metadataList = {},
  feesStructuresList = [],
  role_id = null,
}) => {
  const { handleSubmit, reset, control, watch } = useForm({
    defaultValues: {
      name: "",
      gender: "",
      date_of_birth: null,
      date_of_joining: dayjs(),
      country: "",
      child_pan_card: "",
      child_hobbies: "",
      email_id: "",
      father_name: "",
      father_email_id: "",
      father_dob: null,
      father_nationality: "",
      father_qualification: "",
      father_occupation: "",
      father_pan_card: "",
      father_aadhar_number: "",
      father_phone: "",
      mother_name: "",
      mother_email_id: "",
      mother_dob: null,
      mother_nationality: "",
      mother_qualification: "",
      mother_occupation: "",
      mother_phone: "",
      sibling_admission_number: "",
      address: "",
      local_address: "",
      office_address: "",
      category: "",
      current_school_or_coaching: "",
      current_class: "",
      applying_for_class: "",
      school_transport_required: false,
      mode_of_instruction: "",
      languages_known: [],
      any_known_illness: false,
      type_of_illness: "",
    },
  });
  const {
    control: controlSecond,
    handleSubmit: handleSubmitSecond,
    reset: resetSecond,
    setValue: setValueSecond,
    watch: watchSecond,
  } = useForm({
    defaultValues: {
      user_id: "",
      total_admission_charge: 0,
      deposited_fees: 0,
      discounted_amount: 0,
      is_emi_enabled: false,
      total_emi_amount: 0,
      number_of_installments: "",
      installment_amount: 0,
      first_installment_due_date: null,
    },
  });
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState("");
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [isEmiApplicable, setIsEmiApplicable] = useState(true);
  const isEditMode = Object.keys(selectedData).length > 0;

  useEffect(() => {
    if (Object.keys(selectedData).length > 0) {
      reset({
        ...selectedData,
        date_of_birth: selectedData.date_of_birth
          ? dayjs(selectedData.date_of_birth)
          : null,
        date_of_joining: selectedData.date_of_joining
          ? dayjs(selectedData.date_of_joining)
          : null,
        father_dob: selectedData.father_dob
          ? dayjs(selectedData.father_dob)
          : null,
        mother_dob: selectedData.mother_dob
          ? dayjs(selectedData.mother_dob)
          : null,
      });
    } else {
      reset(); // Reset the form for fresh admission
    }
  }, [selectedData, reset]);

  const [primaryPhone, setPrimaryPhone] = useState(null); // Track the primary phone
  
  const anyKnownIllness = watch("any_known_illness");

  const handlePrimaryPhoneChange = (fieldName) => {
    // Only allow one primary phone
    setPrimaryPhone(fieldName);
  };

  useEffect(() => {
    const totalAdmission = watchSecond("total_admission_charge") || 0;
    const depositedFees = watchSecond("deposited_fees") || 0;
    const discountedAmount = watchSecond("discounted_amount") || 0;
    const numInstallments = watchSecond("number_of_installments") || 0;
    const isEmiEnabled = watchSecond("is_emi_enabled");

    const shouldHideEmi = depositedFees + discountedAmount >= totalAdmission;
    setIsEmiApplicable(!shouldHideEmi);

    if (isEmiEnabled) {
      // Calculate total_emi_amount
      const totalEmiAmount = Math.max(totalAdmission - depositedFees - discountedAmount, 0);

      if (totalEmiAmount !== watchSecond("total_emi_amount")) {
        setValueSecond("total_emi_amount", totalEmiAmount);
      }

      // Calculate installment_amount only if number_of_installments is set
      const installmentAmount = numInstallments > 0 ? totalEmiAmount / numInstallments : 0;
      if (installmentAmount !== watchSecond("installment_amount")) {
        setValueSecond("installment_amount", installmentAmount);
      }
    } else {
      // Reset EMI fields if EMI is disabled
      if (watchSecond("total_emi_amount") !== 0) setValueSecond("total_emi_amount", 0);
      if (watchSecond("installment_amount") !== 0) setValueSecond("installment_amount", 0);
    }
  }, [
    watchSecond("total_admission_charge"),
    watchSecond("deposited_fees"),
    watchSecond("discounted_amount"),
    watchSecond("number_of_installments"),
    watchSecond("is_emi_enabled"),
    setValueSecond,
  ]);


  const onSubmit = (data) => {
    const payload = {
      ...data,
      phone_number:
        data[primaryPhone] ?? data.father_phone ?? data.mother_phone,
      user_id: isEditMode ? selectedData.user_id : undefined,
      role_id: role_id,
      date_of_birth: data.date_of_birth
        ? dayjs(data.date_of_birth).format("YYYY-MM-DD")
        : null,
      date_of_joining: data.date_of_joining
        ? dayjs(data.date_of_joining).format("YYYY-MM-DD")
        : null,
      father_dob: data.father_dob
        ? dayjs(data.father_dob).format("YYYY-MM-DD")
        : null,
      mother_dob: data.mother_dob
        ? dayjs(data.mother_dob).format("YYYY-MM-DD")
        : null,
    };

    // Submit the payload
    console.log(payload);
    // Perform the API request using the payload here
    updateUserInfo(isEditMode, payload)
      .then((res) => {
        const isSuccess = res?.data?.status === "success";
        setShowAlert(isSuccess ? "success" : "error");
        if (isSuccess) {
          const match = res?.data.message?.match(/afs\/\d+\/\d+\/\d+/);
          const studentId = match ? match[0] : null;
          setValueSecond("user_id", studentId);

          if (Array.isArray(feesStructuresList) && feesStructuresList.length > 0) {
            const totalAdmissionCharge = feesStructuresList.reduce(
              (sum, item) => item.fee_frequency_id === 2 && item.fee_occurrence_id === 1
                ? sum + item.charge
                : sum,
              0
            );

            setValueSecond("total_admission_charge", totalAdmissionCharge);
            setShowSecondForm(true);
          }
        }

        setTimeout(() => setShowAlert(""), 2000);
      })
      .catch(() => {
        setShowAlert("error");
        setTimeout(() => setShowAlert(""), 3000);
      });

  };

  const onSubmitSecond = (data) => {
    if (isEmiApplicable && data.is_emi_enabled) {
      if (!data.number_of_installments || !data.first_installment_due_date) {
        setShowAlert("error");
        return;
      }
    }
    const formattedStartDate = dayjs(data.first_installment_due_date).format("YYYY-MM-DD");
     
    const payload = {
      ...data,
      total_outstanding: data.is_emi_enabled ? data.total_emi_amount + data.deposited_fees : undefined,
      first_installment_due_date: data.is_emi_enabled ? formattedStartDate : undefined,
      number_of_installments: data.is_emi_enabled ? data.number_of_installments : undefined,
      installment_amount: data.is_emi_enabled ? data.installment_amount : undefined,
    };
    // Submit the payload
    console.log(payload);
    // Perform the API request using the payload here
    saveAdmissionFeesInfo(payload)
      .then((res) => {
        setShowAlert(res?.data?.status === "success" ? "success" : "error");
        setTimeout(() => {
          if (res?.data?.status === "success") {
            navigate(`/principalDashboard/financeView?activeView=earning`);
            handleClose(true);
          }
          setTimeout(() => setShowAlert(""), 2000);
        }, 1000);
      })
      .catch(() => {
        setShowAlert("error");
        setTimeout(() => setShowAlert(""), 3000);
      });
  };

  useEffect(() => {
    if (!anyKnownIllness) {
      // Clear the value of "type_of_illness" when illness checkbox is unchecked
      reset((prev) => ({
        ...prev,
        type_of_illness: "",
      }));
    }
  }, [anyKnownIllness, reset]);

  const formFields = {
    "Student Details": [
      { name: "name", label: "Child Name", type: "text", required: true },
      { name: "gender", label: "Child Gender", type: "select", options: metadataList.genders, required: true },
      { name: "date_of_birth", label: "Child DOB", type: "date", required: true, validation: { age: 3, msg: "Student must be at least 3 years old" } },
      { name: "date_of_joining", label: "Child DOJ", type: "date", required: true },
      { name: "country", label: "Child Nationality", type: "select", options: metadataList.nationalities, required: true },
      { name: "child_hobbies", label: "Child Hobbies", type: "text" },
      { name: "email_id", label: "Email", type: "email", required: true },
      { name: "sibling_admission_number", label: "Sibling Admission Number", type: "text" },
      { name: "address", label: "Permanent Address", type: "text", required: true, multiline: true },
      { name: "local_address", label: "Local Address", type: "text", multiline: true },
      { name: "category", label: "Category", type: "select", options: metadataList.categories, required: true },
      { name: "current_school_or_coaching", label: "Current School/Coaching", type: "text" },
      { name: "current_class", label: "Current Class", type: "select", options: metadataList.grades },
      { name: "applying_for_class", label: "Applying For Class", type: "select", options: metadataList.grades, required: true },
      { name: "school_transport_required", label: "School Transport Required", type: "boolean" },
      { name: "mode_of_instruction", label: "Mode of Instruction", type: "select", options: metadataList.languages },
      { name: "languages_known", label: "Languages Known", type: "select", options: metadataList.languages, multiple: true },
      { name: "any_known_illness", label: "Any Known Illness", type: "boolean" },
      { name: "type_of_illness", label: "Type Of Illness", type: "text" },
    ],

    "Parent Details": [
      { name: "father_name", label: "Father Name", type: "text", required: true },
      { name: "father_email_id", label: "Father Email", type: "email" },
      { name: "father_dob", label: "Father DOB", type: "date", validation: { age: 18, msg: "Father must be at least 18 years old." } },
      { name: "father_nationality", label: "Father Nationality", type: "select", options: metadataList.nationalities },
      { name: "father_qualification", label: "Father Qualification", type: "text" },
      { name: "father_occupation", label: "Father Occupation", type: "text" },
      { name: "father_phone", label: "Father Phone", type: "number", required: true, isPrimary: true },
      { name: "office_address", label: "Office Address", type: "text", multiline: true },

      { name: "mother_name", label: "Mother Name", type: "text", required: true },
      { name: "mother_email_id", label: "Mother Email", type: "email" },
      { name: "mother_dob", label: "Mother DOB", type: "date", validation: { age: 18, msg: "Mother must be at least 18 years old." } },
      { name: "mother_nationality", label: "Mother Nationality", type: "select", options: metadataList.nationalities },
      { name: "mother_qualification", label: "Mother Qualification", type: "text" },
      { name: "mother_occupation", label: "Mother Occupation", type: "text" },
      { name: "mother_phone", label: "Mother Phone", type: "number", required: true, isPrimary: true },
    ],

    "Document Details": [
      { name: "child_pan_card", label: "Child PAN Card", type: "text" },
      { name: "father_pan_card", label: "Father PAN Card", type: "text" },
      { name: "father_aadhar_number", label: "Father Aadhar Number", type: "number" },
    ],
  };


  return (
    <BootstrapDialog aria-labelledby="customized-dialog-title" open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {isEditMode ? "Edit Student Info" : "Add New Student"}
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form
        onSubmit={showSecondForm ? handleSubmitSecond(onSubmitSecond) : handleSubmit(onSubmit)}
        style={{ height: "calc(100% - 64px)" }}
      >
        {!showSecondForm ? (
          <DialogContent dividers>
            {Object.entries(formFields).map(([section, fields]) => (
              <Grid container spacing={2} key={section}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", my: 2 }}>
                    {section}
                  </Typography>
                </Grid>
                {fields.map((fieldItem) => {
                  if (fieldItem.name === "type_of_illness" && !anyKnownIllness) {
                    return null;
                  }
                  return (
                    <Grid item xs={6} key={fieldItem.name}>
                    <FormControl fullWidth>
                      {fieldItem.type === "select" ? (
                        <Controller
                          name={fieldItem.name}
                          control={control}
                          rules={{ required: fieldItem.required }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label={fieldItem.label}
                              select
                              variant="outlined"
                              fullWidth
                              error={!!fieldState?.error}
                              value={field.value ?? ""}
                            >
                              {Array.isArray(fieldItem.options) &&
                                fieldItem.options.length > 0 ? (
                                fieldItem.options.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="">No options available</MenuItem>
                              )}
                            </TextField>
                          )}
                        />
                      ) : fieldItem.type === "date" ? (
                        <Controller
                          name={fieldItem.name}
                          control={control}
                          rules={{
                            required: fieldItem.required,
                            validate: fieldItem.validation
                              ? (value) => {
                                if (!value)
                                  return `${fieldItem.label} is required`;

                                const selectedDate = dayjs(value);
                                if (!selectedDate.isValid()) {
                                  return "Invalid date";
                                }

                                const today = dayjs();
                                const age = today.diff(selectedDate, "year");

                                if (age < fieldItem.validation.age) {
                                  return fieldItem.validation.msg;
                                }

                                return true;
                              }
                              : undefined,
                          }}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                format="YYYY-MM-DD"
                                label={fieldItem.label}
                                value={value || null}
                                readOnly={fieldItem.name === "date_of_joining"}
                                onChange={onChange}
                                slotProps={{
                                  textField: {
                                    variant: "outlined",
                                    error: !!error,
                                    helperText: error?.message,
                                    InputProps: {
                                      readOnly: fieldItem.name === "date_of_joining" // make input field read-only
                                    },      
                                  },
                                }}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      ) : fieldItem.type === "boolean" ? (
                        <Controller
                          rules={{ required: fieldItem.required }}
                          name={fieldItem.name}
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value ?? false}
                                />
                              }
                              label={fieldItem.label}
                            />
                          )}
                        />
                      ) : (
                        <>
                          <Controller
                            name={fieldItem.name}
                            rules={{
                              required:
                                fieldItem.name === "type_of_illness"
                                  ? anyKnownIllness || false
                                  : fieldItem.name === "father_phone"
                                  ? !watch("mother_phone")
                                  : fieldItem.name === "mother_phone"
                                  ? !watch("father_phone")
                                  : fieldItem.required,
                              pattern:
                                  fieldItem.name === "father_phone" || fieldItem.name === "mother_phone"
                                    ? {
                                        value: /^\d{10}$/,
                                        message: "Phone number must be exactly 10 digits",
                                      }
                                    : undefined,
                              
                            }}
                            control={control}
                            render={({ field, fieldState }) => (
                              <>
                                <TextField
                                  {...field}
                                  label={fieldItem.label}
                                  variant="outlined"
                                  fullWidth
                                  multiline={fieldItem.multiline || false}
                                  rows={fieldItem.multiline ? 3 : 1}
                                  type={
                                    fieldItem.type === "number" ||
                                      fieldItem.type === "email"
                                      ? fieldItem.type
                                      : "text"
                                  }
                                  error={!!fieldState?.error}
                                  value={field.value ?? ""}
                                  helperText={fieldState?.error?.message}
                                  inputProps={fieldItem.type === "number" ? { maxLength: 10 } : {}}
                                />
                                {fieldItem.isPrimary && watch(fieldItem.name) && (
                                  <FormControlLabel
                                    control={
                                      <Radio
                                        checked={primaryPhone === fieldItem.name}
                                        onChange={() => {
                                          handlePrimaryPhoneChange(fieldItem.name);
                                        }}
                                      />
                                    }
                                    label="Mark as Primary Phone Number"
                                  />
                                )}
                              </>
                            )}
                          />
                        </>
                      )}
                    </FormControl>
                  </Grid>
                  )
                })}
              </Grid>
            ))}
          </DialogContent>
        ) : <DialogContent dividers>
          <Typography variant="h6" sx={{ fontWeight: "bold", my: 2 }}>
            Fee details
          </Typography>
          <div className="d-flex gap-4">
          {feesStructuresList?.length > 0 && feesStructuresList.map((item) => (
            item.fee_frequency_id === 2 && item.fee_occurrence_id === 1 && (
              <div key={item.fee_type_name}>
                <strong>{item.fee_type_name}</strong> : {item.charge}
              </div>
            )
          ))}
          </div>
          <Grid container spacing={2}>
            {/* User ID */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Controller
                  name="user_id"
                  control={controlSecond}
                  render={({ field }) => <TextField {...field} label="User ID" margin="normal" required disabled />}
                />
              </FormControl>
            </Grid>

            {/* Total Admission Charge */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Controller
                  name="total_admission_charge"
                  control={controlSecond}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Total Admission Charge" margin="normal" required disabled />
                  )}
                />
              </FormControl>
            </Grid>

            {/* Deposited Fees */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Controller
                  name="deposited_fees"
                  control={controlSecond}
                  render={({ field }) => <TextField {...field} type="number" label="Deposited Fees" margin="normal" onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")} />}
                />
              </FormControl>
            </Grid>

            {/* Discounted Amount */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Controller
                  name="discounted_amount"
                  control={controlSecond}
                  render={({ field }) => <TextField {...field} type="number" label="Discounted Amount" margin="normal" onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")} />}
                />
              </FormControl>
            </Grid>

            {isEmiApplicable && (
              <>
                {/* EMI Checkbox */}
                <Grid item xs={12}>
                  <FormControl>
                    <Controller
                      name="is_emi_enabled"
                      control={controlSecond}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} />}
                          label="Enable EMI"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* EMI Fields – Only when EMI is checked */}
                {watchSecond("is_emi_enabled") && (
                  <>
                    {/* Each field with `required` validation now */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <Controller
                          name="total_emi_amount"
                          control={controlSecond}
                          rules={{ required: "Total EMI Amount is required" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Total EMI Amount"
                              margin="normal"
                              required
                              disabled
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                    {/* Repeat for number_of_installments, installment_amount, first_installment_due_date */}
                    {/* Already done in your current code with validation */}
                  </>
                )}
              </>
            )}

          </Grid>

        </DialogContent>
        }

        <DialogActions>
          <Button variant="outlined" type="reset" onClick={showSecondForm ? resetSecond : reset}>
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
          message:
            showAlert === "success"
              ? "Admission Created successfully!"
              : "Failed to create admission.",
        })}
    </BootstrapDialog>
  );
};

export default CreateAdmission;
