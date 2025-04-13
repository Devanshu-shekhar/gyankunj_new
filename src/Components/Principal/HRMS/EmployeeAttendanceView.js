import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getGradeDetails, viewAttendanceReport } from "../../../ApiClient";
import TeacherAttendanceTable from "../Attendance/TeacherAttendanceTable";
import BackButton from "../../../SharedComponents/BackButton";
import DownloadAttendancePDF from "./DownloadAttendancePDF";

const EmployeeAttendanceView = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [gradeData, setGradeData] = useState([]);
    const [gradeFilter, setGradeFilter] = useState("");
    const [sectionFilter, setSectionFilter] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchGradeDetails = async () => {
            try {
                const res = await getGradeDetails();
                if (res?.data?.grade_details?.grade_details) {
                    setGradeData(res.data.grade_details.grade_details);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchGradeDetails();
    }, []);

    useEffect(() => {
        const fetchAttendanceReport = async () => {
            if (gradeFilter && sectionFilter) {
                setIsLoading(true);
                setAttendanceData([]);

                try {
                    const res = await viewAttendanceReport(gradeFilter, sectionFilter, "teacher");
                    if (res?.data?.teacher_report?.attendance_data?.length > 0) {
                        setAttendanceData(res.data.teacher_report.attendance_data);
                    }
                } catch (err) {
                    console.log(err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchAttendanceReport();
    }, [gradeFilter, sectionFilter]);

    const handleGradeChange = (event) => {
        setGradeFilter(event.target.value);
        setSectionFilter("");
    };

    const handleSectionChange = (event) => {
        setSectionFilter(event.target.value);
    };

    return (
        <>
        <BackButton />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    marginY: 2,
                }}
            >
                <h4 className="mb-3" style={{ width: "calc(100%/3)" }}>
                    Attendance Overview
                </h4>
                <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
                    <InputLabel id="grade-filter-label">Grade</InputLabel>
                    <Select
                        labelId="grade-filter-label"
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
                <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
                    <InputLabel id="section-filter-label">Section</InputLabel>
                    <Select
                        labelId="section-filter-label"
                        value={sectionFilter}
                        onChange={handleSectionChange}
                        disabled={!gradeFilter}
                    >
                        {gradeData
                            .find((grade) => grade.grade_id === gradeFilter)
                            ?.section_list.map((section) => (
                                <MenuItem key={section.section_id} value={section.section_id}>
                                    {section.section_name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <DownloadAttendancePDF staffAttendanceData={attendanceData} />
            </Box>
            <TeacherAttendanceTable data={attendanceData} isLoading={isLoading} />
        </>
    );
};

export default EmployeeAttendanceView;
