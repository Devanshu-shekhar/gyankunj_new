import { Box, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const DropzoneSingle = ({ onDrop, previewUrl, label }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'image/*': [] },
    });

    return (
        <Box {...getRootProps()} sx={{ border: '2px dashed #ccc', p: 2, textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <Typography variant="body2">{label}</Typography>
            {previewUrl && (
                <Box mt={1}>
                    <img src={previewUrl} alt={label} height={40} />
                </Box>
            )}
        </Box>
    );
};

export default DropzoneSingle;
