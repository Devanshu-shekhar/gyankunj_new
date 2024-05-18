import React from "react";
import { Row, Col } from "react-bootstrap";
import "./studentAssignment.css";

const AnswerTypeUnJumble = ({ ...props }) => {
  return (
    <>
      <Row>
        <Col md={9} className="questionSetHeaderText">
          <p>Unjumble the Words</p>
        </Col>
      </Row>
      {props?.assignmentFullData?.assignment_data?.assignmentDataForStudent?.map(
        (unJumble, indx) => {
          return (
            unJumble?.type === "unjumble" && (
              <div>
                {" "}
                <Row>
                  <Col md={10} className="questionSetHeader">
                    <p className="questionSetText">{unJumble?.question}</p>
                  </Col>
                  <Col md={2}>
                    <p className="questionSetText">{unJumble?.marks}</p>
                  </Col>
                </Row>
                {unJumble?.all_options?.map((unJumbledWord, indx) => {
                  return (
                    <Row style={{ padding: "10px 30px" }}>
                      <Col md={5}>
                        <p>{unJumbledWord}</p>
                      </Col>

                      <Col md={2}></Col>
                      <Col md={5}>
                        <input
                          type="text"
                          placeholder="Unjumble the word"
                          className="fillBlankAnswer"
                        ></input>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )
          );
        }
      )}

      <hr />
    </>
  );
};

export default AnswerTypeUnJumble;
