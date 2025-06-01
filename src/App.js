import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./Components/Header";
import RoutesContainer from "./Components/RoutesContainer";
import SidebarContainer from "./Components/SidebarContainer";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { pdfjs } from 'react-pdf';
import ChangePasswordDialog from "./Components/ChangePasswordDialog";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function App() {
  const [theme, colorMode] = useMode();
  const [userData, setUserData] = useState({});
  const [isTabScreen, setIsTabScreen] = useState(false);
  const [isPageNotFound, setIsPageNotFound] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const mainContainerRef = useRef(null);
  const [open, setOpen] = useState(userData.show_reset_popup || false);

  useEffect(() => {
    const storedData = localStorage.getItem("UserData");
    setUserData(storedData ? JSON.parse(storedData) : {});

    setIsPageNotFound(false); // Reset the flag on every location change
    if (location.pathname === "/404") {
      setIsPageNotFound(true); // Set the flag if the current location is 404
    }
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsTabScreen(window.innerWidth <= 1024);
    };

    // Initial check on mount
    handleResize();

    // Add event listener to update on resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <div className={`main-header ${isPageNotFound && "d-none"} `}>
            <Header isTabScreen={isTabScreen} userData={userData} />
          </div>
          <div className="main-body">
            {!["PARENT", "STUDENT"].includes(userData.role) && !isTabScreen && userData?.token && !isPageNotFound && (
              <div className={`main-sidebar ${isCollapsed && "side-small"} `}>
                <SidebarContainer
                  userData={userData}
                  setCollapsed={setIsCollapsed}
                  openFor="sidebar"
                />
              </div>
            )}
            <div
              ref={mainContainerRef}
              className={`main-container ${
                (["PARENT", "STUDENT"].includes(userData.role) || isTabScreen || !userData?.token || isPageNotFound) && "w-100"
              } ${isCollapsed && "cont-big"} ${!userData?.token && 'p-0'}`}
            >
              <RoutesContainer userData={userData} mainContainerRef={mainContainerRef} />
              {open && <ChangePasswordDialog open={open} onClose={() => setOpen(false)} userId={userData.user_id} />}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
