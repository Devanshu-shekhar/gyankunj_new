import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  getLeaveApplicationsList,
  getParentLeaveApplicationsList,
  withdrawLeaveApplication,
} from "../../ApiClient";
import CommonMatTable from "../../SharedComponents/CommonMatTable";
import PaApplyLeaveForm from "./PaApplyLeaveForm";
import BackButton from "../../SharedComponents/BackButton";

const PaFeedback = (props) => {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [appliedLeavesList, setAppliedLeavesList] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isAddLeaveModalVisible, setIsAddLeaveModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [leaveToWithdraw, setLeaveToWithdraw] = useState(null);
  const [showAlert, setShowAlert] = React.useState("");

  useEffect(() => {
    setIsLoading(true);
    getLeaveApplicationsList(userInfo.user_id, props.isComingFromProfile)
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

  const handleAddLeave = () => {
    setSelectedLeave({});
    setIsAddLeaveModalVisible(true);
  };

  const handleClose = (isSubmit) => {
    setIsAddLeaveModalVisible(false);
    if (isSubmit) {
      setTimeout(() => {
        setRefreshTable(!refreshTable);
      }, 500);
    }
  };

  const handleWithdrawClick = (leave) => {
    setLeaveToWithdraw(leave);
    setIsWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = (isConfirm) => {
    if (isConfirm) {
      withdrawLeaveApplication({ leave_id: leaveToWithdraw.leave_id })
        .then((res) => {
          if (res?.data?.status === "success") {
            setShowAlert("success");
          } else {
            setShowAlert("error");
          }
          setTimeout(() => {
            setIsWithdrawDialogOpen(false);
            setLeaveToWithdraw(null);
            setRefreshTable(!refreshTable);
            setTimeout(() => {
              setShowAlert("");
            }, 2000);
          }, 1000);
        })
        .catch((err) => {
          setShowAlert("error");
          setTimeout(() => {
            setShowAlert("");
          }, 3000);
          setIsWithdrawDialogOpen(false);
          setLeaveToWithdraw(null);
        });
    } else {
      setIsWithdrawDialogOpen(false);
      setLeaveToWithdraw(null);
    }
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
        {userInfo.role !== "STUDENT" && row.status !== "approved" && row.status !== "rejected" && row.status !== "withdrawn" && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleWithdrawClick(row)}
          >
            Withdraw
          </Button>
        )}
      </div>
    );
  };

  // Custom JSX element for the top toolbar
  const RenderTopToolbarCustomActions = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginBottom: 2,
          justifyContent: "space-between",
        }}
      >
        {!props.isComingFromProfile && <BackButton />}
        {userInfo.role !== "STUDENT" && (
          <Box className="d-flex justify-content-end gap-2">
            <Button className="py-3" onClick={handleAddLeave} variant="contained">
              <AddIcon /> Apply Leave
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  // Columns definition
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
      <RenderTopToolbarCustomActions />
      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        data={appliedLeavesList || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Leave applications</h1>
        )}
      />
      {isAddLeaveModalVisible && (
        <PaApplyLeaveForm
          isOpen={isAddLeaveModalVisible}
          handleClose={handleClose}
          selectedLeaveDetails={selectedLeave}
          isComingFromProfile={props.isComingFromProfile}
        />
      )}
      <Dialog open={isWithdrawDialogOpen}>
        <DialogTitle>Withdraw Leave</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw this leave application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleWithdrawConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleWithdrawConfirm(true)} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {showAlert && (
        <Alert severity={showAlert === "success" ? "success" : "error"}>
          {showAlert === "success"
            ? "Action successfully performed"
            : "An error occurred"}
        </Alert>
      )}
    </div>
  );
};

export default PaFeedback;
