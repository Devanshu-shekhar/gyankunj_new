import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedWrapper } from "../ProtectedRoute";
const LandingDashboard = lazy(() => import("./LandingDashboard"));
const PageNotFound = lazy(() => import("./PageNotFound"));
const PDashboard = lazy(() => import("./Principal/PDashboard"));
const ReportSection = lazy(() => import("./Principal/Reports"));
const Announcements = lazy(() => import("./Principal/Announcement/Announcement"));
const MySubjects = lazy(() => import("./Teacher/MySubject/MySubjects"));
const TeacherReport = lazy(() => import("./Teacher/TeacherReport/TeacherReport"));
const TeacherAssignment = lazy(() => import("./Teacher/Assignment/TeacherAssignment"));
const NoticeForTeacher = lazy(() => import("./Teacher/NoticeForTeacher/NoticeForTeacher"));
const StudentAssigments = lazy(() => import("./Student/Assignments/Assignments"));
const StudentReportSection = lazy(() => import("./Student/Report/Reports"));
const NoticeForStudents = lazy(() => import("./Student/NoticeForStudents/NoticeForStudents"));
const CreateAssignment = lazy(() => import("./Teacher/Assignment/CreateAssignment"));
const Addquestions = lazy(() => import("./Teacher/Assignment/Addquestions"));
const SubmissionsPage = lazy(() => import("./Teacher/Assignment/SubmissionsComponent"));
const Viewreport = lazy(() => import("./Teacher/Assignment/Viewreport"));
const EvaluteAssignmentReport = lazy(() => import("./Teacher/Assignment/EvaluteAssignmentReport"));
const TDashboard = lazy(() => import("./Teacher/Dashboard/TDashboard"));
const PLessonPlan = lazy(() => import("./Principal/PLessonPlan"));
const LogBookCLassTeacher = lazy(() => import("./Teacher/Dashboard/LogBook/LogBookCLassTeacher"));
const TLessonPlan = lazy(() => import("./Teacher/LessonPlan/TLessonPlan"));
const PResources = lazy(() => import("./Principal/Resources/PResources"));
const CustomMasterRoutine = lazy(() => import("./Principal/MasterRoutine/CustomMasterRoutine"));
const TResources = lazy(() => import("./Teacher/Resources/TResources"));
const SResources = lazy(() => import("./Student/Resources/SResources"));
const SDashboard = lazy(() => import("./Student/SDashboard"));
const TeacherAttendance = lazy(() => import("./Teacher/TeacherAttendance/TeacherAttendance"));
const AttendancesOverview = lazy(() => import("./Principal/Attendance/AttendancesOverview"));
const PaAssignments = lazy(() => import("./Parent/PaAssignments"));
const PaDashboard = lazy(() => import("./Parent/PaDashboard"));
const PaRoutine = lazy(() => import("./Parent/PaRoutine"));
const PaTransport = lazy(() => import("./Parent/PaTransport"));
const PaFees = lazy(() => import("./Parent/PaFees"));
const PaFeedback = lazy(() => import("./Parent/PaFeedback"));
const PaAnnouncements = lazy(() => import("./Parent/PaAnnouncements"));
const PaNotifications = lazy(() => import("./Parent/PaNotifications"));
const PaAssignmentDetails = lazy(() => import("./Parent/PaAssignmentDetails"));
const PaReport = lazy(() => import("./Parent/PaReport"));
const TNotifications = lazy(() => import("./Teacher/TNotifications"));
const SNotifications = lazy(() => import("./Student/SNotifications"));
const APNotifications = lazy(() => import("./Principal/APNotifications"));
const PSchoolDiary = lazy(() => import("./Principal/PSchoolDiary"));
const TransportView = lazy(() => import("./Principal/Transport/TransportView"));
const HrmsDashboard = lazy(() => import("./Principal/HRMS/HrmsDashboard"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const EmployeesList = lazy(() => import("./Principal/HRMS/EmployeesList"));
const EmployeeLeavesList = lazy(() => import("./Principal/HRMS/EmployeeLeavesList"));
const FinanceView = lazy(() => import("./Principal/Finance/FinanceView"));
const AdmissionView = lazy(() => import("./Principal/Admission/AdmissionView"));
const JDoodleCompiler = lazy(() => import("./JDoodleCompiler"));
const StudentRoutine = lazy(() => import("./Student/StudentRoutine"));
const RoboticsLabView = lazy(() => import("./Student/Robotics/RoboticsLabView"));
const LanguageLabView = lazy(() => import("./Student/LanguageLab/LanguageLabView"));
const SchoolDiaryView = lazy(() => import("./Student/SchoolDiary/SchoolDiaryView"));
const EmployeeAttendanceView = lazy(() => import("./Principal/HRMS/EmployeeAttendanceView"));
const UserCalendar = lazy(() => import("./UserCalendar"));
const SchoolConfiguration = lazy(() => import("./Principal/School/SchoolConfiguration"));
const AdmissionStepperPage = lazy(() => import("./Principal/Admission/AdmissionStepperPage"));

// Define routes for different user roles
const roleRoutes = {
  ADMIN: "/principalDashboard/dashboard",
  PRINCIPAL: "/principalDashboard/dashboard",
  TEACHER: "/teacherDashboard/dashboard",
  STUDENT: "/studentDashboard/dashboard",
  PARENT: "/parentDashboard/dashboard",
};

export default function RoutesContainer({ userData, mainContainerRef }) {
  // Function to check if the user has the required role for accessing a route
  const hasPermission = (allowedRoles) => {
    return allowedRoles.includes(userData?.role);
  };

  // Redirect users based on their role
  if (!userData) {
    return <Navigate to="/" />;
  } else if (
    hasPermission(["ADMIN", "PRINCIPAL", "TEACHER", "STUDENT", "PARENT"])
  ) {
    return (
      <Suspense fallback={<div />}> 
      <Routes>
        <Route path="/" element={<Navigate to={roleRoutes[userData.role]} />} />
        {/* Principal Routes */}
        {userData.role === "ADMIN" || userData.role === "PRINCIPAL" ? (
          <>
            <Route
              path="/principalDashboard/dashboard"
              element={<ProtectedWrapper Component={PDashboard} />}
            />
            <Route
              path="/principalDashboard/schoolConfiguration"
              element={<ProtectedWrapper Component={SchoolConfiguration} />}
            />
            <Route
              path="/principalDashboard/masterRoutine"
              element={<ProtectedWrapper Component={CustomMasterRoutine} />}
            />
            <Route
              path="/principalDashboard/lessonPlan"
              element={<ProtectedWrapper Component={PLessonPlan} />}
            />
            <Route
              path="/principalDashboard/attendanceOverview"
              element={<ProtectedWrapper Component={AttendancesOverview} />}
            />
            <Route
              path="/principalDashboard/reports"
              element={<ProtectedWrapper Component={ReportSection} />}
            />
            <Route
              path="/principalDashboard/resources"
              element={<ProtectedWrapper Component={PResources} />}
            />
            <Route
              path="/principalDashboard/schoolDiary"
              element={<ProtectedWrapper Component={PSchoolDiary} />}
            />
            <Route
              path="/principalDashboard/announcements"
              element={<ProtectedWrapper Component={Announcements} />}
            />
            <Route
              path="/principalDashboard/notifications"
              element={<ProtectedWrapper Component={APNotifications} />}
            />
            {userData.role === "ADMIN" && (
              <>
                <Route
                  path="/principalDashboard/transportView"
                  element={<ProtectedWrapper Component={TransportView} />}
                />
                <Route
                  path="/principalDashboard/financeView"
                  element={<ProtectedWrapper Component={FinanceView} />}
                />
                <Route
                  path="/principalDashboard/hrmsPortal"
                  element={<ProtectedWrapper Component={HrmsDashboard} />}
                />
                <Route
                  path="/principalDashboard/hrmsPortal/employeeView"
                  element={<ProtectedWrapper Component={EmployeesList} />}
                />
                <Route
                  path="/principalDashboard/hrmsPortal/leaveView"
                  element={<ProtectedWrapper Component={EmployeeLeavesList} />}
                />
                <Route
                  path="/principalDashboard/admissionView"
                  element={<ProtectedWrapper Component={AdmissionView} />}
                />
                <Route
                  path="/principalDashboard/admissionView/create-admission"
                  element={<ProtectedWrapper Component={AdmissionStepperPage} />}
                />
                <Route
                  path="/principalDashboard/hrmsPortal/attendanceView"
                  element={<ProtectedWrapper Component={EmployeeAttendanceView} />}
                />
              </>
            )}
          </>
        ) : null}
        {/* Teacher Routes */}
        {userData.role === "TEACHER" ? (
          <>
            <Route
              path="/teacherDashboard/dashboard"
              element={<ProtectedWrapper Component={TDashboard} />}
            />
            <Route
              path="/teacherDashboard/subjects"
              element={<ProtectedWrapper Component={MySubjects} />}
            />
            {/* {classTeacherDetails && (
              <Route
                path="/teacherDashboard/logBook"
                element={<ProtectedWrapper Component={LogBookCLassTeacher} />}
              />
            )} */}
            <Route
              path="/teacherDashboard/logBook"
              element={<ProtectedWrapper Component={LogBookCLassTeacher} />}
            />
            <Route
              path="/teacherDashboard/lessonPlan"
              element={<ProtectedWrapper Component={TLessonPlan} />}
            />
            <Route
              path="/teacherDashboard/reports"
              element={<ProtectedWrapper Component={TeacherReport} />}
            />
            <Route
              path="/teacherDashboard/attendance"
              element={<ProtectedWrapper Component={TeacherAttendance} />}
            />
            <Route
              path="/teacherDashboard/assignments"
              element={<ProtectedWrapper Component={TeacherAssignment} />}
            />
            <Route
              path="/teacherDashboard/resources"
              element={<ProtectedWrapper Component={TResources} />}
            />
            <Route
              path="/teacherDashboard/announcements"
              element={<ProtectedWrapper Component={NoticeForTeacher} />}
            />
            <Route
              path="/teacherDashboard/notifications"
              element={<ProtectedWrapper Component={TNotifications} />}
            />
            <Route
              path="/teacherDashboard/createAssignment"
              element={<ProtectedWrapper Component={CreateAssignment} />}
            />
            <Route
              path="/teacherDashboard/addquestions"
              element={<ProtectedWrapper Component={Addquestions} />}
            />
            <Route
              path="/teacherDashboard/submissions/:assignmentId"
              element={<ProtectedWrapper Component={SubmissionsPage} />}
            />
            <Route
              path="/teacherDashboard/submissionsReport/:assignmentId"
              element={<ProtectedWrapper Component={Viewreport} />}
            />
            {/* <Route
              path="/teacherDashboard/evaluteAssignment/:assignmentId/:studentId"
              element={<ProtectedWrapper Component={EvaluteAssignmentReport} />}
            /> */}
            <Route
              path="/teacherDashboard/evaluteAssignment/:assignmentId/*"
              element={<ProtectedWrapper Component={EvaluteAssignmentReport} />}
            />
          </>
        ) : null}
        {/* Student Routes */}
        {userData.role === "STUDENT" ? (
          <>
            <Route
              path="/studentDashboard/dashboard"
              element={<ProtectedWrapper Component={SDashboard} />}
            />
            <Route
              path="/studentDashboard/reports"
              element={<ProtectedWrapper Component={StudentReportSection} />}
            />
            <Route
              path="/studentDashboard/assignments"
              element={<ProtectedWrapper Component={StudentAssigments} />}
            />
            <Route
              path="/studentDashboard/routine"
              element={<ProtectedWrapper Component={StudentRoutine} />}
            />
            <Route
              path="/studentDashboard/resources"
              element={<ProtectedWrapper Component={SResources} />}
            />
            <Route
              path="/studentDashboard/roboticsLab"
              element={<ProtectedWrapper Component={RoboticsLabView} />}
            />
            <Route
              path="/studentDashboard/languageLab"
              element={<ProtectedWrapper Component={LanguageLabView} />}
            />
            <Route
              path="/studentDashboard/schoolDiary"
              element={<ProtectedWrapper Component={SchoolDiaryView} />}
            />
            <Route
              path="/studentDashboard/announcements"
              element={<ProtectedWrapper Component={NoticeForStudents} />}
            />
            <Route
              path="/studentDashboard/notifications"
              element={<ProtectedWrapper Component={SNotifications} />}
            />
          </>
        ) : null}
        {/* Parent Routes */}
        {userData.role === "PARENT" ? (
          <>
            <Route
              path="/parentDashboard/dashboard"
              element={<ProtectedWrapper Component={PaDashboard} />}
            />
            <Route
              path="/parentDashboard/assignments"
              element={<ProtectedWrapper Component={PaAssignments} />}
            />
            <Route
              path="/parentDashboard/assignment-details"
              element={<ProtectedWrapper Component={PaAssignmentDetails} />}
            />
            <Route
              path="/parentDashboard/routine"
              element={<ProtectedWrapper Component={PaRoutine} />}
            />
            <Route
              path="/parentDashboard/transport"
              element={<ProtectedWrapper Component={PaTransport} />}
            />
            <Route
              path="/parentDashboard/fees"
              element={<ProtectedWrapper Component={PaFees} />}
            />
            <Route
              path="/parentDashboard/feedback"
              element={<ProtectedWrapper Component={PaFeedback} />}
            />
            <Route
              path="/parentDashboard/report"
              element={<ProtectedWrapper Component={PaReport} />}
            />
            <Route
              path="/parentDashboard/announcements"
              element={<ProtectedWrapper Component={PaAnnouncements} />}
            />
            <Route
              path="/parentDashboard/notifications"
              element={<ProtectedWrapper Component={PaNotifications} />}
            />
          </>
        ) : null}
        <Route
          path="/profile/:userId/:roleId"
          element={<ProtectedWrapper Component={ProfilePage} />}
        />
        <Route
          path="/onlineCoding"
          element={<ProtectedWrapper Component={JDoodleCompiler} />}
        />
        <Route
          path="/calendar"
          element={<ProtectedWrapper Component={UserCalendar} />}
        />
        {/* 404 Route */}
        <Route
          path="/404"
          element={<ProtectedWrapper Component={PageNotFound} />}
        />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      </Suspense>
    );
  }

  // If user doesn't have permission, show DashboardSectionContent
  return (
    <Suspense fallback={<div />}>
      <LandingDashboard mainContainer={mainContainerRef} />
    </Suspense>
  );
}
