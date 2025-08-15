import React from "react";
import {
  Container,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
} from "@mui/material";

// Import all images
import assignmentIcon from "../../Images/assignment-icon.jpg";
import routineIcon from "../../Images/routine-icon.jpg";
import transportIcon from "../../Images/transport-icon.jpg";
import feesIcon from "../../Images/fees-icon.jpg";
import feedbackIcon from "../../Images/feedback-icon.jpg";
import reportIcon from "../../Images/report-icon.jpg";

import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const formatTime = (seconds) => {
  const duration = dayjs.duration(seconds, "seconds");
  return `${duration.days()}d : ${duration.hours()}h : ${duration.minutes()}m : ${duration.seconds()}s`;
};

const cardContent = [
  {
    image: assignmentIcon,
    title: "Assignments",
    description: "View and track your child's assignments.",
    route: "/parentDashboard/assignments",
  },
  {
    image: routineIcon,
    title: "Routine",
    description: "Check your child's daily schedule and class routines.",
    route: "/parentDashboard/routine",
  },
  {
    image: transportIcon,
    title: "Transport",
    description:
      "View transport schedules and routes for your child's commute.",
    route: "/parentDashboard/transport",
  },
  {
    image: feesIcon,
    title: "Fees",
    description: "Manage and pay your child's school fees.",
    route: "/parentDashboard/fees",
  },
  {
    image: feedbackIcon,
    title: "Feedback",
    description: "Provide feedback on your child's school experience.",
    route: "/parentDashboard/feedback",
  },
  {
    image: reportIcon,
    title: "Report",
    description:
      "Access detailed reports on your child's academic performance and progress.",
    route: "/parentDashboard/report",
  },
];

const ResponsiveCard = ({ image, title, description, route, report }) => {
  const navigate = useNavigate();

  return (
    <Card style={{ height: "100%" }}>
      <CardMedia
        className="object-fit-contain"
        component="img"
        alt={title}
        height="140"
        image={image}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {title === "Report" && report && (
          <Box>
            <hr /> 
            <Typography variant="body2" color="text.secondary">
              <strong>Total Assignments:</strong> {report.total_assignments}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Total Marks:</strong> {report.total_marks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Marks Received:</strong> {report.total_marks_received}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Time Taken:</strong> {formatTime(report.total_time_taken)}
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(route)}
        >
          More
        </Button>
      </CardActions>
    </Card>
  );
};

const PaDashboard = () => {
  
  return (
    <Container>
      <Grid container spacing={4}>
        {cardContent.map((content, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ResponsiveCard
              image={content.image}
              title={content.title}
              description={content.description}
              route={content.route}
              // report={content.title === "Report" ? studentReport : null}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PaDashboard;
