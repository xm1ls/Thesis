import { useEffect, useRef } from "react";
import { useCanvasStore } from "../store/useCanvasStore.js";
import ColorPicker from "./ColorPicker.jsx";

const SCALE = 10; // Scale factor to enlarge each pixel

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
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set scaled canvas size
    canvas.width = width * SCALE;
    canvas.height = height * SCALE;

    // Clear and redraw pixels
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pixels.forEach(({ x, y, color }) => {
      ctx.fillStyle = color;
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE); // Scale pixels
    });
  }, [width, height, pixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (newPixel) {
      const { x, y, color } = newPixel;
      ctx.fillStyle = color;
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }

    if (erasePixel) {
      const { x, y } = erasePixel;
      ctx.clearRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  }, [newPixel, erasePixel]);

  const handleCanvasClick = (event) => {
    if (!canvasRef.current) return;
    const point = getPointOnCanvas(event, canvasRef.current);
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
          className="shadow-[0px_0px_20px_rgba(0,0,0,0.2)]"
          onClick={handleCanvasClick}
        />
      </div>
    </>
  );
};

export default Canvas;

// Adjust click position based on SCALE
const getPointOnCanvas = (event, canvas) => {
  const canvasOffset = canvas.getBoundingClientRect();
  return {
    x: Math.floor((event.clientX - canvasOffset.left) / SCALE),
    y: Math.floor((event.clientY - canvasOffset.top) / SCALE),
  };
};
