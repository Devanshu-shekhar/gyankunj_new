import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from "./Components/Header";
import RoutesContainer from "./Components/RoutesContainer";
import SidebarContainer from "./Components/SidebarContainer";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const [userData, setUserData] = useState({});
  const [isTabScreen, setIsTabScreen] = useState(false);
  const [isPageNotFound, setIsPageNotFound] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

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
    <div className="app">
      <div className={`main-header ${isPageNotFound && "d-none"} `}>
        <Header isTabScreen={isTabScreen} userData={userData} />
      </div>
      <div className="main-body">
        {!isTabScreen && userData?.token && !isPageNotFound && (
          <div className={`main-sidebar ${isCollapsed && "side-small"} `}>
            <SidebarContainer
              userData={userData}
              setCollapsed={setIsCollapsed}
              openFor="sidebar"
            />
          </div>
        )}
        <div
          className={`main-container ${
            (isTabScreen || !userData?.token || isPageNotFound) && "w-100"
          } ${isCollapsed && "cont-big"}`}
        >
          <RoutesContainer userData={userData} />
        </div>
      </div>
    </div>
  );
}

export default App;
