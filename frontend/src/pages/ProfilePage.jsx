import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavbarStore } from "../store/useNavbarStore";
import ProfileCard from "../components/ProfileCard";
import { LogOut, SunMoon } from "lucide-react";

import { useThemeStore } from "../store/useThemeStore"

const ProfilePage = () => {
  const { logout, authUser } = useAuthStore();
  const { setActions, clearActions } = useNavbarStore();
  const { setTheme } = useThemeStore();

  const [userInfo, setUserInfo] = useState({
    name: "name",
    pixelPlaced: 20,
    isOnline: true,
    favouriteColor: "#000",
    currentLobby: "current Lobby",
    memberSince: "15.06.2025",
  });

  useEffect(() => {
    setActions([
      <button onClick={() => logout()} className="btn btn-ghost">
        <LogOut size={20} /> Leave
      </button>,
      <button onClick={() => setTheme()} className="btn btn-ghost">
        <SunMoon size={20} />
      </button>,
    ]);

    return () => clearActions();
  }, [setActions, clearActions]);

  return (
    <div className="flex justify-center items-center h-screen relative">
      <ProfileCard
        name={authUser.name}
        pixelPlaced={1234}
        favouriteColor="#3498db"
        isOnline={true}
        currentLobby="Lobby A"
        memberSince="2024-03-12"
      />
    </div>
  );
};

export default ProfilePage;
