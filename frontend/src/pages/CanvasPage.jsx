import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lobbyStore } from "../store/lobbyStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { useAuthStore } from "../store/authStore";
import { useNavbarStore } from "../store/useNavbarStore";
import Canvas from "../components/Canvas";
import Chat from "../components/Chat";
import EditCanvasModal from "../components/pages/CanvasPage/EditCanvasModal";

import { Settings, LogOut, MessageSquare } from "lucide-react";

const CanvasPage = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const { leaveLobby, currentLobby, getLobbyById } = lobbyStore();
  const { authUser } = useAuthStore();
  const { setActions, removeActions } = useNavbarStore();
  const { canvas } = useCanvasStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [allowedColors, setAllowedColors] = useState([]);

  useEffect(() => {
    if (canvas) {
      setAllowedColors(canvas.colors || []);
    }
  }, [canvas]);

  const handleSaveColors = async (newColors) => {
    // await updateLobbyColors(lobbyId, newColors);
    setAllowedColors(newColors);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!currentLobby) {
      getLobbyById(lobbyId);
    }
  }, [lobbyId, currentLobby, getLobbyById]);

  const isOwner = currentLobby?.createdBy === authUser?._id;

  useEffect(() => {
    setActions(
      "canvas-chat",
      [
        <button
          key="chat"
          onClick={() => setIsChatOpen((prev) => !prev)}
          className="btn btn-ghost"
        >
          <MessageSquare size={20} />
        </button>,
      ],
      12
    );

    setActions(
      "canvas-leave",
      [
        <button
          key="leave"
          className="btn btn-ghost"
          onClick={() => leaveLobby(lobbyId, navigate)}
        >
          <LogOut size={20} />
        </button>,
      ],
      9
    );

    if (isOwner) {
      setActions(
        "canvas-settings",
        [
          <button
            key="settings"
            // onClick={() => setIsModalOpen(true)}
            className="btn btn-ghost"
          >
            <Settings size={20} />
          </button>,
        ],
        14
      );
    }

    return () => {
      removeActions("canvas-chat");
      removeActions("canvas-leave");
      removeActions("canvas-settings");
    };
  }, [isOwner, leaveLobby, navigate, lobbyId, setActions, removeActions]);

  return (
    <div className="flex justify-center items-center h-screen relative">
      {currentLobby ? (
        <>
          <EditCanvasModal
            isOpen={isModalOpen}
            initialColors={allowedColors}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveColors}
          />
          <Canvas name={currentLobby.name} />

          <div
            className={`fixed top-0 right-0 h-full w-120 border-l-1 border-base-300 z-50 transition-transform duration-300 flex flex-col ${
              isChatOpen ? "translate-x-0" : "translate-x-full"
            } p-3`}
          >
            <div className="flex-1 overflow-hidden">
              <Chat lobbyId={lobbyId} />
            </div>
          </div>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default CanvasPage;
