import "./Header.css";

const asset = (path) => `https://evisagovt.ad/${path}`;

const languages = [
  {
    label: "Català",
    image: "assets/img/flags/andorra.png",
    href: "?lang=ca",
  },
  {
    label: "Español",
    image: "assets/img/flags/es.png",
    href: "?lang=es",
  },
  {
    label: "Français",
    image: "assets/img/flags/fr.png",
    href: "?lang=fr",
  },
  {
    label: "English",
    image: "assets/img/flags/uk.png",
    href: "?lang=en",
    active: true,
  },
];

const links = [
  { label: "Home", href: "/" },
  { label: "Visa Status Check", href: "/status" },
  {
    label: "Employment Status Check",
    href: "/employment-status",
  },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Job Seeker", href: "/job-seeker" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-banner">
        <img
          className="site-banner-image"
          src={asset("assets/banner1.jpg")}
          alt="Andorra landscape"
        />

        <div className="banner-overlay" />

        <div className="language-flags">
          {languages.map((language) => (
            <a
              key={language.label}
              href={language.href}
              data-label={language.label}
              className={
                language.active ? "language-link active" : "language-link"
              }
              aria-label={language.label}
            >
              <img src={asset(language.image)} alt="" />
            </a>
          ))}
        </div>

        <div className="banner-title">
          <span>Andorra Travel &amp; Visa Information</span>
          <small>Travel and entry information resource</small>
        </div>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        <div className="nav-links">
          {links.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={index === 0 ? "nav-link nav-active" : "nav-link"}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a className="login-btn" href="/employer-login">
          Employer Login
        </a>
      </nav>
    </header>
  );
}
