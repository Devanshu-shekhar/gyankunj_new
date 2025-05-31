import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const DropzoneMultiple = ({ onDrop, previews, label }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: { 'image/*': [] },
    });

    return (
        <Box {...getRootProps()} sx={{ border: '2px dashed #ccc', p: 2, cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <Typography variant="body2">{label}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {previews.map((url, i) => (
                    <img key={i} src={url} alt={`gallery-${i}`} height={60} style={{ borderRadius: 4 }} />
                ))}
            </Box>
        </Box>
    );
};

export default DropzoneMultiple;