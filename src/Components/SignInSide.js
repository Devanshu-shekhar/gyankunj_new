import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  DialogContent,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import { getAllDesignationsList } from "../ApiClient";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SignInSide(props) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    const savedPassword = localStorage.getItem("password");
    if (savedUserName && savedPassword) {
      setUserName(savedUserName);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const closeLoginModal = () => {
    props.onHide();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userName || !password) {
      setErrorMessage(true);
      return;
    }

    const base64 = require("base-64");
    const url = "http://3.6.167.80:5005/login";
    const headers = new Headers();
    headers.set(
      "Authorization",
      "Basic " + base64.encode(`${userName}:${password}`)
    );

    try {
      const response = await fetch(url, { method: "POST", headers });
      const data = await response.json();

      if (data.status === "success") {
        fetchDesignationsList();  
        const userData = {
          ...data,
          role: data.role? data.role.toUpperCase() : ""
        };
        localStorage.setItem("UserData", JSON.stringify(userData));
        props.onHide();

        if (rememberMe) {
          localStorage.setItem("userName", userName);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("userName");
          localStorage.removeItem("password");
        }

        if (userData.role === "ADMIN" || userData.role === "PRINCIPAL") {
          navigate("/principalDashboard/dashboard");
        } else if (userData.role === "TEACHER") {
          navigate("/teacherDashboard/dashboard");
        } else if (userData.role === "STUDENT") {
          navigate("/studentDashboard/dashboard");
        } else if (userData.role === "PARENT") {
          navigate("/parentDashboard/dashboard");
        }
      } else {
        setErrorMessage(true);
        setUserName("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDesignationsList = () => {
    getAllDesignationsList()
      .then((res) => {
        if (res?.data?.roles_data?.length > 0) {
          localStorage.setItem("UserRoles", JSON.stringify(res.data.roles_data));
        }
        else{
          localStorage.setItem("UserRoles", []);
        }
      })
      .catch(() => {
        console.log("Error while fetching designations list");
        localStorage.setItem("UserRoles", []);
      });
  }

  return (
    <Dialog
      open={props.show}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeLoginModal}
      fullWidth
    >
      <DialogContent className="p-0">
        <Box className="my-4 mx-3 d-flex flex-column align-items-center">
          <Avatar className="mb-2 bg-danger">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome to gyankoonj
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            className="mt-2"
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={errorMessage && !userName}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errorMessage && !password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="mt-3 mb-2"
            >
              Log In
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
