import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const StudentInfoForm = ({ control, metadataList, watch, reset, setValue }) => {
  const anyKnownIllness = watch("any_known_illness");
  const primaryPhone = watch("primary_phone");

  const fatherPhone = watch("father_phone");
  const motherPhone = watch("mother_phone");

  useEffect(() => {
    if (!anyKnownIllness) {
      reset((prev) => ({ ...prev, type_of_illness: "" }));
    }
    setValue("date_of_joining", dayjs().format("YYYY-MM-DD"));
  }, [anyKnownIllness, reset, setValue]);

  const formFields = {
    "Student Details": [
      { name: "name", label: "Child Name", type: "text", required: true },
      { name: "gender", label: "Child Gender", type: "select", options: metadataList.genders, required: true },
      {
        name: "date_of_birth",
        label: "Child DOB",
        type: "date",
        required: true,
        validation: { age: 3, msg: "Student must be at least 3 years old" },
      },
      {
        name: "date_of_joining",
        label: "Child DOJ",
        type: "date",
        required: true,
        readOnly: true,
      },
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
      { name: "any_known_illness", label: "Any Known Illness", type: "boolean", required: !!watch("type_of_illness") },
      { name: "type_of_illness", label: "Type Of Illness", type: "text" },
    ],
    "Parent Details": [
      { name: "father_name", label: "Father Name", type: "text", required: true },
      { name: "father_email_id", label: "Father Email", type: "email" },
      {
        name: "father_dob",
        label: "Father DOB",
        type: "date",
        validation: { age: 18, msg: "Father must be at least 18 years old." }
      },
      { name: "father_nationality", label: "Father Nationality", type: "select", options: metadataList.nationalities },
      { name: "father_qualification", label: "Father Qualification", type: "text" },
      { name: "father_occupation", label: "Father Occupation", type: "text" },
      { name: "father_phone", label: "Father Phone", type: "number", isPrimary: true },
      { name: "office_address", label: "Office Address", type: "text", multiline: true },
      { name: "mother_name", label: "Mother Name", type: "text", required: true },
      { name: "mother_email_id", label: "Mother Email", type: "email" },
      {
        name: "mother_dob",
        label: "Mother DOB",
        type: "date",
        validation: { age: 18, msg: "Mother must be at least 18 years old." }
      },
      { name: "mother_nationality", label: "Mother Nationality", type: "select", options: metadataList.nationalities },
      { name: "mother_qualification", label: "Mother Qualification", type: "text" },
      { name: "mother_occupation", label: "Mother Occupation", type: "text" },
      { name: "mother_phone", label: "Mother Phone", type: "number", isPrimary: true },
    ],
    "Document Details": [
      { name: "child_pan_card", label: "Child PAN Card", type: "text" },
      { name: "father_pan_card", label: "Father PAN Card", type: "text" },
      { name: "father_aadhar_number", label: "Father Aadhar Number", type: "number" },
    ],
  };

  return (
    <>
      {Object.entries(formFields).map(([section, fields]) => (
        <Grid container spacing={2} key={section} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {section}
            </Typography>
          </Grid>
          {fields.map((fieldItem) => {
            if (fieldItem.name === "type_of_illness" && !anyKnownIllness) return null;

            return (
              <Grid item xs={12} sm={6} key={fieldItem.name}>
                <FormControl fullWidth>
                  {fieldItem.name === "languages_known" ? (
                    <Controller
                      name="languages_known"
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={fieldItem.label}
                          variant="outlined"
                          select
                          SelectProps={{
                            multiple: true,
                            renderValue: (selected) => {
                              if (!Array.isArray(selected)) {
                                return "";
                              }
                              return metadataList.languages
                                .filter((option) => selected.includes(option.id))
                                .map((option) => option.name)
                                .join(", ");
                            },
                          }}
                          value={Array.isArray(field?.value) ? field.value : []}
                        
                        >
                          {metadataList.languages.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              <Checkbox checked={field.value?.includes(option.id)} />
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  ) : fieldItem.type === "select" ? (

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
                          error={!!fieldState.error}
                          value={field?.value ?? ""}
                          onChange={(e) =>
                            fieldItem.multiple
                              ? field.onChange(
                                typeof e.target.value === "string"
                                  ? e.target.value.split(",")
                                  : e.target.value
                              )
                              : field.onChange(e.target.value)
                          }
                          SelectProps={fieldItem.multiple ? { multiple: true } : {}}
                        >
                          {Array.isArray(fieldItem.options) && fieldItem.options.length > 0 ? (
                            fieldItem.options.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="">No options</MenuItem>
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
                            if (!value) return `${fieldItem.label} is required`;
                            const age = dayjs().diff(dayjs(value), "year");
                            return age >= fieldItem.validation.age ? true : fieldItem.validation.msg;
                          }
                          : undefined,
                      }}
                      render={({ field, fieldState }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="YYYY-MM-DD"
                            label={fieldItem.label}
                            value={field.value ? dayjs(field.value) : null}
                            onChange={field.onChange}
                            readOnly={fieldItem.readOnly || false}
                            slotProps={{
                              textField: {
                                variant: "outlined",
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  ) : fieldItem.type === "boolean" ? (
                    <Controller
                      name={fieldItem.name}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value ?? false} />}
                          label={fieldItem.label}
                        />
                      )}
                    />
                  ) : (
                    <Controller
                      name={fieldItem.name}
                      control={control}
                      rules={{
                        required:
                          fieldItem.name === "type_of_illness"
                            ? anyKnownIllness && "Type of illness is required"
                            : fieldItem.name === "father_phone"
                              ? !motherPhone && "Father Phone is required if Mother Phone is not provided"
                              : fieldItem.name === "mother_phone"
                                ? !fatherPhone && "Mother Phone is required if Father Phone is not provided"
                                : fieldItem.required,
                        pattern:
                          fieldItem.name.includes("phone")
                            ? {
                              value: /^\d{10}$/,
                              message: "Phone number must be 10 digits",
                            }
                            : undefined,
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <TextField
                            {...field}
                            label={fieldItem.label}
                            variant="outlined"
                            type={fieldItem.type}
                            multiline={fieldItem.multiline || false}
                            rows={fieldItem.multiline ? 3 : 1}
                            error={!!fieldState.error}
                            value={field?.value ?? ""}
                            helperText={fieldState.error?.message}
                            inputProps={{ readOnly: fieldItem.readOnly || false }}
                          />
                          {fieldItem.isPrimary && (
                            <FormControlLabel
                              control={
                                <Radio
                                  checked={primaryPhone === fieldItem.name}
                                  onChange={() => setValue("primary_phone", fieldItem.name)}
                                />
                              }
                              label="Mark as Primary"
                            />
                          )}
                        </>
                      )}
                    />
                  )}
                </FormControl>
              </Grid>
            );
          })}
        </Grid>
      ))}
    </>
  );
};

export default StudentInfoForm;