import { useState } from "react";

const API_URL = "http://10.146.163.42:5000/api";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isRegister && !name.trim()) {
      setMessage("Please enter your name");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage(
        isRegister
          ? `Account created successfully! Welcome, ${data.user.name}`
          : `Welcome back, ${data.user.name}!`
      );

      setName("");
      setEmail("");
      setPassword("");

      // Go to dashboard
      onLogin(data.user);
    } catch (error) {
      console.error(error);
      setMessage(
        "Cannot connect to server. Please check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-brand">
          <div className="brand-content">

            <div className="logo">✓</div>

            <h1>MyTask</h1>

            <p>
              Organize your work.
              <br />
              Achieve your goals.
            </p>

            <div className="brand-feature">
              <span>✓</span>

              <div>
                <strong>Stay organized</strong>
                <p>Keep all your tasks in one place.</p>
              </div>
            </div>

            <div className="brand-feature">
              <span>✓</span>

              <div>
                <strong>Track your progress</strong>
                <p>Know exactly what needs to be done.</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-section">
          <div className="login-card">

            <div className="mobile-logo">
              <div className="logo">✓</div>
              <span>MyTask</span>
            </div>

            <div className="login-header">

              <span className="welcome">
                {isRegister ? "GET STARTED" : "WELCOME BACK"}
              </span>

              <h2>
                {isRegister
                  ? "Create your account"
                  : "Sign in to your account"}
              </h2>

              <p>
                {isRegister
                  ? "Create an account and start organizing your tasks."
                  : "Enter your details to continue managing your tasks."}
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              {isRegister && (
                <div className="input-group">

                  <label htmlFor="name">
                    Full name
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      👤
                    </span>

                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                    />

                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div className="input-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div className="input-group">

                <div className="password-label">

                  <label htmlFor="password">
                    Password
                  </label>

                  {!isRegister && (
                    <button
                      type="button"
                      className="forgot-button"
                      onClick={() =>
                        setMessage(
                          "Password reset will be added soon."
                        )
                      }
                    >
                      Forgot password?
                    </button>
                  )}

                </div>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>
              </div>

              {/* MESSAGE */}
              {message && (
                <div
                  className={
                    message.startsWith("Welcome") ||
                    message.startsWith("Account created")
                      ? "message success"
                      : "message error"
                  }
                >
                  {message}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? isRegister
                    ? "Creating account..."
                    : "Signing in..."
                  : isRegister
                  ? "Create account"
                  : "Sign in"}

                {!loading && <span>→</span>}
              </button>

            </form>

            {/* SWITCH */}
            <div className="switch-auth">

              <span>
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>

              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setMessage("");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
              >
                {isRegister
                  ? "Sign in"
                  : "Create account"}
              </button>

            </div>

            {/* SECURITY */}
            <div className="security-note">

              <span>🔐</span>

              <p>
                Your information is securely protected.
              </p>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;