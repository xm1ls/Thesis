import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useCanvasStoreTest } from "../store/canvasStore";
// import { useCanvasStoreTest } from "../store/useCanvasStore";

// import "./HomePage.css";
import { Link, Route, Routes } from "react-router-dom";
import CanvasPage from "./CanvasPage";
import {
  Minus,
  Plus,
  UserRound,
  LogOut,
  Settings,
  Dot,
  Palette,
  Squircle,
  Command,
  Grid2X2,
  Square,
  Component,
  Diamond,
  Grid2x2Plus,
  Search,
  Box,
  Store,
  Combine,
  Blocks,
} from "lucide-react";

const HomePageOld = () => {
  const [pixelData, setPixelData] = useState(null);

  const [canvasData, setCanvasData] = useState({
    scale: 12,
    newCanvasName: "",
    joinCanvasName: "",
  });

  const { getCanvas } = useCanvasStoreTest();

  const { logout, authUser } = useAuthStore();

  const canvasRef = useRef(null);

  const {
    getPixels,
    // getCanvas,
    placePixel,
    canvasInfo,
    isLoadingCanvas,
    canvas,
    pixels,
    subscribeToCanvas,
    unsubscribeFromCanvas,
    newPixel,
    createCanvas,
    getCanvases,
    canvases,
  } = useCanvasStore();

  useEffect(() => {
    getCanvas("main");
    // getPixels();
    getCanvases();
    subscribeToCanvas();

    return () => {
      unsubscribeFromCanvas();
    };
  }, [getCanvas, getCanvases, subscribeToCanvas]);

  useEffect(() => {
    if (newPixel) {
      const { x, y, color } = newPixel;
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = color === 1 ? "black" : "white";
      ctx.fillRect(x, y, 1, 1);
    }
  }, [newPixel]);

  useEffect(() => {
    if (!canvasInfo.width || !canvasInfo.height) return;

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    canvasElement.width = canvasInfo.width;
    canvasElement.height = canvasInfo.height;

    canvasElement.style.transform = `scale(${canvasData.scale})`;

    const ctx = canvasElement.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasInfo.width, canvasInfo.height);

    pixels.forEach(({ x, y, color }) => {
      ctx.fillStyle = color === 1 ? "black" : "white";
      ctx.fillRect(x, y, 1, 1);
    });
  }, [canvasInfo]);

  const handleCanvasClick = (e) => {
    const { x, y } = getPointOnCanvas(e);

    setPixelData({
      x: x,
      y: y,
      color: activeButton === "black" ? 1 : 2,
      canvasName: canvas,
      userId: authUser._id,
    });

    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = activeButton === "black" ? "black" : "white";
    ctx.fillRect(x, y, 1, 1);
  };

  const handleCanvasCreation = (e) => {
    createCanvas({
      name: canvasData.newCanvasName,
      width: 50,
      height: 50,
    });
  };

  useEffect(() => {
    if (pixelData) {
      placePixel(pixelData);
      console.log("Placed Pixel:", pixelData);
    }
  }, [pixelData]);

  const getPointOnCanvas = (event) => {
    const canvasOffset = canvasRef.current.getBoundingClientRect();

    return {
      x: Math.ceil((event.clientX - canvasOffset.left) / canvasData.scale) - 1,
      y: Math.ceil((event.clientY - canvasOffset.top) / canvasData.scale) - 1,
    };
  };

  const [activeButton, setActiveButton] = useState("black");

  if (isLoadingCanvas) return <div>Loading canvas...</div>;

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <canvas
        className="canvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
      ></canvas>

      <details className="dropdown dropdown-open dropdown-bottom dropdown-start absolute top-35 left-13 rounded-xl">
        <summary className="btn btn-square btn-neutral m-0 size-12 p-0 border-0 shadow-lg rounded-xl">
          <Box size={25} color="white" />
        </summary>
        <ul className="dropdown-content join join-vertical list z-1 w-fill gap-0 p-0 mt-4">
          
          <div className="tooltip tooltip-right">
            <div className="tooltip-content rounded-lg">
              <div className="p-2 text-md font-bold">Search</div>
            </div>
            <li className="btn join-item size-12 p-0 bg-transparent rounded-t-xl" role="button">
              <Search className="p-0 hover:bg-transparent" />
            </li>
          </div>
          <div className="tooltip tooltip-right">
            <div className="tooltip-content rounded-lg">
              <div className="p-2 text-md font-bold">Create New Canvas</div>
            </div>
            <li className="btn join-item size-12 p-0 bg-transparent rounded-b-xl">
              <Grid2x2Plus className="p-0 hover:bg-transparent" />
            </li>
          </div>
          
          <div className="tooltip tooltip-right">
            <div className="tooltip-content rounded-lg">
              <div className="p-2 text-md font-bold">Craft</div>
            </div>
            <li className="btn size-12 p-0 bg-transparent mt-3 rounded-t-xl">
              <Blocks className="p-0 hover:bg-transparent" />
            </li>
          </div>
          <div className="tooltip tooltip-right">
            <div className="tooltip-content rounded-lg">
              <div className="p-2 text-md font-bold">Store</div>
            </div>
            <li className="btn join-item size-12 p-0 bg-transparent rounded-b-xl">
              <Store className="p-0 hover:bg-transparent" />
            </li>
          </div>

          <div className="tooltip tooltip-right">
            <div className="tooltip-content rounded-lg">
              <div className="p-2 text-md font-bold">Profile</div>
            </div>
            <li className="btn size-12 p-0 bg-transparent rounded-t-xl mt-3">
              <UserRound className="p-0 hover:bg-transparent" />
            </li>
          </div>
          <div className="tooltip tooltip-right">
            <div className="tooltip-content rounded-lg">
              <div className="p-2 text-md font-bold">Settings</div>
            </div>
            <li className="btn join-item size-12 p-0 bg-transparent rounded-b-xl">
              <Settings className="p-0 hover:bg-transparent" />
            </li>
          </div>
        </ul>
      </details>

      <div className="absolute flex flex-col justify-center items-end right-5 gap-2 mb-20">
        <div
          className="absolute right-12 top-0"
          style={{ top: activeButton === "black" ? "5px" : "75px" }}
        >
          <Dot size={50} />
        </div>

        <button
          className="btn size-15 bg-black text-white relative"
          onClick={() => setActiveButton("black")}
        >
          Black
        </button>
        <button
          className="btn size-15 bg-white relative"
          onClick={() => setActiveButton("white")}
        >
          White
        </button>
      </div>

      <div className="dropdown dropdown-bottom dropdown-end absolute top-5 right-5">
        <div tabIndex={0} role="button" className="btn m-1">
          <UserRound size={20} />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 h-fill p-3 mt-1 border-1 border-gray-300 shadow-sm gap-1 flex flex-col justify-between"
        >
          <li>
            <div className="flex justify-between">
              Settings <Settings size={18} />
            </div>
          </li>
          <li>
            <div className="flex justify-between" onClick={() => logout()}>
              Logout <LogOut size={18} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePageOld;
