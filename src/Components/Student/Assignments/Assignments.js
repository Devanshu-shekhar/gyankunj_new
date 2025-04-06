import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  Form,
  Pagination,
} from "react-bootstrap";
import { studentAssignmentList } from "../../../ApiClient";
import AssignmentSheet from "./StartAssignment";
import dayjs from "dayjs";
import BackButton from "../../../SharedComponents/BackButton";

const StudentAssigments = () => {
  const [showAssignmentSheet, setShowAssignmentSheet] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("UserData"));
  const [assignmentFullList, setAssignmentFullList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [assignmentsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    fetchStudentAssignments();
  }, []);

  const fetchStudentAssignments = () => {
    const student_id = userDetails.user_id;
    studentAssignmentList(student_id)
      .then((res) => {
        const sortedAssignments = res.data.student_assignments.sort(
          (a, b) => new Date(b.assigned_on) - new Date(a.assigned_on)
        );
        setAssignmentFullList({ student_assignments: sortedAssignments });
      })
      .catch((err) => console.log("Assignment Tab err - ", err));
  };

  const startAssignment = (id) => {
    setEditIndex(id);
    setShowAssignmentSheet(true);
  };

  const closeAssignment = () => {
    setShowAssignmentSheet(false);
  };

  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;

  const filteredAssignments =
    assignmentFullList?.student_assignments?.filter((assignment) => {
      if (!filter) return true;
      return assignment.assignment_status === filter;
    }) || [];

  const currentAssignments = filteredAssignments.slice(
    indexOfFirstAssignment,
    indexOfLastAssignment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <BackButton />
      <Row style={{ margin: "20px 0px" }}>
      <div className="assignmentTabData">
        <Row
          style={{
            height: "68px",
            boxShadow: "0px 3px 6px #B4B3B329",
            position: "relative",
            left: "12px",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Col md={4}>
            <h4>All Assignments</h4>
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by Assignment Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                Filter by:
              </span>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ maxWidth: "200px" }}
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Submitted">Submitted</option>
              </Form.Select>
            </div>
          </Col>
        </Row>
        <Row
          md={12}
          style={{ justifyContent: "space-evenly", paddingTop: "20px" }}
        >
          <Col md={12} className="AssignmentDetails">
            <Table striped bordered hover>
              <thead>
                <tr
                  style={{
                    background: "#7A9ABF",
                    borderRadius: "4px",
                    opacity: "1",
                    color: "white",
                  }}
                >
                  <th>Sl. No.</th>
                  <th>Subject</th>
                  <th>Assignment Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Assigned On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAssignments
                  .filter((assignment) =>
                    assignment.assignment_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((assignment, indx) => (
                    <tr
                      key={assignment.assignment_id}
                      style={{
                        background: indx % 2 === 0 ? "#f2f2f2" : "white",
                      }}
                    >
                      <td>{indx + 1}</td>
                      <td>{assignment.subject_name}</td>
                      <td>{assignment.assignment_name}</td>
                      <td>{assignment.assignment_type_name}</td>
                      <td>{assignment.assignment_status}</td>
                      <td>
                        {dayjs(assignment?.assigned_on).format("DD-MM-YYYY")}
                      </td>
                      <td>
                        {assignment.assignment_status === "New" && (
                          <Button
                            variant="primary"
                            onClick={() =>
                              startAssignment(assignment.assignment_id)
                            }
                          >
                            Start
                          </Button>
                        )}
                        {["Inprogress", "In Progress"].includes(
                          assignment.assignment_status
                        ) && (
                          <Button
                            variant="primary"
                            onClick={() =>
                              startAssignment(assignment.assignment_id)
                            }
                          >
                            Continue
                          </Button>
                        )}
                        {assignment.assignment_status === "Submitted" && (
                          <Button
                            variant="primary"
                            onClick={() =>
                              startAssignment(assignment.assignment_id)
                            }
                          >
                            Check Assignment
                          </Button>
                        )}
                        {showAssignmentSheet &&
                          editIndex === assignment.assignment_id && (
                            <AssignmentSheet
                              show={showAssignmentSheet}
                              onHide={closeAssignment}
                              assignmentId={assignment.assignment_id}
                              assignmentType={assignment.assignment_type_name}
                              assignmentName={assignment.assignment_name}
                              setAssignmentFullList={setAssignmentFullList}
                              assignmentStatus={
                                assignment.assignment_status === "Submitted"
                              }
                            />
                          )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row md={12}>
          <Col className="text-center">
            <Pagination>
              {Array.from(
                {
                  length: Math.ceil(
                    filteredAssignments?.length / assignmentsPerPage
                  ),
                },
                (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                )
              )}
            </Pagination>
          </Col>
        </Row>
      </div>
    </Row>
    </>
    
  );
};

export default StudentAssigments;
