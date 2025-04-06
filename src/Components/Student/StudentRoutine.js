import React, { useEffect, useState } from "react";
import { getStudentRoutineData } from "../../ApiClient";
import { Box, Card, CardContent, Typography } from "@mui/material";
import BackButton from "../../SharedComponents/BackButton";

const StudentRoutine = () => {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [studentRoutineData, setStudentRoutineData] = useState([]);

  useEffect(() => {
    getStudentRoutineData(userInfo.grade_id, userInfo.section_id)
      .then((res) => {
        if (res?.data?.time_table && res?.data?.time_table.length > 0) {
          setStudentRoutineData(res?.data?.time_table);
        }
      })
      .catch((err) => console.log("Routine err - ", err));
  }, []);

  return (
    <>
      <BackButton />
      <Box className="border-bottom text-center pb-3 mb-3">
        <h4 className="mb-3">My Routine</h4>
        <Box>
          {studentRoutineData && studentRoutineData.length > 0 ? (
            studentRoutineData?.map((routine, index) => {
              return (
                <Card className="mb-1 bg-info" key={index}>
                  <CardContent className="text-center text-white">
                    <Typography className="border-bottom pb-1 mb-1">
                      {routine.period}
                    </Typography>
                    <Typography>{routine.subject_name}</Typography>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Typography className="text-center text-danger">
              No Schedule Available
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default StudentRoutine;
