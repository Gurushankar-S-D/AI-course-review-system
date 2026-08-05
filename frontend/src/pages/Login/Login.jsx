import { useState } from "react";
import "./Login.css";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await login(username, password);

            // Save JWT and user information
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response));

            alert("Login Successful!");

            console.log(response);

            // We'll replace this with React Router navigation later
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Invalid username or password");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h1>AI Course Review System</h1>

                <p>Sign in to continue</p>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    className="login-btn"
                    onClick={handleLogin}
                >
                    Login
                </button>

                <div className="register-text">
                    Don't have an account? <a href="#">Register</a>
                </div>

            </div>
        </div>
    );
}

export default Login;