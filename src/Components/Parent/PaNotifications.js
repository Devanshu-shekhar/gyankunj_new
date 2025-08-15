import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionActions from "@mui/material/AccordionActions";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { viewNotification } from "../../ApiClient";
import { CircularProgress } from "@mui/material";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.primary.dark
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const PaNotifications = () => {
  const userDetails = JSON.parse(localStorage.getItem("UserData"));
  const [notificationsList, setNotificationsList] = useState();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    viewNotification(userDetails?.user_id, userDetails?.role)
      .then((res) => {
        if (res?.data?.notifications?.length > 0) {
          setNotificationsList(res.data.notifications);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleNext = () => {
    const currentIndex = notificationsList.findIndex(
      (notification) => notification.notification_id === expanded
    );
    if (currentIndex < notificationsList.length - 1) {
      setExpanded(notificationsList[currentIndex + 1].notification_id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = notificationsList.findIndex(
      (notification) => notification.notification_id === expanded
    );
    if (currentIndex > 0) {
      setExpanded(notificationsList[currentIndex - 1].notification_id);
    }
  };

  return (
    <div>
      <h3 className="mb-3">Notifications</h3>
      {isLoading ? (
        <div className="text-center w-100 mt-5">
          <CircularProgress color="primary" />
        </div>
      ) : notificationsList?.length > 0 ? (
        notificationsList.map((notification) => (
          <StyledAccordion
            key={notification.notification_id}
            expanded={expanded === notification.notification_id}
            onChange={handleChange(notification.notification_id)}
          >
            <StyledAccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${notification.notification_id}-content`}
              id={`panel-${notification.notification_id}-header`}
            >
              <Typography>{notification.operation}</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography>{notification.notification_info}</Typography>
            </StyledAccordionDetails>
            <AccordionActions>
              <Button
                size="small"
                onClick={handlePrevious}
                disabled={
                  notificationsList.findIndex(
                    (notification) => notification.notification_id === expanded
                  ) === 0
                }
              >
                Previous
              </Button>
              <Button
                size="small"
                onClick={handleNext}
                disabled={
                  notificationsList.findIndex(
                    (notification) => notification.notification_id === expanded
                  ) ===
                  notificationsList.length - 1
                }
              >
                Next
              </Button>
            </AccordionActions>
          </StyledAccordion>
        ))
      ) : (
        <div className="w-100 text-center text-danger">No data available</div>
      )}
    </div>
  );
};

export default PaNotifications;
