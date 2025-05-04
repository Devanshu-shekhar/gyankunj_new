import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    MenuItem,
} from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useParams } from "react-router-dom";

const locales = {
    "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const UserCalendar = () => {
    const { userId, roleId } = useParams(); // Extract userId from query parameters
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        event_id: "",
        title: "",
        description: "",
        start: null,
        end: null,
        all_day: false,
        location: "",
        event_type: "meeting",
    });

    const handleSelectSlot = ({ start, end }) => {
        const today = new Date();
        const startDate = new Date(start);

        // Set time to midnight for comparing only dates
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);

        if (startDate < today) return; // 👈 Skip opening modal for past days

        setNewEvent({
            event_id: `evt${Date.now()}`,
            title: "",
            description: "",
            start,
            end,
            all_day: false,
            location: "",
            event_type: "meeting",
        });
        setOpen(true);
    };


    const disablePastDates = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPast = date < today;

        return {
            className: isPast ? "rbc-day-disabled" : "",
            style: isPast ? { backgroundColor: "#f5f5f5", pointerEvents: "none" } : {},
        };
    };

    const handleClose = () => {
        setOpen(false);
        setNewEvent({
            event_id: "",
            title: "",
            description: "",
            start: null,
            end: null,
            all_day: false,
            location: "",
            event_type: "meeting",
        });
    };

    const handleSave = () => {
        if (newEvent.title.trim()) {
            setEvents([...events, newEvent]);
        }
        handleClose();
    };

    return (
        <>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                style={{ height: 600, margin: "20px" }}
                onSelectSlot={handleSelectSlot}
                dayPropGetter={disablePastDates}
            />

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Add New Event</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        margin="dense"
                        label="Event Title"
                        fullWidth
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Location"
                        fullWidth
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        type="datetime-local"
                        label="Start Time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={newEvent.start ? new Date(newEvent.start).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                    />
                    <TextField
                        margin="dense"
                        type="datetime-local"
                        label="End Time"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        value={newEvent.end ? new Date(newEvent.end).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={newEvent.all_day}
                                onChange={(e) => setNewEvent({ ...newEvent, all_day: e.target.checked })}
                            />
                        }
                        label="All Day Event"
                    />
                    <TextField
                        margin="dense"
                        select
                        label="Event Type"
                        fullWidth
                        value={newEvent.event_type}
                        onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                    >
                        <MenuItem value="meeting">Meeting</MenuItem>
                        <MenuItem value="holiday">Holiday</MenuItem>
                        <MenuItem value="exam">Exam</MenuItem>
                        <MenuItem value="activity">Activity</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserCalendar;
