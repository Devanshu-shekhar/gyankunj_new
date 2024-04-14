import React, { useState, useMemo, useEffect } from "react";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getGradeDetails, viewLogBook } from "../../../../ApiClient";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddNewLog from "./AddNewLog";

const LogBook = () => {
  const [logBookDetails, setLogBookDetails] = useState();
  const [gradeData, setGradeData] = useState([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(dayjs());
  const [isAddLogModalVisible, setIsAddLogModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    getGradeDetails()
      .then((res) => {
        if (res?.data?.grade_details?.grade_details) {
          setGradeData(res.data.grade_details.grade_details);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const date = dateFilter.format("YYYY-MM-DD");
    if(gradeFilter && sectionFilter && dateFilter){
      setIsLoading(true);
      viewLogBook(date, gradeFilter, sectionFilter)
      .then((res) => {
        setLogBookDetails(res?.data?.log_book_data || []);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    }
  }, [gradeFilter, sectionFilter, dateFilter, refreshTable]);

  const handleGradeChange = (event) => {
    setGradeFilter(event.target.value);
    setSectionFilter(""); // Reset section filter when grade changes
  };

  const handleSectionChange = (event) => {
    setSectionFilter(event.target.value);
  };

  const handleDateChange = (newValue) => {
    setDateFilter(newValue);
  };

  const handleClose = () => {
    setIsAddLogModalVisible(false);
    setRefreshTable(!refreshTable);
  }

  // Custom JSX element for the top toolbar
  const RenderTopToolbarCustomActions = () => {
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}
      >
        <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
          <InputLabel id="grade-filter-label">Grade</InputLabel>
          <Select
            labelId="grade-filter-label"
            value={gradeFilter || ""}
            onChange={handleGradeChange}
          >
            {gradeData.map((item) => (
              <MenuItem key={item.grade_id} value={item.grade_id}>
                {item.grade_id}
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
        <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="YYYY-MM-DD"
              value={dateFilter}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </FormControl>
        <Button
          variant="contained"
          className="py-3"
          onClick={() => setIsAddLogModalVisible(true)}
        >
          <AddIcon />
        </Button>
      </Box>
    );
  };

  // Columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: "period",
        header: "Period",
      },
      {
        accessorKey: "students_present",
        header: "Student Present",
      },
      {
        accessorKey: "subject_name",
        header: "Subject",
      },
      {
        accessorKey: "content_taught",
        header: "Content Taught",
      },
      {
        accessorKey: "home_work",
        header: "Homework",
      },
    ],
    []
  );

  return (
    <div>
      <RenderTopToolbarCustomActions />
      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        data={logBookDetails?.log_record || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Log book</h1>
        )}
      />
      <ClassTeacher teacher={logBookDetails?.class_teacher_name} />
      <AbsenteesList absentees={logBookDetails?.name_of_absentees} />
      <DefaultersList defaulters={logBookDetails?.name_of_dress_defaulters} />
      <AddNewLog
        isOpen={isAddLogModalVisible}
        handleClose={handleClose}
        gradeList={gradeData}
      />
    </div>
  );
};

export default LogBook;

const ClassTeacher = ({ teacher }) => (
  <h1 className="fs-6 mt-2">
    Name of Class Teacher:{" "} <span className="fw-light">{teacher}</span>
  </h1>
);

const AbsenteesList = ({ absentees }) => (
  <h1 className="fs-6 mt-2">
    Name of Absentees:{" "}
    {absentees?.map((item, index) => (
      <span key={index} className="fw-light">
        {item.student_name}
        {item.student_name && index + 1 < absentees.length && ", "}
      </span>
    ))}
  </h1>
);

const DefaultersList = ({ defaulters }) => (
  <h1 className="fs-6 mt-2">
    Name of Defaulters:{" "}
    {defaulters?.map((item, index) => (
      <span key={index} className="fw-light">
        {item.student_name}
        {item.student_name && index + 1 < defaulters.length && ", "}
      </span>
    ))}
  </h1>
);
