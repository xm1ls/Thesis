import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { lobbyStore } from "../../store/lobbyStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { useNavbarStore } from "../../store/useNavbarStore.js";
import { Search, Plus, ListFilter } from "lucide-react";
import CreateLobbyModal from "../../components/pages/LobbyPage/CreateLobbyModal.jsx";
import { useCanvasStore } from "../../store/useCanvasStore.js";

const LobbyPage = () => {
  const { lobbies, getAllLobby, createLobby, joinLobby } = lobbyStore();
  const { createCanvas } = useCanvasStore();
  const { authUser } = useAuthStore();

  const [selectedLobby, setSelectedLobby] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const { name, password, maxPlayers, width, height, colors } = data;
    console.log(data)

    const lobby = await createLobby({
      name,
      password,
      maxPlayers,
      createdBy: authUser._id,
    });

    const canvas = await createCanvas({
      name,
      width,
      height,
      colors
    });

    console.log(lobby)
    console.log(canvas)

    if (lobby) {
      console.log(lobby._id);
      navigate(`/lobby/${lobby._id}`);
    }
  };

  useEffect(() => {
    getAllLobby();
  }, [getAllLobby]);

  const handleJoinClick = (lobby) => {
    if (lobby.isPrivate) {
      setSelectedLobby(lobby);
    } else {
      joinLobby(lobby._id, "", navigate);
    }
  };

  ///

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setActions, clearActions } = useNavbarStore();

  useEffect(() => {
    setActions([
      <button
        onClick={() => setIsModalOpen((prev) => !prev)}
        className="btn btn-ghost"
      >
        <Plus size={20} /> Create
      </button>,
    ]);

    return () => clearActions();
  }, [setActions, clearActions]);

  ///

  return (
    <div className="flex px-20 py-10">
      <CreateLobbyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          console.log("Lobby Data:", data);
          handleSubmit(data);
        }}
      />

      <ul className="list bg-base-100 m-5 w-full">
        {lobbies?.length > 0 ? (
          lobbies.map((lobby) => (
            <li
              key={lobby._id}
              className="list-row flex items-center justify-between"
            >
              <div>
                <div className="flex">
                  <div className="font-medium">
                    {lobby.isPrivate ? "🔒" : "public"}
                  </div>
                  <div className="divider divider-horizontal"></div>
                  <div className="font-bold">{lobby.name}</div>
                </div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  In Lobby: {lobby.playerCount} / {lobby.maxPlayers}
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-xs opacity-70">
                  Host: {lobby?.createdBy?.name || "Unknown"}
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={() => handleJoinClick(lobby)}
                >
                  Join
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm text-center opacity-60 py-4">
            No lobbies available.
          </li>
        )}
        {selectedLobby && (
          <JoinLobbyModal
            lobby={selectedLobby}
            onClose={() => setSelectedLobby(null)}
          />
        )}
      </ul>
    </div>
  );
};

const JoinLobbyModal = ({ lobby, onClose }) => {
  const [password, setPassword] = useState("");
  const { joinLobby } = lobbyStore();

  const navigate = useNavigate();

  const handleJoin = async () => {
    await joinLobby(lobby._id, password, navigate);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Enter Password for {lobby.name}</h3>
        <input
          type="password"
          className="input input-bordered w-full my-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="modal-action">
          <button className="btn" onClick={handleJoin}>
            Join
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
