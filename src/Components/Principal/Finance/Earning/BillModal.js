import React, { useState, useEffect, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
} from "@mui/material";
// using an HTML preview instead of react-pdf preview
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { fetchBillDetails } from "../../../../ApiClient";


const BillModal = ({ open, onClose, paymentData }) => {
    
    const [loading, setLoading] = useState(false);
    const [billData, setBillData] = useState(null); // full response: { bill_header, bill_details, bill_footer }
    const previewRef = useRef(null);
    // derive whether we should allow scrolling in the content area
    const detailsCount = (billData && Array.isArray(billData.bill_details) && billData.bill_details.length) || 0;
    const hasScrollable = detailsCount > 0;

    const fetchBillData = useCallback(async () => {
        if (!paymentData?.payment_id) return;
        setLoading(true);
        try {
            const payload = { payment_ids: [paymentData.payment_id] };
            const response = await fetchBillDetails(payload);

                // Store full bill response (header, details, footer)
                const data = response?.data || {};
                setBillData(data);
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

    const handleDownload = async () => {
        if (!billData) return;
        // Prefer html2canvas capture of the rendered preview for WYSIWYG PDF
        try {
            if (previewRef && previewRef.current && typeof html2canvas === "function") {
                const element = previewRef.current;
                const canvas = await html2canvas(element, { scale: 2 });
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "pt", "a4");
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let position = 0;
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                let heightLeft = imgHeight - pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                const header = (billData.bill_header && billData.bill_header[0]) || {};
                pdf.save(`Bill_${header.school_code || "bill"}_${Date.now()}.pdf`);
                return;
            }
        } catch (err) {
            console.warn("html2canvas PDF generation failed, falling back to jsPDF table generation:", err);
        }

        // Fallback: previous jsPDF + autotable generation
        const header = (billData.bill_header && billData.bill_header[0]) || {};
        const footer = (billData.bill_footer && billData.bill_footer[0]) || {};
        const detailsArr = billData.bill_details || [];

        const doc = new jsPDF();
        // Header
        doc.setFontSize(16);
        doc.text(header.school_name || "", 14, 15);
        doc.setFontSize(10);
        if (header.tagline) doc.text(header.tagline, 14, 22);
        if (header.address) doc.text(header.address, 14, 28);
        if (header.contact_phone) doc.text(`Phone: ${header.contact_phone}`, 14, 34);
        if (header.contact_email) doc.text(`Email: ${header.contact_email}`, 14, 40);

        // Details -> reuse same logic as preview
        let body = [];
        if (detailsArr.length > 0) {
            detailsArr.forEach((d) => {
                if (Array.isArray(d.items)) {
                    d.items.forEach((it) => {
                        body.push([it.description || it.name || "Item", String(it.amount || it.value || "-")]);
                    });
                } else {
                    const keys = [
                        ["Tuition Fee", d.tuition_fee],
                        ["Transportation Fee", d.transportation_fee],
                        ["Fines", d.fines],
                        ["Payable Amount", d.payable_amount],
                        ["Balance Amount", d.balance_amount],
                    ];
                    keys.forEach((k) => {
                        if (k[1] !== undefined && k[1] !== null) body.push([k[0], String(k[1])]);
                    });
                }
            });
        }

        if (body.length === 0) body = [["No bill items", ""]];

        autoTable(doc, {
            startY: 50,
            head: [["Description", "Amount"]],
            body,
        });

        if (footer.fees_terms_and_conditions) {
            doc.setFontSize(9);
            doc.text("Terms:", 14, doc.lastAutoTable.finalY + 10);
            const terms = footer.fees_terms_and_conditions.split("\n").filter(Boolean);
            let y = doc.lastAutoTable.finalY + 16;
            terms.forEach((line) => {
                doc.text(line, 14, y);
                y += 6;
            });
        }

        doc.save(`Bill_${header.school_code || "bill"}_${Date.now()}.pdf`);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Bill Details</DialogTitle>
            <DialogContent dividers style={{ padding: 0 }}>
                <div style={{ maxHeight: '65vh', overflowY: hasScrollable ? 'auto' : 'hidden' }}>
                    {loading ? (
                        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    ) : billData ? (
                    // Render a simple HTML bill preview when PDF not available
                    (() => {
                        const header = (billData.bill_header && billData.bill_header[0]) || {};
                        const footer = (billData.bill_footer && billData.bill_footer[0]) || {};
                        const detailsArr = billData.bill_details || [];
                        return (
                            <div ref={previewRef} style={{ padding: 20, fontFamily: 'Arial, sans-serif', color: '#222' }}>
                                <div style={{ textAlign: 'center', marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 14 }}>
                                    <h2 style={{ margin: 0, fontSize: 20 }}>{header.school_name || 'School Name'}</h2>
                                    {header.school_code && <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{header.school_code}</div>}
                                    {header.tagline && <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>{header.tagline}</div>}
                                    {header.address && <div style={{ fontSize: 12, color: '#444', marginTop: 8 }}>{header.address}</div>}
                                    <div style={{ fontSize: 12, color: '#444', marginTop: 6 }}>{header.contact_phone}{header.contact_email ? ` | ${header.contact_email}` : ''}</div>
                                </div>

                                <div style={{ minHeight: 200, padding: '12px 0' }}>
                                    {detailsArr.length > 0 ? (
                                        detailsArr.map((d, idx) => (
                                            <div key={idx} style={{ marginBottom: 8 }}>
                                                {Array.isArray(d.items) ? (
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', paddingBottom: 8 }}>Description</th>
                                                                <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', paddingBottom: 8 }}>Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {d.items.map((it, i) => (
                                                                <tr key={i}>
                                                                    <td style={{ padding: '8px 0' }}>{it.description || it.name}</td>
                                                                    <td style={{ padding: '8px 0', textAlign: 'right' }}>{it.amount}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <tbody>
                                                            {d.tuition_fee !== undefined && (
                                                                <tr>
                                                                    <td>Tuition Fee</td>
                                                                    <td style={{ textAlign: 'right' }}>{d.tuition_fee}</td>
                                                                </tr>
                                                            )}
                                                            {d.transportation_fee !== undefined && (
                                                                <tr>
                                                                    <td>Transportation Fee</td>
                                                                    <td style={{ textAlign: 'right' }}>{d.transportation_fee}</td>
                                                                </tr>
                                                            )}
                                                            {d.fines !== undefined && (
                                                                <tr>
                                                                    <td>Fines</td>
                                                                    <td style={{ textAlign: 'right' }}>{d.fines}</td>
                                                                </tr>
                                                            )}
                                                            {d.payable_amount !== undefined && (
                                                                <tr>
                                                                    <td style={{ fontWeight: 600 }}>Payable Amount</td>
                                                                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{d.payable_amount}</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777', fontSize: 14 }}>
                                            No bill items available
                                        </div>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px solid #eee', paddingTop: 18, marginTop: 18, fontSize: 12 }}>
                                    {footer.fees_terms_and_conditions && (
                                        <div style={{ color: '#444', whiteSpace: 'pre-wrap' }}>{footer.fees_terms_and_conditions}</div>
                                    )}
                                    <div style={{ marginTop: 8, textAlign: 'right', color: '#666' }}>{footer.signature || ''}</div>
                                </div>
                            </div>
                        );
                    })()
                    ) : (
                        <div style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777', fontSize: 14 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>No bill available</div>
                                <div style={{ fontSize: 13, color: '#666' }}>No billing information was returned for this payment.</div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleDownload}
                    variant="contained"
                    color="primary"
                    disabled={!billData}
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