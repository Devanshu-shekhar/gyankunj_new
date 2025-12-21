import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { evaluteAssignment, submitEvaluationReport } from "../../../ApiClient";
import "./EvaluteAssignmentReport.css";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Stack, Switch, Typography } from "@mui/material";

const EvaluteAssignmentReport = () => {
  // const { assignmentId, studentId } = useParams();
  const { assignmentId } = useParams();
  const studentId = useParams()['*']; // captures everything after :assignmentId/
  const [evaluationData, setEvaluationData] = useState(null);
  const [marksForWriteAnswer, setMarksForWriteAnswer] = useState({});
  const [isPassed, setIsPassed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    evaluteAssignment(assignmentId, studentId)
      .then((response) => {
        console.log("API Response:", JSON.stringify(response.data));
        setEvaluationData(response.data);
      })
      .catch((error) => {
        console.error("Error evaluating assignment:", error);
      });
  }, [assignmentId, studentId]);

  const submitReport = () => {
    let requestPayload = {
      assignment_data: {},
      overall_time: "0 seconds",
      assignment_id: assignmentId,
      student_id: studentId,
      assignment_passed: isPassed,
    };

    let totalTimeTaken = 0;

    if (
      evaluationData.student_response &&
      Object.keys(evaluationData.student_response).length > 0
    ) {
      let tempData = {};
      for (let [key, value] of Object.entries(
        evaluationData.student_response
      )) {
        tempData[key] = {
          type: value.type,
          question: value.question,
          selected_answer: value.selected_answer,
          all_options: value.all_options,
          marks: value.marks,
          time_taken: value.time_taken,
          correct_answer: evaluationData.teacher_response[key].correct_answer,
          marks_received:
            value.type === "subjective"
            ? marksForWriteAnswer?.[key]?.toString() || 0
            : value.is_answer_correct
            ? value.marks
            : 0,
        };

        totalTimeTaken += value.time_taken;
      }

      requestPayload.overall_time = formatElapsedTime(totalTimeTaken);
      requestPayload.assignment_data = { ...tempData };
    }

    submitEvaluationReport(requestPayload)
      .then((response) => {
        if (response.data.status === "success") {
          navigate(`/teacherDashboard/submissions/${assignmentId}`);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error submit evaluate report:", error);
      });
  };

  const formatElapsedTime = (elapsedTime) => {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    let formattedTime = "";
    if (hours > 0) {
      formattedTime += hours + "h ";
    }
    if (minutes > 0 || hours > 0) {
      formattedTime += minutes + "m ";
    }
    formattedTime += seconds + "s";

    return formattedTime;
  };

  const handleMarksForWriteAnswerChange = (questionNumber, event) => {
    const marks = parseFloat(event.target.value) || 0;
    setMarksForWriteAnswer((prevMarks) => ({
      ...prevMarks,
      [questionNumber]: marks,
    }));
  };

  if (evaluationData === null) {
    return <div>Loading...</div>;
  }

  const handleChange = (event) => {
    setIsPassed(event.target.checked);
  };

  return (
    <>
      <div className="evaluation-report" style={{ marginTop: "100px" }}>
        <div className="section" style={{ width: "100%", margin: "0 auto" }}>
          <h2>Submitted Assignment</h2>
          {Object.keys(evaluationData.student_response).map(
            (questionNumber) => (
              <div key={questionNumber} className="question">
                <div className="left-section" style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: "bold" }}>
                    Question:{" "}
                    {evaluationData.student_response[questionNumber].question}
                  </p>
                  {evaluationData.student_response[questionNumber].type !==
                    "multiple_choice(radio)" &&
                    evaluationData.student_response[questionNumber].type !==
                      "multiple_choice(checkbox)" && (
                      <div>
                        <p>
                          <strong style={{ fontWeight: "bold" }}>
                            Answer:
                          </strong>{" "}
                          {
                            evaluationData.student_response[questionNumber]
                              .selected_answer
                          }
                        </p>
                      </div>
                    )}
                  <p>
                    {evaluationData.student_response[questionNumber].type ===
                    "multiple_choice(radio)"
                      ? evaluationData.student_response[
                          questionNumber
                        ].all_options.map((option, index) => (
                          <div key={index} className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              id={`option_${index}`}
                              value={option}
                              checked={
                                evaluationData.student_response[questionNumber]
                                  .selected_answer === option
                              }
                              readOnly
                            />
                            <label
                              className={`form-check-label ${
                                evaluationData.student_response[questionNumber]
                                  .selected_answer === option
                                  ? "selected"
                                  : ""
                              }`}
                              htmlFor={`option_${index}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))
                      : evaluationData.student_response[questionNumber].type ===
                        "multiple_choice(checkbox)"
                      ? (() => {
                          const selectedAnswers =
                            evaluationData.student_response[questionNumber]
                              .selected_answer;
                          console.log("Selected Answers:", selectedAnswers);
                          return evaluationData.student_response[
                            questionNumber
                          ].all_options.map((option, index) => {
                            return (
                              <div key={index} className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`option_${index}`}
                                  checked={
                                    selectedAnswers &&
                                    selectedAnswers.some((answer) =>
                                      answer.includes(option)
                                    )
                                  }
                                  readOnly
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`option_${index}`}
                                >
                                  {option}
                                </label>
                              </div>
                            );
                          });
                        })()
                      : null}
                  </p>
                  {evaluationData.student_response[questionNumber].type ===
                    "subjective" && (
                    <div className="write-answer-marks">
                      <Form.Group
                        controlId={`marksForWriteAnswer_${questionNumber}`}
                      >
                        <Form.Label style={{ fontWeight: "bold" }}>
                          Marks for Write Answer
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter marks"
                          value={marksForWriteAnswer[questionNumber] || ""}
                          onChange={(event) =>
                            handleMarksForWriteAnswerChange(
                              questionNumber,
                              event
                            )
                          }
                          style={{ width: "30%" }}
                          min={0}
                          max={
                            evaluationData.student_response[questionNumber]
                              .marks
                          }
                        />
                      </Form.Group>
                    </div>
                  )}
                </div>
                <div className="right-section">
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Marks:{" "}
                      {evaluationData.student_response[questionNumber].marks}
                    </span>
                  </p>
                  <p style={{ fontWeight: "bold" }}>
                    Type: {evaluationData.student_response[questionNumber].type}
                  </p>
                  {evaluationData.student_response[questionNumber].type !==
                    "subjective" && (
                    <p>
                      {evaluationData.student_response[questionNumber]
                        .is_answer_correct ? (
                        <span className="text-success fw-bold">
                          Correct: <FaCheck />
                        </span>
                      ) : (
                        <span className="text-danger fw-bold">
                          Incorrect: <FaTimes />
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="d-flex-center flex-column">
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className="fw-bold">Fail</Typography>
          <Switch
            checked={isPassed}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
          <Typography className="fw-bold">Pass</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button className="mt-2" onClick={submitReport}>
            Submit Evaluation
          </Button>
        </Stack>
      </div>
    </>
  );
};

export default EvaluteAssignmentReport;
