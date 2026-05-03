import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { showAlertMessage } from "../../AlertMessage";
import {
  fetchPaymentModes,
  makeDepositPayment,
  saveAdmissionFeesInfo,
  updateUserInfo,
} from "../../../ApiClient";
import dayjs from "dayjs";
import StudentInfoForm from "./StudentInfoForm";
import FeeDetailsForm from "./FeeDetailsForm";
import BackButton from "../../../SharedComponents/BackButton";
import CollectDepositForm from "./CollectDepositForm";

const steps = ["Personal Info", "Fees Details", "Collect Deposit"];

const AdmissionStepperPage = () => {
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [showAlert, setShowAlert] = useState("");
  const navigate = useNavigate();
  const [paymentModes, setPaymentModes] = useState([]);

  const { selectedUserDetails, metadataList, feesStructuresList, role_id } = useMemo(() => {
    let selected = {};
    let metadata = {};
    let fees = [];
    let role = null;

    const fromStorage = localStorage.getItem("admission_metadata");
    if (fromStorage) {
      try {
        const parsed = JSON.parse(fromStorage);
        selected = parsed.selectedUserDetails || {};
        metadata = parsed.metadataList || {};
        fees = parsed.feesStructuresList || [];
        role = parsed.role_id || null;
      } catch (err) {
        console.error("Failed to parse admission_metadata from localStorage", err);
      }
    }

    return {
      selectedUserDetails: selected,
      metadataList: metadata,
      feesStructuresList: fees,
      role_id: role,
    };
  }, []);

  useEffect(() => {
    fetchPaymentModesList();
  }, []);

  const fetchPaymentModesList = async () => {
    try {
      const response = await fetchPaymentModes();
      setPaymentModes(response.data.payment_modes || []);
    } catch (err) {
      console.error("Failed to fetch payment modes:", err);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
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

  const {
    control: controlThird,
    handleSubmit: handleSubmitThird,
    setValue: setValueThird,
    watch: watchThird,
  } = useForm({
    defaultValues: {
      user_id: "",
      payment_mode_id: "",
      transaction_id: "",
      transaction_amount: 0,
    },
  });

  useEffect(() => {
    // Parse query params
    const queryParams = (() => {
      const rawQuery = location.search.replace("?", "").split(";");
      const parsedParams = {};
      rawQuery.forEach((item) => {
        const [key, value] = item.split("=");
        parsedParams[key] = decodeURIComponent(value);
      });
      return parsedParams;
    })();

    const userId = queryParams.user_id;
    const totalAdmissionCharge = queryParams.total_admission_charge;
    if (userId && totalAdmissionCharge) {
      setValueSecond("user_id", userId);
      setValueThird("user_id", userId);
      setValueSecond("total_admission_charge", totalAdmissionCharge);
      setValueThird("transaction_amount", totalAdmissionCharge);
      setActiveStep(1);
    }
  }, [location.search, setValueSecond, setValueThird]);

  const isEditMode = Object.keys(selectedUserDetails).length > 0;

  // Helper function to normalize form data from API response
  const normalizeFormData = useCallback((data) => {
    if (!data) return null;

    const normalized = { ...data };

    const mapSelectValue = (value, options, allowArray = false) => {
      if (!options || !Array.isArray(options) || options.length === 0) {
        return value;
      }

      const normalizeSingle = (incoming) => {
        if (incoming === null || incoming === undefined || incoming === "") {
          return "";
        }

        const stringValue = String(incoming).trim();
        const matchById = options.find((option) => String(option.id) === stringValue);
        if (matchById) return matchById.id;

        const matchByName = options.find((option) => String(option.name).trim().toLowerCase() === stringValue.toLowerCase());
        if (matchByName) return matchByName.id;

        return incoming;
      };

      if (allowArray) {
        if (!Array.isArray(value)) {
          return [];
        }
        return value.map(normalizeSingle).filter((item) => item !== "" && item !== null && item !== undefined);
      }

      return normalizeSingle(value);
    };

    // Normalize select fields with metadata options
    normalized.gender = mapSelectValue(normalized.gender, metadataList.genders);
    normalized.country = mapSelectValue(normalized.country, metadataList.nationalities);
    normalized.category = mapSelectValue(normalized.category, metadataList.categories);
    normalized.current_class = mapSelectValue(normalized.current_class, metadataList.grades);
    normalized.applying_for_class = mapSelectValue(normalized.applying_for_class, metadataList.grades);
    normalized.mode_of_instruction = mapSelectValue(normalized.mode_of_instruction, metadataList.languages);
    normalized.father_nationality = mapSelectValue(normalized.father_nationality, metadataList.nationalities);
    normalized.mother_nationality = mapSelectValue(normalized.mother_nationality, metadataList.nationalities);

    // Parse languages_known from string format "{6,7}" to array [6, 7]
    if (normalized.languages_known) {
      if (typeof normalized.languages_known === "string") {
        const cleaned = normalized.languages_known.replace(/[{}]/g, "").trim();
        if (cleaned) {
          normalized.languages_known = cleaned.split(",").map((val) => {
            const num = parseInt(val.trim(), 10);
            return isNaN(num) ? val.trim() : num;
          });
        } else {
          normalized.languages_known = [];
        }
      } else if (!Array.isArray(normalized.languages_known)) {
        normalized.languages_known = [];
      }
    } else {
      normalized.languages_known = [];
    }

    // Convert string boolean values to actual booleans
    const booleanFields = ["any_known_illness", "school_transport_required"];
    booleanFields.forEach((field) => {
      if (field in normalized) {
        const value = normalized[field];
        if (typeof value === "string") {
          normalized[field] = value.toLowerCase() === "true";
        } else if (value === null || value === undefined) {
          normalized[field] = false;
        }
      }
    });

    // Ensure numeric fields are numbers
    const numericStringShouldBeFields = ["father_aadhar_number", "father_phone", "mother_phone"];
    numericStringShouldBeFields.forEach((field) => {
      if (field in normalized && normalized[field]) {
        if (typeof normalized[field] === "string") {
          const num = parseInt(normalized[field], 10);
          normalized[field] = isNaN(num) ? normalized[field] : num;
        }
      }
    });

    return normalized;
  }, [metadataList]);

  useEffect(() => {
    if (isEditMode && selectedUserDetails?.user_id) {
      const normalizedData = normalizeFormData(selectedUserDetails);
      reset({
        ...normalizedData,
        date_of_birth: normalizedData.date_of_birth ? dayjs(normalizedData.date_of_birth) : null,
        date_of_joining: normalizedData.date_of_joining ? dayjs(normalizedData.date_of_joining) : null,
        father_dob: normalizedData.father_dob ? dayjs(normalizedData.father_dob) : null,
        mother_dob: normalizedData.mother_dob ? dayjs(normalizedData.mother_dob) : null,
      });
    }
  }, [selectedUserDetails, isEditMode, reset, normalizeFormData]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      phone_number: data.father_phone || data.mother_phone,
      user_id: isEditMode ? selectedUserDetails.user_id : undefined,
      role_id: role_id,
      date_of_birth: data.date_of_birth ? dayjs(data.date_of_birth).format("YYYY-MM-DD") : null,
      date_of_joining: data.date_of_joining ? dayjs(data.date_of_joining).format("YYYY-MM-DD") : null,
      father_dob: data.father_dob ? dayjs(data.father_dob).format("YYYY-MM-DD") : null,
      mother_dob: data.mother_dob ? dayjs(data.mother_dob).format("YYYY-MM-DD") : null,
    };

    updateUserInfo(isEditMode, payload)
      .then((res) => {
        const isSuccess = res?.data?.status === "success";
        setShowAlert(isSuccess ? "success" : "error");

        if (isSuccess) {
          const match = res?.data.message?.match(/afs\/\d+\/\d+\/\d+/);
          const studentId = match ? match[0] : null;
          setValueSecond("user_id", studentId);
          setValueThird("user_id", studentId);

          const totalAdmissionCharge = feesStructuresList.reduce(
            (sum, item) =>
              item.fee_frequency_id === 2 && item.fee_occurrence_id === 1
                ? sum + item.charge
                : sum,
            0
          );

          setValueSecond("total_admission_charge", totalAdmissionCharge);
          setValueThird("transaction_amount", totalAdmissionCharge);
          setActiveStep(1);
          localStorage.removeItem("admission_metadata");
        }

        setTimeout(() => setShowAlert(""), 2000);
      })
      .catch(() => {
        setShowAlert("error");
        setTimeout(() => setShowAlert(""), 3000);
      });
  };

  const onSubmitSecond = (data) => {
    const formattedStartDate = dayjs(data.first_installment_due_date).format("YYYY-MM-DD");

    const payload = {
      ...data,
      total_outstanding: data.is_emi_enabled ? data.total_emi_amount + data.deposited_fees : undefined,
      first_installment_due_date: data.is_emi_enabled ? formattedStartDate : undefined,
      number_of_installments: data.is_emi_enabled ? data.number_of_installments : undefined,
      installment_amount: data.is_emi_enabled ? data.installment_amount : undefined,
    };

    saveAdmissionFeesInfo(payload)
      .then((res) => {
        setShowAlert(res?.data?.status === "success" ? "success" : "error");
        setTimeout(() => {
          if (res?.data?.status === "success") {
            setActiveStep(2);
          }
          setShowAlert("");
        }, 1500);
      })
      .catch(() => {
        setShowAlert("error");
        setTimeout(() => setShowAlert(""), 3000);
      });
  };

  const onSubmitThird = (data) => {
    const payload = {
      user_id: data.user_id,
      payment_mode_id: data.payment_mode_id,
      transaction_id: data.transaction_id,
      transaction_amount: data.transaction_amount,
    };

    makeDepositPayment(payload)
      .then((res) => {
        setShowAlert(res?.data?.status === "success" ? "success" : "error");
        setTimeout(() => {
          if (res?.data?.status === "success") {
            navigate(`/principalDashboard/financeView?activeView=earning`);
          }
          setShowAlert("");
        }, 1500);
      })
      .catch(() => {
        setShowAlert("error");
        setTimeout(() => setShowAlert(""), 3000);
      });
  };

  return (
    <Container>
      <div className="mb-3">
        <BackButton />
      </div>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {isEditMode ? "Edit Admission" : "Create New Admission"}
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form
          onSubmit={
            activeStep === 0
              ? handleSubmit(onSubmit)
              : activeStep === 1
              ? handleSubmitSecond(onSubmitSecond)
              : handleSubmitThird(onSubmitThird)
          }
        >
          <Box mt={3}>
            {activeStep === 0 ? (
              <StudentInfoForm
                control={control}
                metadataList={metadataList}
                watch={watch}
                reset={reset}
                setValue={setValue}
              />
            ) : activeStep === 1 ? (
              <FeeDetailsForm
                control={controlSecond}
                watch={watchSecond}
                setValue={setValueSecond}
                feesStructuresList={feesStructuresList}
              />
            ) : (
              <CollectDepositForm
                control={controlThird}
                watch={watchThird}
                setValue={setValueThird}
                depositAmount={watchSecond("deposited_fees")}
                paymentModes={paymentModes || []}
              />
            )}
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between">
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained">
                Submit
              </Button>
            ) : (
              <Button type="submit" variant="contained">
                Next
              </Button>
            )}
          </Box>
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
      </Paper>
    </Container>
  );
};

export default AdmissionStepperPage;
