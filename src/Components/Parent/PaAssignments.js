  import React, { useState, useMemo, useEffect } from "react";
  import { studentAssignmentList } from "../../ApiClient";
  import CommonMatTable from "../../SharedComponents/CommonMatTable";
  import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
  } from "@mui/material";
  import { useNavigate } from "react-router-dom";
import BackButton from "../../SharedComponents/BackButton";

  const PaAssignments = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("UserData"));
    const [assignmentData, setAssignmentData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [studentFilter, setStudentFilter] = useState("");

    useEffect(() => {
      if (userInfo.student_info && userInfo.student_info.length > 0) {
        setStudentFilter(userInfo.student_info[0].student_id);
      }
    }, []);

    useEffect(() => {
      if (studentFilter) {
        setIsLoading(true);
        studentAssignmentList(studentFilter)
          .then((res) => {
            setAssignmentData([]);
            if (
              res?.data?.student_assignments &&
              res?.data?.student_assignments.length > 0
            ) {
              setAssignmentData(res?.data?.student_assignments);
            }
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err);
          });
      }
    }, [studentFilter]);

    // Columns definition
    const columns = useMemo(
      () => [
        { accessorKey: "subject_name", header: "Subject" },
        { accessorKey: "assignment_name", header: "Assignment Name" },
        { accessorKey: "assignment_type_name", header: "Assignment Type" },
        {
          accessorKey: "assignment_status",
          header: "Status",
          accessorFn: (row) => (
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div>{row.assignment_status}</div>
              {row.assignment_status === "Evaluated" && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    navigate(
                      `/parentDashboard/assignment-details?assignment_id=${row.assignment_id}&student_id=${studentFilter}`
                    )
                  }
                >
                  View assignment
                </Button>
              )}
            </div>
          ),
        },
      ],
      [navigate, studentFilter]
    );

    const handleStudentChange = (e) => {
      setStudentFilter(e.target.value);
    };

    const RenderTopToolbarCustomActions = () => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
            justifyContent: "space-between",
          }}
        >
          <BackButton />
          <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
            <InputLabel>Student</InputLabel>
            <Select
              label="Student"
              value={studentFilter || ""}
              onChange={handleStudentChange}
            >
              {userInfo.student_info.map((item, index) => (
                <MenuItem key={index} value={item.student_id}>
                  {item.student_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    };

    return (
      <>
        {userInfo.student_info && userInfo.student_info.length > 1 && (
          <RenderTopToolbarCustomActions />
        )}
        <CommonMatTable
          columns={columns}
          isLoading={isLoading}
          data={assignmentData || []}
          renderTopToolbar={() => (
            <h1 style={{ fontSize: 18, marginTop: 10 }}>Assignments</h1>
          )}
        />
      </>
    );
  };

  export default PaAssignments;
