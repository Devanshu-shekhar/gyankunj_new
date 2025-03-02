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
  const [selectedPeriod, setSelectedPeriod] = useState("");

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
    setSelectedPeriod("");
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
        if (Object.keys(res?.data?.substitute_data).length > 0) {
          setSubstituteTeachers(res.data.substitute_data);
          const firstDate = Object.keys(res.data.substitute_data)[0];
          const firstPeriod = res.data.substitute_data[firstDate]?.teacher_list?.[0]?.period_id;
          setSelectedPeriod(firstDate && firstPeriod ? `${firstDate}/${firstPeriod}` : "");
        }
      }
      // else {
      //   const substituteTeachers = {
      //     "2025-02-25": {
      //       "day_id": 2,
      //       "grade_id": 3,
      //       "section_id": 1,
      //       "grade_name": "One",
      //       "section_name": "A",
      //       "teacher_list": [
      //         {
      //           "period_id": 10,
      //           "available_teachers": [
      //             {
      //               "teacher_id": "sfs/24/01/2024",
      //               "teacher_name": "Pragya bharti"
      //             },
      //             {
      //               "teacher_id": "sfs/25/01/2024",
      //               "teacher_name": "Puja kumari"
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     "2025-02-26": {
      //       "day_id": 3,
      //       "grade_id": 1,
      //       "section_id": 3,
      //       "grade_name": "Nursery",
      //       "section_name": "C",
      //       "teacher_list": [
      //         {
      //           "period_id": 9,
      //           "available_teachers": [
      //             {
      //               "teacher_id": "sfs/22/01/2024",
      //               "teacher_name": "Anup Srivastav"
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     "2025-03-02": {
      //       "day_id": 7,
      //       "grade_id": 12,
      //       "section_id": 2,
      //       "grade_name": "Ten",
      //       "section_name": "B",
      //       "teacher_list": [
      //         {
      //           "period_id": 9,
      //           "available_teachers": [
      //             {
      //               "teacher_id": "sfs/20/01/2024",
      //               "teacher_name": "RANI KUMARI3"
      //             },
      //             {
      //               "teacher_id": "sfs/23/01/2024",
      //               "teacher_name": "Aakash shrama"
      //             },
      //             {
      //               "teacher_id": "sfs/27/01/2024",
      //               "teacher_name": "Chanchal sen "
      //             },
      //             {
      //               "teacher_id": "sfs/28/01/2024",
      //               "teacher_name": "Miraya shahay"
      //             }
      //           ]
      //         },
      //         {
      //           "period_id": 12,
      //           "available_teachers": [
      //             {
      //               "teacher_id": "sfs/20/01/2024",
      //               "teacher_name": "RANI KUMARI3"
      //             },
      //             {
      //               "teacher_id": "sfs/23/01/2024",
      //               "teacher_name": "Aakash shrama"
      //             },
      //             {
      //               "teacher_id": "sfs/24/01/2024",
      //               "teacher_name": "Pragya bharti"
      //             },
      //             {
      //               "teacher_id": "sfs/25/01/2024",
      //               "teacher_name": "Puja kumari"
      //             },
      //             {
      //               "teacher_id": "sfs/27/01/2024",
      //               "teacher_name": "Chanchal sen "
      //             },
      //             {
      //               "teacher_id": "sfs/28/01/2024",
      //               "teacher_name": "Miraya shahay"
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   }
      //   const firstDate = Object.keys(substituteTeachers)[0];
      //   const firstPeriod = substituteTeachers[firstDate]?.teacher_list?.[0]?.period_id;
      //   setSelectedPeriod(firstDate && firstPeriod ? `${firstDate}/${firstPeriod}` : "");
      //   setSubstituteTeachers(substituteTeachers);
      // }

      setAssignTeacherDialog({ open: true, leave });
    }
    catch (err) {
      console.log(err);
    }
  }


  const onSubmit = (data) => {
    const substitutedData = [];
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

      <Dialog fullWidth open={assignTeacherDialog.open}>
        <DialogTitle>Assign Teacher</DialogTitle>
        <DialogContent>
          {Object.keys(substituteTeachers).length > 0 ? (
            Object.keys(substituteTeachers).map((date) => (
              <React.Fragment key={date}>
                <div>{date}</div>
                <div className="mt-3">
                  <Tabs
                    value={selectedPeriod || ""}
                    onChange={(event, newValue) => setSelectedPeriod(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {substituteTeachers[date]?.teacher_list.map((period) => (
                      <Tab key={`${date}-${period.period_id}`} label={`Period ${period.period_id}`} value={`${date}/${period.period_id}`} />
                    ))}
                  </Tabs>
                </div>
                {substituteTeachers[date]?.teacher_list.map((period) => (
                  (`${date}/${period.period_id}` === selectedPeriod) && (
                    <FormControl className="mt-3" key={period.period_id} fullWidth>
                      <Controller
                        name={`teacher_id_${date}_${period.period_id}`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <>
                            <InputLabel error={!!error}>Teacher</InputLabel>
                            <Select label="Teacher" onChange={onChange} value={value || ""} error={!!error}>
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
                  )
                ))}

                <hr />
              </React.Fragment>
            ))
          ) : (
            <div className="text-danger text-center">No substitute teachers available</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeAssignTeacherDialog} color="primary">
            Cancel
          </Button>
          <Button disabled={Object.keys(substituteTeachers).length === 0} variant="contained" color="success" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeacherStudentLeaveApplicationsList;
