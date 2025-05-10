import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Grid, CircularProgress, Snackbar, Alert, TextField, FormControl
} from '@mui/material';
import { createHoliday, fetchMetadataInfo } from '../ApiClient';
import { Controller, useForm } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const UserEvents = () => {
    const [userData, setUserData] = useState({});
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            event_name: '',
            event_date: null
        }
    });

    const fetchEvents = async () => {
        const payload = { fetch_all_holidays: {} };
        try {
            setLoading(true);
            const res = await fetchMetadataInfo(payload);
            const metadata = res?.data?.metadata_info || {};
            const holidayData = metadata.fetch_all_holidays?.holiday_data || [];

            // Ensure it's an array before sorting
            const sortedHolidays = Array.isArray(holidayData)
                ? holidayData.sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                : [];

            setEvents(sortedHolidays);
        } catch (error) {
            console.error('Error fetching events:', error);
            showSnackbar('Failed to fetch events.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem("UserData");
        setUserData(storedData ? JSON.parse(storedData) : {});
        fetchEvents();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        reset();
        setOpen(false);
    };

    const onSubmit = async (data) => {
        if (!data.event_name || !data.event_date) {
            showSnackbar('Please fill in all fields.', 'warning');
            return;
        }

        const payload = {
            holiday_data: [
                {
                    event_name: data.event_name,
                    event_date: dayjs(data.event_date).format('YYYY-MM-DD')
                }
            ]
        };

        try {
            const response = await createHoliday(payload);
            if (response.data?.status === 'success') {
                showSnackbar('Event created successfully!', 'success');
                handleClose();
                fetchEvents();
            } else {
                showSnackbar('Failed to create event.', 'error');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            showSnackbar('Failed to create event.', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <div className='bg-body-secondary h-100 p-3 overflow-auto'>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography variant="h6">Holidays</Typography>
                {["ADMIN", "PRINCIPAL"].includes(userData.role) && (
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Add Event
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="text-center w-100 mt-5">
                    <CircularProgress color="primary" />
                </div>
            ) : (
                <Grid container spacing={2}>
                    {events.map((event, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{event.event_name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Date: {event.event_date}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <Controller
                            name="event_name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    label="Event Name"
                                    variant="outlined"
                                    fullWidth
                                    {...field}
                                    error={!!errors.event_name}
                                />
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <Controller
                            name="event_date"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Event Date"
                                        format="YYYY-MM-DD"
                                        minDate={dayjs()}
                                        {...field}
                                        slotProps={{
                                            textField: {
                                                variant: 'outlined',
                                                error: !!errors.event_date,
                                                fullWidth: true
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default UserEvents;
