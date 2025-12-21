import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  Alert,
} from "@mui/material";

import {
  getStudentAssignmentReport,
  getStudentAttendanceReport,
  viewStudentPerformanceReport,
} from "../../ApiClient";
import dayjs from "dayjs";
import BackButton from "../../SharedComponents/BackButton";
import CommonMatTable from "../../SharedComponents/CommonMatTable";

// Register Chart.js components
Chart.register(ArcElement, DoughnutController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AssignmentReportChart({ assignmentReport = [] }) {
  // ensure assignmentReport is an array
  const list = Array.isArray(assignmentReport) ? assignmentReport : assignmentReport ? Object.values(assignmentReport) : [];

  const passFailData = list.reduce(
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
}

function AttendanceReportChart({ attendanceReport = [] }) {
  const list = Array.isArray(attendanceReport) ? attendanceReport : attendanceReport ? Object.values(attendanceReport) : [];

  const attendanceData = list.reduce(
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
}

function PaReport() {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [assignmentReport, setAssignmentReport] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentFilter, setStudentFilter] = useState(() => (userInfo?.student_info && userInfo.student_info.length > 0) ? userInfo.student_info[0].student_id : "" );
  const [error, setError] = useState(null);

  // Student list + per-student performance
  const [studentPerf, setStudentPerf] = useState(null);
  const [isStudentLoading, setIsStudentLoading] = useState(false);

  // helper to format seconds into human readable duration (used by table)
  const formatDuration = (seconds) => {
    const s = Number(seconds) || 0;
    if (s === 0) return "0s";
    const hours = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = Math.floor(s % 60);
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (mins) parts.push(`${mins}m`);
    if (secs || parts.length === 0) parts.push(`${secs}s`);
    return parts.join(" ");
  };

  const studentColumns = useMemo(
    () => [
      { accessorKey: "metric", header: "Metric" },
      { accessorKey: "value", header: "Value" },
    ],
    []
  );
  
  // track first load to show full-page loading only on initial fetch
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (!studentFilter) {
      setAssignmentReport([]);
      setAttendanceReport([]);
      setStudentPerf(null);
      return;
    }

    let mounted = true;

    (async () => {
      const date = dayjs();
      const month = date.month() + 1;
      const year = date.year();

      // Show full-page loader only on first fetch, otherwise let component-level loaders show
      if (isFirstLoadRef.current) setIsLoading(true);

      try {
        const [assignRes, attendRes] = await Promise.all([
          getStudentAssignmentReport(studentFilter, 1).catch((e) => {
            console.error("Assignment report error:", e);
            return { data: { student_report: [] } };
          }),
          getStudentAttendanceReport(studentFilter, month, year).catch((e) => {
            console.error("Attendance report error:", e);
            return { data: { student_attendance_data: [] } };
          }),
        ]);

        if (!mounted) return;

        // Ensure both reports are arrays before setting state
        const aRaw = assignRes?.data?.student_report;
        const assignList = Array.isArray(aRaw) ? aRaw : aRaw ? Object.values(aRaw) : [];
        setAssignmentReport(assignList);

        const attRaw = attendRes?.data?.student_attendance_data;
        const attendList = Array.isArray(attRaw) ? attRaw : attRaw ? Object.values(attRaw) : [];
        setAttendanceReport(attendList);
      } catch (err) {
        console.error("Failed to fetch assignment/attendance:", err);
        setError("Failed to load reports. Please try again.");
      } finally {
        if (isFirstLoadRef.current) {
          setIsLoading(false);
          isFirstLoadRef.current = false;
        }
      }

      // Fetch student performance metrics (component-level loader)
      setIsStudentLoading(true);
      try {
        const res = await viewStudentPerformanceReport(studentFilter);
        if (!mounted) return;
        const raw = res?.data?.student_report || {};
        const perf = raw[studentFilter] ?? Object.values(raw)[0] ?? null;
        setStudentPerf(perf);
      } catch (err) {
        console.error("Failed to fetch student performance:", err);
        setStudentPerf(null);
        setError("Failed to load student performance.");
      } finally {
        if (mounted) setIsStudentLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [studentFilter]);


  const StudentSelector = useCallback(({ value, onChange }) => (
    <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
      <InputLabel id="student-select-label">Student</InputLabel>
      <Select
        labelId="student-select-label"
        id="student-select"
        label="Student"
        value={value || ""}
        onChange={onChange}
        aria-label="Select student"
      >
        {(userInfo.student_info || []).map((item, index) => (
          <MenuItem key={index} value={item.student_id}>
            {item.student_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ), [userInfo.student_info]);

  const RenderTopToolbarCustomActions = useCallback(() => (
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
      <StudentSelector value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} />
    </Box>
  ), [studentFilter]);

  return (
    <>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {userInfo.student_info && userInfo.student_info.length > 1 && (
        <RenderTopToolbarCustomActions />
      )}

      {isLoading ? (
        <Box className="d-flex justify-content-center align-items-center vh-100">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AssignmentReportChart assignmentReport={assignmentReport} />
            </Grid>
            <Grid item xs={12} md={6}>
              <AttendanceReportChart attendanceReport={attendanceReport} />
            </Grid>
          </Grid>

          {/* Student-specific performance section */}
          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Student Performance Report
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <StudentSelector value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} />

              {isStudentLoading && <CircularProgress size={20} />}
            </Box>

            <CommonMatTable
            columns={studentColumns}
            isLoading={isStudentLoading}
            data={
              studentPerf
                ? [
                    { metric: "Total Assignments", value: studentPerf.total_assignments ?? 0 },
                    { metric: "Total Marks", value: studentPerf.total_marks ?? 0 },
                    { metric: "Marks Received", value: studentPerf.total_marks_received ?? 0 },
                    { metric: "Total Time Taken", value: formatDuration(studentPerf.total_time_taken) },
                  ]
                : []
            }
            renderTopToolbar={() => (
              <h1 style={{ fontSize: 18, marginTop: 10 }}>Student Performance Report</h1>
            )}
          />

          {!isStudentLoading && !studentPerf && (
            <Typography color="textSecondary">Select a student to view performance.</Typography>
          )}
          </Box>
        </>
      )}
    </>
  );
};

export default PaReport;
