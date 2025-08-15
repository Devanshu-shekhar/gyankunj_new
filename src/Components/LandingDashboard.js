import React, { useEffect, useRef, useState } from "react";
import home from "../Images/home.svg";
import about from "../Images/aboutimg.svg";
import detail from "../Images/detail.svg";
import admin from "../Images/admin.jpeg";
import parent from "../Images/parent.jpg";
import teacher from "../Images/forteacher.svg";
import student from "../Images/forstudent.svg";
import Gyankoonj_logo from "../Images/Gyankoonj_logo.png";
import { Button, Fab } from "@mui/material";
import UserBasicDetailsForm from "./UserBasicDetailsForm";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const LandingDashboard = ({ mainContainer }) => {
  const featureSectionRef = useRef(null);
  const learnMoreSectionRef = useRef(null);
  const container = mainContainer?.current;
  const [showGoToTop, setShowGoToTop] = useState(false);

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (container && container.scrollTop > 300) {
        setShowGoToTop(true);
      } else {
        setShowGoToTop(false);
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [container]);

  return (
    <>
      <div
        className="d-flex flex-column flex-lg-row justify-content-between align-items-center px-3"
        style={{
          background:
            "linear-gradient(95deg, #236eb4 2.39%, #6171bc 32.45%, #e878cf 97.66%)",
        }}
      >
        <div className="text-container text-white" style={{ flex: 1 }}>
          <p className="display-5">
            Upgrade your schools for better Performance
          </p>
          <p className="lead">
            Gyaankoonj is the first ever cloud-based School Management Software
            providing an amazing automated experience to educational
            institutions of all size with its highly scalable, secure and robust
            ERP solutions. Our School ERP Software is designed to simplify all
            your academic and back office chores with unmatched efficiencies and
            empowering you to keep up with the learning demands of the 21st
            century, that too, with the most user-friendly interface.
          </p>
          <div className="d-flex gap-2">
            <Button
              variant="contained"
              className="bg-gradient"
              onClick={() => scrollToSection(featureSectionRef)}
            >
              Check Module
            </Button>
            <Button
              variant="contained"
              className="bg-gradient"
              onClick={() => scrollToSection(learnMoreSectionRef)}
            >
              Learn more
            </Button>
          </div>
        </div>
        <div className="img-container mt-3 mt-lg-0">
          <img alt="img" className="w-100" style={{ height: 500 }} src={home} />
        </div>
      </div>

      <div
        className="d-flex flex-column-reverse flex-lg-row justify-content-between align-items-center px-3"
        style={{
          background: "#f4f4f4",
        }}
      >
        <div className="img-container mt-3 mt-lg-0">
          <img
            alt="img"
            className="w-100"
            style={{ height: 500 }}
            src={about}
          />
        </div>
        <div className="text-container" style={{ flex: 1 }}>
          <p className="display-5">Learn new concepts for each question</p>
          <p className="lead">
            If you are looking for a Tailor-Fit Cloud ERP Software for your
            School/College with Better Administration, Better Reports & Better
            Communication. Then the answer is Gyankunj.
          </p>
          <p className="lead">A Single Tool to Manage Entire Institute</p>
        </div>
      </div>

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center px-3">
        <div className="text-container" style={{ flex: 1 }}>
          <p className="display-5">Tools For Teachers And Learners</p>
          <p className="lead">
            Class has a dynamic set of teaching tools built to be deployed and
            used during class. Teachers can handout assignments in real-time for
            students to complete and submit. Discussion forums for ongoing
            conversations, allowing students to ask questions, share resources,
            and collaborate beyond class hours. Automatic attendance tracking
            based on student logins or participation in class activities.
          </p>
        </div>
        <div className="img-container mt-3 mt-lg-0">
          <img
            alt="img"
            className="w-100"
            style={{ height: 500 }}
            src={detail}
          />
        </div>
      </div>

      <div
        className="p-3 text-center"
        style={{
          background:
            "linear-gradient(95deg, #e878cf 2.39%, #6171bc 32.45%, #236eb4 97.66%)",
        }}
      >
        <p className="display-5 text-white">All-In-One Cloud Software.</p>
        <p className="lead text-white">
          Gyankunj is one powerful online software suite that combines all the
          tools needed to run a successful school or office. Personalized
          learning materials tailored to individual student needs. Integration
          with educational content platforms to provide additional resources and
          practice materials.
        </p>
        <div className="row justify-content-center">
          <div className="d-flex flex-wrap justify-content-around w-75">
            {[
              "Tracking & Reporting",
              "Any Academy or System",
              "Student Tracking",
              "End to End solution",
              "Secure & Relatable",
              "Well informed",
            ].map((title, index) => (
              <div
                key={index}
                className="card m-4 p-3 shadow-sm text-left"
                style={{ width: 300, height: 300 }}
              >
                <span className="h4 font-weight-bold mb-2 text-primary-emphasis">
                  {title}
                </span>
                <span>
                  Simple and secure control of your organization’s financial and
                  legal transactions. Send customized invoices and contracts.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 text-center" ref={featureSectionRef}>
        <p className="display-5">Features of Gyankoonj</p>
        <p className="lead">
          Gyankoonj is a platform that allows educators to create online classes
          whereby they can store the course materials online; manage
          assignments, quizzes and exams; monitor due dates; grade results and
          provide students with feedback all in one place.
        </p>
        <div className="images">
          <div className="image-container mb-4">
            <img src={teacher} alt="teacher" className="teacher-image w-100" />
            <div className="hover-content">
              <p>FOR INSTRUCTORS</p>
              <ul className="bullet-list">
                <li>Attendance Mark-up of Students.</li>
                <li>Assign ClassWork, HomeWork, Timed Test And Quizzes.</li>
                <li>Auto Submission Of timed Exams and Tests.</li>
                <li>Manual & Auto Correction Of Answer Scripts.</li>
                <li>Canvas Feature.</li>
              </ul>
            </div>
          </div>

          <div className="image-container mb-4">
            <img src={student} alt="student" className="w-100" />
            <div className="hover-content">
              <p>FOR STUDENTS</p>
              <ul className="bullet-list">
                <li>Remote Access From anywhere.</li>
                <li>
                  Take up/ Submit Homework/ Classwork/ Test and Quizzes on this
                  platform.
                </li>
                <li>Access to Unlimited E-Books and Course material.</li>
                <li>Make Digital notes. Listen and Learn.</li>
                <li>Performance Feedback.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="images">
          <div className="image-container">
            <img
              src={parent}
              height="400px"
              width="600px"
              alt="teacher"
              className="teacher-image"
            />
            <div className="hover-content">
              <p>FOR PARENTS</p>
              <ul className="bullet-list">
                <li>
                  Access to your child's assignments, grades, and progress in
                  one place.
                </li>
                <li>
                  Direct communication with teachers promotes teamwork for your
                  child's success.
                </li>
                <li>
                  Help your child manage their responsibilities with ease and
                  guidance.
                </li>
                <li>
                  Tailored learning paths to suit your child's needs and style.
                </li>
              </ul>
            </div>
          </div>

          <div className="image-container">
            <img src={admin} className="w-100" alt="student" />
            <div className="hover-content">
              <p>FOR ADMINISTRATION</p>
              <ul className="bullet-list">
                <li>User Validation & Authentication.</li>
                <li>Activity Monitoring For Staff and Student.</li>
                <li>Performance Report Of Staff & Student.</li>
                <li>Assignment Allocation for Staff & Student.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className="d-flex flex-column flex-lg-row justify-content-around align-items-center px-3"
        ref={learnMoreSectionRef}
        style={{ background: "#f4f4f4" }}
      >
        <UserBasicDetailsForm />
      </div>
      <div
        className="text-white text-center p-4"
        style={{ background: "#252641" }}
      >
        <div className="mb-3">
          <img
            src={Gyankoonj_logo}
            alt="Logo"
            className="mb-2"
            style={{ width: 150 }}
          />
          <div
            className="border bg-white mx-auto mb-2"
            style={{ width: 100, height: 2 }}
          ></div>
          <p>Virtual Class for Students</p>
        </div>
        <div className="footer2 mb-3">
          <p>Subscribe to get our Newsletter</p>
          <div className="resources d-flex justify-content-center mt-2">
            <input
              className="form-control me-2"
              type="email"
              placeholder="Your Email"
              style={{ width: "auto" }}
            />
            <Button variant="contained" className="bg-gradient">
              Subscribe
            </Button>
          </div>
        </div>
        <p>©2024 Gyankoonj.</p>
      </div>

      {/* Go to Top Button */}
      {showGoToTop && (
        <Fab
          color="primary"
          aria-label="go to top"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
          onClick={scrollToTop}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}

      <style jsx="true">
        {`
          .card {
            width: 300px;
            height: 300px;
            flex-shrink: 0;
            border-radius: 20px;
            background: #fff;
            box-shadow: 0px 10px 60px 0px rgba(38, 45, 118, 0.08);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
          .images {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
          }

          .image-container {
            position: relative;
          }

          .image-container img {
            width: 100%;
            height: 300px;
            border-radius: 10px;
          }

          .hover-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 10px;
            border-radius: 0 0 10px 10px;
            display: none;
            text-align: left;
          }

          .image-container:hover .hover-content {
            display: block;
          }

          @media (min-width: 768px) {
            .d-flex.flex-column.flex-lg-row,
            .d-flex.flex-column-reverse.flex-lg-row {
              flex-direction: row !important;
            }
            .images {
              flex-direction: row;
            }
          }
          @media only screen and (max-width: 768px) {
            .img-container img {
              height: 250px !important;
            }
            .image-container {
              margin-bottom: 0 !important;
            }
            .image-container img {
              height: auto !important;
            }
            .text-container {
              padding-top: 16px;
            }
            .display-5 {
              font-size: 20px;
            }
            .lead {
              font-size: 16px;
            }
            .w-75 {
              width: 100% !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default LandingDashboard;
