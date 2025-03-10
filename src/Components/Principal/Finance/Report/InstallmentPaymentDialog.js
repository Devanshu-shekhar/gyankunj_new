import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Grid,
    Checkbox
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { makeAdmissionFeePayment } from "../../../../ApiClient";
import { showAlertMessage } from "../../../AlertMessage";
import e from "cors";

const InstallmentPaymentDialog = ({ open, onClose, feesData, paymentModes }) => {
    const [alert, setAlert] = useState({ type: "", message: "" });
    const { control, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            payment_mode_id: "",
            transaction_id: "",
            transaction_amount: "",
            total_outstanding: "",
            installments: []
        }
    });

    // Watch selected installments
    const selectedInstallments = watch("installments") || [];

    const transactionAmount = useMemo(() => {
        if (!feesData) return 0; // Handle undefined feesData safely
    
        const { is_deposit_paid, deposited_fees = 0, installment_amount = 0 } = feesData;
        if (selectedInstallments.length > 0) {
            return (!is_deposit_paid ? deposited_fees : 0) + (selectedInstallments.length * installment_amount);
        }
    
        return !is_deposit_paid ? deposited_fees : installment_amount;
    }, [selectedInstallments, feesData]);
    
    useEffect(() => {
        if (feesData) {
            setValue("transaction_amount", transactionAmount);
            setValue("total_outstanding", feesData.total_outstanding);
        }
    }, [feesData, transactionAmount, setValue]);
    

    const onSubmit = async (data) => {
        try {
            const transformedData = {
                payment_mode_id: data.payment_mode_id,
                transaction_id: data.payment_mode_id !== 1 ? data.transaction_id : null,
                transaction_amount: parseFloat(data.transaction_amount),
                total_outstanding: parseFloat(data.total_outstanding),
                user_id: feesData.user_id,
                installments: data.installments
            };

            console.log("Payment Payload:", transformedData);
            const res = await makeAdmissionFeePayment(transformedData);
            if (res?.data?.status === "success") {
                setAlert({
                    type: "success",
                    message: "The fees payment succeeded.",
                });
            } else {
                setAlert({
                    type: "error",
                    message: res?.data?.message || "Something went wrong.",
                });
            }
            setTimeout(() => {
                handleClose(true);
                setAlert({ type: "", message: "" });
            }, 2000);
        } catch (error) {
            setAlert({ type: "error", message: "Failed to create fees structure." });
            setTimeout(() => {
                handleClose(true);
                setAlert({ type: "", message: "" });
            }, 2000);
        }
    };

    const handleModeChange = (e) => {
        const value = e.target.value;
        setValue("payment_mode_id", value);
        if (value === 1) {
            setValue("transaction_id", ""); // Clear transaction ID for cash payments
        }
    };

    const paymentModeId = watch("payment_mode_id");

    const handleClose = (isSubmit = false) => {
        onClose(isSubmit);
        reset();
    }

    return (
        <Dialog open={open} fullWidth maxWidth="sm">
            <DialogTitle>Make Payment</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Mode</InputLabel>
                                <Controller
                                    name="payment_mode_id"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field, fieldState: { error } }) => (
                                        <Select {...field} label="Payment Mode" onChange={handleModeChange} value={field.value || ""} error={!!error}>
                                            {paymentModes.map((item) => (
                                                <MenuItem key={item.payment_mode_id} value={item.payment_mode_id}>
                                                    {item.payment_mode_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        {feesData?.installments?.length > 0 && (
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Select Installment</InputLabel>
                                    <Controller
                                        name="installments"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Select
                                                label="installments"
                                                {...field}
                                                multiple
                                                renderValue={(selected) =>
                                                    selected.map((number) =>
                                                        `Installment ${number}`
                                                    ).join(", ")
                                                }
                                                onChange={(e) => {
                                                    const selectedValues = e.target.value;
                                                    field.onChange(selectedValues);
                                                }}
                                            >
                                                {feesData.installments.map((item) => (
                                                    <MenuItem
                                                        key={item.installment_number}
                                                        value={item.installment_number}
                                                        disabled={Boolean(item.paid_status)}
                                                    >
                                                        <Checkbox
                                                            checked={selectedInstallments.includes(item.installment_number)}
                                                        />
                                                        {item.name} - {item.due_date}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        )}

                        {paymentModeId && paymentModeId !== 1 && (
                            <Grid item xs={12}>
                                <Controller
                                    name="transaction_id"
                                    control={control}
                                    rules={{ required: paymentModeId !== 1 }}
                                    render={({ field, fieldState: { error } }) => (
                                        <TextField {...field} value={field.value || ""} error={!!error} label="Transaction ID" fullWidth margin="dense" />
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Controller
                                name="transaction_amount"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Transaction Amount" variant="outlined" type="number" value={transactionAmount} fullWidth margin="dense" />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="total_outstanding"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Total Outstanding" variant="outlined" type="number" value={field.value || ""} disabled fullWidth margin="dense" />
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                    <Button type="submit" color="primary" variant="contained">Submit</Button>
                </DialogActions>
            </form>
            {alert.type &&
                showAlertMessage({
                    open: true,
                    alertFor: alert.type,
                    message: alert.message,
                })}
        </Dialog>
    );
};

export default InstallmentPaymentDialog;