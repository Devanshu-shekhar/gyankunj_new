import { useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import profilePic from "../Images/profilePic.jpg";
import Gyankoonj_logo from "../Images/Gyankoonj_logo.png";
import LoginPage from "./LoginPage";
import { FaAngleDown } from "react-icons/fa";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Offcanvas } from "react-bootstrap";
import SidebarContainer from "./SidebarContainer";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { TbSpeakerphone } from "react-icons/tb";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

function Header({ isTabScreen, userData }) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isHoveredOnUser, setIsHoveredOnUser] = useState(false);
  const [isHoveredOnMenu, setIsHoveredOnMenu] = useState("");
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userRoutes = {
    announcementIcon: <TbSpeakerphone size={24} />,
    notifications: <MdOutlineNotificationsActive size={24} />,
    ADMIN: {
      announcements: "/principalDashboard/announcements",
      notifications: "/principalDashboard/notifications",
    },
    PRINCIPAL: {
      announcements: "/principalDashboard/announcements",
      notifications: "/principalDashboard/notifications",
    },
    TEACHER: {
      announcements: "/teacherDashboard/announcements",
      notifications: "/teacherDashboard/notifications",
    },
    STUDENT: {
      announcements: "/studentDashboard/announcements",
      notifications: "/studentDashboard/notifications",
    },
  };

  const openLoginPage = () => {
    setShowLogin(true);
  };

  const logoutFunction = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleMouseEnter = () => {
    setIsHoveredOnUser(true);
  };

  const handleMouseLeave = () => {
    setIsHoveredOnUser(false);
  };

  return (
    <>
      <Navbar className="shadow justify-content-between h-100 pe-2 ps-2">
        {isTabScreen && userData?.token && (
          <MenuOutlinedIcon onClick={() => setShowDrawer(!showDrawer)} />
        )}
        {(!isTabScreen || !userData?.token) && (
          <img className="h-100" src={Gyankoonj_logo} alt="Logo" />
        )}
        {userData?.token ? (
          <Nav className="ms-auto align-items-center d-flex gap-3">
             <Nav.Link
              as={Link}
              to={userRoutes[userData?.role].announcements}
              onMouseEnter={() => setIsHoveredOnMenu('announcements')}
              onMouseLeave={() => setIsHoveredOnMenu('')}
              className={`hover-animate ${
                location.pathname === userRoutes[userData?.role].announcements || isHoveredOnMenu === "announcements"
                  ? "active"
                  : ""
              }`}
              style={{
                color:
                  (location.pathname === userRoutes[userData?.role].announcements || isHoveredOnMenu === "announcements")
                    ? "#6870fa"
                    : colors.grey[100],
                display: "flex",
                alignItems: "center",
              }}
            >
              {userRoutes.announcementIcon}
              <Typography className="ms-1">Announcements</Typography>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={userRoutes[userData?.role].notifications}
              onMouseEnter={() => setIsHoveredOnMenu('notifications')}
              onMouseLeave={() => setIsHoveredOnMenu('')}
              className={`hover-animate ${
                location.pathname === userRoutes[userData?.role].notifications || isHoveredOnMenu === "notifications"
                  ? "active"
                  : ""
              }`}
              style={{
                color:
                  (location.pathname === userRoutes[userData?.role].notifications || isHoveredOnMenu === "notifications")
                    ? "#6870fa"
                    : colors.grey[100],
                display: "flex",
                alignItems: "center",
              }}
            >
              {userRoutes.notifications}
              <Typography className="ms-1">Notifications</Typography>
            </Nav.Link>
            <NavDropdown
              align="end"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              title={
                <div className="profile-title">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: 40, height: 40, marginRight: 5 }}
                  />
                  <span className={`username ${isHoveredOnUser ? "show" : ""}`}>
                    <strong className="ms-1 me-1">{userData.name}</strong>
                    <FaAngleDown />
                  </span>
                </div>
              }
              id="basic-nav-dropdown"
              renderMenuOnMount={true}
            >
              <NavDropdown.Item disabled>{userData.role}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutFunction}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : (
          <button className="btn-primary" onClick={openLoginPage}>
            Log In
          </button>
        )}
      </Navbar>
      <LoginPage show={showLogin} onHide={() => setShowLogin(false)} />
      <Offcanvas
        style={{ width: 270 }}
        show={showDrawer}
        onHide={setShowDrawer}
        placement="start"
      >
        <Offcanvas.Header style={{ height: 100 }} closeButton>
          <img className="h-100" src={Gyankoonj_logo} alt="Logo" />
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0" style={{ overflowX: "hidden" }}>
          <SidebarContainer
            userData={userData}
            onMenuItemClick={() => setShowDrawer(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
