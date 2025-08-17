import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

const DropzoneSingle = ({ onDrop, previewUrl, label, acceptType = "image", file }) => {
  const acceptConfig =
    acceptType === "pdf"
      ? { "application/pdf": [] }
      : { "image/*": [] };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptConfig,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        p: 2,
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="body2">{label}</Typography>

      {previewUrl && (
        <Box mt={1}>
          {acceptType === "image" ? (
            <img src={previewUrl} alt={label} height={40} />
          ) : (
            <Typography variant="caption" color="textSecondary">
              📄 {file?.name || "PDF Uploaded"}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DropzoneSingle;
