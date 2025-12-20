import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { studentAssignmentList, getStudentSubjectData, getStudentAssignmentReport } from "../../../ApiClient";
import AssignmentSheet from "./StartAssignment";
import CommonMatTable from "../../../SharedComponents/CommonMatTable";
import BackButton from "../../../SharedComponents/BackButton";

const StudentAssignments = () => {
  const [assignmentData, setAssignmentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [showAssignmentSheet, setShowAssignmentSheet] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(false);

  // Subject filter + performance data
  const [subjects, setSubjects] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [perfData, setPerfData] = useState([]);
  const [isPerfLoading, setIsPerfLoading] = useState(false);

  const studentId = useMemo(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserData"));
    return userDetails?.user_id;
  }, []);

  // load subjects for the filter (refetch when studentId changes)
  useEffect(() => {
    if (!studentId) return;
    let mounted = true;
    getStudentSubjectData(studentId)
      .then((res) => {
        const list = res?.data?.subjects || [];
        if (!mounted) return;
        setSubjects(list);
        if (list.length > 0) setSubjectFilter((prev) => prev || list[0].subject_id);
      })
      .catch((err) => console.error("Failed to fetch subjects:", err));

    return () => (mounted = false);
  }, [studentId]);

  // fetch per-subject assignment performance
  useEffect(() => {
    if (!studentId || !subjectFilter) {
      setPerfData([]);
      return;
    }
    let mounted = true;
    setIsPerfLoading(true);
    getStudentAssignmentReport(studentId, subjectFilter)
      .then((res) => {
        if (!mounted) return;
        const list = res?.data?.student_report || [];
        setPerfData(Array.isArray(list) ? list : Object.values(list));
      })
      .catch((err) => {
        console.error("Failed to fetch student assignment report:", err);
        setPerfData([]);
      })
      .finally(() => mounted && setIsPerfLoading(false));

    return () => (mounted = false);
  }, [studentId, subjectFilter]);

  useEffect(() => {
    if (!studentId) {
      setAssignmentData([]);
      return;
    }
    let mounted = true;
    setIsAssignmentsLoading(true);
    studentAssignmentList(studentId)
      .then((res) => {
        if (!mounted) return;
        const list = res?.data?.student_assignments || [];
        const sorted = Array.isArray(list)
          ? list.sort((a, b) => new Date(b.assigned_on) - new Date(a.assigned_on))
          : [];
        setAssignmentData(sorted);
      })
      .catch((err) => console.error("Assignment Fetch Error:", err))
      .finally(() => mounted && setIsAssignmentsLoading(false));

    return () => (mounted = false);
  }, [studentId, isRefreshing]);

  const filteredData = useMemo(() => {
    return assignmentData
      .filter((a) =>
        a.assignment_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((a) => (filter ? a.assignment_status === filter : true));
  }, [assignmentData, searchTerm, filter]);

  const startAssignment = (row) => {
    setSelectedAssignment(row);
    if (row.assignment_type_name === "Test") {
      setShowInstructionsModal(true);
    } else {
      setShowAssignmentSheet(true);
    }
  };

  const handleCloseInstructions = () => {
    setShowInstructionsModal(false);
    setShowAssignmentSheet(true);
  };

  const closeAssignment = (isSubmited) => {
    setShowInstructionsModal(false);
    setShowAssignmentSheet(false);
    setSelectedAssignment(null);
    if(isSubmited){
      setIsRefreshing(!isRefreshing);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "subject_name", header: "Subject" },
      { accessorKey: "assignment_name", header: "Assignment Name" },
      { accessorKey: "assignment_type_name", header: "Type" },
      { accessorKey: "assignment_status", header: "Status" },
      {
        accessorKey: "assigned_on",
        header: "Assigned On",
        accessorFn: (row) => dayjs(row.assigned_on).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        accessorFn: (row) => {
          let label = "";
          if (row.assignment_status === "New") label = "Start";
          else if (
            ["In Progress", "Inprogress"].includes(row.assignment_status)
          )
            label = "Continue";
          else if (row.assignment_status === "Submitted")
            label = "Check Assignment";

          return label ? (
            <Button
              variant="contained"
              size="small"
              onClick={() => startAssignment(row)}
            >
              {label}
            </Button>
          ) : null;
        },
      },
    ],
    []
  );

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

  // Performance table columns
  const perfColumns = useMemo(
    () => [
      { accessorKey: "assignment_id", header: "Assignment ID" },
      { accessorKey: "total_marks", header: "Total Marks" },
      { accessorKey: "total_marks_received", header: "Marks Received" },
      {
        accessorKey: "total_time_taken",
        header: "Time Taken",
        accessorFn: (row) => formatDuration(row.total_time_taken),
      },
      {
        accessorKey: "assignment_passed",
        header: "Passed",
        accessorFn: (row) => (row.assignment_passed ? "Yes" : "No"),
      },
    ],
    []
  );

  const RenderToolbar = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        marginBottom: 2,
      }}
    >
      <BackButton />
      <TextField
        label="Search Assignment"
        variant="outlined"
        size="small"
        className="w-25"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ width: "30ch" }}
      />

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status Filter</InputLabel>
        <Select
          value={filter}
          label="Status Filter"
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Submitted">Submitted</MenuItem>
        </Select>
      </FormControl>

      {/* Subject filter is shown only in Assignment Performance section */}
    </Box>
  );

  return (
    <>
      <RenderToolbar />
      <CommonMatTable
        columns={columns}
        data={filteredData}
        isLoading={isAssignmentsLoading}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Assignments</h1>
        )}
      />

      {/* Subject-wise assignment performance table */}
      <Box sx={{ mt: 4 }}>
        {/* external filter row: subject selector + spinner */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Subject</InputLabel>
            <Select
              value={subjectFilter}
              label="Subject"
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              {subjects && subjects.length > 0 ? (
                subjects.map((s) => (
                  <MenuItem key={s.subject_id} value={s.subject_id}>
                    {s.subject_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">
                  <em>No subjects</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {isPerfLoading && <CircularProgress size={20} />}
        </Box>

        <CommonMatTable
          columns={perfColumns}
          data={perfData}
          isLoading={isPerfLoading}
          renderTopToolbar={() => (
            <h1 style={{ fontSize: 18, marginTop: 10 }}>Assignment Performance</h1>
          )}
        />

        {!isPerfLoading && perfData.length === 0 && (
          <Box mt={2} color="text.secondary">No performance data for selected subject.</Box>
        )}
      </Box>
      {showAssignmentSheet && selectedAssignment && (
        <AssignmentSheet
          show={showAssignmentSheet}
          onHide={closeAssignment}
          assignmentId={selectedAssignment.assignment_id}
          assignmentType={selectedAssignment.assignment_type_name}
          assignmentName={selectedAssignment.assignment_name}
          setAssignmentFullList={setAssignmentData}
          assignmentStatus={
            selectedAssignment.assignment_status === "Submitted"
          }
        />
      )}
      <Dialog
        open={showInstructionsModal}
        onClose={closeAssignment}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Test Instructions"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">You cannot switch tabs, and we are monitoring your activity.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="" onClick={closeAssignment}>Disagree</Button>
          <Button onClick={handleCloseInstructions} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentAssignments;