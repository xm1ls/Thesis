import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

const EditCanvasModal = ({ isOpen, initialColors = [], onSave, onClose }) => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setColors(initialColors);
    }
  }, [isOpen, initialColors]);

  const addColor = () => setColors((c) => [...c, "#000000"]);

  const updateColor = (index, newColor) => {
    setColors((c) => {
      const copy = [...c];
      copy[index] = newColor;
      return copy;
    });
  };

  const removeColor = (index) => {
    setColors((c) => c.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-60">
      <div className="bg-base-100 p-6 rounded-lg w-96 max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Allowed Colors</h2>

        <div className="space-y-3 max-h-72 overflow-y-auto mb-4">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => updateColor(idx, e.target.value)}
                className="w-12 h-8 rounded border"
              />
              <span>{color}</span>
              <button
                className="btn btn-sm btn-error btn-circle"
                onClick={() => removeColor(idx)}
                title="Remove color"
                type="button"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          className="btn btn-outline btn-sm mb-4 flex items-center gap-1"
          onClick={addColor}
          type="button"
        >
          <Plus size={16} /> Add Color
        </button>

        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="btn" onClick={() => onSave(colors)} type="button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCanvasModal;
