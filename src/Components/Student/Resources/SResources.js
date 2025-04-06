import React, { useState, useEffect } from "react";

import { getResources } from "../../../ApiClient";
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import bookCover from "../../../Images/book-cover-placeholder.png";
import ViewBookChepters from "./ViewBookChepters";
import BackButton from "../../../SharedComponents/BackButton";

const SResources = ({ title = "Resources" }) => {
  const userInfo = JSON.parse(localStorage.getItem("UserData"));
  const [resourcesData, setResourcesData] = useState([]);
  const [selectedResource, setSelectedResource] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userInfo.grade_id && userInfo.section_id) {
      setIsLoading(true);
      setResourcesData([]);
      getResources(userInfo.grade_id, userInfo.section_id)
        .then((res) => {
          setResourcesData(res?.data?.book_data || []);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, []);

  const handeCardSelection = (item) => {
    setSelectedResource(item);
    if (item.chapter_list && item.chapter_list.length > 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const FiltersView = () => {
    return <h4 className="mb-3">{title}</h4>;
  };

  const CardList = () => {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {isLoading ? (
          <div className="text-center w-100">
            <CircularProgress color="primary" />
          </div>
        ) : resourcesData?.length > 0 ? (
          resourcesData.map((card) => (
            <Card
              key={card.book_id}
              sx={{
                minWidth: 120,
                margin: "10px",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
              }}
              onClick={() => handeCardSelection(card)}
            >
              <CardMedia
                component="img"
                alt={card.book_name}
                height="100"
                sx={{ padding: "10px", width: "100%" }}
                image={card.book_cover_image_content ?? bookCover}
              />
              <CardContent className="text-center">
                <Typography className="fw-bold">{card.book_name}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="w-100 text-center text-danger">No data available</div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mb-3">
      <BackButton />
      </div>
      <FiltersView />
      <CardList />
      {open && (
        <ViewBookChepters
          isOpen={open}
          handleClose={handleClose}
          selectedData={selectedResource}
        />
      )}
    </>
  );
};

export default SResources;
