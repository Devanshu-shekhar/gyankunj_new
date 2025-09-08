import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { fetchMetadataInfo, fetchPaymentsList } from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";
import BillModal from "./BillModal";
import dayjs from "dayjs";

const PaymentsView = () => {
    const [allPaymentsList, setAllPaymentsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFeesData, setSelectedFeesData] = useState({});
    const userData = JSON.parse(localStorage.getItem("UserData") || "{}");
    const [monthsList, setMonthsList] = useState([]);
    const [monthFilter, setMonthFilter] = useState(dayjs().format("M"));

    useEffect(() => {
        fetchPaymentsData();
        fetchMetadataList();
    }, []);

    const fetchPaymentsData = useCallback(async () => {
        setIsLoading(true);
        const payload = { user_ids: [] };

        if (userData?.role === "PARENT") {
            if (userData?.student_info?.length > 0) {
                payload.user_ids = userData.student_info.map((student) => student.student_id);
            }
        }

        try {
            const response = await fetchPaymentsList(payload);
            setAllPaymentsList(response.data.payment_data || []);
        } catch (err) {
            console.error("Failed to fetch payment list:", err);
        } finally {
            setIsLoading(false);
        }
    }, [userData]);

    const fetchMetadataList = useCallback(async () => {
        const payload = { fetch_all_months: {} };

        try {
            const res = await fetchMetadataInfo(payload);
            const metadata = res?.data?.metadata_info || {};
            setMonthsList(metadata?.fetch_all_months?.months_data || []);
        } catch (error) {
            console.error("Failed to fetch metadata list:", error);
        }
    }, []);

    const handleMonthChange = (event) => {
        setMonthFilter(event.target.value);
    };

    // 🔹 Filtered list based on month_id
    const filteredPayments = useMemo(() => {
        return allPaymentsList.filter((item) => String(item.month_id) === String(monthFilter));
    }, [allPaymentsList, monthFilter]);

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

    const RenderTopToolbarCustomActions = () => {
        return (
            <Box className="d-flex align-items-center justify-content-start my-2">
                <Box className="w-25">
                    <FormControl fullWidth>
                        <InputLabel>Month</InputLabel>
                        <Select
                            label="Month"
                            value={monthFilter}
                            onChange={handleMonthChange}
                        >
                            {monthsList.map((item) => {
                                const isFutureMonth = parseInt(item.month_id, 10) - 1 > dayjs().month();
                                return (
                                    <MenuItem
                                        key={item.month_id}
                                        value={item.month_id}
                                        disabled={isFutureMonth}
                                    >
                                        {item.month_name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        );
    };

    return (
        <div>
            <RenderTopToolbarCustomActions />
            <CommonMatTable
                columns={columns}
                isLoading={isLoading}
                data={filteredPayments} // ✅ filtered data passed
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
        </div>
    );
};

export default PaymentsView;
