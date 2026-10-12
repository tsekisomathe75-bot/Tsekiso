import { NavLink } from "react-router-dom";
import Brand from "./Brand";
import Icon from "./Icon";

// Left side menu (sidebar)
export default function Navbar({ currentUser }) {
  return (
    <aside className="sidebar">
      <h1><Brand /></h1>
      <nav>
        <NavLink to="/" end><Icon name="dashboard" /> Dashboard</NavLink>
        <NavLink to="/books"><Icon name="books" /> Books</NavLink>
        <NavLink to="/transactions"><Icon name="transactions" /> Transactions</NavLink>
        {currentUser.role === "admin" && <NavLink to="/users"><Icon name="users" /> Users</NavLink>}
        <NavLink to="/profile"><Icon name="profile" /> Profile</NavLink>
      </nav>
    </aside>
  );
}
