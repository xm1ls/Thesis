import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNavbarStore } from "../store/useNavbarStore";
// import LobbyMenu from "./LobbyMenu";
// import HomeMenu from "./HomeMenu";
import {
  House,
  Settings,
  UserRound,
  UsersRound,
  Grid2x2,
  Undo2,
} from "lucide-react";
import { lobbyStore } from "../store/lobbyStore";
import { useMemo } from "react";

const Navbar = () => {
  const location = useLocation();
  const isOnMainPage = location.pathname === "/";

  const { logout, authUser } = useAuthStore();
  const { currentLobbyId } = lobbyStore();

  const { actionGroups } = useNavbarStore();
  // const sortedGroups = [...actionGroups].sort(
  //   (a, b) => (a.order ?? 0) - (b.order ?? 0)
  // );

  // const preNavGroups = sortedGroups.filter((group) => group.priority < 10);
  // const postNavGroups = sortedGroups.filter((group) => group.priority >= 10);

  const sortedGroups = useMemo(() => {
    return Object.values(actionGroups).sort((a, b) => a.priority - b.priority);
  }, [actionGroups]);

  const preNavGroups = sortedGroups.filter((group) => group.priority < 10);
  const postNavGroups = sortedGroups.filter((group) => group.priority >= 10);

  const isOnCurrentLobbyPage = location.pathname === `/lobby/${currentLobbyId}`;
  return (
    <>
      {authUser && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-100 flex gap-4 items-center">
          {currentLobbyId && !isOnCurrentLobbyPage && (
            <ul className="menu menu-horizontal menu-sm bg-base-300 rounded-box">
              <li>
                <Link to={`/lobby/${currentLobbyId}`} className="btn btn-ghost">
                  <Undo2 size={20} />
                </Link>
              </li>
            </ul>
          )}

          {preNavGroups.map((group, groupIndex) => (
            <ul
              key={group.key || groupIndex}
              className="menu menu-horizontal menu-sm bg-base-300 rounded-box"
            >
              {group.actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          ))}

          <ul className="menu menu-horizontal menu-sm bg-base-300 rounded-box">
            <li>
              <Link to="/profile" className="btn btn-ghost">
                <UserRound size={20} /> Profile
              </Link>
            </li>
            <li>
              <Link to="/" className="btn btn-ghost">
                <House size={20} /> Home
              </Link>
            </li>
            <li>
              <Link to="/lobby" className="btn btn-ghost">
                <Grid2x2 size={20} /> Lobby
              </Link>
            </li>
          </ul>

          {postNavGroups.map((group, groupIndex) => (
            <ul
              key={group.key || groupIndex}
              className="menu menu-horizontal menu-sm bg-base-300 rounded-box"
            >
              {group.actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
