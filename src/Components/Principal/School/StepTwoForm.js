import React from "react";
import { Grid, Typography } from "@mui/material";
import Dropzone from "react-dropzone";

const masterFiles = [
  "category_master",
  "chapter_master",
  "grade_master",
  "holiday_observation",
  "period_master",
  "section_master",
  "role_master",
  "subject_master",
];

const StepTwoForm = ({ setValue }) => {
  const handleFileUpload = (file, fieldName) => {
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
      {masterFiles.map((field) => (
        <Grid item xs={12} sm={6} key={field}>
          <Typography>{field.replace("_", " ").toUpperCase()}</Typography>
          <Dropzone
            onDrop={(files) => handleFileUpload(files[0], field)}
            accept={{
              "application/vnd.ms-excel": [],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} style={{ border: "1px dashed #ccc", padding: 16, cursor: "pointer" }}>
                <input {...getInputProps()} />
                Upload XLSX
              </div>
            )}
          </Dropzone>
        </Grid>
      ))}
    </Grid>
  );
};

export default StepTwoForm;