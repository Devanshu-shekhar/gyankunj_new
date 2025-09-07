import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { fetchStudentFeeDetails } from "../../../../ApiClient";
import MakePaymentDialog from "./MakePaymentDialog";

const FeeDetails = ({ isParentView = false }) => {
  const [studentId, setStudentId] = useState("");
  const [feeDetails, setFeeDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApiCalled, setIsApiCalled] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  console.log(userInfo)

  // Fetch fee details from the API
  const fetchFeeDetails = async () => {
    try {
      const response = await fetchStudentFeeDetails({
        student_id: studentId,
      });
      if (response?.data?.status === "success") {
        setFeeDetails(response.data.fees_data || null);
      } else {
        setFeeDetails(null);
      }
      setIsApiCalled(true);
    } catch (err) {
      console.error("Failed to fetch fees details:", err);
      setFeeDetails(null);
      setIsApiCalled(true);
    }
  };

  // Open the payment modal
  const handleMakePayment = () => {
    setIsModalVisible(true);
  };

  // Close the payment modal
  const handleModalClose = (isSubmit) => {
    setIsModalVisible(false);
    if (isSubmit) {
      fetchFeeDetails();
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" marginBottom={1}>
        Get Fee Details
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={9}>
          {isParentView ? (
            <FormControl fullWidth>
              <InputLabel>Admission ID</InputLabel>
              <Select
                label="Admission ID"
                onChange={(e) => setStudentId(e.target.value)}
                value={studentId || ""}
              >
                {userInfo?.student_info?.map((item, index) => (
                  <MenuItem key={index} value={item.student_id}>
                    {item.student_name??item.student_id }
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Admission ID"
              placeholder="Type admission id here..."
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              fullWidth
            />
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            color="primary"
            className="py-3"
            onClick={fetchFeeDetails}
            fullWidth
            disabled={!studentId.trim()}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      {feeDetails && (
        <Card sx={{ marginTop: 4, padding: 1 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography marginBottom={1}>
                  <strong>Month:</strong> {feeDetails.month_name}
                </Typography>
                <Typography marginBottom={1}>
                  <strong>Tuition Fee:</strong> {feeDetails.tuition_fee}
                </Typography>
                <Typography marginBottom={1}>
                  <strong>Transportation Fee:</strong>{" "}
                  {feeDetails.transportation_fee}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography marginBottom={1}>
                  <strong>Fines:</strong> {feeDetails.fines}
                </Typography>
                <Typography marginBottom={1}>
                  <strong>Total Outstanding:</strong>{" "}
                  {feeDetails.total_outstanding}
                </Typography>
                <Typography marginBottom={1}>
                  <strong>Due Date:</strong> {feeDetails.due_date}
                </Typography>
              </Grid>
            </Grid>
            <Box marginTop={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleMakePayment}
              >
                Make Payment
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {!feeDetails && isApiCalled && (
        <Typography
          color="error"
          variant="body1"
          align="center"
          sx={{ marginTop: 4 }}
        >
          No details found for the provided Admission ID.
        </Typography>
      )}

      {isModalVisible && (
        <MakePaymentDialog
          isOpen={isModalVisible}
          handleClose={handleModalClose}
          feeDetails={feeDetails}
          isParentView={isParentView}
        />
      )}
    </Box>
  );
};

export default FeeDetails;
