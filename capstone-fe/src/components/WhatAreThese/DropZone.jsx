// DropZone.jsx
import { useRef, useState } from "react";
import axios from "axios";

export default function DropZone() {
  const dropRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const formData = new FormData();
    formData.append("content", "Dragged image"); // Replace with actual caption logic
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/post`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("✅ Uploaded:", res.data);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  return (
    <div
      ref={dropRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: dragging ? "rgba(0,0,0,0.2)" : "transparent",
        zIndex: 9999,
        pointerEvents: dragging ? "auto" : "none",
        transition: "background-color 0.3s ease",
      }}
    >
      {dragging && (
        <div
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "40vh",
            fontSize: "24px",
          }}
        >
          Drop your image here to upload
        </div>
      )}
    </div>
  );
}
