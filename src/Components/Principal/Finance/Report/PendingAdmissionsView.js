import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import { fetchPendingAdmissions } from "../../../../ApiClient";
import CommonMatTable from "../../../../SharedComponents/CommonMatTable";

const PendingAdmissionsView = () => {
    const [admissionFeesList, setAdmissionFeesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFeesData, setSelectedFeesData] = useState({});

    const fetchPendingAdmissionData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetchPendingAdmissions();
            setAdmissionFeesList(response.data.admission_fee_data || []);
        } catch (err) {
            console.error("Failed to fetch admission fees list:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingAdmissionData();
    }, []);

    const handleContinue = (row) => {
        if (!row || !row.user_id) return;
        window.location.href = `/principalDashboard/admissionView/create-admission?user_id=${row.user_id};total_admission_charge=${row.total_admission_charge}`;
    }

    const columns = useMemo(
        () => [
            { accessorKey: "user_id", header: "User ID" },
            { accessorKey: "total_admission_charge", header: "Total Admission Charge" },
            { accessorKey: "deposited_fees", header: "Deposited Fees" },
            { accessorKey: "total_outstanding", header: "Total Outstanding" },
            { accessorKey: "discounted_amount", header: "Discounted Amount" },
            { accessorKey: "number_of_installments", header: "Installments" },
            { accessorKey: "installment_amount", header: "Installment Amount" },
            {
                header: "Payment Status",
                accessorFn: (row) => {
                    return (
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                            <Button size="small" variant="contained" onClick={() => handleContinue(row)}>Continue</Button>
                        </div>
                    );
                },
            },
        ],
        []
    );


    return (
        <CommonMatTable
            columns={columns}
            isLoading={isLoading}
            data={admissionFeesList}
            renderTopToolbar={() => <Typography variant="h6">Pending Admissions</Typography>}
        />
    );
};

export default PendingAdmissionsView;
