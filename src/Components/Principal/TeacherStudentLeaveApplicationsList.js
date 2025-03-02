import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { assignSubstituteTeachers, evaluateLeaveApplication, fetchSubstituteTeachers, getStaffLeaveApplicationsList } from "../../ApiClient";
import CommonMatTable from "../../SharedComponents/CommonMatTable";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";

const TeacherStudentLeaveApplicationsList = (props) => {
  const { handleSubmit, setValue, reset, control } = useForm();
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [teacherLeaves, setTeacherLeaves] = useState([]);
  const [studentLeaves, setStudentLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    leaveId: null,
    isApproved: null,
  });
  const [assignTeacherDialog, setAssignTeacherDialog] = useState({
    open: false,
    leave: null
  });
  const [substituteTeachers, setSubstituteTeachers] = useState({});
  const [selectedDate, setSelectedDate] = useState(Object.keys(substituteTeachers)[0] || "");

  const handleTabChange = (event, newValue) => {
    setSelectedDate(newValue);
  };

  useEffect(() => {
    setIsLoading(true);
    getStaffLeaveApplicationsList()
      .then((res) => {
        const leaves = res?.data?.leave_data || [];
        const updatedLeaves = leaves.map((leave) => {
          console.log("Processing leave:", leave);

          return {
            ...leave,
            dateList: generateDateRange(leave.start_date, leave.end_date),
          };
        });

        console.log("Updated Leaves:", updatedLeaves);

        setTeacherLeaves(updatedLeaves.filter((leave) => !leave.parent_id));
        setStudentLeaves(updatedLeaves.filter((leave) => leave.parent_id));

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [refreshTable, userInfo.user_id]);

  const generateDateRange = (start, end) => {
    if (!start || !end) return [];

    let dates = [];
    let currentDate = dayjs(start);
    const endDate = dayjs(end);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  const takeActionOnLeave = (leaveId, isApproved) => {
    const payload = {
      leave_id: leaveId,
      is_approved: isApproved,
    };
    evaluateLeaveApplication(payload)
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

  const openConfirmationDialog = (leaveId, isApproved) => {
    setConfirmationDialog({ open: true, leaveId, isApproved });
  };

  const closeConfirmationDialog = () => {
    setConfirmationDialog({ open: false, leaveId: null, isApproved: null });
  };

  const openAssignTeacherDialog = (leave) => {
    getSubstituteTeachers(leave);
  }

  const closeAssignTeacherDialog = () => {
    setSelectedDate("");
    setSubstituteTeachers({});
    setAssignTeacherDialog({ open: false, leave: null });
  }


  const getSubstituteTeachers = async (leave) => {
    const payload = {
      "teacher_id": leave.user_id,
      "leave_dates": leave.dateList || []
    }
    try {
      const res = await fetchSubstituteTeachers(payload);
      if (res?.data?.status === "success") {
        setSubstituteTeachers(res?.data?.substitute_data);
        if (res?.data?.substitute_data) {
          setSelectedDate(Object.keys(res?.data?.substitute_data)[0] || "");
        }
        setAssignTeacherDialog({ open: true, leave });
      }
    }
    catch (err) {
      console.log(err);
    }
  }


  const onSubmit = (data) => {
    const substitutedData = [];
    debugger;
    Object.keys(substituteTeachers).forEach((date) => {
      substituteTeachers[date]?.teacher_list.forEach((period) => {
        const teacherId = data[`teacher_id_${date}_${period.period_id}`];
        if (teacherId) {
          substitutedData.push({
            primary_teacher_id: assignTeacherDialog.leave.user_id,
            substitute_teacher_id: teacherId,
            substitution_date: date,
            grade_id: substituteTeachers[date].grade_id,
            subject_id: substituteTeachers[date].subject_id,
            section_id: substituteTeachers[date].section_id,
            period_id: period.period_id,
            day_id: substituteTeachers[date].day_id,
          });
        }
      });
    });

    const payload = { substituted_data: substitutedData };
    console.log("Payload:", payload);
    assignTeachers(payload);
  };

  const assignTeachers = async (payload) => {
    try {
      const res = await assignSubstituteTeachers(payload);
      if (res?.data?.status === "success") {
        setRefreshTable((prev) => !prev);
        closeAssignTeacherDialog();
        setShowAlert("success");
        setTimeout(() => {
          setShowAlert("");
        }, 2000);
      }
      
    }
    catch (err) {
      console.log(err);
      setShowAlert("error");
      setTimeout(() => {
        setShowAlert("");
      }, 2000);
    }
  }

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
        {!row.parent_id && row.status === "approved" && (
          <Button
          size="small"
            variant="contained"
            color="primary"
            onClick={() => openAssignTeacherDialog(row)}
          >
            Assign
          </Button>
        )}
        {row.status === "pending" && (
          <Box className="d-flex gap-2 mt-1">
            <Button
              variant="outlined"
              color="error"
              onClick={() => openConfirmationDialog(row.leave_id, false)}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => openConfirmationDialog(row.leave_id, true)}
            >
              Approve
            </Button>
          </Box>
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
    <>
      <div className="mt-5">
        <CommonMatTable
          columns={columns}
          isLoading={isLoading}
          data={teacherLeaves}
          renderTopToolbar={() => (
            <h1 style={{ fontSize: 18, marginTop: 10 }}>Teacher Leave Applications</h1>
          )}
        />
      </div>
      <div className="mt-5">
        <CommonMatTable
          columns={columns}
          isLoading={isLoading}
          data={studentLeaves}
          renderTopToolbar={() => (
            <h1 style={{ fontSize: 18, marginTop: 10 }}>Student Leave Applications</h1>
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

      <Dialog fullWidth open={assignTeacherDialog.open} onClose={closeAssignTeacherDialog}>
        <DialogTitle>Assign Teacher</DialogTitle>
        <DialogContent>
          <Tabs
            value={selectedDate}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.keys(substituteTeachers).map((date) => (
              <Tab key={date} label={date} value={date} />
            ))}
          </Tabs>

          <div className="mt-3">
            {substituteTeachers[selectedDate]?.teacher_list.map((period) => (
              <div className="d-flex gap-5 align-items-center mb-3" key={period.period_id}>
                <div className="fs-12" style={{ width: "150px" }}>Period {period.period_id}</div>
                <FormControl fullWidth>
                  <Controller
                    name={`teacher_id_${selectedDate}_${period.period_id}`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <>
                        <InputLabel error={!!error}>Teacher</InputLabel>
                        <Select
                          label="Teacher"
                          onChange={onChange}
                          value={value || ""}
                          error={!!error}
                        >
                          {period.available_teachers?.map((item) => (
                            <MenuItem key={item.teacher_id} value={item.teacher_id}>
                              {item.teacher_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </FormControl>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeAssignTeacherDialog} color="primary">
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeacherStudentLeaveApplicationsList;
