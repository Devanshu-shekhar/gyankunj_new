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
import axios from "axios";

import StepOneForm from "./StepOneForm";   // ⬅️ Split step content into smaller components
import StepTwoForm from "./StepTwoForm";
import StepThreeForm from "./StepThreeForm";

const steps = ["School Onboarding", "Upload Master Sheet", "Event Gallery"];

const SchoolConfigurationStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm();

  // Load data when step changes
  useEffect(() => {
    const fetchStepData = async () => {
      try {
        setLoading(true);
        let url = "";
        if (activeStep === 0) url = "/api/v1/school/onboarding";
        if (activeStep === 1) url = "/api/v1/school/master-sheets";
        if (activeStep === 2) url = "/api/v1/school/event-gallery";

        const res = await axios.get(url);
        if (res.data) {
          reset(res.data); // ⬅️ prefill form values
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
      let url = "";
      if (activeStep === 0) url = "/api/v1/school/onboarding";
      if (activeStep === 1) url = "/api/v1/school/master-sheets";
      if (activeStep === 2) url = "/api/v1/school/event-gallery";

      await axios.post(url, data); // ⬅️ SAVE API

      // Move to next only after success
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      console.error("Save error:", err);
      alert("Please complete this step before continuing.");
    } finally {
      setLoading(false);
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
        return <StepTwoForm control={control} />;
      case 2:
        return <StepThreeForm control={control} />;
      default:
        return "Unknown Step";
    }
  };

  return (
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
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" color="primary">
                Finish
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary">
                Save & Next
              </Button>
            )}
          </Box>
        </form>
      )}
    </Box>
  );
};

export default SchoolConfigurationStepper;