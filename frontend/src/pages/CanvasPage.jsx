import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lobbyStore } from "../store/lobbyStore";
import { useCanvasStore } from "../store/useCanvasStore";
import { useAuthStore } from "../store/authStore";
import Canvas from "../components/Canvas";

const CanvasPage = () => {
  const { lobbyId } = useParams();
  const { leaveLobby, currentLobby, getLobbyById } = lobbyStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentLobby) {
      getLobbyById(lobbyId);
    }
  }, [lobbyId, currentLobby, getLobbyById]);

  const isOwner = currentLobby?.createdBy === authUser?._id;

  return (
    <div className="pt-20 px-4">
      <div className="mb-4">
        <span>Canvas: {lobbyId}</span>
        <button
          className="btn ml-4"
          onClick={() => leaveLobby(lobbyId, navigate)}
        >
          Leave
        </button>
      </div>

      {currentLobby ? (
        <>
          {isOwner && <div>settings</div>}
          <Canvas name={currentLobby.name} />
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
};

export default CanvasPage;
