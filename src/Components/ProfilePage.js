import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getUsersList } from "../ApiClient";
import PaFeedback from "./Parent/PaFeedback";
import BackButton from "../SharedComponents/BackButton";

const ProfileInfoField = ({ label, value }) => (
  <Grid item xs={12} md={6} display="flex" justifyContent="space-between">
    <Typography variant="body1" color="textSecondary">
      {label}:
    </Typography>
    <Typography variant="body1">{value || "N/A"}</Typography>
  </Grid>
);

const ProfilePage = () => {
  const { userId, roleId } = useParams(); // Extract userId from query parameters
  const [userDetails, setUserDetails] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(false);

  const roleNameById = {
    1: "Admin",
    2: "Principal",
    3: "Teacher",
    4: "Student",
    5: "Parent",
    6: "Non_Teaching_Staff",
  };

  const fetchEmployeeDetails = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const { data } = await getUsersList({
        user_ids: [userId],
        role_id: parseInt(roleId),
      });
      setUserDetails(data?.user_data?.[0] || {});
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (userId && roleId) {
      fetchEmployeeDetails();
    }
  }, [userId, roleId]);

  const userProfileFields = [
    { label: "Name", value: userDetails?.name },
    { label: "Employee Code", value: userDetails?.user_id },
    { label: "Phone", value: userDetails?.phone_number },
    { label: "Email", value: userDetails?.email_id },
    { label: "Date of Birth", value: userDetails?.date_of_birth },
    { label: "Date of Joining", value: userDetails?.date_of_joining },
    { label: "Gender", value: userDetails?.gender },
    { label: "Designation", value: roleNameById[roleId] },
    { label: "Active", value: userDetails?.is_active ? "Yes" : "No" },
    { label: "Married", value: userDetails?.is_married ? "Yes" : "No" },
    { label: "Spouse's Name", value: userDetails?.spouse_name },
    { label: "Father's Name", value: userDetails?.fathers_name },
    { label: "PAN Number", value: userDetails?.pan_card },
    { label: "Aadhaar Number", value: userDetails?.aadhar_number },
    { label: "Bank Account", value: userDetails?.bank_account_number },
    { label: "Salary Scale", value: userDetails?.salary_scale },
    {
      label: "Highest Qualification",
      value: userDetails?.highest_qualification,
    },
    { label: "Country", value: userDetails?.country },
    { label: "License Number", value: userDetails?.license_number },
    { label: "License Expiry Date", value: userDetails?.license_expiry_date },
    { label: "Address", value: userDetails?.address },
  ];

  return (
    <>
      <BackButton />
      <Card className="bg-body-tertiary rounded-4 mb-5 mt-2">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Details
          </Typography>
          <hr />
          {loadingProfile ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : userDetails ? (
            <Grid container spacing={2}>
              {userProfileFields.map(({ label, value }) => (
                <ProfileInfoField key={label} label={label} value={value} />
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary" align="center">
              Profile data not available.
            </Typography>
          )}
        </CardContent>
      </Card>
      <PaFeedback isComingFromProfile={true} />  
    </>
  );
};

export default ProfilePage;
