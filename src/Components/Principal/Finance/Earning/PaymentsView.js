import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { fetchPaymentsList } from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import BillModal from "./BillModal";

const PaymentsView = () => {
    const [paymentsList, setPaymentList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFeesData, setSelectedFeesData] = useState({});
    const userData = JSON.parse(localStorage.getItem("UserData") || "{}");

    const fetchPaymentsData = useCallback(async () => {
        setIsLoading(true);
        const payload = { "user_ids": [] };
        if (userData?.role === 'PARENT') {
            if (userData?.student_info?.length > 0) {
                payload.user_ids = userData.student_info.map(student => student.student_id);
            }
        }
        try {
            const response = await fetchPaymentsList(payload);
            setPaymentList(response.data.payment_data || []);
        } catch (err) {
            console.error("Failed to fetch payment list:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPaymentsData();
    }, []);

    const columns = useMemo(
        () => [
            { accessorKey: "user_id", header: "User ID" },
            { accessorKey: "user_name", header: "Student Name" },
            { accessorKey: "month_id", header: "Month ID" },
            { accessorKey: "transaction_id", header: "Transaction ID" },
            { accessorKey: "payment_mode_name", header: "Payment Mode" },
            { accessorKey: "transaction_amount", header: "Transaction Amount" },
            { accessorKey: "balance_amount", header: "Balance Amount" },
            {
                header: "Action",
                accessorFn: (row) => (
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                                setSelectedFeesData(row);
                                setOpen(true);
                            }}
                        >
                            View Bill
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <>
            <CommonMatTable
                columns={columns}
                isLoading={isLoading}
                data={paymentsList}
                renderTopToolbar={() => (
                    <Typography variant="h6">Payment View</Typography>
                )}
            />

            {/* Bill Modal */}
            <BillModal
                open={open}
                onClose={() => setOpen(false)}
                paymentData={selectedFeesData}
            />
        </>
    );
};

export default PaymentsView;