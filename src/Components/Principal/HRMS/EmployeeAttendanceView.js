import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { viewStaffAttendanceReport } from "../../../ApiClient";
import TeacherAttendanceTable from "../Attendance/TeacherAttendanceTable";
import BackButton from "../../../SharedComponents/BackButton";
import DownloadAttendancePDF from "./DownloadAttendancePDF";
import dayjs from "dayjs";

const EmployeeAttendanceView = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [monthsList, setMonthsList] = useState([]);
    const [monthFilter, setMonthFilter] = useState(dayjs().format("M"));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getMonthsList();
    }, []);

    useEffect(() => {
        const fetchAttendanceReport = async () => {
            if (monthFilter) {
                setIsLoading(true);
                setAttendanceData([]);

                try {
                    const res = await viewStaffAttendanceReport(monthFilter);
                    if (res?.data?.attendance_report?.attendance_data?.length > 0) {
                        setAttendanceData(res.data.attendance_report.attendance_data);
                    }
                } catch (err) {
                    console.log(err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchAttendanceReport();
    }, [monthFilter]);

    const getMonthsList = () => {
        const monthList = Array.from({ length: 12 }, (v, i) => ({
            value: (i + 1).toString(),
            label: dayjs().month(i).format("MMMM"),
        }));
        setMonthsList(monthList);
    };

    const handleMonthChange = (event) => {
        setMonthFilter(event.target.value);
    };

    return (
        <>
            <BackButton />
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    marginY: 2,
                }}
            >
                <h4 className="mb-3 w-100">
                    Attendance Overview
                </h4>
                <div className="d-flex gap-4 w-100">
                    <FormControl fullWidth>
                        <InputLabel>Month</InputLabel>
                        <Select
                            label="Month"
                            value={monthFilter}
                            onChange={handleMonthChange}
                        >
                            {monthsList.map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <DownloadAttendancePDF staffAttendanceData={attendanceData} />
                </div>
            </Box>
            <TeacherAttendanceTable data={attendanceData} isLoading={isLoading} />
        </>
    );
};

export default EmployeeAttendanceView;
