import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SidebarBackground from "../../../Images/SidebarBackground_1.png";
const dummyImage = "/path/to/dummy/image.png";

const UserCard = ({ userDetails, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action) => {
    onAction(userDetails, action);
    handleMenuClose();
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <Card
          className="cursor rounded-4 shaped"
          sx={{
            background: `url(${SidebarBackground})`,
          }}
        >
          <CardContent>
            <Box className="d-flex justify-content-end">
              <IconButton className="p-0" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Box className="w-100 d-flex-center">
              <Avatar
                src={userDetails.image || dummyImage}
                alt={userDetails.name}
                style={{ width: 60, height: 60 }}
              />
            </Box>
            <Box className="text-center">
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {userDetails.name}
              </Typography>
            </Box>
            <hr />
            <Box className="mt-3">
              <Typography variant="body2" className="mb-1 fw-bold">
                <CakeOutlinedIcon className="me-1" />{" "}
                {new Date(userDetails.date_of_birth).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" className="mb-1 fw-bold">
                <HistoryOutlinedIcon className="me-1" />{" "}
                {new Date(userDetails.date_of_joining).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" className="mb-1 fw-bold">
                <EmailOutlinedIcon className="me-1" /> {userDetails.email_id??'N/A'}
              </Typography>
              <Typography variant="body2" className="fw-bold">
                <LocalPhoneOutlinedIcon className="me-1" /> {userDetails.phone_number??'N/A'}
              </Typography>
              <Typography variant="body2" className="fw-bold">
                <LocationOnOutlinedIcon className="me-1" /> {userDetails.address??'N/A'}
              </Typography>
            </Box>
          </CardContent>

          {/* 3-Dots Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleActionClick("view")}>
              <RemoveRedEyeOutlinedIcon className="me-1" />
              View
            </MenuItem>
            <MenuItem onClick={() => handleActionClick("edit")}>
              <DriveFileRenameOutlineOutlinedIcon className="me-1" />
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleActionClick("delete")}>
              <DeleteOutlinedIcon className="me-1" />
              Delete
            </MenuItem>
          </Menu>
        </Card>
      </Grid>
    </>
  );
};

export default UserCard;
