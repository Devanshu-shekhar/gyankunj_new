import React, { useEffect, useState } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { loadAssignmentData, submitStudentAssignment } from "../../../ApiClient";
import "./studentAssignment.css";
import { showAlertMessage } from "../../AlertMessage";
import { usePrompt } from "./usePrompt";

const AssignmentSheet = (props) => {
  console.log("Assignment Status:", props.assignmentStatus);

  const [fullscreen] = useState(true);
  const [assignlist, setAssignList] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});

  const [show, setShow] = useState({
    show: false,
    index: "",
  });
  const [timers, setTimers] = useState([]);
  const [assignmentDuration, setAssignmentDuration] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showSubmitWarning] = useState(false);
  const [elapsedTimes, setElapsedTimes] = useState({});
  const { assignmentStatus } = props;
  const [showAlert, setShowAlert] = useState("");
  const [showStatusMessage, setShowAlertMessage] = useState("");

  useEffect(() => {
    fetchAssignmentData();
  }, []);

  const areFieldsDisabled = () => {
    return assignmentStatus;
  };

  useEffect(() => {
    if (timeLeft === 14 && props.assignmentType === "Test") {
      setShowTimeWarning(true);
    }
  }, [timeLeft, props.assignmentType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = timeLeft - 1;
      if (newTimeLeft >= 0) {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const userDetails = JSON.parse(localStorage.getItem("UserData"));

  const fetchAssignmentData = () => {
    const AssignmentId = props.assignmentId;
    const userId = JSON.parse(localStorage.getItem("UserData"))?.user_id;
    loadAssignmentData(AssignmentId, userId)
      .then((res) => {
        setAssignList(Object.values(res.data.assignment_data));
        setTimers(
          new Array(Object.values(res.data.assignment_data).length).fill({
            startTime: null,
            endTime: null,
            elapsedTime: 0,
          })
        );
        setAssignmentDuration(res.data.assignment_duration);
        setTimeLeft(res.data.assignment_duration * 60);
      })
      .catch((err) => console.log("AssignmentData err - ", err));
  };

  useEffect(() => {
    if (assignmentDuration !== null) {
      setTimeLeft(assignmentDuration * 60);
    }
  }, [assignmentDuration]);

  const handleShowQuestion = (index) => {
    if (show.index !== "") {
      const newTimers = [...timers];
      const now = Date.now();
      const elapsed = now - newTimers[show.index].startTime;
      newTimers[show.index].endTime = now;
      newTimers[show.index].elapsedTime += elapsed;
      setTimers(newTimers);

      const newElapsedTimes = { ...elapsedTimes };
      newElapsedTimes[show.index] = newTimers[show.index].elapsedTime;
      setElapsedTimes(newElapsedTimes);
    }

    startTimerForQuestion(index);

    setShow({
      show: true,
      index: index,
    });
  };
  const startTimerForQuestion = (index) => {
    const newTimers = [...timers];
    newTimers[index] = {
      startTime: Date.now(),
      endTime: null,
      elapsedTime: elapsedTimes[index] || 0,
    };
    setTimers(newTimers);
  };
  const handleQuestionCardClick = (index) => {
    if (show.index !== "") {
      const newTimers = [...timers];
      const now = Date.now();
      const elapsed = now - newTimers[show.index].startTime;
      newTimers[show.index].endTime = now;
      newTimers[show.index].elapsedTime += elapsed;
      setTimers(newTimers);

      const newElapsedTimes = { ...elapsedTimes };
      newElapsedTimes[show.index] = newTimers[show.index].elapsedTime;
      setElapsedTimes(newElapsedTimes);
    }

    startTimerForQuestion(index);
    handleShowQuestion(index);
    setShow({
      show: true,
      index: index,
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

  const formatTime = (seconds) => {
    if (seconds <= 0) {
      return "Time's up!";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} seconds`;
  };

  const handleUserAnswerChange = (value, questionId) => {
    setUserAnswers((prevState) => ({
      ...prevState,
      [questionId]: value,
    }));

    const questionIndex = parseInt(questionId.split("_").pop()) - 1;

    setAssignList((prevState) => {
      const updatedList = [...prevState];
      updatedList[questionIndex].selected_answer = value;
      return updatedList;
    });
  };

  const saveOrSubmitAssignment = (submit) => {
    if (show.index !== "") {
      const newTimers = [...timers];
      newTimers[show.index].endTime = Date.now();
      const elapsed =
        (newTimers[show.index].endTime - newTimers[show.index].startTime) /
        1000; // Convert milliseconds to seconds
      newTimers[show.index].elapsedTime += elapsed;
      setTimers(newTimers);
    }

    // Calculate total time taken for all questions
    const totalTimeTaken = timers.reduce(
      (total, timer) => total + timer.elapsedTime,
      0
    );

    const assignmentData = assignlist.map((question, index) => {
      const questionId = `question_number_${index + 1}`;
      const elapsedTime = timers[index].elapsedTime;
      const questionTimeTaken = elapsedTime;
      return {
        [questionId]: {
          type: question.type,
          question: question.question,
          selected_answer: question.selected_answer,
          all_options: question.all_options,
          marks: question.marks,
          time_taken: questionTimeTaken,
        },
      };
    });

    const overallTime = formatElapsedTime(totalTimeTaken);

    const requestBody = {
      student_id: userDetails.user_id,
      assignment_data: Object.assign({}, ...assignmentData),
      overall_time: overallTime,
      assignment_id: props.assignmentId,
      submit_data: submit,
    };

    console.log("Request Body:", requestBody);

    submitStudentAssignment(requestBody)
      .then((res) => {
        if (res?.data?.status === "success") {
          setShowAlert("success");
          setShowAlertMessage(res?.data?.message || "Assignment saved successfully!");
        } else {
          setShowAlert("error");
          setShowAlertMessage(res?.data?.message || "Failed to save assignment.");
        }
        setTimeout(() => {
          props.onHide(true);
          setTimeout(() => {
            setShowAlert("");
            setShowAlertMessage("");
          }, 2000);
        }, 1000);
      })
      .catch((err) => {
        setShowAlert("error");
        setShowAlertMessage("Failed to save assignment.");
        setTimeout(() => {
          setShowAlert("");
          setShowAlertMessage("");
        }, 3000);
      });
  };

  useEffect(() => {
    if (timeLeft === 14 && props.assignmentType === "Test") {
      setShowTimeWarning(true);
      setTimeout(() => {
        setShowTimeWarning(false);
      }, 3000);
    }
  }, [timeLeft, props.assignmentType]);

  useEffect(() => {
    if (timeLeft === 0 && props.assignmentType === "Test" && !assignmentStatus) {
      console.log("Time's up! Auto-submitting...");
      saveOrSubmitAssignment(true);
    }
  }, [timeLeft, props.assignmentType, assignmentStatus]);


  const isTestMode = props.assignmentType === "Test" && !props.assignmentStatus;
  usePrompt("Are you sure you want to leave this test?", isTestMode);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isTestMode) {
        const message = "Are you sure you want to leave this test?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const handlePopState = (e) => {
      if (isTestMode) {
        const confirmLeave = window.confirm("Are you sure you want to leave this test?");
        if (!confirmLeave) {
          window.history.pushState(null, null, window.location.pathname);
        }
      }
    };

    if (isTestMode) {
      window.history.pushState(null, null, window.location.pathname);
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isTestMode]);



  return (
    <>
      <Modal
        className="ModalBody"
        {...props}
        fullscreen={fullscreen}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ backgroundColor: "#E1E9F3" }}
      >
        <Modal.Header
          closeButton
          style={{
            background: "#7A9ABF 0% 0% no-repeat padding-box",
            borderRadius: "4px 4px 0px 0px",
            opacity: "1",
          }}
        >
          <Col md={8} className="assignmentName">
            Name of the assignment: <b>{props?.assignmentName}</b>
          </Col>
          <Col md={4} className="assignmentName">
            {!props.assignmentStatus && props.assignmentType !== "Test" && (
              <Button
                variant="primary"
                onClick={() => saveOrSubmitAssignment(false)}
              >
                Save Progress
              </Button>
            )}
          </Col>

          {showSubmitWarning && (
            <div className="submit-warning">
              <p>Your assignment will be auto-submitted in a few seconds.</p>
            </div>
          )}
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
            <div className="assignmentNameHeader">
              {props.assignmentType === "Test" && (
                <Row>
                  <Col md={2} className="assignmentName">
                    <div className="duration-container">
                      {timeLeft > 0 ? (
                        <>
                          <div className="duration-text">
                            Duration: {formatTime(timeLeft)}
                          </div>
                        </>
                      ) : (
                        <div>Time's up!</div>
                      )}
                    </div>
                  </Col>
                  {timeLeft > 0 && (
                    <Col md={10} className="progress-ring">
                      <div className="progress-ring">
                        <svg
                          className="progress-circle"
                          width="60"
                          height="60"
                        >
                          <circle
                            className="progress-circle"
                            stroke="#4CAF50"
                            strokeWidth="8"
                            fill="transparent"
                            r="26"
                            cx="30"
                            cy="30"
                            style={{
                              strokeDasharray: 2 * Math.PI * 26,
                              strokeDashoffset: `calc(${2 * Math.PI * 26
                                } - (${2 * Math.PI * 26} * ${timeLeft} / (${assignmentDuration * 60
                                })))`,
                            }}
                          />
                        </svg>
                      </div>
                    </Col>
                  )}
                </Row>
              )}
            </div>
          </Modal.Body>

          <Modal
            show={showTimeWarning}
            onHide={() => setShowTimeWarning(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Time Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>Hurry up! Only 14 seconds remaining.</Modal.Body>
            <Modal.Footer>
              {/* <Button variant="secondary" onClick={() => setShowTimeWarning(false)}>OK</Button> */}
            </Modal.Footer>
          </Modal>
          <div className="card-container">
            {assignlist?.map((question, index) => (
              <div
                key={index}
                className="question-card"
                onClick={() => handleQuestionCardClick(index)}
              >
                <div className="question-text">
                  Q.{index + 1} {question?.question}
                </div>
                <div className="answer-section">
                  <div className="type-info">
                    <strong>Type:</strong> {question.type}
                  </div>
                  {timers[index] && (
                    <div className="elapsed-time">
                      <strong>Elapsed Time:</strong>{" "}
                      {formatTime(timers[index].elapsedTime / 1000)}
                    </div>
                  )}
                  {question.type === "multiple_choice(radio)" && (
                    <div className="options-container">
                      <p>
                        <strong>Options:</strong>
                      </p>
                      <ul className="options-list single-select">
                        {question.all_options.map((option, idx) => (
                          <li key={idx}>
                            <label className="option-label">
                              <input
                                disabled={areFieldsDisabled()}
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={
                                  userAnswers[
                                  `question_number_${index + 1}`
                                  ] === option ||
                                  question.selected_answer === option
                                }
                                onChange={(e) => {
                                  handleUserAnswerChange(
                                    e.target.value,
                                    `question_number_${index + 1}`
                                  );
                                  const newSelectedAnswer = e.target.value;
                                  setAssignList((prevState) => {
                                    const updatedList = [...prevState];
                                    updatedList[index].selected_answer =
                                      newSelectedAnswer;
                                    return updatedList;
                                  });
                                }}
                              />
                              <span className="option-text">{option}</span>
                              {userAnswers[`question_number_${index + 1}`] ===
                                option && (
                                  <span className="selected-indicator"></span>
                                )}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {question.type === "multiple_choice(checkbox)" && (
                    <div className="options-container">
                      <p>
                        <strong>Options:</strong>
                      </p>
                      <ul className="options-list multi-select">
                        {question.all_options.map((option, idx) => (
                          <li key={idx}>
                            <label className="option-label">
                              <input
                                disabled={areFieldsDisabled()}
                                type="checkbox"
                                name={`question-${index}`}
                                value={option}
                                checked={
                                  userAnswers[
                                    `question_number_${index + 1}`
                                  ]?.includes(option) ||
                                  (question.selected_answer &&
                                    question.selected_answer.includes(option))
                                }
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  const option = e.target.value;
                                  let updatedOptions;

                                  if (isChecked) {
                                    updatedOptions = [
                                      ...(userAnswers[
                                        `question_number_${index + 1}`
                                      ] || []),
                                      option,
                                    ];
                                  } else {
                                    updatedOptions = (
                                      userAnswers[
                                      `question_number_${index + 1}`
                                      ] || []
                                    ).filter(
                                      (selectedOption) =>
                                        selectedOption !== option
                                    );
                                  }

                                  // console.log("Updated options:", updatedOptions);

                                  handleUserAnswerChange(
                                    updatedOptions,
                                    `question_number_${index + 1}`
                                  );
                                }}
                              />
                              <span className="option-text">{option}</span>
                              {question.selected_answer &&
                                question.selected_answer.includes(option) && (
                                  <span className="selected-indicator"></span>
                                )}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(question.type === "fill_in_the_blanks" ||
                    question.type === "subjective") && (
                      <div className="answer-container">
                        <p>
                          <strong>Answer:</strong>
                        </p>
                        <textarea
                          className="answer-textarea"
                          rows={4}
                          cols={50}
                          placeholder="Type your answer here..."
                          value={
                            userAnswers[`question_number_${index + 1}`] ||
                            question.selected_answer
                          }
                          onChange={(e) =>
                            handleUserAnswerChange(
                              e.target.value,
                              `question_number_${index + 1}`
                            )
                          }
                          disabled={areFieldsDisabled()}
                        />
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {!props.assignmentStatus && (
            <Button
              variant="outline-primary"
              onClick={() => saveOrSubmitAssignment(true)}
            >
              Submit Assignment
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {showAlert &&
        showAlertMessage({
          open: true,
          alertFor: showAlert,
          message: showStatusMessage,
        })}
    </>
  );
};

export default AssignmentSheet;
