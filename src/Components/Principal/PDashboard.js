import React, { useEffect, useState } from "react";
import "./PrincipalDashboard.css";
import {
  attendanceOverview,
  getGradeDetails,
  getTeachersData,
  getTeacherRoutine,
  getDaysData,
} from "../../ApiClient";
import PLogBook from "./PLogBook";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AttendanceToggle from "../AttendanceToggle";
import { useMemo } from "react";
import TeacherStudentLeaveApplicationsList from "./TeacherStudentLeaveApplicationsList";

const PDashboard = () => {
  const userInfo = useMemo(
    () => JSON.parse(localStorage.getItem("UserData")),
    []
  );
  const [overallAttendance, setOverallAttendance] = useState({});
  const [teacherData, setTeacherData] = useState([]);
  const [daysData, setDaysData] = useState([]);
  const [teacherRoutineData, setTeacherRoutineData] = useState([]);
  const [gradeData, setGradeData] = useState([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");

  useEffect(() => {
    getAllGradeDetails();
    getAllTeachersData();
    getDaysList();
  }, []);

  useEffect(() => {
    if (teacherFilter && dayFilter) {
      getTeacherRoutine(teacherFilter, dayFilter)
        .then((res) => {
          setTeacherRoutineData([]);
          if (res?.data?.time_table && res?.data?.time_table.length > 0) {
            setTeacherRoutineData(res.data.time_table);
          }
        })
        .catch((err) => console.log(err, "errorTeacher"));
    }
  }, [teacherFilter, dayFilter]);

  useEffect(() => {
    if (gradeFilter && sectionFilter) {
      attendanceOverview(gradeFilter, sectionFilter)
        .then((res) => setOverallAttendance(res.data))
        .catch((err) => console.log(err));
    }
  }, [gradeFilter, sectionFilter]);

  const getAllGradeDetails = () => {
    getGradeDetails()
      .then((res) => {
        if (res?.data?.grade_details?.grade_details) {
          setGradeData(res.data.grade_details.grade_details);
        }
      })
      .catch((err) => console.log(err));
  };

  const getAllTeachersData = () => {
    getTeachersData().then((res) => {
      if (res?.data?.teachers && res?.data?.teachers.length > 0) {
        setTeacherData(res?.data?.teachers);
      }
    });
  };

  const getDaysList = () => {
    getDaysData().then((res) => {
      if (res?.data?.days && res?.data?.days.length > 0) {
        setDaysData(res?.data?.days);
      }
    });
  };

  const handleGradeChange = (event) => {
    setGradeFilter(event.target.value);
    setSectionFilter("");
  };

  const handleSectionChange = (event) => {
    setSectionFilter(event.target.value);
  };

  const handleDayChange = (e) => {
    setDayFilter(e.target.value);
  };

  const handleTeacherChange = (e) => {
    setTeacherFilter(e.target.value);
  };

  return (
    <>
      { userInfo.role === "PRINCIPAL" && 
        <div className="mb-3"><AttendanceToggle /></div>
      }
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <div className="border p-3 rounded mb-5 shadow-sm">
            <Box className="border-bottom d-flex align-items-center justify-content-between pb-3 mb-3">
              <Grid container className="d-flex align-items-center">
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" className="mb-2">
                    Attendance Overview
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className="d-flex justify-content-between gap-2">
                    <FormControl fullWidth sx={{ width: "calc(100%/2)" }}>
                      <InputLabel>Grade</InputLabel>
                      <Select
                        label="Grade"
                        value={gradeFilter || ""}
                        onChange={handleGradeChange}
                      >
                        {gradeData.map((item) => (
                          <MenuItem key={item.grade_id} value={item.grade_id}>
                            {item.grade}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ width: "calc(100%/2)" }}>
                      <InputLabel>Section</InputLabel>
                      <Select
                        label="Section"
                        value={sectionFilter}
                        onChange={handleSectionChange}
                        disabled={!gradeFilter}
                      >
                        {gradeData
                          .find((grade) => grade.grade_id === gradeFilter)
                          ?.section_list.map((section) => (
                            <MenuItem
                              key={section.section_id}
                              value={section.section_id}
                            >
                              {section.section_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Grid container className="attendanceOverviewInner">
              <Grid item xs={12} md={6}>
                <h6
                  style={{
                    paddingTop: "5px",
                    textAlign: "center",
                    font: "normal normal medium 14px/15px Roboto",
                    letterSpacing: "0px",
                    color: "#821CE8",
                    opacity: "1",
                  }}
                >
                  Teacher
                </h6>
                <Grid container>
                  <Grid item xs={6}>
                    Present
                  </Grid>
                  <Grid item xs={6}>
                    <p>
                      {overallAttendance?.attendance_overview?.teacher
                        ?.present ?? "-"}
                    </p>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    Absent
                  </Grid>
                  <Grid item xs={6}>
                    <p>
                      {overallAttendance?.attendance_overview?.teacher
                        ?.absent ?? "-"}
                    </p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <h6
                  style={{
                    paddingTop: "5px",
                    textAlign: "center",
                    font: "normal normal medium 14px/15px Roboto",
                    letterSpacing: "0px",
                    color: "#821CE8",
                    opacity: "1",
                  }}
                >
                  Student
                </h6>
                <Grid container>
                  <Grid item xs={6}>
                    Overview
                  </Grid>
                  <Grid item xs={6}>
                    <p>
                      {overallAttendance?.attendance_overview?.student?.total ??
                        "-"}
                    </p>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    Present
                  </Grid>
                  <Grid item xs={6}>
                    <p>
                      {overallAttendance?.attendance_overview?.student
                        ?.present ?? "-"}
                    </p>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    Absent
                  </Grid>
                  <Grid item xs={6}>
                    <p>
                      {overallAttendance?.attendance_overview?.student
                        ?.absent ?? "-"}
                    </p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <PLogBook />
          { userInfo.role === "PRINCIPAL" && 
            <div>
               <TeacherStudentLeaveApplicationsList />
            </div>
          }
        </Grid>
        <Grid item xs={12} md={3}>
          <Box className="border-bottom text-center pb-3 mb-3">
            <h4 className="mb-3">Teacher's Schedule</h4>
            <Box className="d-flex justify-content-between gap-2 w-100">
              <FormControl fullWidth sx={{ width: "calc(100%/2)" }}>
                <InputLabel>Day</InputLabel>
                <Select
                  label="Day"
                  value={dayFilter || ""}
                  onChange={handleDayChange}
                >
                  {daysData.map((item) => (
                    <MenuItem key={item.day_id} value={item.day_id}>
                      {item.day_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ width: "calc(100%/2)" }}>
                <InputLabel>Teacher</InputLabel>
                <Select
                  label="Teacher"
                  value={teacherFilter}
                  onChange={handleTeacherChange}
                >
                  {teacherData?.map((item) => (
                    <MenuItem key={item.teacher_id} value={item.teacher_id}>
                      {item.teacher_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box>
            {teacherRoutineData && teacherRoutineData.length > 0 ? (
              teacherRoutineData?.map((routine, index) => {
                return (
                  <Card className="mb-1 bg-info" key={index}>
                    <CardContent className="text-center text-white">
                      <Typography className="border-bottom pb-1 mb-1">{`${routine.start_time} to ${routine.end_time}`}</Typography>
                      <Typography>{`${routine.subject_name} - ${routine.grade} ${routine.section_name}`}</Typography>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Typography className="text-center text-danger">
                No Schedule Available
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PDashboard;
