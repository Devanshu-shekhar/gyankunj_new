import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Grid,
    Button,
    Typography,
    Box,
    FormHelperText,
    MenuItem
} from '@mui/material';
import { SketchPicker } from 'react-color';
import DropzoneSingle from './DropzoneSingle';
import DropzoneMultiple from './DropzoneMultiple';
import ColorPickerField from './ColorPickerField';

const SchoolConfiguration = () => {
    const {
        control,
        handleSubmit,
        register,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            school_name: '',
            tagline: '',
            logo_url: '',
            favicon_url: '',
            primary_color: '#0047AB',
            secondary_color: '#A6D608',
            accent_color: '#FF9800',
            font_family: 'Roboto, sans-serif',
            contact_email: '',
            contact_phone: '',
            website_url: '',
            school_code: '',
            active_language: 'en',
            address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
            },
            social_links: {
                facebook: '',
                twitter: '',
                instagram: '',
                linkedin: '',
            },
            gallery: [],
        },
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const countryList = [
        { code: 'US', name: 'United States' },
        { code: 'IN', name: 'India' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
    ];

    const languageList = [
        { code: 'en', label: 'English' },
        { code: 'fr', label: 'French' },
        { code: 'hi', label: 'Hindi' },
        { code: 'es', label: 'Spanish' },
        { code: 'zh', label: 'Chinese' },
    ];

    const handleLogoDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setLogoPreview(url);
        setValue('logo_url', url);
    };

    const handleFaviconDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setFaviconPreview(url);
        setValue('favicon_url', url);
    };

    const handleGalleryDrop = (acceptedFiles) => {
        const urls = acceptedFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(urls);
        setValue('gallery', urls);
    };

    const onSubmit = (data) => {
        console.log('School Branding Data:', data);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>School Configuration</Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="School Name"
                            fullWidth
                            {...register('school_name', { required: 'School name is required' })}
                            error={!!errors.school_name}
                            helperText={errors.school_name?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tagline"
                            fullWidth
                            {...register('tagline')}
                        />
                    </Grid>

                    {/* Color Pickers */}
                    {[
                        { name: 'primary_color', label: 'Primary Color' },
                        { name: 'secondary_color', label: 'Secondary Color' },
                        { name: 'accent_color', label: 'Accent Color' },
                    ].map(({ name, label }) => (
                        <Grid item xs={12} sm={4} key={name}>
                            <ColorPickerField name={name} label={label} control={control} />
                        </Grid>
                    ))}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Font Family"
                            fullWidth
                            {...register('font_family')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Contact Email"
                            fullWidth
                            type="email"
                            {...register('contact_email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={!!errors.contact_email}
                            helperText={errors.contact_email?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Contact Phone"
                            fullWidth
                            {...register('contact_phone', {
                                required: 'Phone is required',
                                pattern: {
                                    value: /^[0-9\-+()\s]+$/,
                                    message: 'Invalid phone number',
                                },
                            })}
                            error={!!errors.contact_phone}
                            helperText={errors.contact_phone?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Website URL"
                            fullWidth
                            {...register('website_url')}
                        />
                    </Grid>

                    {/* Address Fields */}
                    {['line1', 'line2', 'city', 'state', 'postal_code'].map((addr) => (
                        <Grid item xs={12} sm={6} key={addr}>
                            <TextField
                                label={addr.replace('_', ' ').toUpperCase()}
                                fullWidth
                                {...register(`address.${addr}`)}
                            />
                        </Grid>
                    ))}

                    {/* Country Selection */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Country"
                            fullWidth
                            {...register('address.country', { required: 'Country is required' })}
                            error={!!errors.address?.country}
                            helperText={errors.address?.country?.message}
                        >
                            {countryList.map((country) => (
                                <MenuItem key={country.code} value={country.name}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Social Links */}
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                        <Grid item xs={12} sm={6} key={platform}>
                            <TextField
                                label={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                fullWidth
                                {...register(`social_links.${platform}`)}
                            />
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="School Code"
                            fullWidth
                            {...register('school_code', { required: 'School code is required' })}
                            error={!!errors.school_code}
                            helperText={errors.school_code?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Active Language"
                            fullWidth
                            {...register('active_language', { required: 'Language is required' })}
                            error={!!errors.active_language}
                            helperText={errors.active_language?.message}
                        >
                            {languageList.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                    {lang.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {/* Dropzone Uploads */}
                    <Grid item xs={12} sm={6}>
                        <DropzoneSingle onDrop={handleLogoDrop} previewUrl={logoPreview} label="Upload Logo" />
                        {!logoPreview && (
                            <FormHelperText error>Logo is required</FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DropzoneSingle onDrop={handleFaviconDrop} previewUrl={faviconPreview} label="Upload Favicon" />
                        {!faviconPreview && (
                            <FormHelperText error>Favicon is required</FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <DropzoneMultiple onDrop={handleGalleryDrop} previews={galleryPreviews} label="Upload Gallery Images" />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">Save Configuration</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default SchoolConfiguration;
