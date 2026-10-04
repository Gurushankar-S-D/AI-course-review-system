import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  register
} from "../../services/authService";

import "../Login/Login.css";
import "./Register.css";


function Register() {

  const [username, setUsername] =
      useState("");

  const [email, setEmail] =
      useState("");

  const [password, setPassword] =
      useState("");

  const [showPassword, setShowPassword] =
      useState(false);

  const [darkMode, setDarkMode] =
      useState(false);

  const [loading, setLoading] =
      useState(false);

  const [error, setError] =
      useState("");

  const [success, setSuccess] =
      useState("");

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
  // PASSWORD STRENGTH
  // =========================

  const getPasswordStrength = () => {

    if (!password) {
      return {
        level: "",
        percent: 0
      };
    }

    let score = 0;

    if (password.length >= 6) {
      score++;
    }

    if (password.length >= 10) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }


    if (score <= 2) {

      return {
        level: "Weak",
        percent: 33
      };

    }

    if (score <= 4) {

      return {
        level: "Medium",
        percent: 66
      };

    }

    return {
      level: "Strong",
      percent: 100
    };
  };


  const strength =
      getPasswordStrength();


  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    const cleanUsername =
        username.trim();


    if (cleanUsername.length < 4) {

      setError(
          "Username must be at least 4 characters."
      );

      return;
    }


    if (
        !/^[a-zA-Z0-9_]+$/.test(
            cleanUsername
        )
    ) {

      setError(
          "Username can contain only letters, numbers and underscore."
      );

      return;
    }


    if (password.length < 6) {

      setError(
          "Password must be at least 6 characters."
      );

      return;
    }


    try {

      setLoading(true);

      await register(
          cleanUsername,
          email,
          password
      );

      setSuccess(
          "Account created successfully!"
      );


      setTimeout(() => {

        navigate("/");

      }, 1200);


    } catch (err) {

      console.error(
          "Registration error:",
          err?.response?.data || err
      );

      setError(
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Could not create account. Please check the details."
      );

    } finally {

      setLoading(false);
    }
  };


  return (

      <div className="auth-page">

        {/* THEME */}

        <button
            type="button"
            className="auth-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
        >
          {darkMode
              ? "☀️"
              : "🌙"}
        </button>


        <form
            className="auth-card register-card"
            onSubmit={handleRegister}
        >

          <div className="auth-brand">

            <span>✦</span>
            AI Course Review

          </div>


          <p className="auth-tagline">

            Share real feedback.
            Improve learning quality.

          </p>


          <h1>
            Create Account
          </h1>


          {/* USERNAME */}

          <div className="register-form-group">

            <label>
              Username
            </label>

            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) =>
                    setUsername(
                        e.target.value
                    )
                }
                autoComplete="username"
                required
            />

          </div>

          {/* EMAIL */}
          <div className="register-form-group">

            <label>
              Email
            </label>

            <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                autoComplete="email"
                required
            />

          </div>

          {/* PASSWORD */}

          <div className="register-form-group">

            <label>
              Password
            </label>

            <div className="password-field">

              <input
                  type={
                    showPassword
                        ? "text"
                        : "password"
                  }
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                      setPassword(
                          e.target.value
                      )
                  }
                  autoComplete="new-password"
                  required
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


            {/* PASSWORD STRENGTH */}

            {password && (

                <div className="password-strength">

                  <div className="strength-track">

                    <div
                        className={`strength-fill ${strength.level.toLowerCase()}`}
                        style={{
                          width:
                              `${strength.percent}%`
                        }}
                    />

                  </div>

                  <span
                      className={`strength-label ${strength.level.toLowerCase()}`}
                  >
                                {strength.level} password
                            </span>

                </div>

            )}

          </div>


          {/* ERROR */}

          {error && (

              <div className="register-error">
                {error}
              </div>

          )}


          {/* SUCCESS */}

          {success && (

              <div className="register-success">
                {success}
              </div>

          )}


          {/* REGISTER */}

          <button
              className="auth-btn"
              type="submit"
              disabled={loading}
          >

            {loading
                ? "Creating Account..."
                : "Register"}

          </button>


          <p className="auth-switch">

            Already have an account?{" "}

            <Link to="/">
              Login
            </Link>

          </p>

        </form>

      </div>
  );
}

export default Register;