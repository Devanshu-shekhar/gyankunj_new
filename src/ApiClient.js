import axios from "axios";

// const loginUser = (data) => {
//     return apiInstance.post(`/login`, data)
// }
const apiInstance = axios.create({
  baseURL: "http://13.200.112.20:5005",
});

async function handleAPI(recdConfig) {
  const config = recdConfig;
  const token = JSON.parse(localStorage.getItem("UserData"));
  const tokenId = token.token;
  try {
    config.headers["x-access-tokens"] = tokenId;
    return config;
  } catch (err) {
    return config;
  }
}

apiInstance.interceptors.request.use(
  async (recdConfig) => {
    return handleAPI(recdConfig);
  },
  (error) => Promise.reject(error)
);

const createMasterRoutine = (data) => {
  return apiInstance.post(`/save_master_routine`, data);
};

const getMasterRoutineData = () => {
  return apiInstance.get(`/create_master_routine`);
};

const viewLogBook = (date, grade, section) => {
  return apiInstance.get(
    `/view_log_book?date=${date}&grade_id=${grade}&section_id=${section}`
  );
};

const viewMasterRoutine = (day, grade) => {
  return apiInstance.get(`/view_master_routine?day=${day}&grade_id=${grade}`);
};

const getViewMasterRoutineData = (day) => {
  return apiInstance.get(`/view_master_routine?day_id=${day}`);
};

const attendanceOverview = (grade, section) => {
  return apiInstance.get(
    `/get_attendance_overview?grade_id=${grade}&section_id=${section}`
  );
};

const getReports = (grade, section, userType) => {
  return apiInstance.get(
    `/view_report?grade_id=${grade}&section_id=${section}&user_type=${userType}`
  );
};

const getResources = (grade, section, subject) => {
  let url = `/get_book_list?grade_id=${grade}&section_id=${section}`;
  if (subject) {
    url = `${url}&subject_id=${subject}`;
  }
  return apiInstance.get(url);
};

const getChapterDetails = (payload) => {
  return apiInstance.post(`/get_chapter_details`, payload);
};

const getAllStudentsAssignmentReport = (AssignmentId) => {
  return apiInstance.get(
    `/get_all_students_assignment_report?assignment_id=${AssignmentId}`
  );
};

const viewAssignemnt = (grade, section, subject) => {
  return apiInstance.get(
    `view_assignment_report?teacher_id=teacher&grade_id=${grade}&section_id=${section}&subject_id=${subject}`
  );
};
const getGradeDetails = () => {
  return apiInstance.get(`/get_all_grade_details`);
};

const saveLessonPlan = (data) => {
  if (data.lesson_id > 0) {
    return apiInstance.put(`/edit_lesson_plan`, data);
  } else {
    return apiInstance.post(`/save_lesson_plan`, data);
  }
};

const viewAttendanceReport = (grade, section, userType) => {
  return apiInstance.get(
    `/view_attendance_report?grade_id=${grade}&section_id=${section}&user_type=${userType}`
  );
};

const getLessonPlan = (teacher) => {
  return apiInstance.get(`/view_teacher_lesson_plan?teacher_id=${teacher}`);
};

const getLessonPlanMetadata = (grade, section) => {
  return apiInstance.get(
    `/get_lesson_plan_metadata?grade_id=${grade}&section_id=${section}`
  );
};

const getTeacherRoutine = (userId, day_id) => {
  return apiInstance.get(
    `/view_teacher_routine?user_id=${userId}&day_id=${day_id}`
  );
};

const viewStudentAttendance = (grade, section, month) => {
  return apiInstance.get(
    `/get_student_attendance?grade_id=${grade}&section_id=${section}&month=${month}`
  );
};

const getAllStudentsData = (grade, section) => {
  return apiInstance.get(
    `/get_all_students?grade_id=${grade}&section_id=${section}`
  );
};

const viewAllNotice = (userId) => {
  return apiInstance.get(`/view_all_notices?user_id=${userId}`);
};

const viewNotice = (role) => {
  return apiInstance.get(`/view_notice?role=${role}`);
};

