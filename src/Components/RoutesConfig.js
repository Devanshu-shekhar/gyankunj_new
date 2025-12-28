import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import PlayLessonOutlinedIcon from "@mui/icons-material/PlayLessonOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Settings, Image } from "@mui/icons-material";

export const routesConfig = {
  ADMIN: [
    {
      code: "dashboard",
      title: "Dashboard",
      icon: <HomeOutlinedIcon />,
      route: "/principalDashboard/dashboard",
    },
    {
      code: "schoolConfiguration",
      title: "School Configuration",
      icon: <Settings />,
      route: "/principalDashboard/schoolConfiguration",
    },  
    {
      code: "galleryView",
      title: "Gallery",
      icon: <Image />,
      route: "/galleryView",
    },  
    {
      code: "masterRoutine",
      title: "Master Routine",
      icon: <CalendarMonthOutlinedIcon />,
      route: "/principalDashboard/masterRoutine",
    },
    {
      code: "lessonPlan",
      title: "Lesson Plan",
      icon: <PlayLessonOutlinedIcon />,
      route: "/principalDashboard/lessonPlan",
    },
    {
      code: "attendanceOverview",
      title: "Attendance",
      icon: <BookOutlinedIcon />,
      route: "/principalDashboard/attendanceOverview",
    },
    {
      code: "reports",
      title: "Report",
      icon: <AssignmentOutlinedIcon />,
      route: "/principalDashboard/reports",
    },
    {
      code: "resources",
      title: "Resources",
      icon: <SourceOutlinedIcon />,
      route: "/principalDashboard/resources",
    },
    {
      code: "schoolDiary",
      title: "School Diary",
      icon: <LibraryBooksOutlinedIcon />,
      route: "/principalDashboard/schoolDiary",
    },
    {
      code: "transportView",
      title: "Transport",
      icon: <DirectionsBusFilledOutlinedIcon />,
      route: "/principalDashboard/transportView",
    },
    {
      code: "financeView",
      title: "Finance",
      icon: <AccountBalanceWalletOutlinedIcon />,
      route: "/principalDashboard/financeView",
    },
    {
      code: "hrmsPortal",
      title: "HRMS",
      icon: <Groups2OutlinedIcon />,
      route: "/principalDashboard/hrmsPortal",
    },
    {
      code: "admissionView",
      title: "Admission",
      icon: <Groups2OutlinedIcon />,
      route: "/principalDashboard/admissionView",
    }
  ],
  PRINCIPAL: [
    {
      code: "dashboard",
      title: "Dashboard",
      icon: <HomeOutlinedIcon />,
      route: "/principalDashboard/dashboard",
    },
    {
      code: "masterRoutine",
      title: "Master Routine",
      icon: <CalendarMonthOutlinedIcon />,
      route: "/principalDashboard/masterRoutine",
    },
    {
      code: "lessonPlan",
      title: "Lesson Plan",
      icon: <PlayLessonOutlinedIcon />,
      route: "/principalDashboard/lessonPlan",
    },
    {
      code: "attendanceOverview",
      title: "Attendance",
      icon: <AssignmentOutlinedIcon />,
      route: "/principalDashboard/attendanceOverview",
    },
    {
      code: "leavesOverview",
      title: "Leaves",
      icon: <AssignmentOutlinedIcon />,
      route: "/principalDashboard/leavesOverview",
    },
    {
      code: "classMapping",
      title: "Class Mapping",
      icon: <Settings />,
      route: "/principalDashboard/classMapping",
    },
    {
      code: "reports",
      title: "Report",
      icon: <AssignmentOutlinedIcon />,
      route: "/principalDashboard/reports",
    },
    {
      code: "resources",
      title: "Resources",
      icon: <SourceOutlinedIcon />,
      route: "/principalDashboard/resources",
    },
    {
      code: "schoolDiary",
      title: "School Diary",
      icon: <SourceOutlinedIcon />,
      route: "/principalDashboard/schoolDiary",
    },
    {
      code: "galleryView",
      title: "Gallery",
      icon: <Image />,
      route: "/galleryView",
    },  
  ],
  TEACHER: [
    {
      code: "dashboard",
      title: "Dashboard",
      icon: <HomeOutlinedIcon />,
      route: "/teacherDashboard/dashboard",
    },
    {
      code: "subjects",
      title: "My Subjects",
      icon: <SubjectOutlinedIcon />,
      route: "/teacherDashboard/subjects",
    },
    {
      code: "lessonPlan",
      title: "Lesson Plan",
      icon: <PlayLessonOutlinedIcon />,
      route: "/teacherDashboard/lessonPlan",
    },
    {
      code: "logBook",
      title: "Log Book",
      icon: <AssignmentOutlinedIcon />,
      route: "/teacherDashboard/logBook",
    },
    {
      code: "attendance",
      title: "Attendance",
      icon: <AssignmentOutlinedIcon />,
      route: "/teacherDashboard/attendance",
    },
    {
      code: "assignments",
      title: "Assignments",
      icon: <AssignmentOutlinedIcon />,
      route: "/teacherDashboard/assignments",
    },
    {
      code: "resources",
      title: "Resources",
      icon: <SourceOutlinedIcon />,
      route: "/teacherDashboard/resources",
    },
    {
      code: "reports",
      title: "Report",
      icon: <AssignmentOutlinedIcon />,
      route: "/teacherDashboard/reports",
    },
    {
      code: "onlineCoding",
      title: "Online Coding",
      icon: <AssignmentOutlinedIcon />,
      route: "/onlineCoding",
    },
    {
      code: "galleryView",
      title: "Gallery",
      icon: <Image />,
      route: "/galleryView",
    },  
  ],
  STUDENT: [
    {
      code: "dashboard",
      title: "Dashboard",
      icon: <HomeOutlinedIcon />,
      route: "/studentDashboard/dashboard",
    },
    {
      code: "assignments",
      title: "Assignments",
      icon: <AssignmentOutlinedIcon />,
      route: "/studentDashboard/assignments",
    },
    {
      code: "resources",
      title: "Resources",
      icon: <SourceOutlinedIcon />,
      route: "/studentDashboard/resources",
    },
    {
      code: "reports",
      title: "Report",
      icon: <AssignmentOutlinedIcon />,
      route: "/studentDashboard/reports",
    },
    {
      code: "galleryView",
      title: "Gallery",
      icon: <Image />,
      route: "/galleryView",
    } 
  ],
  PARENT: [
    {
      code: "dashboard",
      title: "Dashboard",
      icon: <HomeOutlinedIcon />,
      route: "/parentDashboard/dashboard",
    },
    {
      code: "assignments",
      title: "Assignments",
      icon: <AssignmentOutlinedIcon />,
      route: "/parentDashboard/assignments",
    },
    {
      code: "routine",
      title: "Routine",
      icon: <CalendarMonthOutlinedIcon />,
      route: "/parentDashboard/routine",
    },
    {
      code: "transport",
      title: "Transport",
      icon: <AirportShuttleOutlinedIcon />,
      route: "/parentDashboard/transport",
    },
    {
      code: "fees",
      title: "Fees",
      icon: <ReceiptOutlinedIcon />,
      route: "/parentDashboard/fees",
    },
    {
      code: "feedback",
      title: "Feedback",
      icon: <FeedbackOutlinedIcon />,
      route: "/parentDashboard/feedback",
    },
    {
      code: "galleryView",
      title: "Gallery",
      icon: <Image />,
      route: "/galleryView",
    }
  ],
};
