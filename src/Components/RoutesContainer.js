import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedWrapper } from "../ProtectedRoute";
import LandingDashboard from "./LandingDashboard";
import PageNotFound from "./PageNotFound";
import PDashboard from "./Principal/PDashboard";
import ReportSection from "./Principal/Reports";
import Announcements from "./Principal/Announcement/Announcement";
import MySubjects from "./Teacher/MySubject/MySubjects";
import TeacherReport from "./Teacher/TeacherReport/TeacherReport";
import TeacherAssignment from "./Teacher/Assignment/TeacherAssignment";
import NoticeForTeacher from "./Teacher/NoticeForTeacher/NoticeForTeacher";
import StudentAssigments from "./Student/Assignments/Assignments";
import StudentReportSection from "./Student/Report/Reports";
import NoticeForStudents from "./Student/NoticeForStudents/NoticeForStudents";
import CreateAssignment from "./Teacher/Assignment/CreateAssignment";
import Addquestions from "./Teacher/Assignment/Addquestions";
import SubmissionsPage from "./Teacher/Assignment/SubmissionsComponent";
import Viewreport from "./Teacher/Assignment/Viewreport";
import EvaluteAssignmentReport from "./Teacher/Assignment/EvaluteAssignmentReport";
import TDashboard from "./Teacher/Dashboard/TDashboard";
import PLessonPlan from "./Principal/PLessonPlan";
import LogBookCLassTeacher from "./Teacher/Dashboard/LogBook/LogBookCLassTeacher";
import TLessonPlan from "./Teacher/LessonPlan/TLessonPlan";
import PResources from "./Principal/Resources/PResources";
import CustomMasterRoutine from "./Principal/MasterRoutine/CustomMasterRoutine";
import TResources from "./Teacher/Resources/TResources";
import SResources from "./Student/Resources/SResources";
import SDashboard from "./Student/SDashboard";
import TeacherAttendance from "./Teacher/TeacherAttendance/TeacherAttendance";
import AttendancesOverview from "./Principal/Attendance/AttendancesOverview";
import PaAssignments from "./Parent/PaAssignments";
import PaDashboard from "./Parent/PaDashboard";
import PaRoutine from "./Parent/PaRoutine";
import PaTransport from "./Parent/PaTransport";
import PaFees from "./Parent/PaFees";
import PaFeedback from "./Parent/PaFeedback";
import PaAnnouncements from "./Parent/PaAnnouncements";
import PaNotifications from "./Parent/PaNotifications";
import PaAssignmentDetails from "./Parent/PaAssignmentDetails";
import PaReport from "./Parent/PaReport";
import TNotifications from "./Teacher/TNotifications";
import SNotifications from "./Student/SNotifications";
import APNotifications from "./Principal/APNotifications";
import PSchoolDiary from "./Principal/PSchoolDiary";
import TransportView from "./Principal/Transport/TransportView";
import HrmsDashboard from "./Principal/HRMS/HrmsDashboard";
import ProfilePage from "./ProfilePage";
import EmployeesList from "./Principal/HRMS/EmployeesList";
import EmployeeLeavesList from "./Principal/HRMS/EmployeeLeavesList";
import FinanceView from "./Principal/Finance/FinanceView";
import AdmissionView from "./Principal/Admission/AdmissionView";
import OnlineCodeCompiler from "./OnlineCodeCompiler";
import JDoodleCompiler from "./JDoodleCompiler";
import StudentRoutine from "./Student/StudentRoutine";
import RoboticsLabView from "./Student/Robotics/RoboticsLabView";
import LanguageLabView from "./Student/LanguageLab/LanguageLabView";
import SchoolDiaryView from "./Student/SchoolDiary/SchoolDiaryView";
import EmployeeAttendanceView from "./Principal/HRMS/EmployeeAttendanceView";

// Define routes for different user roles
const roleRoutes = {
  ADMIN: "/principalDashboard/dashboard",
  PRINCIPAL: "/principalDashboard/dashboard",
  TEACHER: "/teacherDashboard/dashboard",
  STUDENT: "/studentDashboard/dashboard",
  PARENT: "/parentDashboard/dashboard",
};

export default function RoutesContainer({ userData, mainContainerRef }) {
  const classTeacherDetails = userData?.class_teacher_details;
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
        {/* 404 Route */}
        <Route
          path="/404"
          element={<ProtectedWrapper Component={PageNotFound} />}
        />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    );
  }

  // If user doesn't have permission, show DashboardSectionContent
  return <LandingDashboard mainContainer={mainContainerRef} />;
}
