import { useState } from "react";

import Canvas from "../../components/Canvas";
import ColorPicker from "../../components/ColorPicker";
import Chat from "../../components/Chat";
import StatusBar from "../../components/StatusBar";
import LobbyDialog from "../../components/LobbyDialog";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="flex justify-center items-center h-screen relative">
      <div className="mb-20">
        <Canvas name="main" />
      </div>
    </div>
  );
};

export default HomePage;
