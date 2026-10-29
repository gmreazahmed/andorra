import { useState } from "react";
import "./Status.css";

const nationalities = [
  "AFGHAN",
  "ALBANIAN",
  "ALGERIAN / ALGERIENNE",
  "AMERICAN",
  "ANDORRAN",
  "ANGOLAN",
  "ANGUILLAN",
  "ANTIGUAN AND BARBUDAN",
  "ARUBAN",
  "ARGENTINO / ARGENTINA",
  "ARMENIAN",
  "AUSTRALIAN",
  "AUSTRIAN",
  "AZERBAIJANI",
  "BAHAMIAN",
  "BAHRAINI",
  "BANGLADESHI",
  "BARBADIAN",
  "BELARUSIAN",
  "BELGIAN",
  "BELIZEAN",
  "BENINESE / BENINOISE",
  "BERMUDIAN",
  "BHUTANESE",
  "BOLIVIAN / BOLIVIANA",
  "BOSNIAN AND HERZEGOVINIAN",
  "BOTSWANAN",
  "BRAZILIAN / BRASILEIRA",
  "BRITISH",
  "BRITISH VIRGIN ISLANDER",
  "BRUNEIAN",
  "BULGARIAN",
  "BURKINABE",
  "BURUNDIAN",
  "CABO VERDEAN",
  "CAMBODIAN",
  "CAMEROONIAN",
  "CANADIAN",
  "CAYMANIAN",
  "CENTRAL AFRICAN",
  "CHADIAN",
  "CHILEAN / CHILENA",
  "CHINESE",
  "COLOMBIAN / COLOMBIANA",
  "COMORAN",
  "CONGOLAIS / CONGOLAISE",
  "CONGOLESE (DRC) / CONGOLAISE (DRC)",
  "COOK ISLANDER",
  "COSTA RICAN / COSTARRICENSE",
  "CROATIAN",
  "CUBAN / CUBANA",
  "CURACAOAN",
  "CYPRIOT",
  "CZECH",
  "DANISH",
  "DJIBOUTIAN",
  "DOMINICAN (DOMINICA)",
  "DOMINICAN / DOMINICANA (REPUBLIC)",
  "DUTCH",
  "ECUADORIAN / ECUATORIANA",
  "EGYPTIAN",
  "EMIRATI / UAE NATIONAL",
  "EQUATOGUINEAN / ECUATOGUINEANA",
  "ERITREAN",
  "ESTONIAN",
  "ESWATINI",
  "ETHIOPIAN",
  "FAROESE",
  "FIJIAN",
  "FILIPINO / FILIPINA",
  "FINNISH",
  "FRENCH / FRANCAISE",
  "FRENCH GUIANA NATIONAL",
  "FRENCH POLYNESIAN",
  "GABONESE",
  "GAMBIAN",
  "GEORGIAN",
  "GERMAN",
  "GHANAIAN",
  "GIBRALTARIAN",
  "GREEK",
  "GREENLANDER",
  "GRENADIAN",
  "GUAMANIAN",
  "GUATEMALAN / GUATEMALTECA",
  "GUERNSEYMAN / GUERNSEYWOMAN",
  "GUINEA BISSAU NATIONAL",
  "GUINEEN / GUINEENNE",
  "GUYANESE",
  "HAITIAN",
  "HONDURAN",
  "HONG KONG SAR NATIONAL",
  "HUNGARIAN",
  "ICELANDIC",
  "INDIAN",
  "INDONESIAN",
  "IRANIAN",
  "IRAQI",
  "IRISH",
  "ISLE OF MAN NATIONAL",
  "ISRAELI",
  "ITALIAN / ITALIANA",
  "IVOIRIEN / IVOIRIENNE",
  "JAMAICAN",
  "JAPANESE",
  "JERSEY NATIONAL",
  "JORDANIAN",
  "KAZAKHSTANI",
  "KENYAN",
  "KIRIBATI NATIONAL",
  "KOSOVAR",
  "KUWAITI",
  "KYRGYZ",
  "LAO",
  "LATVIAN",
  "LEBANESE",
  "LESOTHO NATIONAL",
  "LIBERIAN",
  "LIBYAN",
  "LIECHTENSTEINER",
  "LITHUANIAN",
  "LUXEMBOURGISH",
  "MACANESE",
  "MALAGASY",
  "MALAWIAN",
  "MALAYSIAN",
  "MALDIVIAN",
  "MALIAN / MALIENNE",
  "MALTESE",
  "MAROCAIN / MAROCAINE",
  "MARSHALLESE",
  "MARTINICAN",
  "MAURITANIAN / MAURITANIENNE",
  "MAURITIAN",
  "MAYOTTE NATIONAL",
  "MEXICAN / MEXICANA",
  "MICRONESIAN",
  "MOLDOVAN",
  "MONEGASQUE",
  "MONGOLIAN",
  "MONTENEGRIN",
  "MONTSERRATIAN",
  "MOROCCAN",
  "MOZAMBICAN",
  "MYANMAR",
  "NAMIBIAN",
  "NAURUAN",
  "NEPALESE",
  "NEW CALEDONIAN",
  "NEW ZEALANDER",
  "NICARAGUAN / NICARAGUENSE",
  "NIGERIAN",
  "NIUEAN",
  "NORTH KOREAN",
  "NORTH MACEDONIAN",
  "NORWEGIAN",
  "OMANI",
  "PAKISTANI",
  "PALAUAN",
  "PALESTINIAN",
  "PANAMANIAN / PANAMENA",
  "PAPUA NEW GUINEAN",
  "PARAGUAYAN / PARAGUAYA",
  "PERUVIAN / PERUANA",
  "POLISH",
  "PORTUGUESE",
  "PUERTO RICAN",
  "QATARI",
  "REUNIONESE",
  "ROMANIAN",
  "RUSSIAN",
  "RWANDAN",
  "SAINT KITTS AND NEVIS NATIONAL",
  "SAINT LUCIAN",
  "SAINT PIERRAIS / MIQUELONNAIS",
  "SAINT VINCENTIAN",
  "SAMOAN",
  "SAN MARINESE",
  "SAO TOMEAN",
  "SAUDI / SAUDI ARABIAN",
  "SENEGAIS / SENEGALAISE",
  "SERBIAN",
  "SEYCHELLOIS / SEYCHELLOISE",
  "SIERRA LEONEAN",
  "SINGAPOREAN",
  "SLOVAK",
  "SLOVENIAN",
  "SOLOMON ISLANDER",
  "SOMALI",
  "SOUTH AFRICAN",
  "SOUTH KOREAN",
  "SOUTH SUDANESE",
  "SPANISH / ESPANOLA",
  "SRI LANKAN",
  "SUDANESE",
  "SURINAMESE",
  "SWEDISH",
  "SWISS",
  "SYRIAN",
  "TAIWANESE",
  "TAJIK",
  "TANZANIAN",
  "TCHADIENNE",
  "THAI",
  "TIMORESE",
  "TOGOLESE",
  "TOKELAUAN",
  "TONGAN",
  "TRINIDADIAN AND TOBAGONIAN",
  "TUNISIEN / TUNISIENNE",
  "TURKISH",
  "TURKMEN",
  "TUVALUAN",
  "UGANDAN",
  "UKRAINIAN",
  "URUGUAYAN / URUGUAYA",
  "US VIRGIN ISLANDER",
  "UZBEK",
  "VANUATUAN",
  "VATICAN NATIONAL",
  "VENEZUELAN / VENEZOLANA",
  "VIETNAMESE",
  "YEMENI",
  "ZAMBIAN",
  "ZIMBABWEAN",
];

