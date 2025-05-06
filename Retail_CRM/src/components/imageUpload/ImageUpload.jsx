import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Typography, Box, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import CONFIG from "../../config";

// Styled components with dynamic dimensions
const InputStyled = styled("input")({
  display: "none",
});

const ImagePreview = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
}));

const UploadContainer = styled(Box)(({ width, height, dragOver }) => ({
  width: width || "300px", // Default width if not provided
  height: height || "300px", // Default height if not provided
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  cursor: "pointer",
  backgroundColor: "#f9f9f9",
  position: "relative",
  transition: "background-color 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  "&.drag-over": {
    backgroundColor: "#e0e0e0",
    borderColor: "#bbb",
  },
}));

const RemoveButton = styled(IconButton)({
  position: "absolute",
  top: "0px",
  right: "0px",
});

const AddButton = styled(Button)({
  zIndex: 1,
});

const ImageUpload = ({
  InitialImage = null,
  handleImageSet,
  maxSizeMB = 2,
  onUploadSuccess, // Callback function on successful upload
  width, // Width of the container
  height, // Height of the container
  index, // Unique index for file input
}) => {
  const AuthToken = localStorage.getItem("AdminAuthToken");
  const { baseURL, apiToken } = CONFIG;
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (InitialImage) {
      setImage(InitialImage);
    }
  }, [InitialImage]);

  const handleFileChange = (event) => {
    handleRemoveImage();
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB.`);
      return;
    }
    setError(null);
    uploadImage(file);
  };

  const handleRemoveImage =  () => {
    setImage(null);
    handleImageSet("");
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
console.log(file)
    try {
      setUploading(true);
      const response = await axios.post(`${baseURL}/image/upload`, formData, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          AuthToken: AuthToken,
          "Content-Type": "multipart/form-data",
        },
      });
      setUploading(false);

      if (response.data.success) {
        setImage(response.data.filename);
        handleImageSet(response.data.filename);
        toast.success(`Image Uploaded Successfully`, { autoClose: 500 });
        setError(null);
        if (onUploadSuccess) onUploadSuccess(response.data);
      } else {
        setError("Failed to upload image. Please try again.");
        toast.error(`${response.data.message}`, { autoClose: 500 });
      }
    } catch (err) {
      setUploading(false);
      console.log(err);

      setError("Failed to upload image. Please try again.");
      toast.error(`${err.message}`, { autoClose: 500 });
    }
  };

  return (
    <UploadContainer
      width={width}
      height={height}
      className={dragOver ? "drag-over" : ""}
      onDrop={handleDrop}
      onDragOver={(event) => {
        event.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
    >
      <label htmlFor={`file-upload-${index}`}>
        <InputStyled
          accept={"image/*"}
          id={`file-upload-${index}`}
          type="file"
          onChange={handleFileChange}
        />
        {!image && (
          <AddButton
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            component="span"
            disabled={uploading} // Disable button during upload
          >
            Upload Image
          </AddButton>
        )}
        {image && (
          <>
            <ImagePreview
              src={`${CONFIG.imageURL}${image}`}
              alt="Preview"
              width={width}
              height={height}
            />
            <RemoveButton color="error" onClick={handleRemoveImage}>
              <CancelIcon />
            </RemoveButton>
          </>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </label>
    </UploadContainer>
  );
};

export default ImageUpload;
