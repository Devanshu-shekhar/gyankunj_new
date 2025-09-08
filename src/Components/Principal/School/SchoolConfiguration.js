import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    TextField,
    Grid,
    Button,
    Typography,
    Box,
    FormHelperText,
    MenuItem,
    Snackbar,
    Alert,
} from "@mui/material";
import DropzoneSingle from "./DropzoneSingle";
import DropzoneMultiple from "./DropzoneMultiple";
import ColorPickerField from "./ColorPickerField";
import { getFilePreviewUrl } from "../../getFilePreviewUrl";

const LOCAL_STORAGE_KEY = "school_config";

const countryList = [
    { code: "US", name: "United States" },
    { code: "IN", name: "India" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
];

const languageList = [
    { code: "en", label: "English" },
    { code: "fr", label: "French" },
    { code: "hi", label: "Hindi" },
    { code: "es", label: "Spanish" },
    { code: "zh", label: "Chinese" },
];

const fontList = [
    { label: "Poppins", code: '"Poppins", sans-serif' },
    { label: "Roboto", code: '"Roboto", sans-serif' },
    { label: "Open Sans", code: '"Open Sans", sans-serif' },
    { label: "Lato", code: '"Lato", sans-serif' },
    { label: "Montserrat", code: '"Montserrat", sans-serif' },
    { label: "Arial", code: "Arial, sans-serif" },
];

const loadFromLocalStorage = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

const SchoolConfiguration = () => {
    const savedData = loadFromLocalStorage();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: savedData || {
            school_name: "",
            tagline: "",
            logo_url: "",
            favicon_url: "",
            primary_color: "#0047AB",
            secondary_color: "#A6D608",
            accent_color: "#FF9800",
            font_family: '"Poppins", sans-serif',
            contact_email: "",
            contact_phone: "",
            website_url: "",
            school_code: "",
            active_language: "en",
            address: {
                line1: "",
                line2: "",
                city: "",
                state: "",
                postal_code: "",
                country: "",
            },
            social_links: {
                facebook: "",
                twitter: "",
                instagram: "",
                linkedin: "",
            },
            gallery: [],
            file_uploads: {
                book_master_pdf: "",
                category_master_pdf: "",
                chapter_master_pdf: "",
                content_master_pdf: "",
                grade_master_pdf: "",
                holiday_observation_pdf: "",
                period_master_pdf: "",
                section_master_pdf: "",
                role_master_pdf: "",
                subject_master_pdf: "",
                school_diary_pdf: "",
            },
            fees_terms_and_conditions: "",
        },
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const logoFile = useRef(null);
    const faviconFile = useRef(null);
    const galleryFiles = useRef([]);
    const fileUploadsRef = useRef({});

    const [logoPreview, setLogoPreview] = useState(getFilePreviewUrl(savedData?.logo_url) || null);
    const [faviconPreview, setFaviconPreview] = useState(
        getFilePreviewUrl(savedData?.favicon_url) || null
    );
    const [galleryPreviews, setGalleryPreviews] = useState(
        savedData?.gallery.map(getFilePreviewUrl) || []
    );

    const handleLogoDrop = (files) => {
        const file = files[0];
        logoFile.current = file;
        const url = URL.createObjectURL(file);
        setLogoPreview(url);
        setValue("logo_url", url);
    };

    const handleFaviconDrop = (files) => {
        const file = files[0];
        faviconFile.current = file;
        const url = URL.createObjectURL(file);
        setFaviconPreview(url);
        setValue("favicon_url", url);
    };

    const handleGalleryDrop = (files) => {
        galleryFiles.current = files;
        const urls = files.map((f) => URL.createObjectURL(f));
        setGalleryPreviews(urls);
        setValue("gallery", urls);
    };

    // --- Add these states ---
    const [pdfFiles, setPdfFiles] = useState(savedData?.file_uploads || {});
    const [pdfPreviews, setPdfPreviews] = useState(() => {
        const previews = {};
        if (savedData?.file_uploads) {
            Object.entries(savedData.file_uploads).forEach(([key, value]) => {
                if (value) {
                    previews[key] = getFilePreviewUrl(value); // keep base64 as preview
                }
            });
        }
        return previews;
    });

    // --- Update handlePdfDrop ---
    const handlePdfDrop = (key) => (acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if (file.type !== "application/pdf") {
                alert("Only PDF files are allowed!");
                return;
            }

            const fileUrl = URL.createObjectURL(file);

            // Save file to refs for later base64 conversion
            fileUploadsRef.current[key] = file;

            // Save previews in state (so each field keeps its own preview)
            setPdfFiles((prev) => ({ ...prev, [key]: file }));
            setPdfPreviews((prev) => ({ ...prev, [key]: fileUrl }));

            // Also update form value
            setValue(`file_uploads.${key}`, fileUrl);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(",")[1];
                resolve({
                    mimetype: file.type,
                    data: base64,
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };




    const onSubmit = async (data) => {
        // Logo
        let logoBase64 = data.logo_url;
        if (logoFile.current) {
            logoBase64 = await fileToBase64(logoFile.current);
        }

        // Favicon
        let faviconBase64 = data.favicon_url;
        if (faviconFile.current) {
            faviconBase64 = await fileToBase64(faviconFile.current);
        }

        // Gallery
        let galleryBase64 = data.gallery || [];
        if (galleryFiles.current.length > 0) {
            galleryBase64 = await Promise.all(
                galleryFiles.current.map(fileToBase64)
            );
        }

        // PDF Uploads
        const fileUploadsBase64 = {};
        for (const [key, file] of Object.entries(fileUploadsRef.current)) {
            if (file) {
                fileUploadsBase64[key] = await fileToBase64(file);
            } else {
                fileUploadsBase64[key] = data.file_uploads[key] || "";
            }
        }

        const fullData = {
            ...data,
            logo_url: logoBase64,
            favicon_url: faviconBase64,
            gallery: galleryBase64,
            file_uploads: fileUploadsBase64,
        };

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fullData));
        setOpenSnackbar(true);
    };


    const renderTextField = (
        name,
        label,
        rules = {},
        type = "text",
        multiline = false
    ) => (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field }) => (
                <TextField
                    {...field}
                    type={type}
                    label={label}
                    fullWidth
                    multiline={multiline}
                    minRows={multiline ? 4 : 1}
                    error={!!errors?.[name.split(".")?.[0]]}
                    helperText={
                        errors?.[name.split(".")?.[0]]?.[name.split(".")?.[1]]?.message ||
                        errors?.[name]?.message
                    }
                />
            )}
        />
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
                School Configuration
            </Typography>
            <form className="mt-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    {/* School details */}
                    <Grid item xs={12} sm={6}>
                        {renderTextField("school_name", "School Name", { required: "Required" })}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {renderTextField("tagline", "Tagline")}
                    </Grid>

                    {["primary_color", "secondary_color", "accent_color"].map((field) => (
                        <Grid item xs={12} sm={4} key={field}>
                            <ColorPickerField
                                name={field}
                                label={field.replace("_", " ").toUpperCase()}
                                control={control}
                            />
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="font_family"
                            control={control}
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label="Font Family"
                                    fullWidth
                                    {...field}
                                    error={!!errors.font_family}
                                    helperText={errors.font_family?.message}
                                >
                                    {fontList.map((l) => (
                                        <MenuItem key={l.code} value={l.code}>
                                            {l.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {renderTextField("contact_email", "Email", {
                            required: "Email required",
                            pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
                        })}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {renderTextField("contact_phone", "Phone", {
                            required: "Phone required",
                            pattern: { value: /^[0-9\-+()\s]+$/, message: "Invalid phone" },
                        })}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {renderTextField("website_url", "Website URL")}
                    </Grid>

                    {/* Address */}
                    {["line1", "line2", "city", "state", "postal_code"].map((f) => (
                        <Grid item xs={12} sm={6} key={f}>
                            {renderTextField(`address.${f}`, f.replace("_", " ").toUpperCase())}
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="address.country"
                            control={control}
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label="Country"
                                    fullWidth
                                    {...field}
                                    error={!!errors.address?.country}
                                    helperText={errors.address?.country?.message}
                                >
                                    {countryList.map((c) => (
                                        <MenuItem key={c.code} value={c.code}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    {/* Social links */}
                    {["facebook", "twitter", "instagram", "linkedin"].map((platform) => (
                        <Grid item xs={12} sm={6} key={platform}>
                            {renderTextField(
                                `social_links.${platform}`,
                                `${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`
                            )}
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={6}>
                        {renderTextField("school_code", "School Code", { required: "Required" })}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="active_language"
                            control={control}
                            rules={{ required: "Required" }}
                            render={({ field }) => (
                                <TextField
                                    select
                                    label="Active Language"
                                    fullWidth
                                    {...field}
                                    error={!!errors.active_language}
                                    helperText={errors.active_language?.message}
                                >
                                    {languageList.map((l) => (
                                        <MenuItem key={l.code} value={l.code}>
                                            {l.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Grid>

                    {/* Logo & Favicon */}
                    <Grid item xs={12} sm={6}>
                        <DropzoneSingle
                            onDrop={handleLogoDrop}
                            previewUrl={logoPreview}
                            label="Upload Logo"
                        />
                        {!logoPreview && <FormHelperText error>Logo is required</FormHelperText>}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DropzoneSingle
                            onDrop={handleFaviconDrop}
                            previewUrl={faviconPreview}
                            label="Upload Favicon"
                        />
                        {!faviconPreview && (
                            <FormHelperText error>Favicon is required</FormHelperText>
                        )}
                    </Grid>

                    {/* Gallery */}
                    <Grid item xs={12}>
                        <DropzoneMultiple
                            onDrop={handleGalleryDrop}
                            previews={galleryPreviews}
                            label="Upload Gallery Images"
                        />
                    </Grid>

                    {/* PDF Uploads */}
                    {[
                        { key: "book_master_pdf", label: "Book Master (PDF)" },
                        { key: "category_master_pdf", label: "Category Master (PDF)" },
                        { key: "chapter_master_pdf", label: "Chapter Master (PDF)" },
                        { key: "content_master_pdf", label: "Content Master (PDF)" },
                        { key: "grade_master_pdf", label: "Grade Master (PDF)" },
                        { key: "holiday_observation_pdf", label: "Holiday & Observation (PDF)" },
                        { key: "period_master_pdf", label: "Period Master (PDF)" },
                        { key: "section_master_pdf", label: "Section Master (PDF)" },
                        { key: "role_master_pdf", label: "Role Master (PDF)" },
                        { key: "subject_master_pdf", label: "Subject Master (PDF)" },
                        { key: "school_diary_pdf", label: "School Diary (PDF)" },
                    ].map(({ key, label }) => (
                        <Grid item xs={12} sm={6} key={key}>
                            <DropzoneSingle
                                label={label}
                                acceptType="pdf"
                                onDrop={handlePdfDrop(key)}
                                previewUrl={pdfPreviews[key]}
                                file={pdfFiles[key]}
                            />
                        </Grid>
                    ))}


                    {/* Fees Terms & Conditions */}
                    <Grid item xs={12}>
                        {renderTextField(
                            "fees_terms_and_conditions",
                            "Fees Terms & Conditions",
                            {},
                            "text",
                            true
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">
                            Save Configuration
                        </Button>
                    </Grid>
                </Grid>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity="success"
                        variant="filled"
                    >
                        Data saved successfully!
                    </Alert>
                </Snackbar>
            </form>
        </Box>
    );
};

export default SchoolConfiguration;