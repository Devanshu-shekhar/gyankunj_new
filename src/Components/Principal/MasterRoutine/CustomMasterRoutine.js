import React, { useState, useEffect } from "react";
import {
  getGradeDetails,
  getMasterRoutineMetadataInfo,
  getSubjectsList,
  getTeachersData,
  getViewMasterRoutineData,
  updateMasterRoutineType,
} from "../../../ApiClient";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import CreateMasterRoutine from "./CreateMasterRoutine";
import { showAlertMessage } from "../../AlertMessage";
import CreateMasterSchedule from "./CreateMasterSchedule";

const CustomMasterRoutine = () => {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [isLoading, setIsLoading] = useState(false);
  const [gradeData, setGradeData] = useState([]);
  const [masterRoutineData, setMasterRoutineData] = useState({});
  const [selectedRoutineData, setSelectedRoutineData] = useState(null);
  const [selectedSectionData, setSelectedSectionData] = useState([]);
  const [selectedSectionByGrade, setSelectedSectionByGrade] = useState({});
  const [isAddRoutineModalVisible, setIsAddRoutineModalVisible] = useState(false);
  const [periodData, setPeriodData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [daysData, setDaysData] = useState([]);
  const [dayFilter, setDayFilter] = useState("");
  const [showAlert, setShowAlert] = useState("");

  useEffect(() => {
    getMasterRoutineMetadata();
    getAllSubjectsData();
    getAllTeachersData();
    getGradesList();
  }, []);

  useEffect(() => {
    if (dayFilter) getMasterRoutineData();
  }, [dayFilter]);

  const getMasterRoutineMetadata = () => {
    getMasterRoutineMetadataInfo(userInfo.routine_id)
      .then((res) => {
        if (res?.data) {
          const currentDayName = dayjs().format("dddd").toLowerCase();
          const currentDayObject = res.data.days?.find(
            (day) => day.day_name.toLowerCase() === currentDayName
          );
          if (currentDayObject) setDayFilter(currentDayObject.day_id);
          const updatedPeriodData = res.data?.periods?.length > 0 ? res.data.periods.reduce(
            (acc, period, index) => {
              acc.push(period);
              if (index === 3) {
                acc.push({
                  period: "Break",
                  // Assuming other properties of period object need to be set
                  // If not, you can omit other properties
                  // For example: start_time: null, end_time: null, etc.
                });
              }
              return acc;
            },
            []
          ): [];

          setPeriodData(updatedPeriodData);
          setDaysData(res.data.days);
        }
      })
      .catch((err) => console.error(err));
  };

  const getGradesList = () => {
    getGradeDetails()
      .then((res) => {
        if (res?.data?.grade_details?.grade_details) {
          setGradeData(res.data.grade_details.grade_details);
        }
      })
      .catch((err) => console.error(err));
  };

  const getAllSubjectsData = () => {
    getSubjectsList()
      .then((res) => {
        setSubjectsList([]);
        if (res.data && res.data.subjects && res.data.subjects.length > 0) {
          setSubjectsList(res.data.subjects);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTeachersData = () => {
    getTeachersData()
      .then((res) => {
        if (res.data && res.data.teachers && res.data.teachers.length > 0) {
          setTeacherData(res.data.teachers);
        }
      })
      .catch((err) => console.log("Teachers err - ", err));
  };

  const getMasterRoutineData = () => {
    setIsLoading(true);
    getViewMasterRoutineData(dayFilter)
      .then((res) => {
        if (res?.data) {
          setMasterRoutineData(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  const handleClickOpen = (data, sectionList = [], period) => {
    if (period && data) {
      setSelectedRoutineData(data);
      setSelectedSectionData(sectionList);
      setIsAddRoutineModalVisible(true);
    }
  };

  const handleClose = (isSubmit) => {
    if (isSubmit) getMasterRoutineData();
    setIsAddRoutineModalVisible(false);
  };

  const handleSectionChange = (gradeId, sectionId) => {
    setSelectedSectionByGrade((prevData) => ({
      ...prevData,
      [gradeId]: sectionId,
    }));
  };

  const FiltersView = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        marginBottom: 2,
      }}
    >
      <FormControl fullWidth sx={{ width: "calc(100%/3)" }}>
        <InputLabel>Day</InputLabel>
        <Select
          label="Day"
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
        >
          {daysData.map((item) => (
            <MenuItem key={item.day_id} value={item.day_id}>
              {item.day_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <>
      <FiltersView />
      {isLoading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="fs-6 bg-secondary text-white text-center">Grade</th>
              {periodData.map((item) => (
                <th
                  className={`fs-6 text-center text-white ${
                    item.period === "Break" ? "bg-danger" : "bg-secondary"
                  }`}
                  key={item.period}
                >
                  {item.period !== "Break" ? "Period" : ""} {item.period}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gradeData &&
              gradeData.length > 0 &&
              gradeData.map((gradeItem) => (
                <tr key={gradeItem.grade_id}>
                  <td className="fw-bold text-center" style={{ fontSize: 14 }}>
                  <div>
                      {gradeItem.grade}
                      {gradeItem.section_list?.length > 1 && (
                        <FormControl fullWidth sx={{ marginTop: 1 }}>
                          <InputLabel>Section</InputLabel>
                          <Select
                            label="Section"
                            value={
                              selectedSectionByGrade[gradeItem.grade_id] ||
                              gradeItem.section_list[0]?.section_id
                            }
                            onChange={(e) =>
                              handleSectionChange(
                                gradeItem.grade_id,
                                e.target.value
                              )
                            }
                          >
                            {gradeItem.section_list.map((section) => (
                              <MenuItem
                                key={section.section_id}
                                value={section.section_id}
                              >
                                {section.section_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </div>
                  </td>
                  {periodData.map((item) => {
                   const routines = masterRoutineData[item.period_id] || [];
                   const selectedSectionId = selectedSectionByGrade[gradeItem.grade_id] || gradeItem.section_list[0]?.section_id;
                   const routine = routines.find(
                     (r) =>
                       r.grade_id === gradeItem.grade_id &&
                       r.day_id === dayFilter &&
                       r.section_id === parseInt(selectedSectionId)
                   );                
                    console.log(gradeItem.grade_id, selectedSectionId)
                    if (routine) {
                      return (
                        <td key={item.period_id}>
                          <div
                            className="p-1 rounded text-center text-white cell selected-cell"
                            onClick={() =>
                              handleClickOpen(
                                routine,
                                gradeItem.section_list,
                                item.period_id
                              )
                            }
                          >
                            <p className="mb-0">
                              <small>
                                {routine.start_time} - {routine.end_time}
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
                        <td key={item.period_id}>
                          <div
                            className={`text-center cell ${
                              item.period_id !== "Break" ? "empty-cell" : ""
                            }`}
                            onClick={() =>
                              handleClickOpen(
                                {
                                  grade_id: gradeItem.grade_id,
                                  period_id: item.period_id,
                                  day_id: dayFilter,
                                },
                                gradeItem.section_list,
                                item.period_id
                              )
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
          sectionsList={selectedSectionData}
          teachersList={teacherData}
          subjectsList={subjectsList}
          masterRoutine={masterRoutineData}
        />
      )}
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `The routine type updation ${
            showAlert === "success" ? "succeeded" : "failed"
          }.`,
        })}
    </>
  );
};

export default CustomMasterRoutine;
