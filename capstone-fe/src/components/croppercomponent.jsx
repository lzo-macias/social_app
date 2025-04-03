import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import getCroppedImg from "./cropImageHelper";

const CropperComponent = ({ imageSrc, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(null); // null = freeform crop
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const confirmCrop = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
  };

  return (
    <div>
      <div style={{ position: "relative", height: 400 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect === "free" ? undefined : aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteInternal}
        />
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e, value) => setZoom(value)}
        />
      </div>

      <div style={{ margin: "1rem 0" }}>
        <strong>Aspect Ratio:</strong>
        <button onClick={() => setAspect("free")}>Free</button>
        <button onClick={() => setAspect(1)}>Square</button>
        <button onClick={() => setAspect(16 / 9)}>Landscape</button>
        <button onClick={() => setAspect(4 / 5)}>Portrait</button>
      </div>

      <button className="btn" onClick={confirmCrop}>
        Crop Image
      </button>
    </div>
  );
};

export default CropperComponent;
