import React, { useEffect, useState, useMemo } from "react";
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

const CreateTeacherClassMappingDialog = ({ open, onClose, onSuccess, gradeData, teacherList }) => {
  const { control, handleSubmit, reset, getValues, setValue, watch } = useForm({
    defaultValues: { teacher_mapper_data: [{ teacher_id: "", grade_id: "", section_id: "", is_class_teacher: false }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "teacher_mapper_data" });
  const [sectionsByRow, setSectionsByRow] = useState({});
  const [isTeacherFormValid, setIsTeacherFormValid] = useState(false);

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
      showAlertMessage({ open: true, alertFor: "error", message: "Please add at least one valid teacher mapping (Teacher, Grade, Section)." });
      return;
    }

    try {
      const res = await createTeacherClassMapping({ teacher_mapper_data: data.teacher_mapper_data });
      if (res?.data?.status === "success") {
        onSuccess && onSuccess();
        onClose(true);
      } else {
        // show failure via parent
        onClose(false);
      }
    } catch (err) {
      console.error(err);
      onClose(false);
    }
  };

  return (
    <BootstrapDialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>
        Create Teacher Class Mapping
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
                    <IconButton color="primary" size="small" onClick={() => {
                      append({ teacher_id: "", grade_id: "", section_id: "", is_class_teacher: false });
                      // ensure sections cache for new row is empty
                      setSectionsByRow((prev) => ({ ...prev, [fields.length]: [] }));
                    }}>
                      <AddBoxIcon />
                    </IconButton>
                  )}
                  <IconButton color="error" size="small" onClick={() => remove(index)} disabled={fields.length === 1}>
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