export default function Status() {
  const [searchBy, setSearchBy] = useState("visa_grant_number");
  const [dob, setDob] = useState("");
  const [captchaVersion, setCaptchaVersion] = useState(Date.now());
  const [message, setMessage] = useState("");

  const identifierLabel =
    searchBy === "visa_grant_number" ? "Visa Grant Number" : "Application ID";

  const identifierPlaceholder =
    searchBy === "visa_grant_number"
      ? "Enter Visa Grant Number"
      : "Enter Application ID";

  function handleDobChange(event) {
    let value = event.target.value.replace(/\D/g, "").slice(0, 8);

    if (value.length > 6) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }

    setDob(value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      "The form is ready, but live status checking requires a connected and authorized backend.",
    );
  }

  function handleReset() {
    setSearchBy("visa_grant_number");
    setDob("");
    setMessage("");
    setCaptchaVersion(Date.now());
  }

  return (
    <div className="status-page">
      <div className="status-container">
        <section className="instructions-box">
          <h2>Instructions for Visa Application Status Check</h2>

          <p>
            Use this form to enter your travel document details and application
            reference.
          </p>

          <ul>
            <li>
              Enter your Travel Document Number using uppercase letters where
              applicable.
            </li>
            <li>Enter your Date of Birth in YYYY-MM-DD format.</li>
            <li>Select your Nationality from the dropdown.</li>
            <li>Select Application ID or Visa Grant Number.</li>
            <li>Enter the displayed verification code.</li>
          </ul>

          <p className="status-notice">
            This interface does not independently verify visa applications. Use
            an authorized service for actual status information.
          </p>
        </section>

        <section className="status-form-box">
          <h2>Check Visa Application Status</h2>

          <form onSubmit={handleSubmit} onReset={handleReset}>
            <label htmlFor="travel-document">Travel Document Number</label>

            <input
              id="travel-document"
              name="travel_document_number"
              type="text"
              maxLength={15}
              placeholder="Enter Travel Document Number"
              autoComplete="off"
              required
            />

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
              pattern="\d{4}-\d{2}-\d{2}"
              title="Enter date in YYYY-MM-DD format"
              required
            />

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

              {nationalities.map((nationality) => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>

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

            <label htmlFor="captcha">Verification Code</label>

            <div className="status-captcha">
              <img
                src={`/captcha.php?x=${captchaVersion}`}
                alt="Verification code"
              />

              <button
                type="button"
                className="status-refresh"
                onClick={() => setCaptchaVersion(Date.now())}
              >
                Refresh
              </button>
            </div>

            <input
              id="captcha"
              name="captcha"
              type="text"
              placeholder="Enter verification code"
              autoComplete="off"
              required
            />

            <div className="status-actions">
              <button className="status-btn" type="submit">
                Check
              </button>

              <button className="status-btn status-reset" type="reset">
                Reset
              </button>
            </div>

            {message && (
              <p className="status-message" role="status">
                {message}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
