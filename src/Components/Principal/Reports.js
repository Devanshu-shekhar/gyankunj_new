import React, { useCallback, useEffect, useMemo, useState } from "react";
import { viewAllStudentPerformanceReport, fetchMetadataInfo, viewStudentPerformanceReport, fetchAllStudentsMetadata } from "../../ApiClient";
import CommonMatTable from "../../SharedComponents/CommonMatTable";
import AlertMessage from "../AlertMessage";
import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";

const ReportSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  // Student selector & performance state
  const [students, setStudents] = useState([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [studentPerf, setStudentPerf] = useState(null);
  const [isStudentLoading, setIsStudentLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setIsLoading(true);

      try {
        const [reportsRes, metaRes] = await Promise.all([
          viewAllStudentPerformanceReport(),
          fetchMetadataInfo({ get_all_grade_details: {} }),
        ]);

        if (!mounted) return;

        const gradeArray =
          metaRes?.data?.metadata_info?.get_all_grade_details?.grade_details?.grade_details ||
          metaRes?.data?.metadata_info?.get_all_grade_details?.grade_details ||
          metaRes?.data?.grade_details?.grade_details ||
          metaRes?.data?.grade_details ||
          [];

        // Build lookup maps for grade and section names
        const gradeMap = new Map();
        const sectionMap = new Map();

        if (Array.isArray(gradeArray)) {
          gradeArray.forEach((g) => {
            const gid = g.grade_id ?? g.id;
            const gname = g.grade ?? g.grade_name ?? g.name;
            if (gid != null) gradeMap.set(String(gid), gname ?? String(gid));

            const sections = g.section_list || g.sections || g.section_details;
            if (Array.isArray(sections)) {
              sections.forEach((s) => {
                const sid = s.section_id ?? s.id;
                const sname = s.section_name ?? s.name;
                if (sid != null) sectionMap.set(String(sid), sname ?? String(sid));
              });
            }
          });
        }

        const reportData = Array.isArray(reportsRes?.data?.student_report)
          ? reportsRes.data.student_report.map((r) => {
            const gradeId = r.grade_id ?? r.grade;
            const sectionId = r.section_id ?? r.section;
            return {
              ...r,
              assignment_passed_count: Number(r.assignment_passed_count) || 0,
              assignment_failed_count: Number(r.assignment_failed_count) || 0,
              id: r.id ?? `${gradeId}-${sectionId}`,
              grade_name: gradeMap.get(String(gradeId)) ?? gradeId,
              section_name: sectionMap.get(String(sectionId)) ?? sectionId,
            };
          })
          : [];

        setReports(reportData);
      } catch (err) {
        console.error("Error fetching reports/metadata:", err);
        if (mounted) setError("Failed to load reports. Please try again.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch list of students (pass empty grade/section to get all students)
  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      try {
        const res = await fetchAllStudentsMetadata("", "");
        if (!mounted) return;
        const list = res?.data?.students_data || [];
        setStudents(list);
        if (list.length > 0) setStudentFilter((prev) => prev || list[0].student_id);
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      }
    };

    fetchStudents();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch selected student's performance
  useEffect(() => {
    if (!studentFilter) {
      setStudentPerf(null);
      return;
    }

    let mounted = true;
    const fetchStudentPerf = async () => {
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
      } finally {
        if (mounted) setIsStudentLoading(false);
      }
    };

    fetchStudentPerf();

    return () => {
      mounted = false;
    };
  }, [studentFilter]);

  const columns = useMemo(
    () => [
      { accessorKey: "grade_name", header: "Grade" },
      { accessorKey: "section_name", header: "Section" },
      { accessorKey: "assignment_passed_count", header: "Assignment Passed Count" },
      { accessorKey: "assignment_failed_count", header: "Assignment Failed Count" },
    ],
    []
  );

  // format seconds into human readable duration
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

  const renderTopToolbar = useCallback(
    () => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <h1 style={{ fontSize: 18, marginTop: 10 }}>Class Performance Reports</h1>
      </div>
    ),
    []
  );

  return (
    <div className="reportSection">
      {error && <AlertMessage open={true} alertFor="error" message={error} />}

      <CommonMatTable columns={columns} isLoading={isLoading} data={reports || []} renderTopToolbar={renderTopToolbar} />

      {!isLoading && (!reports || reports.length === 0) && (
        <div style={{ textAlign: "center", marginTop: 16, color: "#666" }}>No reports available.</div>
      )}

      {!isLoading && reports && reports.length > 0 && (
        <div style={{ marginTop: 12, textAlign: "right", color: "#333", fontSize: 14 }}>
          <strong>Totals:</strong>&nbsp;Passed: {reports.reduce((acc, r) => acc + (Number(r.assignment_passed_count) || 0), 0)}&nbsp;|&nbsp;Failed: {reports.reduce((acc, r) => acc + (Number(r.assignment_failed_count) || 0), 0)}
        </div>
      )}

      {/* Student-specific performance section */}
      <div style={{ marginTop: 24 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
          <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
            <InputLabel>Student</InputLabel>
            <Select
              label="Student"
              value={studentFilter || ""}
              onChange={(e) => setStudentFilter(e.target.value)}
            >
              {students.map((s) => (
                <MenuItem key={s.student_id} value={s.student_id}>
                  {s.student_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isStudentLoading && (
            <div style={{ marginLeft: 8 }}><CircularProgress size={20} /></div>
          )}
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
          <div style={{ textAlign: "center", marginTop: 12, color: "#666" }}>Select a student to view performance.</div>
        )}
      </div>
    </div>
  );
};

export default ReportSection;
