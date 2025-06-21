import { useEffect, useRef } from "react";
import { useCanvasStore } from "../store/useCanvasStore.js";
import ColorPicker from "./ColorPicker.jsx";

const DISPLAY_SIZE = 500; // Fixed size in px

const Canvas = ({ name }) => {
  const canvasRef = useRef(null);
  const {
    width,
    height,
    pixels,
    getCanvas,
    placePixel,
    newPixel,
    erasePixel,
    removePixel,
    subscribeToCanvas,
    tool,
  } = useCanvasStore();

  useEffect(() => {
    getCanvas(name);
  }, [getCanvas]);

  useEffect(() => {
    subscribeToCanvas();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const ctx = canvas.getContext("2d");

    // Internal resolution (rendering size)
    canvas.width = width;
    canvas.height = height;

    // Visual size (CSS)
    canvas.style.width = `${DISPLAY_SIZE}px`;
    canvas.style.height = `${DISPLAY_SIZE}px`;

    // Scale drawing to fill visual size
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(1, 1);

    // Draw each pixel
    pixels.forEach(({ x, y, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1); // draw raw 1x1 pixels
    });
  }, [width, height, pixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const ctx = canvas.getContext("2d");

    if (newPixel) {
      const { x, y, color } = newPixel;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }

    if (erasePixel) {
      const { x, y } = erasePixel;
      ctx.clearRect(x, y, 1, 1);
    }
  }, [newPixel, erasePixel]);

  const handleCanvasClick = (event) => {
    if (!canvasRef.current) return;
    const point = getPointOnCanvas(event, canvasRef.current, width, height);
    if (tool === "paint") {
      placePixel(point.x, point.y);
    } else if (tool === "eraser") {
      removePixel(point.x, point.y);
    }
  };

  return (
    <>
      <ColorPicker />
      <div className="flex justify-center items-center">
        <canvas
          ref={canvasRef}
          className="shadow-[0px_0px_20px_rgba(0,0,0,0.2)] border border-base-300"
          onClick={handleCanvasClick}
          style={{
            imageRendering: "pixelated",
            cursor: "crosshair",
          }}
        />
      </div>
    </>
  );
};

export default Canvas;

// Converts mouse event into canvas coords
const getPointOnCanvas = (event, canvas, width, height) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = width / rect.width;
  const scaleY = height / rect.height;

  return {
    x: Math.floor((event.clientX - rect.left) * scaleX),
    y: Math.floor((event.clientY - rect.top) * scaleY),
  };
};
