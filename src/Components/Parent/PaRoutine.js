import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import {
  getMasterRoutineMetadataInfo,
  viewStudentRoutine,
} from "../../ApiClient";
import BackButton from "../../SharedComponents/BackButton";

const PaRoutine = () => {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [isLoading, setIsLoading] = useState(false);
  const [periodData, setPeriodData] = useState([]);
  const [routineData, setRoutineData] = useState([]);
  const [daysData, setDaysData] = useState([]);
  const [studentFilter, setStudentFilter] = useState({});

  useEffect(() => {
    if (userInfo.student_info && userInfo.student_info.length > 0) {
      setStudentFilter(userInfo.student_info[0]);
    }
    getMasterRoutineMetadata();
  }, []);

  useEffect(() => {
    if (studentFilter.grade_id && studentFilter.section_id) {
      setIsLoading(true);
      viewStudentRoutine(studentFilter.grade_id, studentFilter.section_id)
        .then((res) => {
          setRoutineData([]);
          if (res?.data?.time_table && res?.data?.time_table.length > 0) {
            setRoutineData(res?.data?.time_table);
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

  const getMasterRoutineMetadata = () => {
    getMasterRoutineMetadataInfo(userInfo.routine_id)
      .then((res) => {
        if (res?.data) {
          if (res.data.periods && res.data.periods.length > 0) {
            const updatedPeriodData = res.data.periods.reduce(
              (acc, period, index) => {
                acc.push(period);
                if (index === 3) {
                  acc.push({
                    period: "Break",
                  });
                }
                return acc;
              },
              []
            );

            setPeriodData(updatedPeriodData);
          }
          if (res.data.days && res.data.days.length > 0) {
            setDaysData(res.data.days);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const handleStudentChange = (e) => {
    setStudentFilter(e.target.value);
  };

  const FiltersView = () => (
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
          value={studentFilter}
          onChange={handleStudentChange}
          renderValue={(selected) => selected.student_name}
        >
          {userInfo.student_info.map((item) => (
            <MenuItem key={item.student_id} value={item}>
              {item.student_name}
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
        <table>
          <thead>
            <tr>
              <th className="fs-6 bg-secondary text-white">Day</th>
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
            {daysData &&
              daysData.length > 0 &&
              daysData.map((dayItem) => (
                <tr key={dayItem.day_id}>
                  <td className="fw-bold" style={{ fontSize: 14 }}>
                    {dayItem.day_name}
                  </td>
                  {periodData.map((item) => {
                    const routine = routineData.find(
                      (r) => r.period_id === item.period_id && r.day_id === dayItem.day_id
                    );
                    if (routine) {
                      return (
                        <td className="p-0" key={item.period}>
                          <div className="p-1 rounded text-center text-white cell selected-cell">
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
                        <td className="p-0" key={item.period}>
                          <div
                            className={`text-center cell ${
                              item.period !== "Break" ? "empty-cell" : ""
                            }`}
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
    </>
  );
};

export default PaRoutine;
