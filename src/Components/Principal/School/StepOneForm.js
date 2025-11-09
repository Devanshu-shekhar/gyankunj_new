import React from "react";
import { Grid, TextField, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import Dropzone from "react-dropzone";

const StepOneForm = ({ control, setValue }) => {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB standard limit

  // Convert uploaded file to base64 with validation
  const handleFileUpload = (file, fieldName) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValue(fieldName, {
        file_name: file.name,
        mime_type: file.type,
        data: reader.result.split(",")[1],
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Grid container spacing={2}>
      {/* School Name */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="school_name"
          control={control}
          rules={{ required: "School Name is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="School Name"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Tagline */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="tagline"
          control={control}
          rules={{ required: "Tagline is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Tagline"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Logo Upload */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="logo_info"
          control={control}
          render={({ field }) => (
            <Dropzone
                accept={{ "image/*": [] }}
                maxFiles={1}
                onDrop={(files) => {
                  handleFileUpload(files[0], "logo_info");
                  field.onChange({
                    file_name: files[0].name,
                    mime_type: files[0].type,
                  });
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    style={{
                      border: "2px dashed #1976d2",
                      borderRadius: "8px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "#f9f9f9",
                    }}
                  >
                    <input {...getInputProps()} />
                    {field.value?.data ? (
                      <img
                        src={`data:${field.value.mime_type};base64,${field.value.data}`}
                        alt="Logo Preview"
                        style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 10 }}
                      />
                    ) : null}

                    <p>
                      {field.value?.file_name
                        ? `Uploaded: ${field.value.file_name}`
                        : "Click or Drag & Drop to upload Logo (Max 2MB)"}
                    </p>
                  </div>
                )}
              </Dropzone>
          )}
        />
      </Grid>

      {/* Favicon Upload */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="favicon_info"
          control={control}
          render={({ field }) => (
            <Dropzone
              accept={{ "image/*": [] }}
              maxFiles={1}
              onDrop={(files) => {
                handleFileUpload(files[0], "favicon_info");
                field.onChange({
                  file_name: files[0].name,
                  mime_type: files[0].type,
                });
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  style={{
                    border: "2px dashed #1976d2",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#f9f9f9",
                  }}
                >
                  <input {...getInputProps()} />
                  {field.value?.data ? (
                    <img
                      src={`data:${field.value.mime_type};base64,${field.value.data}`}
                      alt="Logo Preview"
                      style={{ width: 80, height: 80, objectFit: "contain", marginBottom: 10 }}
                    />
                  ) : null}

                  <p>
                    {field.value?.file_name
                      ? `Uploaded: ${field.value.file_name}`
                      : "Click or Drag & Drop to upload Logo (Max 2MB)"}
                  </p>
                </div>
              )}
            </Dropzone>
          )}
        />
      </Grid>

      {/* Colors */}
      <Grid item xs={4}>
        <Controller
          name="primary_color"
          control={control}
          rules={{ required: "Primary color is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="color"
              label="Primary Color"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          name="secondary_color"
          control={control}
          rules={{ required: "Secondary color is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="color"
              label="Secondary Color"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Controller
          name="accent_color"
          control={control}
          rules={{ required: "Accent color is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="color"
              label="Accent Color"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Fonts, Contact Info */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="font_family"
          control={control}
          render={({ field }) => <TextField {...field} label="Font Family" fullWidth />}
        />
      </Grid>

      {/* Language */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="active_language"
          control={control}
          rules={{ required: "Language is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Active Language"
              select
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">Hindi</MenuItem>
            </TextField>
          )}
        />
      </Grid>

      {/* Contact Email */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="contact_email"
          control={control}
          rules={{
            required: "Contact Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email address",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Contact Email"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Contact Phone */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="contact_phone"
          control={control}
          rules={{
            required: "Contact Phone is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter a valid 10-digit phone number",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Contact Phone"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Website */}
      <Grid item xs={12}>
        <Controller
          name="website_url"
          control={control}
          rules={{
            required: "Website URL is required",
            pattern: {
              value:
                /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
              message: "Enter a valid URL",
            },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Website"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Codes */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="school_code"
          control={control}
          rules={{ required: "School Code is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="School Code"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="branch_code"
          control={control}
          rules={{ required: "Branch Code is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Branch Code"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Address */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="address.line1"
          control={control}
          rules={{ required: "Address Line 1 is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Address Line 1"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="address.line2"
          control={control}
          render={({ field }) => <TextField {...field} label="Address Line 2" fullWidth />}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="address.city"
          control={control}
          rules={{ required: "City is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="City"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="address.state"
          control={control}
          rules={{ required: "State is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="State"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="address.postal_code"
          control={control}
          rules={{ required: "Postal Code is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Postal Code"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="address.country"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Country"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Social Links */}
      {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
        <Grid item xs={12} sm={6} key={social}>
          <Controller
            name={`social_links.${social}`}
            control={control}
            rules={{
              pattern: {
                value:
                  /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                message: "Enter a valid URL",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={`${social.charAt(0).toUpperCase()}${social.slice(1)} URL`}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
      ))}

      {/* Terms */}
      <Grid item xs={12}>
        <Controller
          name="fees_terms_and_conditions"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fees Terms & Conditions"
              fullWidth
              multiline
              rows={4}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default StepOneForm;