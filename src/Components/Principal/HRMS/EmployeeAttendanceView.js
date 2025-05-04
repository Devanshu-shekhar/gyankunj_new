import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { fetchMetadataInfo, viewStaffAttendanceReport } from "../../../ApiClient";
import TeacherAttendanceTable from "../Attendance/TeacherAttendanceTable";
import BackButton from "../../../SharedComponents/BackButton";
import DownloadAttendancePDF from "./DownloadAttendancePDF";
import dayjs from "dayjs";

const EmployeeAttendanceView = ({userId}) => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [monthsList, setMonthsList] = useState([]);
    const [monthFilter, setMonthFilter] = useState(dayjs().format("M"));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchMetadataList();
    }, []);

    useEffect(() => {
        const fetchAttendanceReport = async () => {
            if (monthFilter) {
                setIsLoading(true);
                setAttendanceData([]);

                try {
                    const res = await viewStaffAttendanceReport(monthFilter, userId);
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


    const fetchMetadataList = React.useCallback(async () => {
        const payload = {
            fetch_all_months: {}
        };
        
        try {
            const res = await fetchMetadataInfo(payload);
            const metadata = res?.data?.metadata_info || {};        
            setMonthsList(metadata?.fetch_all_months?.months_data || []);
        } catch (error) {
            console.error("Failed to fetch metadata list:", error);
        }
    }, []);
      

    const handleMonthChange = (event) => {
        setMonthFilter(event.target.value);
    };

    return (
        <>
        {!userId && <BackButton />}
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
                            {monthsList.map((item) => {
                                const isFutureMonth = parseInt(item.month_id, 10) - 1 > dayjs().month();
                                return (
                                    <MenuItem key={item.month_id} value={item.month_id} disabled={isFutureMonth}>
                                        {item.month_name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    {!userId && <DownloadAttendancePDF staffAttendanceData={attendanceData} />}
                </div>
            </Box>
            <TeacherAttendanceTable data={attendanceData} isLoading={isLoading} />
        </>
    );
};

export default EmployeeAttendanceView;
