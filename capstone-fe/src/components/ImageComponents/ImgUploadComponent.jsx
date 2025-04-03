// // ImgUploadComponent.jsx
// import React, { useState } from "react";
// import axios from "axios";

// const ImgUploadComponent = ({ onImageUpload }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const token = localStorage.getItem("token");

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setUploadStatus("Please select a file first.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("image", selectedFile);
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/images/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setUploadStatus("Upload successful!");
//       if (response.data.imgId) {
//         onImageUpload(response.data.imgId);
//       } else {
//         setUploadStatus("Image upload failed. No imgId returned.");
//       }
//     } catch (error) {
//       setUploadStatus("Upload failed. Please try again.");
//     }
//   };

//   return (
//     <div className="card">
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       {preview && (
//         <img
//           src={preview}
//           alt="Preview"
//           style={{ maxWidth: "100%", marginTop: "10px" }}
//         />
//       )}
//       <button className="btn" onClick={handleUpload}>
//         Upload
//       </button>
//       {uploadStatus && <p>{uploadStatus}</p>}
//     </div>
//   );
// };

// export default ImgUploadComponent;

// // import React, { useState, useCallback } from "react";
// // import Cropper from "react-easy-crop";
// // import getCroppedImg from "../cropImageHelper";
// // import Slider from "@mui/material/Slider";
// // import axios from "axios";

// // const ImgUploadComponent = ({ onImageUpload }) => {
// //   const [selectedFile, setSelectedFile] = useState(null);
// //   const [preview, setPreview] = useState(null);
// //   const [cropping, setCropping] = useState(false);
// //   const [croppedFile, setCroppedFile] = useState(null);
// //   const [crop, setCrop] = useState({ x: 0, y: 0 });
// //   const [zoom, setZoom] = useState(1);
// //   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
// //   const [uploadStatus, setUploadStatus] = useState("");

// //   const token = localStorage.getItem("token");

// //   const handleFileChange = (event) => {
// //     const file = event.target.files[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onload = () => {
// //         setPreview(reader.result);
// //         setSelectedFile(file);
// //         setCropping(true);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const onCropComplete = useCallback((_, croppedAreaPixels) => {
// //     setCroppedAreaPixels(croppedAreaPixels);
// //   }, []);

// //   const handleCropConfirm = async () => {
// //     if (!preview || !croppedAreaPixels) return;
// //     const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
// //     setCroppedFile(croppedImage);
// //     setCropping(false);
// //   };

// //   const handleUpload = async () => {
// //     if (!croppedFile) {
// //       setUploadStatus("Please crop and confirm the image first.");
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append("image", croppedFile);

// //     try {
// //       const response = await axios.post(
// //         `${import.meta.env.VITE_API_BASE_URL}/images/upload`,
// //         formData,
// //         {
// //           headers: {
// //             "Content-Type": "multipart/form-data",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       setUploadStatus("Upload successful!");
// //       if (response.data.imgId) {
// //         onImageUpload(response.data.imgId); // ✅ imgId now properly passed
// //       } else {
// //         setUploadStatus("Image upload failed. No imgId returned.");
// //       }
// //     } catch (error) {
// //       setUploadStatus("Upload failed. Please try again.");
// //     }
// //   };

// //   return (
// //     <div className="card">
// //       <input type="file" accept="image/*" onChange={handleFileChange} />

// //       {cropping && preview && (
// //         <div style={{ position: "relative", height: 400 }}>
// //           <Cropper
// //             image={preview}
// //             crop={crop}
// //             zoom={zoom}
// //             aspect={1}
// //             onCropChange={setCrop}
// //             onZoomChange={setZoom}
// //             onCropComplete={onCropComplete}
// //           />
// //           <Slider
// //             min={1}
// //             max={3}
// //             step={0.1}
// //             value={zoom}
// //             onChange={(e, z) => setZoom(z)}
// //           />
// //           <button onClick={handleCropConfirm}>Crop & Preview</button>
// //         </div>
        
// //       )}

// //       {croppedFile && (
// //         <div style={{ textAlign: "center", marginTop: "1rem" }}>
// //           <img
// //             src={URL.createObjectURL(croppedFile)}
// //             alt="Cropped preview"
// //             style={{ maxWidth: "100%", borderRadius: "8px" }}
// //           />
// //           <button className="btn" onClick={handleUpload}>
// //             Upload
// //           </button>
// //         </div>
// //       )}

// //       {uploadStatus && <p>{uploadStatus}</p>}
// //     </div>
// //   );
// // };

// // export default ImgUploadComponent;

import React, { useState } from "react";
import axios from "axios";
import CropperComponent from "../croppercomponent";
const ImgUploadComponent = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  const handleCropComplete = async (blob) => {
    setCroppedBlob(blob);
  };

  const handleUpload = async () => {
    if (!croppedBlob) {
      setStatus("Please crop the image before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("image", croppedBlob);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/images/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.imgId) {
        setStatus("Upload successful");
        onImageUpload(response.data.imgId);
      } else {
        setStatus("Upload failed. No imgId returned.");
      }
    } catch (err) {
      setStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div className="card">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageSrc && !croppedBlob && (
        <CropperComponent imageSrc={imageSrc} onCropComplete={handleCropComplete} />
      )}
      {croppedBlob && (
        <>
          <img
            src={URL.createObjectURL(croppedBlob)}
            alt="Cropped preview"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
          <button className="btn" onClick={handleUpload}>Upload</button>
        </>
      )}
      {status && <p>{status}</p>}
    </div>
  );
};

export default ImgUploadComponent;
