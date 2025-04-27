import React, { useMemo } from "react";
import CommonMatTable from "../../../SharedComponents/CommonMatTable";
import { Box, LinearProgress, Typography } from "@mui/material";

const TeacherAttendanceTable = ({ data, isLoading }) => {

  const ProgressWithText = ({ value }) => {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{ height: 20, borderRadius: 25, width: '100%' }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" color="#fff">{`${Math.round(
            value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  };
  
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        accessorFn: (row) => (
          <div>{row.user_id} - {row.name}</div>
        ),
        size: 300
      },
      {
        accessorKey: "total_present",
        header: "No. of Days Present",
      },
      {
        accessorKey: "total_absent",
        header: "No. of Days Absent",
      },
      {
        accessorKey: "total_pending_days",
        header: "Pending Days",
      },
      {
        accessorKey: "total_salary",
        header: "Total Salary",
        Cell: ({ cell }) => (cell.getValue() !== null ? cell.getValue() : "-"),
      },
      {
        accessorKey: "per_day_salary",
        header: "Per Day Salary",
        Cell: ({ cell }) => (cell.getValue() !== null ? cell.getValue() : "-"),
      },
      {
        accessorKey: "total_paid_amount",
        header: "Paid Amount",
        Cell: ({ cell }) => (cell.getValue() !== null ? cell.getValue() : "-"),
      },
      {
        header: "Attendance %",
        accessorFn: (row) => (
          <ProgressWithText value={row.attendance_percentage} />
        ),
      },
    ],
    []
  );
  

  return (
    <div>
      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        data={data || []}
        renderTopToolbar={() => (
          <h5 className="mt-2">Staff Attendance</h5>
        )}
      />
    </div>
  );
};

export default TeacherAttendanceTable;
