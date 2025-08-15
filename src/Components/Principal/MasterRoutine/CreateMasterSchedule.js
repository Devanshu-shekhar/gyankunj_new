import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { showAlertMessage } from "../../AlertMessage";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  getMasterRoutineMetadataInfo,
  upsertMasterSchedule,
} from "../../../ApiClient";

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
    overflow: "hidden",
  },
}));

const CreateMasterSchedule = ({ isOpen, handleClose, selectedRoutineType }) => {
  const { handleSubmit, reset, control, setValue, getValues } = useForm();
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState("");

  const periodDurationsList = [15, 30, 45, 60];

  useEffect(() => {
    if (userInfo.routine_id) {
      getMasterRoutineMetadataInfo(userInfo.routine_id)
        .then((res) => {
          if (res?.data?.routine_details?.length > 0) {
            const savedData = res.data.routine_details[0];
            setValue("routine_type", savedData.routine_type);
            setValue(
              "start_time",
              savedData.start_time
                ? dayjs(savedData.start_time, "HH:mm:ss")
                : null
            );
            setValue(
              "end_time",
              savedData.end_time ? dayjs(savedData.end_time, "HH:mm:ss") : null
            );
            setValue("period_count", savedData.period_count);
            setValue("period_duration", savedData.period_duration);
            setValue(
              "break_start_time",
              savedData.break_start_time
                ? dayjs(savedData.break_start_time, "HH:mm:ss")
                : null
            );
            setValue(
              "break_end_time",
              savedData.break_end_time
                ? dayjs(savedData.break_end_time, "HH:mm:ss")
                : null
            );
            setValue(
              "assembly_start_time",
              savedData.assembly_start_time
                ? dayjs(savedData.assembly_start_time, "HH:mm:ss")
                : null
            );
            setValue(
              "assembly_end_time",
              savedData.assembly_end_time
                ? dayjs(savedData.assembly_end_time, "HH:mm:ss")
                : null
            );
            setIsEditMode(true);
          }
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const onSubmit = (data) => {
    // Helper function to format time to "HH:mm:ss"
    const formatTime = (time) => (time ? dayjs(time).format("HH:mm:ss") : null);

    // Construct payload from form data
    const payload = {
      routine_type: data.routine_type,
      start_time: formatTime(data.start_time),
      end_time: formatTime(data.end_time),
      period_count: data.period_count,
      period_duration: data.period_duration,
      break_start_time: formatTime(data.break_start_time),
      break_end_time: formatTime(data.break_end_time),
      assembly_start_time: formatTime(data.assembly_start_time),
      assembly_end_time: formatTime(data.assembly_end_time),
    };

    // Send payload to server
    upsertMasterSchedule(payload, isEditMode)
      .then((res) => {
        if (res?.data?.status === "success") {
          setShowAlert("success");
        } else {
          setShowAlert("error");
        }
        setTimeout(() => {
          handleClose(true);
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
      });
  };

  const renderTimePicker = (name, label, dependentField) => (
      <Controller
        name={name}
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              label={label}
              ampm={false}
              value={value || null}
              minTime={name.includes("end") && dependentField ? getValues()[dependentField] : null}
              format="HH:mm"
              onChange={(val) => {
                onChange(val ? dayjs(val) : null);
                if (name.includes("start") && dependentField) {
                  setValue(dependentField, null);
                }
              }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  error: !!error,
                },
              }}
            />
          </LocalizationProvider>
        )}
      />
    );

  return (
    <BootstrapDialog
      aria-labelledby="customized-dialog-title"
      open={isOpen}
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {isEditMode ? "Edit Schedule" : "Create New Schedule"}
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
      </DialogTitle>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="routine_type"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Routine Type"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}  
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              {renderTimePicker("start_time", "Start Time", "end_time")}
            </Grid>
            <Grid item xs={6}>
              {renderTimePicker("end_time", "End Time", "start_time")}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="period_count"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      onChange={onChange}
                      value={value || ""}
                      fullWidth
                      label="Period Count"
                      type="number"
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name="period_duration"
                  control={control}
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                    <InputLabel error={!!error}>Period Duration</InputLabel>
                    <Select
                      label="Period Duration"
                      onChange={onChange}
                      value={value || ""}
                      error={!!error}
                    >
                      {periodDurationsList.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                    </>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              {renderTimePicker(
                "break_start_time",
                "Break Start Time",
                "break_end_time"
              )}
            </Grid>
            <Grid item xs={6}>
              {renderTimePicker("break_end_time", "Break End Time", "break_start_time")}
            </Grid>
            <Grid item xs={6}>
              {renderTimePicker(
                "assembly_start_time",
                "Assembly Start Time",
                "assembly_end_time"
              )}
            </Grid>
            <Grid item xs={6}>
              {renderTimePicker("assembly_end_time", "Assembly End Time", "assembly_start_time")}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            className="me-3"
            variant="outlined"
            type="reset"
            onClick={() => reset()}
          >
            Reset
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </DialogActions>
      </Box>
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: `The routine ${isEditMode ? "updation" : "creation"} ${
            showAlert === "success" ? "succeeded" : "failed"
          }.`,
        })}
    </BootstrapDialog>
  );
};

export default CreateMasterSchedule;
