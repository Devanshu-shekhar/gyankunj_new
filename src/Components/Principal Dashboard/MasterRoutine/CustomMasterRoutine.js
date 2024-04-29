import React, { useState, useEffect } from "react";
import { getGradeDetails, getSubjectsList } from "../../../ApiClient";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress
} from "@mui/material";
import dayjs from "dayjs";
import CreateMasterRoutine from "./CreateMasterRoutine";

const CustomMasterRoutine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gradeData, setGradeData] = useState([]);
  const [masterRoutineData, setMasterRoutineData] = useState();
  const [selectedRoutineData, setSelectedRoutineData] = useState();
  const [selectedSectionData, setSelectedSectionData] = useState([]);
  const [isAddRoutineModalVisible, setIsAddRoutineModalVisible] = useState(false);
  const [periodData] = useState([
    { value: "1", label: 1 },
    { value: "2", label: 2 },
    { value: "3", label: 3 },
    { value: "4", label: 4 },
    { value: "5", label: 5 },
    { value: "6", label: 6 },
    { value: "7", label: 7 },
    { value: "8", label: 8 },
    { value: "9", label: 9 },
  ]);

  const [daysData] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
  const [dayFilter, setDayFilter] = useState(dayjs().format("dddd"));

  useEffect(() => {
    getGradesList();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const tempData = {
      1: {
        start_time: "07:00",
        end_time: "08:00",
        period: "1",
        grade_id: 1,
        section_id: "1",
        section_name: "A",
        teacher_name: "JEFFER",
        teacher_id: "JEFFER",
        subject_name: "English",
        subject_id: 12,
      },
      2: {
        start_time: "17:00",
        end_time: "21:00",
        period: "2",
        grade_id: 1,
        section_id: "1",
        section_name: "A",
        teacher_name: "Rajlakshmi",
        teacher_id: "TEACHER_3",
        subject_name: "Math",
        subject_id: 12,
      },
      3: {
        start_time: "08:00",
        end_time: "09:00",
        period: "3",
        grade_id: 4,
        section_id: "1",
        section_name: "A",
        teacher_name: "Devanshu Shekharr",
        teacher_id: "TEACHER_12",
        subject_name: "Math",
        subject_id: 11,
      },
      6: {
        start_time: "01:30",
        end_time: "2:30",
        period: "6",
        grade_id: 4,
        section_id: "1",
        section_name: "A",
        teacher_name: "Puja Kumari",
        teacher_id: "TEACHER_2",
        subject_name: "URDU",
        subject_id: 4,
      },
    };
    setMasterRoutineData(tempData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [dayFilter]);

  const getGradesList = () => {
    getGradeDetails()
      .then((res) => {
        if (res?.data?.grade_details?.grade_details) {
          setGradeData(res.data.grade_details.grade_details);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleClickOpen = (data, sectionList = []) => {
    setSelectedRoutineData(data);
    setSelectedSectionData(sectionList);
    setIsAddRoutineModalVisible(true);
  };

  const handleClose = () => {
    setIsAddRoutineModalVisible(false);
  };

  const FiltersView = () => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          marginBottom: 2,
        }}
      >
        {/* <h4>Teachers Routine</h4> */}
        <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
          <InputLabel id="day-filter-label">Day</InputLabel>
          <Select
            labelId="day-filter-label"
            value={dayFilter || ""}
            onChange={(e) => setDayFilter(e.target.value)}
          >
            {daysData.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  return (
    <>
      <FiltersView />
      {isLoading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th className="fs-6">Grade</th>
              {periodData.map((period) => (
                <th className="fs-6 text-center" key={period.value}>
                  Period {period.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gradeData.map((gradeItem) => (
              <tr key={gradeItem.grade_id}>
                <td className="fw-bold" style={{ fontSize: 14 }}>
                  {gradeItem.grade}
                </td>
                {periodData.map((period) => {
                  const routine = masterRoutineData
                    ? masterRoutineData[period.value]
                    : null;
                  if (routine && routine.grade_id === gradeItem.grade_id) {
                    return (
                      <td className="p-0" key={period.value}>
                        <div
                          className="p-1 rounded text-center text-white cell selected-cell"
                          onClick={() =>
                            handleClickOpen(routine, gradeItem.section_list)
                          }
                        >
                          <p className="mb-0">
                            <small>
                              {routine.start_time}
                              {" - "}
                              {routine.end_time}
                            </small>
                          </p>
                          <p className="mb-0">
                            <small>{routine.subject_name}</small>
                          </p>
                          <p className="mb-0">
                            <small>{routine.teacher_name}</small>
                          </p>
                        </div>
                      </td>
                    );
                  } else {
                    return (
                      <td className="p-0" key={period.value}>
                        <div
                          className="text-center cell empty-cell"
                          onClick={() =>
                            handleClickOpen({}, gradeItem.section_list)
                          }
                        ></div>
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isAddRoutineModalVisible && (
        <CreateMasterRoutine
          isOpen={isAddRoutineModalVisible}
          handleClose={handleClose}
          selectedData={selectedRoutineData}
          selectedSectionData={selectedSectionData}
        />
      )}
    </>
  );
};

export default CustomMasterRoutine;
