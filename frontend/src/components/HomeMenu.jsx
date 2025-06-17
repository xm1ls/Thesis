import { Link } from "react-router-dom";
import { Pipette, Eraser, Paintbrush } from "lucide-react";

const HomeMenu = () => {
  return (
    <ul className="menu menu-horizontal menu-sm bg-base-300 rounded-box">
      <li>
        <Link to="/" className="btn btn-ghost">
          <Eraser size={20} /> 
        </Link>
      </li>
      <li>
        <Link to="/" className="btn btn-ghost">
          <Paintbrush size={20} /> 
        </Link>
      </li>
      <li>
        <Link to="/" className="btn btn-ghost">
          <Pipette size={20} /> 
        </Link>
      </li>
    </ul>
  );
};

export default HomeMenu;
