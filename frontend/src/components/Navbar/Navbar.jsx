import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.clear();
        navigate("/");

    };
    const { darkMode, setDarkMode } = useTheme();

    return (

        <header className="navbar">

            <div className="logo">
                AI Course Review
            </div>

            <div className="nav-links">

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/courses">
                    Courses
                </NavLink>

                <NavLink to="/submit-review">
                    Submit
                </NavLink>

                <NavLink to="/browse-reviews">
                    Browse
                </NavLink>

                <NavLink to="/ai-analysis">
                    AI Analysis
                </NavLink>

                {user.role === "ROLE_ADMIN" && (

                    <NavLink to="/admin">
                        Admin
                    </NavLink>

                )}

            </div>

            <div className="right-section">

                <span className="username">
                    {user?.username}
                </span>
                <button
                    className="theme-btn"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
                </button>
                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </header>

    );

}

export default Navbar;