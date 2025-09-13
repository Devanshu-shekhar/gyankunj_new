import React from "react";
import { Grid, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import Dropzone from "react-dropzone";

const StepThreeForm = ({ control, setValue }) => {
  const handleFileUpload = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setValue("image_list", (prev = []) => [
          ...prev,
          {
            file_name: file.name,
            mime_type: file.type,
            data: reader.result.split(",")[1],
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Controller
          name="event_name"
          control={control}
          render={({ field }) => <TextField {...field} label="Event Name" fullWidth />}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1">Upload Event Images</Typography>
        <Dropzone onDrop={handleFileUpload} accept={{ "image/*": [] }}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={{ border: "1px dashed #ccc", padding: 16, cursor: "pointer" }}>
              <input {...getInputProps()} />
              Drag & drop or click to upload
            </div>
          )}
        </Dropzone>
      </Grid>
    </Grid>
  );
};

export default StepThreeForm;