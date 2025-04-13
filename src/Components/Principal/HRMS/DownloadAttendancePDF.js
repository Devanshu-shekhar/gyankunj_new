import React from "react";
import jsPDF from "jspdf";
import { Button } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DownloadAttendancePDF = ({ staffAttendanceData }) => {
    const handleDownload = () => {
        const doc = new jsPDF();
        let y = 20;

        doc.setFontSize(16);
        doc.text("Staff Attendance Report", 14, y);
        y += 10;

        doc.setFontSize(12);
        staffAttendanceData.forEach((item, index) => {
            const text = `${index + 1}. Name: ${item.teacher_name}, ID: ${item.teacher_id}, Present: ${item.present_days}, Absence: ${item.absence_count}, Percentage: ${item.attendance_percentage}`;
            doc.text(text, 14, y);
            y += 8;
        });

        doc.save("Staff_Attendance_Report.pdf");
    };

    return (
        <Button disabled={staffAttendanceData.length === 0} onClick={handleDownload} sx={{padding: '15px'}} variant="outlined"  color="primary" startIcon={<FileDownloadIcon />}>Download</Button>
    );
};

export default DownloadAttendancePDF;
