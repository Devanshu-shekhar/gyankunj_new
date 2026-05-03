import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  IconButton,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { styled } from "@mui/material/styles";
import CommonMatTable from "../../SharedComponents/CommonMatTable";
import {
  getTeacherClassMappings,
  createTeacherClassMapping,
  getStudentClassMappings,
  createStudentClassMapping,
  getGradeDetails,
  getTeachersData,
  getAllStudentsData,
} from "../../ApiClient";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { showAlertMessage } from "../AlertMessage";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": { padding: theme.spacing(2) },
  "& .MuiDialogActions-root": { padding: theme.spacing(1) },
  "& .MuiDialog-paper": { maxWidth: "90%", width: "75%" },
}));

// Default sample data (used when API calls fail) 🔧
const DEFAULT_GRADE_DATA = [
  { grade_id: "1", grade: "Grade 1", section_list: [{ section_id: "A", section_name: "A" }, { section_id: "B", section_name: "B" }] },
  { grade_id: "2", grade: "Grade 2", section_list: [{ section_id: "A", section_name: "A" }] },
];

const DEFAULT_TEACHER_LIST = [
  { teacher_id: "T1", teacher_name: "John Doe" },
  { teacher_id: "T2", teacher_name: "Jane Smith" },
];

const DEFAULT_TEACHER_MAPPINGS = [
  { teacher_id: "T1", grade_id: "1", section_id: "A", is_class_teacher: true },
  { teacher_id: "T2", grade_id: "1", section_id: "B", is_class_teacher: false },
];

const DEFAULT_STUDENT_MAPPINGS = [
  { student_id: "S1", student_name: "Alice", grade_id: "1", section_id: "A", roll_no: "1" },
  { student_id: "S2", student_name: "Bob", grade_id: "1", section_id: "B", roll_no: "2" },
];

