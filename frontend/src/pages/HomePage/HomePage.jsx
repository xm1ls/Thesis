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
        {/* <StatusBar/> */}
      <div className="mb-20">
        <Canvas name="main" />
      </div>

      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <ColorPicker />
      </div> */}
      {/* <Chat /> */}
      {/* <LobbyDialog /> */}
    </div>
  );
};

export default HomePage;
