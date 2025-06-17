import React from "react";

const ProfileCard = ({
  name,
  pixelPlaced,
  favouriteColor,
  isOnline,
  currentLobby,
  memberSince,
}) => {
  return (
    <div className="card w-full max-w-lg bg-base-100 border border-base-300">
      <div className="stats stats-vertical">
        <div className="stat">
          <div className="stat-title">Name</div>
          <div className="stat-value">{name}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Favourite Color</div>
          <div className="stat-value" style={{ color: favouriteColor }}>
            {favouriteColor}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Leaderboard</div>
          <div className="stat-value">#{1}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Pixel Placed</div>
          <div className="stat-value">{pixelPlaced}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
