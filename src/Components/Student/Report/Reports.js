import React, { useEffect, useState, useMemo } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";
import { getStudentSubjectData, getStudentAssignmentReport } from "../../../ApiClient";
import CommonMatTable from "../../../SharedComponents/CommonMatTable";
import BackButton from "../../../SharedComponents/BackButton";

const StudentReportSection = () => {
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

  return (
    <>
      <BackButton />

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
    </>
  );
};

export default StudentReportSection;  
