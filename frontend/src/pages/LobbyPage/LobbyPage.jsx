import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCheck } from "lucide-react";
import { lobbyStore } from "../../store/lobbyStore.js";
import { useAuthStore } from "../../store/authStore.js";
import { useNavbarStore } from "../../store/useNavbarStore.js";
import { Search, Plus, ListFilter, Lock, DoorOpen } from "lucide-react";
import CreateLobbyModal from "../../components/pages/LobbyPage/CreateLobbyModal.jsx";
import JoinLobbyModal from "../../components/pages/LobbyPage/JoinLobbyModal.jsx";
import LobbyCard from "../../components/pages/LobbyPage/LobbyCard.jsx";
import { useCanvasStore } from "../../store/useCanvasStore.js";

const LobbyPage = () => {
  const { lobbies, getAllLobby, createLobby, joinLobby } = lobbyStore();
  const { createCanvas } = useCanvasStore();
  const { authUser } = useAuthStore();

  const [selectedLobby, setSelectedLobby] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const { name, password, maxPlayers, width, height, colors } = data;
    console.log(data);

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
      colors,
    });

    if (lobby) {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setActions, removeActions } = useNavbarStore();

  useEffect(() => {
    const groupId = "lobby-actions";
    setActions(
      groupId,
      [
        <button
          onClick={() => setIsModalOpen((prev) => !prev)}
          className="btn btn-ghost"
        >
          <Plus size={20} /> Create
        </button>,
      ],
      11
    );

    return () => removeActions(groupId);
  }, []);

  return (
    <div className="flex px-10 py-10">
      <CreateLobbyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          handleSubmit(data);
        }}
      />

      <JoinLobbyModal
        isOpen={selectedLobby}
        lobby={selectedLobby}
        onClose={() => setSelectedLobby(null)}
      />

      <div className="bg-base-100 m-5 w-full gap-2 flex flex-col items-center">
        {lobbies?.length > 0 ? (
          lobbies.map((lobby) => (
            <LobbyCard
              key={lobby._id}
              lobby={lobby}
              handleJoinClick={() => handleJoinClick(lobby)}
            />
          ))
        ) : (
          <div className="text-sm text-center opacity-60 py-4">
            No lobbies available.
          </div>
        )}
      </div>
    </div>
  );
};

export default LobbyPage;