const CreateStudentClassMappingDialog = ({ open, onClose, onSuccess, gradeData }) => {
  const { control, handleSubmit, reset, getValues, setValue, watch } = useForm({
    defaultValues: { student_mapper_data: [{ student_id: "", grade_id: "", section_id: "", roll_no: "" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "student_mapper_data" });
  const [studentsByRow, setStudentsByRow] = useState({});
  const [isStudentFormValid, setIsStudentFormValid] = useState(false);

  useEffect(() => { if (!open) { reset(); setStudentsByRow({}); } }, [open, reset]);

  const studentWatch = useWatch({ control, name: "student_mapper_data" });
  useEffect(() => {
    // debug: inspect watched student rows
    console.log("[StudentMapping] studentWatch:", studentWatch);
    const valid = Array.isArray(studentWatch) && studentWatch.length > 0 && studentWatch.every(r => {
      if (!r || !r.student_id || !r.grade_id || !r.section_id) return false;
      // roll_no must be numeric and non-empty
      return /^\d+$/.test(String(r.roll_no));
    });
    console.log("[StudentMapping] computed valid:", valid);
    setIsStudentFormValid(valid);
  }, [studentWatch, setIsStudentFormValid]);

  const fetchStudentsForRow = async (gradeId, sectionId, rowIndex) => {
    if (!gradeId || !sectionId) return;
    try {
      const res = await getAllStudentsData(gradeId, sectionId);
      const list = res?.data?.student_details || [];
      setStudentsByRow((prev) => ({ ...prev, [rowIndex]: list }));
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    const hasValid = Array.isArray(data.student_mapper_data) && data.student_mapper_data.some(r => r.student_id && r.grade_id && r.section_id);
    if (!hasValid) {
      showAlertMessage({ open: true, alertFor: "error", message: "Please add at least one valid student mapping (Student, Grade, Section)." });
      return;
    }

    try {
      const res = await createStudentClassMapping({ student_mapper_data: data.student_mapper_data });
      if (res?.data?.status === "success") {
        onSuccess && onSuccess();
        onClose(true);
      } else {
        onClose(false);
      }
    } catch (err) {
      console.error(err);
      onClose(false);
    }
  };

  return (
    <BootstrapDialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>
        Create Student Class Mapping
        <IconButton onClick={() => onClose(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {fields.map((field, index) => (
            <Grid container spacing={2} alignItems="center" key={field.id} sx={{ mb: 1 }}>
              <Grid item xs={12} md={3}>
                <Controller name={`student_mapper_data.${index}.grade_id`} control={control} render={({ field: f }) => (
                  <FormControl fullWidth>
                    <InputLabel>Grade</InputLabel>
                    <Select value={f.value || ""} label="Grade" onChange={(e) => { const val = e.target.value; f.onChange(val); setValue(`student_mapper_data.${index}.section_id`, "", { shouldValidate: true, shouldDirty: true }); setValue(`student_mapper_data.${index}.student_id`, "", { shouldValidate: true, shouldDirty: true }); setStudentsByRow((prev) => ({ ...prev, [index]: [] })); }}>
                      {gradeData.map((g) => <MenuItem key={g.grade_id} value={g.grade_id}>{g.grade}</MenuItem>)}
                    </Select>
                  </FormControl>
                )} />
              </Grid>

              <Grid item xs={12} md={3}>
                <Controller name={`student_mapper_data.${index}.section_id`} control={control} render={({ field: f }) => {
                  const selectedGradeId = getValues(`student_mapper_data.${index}.grade_id`);
                  const sections = gradeData.find((g) => g.grade_id === selectedGradeId)?.section_list || [];
                  return (
                    <FormControl fullWidth>
                      <InputLabel>Section</InputLabel>
                      <Select value={f.value || ""} label="Section" onChange={(e) => { const val = e.target.value; f.onChange(val); fetchStudentsForRow(selectedGradeId, val, index); }}>
                        {sections.map((s) => <MenuItem key={s.section_id} value={s.section_id}>{s.section_name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  );
                }} />
              </Grid>

              <Grid item xs={12} md={3}>
                <Controller name={`student_mapper_data.${index}.student_id`} control={control} render={({ field: f }) => (
                  <FormControl fullWidth>
                    <InputLabel>Student</InputLabel>
                    <Select value={f.value || ""} label="Student" onChange={(e) => f.onChange(e.target.value)}>
                      {(studentsByRow[index] || []).map((s) => <MenuItem key={s.student_id} value={s.student_id}>{s.student_name}</MenuItem>)}
                    </Select>
                  </FormControl>
                )} />
              </Grid>

              <Grid item xs={12} md={2}>
                <Controller name={`student_mapper_data.${index}.roll_no`} control={control} render={({ field: f }) => (
                  <TextField
                    value={f.value || ""}
                    onChange={(e) => f.onChange(e.target.value.replace(/[^0-9]/g, ""))}
                    fullWidth
                    label="Roll No"
                    inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
                  />
                )} />
              </Grid>

              <Grid item xs={12} md={1}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {index === fields.length - 1 && (
                    <IconButton color="primary" size="small" onClick={() => {
                      append({ student_id: "", grade_id: "", section_id: "", roll_no: "" });
                      setStudentsByRow((prev) => ({ ...prev, [fields.length]: [] }));
                    }}>
                      <AddBoxIcon />
                    </IconButton>
                  )}
                  <IconButton color="error" size="small" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isStudentFormValid}>Save</Button>
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
    fetchAll();
    getGradeDetails().then((res) => {
      if (res?.data?.grade_details?.grade_details) setGradeData(res.data.grade_details.grade_details);
    }).catch(console.error);

    getTeachersData().then((res) => {
      if (res?.data?.teachers) setTeacherList(res.data.teachers);
    }).catch(console.error);
  }, []);

  useEffect(() => { fetchAll(); }, [refreshFlag]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const tRes = await getTeacherClassMappings();
      const sRes = await getStudentClassMappings();
      setTeacherMappings(tRes?.data?.teacher_mapper_data || []);
      setStudentMappings(sRes?.data?.student_mapper_data || []);
    } catch (err) {
      console.error(err);
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
        <Box className="d-flex align-items-center justify-content-between mb-2">
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Teacher Class Mappings</h1>
          <TeacherToolbarActions />
        </Box>
        <CommonMatTable columns={teacherColumns} data={teacherMappings} isLoading={loading} renderTopToolbar={() => null} />
      </div>

      <div className="mt-5">
        <Box className="d-flex align-items-center justify-content-between mb-2">
          <h1 style={{ fontSize: 18, marginTop: 10 }}>Student Class Mappings</h1>
          <StudentToolbarActions />
        </Box>
        <CommonMatTable columns={studentColumns} data={studentMappings} isLoading={loading} renderTopToolbar={() => null} />
      </div>

      <CreateTeacherClassMappingDialog open={isTeacherModalOpen} onClose={(didChange) => { setIsTeacherModalOpen(false); if (didChange) setRefreshFlag((p) => !p); }} onSuccess={() => { setAlertConfig({ open: true, alertFor: "success", message: "Teacher mapping created" }); }} gradeData={gradeData} teacherList={teacherList} />

      <CreateStudentClassMappingDialog open={isStudentModalOpen} onClose={(didChange) => { setIsStudentModalOpen(false); if (didChange) setRefreshFlag((p) => !p); }} onSuccess={() => { setAlertConfig({ open: true, alertFor: "success", message: "Student mapping created" }); }} gradeData={gradeData} />
    </>
  );
};

export default TeacherStudentCallMapping;
