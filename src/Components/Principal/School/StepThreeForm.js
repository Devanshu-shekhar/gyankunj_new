import React from "react";
import { Grid, TextField, Typography, Box } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import Dropzone from "react-dropzone";

const StepThreeForm = ({ control, setValue }) => {
  // Watch image_list to show preview of uploaded files
  const imageList = useWatch({ control, name: "image_list" }) || [];

  const handleFileUpload = (files) => {
    const readers = [];

    files.forEach((file) => {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              file_name: file.name,
              mime_type: file.type,
              data: reader.result.split(",")[1], // strip base64 prefix
            });
          };
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readers).then((newFiles) => {
      setValue("image_list", [...imageList, ...newFiles], { shouldValidate: true });
    });
  };

  return (
    <Grid container spacing={2}>
      {/* Event Name */}
      <Grid item xs={12}>
        <Controller
          name="event_name"
          control={control}
          rules={{ required: "Event Name is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Event Name"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      {/* Dropzone */}
      <Grid item xs={12}>
        <Typography variant="subtitle1">Upload Event Images</Typography>
        <Dropzone onDrop={handleFileUpload} accept={{ "image/*": [] }} multiple>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              style={{
                border: "1px dashed #1976d2",
                padding: 16,
                cursor: "pointer",
                borderRadius: 8,
                background: "#f9f9f9",
                textAlign: "center",
              }}
            >
              <input {...getInputProps()} />
              Drag & drop or click to upload multiple images
            </div>
          )}
        </Dropzone>
      </Grid>

      {/* Uploaded File Preview */}
      {imageList.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Files:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {imageList.map((img, index) => (
              <Box
                key={index}
                sx={{
                  width: 100,
                  textAlign: "center",
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  padding: 1,
                  background: "#fff",
                }}
              >
                <img
                  src={`data:${img.mime_type};base64,${img.data}`}
                  alt={img.file_name}
                  style={{ width: "100%", height: 60, objectFit: "cover", borderRadius: 4 }}
                />
                <Typography variant="caption" noWrap className="text-truncate d-block">
                  {img.file_name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default StepThreeForm;
