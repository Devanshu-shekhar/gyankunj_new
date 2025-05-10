import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Snackbar, Alert,
    FormControl
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchMetadataInfo, createHoliday } from "../ApiClient";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': enUS },
});

const UserCalendar = () => {
    const [events, setEvents] = useState([]);
    const [userData, setUserData] = useState({});
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            event_name: "",
            event_date: null,
        },
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
            const res = await fetchMetadataInfo({ fetch_all_holidays: {} });
            const holidayData = res?.data?.metadata_info?.fetch_all_holidays?.holiday_data || [];

            const formatted = holidayData.map((e) => ({
                title: e.event_name,
                start: new Date(e.event_date),
                end: new Date(e.event_date),
                allDay: true,
            }));
            setEvents(formatted);
        } catch (err) {
            console.error(err);
            showSnackbar("Failed to fetch events", "error");
        }
    };

    const handleSelectSlot = ({ start }) => {
        const isPrivileged = ["ADMIN", "PRINCIPAL"].includes(userData.role);
        if (!isPrivileged) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        if (start < today) return;

        reset({
            event_name: "",
            event_date: dayjs(start),
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        const payload = {
            holiday_data: [
                {
                    event_name: data.event_name,
                    event_date: dayjs(data.event_date).format("YYYY-MM-DD"),
                },
            ],
        };

        try {
            const res = await createHoliday(payload);
            if (res?.data?.status === "success") {
                showSnackbar("Event created successfully", "success");
                handleClose();
                fetchEvents();
            } else {
                showSnackbar("Failed to save event", "error");
            }
        } catch (err) {
            console.error(err);
            showSnackbar("Failed to save event", "error");
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const disablePastDates = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return {
            className: date < today ? "rbc-day-disabled" : "",
            style: date < today ? { backgroundColor: "#f0f0f0", pointerEvents: "none" } : {},
        };
    };

    return (
        <>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600, margin: "20px" }}
                selectable={["ADMIN", "PRINCIPAL"].includes(userData.role)}
                onSelectSlot={handleSelectSlot}
                dayPropGetter={disablePastDates}
                popup
            />

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Add Holiday</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <DialogContent dividers>
                        <FormControl fullWidth className="mb-3">
                            <Controller
                                name="event_name"
                                control={control}
                                rules={{ required: "Event name is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Event Name"
                                        fullWidth
                                        margin="dense"
                                        error={!!errors.event_name}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <Controller
                                name="event_date"
                                control={control}
                                rules={{ required: "Event date is required" }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Event Date"
                                            minDate={dayjs()}
                                            format="YYYY-MM-DD"
                                            value={value}
                                            onChange={onChange}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!error,
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </>
    );
};

export default UserCalendar;
