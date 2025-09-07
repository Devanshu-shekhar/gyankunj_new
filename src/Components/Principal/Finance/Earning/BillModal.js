import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
} from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchBillDetails } from "../../../../ApiClient";

// setup worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const BillModal = ({ open, onClose, paymentData }) => {
    const [billPdf, setBillPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [billDetails, setBillDetails] = useState(null);

    const fetchBillData = useCallback(async () => {
        if (!paymentData?.id) return;
        setLoading(true);
        try {
            const payload = { payment_ids: [44] };
            const response = await fetchBillDetails(payload);

            if (response?.data?.bill_details?.length > 0) {
                const details = response.data?.bill_details[0];
                setBillDetails(details);

                // Generate preview PDF
                const doc = new jsPDF();
                doc.text("Bill Receipt", 14, 15);

                autoTable(doc, {
                    startY: 25,
                    head: [["Field", "Value"]],
                    body: [
                        ["User ID", details.user_id],
                        ["Student Name", details.student_name],
                        ["Father Name", details.father_name || "-"],
                        ["Mother Name", details.mother_name || "-"],
                        ["Grade", details.grade],
                        ["Section", details.section_name],
                        ["Roll No", details.roll_no],
                        ["Bill Date", details.bill_date],
                        ["Tuition Fee", details.tuition_fee],
                        ["Transportation Fee", details.transportation_fee],
                        ["Fines", details.fines],
                        ["Payable Amount", details.payable_amount || "0"],
                        ["Balance Amount", details.balance_amount || "0"],
                        ["Comments", details.comments || "-"],
                    ],
                });

                const pdfBlob = doc.output("blob");
                setBillPdf(URL.createObjectURL(pdfBlob));
            }
        } catch (err) {
            console.error("Failed to fetch bill details:", err);
        } finally {
            setLoading(false);
        }
    }, [paymentData]);

    useEffect(() => {
        if (open) {
            fetchBillData();
        }
    }, [open, fetchBillData]);

    const handleDownload = () => {
        if (!billDetails) return;

        const doc = new jsPDF();
        doc.text("Bill Receipt", 14, 15);

        autoTable(doc, {
            startY: 25,
            head: [["Field", "Value"]],
            body: [
                ["User ID", billDetails.user_id],
                ["Student Name", billDetails.student_name],
                ["Father Name", billDetails.father_name || "-"],
                ["Mother Name", billDetails.mother_name || "-"],
                ["Grade", billDetails.grade],
                ["Section", billDetails.section_name],
                ["Roll No", billDetails.roll_no],
                ["Bill Date", billDetails.bill_date],
                ["Tuition Fee", billDetails.tuition_fee],
                ["Transportation Fee", billDetails.transportation_fee],
                ["Fines", billDetails.fines],
                ["Payable Amount", billDetails.payable_amount || "0"],
                ["Balance Amount", billDetails.balance_amount || "0"],
                ["Comments", billDetails.comments || "-"],
            ],
        });

        doc.save(`Bill_${billDetails.user_id}_${billDetails.bill_date}.pdf`);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Bill Details</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : billPdf ? (
                    <Document
                        file={billPdf}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    >
                        <Page
                            pageNumber={numPages}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                ) : (
                    <p>No bill available</p>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleDownload}
                    variant="contained"
                    color="primary"
                    disabled={!billDetails}
                >
                    Download
                </Button>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillModal;