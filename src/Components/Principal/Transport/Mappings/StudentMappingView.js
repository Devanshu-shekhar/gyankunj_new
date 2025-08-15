import React, { useState, useMemo, useEffect } from "react";
import {
  evaluateStudentRouteRequest,
  fetchAllStudentsMetadata,
  fetchMappedStudentRoutes,
  getAllRoutesList,
} from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CreateStudentRouteMapping from "./CreateStudentRouteMapping";
import { showAlertMessage } from "../../../AlertMessage";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const StudentMappingView = () => {
  const [studentRoutesList, setStudentRoutesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRoutesModalVisible, setIsAddRoutesModalVisible] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [studentList, setStudentList] = useState();
  const [routesList, setRoutesList] = useState();
  const [selectedDataToEdit, setSelectedDataToEdit] = useState();
  const [showAlert, setShowAlert] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    route_id: null,
    stop_point_id: null,
    student_id: null,
    is_assigned: null,
  });

  useEffect(() => {
    setIsLoading(true);
    fetchMappedStudentRoutes()
      .then((res) => {
        setStudentRoutesList([]);
        if (res?.data?.student_routes_data?.length > 0) {
          setStudentRoutesList(res?.data?.student_routes_data);
        }
        setTimeout(() => setIsLoading(false), 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  }, [refreshTable]);

  useEffect(() => {
    fetchAllStudentsMetadata()
      .then((res) => {
        setStudentList([]);
        if (res?.data?.students_data?.length > 0) {
          setStudentList(res.data.students_data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    getAllRoutesList()
      .then((res) => {
        setRoutesList([]);
        if (res?.data?.routes_data?.length > 0) {
          setRoutesList(res?.data?.routes_data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleClose = (isSubmit) => {
    setIsAddRoutesModalVisible(false);
    if (isSubmit) {
      setTimeout(() => setRefreshTable(!refreshTable), 500);
    }
  };

  const takeActionOnRoute = () => {
    delete confirmationDialog.open;
    evaluateStudentRouteRequest(confirmationDialog)
      .then((res) => {
        if (res?.data?.status === "success") {
          setShowAlert("success");
        } else {
          setShowAlert("error");
        }
        setTimeout(() => {
          setShowAlert("");
        }, 2000);
        setRefreshTable((prev) => !prev);
      })
      .catch((err) => {
        setShowAlert("error");
        setTimeout(() => {
          setShowAlert("");
        }, 3000);
      });
    closeConfirmationDialog();
  };

  const openConfirmationDialog = (
    route_id,
    stop_point_id,
    student_id,
    is_assigned
  ) => {
    setConfirmationDialog({
      open: true,
      route_id: route_id,
      stop_point_id: stop_point_id,
      student_id: student_id,
      is_assigned: is_assigned,
    });
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialog({
      open: false,
      route_id: null,
      stop_point_id: null,
      student_id: null,
      is_assigned: null,
    });
  };

  // Columns definition for the main table
  const columns = useMemo(
    () => [{ accessorKey: "route_name", header: "Route Name" }],
    []
  );

  // Detail panel renderer for subrows
  const renderDetailPanel = ({ row }) => {
    const subRows = row.original.route_student_info;

    return (
      <table className="table table-bordered w-100">
        <thead>
          <tr>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Stop Name
            </th>
            <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
              Student Details
            </th>
          </tr>
        </thead>
        <tbody>
          {subRows.map((stop) => (
            <tr key={stop.stop_point_id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {stop.stop_point_name}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                <ul>
                  {stop.student_ids.map((user, index) => (
                    <li key={user.student_id}>
                      <div className="d-flex align-items-center gap-2 py-2">
                        <div>
                          {user.student_name}
                          {" - "}
                          {user.student_id}
                        </div>
                        {user.to_be_reviewed && (
                          <>
                            <CheckRoundedIcon
                              className="cursor mr-1"
                              color="success"
                              onClick={() =>
                                openConfirmationDialog(
                                  row.original.route_id,
                                  stop.stop_point_id,
                                  user.student_id,
                                  true
                                )
                              }
                            />
                            <CloseRoundedIcon
                              className="cursor"
                              color="error"
                              onClick={() =>
                                openConfirmationDialog(
                                  row.original.route_id,
                                  stop.stop_point_id,
                                  user.student_id,
                                  false
                                )
                              }
                            />
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const RenderTopToolbarCustomActions = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        marginBottom: 2,
        justifyContent: "end",
      }}
    >
      <Button
        variant="contained"
        onClick={() => setIsAddRoutesModalVisible(true)}
      >
        Configure Students Route
      </Button>
    </Box>
  );

  return (
    <>
      <RenderTopToolbarCustomActions />
      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        enableExpanding={true}
        data={studentRoutesList || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Students Route</h1>
        )}
        renderDetailPanel={renderDetailPanel}
      />
      {isAddRoutesModalVisible && (
        <CreateStudentRouteMapping
          isOpen={isAddRoutesModalVisible}
          handleClose={handleClose}
          routesList={routesList}
          studentList={studentList}
          initialData={selectedDataToEdit}
        />
      )}
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `Evaluation student route ${
            showAlert === "success" ? "succeeded" : "failed"
          }.`,
        })}

      <Dialog open={confirmationDialog.open} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {confirmationDialog.is_assigned ? "approve" : "reject"} this route
            application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={takeActionOnRoute}
            color={confirmationDialog.is_assigned ? "success" : "error"}
          >
            {confirmationDialog.is_assigned ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentMappingView;
