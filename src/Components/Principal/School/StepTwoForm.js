import React, { useState } from "react";
import { Grid, Typography } from "@mui/material";
import Dropzone from "react-dropzone";
import { submitSchoolUploadFiles } from "../../../ApiClient";
import { showAlertMessage } from "../../AlertMessage";

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

const StepTwoForm = () => {
  const [showAlert, setShowAlert] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState({}); // track filenames per field

  // API call to upload file
  const uploadFileToServer = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("input_file", file);

    try {
      const response = await submitSchoolUploadFiles(formData);

      if (response?.data?.status === "success") {
        setShowAlert("success");
        setUploadedFiles((prev) => ({
          ...prev,
          [fieldName]: file.name,
        }));
      } else {
        setShowAlert("error");
      }
    } catch (error) {
      setShowAlert("error");
    }
  };

  // Handle file selection
  const handleFileUpload = (file, fieldName) => {
    if (!file) return;

    // Allow only .xlsx
    if (!file.name.endsWith(".xlsx")) {
      alert("Only .xlsx files are allowed!");
      return;
    }

    uploadFileToServer(file, fieldName);
  };

  return (
    <>
      <Grid container spacing={2}>
        {masterFiles.map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <Typography fontWeight="bold" gutterBottom>
              {field.replace("_", " ").toUpperCase()}
            </Typography>
            <Dropzone
              accept={{
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
              }}
              multiple={false}
              onDrop={(files) => handleFileUpload(files[0], field)}
            >
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
                  {uploadedFiles[field] ? (
                    <Typography color="green">
                      ✅ Uploaded: {uploadedFiles[field]}
                    </Typography>
                  ) : (
                    "Click or Drag & Drop to upload XLSX"
                  )}
                </div>
              )}
            </Dropzone>
          </Grid>
        ))}
      </Grid>

      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `File uploading ${
            showAlert === "success" ? "succeeded" : "failed"
          }.`,
        })}
    </>
  );
};

export default StepTwoForm;