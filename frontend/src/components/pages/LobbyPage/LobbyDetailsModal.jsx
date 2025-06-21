export default function LobbyDetailsModal({ isOpen, onClose, lobby, onJoin }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-base-100 p-10 rounded-xl w-full max-w-md shadow-xl space-y-6 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Lobby Details</h2>
            <button
              onClick={onClose}
              className="btn btn-md btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>

          <div className="stats stats-vertical w-full shadow-none bg-transparent">
            <div className="stat">
              <div className="stat-title">Name</div>
              <div className="stat-value text-sm truncate">{lobby.name}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Privacy</div>
              <div className="stat-value text-sm">
                {lobby.isPrivate ? "Private" : "Public"}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Players</div>
              <div className="stat-value text-sm">
                {lobby.playerCount} / {lobby.maxPlayers}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Colors</div>
              <div className="stat-value flex gap-1 flex-wrap">
                {Array.isArray(lobby.colors) && lobby.colors.length > 0 ? (
                  lobby.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded border border-base-300"
                      style={{ backgroundColor: color }}
                    />
                  ))
                ) : (
                  <span className="text-sm">Any color</span>
                )}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Host</div>
              <div className="stat-value text-sm">
                {lobby?.host || lobby?.createdBy?.name || "Unknown"}
              </div>
            </div>
          </div>

          <button
            className="btn w-full"
            onClick={() => {
              onJoin();
              onClose();
            }}
          >
            Join
          </button>
        </div>
      </div>
    </>
  );
}
