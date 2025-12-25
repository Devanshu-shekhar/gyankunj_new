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
} from "@mui/material";
import dayjs from "dayjs";
import { studentAssignmentList } from "../../../ApiClient";
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


  const studentId = useMemo(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserData"));
    return userDetails?.user_id;
  }, []);





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