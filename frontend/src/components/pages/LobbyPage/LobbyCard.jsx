import { Lock, Play } from "lucide-react";
import { useState } from "react";
import LobbyDetailsModal from "./LobbyDetailsModal";

export default function LobbyListItem({ lobby, handleJoinClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colorBarColors = Array.isArray(lobby.colors)
    ? lobby.colors.slice(0, 2)
    : [];
  const gradient = `linear-gradient(to right, ${colorBarColors.join(", ")})`;

  return (
    <>
      <LobbyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lobby={lobby}
        onJoin={handleJoinClick}
      />

      <div
        className="relative flex items-center w-full max-w-[1000px] rounded-lg overflow-hidden border border-base-300 p-3 cursor-pointer hover:bg-base-200 transition"
        onClick={() => setIsModalOpen(true)}
      >
        <div
          className="absolute inset-0 blur-xl opacity-30 z-0"
          style={{ background: gradient }}
        />

        {lobby.isPrivate && (
          <>
            <div className="relative z-10 flex items-center h-full pl-2 pr-2">
              <Lock size={20} />
            </div>
            <div className="divider divider-horizontal m-0" />
          </>
        )}

        <div className="relative z-10 flex flex-col gap-1 flex-grow min-w-0 pl-3">
          <div className="font-bold text-base truncate">{lobby.name}</div>
          <div className="text-xs uppercase font-semibold opacity-60 truncate">
            In Lobby: {lobby.playerCount} / {lobby.maxPlayers}
          </div>
        </div>

        <div className="relative z-10 text-xs opacity-60 whitespace-nowrap px-3 ">
          {lobby?.host || lobby?.createdBy?.name || "Unknown"}
        </div>

        <div className="divider divider-horizontal m-0" />

        <button
          className="relative z-10 btn btn-square btn-ghost border-0 shadow-none h-full rounded-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            handleJoinClick(lobby);
          }}
        >
          <Play size={20} />
        </button>
      </div>
    </>
  );
}
