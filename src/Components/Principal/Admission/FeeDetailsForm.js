import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const FeeDetailsForm = ({ control, watch, feesStructuresList }) => {
  const isEmiEnabled = watch("is_emi_enabled");

  return (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Fee Details
      </Typography>

      <div className="d-flex gap-4">
        {feesStructuresList?.length > 0 &&
          feesStructuresList.map((item) => (
            item.fee_frequency_id === 2 &&
              item.fee_occurrence_id === 1 && (
                <div key={item.fee_type_name}>
                  <strong>{item.fee_type_name}</strong> : {item.charge}
                </div>
              )
          ))}
      </div>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="User ID" fullWidth margin="normal" required disabled />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="total_admission_charge"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Total Admission Charge"
                fullWidth
                margin="normal"
                required
                disabled
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="deposited_fees"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Deposited Fees"
                fullWidth
                margin="normal"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="discounted_amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Discounted Amount"
                fullWidth
                margin="normal"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
              />
            )}
          />
        </Grid>

        {/* EMI Toggle */}
        <Grid item xs={12}>
          <FormControl>
            <Controller
              name="is_emi_enabled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Enable EMI"
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* EMI Fields */}
        {isEmiEnabled && (
          <>
            <Grid item xs={12} md={6}>
              <Controller
                name="total_emi_amount"
                control={control}
                rules={{ required: "Total EMI Amount is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Total EMI Amount"
                    fullWidth
                    margin="normal"
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    disabled
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="number_of_installments"
                control={control}
                rules={{ required: "Number of Installments is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Number of Installments"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="installment_amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Installment Amount"
                    fullWidth
                    margin="normal"
                    required
                    disabled
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="first_installment_due_date"
                  control={control}
                  rules={{ required: "First Installment Due Date is required" }}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="First Installment Due Date"
                      value={field.value || null}
                      onChange={field.onChange}
                      format="YYYY-MM-DD"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default FeeDetailsForm;
