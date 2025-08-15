import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
  fetchFeesStructuresList, 
  fetchMetadataInfo, 
  getUsersList, 
  deleteUserInfo 
} from "../../../ApiClient";
import { showAlertMessage } from "../../AlertMessage";
import UserCard from "./UserCard";
import AlertDialogSlide from "../HRMS/AlertDialogSlide";
import ClearIcon from "@mui/icons-material/Clear";

const AdmissionView = () => {
  const searchTimeoutRef = useRef(null);
  const [refreshView, setRefreshView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isReadyToCreasteAdmission, setIsReadyToCreasteAdmission] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [metadataList, setMetadataList] = useState({});
  const [feesStructuresList, setFeesStructuresList] = useState([]);
  const designationsList = JSON.parse(localStorage.getItem("UserRoles") || "[]");
  const role_id = designationsList.find((item) => item.role_name === "Student")?.role_id || null;
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const navigate = useNavigate();

  const fetchAndSetFeesStructures = useCallback(async () => {
    try {
      const response = await fetchFeesStructuresList();
      setFeesStructuresList(response?.data?.fees_structure_info || []);
    } catch (err) {
      console.error("Failed to fetch fees structures:", err);
    }
  }, []);

  const fetchMetadataList = useCallback(async () => {
    const payload = {
      "fetch_all_categories": {},
      "fetch_all_languages": {},
      "fetch_all_nationalities": {},
      "fetch_all_genders": {},
      "get_all_grade_details": {}
    }
    try {
      const res = await fetchMetadataInfo(payload);
      const metadata = res?.data?.metadata_info || {};

      // Extract data safely with fallback values
      const {
        fetch_all_categories = {},
        fetch_all_languages = {},
        fetch_all_nationalities = {},
        fetch_all_genders = {},
        get_all_grade_details = {}
      } = metadata;

      const formattedData = {
        categories: fetch_all_categories.category_data?.map(({ category_id, category_value }) => ({
          id: category_id,
          name: category_value
        })) ?? [],

        languages: fetch_all_languages.language_data?.map(({ language_id, language_value }) => ({
          id: language_id,
          name: language_value
        })) ?? [],

        nationalities: fetch_all_nationalities.nationality_data?.map(({ nationality_id, nationality_value }) => ({
          id: nationality_id,
          name: nationality_value
        })) ?? [],

        genders: fetch_all_genders.gender_data?.map(({ gender_id, gender_value }) => ({
          id: gender_id,
          name: gender_value
        })) ?? [],

        grades: get_all_grade_details.grade_details?.grade_details?.map(({ grade_id, grade }) => ({
          id: grade_id,
          name: grade
        })) ?? []
      };

      setMetadataList(formattedData);
    } catch (error) {
      console.error("Failed to fetch metadata list:", error);
    }
  }, []); // Ensures the function updates if `fetchMetadataInfo` changes


  useEffect(() => {
    // Fetch both lists in parallel
    Promise.all([fetchAndSetFeesStructures(), fetchMetadataList()]).catch(console.error);
  }, [fetchAndSetFeesStructures, fetchMetadataList]);

  // Fetching user list with async/await for better readability
  useEffect(() => {
    const fetchUsersList = async () => {
      setIsLoading(true);
      try {
        const res = await getUsersList({
          "user_ids": [],
          "role_id": role_id
        });
        const usersList = res?.data?.user_data || [];
        setUsersList(usersList);
        setFilteredUsers(usersList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersList();
  }, [refreshView, role_id]);

  // Handling action with useCallback to prevent unnecessary re-renders
  const handleAction = useCallback((data, action) => {
    switch (action) {
      case "edit":
        setSelectedUserDetails(data);
        setIsReadyToCreasteAdmission(true);
        break; // Using break instead of return for clarity

      case "delete":
        setSelectedUserDetails(data);
        setIsOpenConfirmDialog(true);
        break; // Using break instead of return for clarity

      default:
        goToProfile(data);
    }
  }, []);

  useEffect(() => {
    if (!isReadyToCreasteAdmission) return;
    handleOpenAdmissionPage();
  }, [isReadyToCreasteAdmission]);

  const handleOpenAdmissionPage = () => {
    localStorage.removeItem("admission_metadata");
    localStorage.setItem("admission_metadata", JSON.stringify({
      selectedUserDetails,
      metadataList,
      feesStructuresList,
      role_id
    }));
    navigate("/principalDashboard/admissionView/create-admission");
  };


  // Confirmation dialog
  const closeDialog = (isConfirmed) => {
    if (isConfirmed) {
      getDeleteUser();
    } else {
      setIsOpenConfirmDialog(false);
    }
  };

  const getDeleteUser = () => {
    deleteUserInfo(selectedUserDetails.user_id)
      .then((res) => {
        setShowAlert(res?.data?.status === "success" ? "success" : "error");
        setTimeout(() => {
          setIsOpenConfirmDialog(false);
          setTimeout(() => {
            setRefreshView((prev) => !prev);
            setShowAlert("");
          }, 2000);
        }, 1000);
      })
      .catch(() => {
        setShowAlert("error");
        setTimeout(() => setShowAlert(""), 3000);
        setIsOpenConfirmDialog(false);
      });
  };

  const goToProfile = (userData) => {
    navigate(`/profile/${encodeURIComponent(userData.user_id)}/${encodeURIComponent(4)}`);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for 400ms delay
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim() === "") {
        setFilteredUsers(usersList);
      } else {
        const filtered = usersList.filter((user) =>
          (user.name || "")
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          (user.user_id || "")
            .toLowerCase()
            .includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    }, 400); // You can adjust this delay as needed
  };


  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
           <TextField
            fullWidth
            label="Search by name or ID"
            variant="outlined"
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearchText("");
                      setFilteredUsers(usersList); // Reset user list
                    }}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Button
            className="rounded-pill"
            variant="contained"
            onClick={() => handleAction({}, "edit")}
            color="warning"
          >
            + New Admission
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={1}>
        {isLoading ? (
          <Box className="d-flex justify-content-center align-items-center w-100 mt-5">
            <CircularProgress />
          </Box>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.user_id}
              userDetails={user}
              onAction={handleAction}
            />
          ))
        ) : (
          <Box className="d-flex w-100 justify-content-around mt-5 text-center text-danger">
            No data available
          </Box>
        )}
      </Grid>

      {/* Confirmation Dialog */}
      <AlertDialogSlide
        isOpen={isOpenConfirmDialog}
        title={"Are You Sure?"}
        content={
          "This will permanently delete the user's information from our records. Click 'Agree' to confirm."
        }
        onAgree={() => {
          closeDialog(true);
        }}
        onDisagree={() => {
          closeDialog();
        }}
      />

      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `The user deletion ${showAlert === "success" ? "succeeded" : "failed"
            }.`,
        })}
    </>
  );
};

export default AdmissionView;
