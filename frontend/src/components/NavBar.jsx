import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(location.pathname === "/ai-tutor" ? "tools" : "home");
      return;
    }

    const sectionIds = ["home", "about", "contactus"];

    const updateActiveSection = () => {
      const navOffset = 120;
      let currentSection = "home";

      for (const sectionId of sectionIds) {
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= navOffset) {
          currentSection = sectionId;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/", sectionId: "home" },
    { name: "About", path: "#about", sectionId: "about" }, 
    { name: "Tools", path: "/ai-tutor", sectionId: "tools" },
    { name: "Contact", path: "#contactus", sectionId: "contactus" },
  ];

  // A helper to scroll to sections if it's a hash link, or navigate if it's a route
  const handleNavigation = (e, path) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      // If we are not on the home page, go to home first then scroll
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(path.replace("#", ""));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } else {
        const el = document.getElementById(path.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="learncraft-navbar" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "80px",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 5%",
      transition: "all 0.3s ease",
      background: scrolled ? "rgba(10, 10, 20, 0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
    }}>
      {/* Logo Area */}
      <NavLink to="/" className="learncraft-navbar-brand" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16" style={{ filter: 'drop-shadow(0 0 6px #8b5cf6)' }}>
          <path d="M0 0h16v16H0z" fill="none" />
          <path fill="#8b5cf6" d="m6 10l2-1l7-7l-1-1l-7 7zm-1.48 3.548c-.494-1.043-1.026-1.574-2.069-2.069l1.548-4.262l2-1.217l6-6h-3l-6 6l-3 10l10-3l6-6V4l-6 6l-1.217 2z" />
        </svg>
        <span style={{
          color: "white",
          fontWeight: 800,
          fontSize: "22px",
          letterSpacing: "0.5px",
          fontFamily: "Poppins, sans-serif",
        }}>
          LearnCraft
        </span>
      </NavLink>

      {/* Center Links */}
      <div className="learncraft-nav-links" style={{ display: "flex", alignItems: "center", gap: "35px" }}>
        {navLinks.map((link, idx) => {
          const isActive = link.sectionId === "tools"
            ? location.pathname === "/ai-tutor"
            : location.pathname === "/" && activeSection === link.sectionId;
          return (
            <NavLink
              key={idx}
              to={link.path}
              onClick={(e) => handleNavigation(e, link.path)}
              style={{
                color: isActive ? "var(--primary)" : "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                position: "relative",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
              onMouseLeave={(e) => e.target.style.color = isActive ? "var(--primary)" : "var(--text-secondary)"}
            >
              {link.name}
              {/* Active Underscore Effect */}
              {isActive && (
                <div style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: "0",
                  width: "100%",
                  height: "2px",
                  background: "var(--primary)",
                  borderRadius: "2px",
                  boxShadow: "0 0 8px var(--primary)"
                }} />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Auth Area */}
      <div className="learncraft-nav-auth" style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <NavLink 
          to="/signup" 
          style={{
            color: "var(--text-primary)",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily: "Poppins, sans-serif",
            position: "relative",
          }}
          onMouseEnter={(e) => e.currentTarget.children[0].style.width = "100%"}
          onMouseLeave={(e) => e.currentTarget.children[0].style.width = "0%"}
        >
          Sign Up
          {/* Hover Underscore Effect */}
          <div style={{
            position: "absolute",
            bottom: "-4px",
            left: "0",
            width: "0%",
            height: "2px",
            background: "var(--primary)",
            transition: "width 0.3s ease",
            borderRadius: "2px"
          }} />
        </NavLink>
        
        <button 
          onClick={() => navigate('/login')}
          style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            padding: "10px 28px",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "15px",
            fontFamily: "Poppins, sans-serif",
            cursor: "pointer",
            boxShadow: "var(--shadow-glow)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(139, 92, 246, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-glow)";
          }}
        >
          Login
        </button>
      </div>

      <button
        type="button"
        className="learncraft-mobile-toggle"
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="learncraft-mobile-overlay"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="learncraft-mobile-drawer">
            <div className="learncraft-mobile-drawer-header">
              <div>
                <div className="learncraft-mobile-drawer-title">LearnCraft</div>
                <div className="learncraft-mobile-drawer-subtitle">Mobile navigation</div>
              </div>
              <button type="button" className="learncraft-mobile-close" onClick={() => setMobileMenuOpen(false)}>
                Close
              </button>
            </div>

            <div className="learncraft-mobile-links">
              {navLinks.map((link, idx) => {
                const isActive = link.sectionId === "tools"
                  ? location.pathname === "/ai-tutor"
                  : location.pathname === "/" && activeSection === link.sectionId;

                return (
                  <NavLink
                    key={`mobile-${idx}`}
                    to={link.path}
                    onClick={(e) => {
                      handleNavigation(e, link.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`learncraft-mobile-link ${isActive ? "active" : ""}`}
                  >
                    {link.name}
                  </NavLink>
                );
              })}
            </div>

            <div className="learncraft-mobile-actions">
              <NavLink to="/signup" className="learncraft-mobile-secondary" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </NavLink>
              <button
                type="button"
                className="learncraft-mobile-primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
              >
                Login
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default NavBar;