import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Grid,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { green, orange } from "@mui/material/colors";
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

const EmployeeCard = ({ employee, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action) => {
    onAction(employee, action);
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
                src={employee.image || dummyImage}
                alt={employee.name}
                style={{ width: 60, height: 60 }}
              />
            </Box>
            <Box className="text-center">
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {employee.employeename}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {employee.designationname??employee.designationid}
              </Typography>
              <Chip
                className="mt-2 text-white"
                label={employee.is_active ? "ACTIVE" : "INACTIVE"}
                style={{
                  backgroundColor: employee.is_active ? green[400] : orange[400],
                }}
              />
            </Box>
            <hr />
            <Box className="mt-3">
              <Typography variant="body2" className="mb-1 fw-bold">
                <CakeOutlinedIcon className="me-1" />{" "}
                {new Date(employee.dob).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" className="mb-1 fw-bold">
                <HistoryOutlinedIcon className="me-1" />{" "}
                {new Date(employee.doj).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" className="mb-1 fw-bold">
                <EmailOutlinedIcon className="me-1" /> {employee.email??'N/A'}
              </Typography>
              <Typography variant="body2" className="fw-bold">
                <LocalPhoneOutlinedIcon className="me-1" /> {employee.phone??'N/A'}
              </Typography>
              <Typography variant="body2" className="fw-bold">
                <LocationOnOutlinedIcon className="me-1" /> {employee.address??'N/A'}
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

export default EmployeeCard;
