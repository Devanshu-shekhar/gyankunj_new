import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col, Alert } from "react-bootstrap";
import Select from "react-select";
import { saveNotice, publishNotice } from "../../../ApiClient";

const AddAnnouncement = ({ notice, show, onHide, closeAndLoad }) => {
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeSubject, setNoticeSubject] = useState("");
  const [visibilityData, setVisibilityData] = useState("");
  const [saveNoticeDetails, setSaveNoticeDetails] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("UserData"));

  const visibilityOptions = [
    { value: "teacher", label: "Teacher" },
    { value: "student", label: "Student" },
    { value: "teacher_and_student", label: "Teacher and Student" },
    { value: "student_and_parent", label: "Student and Parent" },
    { value: "teacher_and_parent", label: "Teacher and Parent" },
    { value: "all", label: "Everyone" },
  ];

  useEffect(() => {
    if (notice) {
      setNoticeSubject(notice.notice_subject || "");
      setNoticeDescription(notice.notice_data || "");
      setSaveNoticeDetails({ notice_id: notice.notice_id });
      setVisibilityData("");
      setStatusMessage("");
    } else {
      setNoticeSubject("");
      setNoticeDescription("");
      setVisibilityData("");
      setSaveNoticeDetails({});
      setStatusMessage("");
    }
  }, [notice, show]);

  const saveNoticeData = async () => {
    setIsLoading(true);
    const data = {
      user_id: userDetails?.user_id,
      data: noticeDescription,
      notice_subject: noticeSubject,
    };

    try {
      const res = await saveNotice(data);
      setSaveNoticeDetails(res.data);
      setStatusMessage("Notice saved successfully. Select visibility to publish.");
    } catch (err) {
      console.error("Notice Err", err);
      setStatusMessage("Unable to save notice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const publishNoticeData = async () => {
    const noticeId = notice?.notice_id || saveNoticeDetails?.notice_id;
    if (!noticeId) {
      setStatusMessage("Please save the notice before publishing.");
      return;
    }

    setIsLoading(true);
    const data = {
      notice_id: noticeId,
      visibility: visibilityData,
    };

    try {
      const res = await publishNotice(data);
      console.log("Publish Notice Res", res.data);
      setStatusMessage("Notice published successfully.");
      closeModal();
    } catch (err) {
      console.error("Notice Err", err);
      setStatusMessage("Unable to publish notice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    onHide();
    closeAndLoad();
  };

  return (
    <>
      <Modal
        className="ModalBody"
        show={show}
        onHide={closeModal}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{notice ? "Publish Notice" : "Add Notice"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="noticeSubject">
                  <Form.Label>Notice Subject</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter notice subject"
                    onChange={(e) => setNoticeSubject(e.target.value)}
                    value={noticeSubject}
                    disabled={Boolean(notice)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="noticeDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write notice details"
                    value={noticeDescription}
                    onChange={(e) => setNoticeDescription(e.target.value)}
                    disabled={Boolean(notice)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Label>Visibility</Form.Label>
                <Select
                  placeholder="Select audience"
                  options={visibilityOptions}
                  isSearchable={false}
                  value={visibilityOptions.find((opt) => opt.value === visibilityData) || null}
                  onChange={(e) => setVisibilityData(e?.value)}
                />
              </Col>
            </Row>

            {statusMessage && (
              <Row className="mb-3">
                <Col md={12}>
                  <Alert variant="info" className="mb-0">
                    {statusMessage}
                  </Alert>
                </Col>
              </Row>
            )}

            {notice && (
              <Row className="mb-3">
                <Col md={12}>
                  <div className="text-muted">
                    This notice is already saved. Choose visibility and publish it.
                  </div>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {!notice && (
            <Button
              disabled={
                !noticeSubject ||
                !noticeDescription ||
                Boolean(saveNoticeDetails?.notice_id)
              }
              variant="primary"
              onClick={saveNoticeData}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          )}
          <Button
            disabled={
              !visibilityData ||
              isLoading ||
              (!notice && !saveNoticeDetails?.notice_id)
            }
            variant="success"
            onClick={publishNoticeData}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddAnnouncement;
