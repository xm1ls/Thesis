import { useState, useEffect, useRef } from "react";
import { useCanvasStore } from "../store/useCanvasStore.js";
import { useNavbarStore } from "../store/useNavbarStore.js";
import { Pipette, Eraser, Paintbrush } from "lucide-react";
import { HexColorPicker } from "react-colorful";

// const colors = [
//   "#ffffff", "#e0e0e0", "#c0c0c0", "#a0a0a0", "#808080",
//   "#606060", "#404040", "#202020", "#000000"
// ];

const ColorPicker = () => {
  const { setColor, color, colors, setTool } = useCanvasStore();
  const { setActions, clearActions } = useNavbarStore();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorList, setShowColorList] = useState(false);

  const useEyedropper = async () => {
    if (!("EyeDropper" in window)) {
      alert("Eyedropper API not supported in this browser.");
      return;
    }

    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const pickedColor = result.sRGBHex.toLowerCase();

      const normalizedColors = colors.map((c) => c.toLowerCase());

      if (colors.length === 0 || normalizedColors.includes(pickedColor)) {
        setColor(pickedColor);
      } else {
        // Pick is disallowed, fallback to first color if it exists
        if (colors.length > 0) {
          setColor(colors[0]);
        }
      }
    } catch (err) {
      console.warn("Eyedropper cancelled or failed:", err);
    }
  };

  useEffect(() => {
    setActions([
      <button
        className="btn btn-ghost"
        title="Eraser tool"
        onClick={() => setTool("eraser")}
      >
        <Eraser size={20} />
      </button>,

      <button
        className="btn btn-ghost relative"
        key="paintbrush"
        title="Paint tool"
        onClick={() => {
          setTool("paint")
          if (colors.length === 0) {
            setShowColorPicker((prev) => !prev);
            setShowColorList(false);
          } else {
            setShowColorList((prev) => !prev);
            setShowColorPicker(false);
          }
        }}
      >
        <Paintbrush size={20} color={color} />
      </button>,

      <button
        className="btn btn-ghost"
        key="pipette"
        onClick={useEyedropper}
        title="Eyedropper tool"
      >
        <Pipette size={20} />
      </button>,
    ]);

    if (colors?.length > 0 && !colors?.includes(color)) {
      setColor(colors[0]);
    }

    return () => clearActions();
  }, [setActions, clearActions, colors, color, setColor]);

  return (
    <div className="relative">
      {/* Color Picker dropdown */}
      {showColorPicker && colors.length === 0 && (
        <div className="fixed bottom-25 left-1/2 transform -translate-x-1/2 z-100">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      )}

      {/* Color list dropdown */}
      {showColorList && colors.length > 0 && (
        <div className="fixed bottom-25 left-1/2 transform -translate-x-1/2 z-100 bg-base-200 p-2 rounded shadow flex gap-2">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-8 h-8 rounded border-2 ${
                color === c ? "border-black scale-110" : "border-transparent"
              } transition-all`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                setShowColorList(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
