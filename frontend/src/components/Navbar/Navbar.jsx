import "./Navbar.css";

function Navbar({ username, onLogout }) {
    return (
        <nav className="navbar">
            <h2>AI Course Review System</h2>

            <div className="nav-right">
                <span>Welcome, {username}</span>

                <button onClick={onLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;