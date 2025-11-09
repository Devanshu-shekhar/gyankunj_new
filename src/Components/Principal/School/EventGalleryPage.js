import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Grid,
    Card,
    CardMedia,
    Typography,
    Button,
    TextField,
    CircularProgress,
} from "@mui/material";
import { fetchEventImages, fetchEventsMetadata, saveEventImages } from "../../../ApiClient";

const EventGalleryPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    const [newEvent, setNewEvent] = useState({
        event_name: "",
        image_list: [],
    });

    useEffect(() => {
        const stored = localStorage.getItem("UserData");
        if (stored) {
            setUserData(JSON.parse(stored));
        }
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await fetchEventsMetadata();
            if (res?.data?.status === "success") {
                const list = res.data.event_metadata || [];
                setEvents(list);
                if (list.length > 0) {
                    setSelectedEvent(list[0].event_id);
                    fetchEventGallery(list[0].event_id);
                }
            }
        } catch (err) {
            console.error("Error fetching events:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventGallery = async (eventId) => {
        try {
            setLoading(true);
            const res = await fetchEventImages(eventId, 1, 20);
            if (res.data.status === "success") {
                setImages(res.data.event_images);
            }
            setSelectedEvent(eventId);
        } catch (err) {
            console.error("Error fetching images:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEvent((prev) => ({
                    ...prev,
                    image_list: [
                        ...prev.image_list,
                        {
                            file_name: file.name.split(".")[0],
                            mime_type: file.type,
                            data: reader.result.split(",")[1],
                        },
                    ],
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.event_name) return alert("Please enter event name");

        try {
            setLoading(true);
            const res = await saveEventImages(newEvent);
            if (res.data.status === "success") {
                alert("Event saved successfully!");
                setNewEvent({ event_name: "", image_list: [] });
                fetchEvents();
            }
        } catch (err) {
            console.error("Error saving event:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            {/* ========== Add New Event Section ========== */}
            {(userData.role === "PRINCIPAL" || userData.role === "ADMIN") && (
                <Box
                component="form"
                onSubmit={handleSaveEvent}
                sx={{
                    p: 3,
                    boxShadow: 2,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    marginBottom: 4,
                }}
            >
                <Typography variant="h6" fontWeight="600" gutterBottom>
                    Add New Event
                </Typography>

                <TextField
                    fullWidth
                    label="Event Name"
                    variant="outlined"
                    value={newEvent.event_name}
                    onChange={(e) =>
                        setNewEvent({ ...newEvent, event_name: e.target.value })
                    }
                    sx={{ mb: 2 }}
                />

                <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                    Upload Images
                    <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
                </Button>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                    {newEvent.image_list.map((img, i) => (
                        <Card key={i} sx={{ width: 100, height: 100 }}>
                            <CardMedia
                                component="img"
                                image={`data:${img.mime_type};base64,${img.data}`}
                                alt={img.file_name}
                            />
                        </Card>
                    ))}
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Event"}
                </Button>
            </Box>
            )}

            <Typography variant="h5" fontWeight="bold" gutterBottom>
                📅 Event Gallery
            </Typography>

            {/* ========== Tabs for Events ========== */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={selectedEvent}
                    onChange={(e, val) => fetchEventGallery(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="event tabs"
                >
                    {events.map((event) => (
                        <Tab
                            key={event.event_id}
                            label={event.event_name}
                            value={event.event_id}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* ========== Gallery Section ========== */}
            <Box sx={{ minHeight: "300px", mb: 4 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                        <CircularProgress />
                    </Box>
                ) : images.length > 0 ? (
                    <Grid container spacing={2}>
                        {images.map((img, i) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                                <Card elevation={3} sx={{ borderRadius: 2 }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`data:${img.mime_type};base64,${img.data}`}
                                        alt={img.file_name}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography align="center" color="text.secondary">
                        Select an event to view images
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default EventGalleryPage;
