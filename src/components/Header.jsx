import { NavLink } from "react-router-dom";
import "./Header.css";

const languages = [
  {
    label: "Català",
    image: "/assets/flags/andorra.png",
    href: "?lang=ca",
  },
  {
    label: "Español",
    image: "/assets/flags/es.png",
    href: "?lang=es",
  },
  {
    label: "Français",
    image: "/assets/flags/fr.png",
    href: "?lang=fr",
  },
  {
    label: "English",
    image: "/assets/flags/uk.png",
    href: "?lang=en",
  },
];

const links = [
  { label: "Home", href: "/" },
  { label: "Visa Status Check", href: "/status" },
  { label: "Employment Status Check", href: "/employment-status" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Job Seeker", href: "/job-seeker" },
];

export default function Header() {
  return (
    <header className="site-header">
      {/* Banner */}
      <div className="site-banner">
        <img
          className="site-banner-image"
          src="/assets/banner1.jpg"
          alt="Andorra landscape"
        />

        <div className="banner-overlay" />

        {/* Language Flags */}
        <div className="language-flags">
          {languages.map((language) => (
            <a
              key={language.label}
              href={language.href}
              data-label={language.label}
              className="language-link"
              aria-label={language.label}
            >
              <img src={language.image} alt={language.label} />
            </a>
          ))}
        </div>

        {/* Banner Title */}
        <div className="banner-title">
          <span>Andorra Travel &amp; Visa Information</span>
          <small>Independent travel and entry information resource</small>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav" aria-label="Main navigation">
        <div className="nav-links">
          {links.slice(0, 5).map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-right">
          <a className="login-btn" href="/employer-login">
            Employer Login
          </a>

          <NavLink
            to="/job-seeker"
            className={({ isActive }) =>
              `nav-link job-seeker-link ${isActive ? "nav-active" : ""}`
            }
          >
            Job Seeker
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
