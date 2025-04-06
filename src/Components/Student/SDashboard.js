import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";

// Import all images
import assignmentIcon from "../../Images/assignment-icon.jpg";
import routineIcon from "../../Images/routine-icon.jpg";
import reportIcon from "../../Images/report-icon.jpg";
import booksIcon from "../../Images/books-icon.jpg";
import onlineCodingIcon from "../../Images/onlineCoding-Icon.jpg";
import roboticsLabIcon from "../../Images/roboticsLabIcon.jpg";
import languageLabIcon from "../../Images/languageLabIcon.jpg";
import schoolDiaryIcon from "../../Images/schoolDiaryIcon.jpg";

import { useNavigate } from "react-router-dom";


const cardContent = [
  {
    image: assignmentIcon,
    title: "Assignments",
    description: "View and track your child's assignments.",
    route: "/studentDashboard/assignments",
  },
  {
    image: routineIcon,
    title: "Routine",
    description: "Check your child's daily schedule and class routines.",
    route: "/studentDashboard/routine",
  },
  {
    image: reportIcon,
    title: "Performance Analysis",
    description: "Access detailed reports on your child's academic performance and progress.",
    route: "/studentDashboard/reports",
  },
  {
    image: booksIcon,
    title: "Books & Study Material",
    description: "View and manage your child's books and study materials.",
    route: "/studentDashboard/resources",
  },
  {
    image: onlineCodingIcon,
    title: "Online Coding",
    description: "Engage in online coding activities and challenges.",
    route: "/onlineCoding",
  },
  {
    image: roboticsLabIcon,
    title: "Robotics Lab",
    description: "Explore and learn in the robotics lab.",
    route: "/studentDashboard/roboticsLab",
  },
  {
    image: languageLabIcon,
    title: "Language Lab",
    description: "Enhance language skills in the language lab.",
    route: "/studentDashboard/languageLab"
  },
  {
    image: schoolDiaryIcon,
    title: "School Diary",
    description: "Keep track of important notes and messages in the school diary.",
    route: "/studentDashboard/schoolDiary"
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

const SDashboard = () => {

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

export default SDashboard;