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
import TranslateIcon from "@mui/icons-material/Translate";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PublicIcon from "@mui/icons-material/Public";

const DUOLINGO_URL = "https://www.duolingo.com/";

const LanguageLabView = () => {
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
      icon: <RecordVoiceOverIcon sx={{ fontSize: 36, color: "#58cc02" }} />,
      title: "Speaking & Pronunciation",
      description:
        "Practice speaking with interactive voice recognition to hone your accent and pronunciation.",
    },
    {
      icon: <HeadphonesIcon sx={{ fontSize: 36, color: "#1cb0f6" }} />,
      title: "Listening Comprehension",
      description:
        "Listen to native speakers in real-world dialogue and conversation exercises.",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 36, color: "#ffc800" }} />,
      title: "Gamified Daily Streaks",
      description:
        "Earn XP points, unlock rewards, and build healthy daily language learning habits.",
    },
    {
      icon: <PublicIcon sx={{ fontSize: 36, color: "#ff4b4b" }} />,
      title: "40+ Languages Available",
      description:
        "Learn English, Spanish, French, German, Japanese, Hindi, and many more world languages.",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      {/* Top Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <BackButton />
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TranslateIcon sx={{ color: "#58cc02", fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b", m: 0 }}>
              Language Lab
            </Typography>
            <Chip
              label="Powered by Duolingo"
              size="small"
              sx={{
                bgcolor: "#e8f9d8",
                color: "#46a302",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Master new languages with interactive, bite-sized lessons
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
          background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
          border: "2px solid #bbf7d0",
          boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.1)",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#166534",
                fontSize: { xs: "1.5rem", md: "2rem" },
                mb: 1.5,
              }}
            >
              Start Your Language Journey
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
              Duolingo requires direct browser access to enable microphone speech recognition,
              audio pronunciation playback, and progress syncing. Click below to launch Duolingo
              in a full learning tab.
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button
                variant="contained"
                href={DUOLINGO_URL}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
                sx={{
                  backgroundColor: "#58cc02",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 3.5,
                  py: 1.4,
                  boxShadow: "0 4px 14px rgba(88, 204, 2, 0.4)",
                  "&:hover": {
                    backgroundColor: "#46a302",
                    boxShadow: "0 6px 20px rgba(88, 204, 2, 0.5)",
                  },
                }}
              >
                Launch Duolingo
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: "#ffffff",
                border: "1px dashed #86efac",
                display: "inline-block",
                width: "100%",
                maxWidth: 320,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#15803d", mb: 1 }}>
                💡 Recommended Daily Goal
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#58cc02", mb: 0.5 }}>
                15 min
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Just 15 minutes a day builds lasting vocabulary and conversational fluency.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
        What You Can Practice in the Lab
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
                  bgcolor: "#58cc02",
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
                  Launch Platform
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Click "Launch Duolingo" to open in a new tab.
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
                  bgcolor: "#58cc02",
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
                  Choose Your Language
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Pick the language you want to learn or join with your class code.
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
                  bgcolor: "#58cc02",
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
                  Keep Your Daily Streak
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Practice 10-15 minutes every day to make steady progress.
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

export default LanguageLabView;