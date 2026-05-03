import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import AddAnnouncement from "./AddAnnouncement";
import "./noticeCss.css";
import { viewAllNotice } from "../../../ApiClient";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";
import dayjs from "dayjs";

const Announcements = () => {
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [allNotice, setAllNotice] = useState({});
  const [hideResponse, setHideResponse] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const userDetails = JSON.parse(localStorage.getItem("UserData"));

  const handleShowModal = () => {
    setSelectedNotice(null);
    setShowAddAnnouncement(true);
  };

  const allNoticesData = useCallback(() => {
    const user_id = userDetails.user_id;
    viewAllNotice(user_id)
      .then((res) => setAllNotice(res.data))
      .catch((err) => console.log("Notices err - ", err));
  }, [userDetails.user_id]);

  useEffect(() => {
    allNoticesData();
  }, [allNoticesData]);

  const closeAndLoad = () => {
    setSelectedNotice(null);
    setShowAddAnnouncement(false);
    allNoticesData();
  };

  const showPublishModal = (notice) => {
    setSelectedNotice(notice);
    setShowAddAnnouncement(true);
  };

  const showResponseHandler = (id) => {
    let openHandler = [...hideResponse];
    openHandler.push(id);
    setHideResponse([...openHandler]);
  };

  const hideResponseHandler = (id) => {
    let openHandler = [...hideResponse];
    let findindex = openHandler.indexOf(id);

    if (findindex > -1) {
      openHandler.splice(findindex, 1);
      setHideResponse([...openHandler]);
    }
  };

  return (
    <div className="resourcesHeader">
      <Row
        style={{
          height: "74px",
          boxShadow: "0px 3px 6px #B4B3B329",
          position: "relative",
          left: "12px",
          width: "100%",
        }}
      >
        <Col md={7}>
          <h4>Notice</h4>
        </Col>
        <Col md={2} className="teacherRoutingDD"></Col>
        <Col md={3} className="teacherRoutingDD">
          <Button variant="outline-primary" onClick={handleShowModal}>
            + Add Notice
          </Button>{" "}
        </Col>
      </Row>
      {allNotice?.status === "failure" ? (
        <Row style={{ height: "93px" }}>
          <Col md={12} style={{ paddingTop: "30px" }}>
            <span className="failureMessage">{allNotice.message}</span>
          </Col>
        </Row>
      ) : (
        <div className="announcementList">
          {allNotice?.notices?.map((notice) => (
            <fieldset key={notice?.notice_id} className="announcementCard">
              <div className="announcementTopRow">
                <div className="announcementToggle">
                  {hideResponse?.includes(notice?.notice_id) ? (
                    <FaAngleUp
                      className="toggleIcon"
                      onClick={() => hideResponseHandler(notice?.notice_id)}
                    />
                  ) : (
                    <FaAngleDown
                      className="toggleIcon"
                      onClick={() => showResponseHandler(notice?.notice_id)}
                    />
                  )}
                </div>
                <div className="announcementContent">
                  <div className="announcementHeaderRow">
                    <h6 className="noticeHeader">{notice?.notice_subject}</h6>
                    <span
                      className={`noticeStatus ${notice?.published_at ? "published" : "draft"}`}
                    >
                      {notice?.published_at ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="noticeMetaRow">
                    {notice?.published_at ? (
                      <p className="noticeTime">
                        {dayjs(notice?.published_at).format("DD-MM-YYYY")}
                      </p>
                    ) : (
                      <div className="noticeActionRow">
                        <span className="notPubnoticeTime">Not yet published.</span>
                        <Button
                          variant="link"
                          className="publishLink"
                          onClick={() => showPublishModal(notice)}
                        >
                          Publish now
                        </Button>
                      </div>
                    )}
                  </div>

                  {hideResponse.includes(notice?.notice_id) && (
                    <div className="announcementDescription">
                      <h6 className="descriptionHeader">Description :</h6>
                      <p className="descriptionData">{notice?.notice_data}</p>
                    </div>
                  )}
                </div>
              </div>
            </fieldset>
          ))}
        </div>
      )}
      {showAddAnnouncement && (
        <AddAnnouncement
          show={showAddAnnouncement}
          onHide={() => {
            setShowAddAnnouncement(false);
            setSelectedNotice(null);
          }}
          closeAndLoad={closeAndLoad}
          notice={selectedNotice}
        />
      )}
    </div>
  );
};

export default Announcements;
