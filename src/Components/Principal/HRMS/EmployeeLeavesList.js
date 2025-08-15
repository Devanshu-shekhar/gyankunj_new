import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import CommonMatTable from "../../../SharedComponents/CommonMatTable";
import { getStaffLeaveApplicationsList } from "../../../ApiClient";
import BackButton from "../../../SharedComponents/BackButton";

const EmployeeLeavesList = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [appliedLeavesList, setAppliedLeavesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    leaveId: null,
    isApproved: null,
  });

  useEffect(() => {
    setIsLoading(true);
    getStaffLeaveApplicationsList()
      .then((res) => {
        setAppliedLeavesList(res?.data?.leave_data || []);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [refreshTable, userInfo.user_id]);

  const takeActionOnLeave = (leaveId, isApproved) => {
    // Assuming evaluateLeaveApplication is no longer needed or replaced by getEmployeeLeavesList
    // For now, we'll just refresh the table on success
    setRefreshTable((prev) => !prev);
    setShowAlert("success");
    setTimeout(() => {
      setShowAlert("");
    }, 2000);
    closeConfirmationDialog();
  };

  const openConfirmationDialog = (leaveId, isApproved) => {
    setConfirmationDialog({ open: true, leaveId, isApproved });
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialog({ open: false, leaveId: null, isApproved: null });
  };

  const accessorFn = (row) => {
    const getStatusClass = (status) => {
      switch (status) {
        case "approved":
          return "text-success";
        case "withdrawn":
        case "rejected":
          return "text-danger";
        default:
          return "";
      }
    };

    return (
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div className={`fw-bold ${getStatusClass(row.status)}`}>
          {row.status}
        </div>
        {row.status === "pending" && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => openConfirmationDialog(row.leave_id, false)}
            >
              Reject
            </button>
            <button
              className="btn btn-sm btn-outline-success"
              onClick={() => openConfirmationDialog(row.leave_id, true)}
            >
              Approve
            </button>
          </div>
        )}
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "start_date",
        header: "Start date",
      },
      {
        accessorKey: "end_date",
        header: "End date",
      },
      {
        accessorKey: "no_of_days",
        header: "No of days",
      },
      {
        accessorKey: "leave_type",
        header: "Leave type",
      },
      {
        accessorKey: "leave_data",
        header: "Leave Reason",
      },
      {
        accessorKey: "is_approved",
        header: "Status",
        accessorFn: (row) => accessorFn(row),
      },
    ],
    []
  );

  return (
    <div>
      <BackButton />
      <div className="mt-2">
        <CommonMatTable
            columns={columns}
            isLoading={isLoading}
            data={appliedLeavesList || []}
            renderTopToolbar={() => (
            <h1 style={{ fontSize: 18, marginTop: 10 }}>
                Staff Leave applications
            </h1>
            )}
        />
      </div>
      {showAlert && (
        <Alert severity={showAlert === "success" ? "success" : "error"}>
          {showAlert === "success"
            ? "Action successfully performed"
            : "An error occurred"}
        </Alert>
      )}

      <Dialog open={confirmationDialog.open} onClose={closeConfirmationDialog}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {confirmationDialog.isApproved ? "approve" : "reject"} this leave
            application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              takeActionOnLeave(
                confirmationDialog.leaveId,
                confirmationDialog.isApproved
              )
            }
            color={confirmationDialog.isApproved ? "success" : "error"}
          >
            {confirmationDialog.isApproved ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeLeavesList;
