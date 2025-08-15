import React, { useEffect } from "react";
import { FormControl } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DateRangePickerComponent = ({ range, onChange }) => {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      start_date: range.startDate,
      end_date: range.endDate,
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  // Update parent state when local form values change
  useEffect(() => {
    if (startDate && endDate) {
      onChange({ startDate, endDate });
    }
  }, [startDate, endDate, onChange]);

  return (
    <div className="d-flex gap-2 justify-content-around">
      <FormControl fullWidth margin="normal">
        <Controller
          name="start_date"
          control={control}
          rules={{ required: "Start date is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="YYYY-MM-DD"
                label="Start Date"
                value={value || null}
                onChange={(newValue) => {
                  onChange(newValue);
                  setValue("end_date", null); // Reset end date when start date changes
                }}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <Controller
          name="end_date"
          control={control}
          rules={{
            required: "End date is required",
            validate: (value) =>
              !startDate || dayjs(value).isAfter(startDate)
                ? true
                : "End date must be after start date",
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="YYYY-MM-DD"
                label="End Date"
                value={value || null}
                onChange={onChange}
                minDate={startDate || dayjs()}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />
      </FormControl>
    </div>
  );
};

export default DateRangePickerComponent;