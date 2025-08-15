import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
} from "chart.js";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  Box,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import {
  getStudentAssignmentReport,
  getStudentAttendanceReport,
} from "../../ApiClient";
import dayjs from "dayjs";
import BackButton from "../../SharedComponents/BackButton";

// Register Chart.js components
Chart.register(ArcElement, DoughnutController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AssignmentReportChart = ({ assignmentReport = [] }) => {
  // Process the data to get the number of passed and failed assignments
  const passFailData = assignmentReport.reduce(
    (acc, assignment) => {
      if (assignment.assignment_passed) {
        acc.passed += 1;
      } else {
        acc.failed += 1;
      }
      return acc;
    },
    { passed: 0, failed: 0 }
  );

  const data = {
    labels: ["Passed", "Failed"],
    datasets: [
      {
        label: "Assignments",
        data: [passFailData.passed, passFailData.failed],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className="mb-4 shadow border rounded">
      <CardContent>
        <Typography variant="h5" component="div">
          Assignment Report
        </Typography>
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  );
};

const AttendanceReportChart = ({ attendanceReport = [] }) => {
  const attendanceData = attendanceReport.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    },
    { Present: 0, Absent: 0, Holiday: 0 }
  );

  const data = {
    labels: ["Present", "Absent", "Holiday"],
    datasets: [
      {
        label: "Days",
        data: [
          attendanceData.Present,
          attendanceData.Absent,
          attendanceData.Holiday,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="mb-4 shadow border rounded">
      <CardContent>
        <Typography variant="h5" component="div">
          Attendance Report
        </Typography>
        <Doughnut data={data} />
      </CardContent>
    </Card>
  );
};

const PaReport = () => {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [assignmentReport, setAssignmentReport] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentFilter, setStudentFilter] = useState("");

  useEffect(() => {
    if (userInfo.student_info && userInfo.student_info.length > 0) {
      setStudentFilter(userInfo.student_info[0].student_id);
    }
  }, []);

  useEffect(() => {
    if (studentFilter) {
      const date = dayjs();
      const month = date.month() + 1;
      const year = date.year();
      setIsLoading(true);
      getStudentAssignmentReport(studentFilter, 1)
        .then((res) => {
          setAssignmentReport([]);
          if (
            res?.data?.student_report &&
            res?.data?.student_report.length > 0
          ) {
            setAssignmentReport(res?.data?.student_report);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      getStudentAttendanceReport(studentFilter, month, year)
        .then((res) => {
          setAttendanceReport([]);
          if (
            res?.data?.student_attendance_data &&
            res?.data?.student_attendance_data.length > 0
          ) {
            setAttendanceReport(res?.data?.student_attendance_data);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [studentFilter]);

  const handleStudentChange = (e) => {
    setStudentFilter(e.target.value);
  };

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
        <BackButton />
        <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
          <InputLabel>Student</InputLabel>
          <Select
            label="Student"
            value={studentFilter || ""}
            onChange={handleStudentChange}
          >
            {userInfo.student_info.map((item, index) => (
              <MenuItem key={index} value={item.student_id}>
                {item.student_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  return (
    <>
      {userInfo.student_info && userInfo.student_info.length > 1 && (
        <RenderTopToolbarCustomActions />
      )}
      {isLoading ? (
        <Box className="d-flex justify-content-center align-items-center vh-100">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <AssignmentReportChart assignmentReport={assignmentReport} />
          </Grid>
          <Grid item xs={12} md={6}>
            <AttendanceReportChart attendanceReport={attendanceReport} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PaReport;
