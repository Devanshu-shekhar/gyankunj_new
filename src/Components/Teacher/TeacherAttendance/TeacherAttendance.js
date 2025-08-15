import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getGradeDetails, viewStudentAttendance } from "../../../ApiClient";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const TeacherAttendance = () => {
  const [gradeData, setGradeData] = useState([]);
  const [monthsList, setMonthsList] = useState([]);
  const [studentsAttendanceData, setStudentsAttendanceData] = useState({});
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [allDatesOfSelectedMonth, setAllDatesOfSelectedMonth] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getGradesList();
    getMonthsList();
  }, []);

  useEffect(() => {
    if (gradeFilter && sectionFilter && monthFilter) {
      setIsLoading(true);
      viewStudentAttendance(gradeFilter, sectionFilter, monthFilter)
        .then((res) => {
          setStudentsAttendanceData(res.data);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        })
        .catch((err) => {
          console.log("Attendance Error - ", err);
          setIsLoading(false);
        });
    }
  }, [gradeFilter, sectionFilter, monthFilter]);

  const getGradesList = () => {
    getGradeDetails()
      .then((res) => {
        if (res?.data?.grade_details?.grade_details) {
          setGradeData(res.data.grade_details.grade_details);
        }
      })
      .catch((err) => console.log(err));
  };

  const getMonthsList = () => {
    const monthList = Array.from({ length: 12 }, (v, i) => ({
      value: (i + 1).toString(),
      label: dayjs().month(i).format("MMMM"),
    }));
    setMonthsList(monthList);
  };

  const handleGradeChange = (event) => {
    setGradeFilter(event.target.value);
    setSectionFilter("");
  };

  const handleSectionChange = (event) => {
    setSectionFilter(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonthFilter(event.target.value);
    getDatesOfMonth(event.target.value);
  };

  const getDatesOfMonth = (month) => {
    const startOfMonth = dayjs(`${dayjs().year()}-${month}-01`).startOf(
      "month"
    );
    const endOfMonth = dayjs(`${dayjs().year()}-${month}-01`).endOf("month");
    const dates = [];
    let currentDate = startOfMonth;

    while (
      currentDate.isBefore(endOfMonth) ||
      currentDate.isSame(endOfMonth, "day")
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    setAllDatesOfSelectedMonth(dates);
  };

  const formatDate = (date) => {
    const day = dayjs(date).date();
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${suffix(day)}`;
  };

  const getAttendanceClass = (status) => {
    switch (status) {
      case "Present":
        return "text-success";
      case "Absent":
        return "text-danger";
      // case "Holiday":
      //   return "text-white bg-info";
      // case "Sunday":
      //   return "text-white bg-warning";
      default:
        return "";
    }
  };

  const getAttendanceText = (status) => {
    switch (status) {
      case "Present":
        return <HowToRegIcon />;
      case "Absent":
        return <PersonOffIcon />;
      case "Holiday":
        return "H";
      case "Sunday":
        return "S";
      default:
        return "";
    }
  };

  const getAttendanceTitle = (status) => {
    switch (status) {
      case "Present":
        return "Present";
      case "Absent":
        return "Absent";
      case "Holiday":
        return "Holiday";
      case "Sunday":
        return "Sunday";
      default:
        return "";
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <h4>Students Attendance</h4>
        {studentsAttendanceData.class_teacher && (
          <p>
            <strong>Class Teacher: </strong>
            <span>{studentsAttendanceData.class_teacher}</span>
          </p>
        )}
      </Box>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}
      >
        <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
          <InputLabel>Grade</InputLabel>
          <Select
            label="Grade"
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
          <InputLabel>Section</InputLabel>
          <Select
            label="Section"
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
        <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
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
      </Box>
      <div className="overflow-auto shadow">
        {studentsAttendanceData?.student_attendance?.length > 0 ? (
          isLoading ? (
            <div className="text-center p-5">
              <CircularProgress />
            </div>
          ) : (
            <table className="table table-bordered">
              <thead className="bg-info-subtle">
                <tr>
                  <th className="text-center" style={{ minWidth: 80 }}>Roll No</th>
                  <th className="text-center" style={{ minWidth: 150 }}>Name</th>
                  <th className="text-center">MTD</th>
                  <th className="text-center" style={{ minWidth: 150 }}>Days Present</th>
                  <th className="text-center" style={{ width: 60 }}>%</th>
                  {allDatesOfSelectedMonth.map((date) => (
                    <th style={{ width: 60, padding: 10 }} key={date}>
                      {formatDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-body-secondary">
                {studentsAttendanceData?.student_attendance?.map((student) => (
                  <tr key={student.student_id}>
                    <td className="text-center">{student.roll_no}</td>
                    <td className="text-center">{student.name}</td>
                    <td className="text-center">{student.mtd}</td>
                    <td className="text-center">{student.days_present}</td>
                    <td className="text-center">{student.attendance_percentage}%</td>
                    {allDatesOfSelectedMonth.map((date) => (
                      <td
                        className={`text-center ${getAttendanceClass(
                          student.attendance[date]
                        )}`}
                        key={date}
                        title={getAttendanceTitle(student.attendance[date])}
                      >
                        {getAttendanceText(student.attendance[date])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <div className="py-5 text-center fs-4">Data not available</div>
        )}
      </div>
    </>
  );
};

export default TeacherAttendance;
