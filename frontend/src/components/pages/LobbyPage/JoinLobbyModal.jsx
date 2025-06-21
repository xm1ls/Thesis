import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lobbyStore } from "../../../store/lobbyStore";

const JoinLobbyModal = ({ lobby, isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const { joinLobby } = lobbyStore();
  const navigate = useNavigate();

  const handleJoin = async () => {
    await joinLobby(lobby._id, password, navigate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-sm space-y-4">
          <h3 className="text-lg font-bold">
            Enter Password for {lobby.name}
          </h3>

          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button className="btn" onClick={() => handleJoin()}>
              Join
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinLobbyModal;