const saveNotice = (noticeData) => {
  return apiInstance.post(`/save_notice`, noticeData);
};

const publishNotice = (noticeDataToPublish) => {
  return apiInstance.post(`/publish_notice`, noticeDataToPublish);
};

const saveLogBook = (data) => {
  if (data.log_book_id > 0) {
    return apiInstance.put(`/edit_log_book`, data);
  } else {
    return apiInstance.post(`/save_log_book`, data);
  }
};

const createLogBook = (data) => {
  return apiInstance.post(`/save_log_book`, data);
};

const editLogBook = (data) => {
  return apiInstance.put(`/edit_log_book`, data);
};

const studentAssignmentList = (student) => {
  return apiInstance.get(`/get_student_assignments_list?student_id=${student}`);
};
const viewStudentAssignment = () => {
  return apiInstance.put(`/submit_assignment`);
};
const studentRoutine = (grade, year) => {
  return apiInstance.get(`/view_class_routine?grade_id=${grade}&year=${year}`);
};

const saveAttendance = (attendanceData) => {
  return apiInstance.post(`/save_attendance_data`, attendanceData);
};

const getTeachersData = () => {
  return apiInstance.get(`/get_all_teachers`);
};

const lessonPlanAllDetails = (lessonId) => {
  return apiInstance.get(
    `/view_teacher_lesson_plan_details?lesson_id=${lessonId}`
  );
};

const verifyLessonPlan = (dataToVerify) => {
  return apiInstance.put(`/verify_lesson_plan`, dataToVerify);
};

const verifyLogBook = (dataToVerify) => {
  return apiInstance.put(`/verify_log_book`, dataToVerify);
};

const viewNotification = (userId, role) => {
  return apiInstance.get(`/fetch_notifications?user_id=${userId}&role=${role}`);
};

const assignmentList = (userId) => {
  return apiInstance.get(`/view_assignments?teacher_id=${userId}`);
};

const createAssignment = (postData) => {
  return apiInstance.post(`/create_assignment`, postData);
};

const SaveAssignmentData = (assignmentData) => {
  return apiInstance.put(`/save_assignment_details`, assignmentData);
};

const publishAssignmentData = (id) => {
  return apiInstance.get(`/publish_assignment?assignment_id=${id}`);
};

const loadAssignmentData = (AssignmentId, userId) => {
  return apiInstance.get(
    `/load_assignment?assignment_id=${AssignmentId}&student_id=${userId}`
  );
};
const getQuestions = (assignment_id) => {
  return apiInstance.get(
    `/view_assignment_details?assignment_id=${assignment_id}`
  );
};
const deleteAssignment = (assignment_id) => {
  return apiInstance.delete(
    `/delete_assignment?assignment_id=${assignment_id}`
  );
};
const evaluteAssignment = (AssignmentId, student) => {
  return apiInstance.get(
    `/evaluate_student_assignment?assignment_id=${AssignmentId}&student_id=${student}`
  );
};

const getAllChaptersList = (grade, section) => {
  return apiInstance.get(
    `/get_subject_chapters?grade_id=${grade}&section_id=${section}`
  );
};

const getSubjectsList = () => {
  return apiInstance.get(`/get_all_subjects`);
};

const submitEvaluationReport = (data) => {
  return apiInstance.put(`/submit_student_evaluation_report`, data);
};

const getStudentAttendances = (grade, section, date) => {
  return apiInstance.get(
    `/get_student_daily_attendance?grade_id=${grade}&section_id=${section}&date=${date}`
  );
};

const getTeacherLogBook = () => {
  return apiInstance.get(`/view_teacher_logbook`);
};

const getMasterRoutineMetadataInfo = (routine_id) => {
  return apiInstance.get(
    `/get_master_routine_metadata?routine_id=${routine_id}`
  );
};

const getAllPeriodsList = (routine_id) => {
  return apiInstance.get(`/fetch_all_periods?routine_id=${routine_id}`);
};

const getStudentRoutineData = (grade, section) => {
  return apiInstance.get(
    `/view_student_routine?grade_id=${grade}&section_id=${section}`
  );
};

