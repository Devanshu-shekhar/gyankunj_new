import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { fetchAdmissionFeesInfo, fetchPaymentModes } from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import InstallmentPaymentDialog from "./InstallmentPaymentDialog";
import { set } from "react-hook-form";

const AdmissionFeesView = () => {
    const [admissionFeesList, setAdmissionFeesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem("UserData") || "{}");
    const [paymentModes, setPaymentModes] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedFeesData, setSelectedFeesData] = useState({});

    const fetchAdmissionFeesList = useCallback(async () => {
        setIsLoading(true);
        const payload = { "user_ids": [] };
        if (userData?.role === 'PARENT') {
            if (userData?.student_info?.length > 0) {
                payload.user_ids = userData.student_info.map(student => student.student_id);
            }
        }
        try {
            const response = await fetchAdmissionFeesInfo(payload);
            setAdmissionFeesList(response.data.admission_fees_data || []);
        } catch (err) {
            console.error("Failed to fetch admission fees list:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmissionFeesList();
        fetchPaymentModesList();
    }, []);

    const fetchPaymentModesList = async () => {
        try {
            const response = await fetchPaymentModes();
            setPaymentModes(response.data.payment_modes || []);
        } catch (err) {
            console.error("Failed to fetch payment modes:", err);
        }
    };

    const handleClose = (isSubmit) => {
        setOpen(false);
        setSelectedFeesData({});
        if (isSubmit) {
            fetchAdmissionFeesList();
        }
    };

    const columns = useMemo(
        () => [
            { accessorKey: "user_id", header: "User ID" },
            { accessorKey: "user_name", header: "Student Name" },
            { accessorKey: "parent_name", header: "Parent Name" },
            { accessorKey: "total_admission_charge", header: "Total Charge" },
            { accessorKey: "deposited_fees", header: "Deposited Fees" },
            { accessorKey: "total_installment_due", header: "Total Installment Due" },
            { accessorKey: "number_of_installments", header: "Installments" },
            { accessorKey: "installment_amount", header: "Installment Amount" },
            {
                header: "Payment",
                accessorFn: (row) => {
                    const isAllInstallmentsPaid = [];
            
                    if (Array.isArray(row.installments) && row.installments.length > 0) {
                        row.installments.forEach(element => {
                            if (!element.paid_status) {
                                isAllInstallmentsPaid.push(element);
                            }
                        });
                    }
            
                    console.log("isAllInstallmentsPaid", isAllInstallmentsPaid);
            
                    return row.is_deposit_paid && isAllInstallmentsPaid.length === 0 ? (
                        "Paid"
                    ) : (
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => {
                                    setSelectedFeesData(row);
                                    setOpen(true);
                                }}
                            >
                                Make Payment
                            </Button>
                        </div>
                    );
                },
            }            
        ],
        []
    );

    return (
        <>
            <CommonMatTable
                columns={columns}
                isLoading={isLoading}
                data={admissionFeesList}
                renderTopToolbar={() => <Typography variant="h6">Admission Fees</Typography>}
            />
            <InstallmentPaymentDialog open={open} onClose={handleClose} feesData={selectedFeesData} paymentModes={paymentModes} />
        </>
    );
};

export default AdmissionFeesView;
