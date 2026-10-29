import { useEffect, useState } from "react";
import "./Home.css";

const base = "https://evisagovt.ad/";

const slides = [
  {
    src: "assets/img/andorra/show/slide1.jpg",
    caption: "The Capital City — Andorra la Vella, Andorra.",
  },
  {
    src: "assets/img/andorra/show/slide2.jpg",
    caption: "Pont de París — A Modern Bridge in Andorra la Vella.",
  },
  {
    src: "assets/img/andorra/show/slide3.jpg",
    caption: "Headquarters of Andbank — Established in 1930, Andorra.",
  },
  {
    src: "assets/img/andorra/show/slide4.jpg",
    caption: "Aerial View — Andorra la Vella, the Capital City.",
  },
  {
    src: "assets/img/andorra/show/slide5.jpg",
    caption: "Pyrenean Skiing — Winter Adventures in Andorra.",
  },
  {
    src: "assets/img/andorra/show/slide6.jpg",
    caption: "The Pyrenees — A Paradise for Ski Enthusiasts.",
  },
  {
    src: "assets/img/andorra/show/slide7.jpg",
    caption: "Church of Sant Esteve — Historic Romanesque Landmark.",
  },
  {
    src: "assets/img/andorra/show/slide8.jpg",
    caption: "Tête (Head) — Sculpture by Jaume Plensa.",
  },
  {
    src: "assets/img/andorra/show/slide9.jpg",
    caption: "Street Café — Ordino Village, Andorra.",
  },
  {
    src: "assets/img/andorra/show/slide10.jpg",
    caption: "Mirador Roc del Quer — Scenic Viewpoint in Canillo.",
  },
  {
    src: "assets/img/andorra/show/slide11.jpg",
    caption: "La Noblesse du Temps by Salvador Dalí.",
  },
  {
    src: "assets/img/andorra/show/slide12.jpg",
    caption: "Via Ferrata Canal del Grau — Canillo.",
  },
  {
    src: "assets/img/andorra/show/slide13.jpg",
    caption: "Vall d’Incles — Mountain Valley in Canillo.",
  },
  {
    src: "assets/img/andorra/show/slide14.jpg",
    caption: "New Parliament of Andorra — Nou Consell General.",
  },
  {
    src: "assets/img/andorra/show/slide15.jpg",
    caption: "Andorra Traditional Clothing.",
  },
];

function Slideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  return (
    <div className="home-slideshow">
      <img
        key={activeSlide.src}
        src={`${base}${activeSlide.src}`}
        alt={activeSlide.caption}
      />

      <div className="slide-caption">{activeSlide.caption}</div>

      <div className="slide-controls">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            className={index === activeIndex ? "slide-dot active" : "slide-dot"}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show slide ${index + 1}`}
            aria-pressed={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}

function ContentSection({
  title,
  image,
  imageAlt,
  children,
  reverse = false,
  muted = false,
}) {
  const classes = ["content-section", muted ? "content-section-muted" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <div className={`content-grid ${reverse ? "content-grid-reverse" : ""}`}>
        <div className="content-copy">
          <h2>{title}</h2>
          {children}
        </div>

        <div className="content-image-wrap">
          <img
            className="content-image"
            src={`${base}${image}`}
            alt={imageAlt}
            loading="lazy"
          />

          <p className="image-caption">{imageAlt}</p>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-copy">
          <h1>Welcome to Andorra</h1>

          <p>
            Explore travel information about the Principality of Andorra,
            including its culture, economy, landmarks, and general visa and
            entry information. Visa requirements can vary by nationality and
            travel purpose, so verify the latest rules with official sources
            before making travel plans.
          </p>
        </div>

        <Slideshow />
      </section>

      {/* About Andorra */}
      <ContentSection
        title="About Andorra"
        image="assets/img/andorra/about.png"
        imageAlt="New Parliament of Andorra — Nou Consell General."
      >
        <p>
          Andorra is a sovereign microstate nestled in the eastern Pyrenees
          between France and Spain. Founded in 1278 under a unique
          co-principality system, it remains one of the world’s oldest states.
          Catalan is the official language and the euro (€) is its currency.
          Andorra’s rich culture reflects Catalan traditions, Romanesque
          churches, and vibrant festivals. Tourism attracts visitors for skiing,
          hiking, and duty-free shopping.
        </p>
      </ContentSection>

      {/* Economy */}
      <ContentSection
        title="Economy of Andorra"
        image="assets/img/andorra/economy.jpg"
        imageAlt="Headquarters of Andbank — Andorra."
        reverse
        muted
      >
        <p>
          <strong>Tourism:</strong> An important part of Andorra’s economy,
          drawing visitors for skiing, mountain scenery, and cultural
          experiences.
        </p>

        <p>
          <strong>Finance:</strong> The financial sector plays a role in the
          country’s banking and investment environment.
        </p>

        <p>
          <strong>Retail:</strong> Andorra is known as a shopping destination
          for visitors from France and Spain.
        </p>

        <p>
          <strong>Agriculture:</strong> Small-scale agriculture preserves local
          heritage through tobacco cultivation and livestock farming.
        </p>

        <p>
          <strong>Trade:</strong> The country imports many goods from
          neighboring countries and exports selected local products.
        </p>
      </ContentSection>

      {/* Culture */}
      <ContentSection
        title="Culture of Andorra"
        image="assets/img/andorra/culture.jpg"
        imageAlt="Andorran traditional clothing."
      >
        <p>
          Andorra’s culture is deeply rooted in its{" "}
          <strong>Catalan heritage</strong>, sharing traditions, language, and
          customs with neighboring Catalonia. Catalan is the official language,
          while Spanish and French are also widely spoken.
        </p>

        <p>
          Known for its <strong>Romanesque architecture</strong>, Andorra
          preserves medieval stone churches and artworks. Cultural life includes
          festivals such as Our Lady of Meritxell Day.
        </p>

        <p>
          Modern Andorra also embraces international cultural exchange through
          art, music, and sporting events that balance tradition with
          contemporary life.
        </p>
      </ContentSection>

      {/* Entry Information */}
      <section className="visa-note">
        <h2>Visa and Entry Information</h2>

        <p>
          This website is an independent information resource and does not
          process visa applications. Confirm entry requirements, permitted stay,
          and application procedures with the relevant official authorities or
          consular service for your nationality.
        </p>
      </section>
    </div>
  );
}
