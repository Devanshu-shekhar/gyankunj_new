import React, { useState, useEffect } from "react";
import BackButton from "../../../SharedComponents/BackButton";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import MemoryIcon from "@mui/icons-material/Memory";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

const EVERYCIRCUIT_APP_URL = "https://everycircuit.com/app";

const RoboticsLabView = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    const mainContainer = document.querySelector(".main-container");
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  const handleCloseDisclaimer = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowDisclaimer(false);
  };

  const features = [
    {
      icon: <ElectricBoltIcon sx={{ fontSize: 36, color: "#0284c7" }} />,
      title: "Dynamic Current Animation",
      description:
        "Visualize real-time current flow, voltage drops, and charge movement through your schematic components.",
    },
    {
      icon: <MemoryIcon sx={{ fontSize: 36, color: "#8b5cf6" }} />,
      title: "Robotics & Logic Circuits",
      description:
        "Design motor drivers, H-bridges, sensor conditioning, logic gates, and microcontroller interfaces.",
    },
    {
      icon: <ShowChartIcon sx={{ fontSize: 36, color: "#10b981" }} />,
      title: "Real-Time Oscilloscope",
      description:
        "Probe any circuit node to inspect live waveforms, peak voltages, AC/DC signals, and frequency response.",
    },
    {
      icon: <PrecisionManufacturingIcon sx={{ fontSize: 36, color: "#f59e0b" }} />,
      title: "Extensive Component Library",
      description:
        "Experiment with resistors, capacitors, inductors, transistors, op-amps, 555 timers, and switches.",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      {/* Top Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <BackButton />
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToyIcon sx={{ color: "#0284c7", fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", m: 0 }}>
              Robotics & Circuit Lab
            </Typography>
            <Chip
              label="Powered by EveryCircuit"
              size="small"
              sx={{
                bgcolor: "#e0f2fe",
                color: "#0369a1",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Interactive circuit simulation, electronics modeling, and robotics prototyping
          </Typography>
        </Box>
      </Box>

      {/* Hero Action Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
          border: "2px solid #bae6fd",
          boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.12)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0369a1",
                fontSize: { xs: "1.5rem", md: "2rem" },
                mb: 1.5,
              }}
            >
              Build & Simulate Electronic Circuits
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#374151",
                lineHeight: 1.7,
                mb: 3,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
              }}
            >
              EveryCircuit provides an interactive visual circuit simulator where you can construct
              schematics, test robotics sensors and motor drivers, and observe animated current flow
              in real time. Click below to launch the simulator in a full interactive canvas tab.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button
                variant="contained"
                href={EVERYCIRCUIT_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
                sx={{
                  backgroundColor: "#0284c7",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 3.5,
                  py: 1.4,
                  boxShadow: "0 4px 14px rgba(2, 132, 199, 0.4)",
                  "&:hover": {
                    backgroundColor: "#0369a1",
                    boxShadow: "0 6px 20px rgba(2, 132, 199, 0.5)",
                  },
                }}
              >
                Launch EveryCircuit App
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: "#ffffff",
                border: "1px dashed #7dd3fc",
                display: "inline-block",
                width: "100%",
                maxWidth: 320,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0369a1", mb: 1 }}>
                ⚡ Real-Time Engine
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#0284c7", mb: 0.5 }}>
                60 FPS
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Interactive dynamic simulation with animated charges and live waveform analysis.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
        What You Can Design & Simulate
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {features.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 20px -3px rgba(0,0,0,0.08)",
                  borderColor: "#cbd5e1",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ mb: 1.5 }}>{item.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.6 }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Start Guide */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "12px",
          bgcolor: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
          Quick Start Guide for Students:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Typography
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#0284c7",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                1
              </Typography>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                  Launch Simulator
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Click "Launch EveryCircuit App" to open the interactive schematic editor.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Typography
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#0284c7",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                2
              </Typography>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                  Assemble Components
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Drag sources, resistors, transistors, and logic gates onto the canvas and wire them.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Typography
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#0284c7",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                3
              </Typography>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                  Simulate & Analyze
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Press Play to animate current flows, inspect live voltages, and test robotics circuits.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 10-second Disclaimer Notification at Top */}
      <Snackbar
        open={showDisclaimer}
        autoHideDuration={10000}
        onClose={handleCloseDisclaimer}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ top: { xs: "110px !important", sm: "110px !important" }, zIndex: 9999 }}
      >
        <Alert
          onClose={handleCloseDisclaimer}
          severity="info"
          variant="filled"
          sx={{
            width: "100%",
            maxWidth: 700,
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            fontSize: "0.85rem",
            lineHeight: 1.5,
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            "& .MuiAlert-icon": { color: "#38bdf8" },
          }}
        >
          <strong>Disclaimer:</strong> This is executed entirely independently, and all deliverables have been produced without external collaboration or joint effort.
        </Alert>
      </Snackbar>

      {/* Persistent Disclaimer Footer */}
      <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #e2e8f0", textAlign: "center" }}>
        <Typography variant="caption" sx={{ color: "#94a3b8", display: "block" }}>
          <strong>Disclaimer:</strong> This is executed entirely independently, and all deliverables have been produced without external collaboration or joint effort.
        </Typography>
      </Box>
    </Box>
  );
};

export default RoboticsLabView;