const getStudentSubjectData = (student_id) => {
  return apiInstance.get(`/view_student_subjects?student_id=${student_id}`);
};

const getDaysData = () => {
  return apiInstance.get(`/fetch_all_days`);
};

const checkAttendanceAvailability = (grade_id, section_id, date) => {
  return apiInstance.get(`/check_attendance_availability?grade_id=${grade_id}&section_id=${section_id}&date=${date}`)
}

const getStudentEvaluatedAssignment = (assignment_id, student_id) => {
  return apiInstance.get(`/select_student_evaluated_assignment?assignment_id=${assignment_id}&student_id=${student_id}`)
}

const viewStudentRoutine = (grade_id, section_id) => {
  return apiInstance.get(`/view_class_routine?grade_id=${grade_id}&section_id=${section_id}`);
};

const getStudentPerformanceReport = (user_id) => {
  return apiInstance.get(`/view_student_performance_report?user_id=${user_id}`);
};

const getStudentAttendanceReport = (user_id, month, year) => {
  return apiInstance.get(`/get_attendance_report_for_parents?month=${month}&year=${year}&user_id=${user_id}`);
};

const getStudentAssignmentReport = (student_id, subject_id) => {
  return apiInstance.get(`/view_assignment_performance_report?student_id=${student_id}&subject_id=${subject_id}`);
};

const getLeaveApplicationDetails = (leave_id) => {
  return apiInstance.get(`/get_leave_application_data?leave_id=${leave_id}`);
};

const getParentLeaveApplicationsList = (parent_id) => {
  return apiInstance.get(`/get_leave_application_data?parent_id=${parent_id}`);
};

const geAllLeaveTypes = () => {
  return apiInstance.get(`/fetch_all_leave_types`);
};

const submitLeaveApplication = (payload) => {
  return apiInstance.post(`/submit_leave_application`, payload);
};

const evaluateLeaveApplication = (payload) => {
  return apiInstance.post(`/evaluate_leave_application`, payload);
};

const withdrawLeaveApplication = (payload) => {
  return apiInstance.post(`/withdraw_leave_application`, payload);
};


export {
  //loginUser,
  evaluteAssignment,
  deleteAssignment,
  getQuestions,
  createMasterRoutine,
  getMasterRoutineData,
  viewLogBook,
  viewMasterRoutine,
  attendanceOverview,
  viewStudentAssignment,
  getReports,
  getResources,
  getGradeDetails,
  saveLessonPlan,
  viewAttendanceReport,
  getLessonPlan,
  getSubjectsList,
  getTeacherRoutine,
  viewStudentAttendance,
  getAllStudentsData,
  viewAllNotice,
  saveNotice,
  publishNotice,
  createLogBook,
  studentAssignmentList,
  studentRoutine,
  viewNotice,
  saveAttendance,
  getLessonPlanMetadata,
  getTeachersData,
  getAllStudentsAssignmentReport,
  viewAssignemnt,
  lessonPlanAllDetails,
  verifyLessonPlan,
  viewNotification,
  assignmentList,
  createAssignment,
  SaveAssignmentData,
  publishAssignmentData,
  loadAssignmentData,
  getAllChaptersList,
  submitEvaluationReport,
  getStudentAttendances,
  verifyLogBook,
  getTeacherLogBook,
  editLogBook,
  saveLogBook,
  getViewMasterRoutineData,
  getMasterRoutineMetadataInfo,
  getChapterDetails,
  getAllPeriodsList,
  getStudentRoutineData,
  getStudentSubjectData,
  getDaysData,
  checkAttendanceAvailability,
  getStudentEvaluatedAssignment,
  viewStudentRoutine,
  getStudentPerformanceReport,
  getStudentAttendanceReport,
  getStudentAssignmentReport,
  getParentLeaveApplicationsList,
  geAllLeaveTypes,
  submitLeaveApplication,
  getLeaveApplicationDetails,
  evaluateLeaveApplication,
  withdrawLeaveApplication
};
