import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { login } from "../../services/authService";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // =========================
    // LOAD THEME
    // =========================

    useEffect(() => {
        const savedTheme =
            localStorage.getItem("theme");

        const isDark =
            savedTheme === "dark";

        setDarkMode(isDark);

        document.body.classList.toggle(
            "dark",
            isDark
        );

        return () => {
            // Do not remove dark mode here.
            // Other pages use the same body.dark theme.
        };
    }, []);


    // =========================
    // TOGGLE THEME
    // =========================

    const toggleTheme = () => {

        const newMode = !darkMode;

        setDarkMode(newMode);

        document.body.classList.toggle(
            "dark",
            newMode
        );

        localStorage.setItem(
            "theme",
            newMode ? "dark" : "light"
        );
    };


    // =========================
    // LOGIN
    // =========================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!username.trim()) {
            setError(
                "Please enter your username."
            );
            return;
        }

        if (!password) {
            setError(
                "Please enter your password."
            );
            return;
        }

        try {

            setLoading(true);

            const response = await login(
                username.trim(),
                password
            );

            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response)
            );

            navigate("/dashboard");

        } catch (err) {

            console.error(
                "Login error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Invalid username or password."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="login-container">

            {/* THEME BUTTON */}

            <button
                type="button"
                className="auth-theme-btn"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
            >
                {darkMode ? "☀️" : "🌙"}
            </button>


            <form
                className="login-card"
                onSubmit={handleLogin}
            >

                <div className="login-brand">
                    <span>✦</span>
                    AI Course Review
                </div>

                <p className="login-tagline">
                    Share real feedback. Improve learning quality.
                </p>

                <h1>
                    Welcome Back
                </h1>


                {/* USERNAME */}

                <div className="form-group">

                    <label htmlFor="username">
                        Username
                    </label>

                    <input
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        autoComplete="username"
                    />

                </div>


                {/* PASSWORD */}

                <div className="form-group">

                    <label htmlFor="login-password">
                        Password
                    </label>

                    <div className="password-field">

                        <input
                            id="login-password"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword
                                ? "🙈"
                                : "👁️"}
                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}


                {/* LOGIN */}

                <button
                    className="login-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Signing in..."
                        : "Login"}
                </button>


                <div className="register-text">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </div>

            </form>

        </div>
    );
}

export default Login;