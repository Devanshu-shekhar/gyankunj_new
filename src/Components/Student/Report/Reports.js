import React from "react";
import { Row, Col } from "react-bootstrap";
import SadImg from "../../../Images/SadImg.png";
import BackButton from "../../../SharedComponents/BackButton";

const StudentReportSection = () => {
  return (
    <>
      <BackButton />
      <div className="reportSection">
        <Row
          style={{
            height: "74px",
            boxShadow: "0px 3px 6px #B4B3B329",
            position: "relative",
            left: "12px",
            width: "100%",
          }}
        >
          <Col md={4}>
            <h4>Report</h4>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h1
              style={{
                position: "relative",
                top: "100px",
                color: "#0071FF",
                font: "normal normal normal 29px/26px Roboto",
              }}
            >
              Since you are new here, it will take some time to prepare your
              report card!!
            </h1>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <img
              alt="img"
              src={SadImg}
              style={{ position: "relative", top: "150px" }}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default StudentReportSection;
