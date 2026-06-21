import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";

const CollectDepositForm = ({
  control,
  watch,
  setValue,
  depositAmount,
  paymentModes = [],
}) => {
  const paymentModeId = watch("payment_mode_id");

  // Ensure transaction_amount is always synced with deposited_fees
  useEffect(() => {
    // Only overwrite transaction_amount when a deposited amount > 0 is provided.
    // This preserves the total admission charge which may have been set earlier.
    if (Number(depositAmount) > 0) {
      setValue("transaction_amount", Number(depositAmount));
    }
  }, [depositAmount, setValue]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Controller
          name="user_id"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              label="Admission ID"
              disabled
              fullWidth
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <Controller
            name="payment_mode_id"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <>
                <InputLabel error={!!error}>Payment Mode</InputLabel>
                <Select
                  {...field}
                  error={!!error}
                  label="Payment Mode"
                  value={field.value || ""}
                >
                  {paymentModes.map((item) => (
                    <MenuItem
                      key={item.payment_mode_id}
                      value={item.payment_mode_id}
                    >
                      {item.payment_mode_name}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="transaction_amount"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={!!error}
              type="number"
              label="Transaction Amount"
              fullWidth
              disabled
            />
          )}
        />
      </Grid>

      {paymentModeId !== 1 && (
        <Grid item xs={12} sm={6}>
          <Controller
            name="transaction_id"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={!!error}
                type="text"
                label="Transaction ID"
                fullWidth
              />
            )}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default CollectDepositForm;