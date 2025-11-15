import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from "@mui/material";
import { createMasterRoutine } from "../../../ApiClient";
import { showAlertMessage } from "../../AlertMessage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    height: "calc(100% - 53px)",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialog-paper": {
    maxWidth: "90%",
    width: "35%",
    //height: "100%",
    overflow: "hidden",
  },
}));

const CreateMasterRoutine = ({
  isOpen,
  handleClose,
  selectedData,
  sectionsList = [],
  teachersList = [],
  subjectsList = [],
  masterRoutine = {}, 
}) => {
  const { handleSubmit, setValue, reset, control } = useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRoutineData, setSelectedRoutineData] = useState();
  const [showAlert, setShowAlert] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState("");

  useEffect(() => {
    if (selectedData && selectedData.subject_id) {
      setIsEditMode(true);
    }
    setSelectedRoutineData(selectedData);
  }, [selectedData]);

  useEffect(() => {
    if (selectedRoutineData && selectedRoutineData.subject_id) {
      setValue("subject_id", selectedRoutineData.subject_id);
    }
    if (selectedRoutineData && selectedRoutineData.teacher_id) {
      setValue("teacher_id", selectedRoutineData.teacher_id);
    }
    if (selectedRoutineData && selectedRoutineData.section_id) {
      setValue("section_id", selectedRoutineData.section_id);
    }
  }, [selectedRoutineData, setValue]);

  const onSubmit = (data) => {

    const {
      grade_id,
      day_id,
      period_id
    } = selectedData;

    const {
      section_id,
      teacher_id,
      subject_id
    } = data;

    // Get all routines for the selected day + period
    const routinesForDay = Object.values(masterRoutine).flat();

    /** -------------------------
     *  1️⃣ RULE 1:
     *  Prevent assigning same teacher in multiple classes for same period
     ---------------------------**/
    const conflictSamePeriod = routinesForDay.find(
      r =>
        r.teacher_id === teacher_id &&
        r.period_id === period_id &&
        r.day_id === day_id &&
        r.grade_id !== grade_id
    );

    if (conflictSamePeriod) {
      setShowErrorMessage("Teacher is already assigned to another class in this period.");
      setShowAlert("error");
      return;
    }

    /** -------------------------
     *  2️⃣ RULE 2:
     *  Teacher can be assigned more than 5 times, but show warning after 5
     ---------------------------**/
    const teacherAssignmentsToday = routinesForDay.filter(
      r => r.teacher_id === teacher_id && r.day_id === day_id
    ).length;

    if (teacherAssignmentsToday >= 5) {
      setShowErrorMessage("Warning: Teacher has been assigned more than 5 times today.");
      setShowAlert("error");
      // not returning → allow submission
    }

    /** -------------------------
     *  3️⃣ RULE 3:
     *  Same class + different section allowed, BUT subject must be same
     ---------------------------**/
    const sameClassConflict = routinesForDay.find(
      r =>
        r.teacher_id === teacher_id &&
        r.grade_id === grade_id &&
        r.section_id !== section_id &&
        r.period_id === period_id &&
        r.day_id === day_id &&
        r.subject_id !== subject_id
    );

    if (sameClassConflict) {
      setShowErrorMessage("Subject mismatch! Same class with multiple sections must have same subject.");
      setShowAlert("error");
      return;
    }

    /** -------------------------
     *  4️⃣ RULE 4:
     *  If period is break, skip validation
     ---------------------------**/
    if (selectedData.period_id === "Break") {
      // skip all validations or just return
      return;
    }

    // 👇 existing API payload
    const payload = {
      period_id,
      grade_id,
      section_id,
      teacher_id,
      subject_id,
      day_id,
    };

    createMasterRoutine(payload)
      .then((res) => {
        if (res?.data?.status === "success") {
          setShowAlert("success");
          setShowErrorMessage(`Routine ${isEditMode ? "updated" : "created"} successfully.`);
        } else {
          setShowAlert("error");
          setShowErrorMessage(res?.data?.message);
        }

        setTimeout(() => {
          handleClose(true);
          setShowAlert("");
        }, 1200);
      });
  };


  return (
    <React.Fragment>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        scroll="paper"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {isEditMode ? "Edit Routine" : "Create New Routine"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ height: "calc(100% - 64px)" }}
        >
          <DialogContent dividers>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <Controller
                    name="section_id"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <InputLabel error={!!error}>Section</InputLabel>
                        <Select
                          label="Section"
                          onChange={onChange}
                          value={value || ""}
                          error={!!error}
                        >
                          {sectionsList?.map((item) => (
                            <MenuItem
                              key={item.section_id}
                              value={item.section_id}
                            >
                              {item.section_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <Controller
                    name="subject_id"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <InputLabel error={!!error}>Subject</InputLabel>
                        <Select
                          label="Subject"
                          onChange={onChange}
                          value={value || ""}
                          error={!!error}
                        >
                          {subjectsList?.map((item) => (
                            <MenuItem
                              key={item.subject_id}
                              value={item.subject_id}
                            >
                              {item.subject_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <Controller
                    name="teacher_id"
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <InputLabel error={!!error}>Teacher</InputLabel>
                        <Select
                          label="Teacher"
                          onChange={onChange}
                          value={value || ""}
                          error={!!error}
                        >
                          {teachersList?.map((item) => (
                            <MenuItem
                              key={item.teacher_id}
                              value={item.teacher_id}
                            >
                              {item.teacher_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              className="me-3"
              variant="outlined"
              type="reset"
              onClick={reset}
            >
              Reset
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>

      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: showErrorMessage,
        })}
    </React.Fragment>
  );
};

export default CreateMasterRoutine;
