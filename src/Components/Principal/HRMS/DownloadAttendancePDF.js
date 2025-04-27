import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DownloadAttendancePDF = ({ staffAttendanceData }) => {
    const handleDownload = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Staff Attendance Report", 14, 20);

        const tableColumn = [
            "#",
            "Name",
            "Emp ID",
            "Days Present",
            "Days Absent",
            "Pending Days",
            "Total Salary",
            "Per Day Salary",
            "Paid Amount",
            "Attendance %"
        ];

        const tableRows = [];
        staffAttendanceData.forEach((item, index) => {
            tableRows.push([
                index + 1,
                item.name,
                item.user_id,
                item.total_present,
                item.total_absent,
                item.total_pending_days,
                item.total_salary !== null ? item.total_salary : "-",
                item.per_day_salary !== null ? item.per_day_salary : "-",
                item.total_paid_amount !== null ? item.total_paid_amount : "-",
                item.attendance_percentage + "%"
            ]);
        });


        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'striped',
            headStyles: { fillColor: [63, 81, 181] },
            styles: { fontSize: 12 },
        });

        doc.save("Staff_Attendance_Report.pdf");
    };

    return (
        <Button disabled={staffAttendanceData.length === 0} onClick={handleDownload} sx={{ padding: '15px' }} variant="outlined" color="primary"><FileDownloadIcon /></Button>
    );
};

export default DownloadAttendancePDF;
