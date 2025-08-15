import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Grid,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { createStudentRouteMapping } from "../../ApiClient";
import { showAlertMessage } from "../AlertMessage";

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
    width: "75%",
    height: "100%",
    overflow: "hidden",
  },
}));

const CreateStudentRouteMapping = ({
  isOpen,
  handleClose,
  routesList = [],
  initialData = null,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      route_id: "",
      route_student_info: [{ stop_point_id: "", student_ids: [] }],
    },
  });

  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [routesStopsDataByRouteId, setRoutesStopsDataByRouteId] = useState({});
  const [selectedStopPoints, setSelectedStopPoints] = useState(new Set());
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showAlert, setShowAlert] = useState();

  const { fields: routeFields, append: appendRoute, remove: removeRoute } = useFieldArray({
    control,
    name: "route_student_info",
  });

  useEffect(() => {
    const stopDataById = routesList.reduce((acc, route) => {
      acc[route.route_id] = route.stop_points_data || [];
      return acc;
    }, {});
    setRoutesStopsDataByRouteId(stopDataById);

    if (initialData) {
      reset({
        route_id: initialData.route_id || "",
        route_student_info:
          initialData.route_student_info || [{ stop_point_id: "", student_ids: [] }],
      });
      updateSelections(initialData.route_student_info);
    }
  }, [initialData, reset, routesList]);

  const updateSelections = (routeStudentInfo) => {
    const newStopPoints = new Set();
    const newStudents = new Set();

    routeStudentInfo.forEach(({ stop_point_id, student_ids }) => {
      if (stop_point_id) newStopPoints.add(stop_point_id);
      student_ids?.forEach((id) => newStudents.add(id));
    });

    setSelectedStopPoints(newStopPoints);
    setSelectedStudents(newStudents);
  };

  const handleAddStop = () => {
    appendRoute({ stop_point_id: "", student_ids: [] });
  };

  const handleRemoveStop = (index) => {
    const { stop_point_id, student_ids } = getValues("route_student_info")[index];

    setSelectedStopPoints((prev) => {
      const updated = new Set(prev);
      if (stop_point_id) updated.delete(stop_point_id);
      return updated;
    });

    setSelectedStudents((prev) => {
      const updated = new Set(prev);
      student_ids?.forEach((id) => updated.delete(id));
      return updated;
    });

    removeRoute(index);
  };

  const handleRouteChange = (value) => {
    reset({
      route_id: value,
      route_student_info: [{ stop_point_id: "", student_ids: [] }],
    });
    setSelectedStopPoints(new Set());
    setSelectedStudents(new Set());
  };

  const onSubmit = async (data) => {
    try {
      const res = await createStudentRouteMapping(data);
      setShowAlert(res?.data?.status === "success" ? "success" : "error");
      setTimeout(() => {
        handleClose(true);
        setShowAlert("");
      }, 2000);
    } catch {
      setShowAlert("error");
      setTimeout(() => setShowAlert(""), 3000);
    }
  };

  return (
    <>
      <BootstrapDialog aria-labelledby="customized-dialog-title" open={isOpen}>
        <DialogTitle id="customized-dialog-title">
          Configure Student Routes
          <IconButton
            aria-label="close"
            onClick={() => handleClose(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form className="h-100" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            {/* Route Selector */}
            <Box sx={{ marginBottom: 3 }}>
              <Controller
                name="route_id"
                control={control}
                rules={{ required: "Route selection is required" }}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="route-id-label">Select Route</InputLabel>
                    <Select
                      {...field}
                      labelId="route-id-label"
                      label="Select Route"
                      onChange={(e) => {
                        field.onChange(e);
                        handleRouteChange(e.target.value);
                      }}
                      error={!!errors.route_id}
                    >
                      {routesList.map(({ route_id, route_name }) => (
                        <MenuItem key={route_id} value={route_id}>{route_name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Stop Points and Students Mapping */}
            {routeFields.map((route, index) => (
              <Box key={route.id} sx={{ marginBottom: 4 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Stop Point Selector */}
                  <Grid item xs={5}>
                    <Controller
                      name={`route_student_info.${index}.stop_point_id`}
                      control={control}
                      rules={{ required: "Stop Point selection is required" }}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id={`stop-point-label-${index}`}>Select Stop Point</InputLabel>
                          <Select
                            {...field}
                            labelId={`stop-point-label-${index}`}
                            label="Select Stop Point"
                            error={!!errors.route_student_info?.[index]?.stop_point_id}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setSelectedStopPoints((prev) => {
                                const updated = new Set(prev);
                                if (field.value) updated.delete(field.value);
                                updated.add(selectedValue);
                                return updated;
                              });
                              field.onChange(e);
                            }}
                          >
                            {routesStopsDataByRouteId[getValues("route_id")]?.map(({ stop_point_id, stop_point_name }) => (
                              <MenuItem
                                key={stop_point_id}
                                value={stop_point_id}
                                disabled={selectedStopPoints.has(stop_point_id)}
                              >
                                {stop_point_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Student Selector */}
                  <Grid item xs={5}>
                    <Controller
                      name={`route_student_info.${index}.student_ids`}
                      control={control}
                      rules={{ required: "At least one student must be selected" }}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id={`student-ids-label-${index}`}>Select Students</InputLabel>
                          <Select
                            {...field}
                            labelId={`student-ids-label-${index}`}
                            multiple
                            renderValue={(selected) =>
                              userInfo?.student_info
                                .filter(({ student_id }) => selected.includes(student_id))
                                .map(({ student_name }) => student_name)
                                .join(", ")
                            }
                            error={!!errors.route_student_info?.[index]?.student_ids}
                            onChange={(e) => {
                              const selectedValues = e.target.value;
                              setSelectedStudents((prev) => {
                                const updated = new Set(prev);
                                field.value.forEach((id) => {
                                  if (!selectedValues.includes(id)) updated.delete(id);
                                });
                                selectedValues.forEach((id) => updated.add(id));
                                return updated;
                              });
                              field.onChange(e);
                            }}
                          >
                            {userInfo?.student_info.map(({ student_id, student_name }) => (
                              <MenuItem key={student_id} value={student_id}>
                                <Checkbox checked={field.value.includes(student_id)} />
                                <ListItemText primary={student_name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={2} className="d-flex" textAlign="center">
                    {routeFields.length !== 1 && (
                      <DeleteIcon
                        color="error"
                        fontSize="large"
                        onClick={() => handleRemoveStop(index)}
                        sx={{ cursor: "pointer", marginRight: 2 }}
                      />
                    )}
                    {routeFields.length === index + 1 &&
                      getValues(`route_student_info.${index}.stop_point_id`) &&
                      getValues(`route_student_info.${index}.student_ids`)?.length > 0 && (
                        <AddBoxIcon
                          color="success"
                          fontSize="large"
                          onClick={handleAddStop}
                          sx={{ cursor: "pointer" }}
                        />
                      )}
                  </Grid>
                </Grid>
              </Box>
            ))}
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" type="reset" onClick={() => reset()}>Reset</Button>
            <Button variant="contained" color="primary" type="submit">Submit</Button>
          </DialogActions>
        </form>
      </BootstrapDialog>

      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: showAlert === "success" ? "Mapping saved successfully!" : "Failed to save mapping.",
        })}
    </>
  );
};

export default CreateStudentRouteMapping;
