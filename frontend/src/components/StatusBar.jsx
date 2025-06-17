import { useEffect, useState } from "react";
import { useCanvasStore } from "../store/useCanvasStore";

const StatusBar = () => {
  const { playerCount } = useCanvasStore();

    useEffect(() => {
        console.log("Player count changed:", playerCount);
    }, [playerCount])

  return (
    <div className="w-full text-black fixed top-4 left-4">
      Players in Lobby: {playerCount}
    </div>
  );
};

export default StatusBar;
