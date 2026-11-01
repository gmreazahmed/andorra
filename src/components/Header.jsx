import { NavLink } from "react-router-dom";
import "./Header.css";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Visa Status Check", href: "/visa-status-check" },
  { label: "FAQ", href: "#" },
  { label: "Contact Us", href: "#" },
];

function LanguageFlags() {
  return (
    <div className="portal-languages">
      {/* Andorra */}
      <span className="portal-language">
        <svg viewBox="0 0 24 16" aria-label="Andorra">
          <rect width="8" height="16" fill="#10069f" />
          <rect x="8" width="8" height="16" fill="#fedd00" />
          <rect x="16" width="8" height="16" fill="#d50032" />
        </svg>
      </span>

      {/* Spain */}
      <span className="portal-language">
        <svg viewBox="0 0 24 16" aria-label="Spain">
          <rect width="24" height="16" fill="#c60b1e" />
          <rect y="4" width="24" height="8" fill="#ffc400" />
        </svg>
      </span>

      {/* France */}
      <span className="portal-language">
        <svg viewBox="0 0 24 16" aria-label="France">
          <rect width="8" height="16" fill="#0055a4" />
          <rect x="8" width="8" height="16" fill="#ffffff" />
          <rect x="16" width="8" height="16" fill="#ef4135" />
        </svg>
      </span>

      {/* English */}
      <span className="portal-language language-active">
        <svg viewBox="0 0 24 16" aria-label="English">
          <rect width="24" height="16" fill="#012169" />
          <path d="M0 0 24 16M24 0 0 16" stroke="#ffffff" strokeWidth="3" />
          <path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" strokeWidth="1.4" />
          <path d="M12 0v16M0 8h24" stroke="#ffffff" strokeWidth="5" />
          <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="3" />
        </svg>
      </span>
    </div>
  );
}

function NavigationLink({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `portal-nav-link ${isActive ? "portal-nav-active" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  return (
    <header className="portal-header">
      {/* HEADER TOP */}
      <div className="portal-header-inner">
        {/* LEFT: COAT OF ARMS AND MINISTRY NAME */}
        <div className="portal-header-left">
          <img
            alt="Coat of arms of the Ministry of Foreign Affairs and European Integration of Andorra"
            width="816"
            height="816"
            loading="eager"
            className="portal-header-emblem"
            src="/assets/coat-of-arms.png"
          />

          <p className="portal-header-title">
            Ministry of Foreign Affairs and European Integration
            <br />
            of the Republic of Andorra
          </p>
        </div>

        {/* RIGHT: LANGUAGE AND EVISA LOGO */}
        <div className="portal-header-right">
          <LanguageFlags />

          <div className="portal-header-logo">
            <img
              alt="eVisa Andorra"
              width="1024"
              height="640"
              loading="eager"
              src="/assets/evisa-logo.png"
            />
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="portal-nav" aria-label="Main navigation">
        <div className="portal-nav-inner">
          {/* LEFT LINKS */}
          <div className="portal-nav-links">
            {mainLinks.map((link) => (
              <NavigationLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
              >
                {link.label}
              </NavigationLink>
            ))}
          </div>

          {/* RIGHT LINKS */}
          <div className="portal-nav-right">
            <NavigationLink to="/employer-login">Employer Login</NavigationLink>

            <NavigationLink to="/job-seeker">Job Seeker</NavigationLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
