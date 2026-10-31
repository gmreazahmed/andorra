import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Status.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const NATIONALITIES = `
AFGHAN|ALBANIAN|ALGERIAN / ALGERIENNE|AMERICAN|ANDORRAN|ANGOLAN|ANGUILLAN|ANTIGUAN AND BARBUDAN|ARUBAN|ARGENTINO / ARGENTINA|ARMENIAN|AUSTRALIAN|AUSTRIAN|AZERBAIJANI|BAHAMIAN|BAHRAINI|BANGLADESHI|BARBADIAN|BELARUSIAN|BELGIAN|BELIZEAN|BENINESE / BENINOISE|BERMUDIAN|BHUTANESE|BOLIVIAN / BOLIVIANA|BOSNIAN AND HERZEGOVINIAN|BOTSWANAN|BRAZILIAN / BRASILEIRA|BRITISH|BRITISH VIRGIN ISLANDER|BRUNEIAN|BULGARIAN|BURKINABE|BURUNDIAN|CABO VERDEAN|CAMBODIAN|CAMEROONIAN|CANADIAN|CAYMANIAN|CENTRAL AFRICAN|CHADIAN|CHILEAN / CHILENA|CHINESE|COLOMBIAN / COLOMBIANA|COMORAN|CONGOLAIS / CONGOLAISE|CONGOLESE (DRC) / CONGOLAISE (DRC)|COOK ISLANDER|COSTA RICAN / COSTARRICENSE|CROATIAN|CUBAN / CUBANA|CURACAOAN|CYPRIOT|CZECH|DANISH|DJIBOUTIAN|DOMINICAN (DOMINICA)|DOMINICAN / DOMINICANA (REPUBLIC)|DUTCH|ECUADORIAN / ECUATORIANA|EGYPTIAN|EMIRATI / UAE NATIONAL|EQUATOGUINEAN / ECUATOGUINEANA|ERITREAN|ESTONIAN|ESWATINI|ETHIOPIAN|FAROESE|FIJIAN|FILIPINO / FILIPINA|FINNISH|FRENCH / FRANCAISE|FRENCH GUIANA NATIONAL|FRENCH POLYNESIAN|GABONESE|GAMBIAN|GEORGIAN|GERMAN|GHANAIAN|GIBRALTARIAN|GREEK|GREENLANDER|GRENADIAN|GUAMANIAN|GUATEMALAN / GUATEMALTECA|GUERNSEYMAN / GUERNSEYWOMAN|GUINEA BISSAU NATIONAL|GUINEEN / GUINEENNE|GUYANESE|HAITIAN|HONDURAN|HONG KONG SAR NATIONAL|HUNGARIAN|ICELANDIC|INDIAN|INDONESIAN|IRANIAN|IRAQI|IRISH|ISLE OF MAN NATIONAL|ISRAELI|ITALIAN / ITALIANA|IVOIRIEN / IVOIRIENNE|JAMAICAN|JAPANESE|JERSEY NATIONAL|JORDANIAN|KAZAKHSTANI|KENYAN|KIRIBATI NATIONAL|KOSOVAR|KUWAITI|KYRGYZ|LAO|LATVIAN|LEBANESE|LESOTHO NATIONAL|LIBERIAN|LIBYAN|LIECHTENSTEINER|LITHUANIAN|LUXEMBOURGISH|MACANESE|MALAGASY|MALAWIAN|MALAYSIAN|MALDIVIAN|MALIAN / MALIENNE|MALTESE|MAROCAIN / MAROCAINE|MARSHALLESE|MARTINICAN|MAURITANIAN / MAURITANIENNE|MAURITIAN|MAYOTTE NATIONAL|MEXICAN / MEXICANA|MICRONESIAN|MOLDOVAN|MONEGASQUE|MONGOLIAN|MONTENEGRIN|MONTSERRATIAN|MOROCCAN|MOZAMBICAN|MYANMAR|NAMIBIAN|NAURUAN|NEPALESE|NEW CALEDONIAN|NEW ZEALANDER|NICARAGUAN / NICARAGUENSE|NIGERIAN|NIUEAN|NORTH KOREAN|NORTH MACEDONIAN|NORWEGIAN|OMANI|PAKISTANI|PALAUAN|PALESTINIAN|PANAMANIAN / PANAMENA|PAPUA NEW GUINEAN|PARAGUAYAN / PARAGUAYA|PERUVIAN / PERUANA|POLISH|PORTUGUESE|PUERTO RICAN|QATARI|REUNIONESE|ROMANIAN|RUSSIAN|RWANDAN|SAINT KITTS AND NEVIS NATIONAL|SAINT LUCIAN|SAINT PIERRAIS / MIQUELONNAIS|SAINT VINCENTIAN|SAMOAN|SAN MARINESE|SAO TOMEAN|SAUDI / SAUDI ARABIAN|SENEGAIS / SENEGALAISE|SERBIAN|SEYCHELLOIS / SEYCHELLOISE|SIERRA LEONEAN|SINGAPOREAN|SLOVAK|SLOVENIAN|SOLOMON ISLANDER|SOMALI|SOUTH AFRICAN|SOUTH KOREAN|SOUTH SUDANESE|SPANISH / ESPANOLA|SRI LANKAN|SUDANESE|SURINAMESE|SWEDISH|SWISS|SYRIAN|TAIWANESE|TAJIK|TANZANIAN|TCHADIENNE|THAI|TIMORESE|TOGOLESE|TOKELAUAN|TONGAN|TRINIDADIAN AND TOBAGONIAN|TUNISIEN / TUNISIENNE|TURKISH|TURKMEN|TUVALUAN|UGANDAN|UKRAINIAN|URUGUAYAN / URUGUAYA|US VIRGIN ISLANDER|UZBEK|VANUATUAN|VATICAN NATIONAL|VENEZUELAN / VENEZOLANA|VIETNAMESE|YEMENI|ZAMBIAN|ZIMBABWEAN
`
  .trim()
  .split("|");

function generateCaptchaCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export default function Status() {
  const navigate = useNavigate();

  const [searchBy, setSearchBy] = useState("visa_grant_number");
  const [dob, setDob] = useState("");
  const [captchaCode, setCaptchaCode] = useState(generateCaptchaCode);
  const [captchaInput, setCaptchaInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const identifierLabel =
    searchBy === "visa_grant_number" ? "Visa Grant Number" : "Application ID";

  const identifierPlaceholder =
    searchBy === "visa_grant_number"
      ? "Enter Visa Grant Number"
      : "Enter Application ID";

  function refreshCaptcha() {
    setCaptchaCode(generateCaptchaCode());
    setCaptchaInput("");
  }

  // Automatically format DOB as YYYY-MM-DD
  function handleDobChange(event) {
    let value = event.target.value.replace(/\D/g, "").slice(0, 8);

    if (value.length > 6) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }

    setDob(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!API_URL) {
      setMessage("API configuration is missing. Please try again later.");
      return;
    }

    if (!isValidDate(dob)) {
      setMessage("Enter a valid Date of Birth in YYYY-MM-DD format.");
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setMessage("Incorrect verification code. Please try again.");
      refreshCaptcha();
      return;
    }

    const formData = new FormData(event.currentTarget);

    const payload = {
      travel_document_number: String(
        formData.get("travel_document_number") || "",
      )
        .trim()
        .toUpperCase(),

      date_of_birth: dob,

      nationality: String(formData.get("nationality") || ""),

      search_by: searchBy,

      id_value: String(formData.get("id_value") || "").trim(),
    };

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/visa/check-status.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid server response. Please try again.");
      }

      if (!response.ok || !data.success || !data.result) {
        throw new Error(data.message || "No matching application was found.");
      }

      navigate("/result", {
        state: { result: data.result },
      });
    } catch (error) {
      setMessage(error.message || "Unable to check application status.");

      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSearchBy("visa_grant_number");
    setDob("");
    setCaptchaInput("");
    setMessage("");
    setCaptchaCode(generateCaptchaCode());
  }

  return (
    <main className="status-page">
      <div className="main-container">
        {/* Instructions */}
        <section className="instructions-box">
          <h2>Instructions for Application Status Check</h2>

          <p>
            Enter your travel document details and application reference to
            check information returned by the authorized service.
          </p>

          <ul>
            <li>Enter your Travel Document Number using uppercase letters.</li>
            <li>Enter your Date of Birth in YYYY-MM-DD format.</li>
            <li>Select your Nationality from the dropdown list.</li>
            <li>Select Application ID or Visa Grant Number.</li>
            <li>Enter the displayed verification code before submitting.</li>
          </ul>

          <p className="status-notice">
            This is an independent information interface and is not an official
            government website. Results are displayed only when returned by an
            authorized backend.
          </p>
        </section>

        {/* Status Form */}
        <section className="form-box">
          <h2>Check Application Status</h2>

          <form onSubmit={handleSubmit} onReset={handleReset}>
            <label htmlFor="travel-document">Travel Document Number</label>

            <input
              id="travel-document"
              name="travel_document_number"
              type="text"
              maxLength={15}
              placeholder="Enter Travel Document Number"
              autoComplete="off"
              onChange={(event) => {
                event.target.value = event.target.value.toUpperCase();
              }}
              required
            />

            {/* Date of Birth */}
            <label htmlFor="dob">Date of Birth (YYYY-MM-DD)</label>

            <input
              id="dob"
              name="dob"
              type="text"
              value={dob}
              onChange={handleDobChange}
              maxLength={10}
              placeholder="YYYY-MM-DD"
              inputMode="numeric"
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
              title="Enter date in YYYY-MM-DD format"
              autoComplete="bday"
              required
            />

            {/* Nationality */}
            <label htmlFor="nationality">Nationality</label>

            <select
              id="nationality"
              name="nationality"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select Nationality
              </option>

              {NATIONALITIES.map((nationality) => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>

            {/* Search By */}
            <label htmlFor="search-by">Search By</label>

            <select
              id="search-by"
              name="search_by"
              value={searchBy}
              onChange={(event) => setSearchBy(event.target.value)}
            >
              <option value="visa_grant_number">Visa Grant Number</option>

              <option value="application_id">Application ID</option>
            </select>

            <label htmlFor="id-value">{identifierLabel}</label>

            <input
              id="id-value"
              name="id_value"
              type="text"
              placeholder={identifierPlaceholder}
              autoComplete="off"
              required
            />

            {/* Captcha */}
            <label htmlFor="captcha">Verification Code</label>

            <div className="captcha-box">
              <div
                className="captcha-display"
                aria-label="Displayed verification code"
              >
                <div className="captcha-noise" />

                {captchaCode.split("").map((char, index) => (
                  <span
                    key={`${captchaCode}-${index}`}
                    className="captcha-char"
                    style={{
                      transform: `rotate(${
                        (index % 2 === 0 ? -1 : 1) * (5 + index * 2)
                      }deg)`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="refresh"
                onClick={refreshCaptcha}
                disabled={loading}
              >
                Refresh
              </button>
            </div>

            <input
              id="captcha"
              name="captcha"
              type="text"
              value={captchaInput}
              onChange={(event) => setCaptchaInput(event.target.value)}
              placeholder="Enter Captcha"
              autoComplete="off"
              maxLength={6}
              required
            />

            {/* Actions */}
            <div className="status-actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Checking..." : "Check"}
              </button>

              <button className="btn reset-btn" type="reset" disabled={loading}>
                Reset
              </button>
            </div>

            {message && (
              <p className="status-message" role="alert">
                {message}
              </p>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
