import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { createFeesStructures } from "../../../../ApiClient";
import { showAlertMessage } from "../../../AlertMessage";

const CreateFeesStructure = ({ isOpen, handleClose, metadata }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [alert, setAlert] = useState({ type: "", message: "" });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      fee_structure_info: [
        {
          fee_type_id: null,
          fee_frequency_id: null,
          fee_occurrence_id: null,
          charge: null,
          grade_ids: [],
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fee_structure_info",
  });

  const onSubmit = async (data) => {
    try {
      const res = await createFeesStructures(data);
      if (res?.data?.status === "success") {
        setAlert({
          type: "success",
          message: "The fees structure creation succeeded.",
        });
        setTimeout(() => {
          handleClose(true);
          setAlert({ type: "", message: "" });
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message: res?.data?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Failed to create fees structure." });
    }
  };

  return (
    <React.Fragment>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={isOpen}
        scroll="paper"
        PaperProps={{
          sx: {
            maxWidth: isMobile ? "90%" : "60%",
            width: "100%",
            margin: isMobile ? 1 : "auto",
          },
        }}
      >
        <DialogTitle>
          Create Fees Structure
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ height: "calc(100% - 64px)" }}
        >
          <DialogContent>
            {fields.map((item, index) => (
              <Box key={item.id} sx={{ mb: 2, border: "1px solid #ddd", p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Fee Structure {index + 1}
                </Typography>
                <Grid container spacing={2}>
                  {/* Fee Type Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <Controller
                        name={`fee_structure_info[${index}].fee_type_id`}
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <InputLabel error={!!error}>Fee Type</InputLabel>
                            <Select
                              label="Fee Type"
                              onChange={onChange}
                              value={value || ""}
                              error={!!error}
                            >
                              {Object.entries(metadata.feeTypes).map(
                                ([id, name]) => (
                                  <MenuItem key={id} value={id}>
                                    {name}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Frequency Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <Controller
                        name={`fee_structure_info[${index}].fee_frequency_id`}
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <InputLabel error={!!error}>Frequency</InputLabel>
                            <Select
                              label="Frequency"
                              onChange={onChange}
                              value={value || ""}
                              error={!!error}
                            >
                              {Object.entries(metadata.feeFrequencies).map(
                                ([id, name]) => (
                                  <MenuItem key={id} value={id}>
                                    {name}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Occurrence Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <Controller
                        name={`fee_structure_info[${index}].fee_occurrence_id`}
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <InputLabel error={!!error}>Occurrence</InputLabel>
                            <Select
                              label="Occurrence"
                              onChange={onChange}
                              value={value || ""}
                              error={!!error}
                            >
                              {Object.entries(metadata.feeOccurrences).map(
                                ([id, name]) => (
                                  <MenuItem key={id} value={id}>
                                    {name}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Charge Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <Controller
                        name={`fee_structure_info[${index}].charge`}
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
                            type="number"
                            label="Charge"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Grades Field */}
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                      <Controller
                        name={`fee_structure_info[${index}].grade_ids`}
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <InputLabel error={!!error}>Grades</InputLabel>
                            <Select
                              label="Grades"
                              multiple
                              onChange={onChange}
                              value={value || ""}
                              error={!!error}
                              renderValue={(selected) =>
                                selected
                                  .map((id) => metadata.grades[id])
                                  .join(", ")
                              }
                            >
                              {Object.entries(metadata.grades).map(
                                ([id, name]) => (
                                  <MenuItem key={id} value={id}>
                                    <Checkbox checked={value.includes(id)} />
                                    <ListItemText primary={name} />
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Remove Button */}
                  {fields.length > 1 && (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={4}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <IconButton onClick={() => remove(index)} color="error">
                        <Delete />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}

            {/* Add Fee Structure Button */}
            {isValid && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  append({
                    fee_type_id: "",
                    fee_frequency_id: "",
                    fee_occurrence_id: "",
                    charge: "",
                    grade_ids: [],
                  })
                }
              >
                Add Fee Structure
              </Button>
            )}
          </DialogContent>

          {/* Dialog Actions */}
          <DialogActions>
            <Button variant="outlined" type="reset" onClick={() => reset()}>
              Reset
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Alert Message */}
      {alert.type &&
        showAlertMessage({
          open: true,
          alertFor: alert.type,
          message: alert.message,
        })}
    </React.Fragment>
  );
};

export default CreateFeesStructure;
