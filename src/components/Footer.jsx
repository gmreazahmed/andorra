import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} Andorra Travel &amp; Visa Information
        {" | "}
        <a href="/privacy">Privacy Policy</a>
        {" | "}
        <a href="/terms">Terms of Service</a>
        {" | "}
        <a href="/contact">Contact Us</a>
      </p>

      <small>
        Independent information resource. Not affiliated with or endorsed by the
        Government of Andorra. Check official sources for current entry and visa
        requirements.
      </small>
    </footer>
  );
}