const CreateTeacherClassMappingDialog = ({ open, onClose, onSuccess, onError, gradeData, teacherList }) => {
  const { control, handleSubmit, reset, getValues, setValue } = useForm({
    defaultValues: { teacher_mapper_data: [{ teacher_id: "", grade_id: "", section_id: "", is_class_teacher: false }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "teacher_mapper_data" });
  const [sectionsByRow, setSectionsByRow] = useState({});
  const [isTeacherFormValid, setIsTeacherFormValid] = useState(false);
  const teacherAppendRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    reset();
    setSectionsByRow({});
  }, [open, reset]);

  const teacherWatch = useWatch({ control, name: "teacher_mapper_data" });
  useEffect(() => {
    // debug: inspect watched teacher rows
    console.log("[TeacherMapping] teacherWatch:", teacherWatch);
    const valid = Array.isArray(teacherWatch) && teacherWatch.length > 0 && teacherWatch.every(r => r && String(r.teacher_id).trim() !== "" && String(r.grade_id).trim() !== "" && String(r.section_id).trim() !== "");
    console.log("[TeacherMapping] computed valid:", valid);
    setIsTeacherFormValid(valid);
  }, [teacherWatch, setIsTeacherFormValid]);



  const onSubmit = async (data) => {
    // ensure at least one valid mapping row
    const hasValid = Array.isArray(data.teacher_mapper_data) && data.teacher_mapper_data.some(r => r.teacher_id && r.grade_id && r.section_id);
    if (!hasValid) {
      if (onError) onError("Please add at least one valid teacher mapping (Teacher, Grade, Section).");
      else showAlertMessage({ open: true, alertFor: "error", message: "Please add at least one valid teacher mapping (Teacher, Grade, Section)." });
      return;
    }

    try {
      const res = await createTeacherClassMapping({ teacher_mapper_data: data.teacher_mapper_data });
      if (res?.data?.status === "success") {
        onSuccess && onSuccess();
        onClose(true);
      } else {
        const msg = res?.data?.message || "Failed to create teacher mapping";
        if (onError) onError(msg);
        else showAlertMessage({ open: true, alertFor: "error", message: msg });
        onClose(false);
      }
    } catch (err) {
      console.error(err);
      if (onError) onError(err?.message || "Failed to create teacher mapping");
      onClose(false);
    }
  };

  return (
    <BootstrapDialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>
        Teacher Mapping
        <IconButton onClick={() => onClose(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {fields.map((field, index) => (
            <Grid container spacing={2} alignItems="center" key={field.id} sx={{ mb: 1 }}>
              <Grid item xs={12} md={3}>
                <Controller name={`teacher_mapper_data.${index}.teacher_id`} control={control} render={({ field: f }) => (
                  <FormControl fullWidth>
                    <InputLabel>Teacher</InputLabel>
                    <Select value={f.value || ""} onChange={(e) => f.onChange(e.target.value)} label="Teacher">
                      {teacherList.map((t) => (
                        <MenuItem key={t.teacher_id} value={t.teacher_id}>{t.teacher_name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )} />
              </Grid>

              <Grid item xs={6} md={2}>
                <Controller name={`teacher_mapper_data.${index}.grade_id`} control={control} render={({ field: f }) => (
                  <FormControl fullWidth>
                    <InputLabel>Grade</InputLabel>
                    <Select
                        value={f.value || ""}
                      label="Grade"
                      onChange={(e) => {
                        const gradeVal = e.target.value;
                        f.onChange(gradeVal);
                        // reset dependent field and trigger validation
                        setValue(`teacher_mapper_data.${index}.section_id`, "", { shouldValidate: true, shouldDirty: true });
                        // compute sections for this row and cache them
                        const sections = gradeData.find((g) => String(g.grade_id) === String(gradeVal))?.section_list || [];
                        setSectionsByRow((prev) => ({ ...prev, [index]: sections }));
                      }}
                    >
                      {gradeData.map((g) => (
                        <MenuItem key={g.grade_id} value={g.grade_id}>{g.grade}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )} />
              </Grid>

              <Grid item xs={6} md={3}>
                <Controller name={`teacher_mapper_data.${index}.section_id`} control={control} render={({ field: f }) => {
                  const selectedGradeId = getValues(`teacher_mapper_data.${index}.grade_id`);
                  // prefer cached sections if available (set when grade changed), otherwise compute
                  const sections = sectionsByRow[index] && sectionsByRow[index].length > 0 ? sectionsByRow[index] : (gradeData.find((g) => String(g.grade_id) === String(selectedGradeId))?.section_list || []);
                  return (
                    <FormControl fullWidth>
                      <InputLabel>Section</InputLabel>
                      <Select value={f.value || ""} onChange={(e) => f.onChange(e.target.value)} label="Section">
                        {sections.length === 0 ? (
                          <MenuItem value="">No sections available</MenuItem>
                        ) : (
                          sections.map((s) => (
                            <MenuItem key={s.section_id} value={s.section_id}>{s.section_name}</MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  );
                }} />
              </Grid>

              <Grid item xs={6} md={2}>
                <Controller name={`teacher_mapper_data.${index}.is_class_teacher`} control={control} render={({ field: f }) => (
                  <FormControl>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Checkbox checked={!!f.value} onChange={(e) => f.onChange(e.target.checked)} />
                      Class Teacher
                    </Box>
                  </FormControl>
                )} />
              </Grid>

              <Grid item xs={6} md={2}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {index === fields.length - 1 && (
                    <IconButton type="button" color="primary" size="small" onClick={() => {
                      const now = Date.now();
                      if (teacherAppendRef.current && now - teacherAppendRef.current < 300) return;
                      teacherAppendRef.current = now;
                      append({ teacher_id: "", grade_id: "", section_id: "", is_class_teacher: false });
                      // ensure sections cache for new row is empty
                      setSectionsByRow((prev) => ({ ...prev, [fields.length]: [] }));
                    }}>
                      <AddBoxIcon />
                    </IconButton>
                  )}
                  <IconButton type="button" color="error" size="small" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isTeacherFormValid}>Save</Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
};

const CreateStudentClassMappingDialog = ({ open, onClose, onSuccess, onError, gradeData }) => {
  // State for filters
  const [filterGradeId, setFilterGradeId] = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [initialFormData, setInitialFormData] = useState({});

  // Form state
  const { control, handleSubmit, reset, watch, getValues } = useForm({
    defaultValues: { students_mapping: [] },
  });

  const studentsMappingWatch = watch("students_mapping");

  // Reset on dialog open/close
  useEffect(() => {
    if (!open) {
      reset({ students_mapping: [] });
      setFilterGradeId("");
      setFilterSectionId("");
      setStudentList([]);
      setSearchTerm("");
      setInitialFormData({});
    }
  }, [open, reset]);

  // Available sections based on selected grade
  const availableSections = filterGradeId
    ? gradeData.find((g) => String(g.grade_id) === String(filterGradeId))?.section_list || []
    : [];

  // Auto-fetch students when grade + section filter changes
  useEffect(() => {
    if (!filterGradeId || !filterSectionId) {
      setStudentList([]);
      reset({ students_mapping: [] });
      return;
    }

    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const res = await getAllStudentsData(filterGradeId, filterSectionId);
        const students = res?.data?.student_details || [];
        setStudentList(students);

        // Initialize form with student data
        const mappedStudents = students.map((s) => ({
          student_id: s.user_id || s.student_id || "",
          student_name: s.name || s.student_name || "",
          current_grade_id: filterGradeId,
          current_section_id: filterSectionId,
          current_roll_no: s.roll_no || "",
          new_grade_id: filterGradeId,
          new_section_id: filterSectionId,
          new_roll_number: s.roll_no || "",
        }));

        // Store initial data to check for changes later
        setInitialFormData(JSON.stringify(mappedStudents));
        reset({ students_mapping: mappedStudents });
      } catch (err) {
        console.error("[StudentMapping] Error fetching students:", err);
        setStudentList([]);
        reset({ students_mapping: [] });
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [filterGradeId, filterSectionId, reset]);

  // Check if form has changes
  const hasChanges = () => {
    const currentData = getValues("students_mapping");
    return JSON.stringify(currentData) !== initialFormData;
  };

  // Filter students based on search term
  const filteredStudents = studentsMappingWatch.filter((student) =>
    (student.student_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data) => {
    if (!data.students_mapping || data.students_mapping.length === 0) {
      const msg = "Please select a grade and section to fetch students.";
      if (onError) onError(msg);
      else showAlertMessage({ open: true, alertFor: "error", message: msg });
      return;
    }

    // Filter out unchanged records
    const changedMappings = data.students_mapping.filter((current, idx) => {
      const original = studentList[idx];
      return (
        current.new_grade_id !== original.grade_id ||
        current.new_section_id !== original.section_id ||
        String(current.new_roll_number) !== String(original.roll_no)
      );
    });

    if (changedMappings.length === 0) {
      const msg = "No changes detected. Please modify at least one student mapping.";
      if (onError) onError(msg);
      else showAlertMessage({ open: true, alertFor: "error", message: msg });
      return;
    }

    try {
      // Format payload to match expected API structure
      const payload = {
        student_mapper_data: changedMappings.map((s) => ({
          student_id: s.student_id,
          grade_id: s.new_grade_id,
          section_id: s.new_section_id,
          roll_no: s.new_roll_number,
        })),
      };

      const res = await createStudentClassMapping(payload);
      if (res?.data?.status === "success") {
        onSuccess && onSuccess();
        onClose(true);
      } else {
        const msg = res?.data?.message || "Failed to create student mapping";
        if (onError) onError(msg);
        else showAlertMessage({ open: true, alertFor: "error", message: msg });
        onClose(false);
      }
    } catch (err) {
      console.error("[StudentMapping] Submit error:", err);
      if (onError) onError(err?.message || "Failed to create student mapping");
      onClose(false);
    }
  };

  return (
    <BootstrapDialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>
        Student Class Mapping
        <IconButton onClick={() => onClose(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ p: 2 }}>
          {/* ===== TOP FILTER SECTION ===== */}
          <Box sx={{ mb: 3, pb: 2, borderBottom: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Select Grade & Section to Load Students
            </Typography>
            <Grid container spacing={2}>
              {/* Grade Filter */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={filterGradeId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFilterGradeId(val);
                      setFilterSectionId(""); // Reset section
                      setStudentList([]);
                      reset({ students_mapping: [] });
                    }}
                    label="Grade"
                  >
                    <MenuItem value="">Select Grade</MenuItem>
                    {gradeData.map((g) => (
                      <MenuItem key={g.grade_id} value={g.grade_id}>
                        {g.grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Section Filter */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!filterGradeId}>
                  <InputLabel>Section</InputLabel>
                  <Select
                    value={filterSectionId}
                    onChange={(e) => {
                      setFilterSectionId(e.target.value);
                    }}
                    label="Section"
                  >
                    <MenuItem value="">Select Section</MenuItem>
                    {availableSections.map((s) => (
                      <MenuItem key={s.section_id} value={s.section_id}>
                        {s.section_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>


            </Grid>
          </Box>

          {/* ===== STUDENT LIST SECTION ===== */}
          {studentList.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
              />

              {/* Student List */}
              {filteredStudents.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {filteredStudents.map((student, index) => {
                    const fieldIndex = studentsMappingWatch.findIndex(
                      (s) => s.student_id === student.student_id
                    );

                    if (fieldIndex === -1) return null;

                    return (
                      <Box
                        key={student.student_id}
                        sx={{
                          p: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          backgroundColor: "#fafafa",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        {/* Current Info Section */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1976d2" }}>
                              📍 Current Grade
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                              Student Name
                            </Typography>
                            <Typography variant="body2">{student.student_name}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                              Current Grade
                            </Typography>
                            <Typography variant="body2">{student.current_grade_id || "-"}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                              Current Section
                            </Typography>
                            <Typography variant="body2">{student.current_section_id || "-"}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" sx={{ color: "#666", display: "block" }}>
                              Roll Number
                            </Typography>
                            <Typography variant="body2">{student.current_roll_no || "-"}</Typography>
                          </Grid>
                        </Grid>

                        {/* New Mapping Section */}
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#d32f2f" }}>
                              ✏️ New Mapping
                            </Typography>
                          </Grid>

                          {/* New Grade */}
                          <Grid item xs={12} sm={4}>
                            <Controller
                              name={`students_mapping.${fieldIndex}.new_grade_id`}
                              control={control}
                              render={({ field: f }) => {
                                // Filter grades to show only current or above
                                const currentGradeLevel = parseInt(student.current_grade_id) || 0;
                                const availableNewGrades = gradeData.filter((g) => {
                                  const gradeLevel = parseInt(g.grade_id) || 0;
                                  return gradeLevel >= currentGradeLevel;
                                });

                                return (
                                  <FormControl fullWidth size="small">
                                    <InputLabel>New Grade</InputLabel>
                                    <Select
                                      value={f.value || ""}
                                      onChange={(e) => {
                                        f.onChange(e.target.value);
                                        // Reset section when grade changes
                                        control._formValues.students_mapping[fieldIndex].new_section_id = "";
                                      }}
                                      label="New Grade"
                                    >
                                      {availableNewGrades.map((g) => (
                                        <MenuItem key={g.grade_id} value={g.grade_id}>
                                          {g.grade}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                );
                              }}
                            />
                          </Grid>

                          {/* New Section */}
                          <Grid item xs={12} sm={4}>
                            <Controller
                              name={`students_mapping.${fieldIndex}.new_section_id`}
                              control={control}
                              render={({ field: f }) => {
                                const selectedNewGrade = getValues(
                                  `students_mapping.${fieldIndex}.new_grade_id`
                                );
                                const newAvailableSections = selectedNewGrade
                                  ? gradeData.find((g) => String(g.grade_id) === String(selectedNewGrade))
                                      ?.section_list || []
                                  : [];

                                return (
                                  <FormControl fullWidth size="small">
                                    <InputLabel>New Section</InputLabel>
                                    <Select
                                      value={f.value || ""}
                                      onChange={(e) => f.onChange(e.target.value)}
                                      label="New Section"
                                    >
                                      {newAvailableSections.map((s) => (
                                        <MenuItem key={s.section_id} value={s.section_id}>
                                          {s.section_name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                );
                              }}
                            />
                          </Grid>

                          {/* New Roll Number */}
                          <Grid item xs={12} sm={4}>
                            <Controller
                              name={`students_mapping.${fieldIndex}.new_roll_number`}
                              control={control}
                              render={({ field: f }) => (
                                <TextField
                                  value={f.value || ""}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, "");
                                    f.onChange(val);
                                  }}
                                  fullWidth
                                  label="New Roll No"
                                  size="small"
                                  inputProps={{ inputMode: "numeric" }}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "#999", textAlign: "center", py: 2 }}>
                  No students match your search
                </Typography>
              )}
            </Box>
          )}

          {/* Empty State */}
          {isLoadingStudents && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Loading students...
              </Typography>
            </Box>
          )}

          {/* Empty State */}
          {studentList.length === 0 && !isLoadingStudents && (filterGradeId || filterSectionId) && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                No students found for the selected grade and section
              </Typography>
            </Box>
          )}

          {/* No Filter Selected */}
          {studentList.length === 0 && !filterGradeId && !filterSectionId && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Select a grade and section above to load students
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={studentList.length === 0 || !hasChanges()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
};

const TeacherStudentCallMapping = () => {
  const [teacherMappings, setTeacherMappings] = useState([]);
  const [studentMappings, setStudentMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [gradeData, setGradeData] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);

  useEffect(() => {
    // auto-clear alert after 1 second (1000ms)
    if (!alertConfig) return;
    const t = setTimeout(() => setAlertConfig(null), 2000);
    return () => clearTimeout(t);
  }, [alertConfig]);

  useEffect(() => {
    fetchAll();
    getGradeDetails().then((res) => {
      if (res?.data?.grade_details?.grade_details) setGradeData(res.data.grade_details.grade_details);
    }).catch((err) => {
      console.error(err);
      setGradeData(DEFAULT_GRADE_DATA);
      setAlertConfig({ open: true, alertFor: "warning", message: "Using sample grade data due to API error" });
    });

    getTeachersData().then((res) => {
      if (res?.data?.teachers) setTeacherList(res.data.teachers);
    }).catch((err) => {
      console.error(err);
      setTeacherList(DEFAULT_TEACHER_LIST);
      setAlertConfig({ open: true, alertFor: "warning", message: "Using sample teacher list due to API error" });
    });
  }, []);

  useEffect(() => { fetchAll(); }, [refreshFlag]);

  const fetchAll = async () => {
    setLoading(true);

    // fetch teacher mappings (with fallback)
    try {
      const tRes = await getTeacherClassMappings();
      setTeacherMappings(tRes?.data?.teacher_mapper_data || DEFAULT_TEACHER_MAPPINGS);
    } catch (err) {
      console.error("Failed to fetch teacher mappings:", err);
      setTeacherMappings(DEFAULT_TEACHER_MAPPINGS);
      setAlertConfig({ open: true, alertFor: "warning", message: "Using sample teacher mappings due to API error" });
    }

    // fetch student mappings (with fallback)
    try {
      const sRes = await getStudentClassMappings();
      setStudentMappings(sRes?.data?.student_mapper_data || DEFAULT_STUDENT_MAPPINGS);
    } catch (err) {
      console.error("Failed to fetch student mappings:", err);
      setStudentMappings(DEFAULT_STUDENT_MAPPINGS);
      setAlertConfig({ open: true, alertFor: "warning", message: "Using sample student mappings due to API error" });
    }

    setLoading(false);
  };

  const teacherColumns = useMemo(() => [
    { accessorKey: "teacher_id", header: "Teacher ID" },
    { accessorFn: (row) => (teacherList.find((t) => t.teacher_id === row.teacher_id)?.teacher_name || row.teacher_id), header: "Teacher" },
    { accessorFn: (row) => gradeData.find((g) => g.grade_id === row.grade_id)?.grade || row.grade_id, header: "Grade" },
    { accessorFn: (row) => gradeData.find((g) => g.grade_id === row.grade_id)?.section_list?.find((s) => s.section_id === row.section_id)?.section_name || row.section_id, header: "Section" },
    { accessorFn: (row) => (row.is_class_teacher ? "Yes" : "No"), header: "Class Teacher" },
  ], [gradeData, teacherList]);

  const studentColumns = useMemo(() => [
    { accessorKey: "student_id", header: "Student ID" },
    { accessorFn: (row) => row.student_name || row.student_id, header: "Student" },
    { accessorFn: (row) => gradeData.find((g) => g.grade_id === row.grade_id)?.grade || row.grade_id, header: "Grade" },
    { accessorFn: (row) => gradeData.find((g) => g.grade_id === row.grade_id)?.section_list?.find((s) => s.section_id === row.section_id)?.section_name || row.section_id, header: "Section" },
    { accessorKey: "roll_no", header: "Roll No" },
  ], [gradeData]);

  const TeacherToolbarActions = () => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button variant="contained" onClick={() => setIsTeacherModalOpen(true)}>Create Mapping</Button>
    </Box>
  );

  const StudentToolbarActions = () => (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button variant="contained" onClick={() => setIsStudentModalOpen(true)}>Create Mapping</Button>
    </Box>
  );

  return (
    <>
      {alertConfig && showAlertMessage(alertConfig)}

      <div className="mt-5">
        <Box className="d-flex align-items-center justify-content-end mb-2">
          <TeacherToolbarActions />
        </Box>
        <CommonMatTable columns={teacherColumns} data={teacherMappings} isLoading={loading} renderTopToolbar={() => (
            <h1 style={{ fontSize: 18, marginTop: 10 }}>Teacher Mappings</h1>
          )} />
      </div>

      <div className="mt-5">
        <Box className="d-flex align-items-center justify-content-end mb-2">
          <StudentToolbarActions />
        </Box>
        <CommonMatTable columns={studentColumns} data={studentMappings} isLoading={loading} renderTopToolbar={() => (
            <h1 style={{ fontSize: 18, marginTop: 10 }}>Student Mappings</h1>
          )} />
      </div>

      <CreateTeacherClassMappingDialog open={isTeacherModalOpen} onClose={(didChange) => { setIsTeacherModalOpen(false); if (didChange) setRefreshFlag((p) => !p); }} onSuccess={() => { setAlertConfig({ open: true, alertFor: "success", message: "Teacher mapping created" }); }} onError={(msg) => setAlertConfig({ open: true, alertFor: "error", message: msg })} gradeData={gradeData} teacherList={teacherList} />

      <CreateStudentClassMappingDialog open={isStudentModalOpen} onClose={(didChange) => { setIsStudentModalOpen(false); if (didChange) setRefreshFlag((p) => !p); }} onSuccess={() => { setAlertConfig({ open: true, alertFor: "success", message: "Student mapping created" }); }} onError={(msg) => setAlertConfig({ open: true, alertFor: "error", message: msg })} gradeData={gradeData} />
    </>
  );
};

export default TeacherStudentCallMapping;
