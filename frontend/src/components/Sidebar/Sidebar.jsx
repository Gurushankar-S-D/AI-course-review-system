import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    return (

        <div className="sidebar">

            <h2>AI Review</h2>

            <NavLink to="/dashboard">🏠 Dashboard</NavLink>

            <NavLink to="/courses">📚 Courses</NavLink>

            <NavLink to="/submit-review">⭐ Submit Review</NavLink>

            <NavLink to="/browse-reviews">💬 Browse Reviews</NavLink>

            <NavLink to="/profile">👤 Profile</NavLink>

            <NavLink to="/">🚪 Logout</NavLink>

        </div>

    );

}

export default Sidebar;