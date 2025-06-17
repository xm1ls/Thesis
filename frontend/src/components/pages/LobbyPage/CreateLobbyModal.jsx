import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import {
  Tag,
  KeyRound,
  UsersRound,
  Ruler,
  Plus,
  Minus,
  Palette,
  X
} from "lucide-react";

const CreateLobbyModal = ({ isOpen, onClose, onSubmit }) => {
  const { authUser } = useAuthStore()

  const [name, setName] = useState(`${authUser?.name}'s Lobby`);
  const [size, setSize] = useState(10);
  const [maxPlayers, setMaxPlayers] = useState(1);
  const [password, setPassword] = useState("");
  const [newColor, setNewColor] = useState("#000000");
  const [colors, setColors] = useState([]);


  const handleAddColor = () => {
    if (!colors.includes(newColor)) {
      setColors([newColor, ...colors]);
    }
  };

  const handleSubmit = () => {
    if (name.length < 3 || name.length > 30) {
      alert("Name must be between 3 and 30 characters");
      return;
    }

    onSubmit({
      name,
      width: size,
      height: size,
      maxPlayers,
      password: password.trim() || null,
      colors,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center mb-25 z-50">
        <div className="bg-base-100 p-14 flex-col rounded-xl w-full max-w-md shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Create Lobby</h2>
            <button
              onClick={onClose}
              className="btn btn-md btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>

          <label className="input validator w-full">
            <Tag size={15} color={"#999"} />
            <input
              className="font-bold"
              type="text"
              required
              placeholder="Name"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minlength="3"
              maxlength="30"
              title="Only letters, numbers or dash"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="input validator w-full">
            <KeyRound size={15} color={"#999"} />
            <input
              className="font-bold"
              type="password"
              placeholder="Password"
              minlength="4"
              title="Must be at least 4 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {/* <div className="divider mt-0 px-15 text-gray-400"></div> */}

          <div className="form-control w-full">
            <div className="join w-full">
              <button
                onClick={() => setSize((prev) => Math.max(10, prev - 1))}
                className="btn join-item"
              >
                <Minus size={15} color={"#777"} />
              </button>

              <label className="input validator w-full">
                <Ruler size={15} color={"#999"} />
                <input
                  className="w-full text-center font-bold outline-none bg-transparent "
                  type="number"
                  required
                  placeholder="Size"
                  min="10"
                  max="100"
                  title="Must be between be 10 to 100"
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                />
              </label>

              <button
                onClick={() =>
                  setSize((prev) => {
                    const safePrev =
                      typeof prev === "number" && !isNaN(prev) ? prev : 9;
                    return Math.min(100, safePrev + 1);
                  })
                }
                className="btn join-item"
              >
                <Plus size={15} color={"#777"} />
              </button>
            </div>
          </div>

          <div className="form-control w-full">
            <div className="join w-full">
              <button
                onClick={() => setMaxPlayers((prev) => Math.max(1, prev - 1))}
                className="btn join-item"
              >
                <Minus size={15} color={"#777"} />
              </button>

              <label className="input input-bordered join-item flex items-center w-full">
                <UsersRound size={15} color={"#999"} />
                <input
                  type="number"
                  required
                  className="w-full text-center font-bold outline-none bg-transparent"
                  placeholder="Players"
                  min="1"
                  max="10"
                  title="Must be between 1 to 10"
                  value={maxPlayers}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val))
                      setMaxPlayers(Math.min(10, Math.max(1, val)));
                  }}
                />
              </label>

              <button
                onClick={() =>
                  setMaxPlayers((prev) => {
                    const safePrev =
                      typeof prev === "number" && !isNaN(prev) ? prev : 0;
                    return Math.min(10, safePrev + 1);
                  })
                }
                className="btn join-item"
              >
                <Plus size={15} color={"#777"} />
              </button>
            </div>
          </div>

          {/* <div className="divider mt-0 px-15 text-gray-400"></div> */}

          <div>
            <div className="form-control w-full">
              <div className="join w-full">
                <button
                  type="button"
                  onClick={() => {
                    const randomColor = `#${Math.floor(Math.random() * 0xffffff)
                      .toString(16)
                      .padStart(6, "0")}`;
                    setNewColor(randomColor);
                  }}
                  className="join-item btn hover:bg-base-300 transition"
                  title="Generate Random Color"
                >
                  <Palette size={15} color={"#777"} />
                </button>

                <input
                  type="color"
                  className="input join-item w-full m-0 p-0 border-1 cursor-pointer"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  title="Pick a color"
                />

                <button className="btn join-item" onClick={handleAddColor}>
                  <Plus size={15} color={"#777"} />
                </button>
              </div>
            </div>

            {colors.length > 0 && (
              <div className="mt-4 overflow-x-auto whitespace-nowrap flex gap-2 pb-4">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-2 py-1 rounded bg-base-200 shrink-0"
                  >
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <button
                      className="btn btn-ghost btn-xs hover:bg-transparent cursor-pointer border-0 shadow-none"
                      onClick={() =>
                        setColors(colors.filter((_, i) => i !== index))
                      }
                    >
                      <X size={15} color={"#777"} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="divider my-7 px-15"></div>

          <button onClick={handleSubmit} className="btn w-full font-bold">
            Create Lobby
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateLobbyModal;
