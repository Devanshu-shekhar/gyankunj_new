import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import {
  getLessonPlan,
  lessonPlanAllDetails,
  updateLessonPlanStatus,
} from "../../../ApiClient";
import CommonMatTable from "../../../SharedComponents/CommonMatTable";
import AddIcon from "@mui/icons-material/Add";
import CreateLessonPlan from "./CreateLessonPlan";
import Edit from "@mui/icons-material/Edit";
import { showAlertMessage } from "../../AlertMessage";

const TLessonPlan = () => {
  //const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [lessonPlanData, setLessonPlanData] = useState([]);
  const [userInfo] = useState(JSON.parse(localStorage.getItem("UserData")));
  const [selectedLessonId, setSelectedLessonId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [isAddLessonModalVisible, setIsAddLessonModalVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getLessonPlan(userInfo.user_id)
      .then((res) => {
        setLessonPlanData([]);
        if (
          res?.data?.lesson_plan_data &&
          res?.data?.lesson_plan_data.length > 0
        ) {
          setLessonPlanData(res?.data?.lesson_plan_data);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  // Custom JSX element for the top toolbar
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
        <Button
          variant="contained"
          className="py-3"
          onClick={() => setIsAddLessonModalVisible(true)}
        >
          <AddIcon />
        </Button>
      </Box>
    );
  };

  // Columns definition
  const columns = useMemo(
    () => [
      { accessorKey: "grade", header: "Grade" },
      { accessorKey: "subject_name", header: "Subject" },
      { accessorKey: "topic_name", header: "Lesson" },
      {
        header: "Status",
        accessorFn: (row) => (
          <div className="align-items-baseline d-flex justify-content-between">
            {row.verified === true ? (
              <div className="fw-bold text-success">Verified</div>
            ) : row.verified === false ? (
              <div className="fw-bold text-danger">Sent back</div>
            ) : (
              <div className="fw-bold">Review</div>
            )}
            {row.verified !== true && (
              <Button
                size="small"
                color="primary"
                variant="outlined"
                className="me-2"
                onClick={() => {
                  handleEditLesson(row);
                }}
              >
                <Edit sx={{ fontSize: 16 }} />
                Edit
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  const handleEditLesson = (row) => {
    setSelectedLessonId(row.lesson_id);
    setIsAddLessonModalVisible(true);
  };

  const handleClose = (isSubmit) => {
    setIsAddLessonModalVisible(false);
    setSelectedLessonId(0);
    if (isSubmit) {
      setTimeout(() => {
        setRefreshTable(!refreshTable);
      }, 500);
    }
  };

  return (
    <>
      <RenderTopToolbarCustomActions />
      <CommonMatTable
        columns={columns}
        isLoading={isLoading}
        data={lessonPlanData || []}
        renderTopToolbar={() => (
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Lesson Plan</h1>
        )}
        renderDetailPanel={(row) => <CustomDetailPanel row={row} />}
      />
      {isAddLessonModalVisible && (
        <CreateLessonPlan
          isOpen={isAddLessonModalVisible}
          handleClose={handleClose}
          selectedLessonId={selectedLessonId}
        />
      )}
    </>
  );
};

export default TLessonPlan;

const CustomDetailPanel = ({ row }) => {
  const [rowData, setRowData] = useState({});
  const [isMarkLessonDialogOpen, setIsMarkLessonDialogOpen] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [isCompleteActionVissible, setIsCompleteActionVissible] =
    useState(false);

  useEffect(() => {
    if (row.row.getIsExpanded()) {
      lessonPlanAllDetails(row.row.original.lesson_id)
        .then((res) => {
          if (
            res?.data?.lesson_plan_data &&
            res?.data?.lesson_plan_data.length > 0
          ) {
            setRowData(res.data.lesson_plan_data[0]);
            const endDateObj = new Date(res.data.lesson_plan_data[0]?.end_date);
            const currentDate = new Date();
            const verified = res.data.lesson_plan_data[0]?.verified;
            setIsCompleteActionVissible(verified && endDateObj <= currentDate);
          }
        })
        .catch((err) => console.log("Lesson err - ", err));
    }
  }, [refreshTable]);

  const handleMarkLessonClick = () => {
    setIsMarkLessonDialogOpen(true);
  };

  const handleMarkLessonConfirm = (isConfirm) => {
    if (isConfirm) {
      updateLessonPlanStatus({ lesson_id: row.row.original.lesson_id })
        .then((res) => {
          if (res?.data?.status === "success") {
            setShowAlert("success");
          } else {
            setShowAlert("error");
          }
          setTimeout(() => {
            setIsMarkLessonDialogOpen(false);
            setRefreshTable(!refreshTable);
            setTimeout(() => {
              setShowAlert("");
            }, 2000);
          }, 1000);
        })
        .catch((err) => {
          setShowAlert("error");
          setTimeout(() => {
            setShowAlert("");
          }, 3000);
          setIsMarkLessonDialogOpen(false);
        });
    } else {
      setIsMarkLessonDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <div className="fw-bold">Topic Name: </div>
            </Grid>
            <Grid item xs={9}>
              <div>{rowData.topic_name}</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fw-bold">Learning Objective: </div>
            </Grid>
            <Grid item xs={9}>
              <div>{rowData.learning_objectives}</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fw-bold">Teaching Methods: </div>
            </Grid>
            <Grid item xs={9}>
              <div>{rowData.teaching_methods}</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fw-bold">Learning Outcome: </div>
            </Grid>
            <Grid item xs={9}>
              <div>{rowData.learning_outcome}</div>
            </Grid>
            <Grid item xs={3}>
              <div className="fw-bold">Teaching Aids: </div>
            </Grid>
            <Grid item xs={9}>
              <div>{rowData.teaching_aid_references}</div>
            </Grid>
          </Grid>
        </CardContent>
        {isCompleteActionVissible && (
          <CardActions className="justify-content-end">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleMarkLessonClick}
            >
              Completed lesson
            </Button>
          </CardActions>
        )}
      </Card>
      <Dialog open={isMarkLessonDialogOpen}>
        <DialogTitle>Completed Lesson</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to complete this lesson?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleMarkLessonConfirm(false)}
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={() => handleMarkLessonConfirm(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `Lesson complete marking ${
            showAlert === "success" ? "succeeded" : "failed"
          }.`,
        })}
    </>
  );
};
