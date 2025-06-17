import { useEffect, useState } from "react";

import { Routes, Route, Navigate, Router } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";
import { useThemeStore } from "./store/useThemeStore.js"

import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import HomePageOld from "./pages/HomePageOld.jsx";
import LobbyPage from "./pages/LobbyPage/LobbyPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CanvasPage from "./pages/CanvasPage.jsx";
import Navbar from "./components/Navbar.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div data-theme={theme} className="flex flex-col min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/lobby/:lobbyId" element={<CanvasPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="canvas/:canvasName"
          element={!authUser ? <SignUpPage /> : <CanvasPage />}
        />

        <Route
          path="/settings"
          element={authUser ? <SettingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route
          path="*"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={true} />
    </div>
  );
}

export default App;
