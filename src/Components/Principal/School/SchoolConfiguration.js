import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";

import StepOneForm from "./StepOneForm";   // ⬅️ Split step content into smaller components
import StepTwoForm from "./StepTwoForm";
import StepThreeForm from "./StepThreeForm";
import { fetchSchoolEventGallery, fetchSchoolOnboarding, fetchSchoolUploadFiles, submitSchoolEventGallery, submitSchoolOnboarding, submitSchoolUploadFiles } from "../../../ApiClient";
import { showAlertMessage } from "../../AlertMessage";

const steps = ["School Onboarding", "Upload Master Sheet"];

const stepOneDefaults = {
  school_name: "",
  tagline: "",
  logo_info: null,
  favicon_info: null,
  primary_color: "#000000",
  secondary_color: "#000000",
  accent_color: "#000000",
  font_family: "",
  active_language: "en",
  contact_email: "",
  contact_phone: "",
  website_url: "",
  school_code: "",
  branch_code: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  },
  social_links: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  },
  fees_terms_and_conditions: "",
};

const SchoolConfigurationStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm();
  const [showAlert, setShowAlert] = useState("");

  // Load data when step changes
  useEffect(() => {
    const fetchStepData = async () => {
      try {
        setLoading(true);
        let response;
        reset(stepOneDefaults);
        if (activeStep === 0) {
          response = await fetchSchoolOnboarding();
          // Merge with defaults so no field is missing
          if(response?.data?.status === "success" && response?.data?.onboarding_data.length > 0) {
            reset(response?.data?.onboarding_data[0] || stepOneDefaults);
          }
        } else if (activeStep === 1) {
          response = await fetchSchoolUploadFiles();
        } else if (activeStep === 2) {
          response = await fetchSchoolEventGallery();
          reset(response?.data || {}); // no defaults
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStepData();
  }, [activeStep, reset]);

  // Save data before moving forward
  const handleNext = async (data) => {
    try {
      setLoading(true);
      let response;

      if (activeStep === 0) {
        response = await submitSchoolOnboarding(data);
        if (response?.data?.status === "success") {
          setActiveStep((prev) => prev + 1);
          setShowAlert("success");
        } else {
          setShowAlert("error");
        }
      } else if (activeStep === 1) {
        // Upload master sheets handled inside StepTwoForm already
        setActiveStep((prev) => prev + 1);
      } else if (activeStep === 2) {
        // ✅ Final step – submit and stop
        response = await submitSchoolEventGallery(data);
        if (response?.data?.status === "success") {
          setShowAlert("success");
          // Optionally disable further actions or close dialog
        } else {
          setShowAlert("error");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setShowAlert("error");
    } finally {
      setLoading(false);
      setTimeout(() => setShowAlert(""), 3000);
    }
  };



  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <StepOneForm control={control} setValue={setValue} />;
      case 1:
        return <StepTwoForm />;
      case 2:
        return <StepThreeForm control={control} setValue={setValue} />;
      default:
        return "Unknown Step";
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          School Configuration
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, i) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading ? (
          <Typography sx={{ mt: 4 }}>Loading...</Typography>
        ) : (
          <form onSubmit={handleSubmit(handleNext)}>
            <Box sx={{ mt: 3 }}>{renderStepContent(activeStep)}</Box>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}   // ⬅️ disable while saving
                >
                  {loading ? "Saving..." : "Finish"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save & Next"}
                </Button>
              )}
            </Box>

          </form>
        )}
      </Box>
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `${steps[activeStep-1]} ${showAlert === "success" ? "succeeded ✅" : "failed ❌"
            }`,
        })}
    </>
  );
};

export default SchoolConfigurationStepper;