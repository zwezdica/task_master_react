import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import logo from "../../src/assets/logo.png";
import "animate.css";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/tasks" className="nav-link">
                Tasks
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="nav-link register">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="nav-brand">
          <img src={logo} alt="Logo" className="nav-logo" />
          <span className="nav-title">Welcome to TaskMaster</span>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="animate__animated animate__fadeInDown">
            Organize your tasks
          </h1>
          <p className="subtitle animate__animated animate__fadeInUp animate__delay-1s">
            The best way to manage your projects
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title animate__animated animate__fadeIn">
          Why choose us?
        </h2>
        <div className="features-container">
          <div className="feature-card animate__animated animate__fadeInLeft animate__delay-1s">
            <div className="feature-icon">📝</div>
            <h3>Create</h3>
            <p>Add new tasks in just a few clicks</p>
          </div>
          <div className="feature-card animate__animated animate__fadeInUp animate__delay-1s">
            <div className="feature-icon">✅</div>
            <h3>Manage</h3>
            <p>Customize the status of your tasks</p>
          </div>
          <div className="feature-card animate__animated animate__fadeInRight animate__delay-1s">
            <div className="feature-icon">🔒</div>
            <h3>Security</h3>
            <p>Your data is in safe hands</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
