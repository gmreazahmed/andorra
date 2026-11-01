import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const EMPTY_FORM = {
  surname: "",
  given_names: "",
  sex: "",
  dob: "",
  nationality: "",
  application_id: "",
  application_date: "",
  territory: "",
  travel_document: "",
  visa_category: "",
  grant_number: "",
  grant_date: "",
  validity_date: "",
  status: "Pending",
  status_message: "",
};

const STATUS_OPTIONS = [
  "Pending",
  "In Review",
  "Approved",
  "Rejected",
  "Expired",
];

const NATIONALITY_OPTIONS = `
AFGHAN|ALBANIAN|ALGERIAN / ALGERIENNE|AMERICAN|ANDORRAN|ANGOLAN|ANGUILLAN|ANTIGUAN AND BARBUDAN|ARUBAN|ARGENTINO / ARGENTINA|ARMENIAN|AUSTRALIAN|AUSTRIAN|AZERBAIJANI|BAHAMIAN|BAHRAINI|BANGLADESHI|BARBADIAN|BELARUSIAN|BELGIAN|BELIZEAN|BENINESE / BENINOISE|BERMUDIAN|BHUTANESE|BOLIVIAN / BOLIVIANA|BOSNIAN AND HERZEGOVINIAN|BOTSWANAN|BRAZILIAN / BRASILEIRA|BRITISH|BRITISH VIRGIN ISLANDER|BRUNEIAN|BULGARIAN|BURKINABE|BURUNDIAN|CABO VERDEAN|CAMBODIAN|CAMEROONIAN|CANADIAN|CAYMANIAN|CENTRAL AFRICAN|CHADIAN|CHILEAN / CHILENA|CHINESE|COLOMBIAN / COLOMBIANA|COMORAN|CONGOLAIS / CONGOLAISE|CONGOLESE (DRC) / CONGOLAISE (DRC)|COOK ISLANDER|COSTA RICAN / COSTARRICENSE|CROATIAN|CUBAN / CUBANA|CURACAOAN|CYPRIOT|CZECH|DANISH|DJIBOUTIAN|DOMINICAN (DOMINICA)|DOMINICAN / DOMINICANA (REPUBLIC)|DUTCH|ECUADORIAN / ECUATORIANA|EGYPTIAN|EMIRATI / UAE NATIONAL|EQUATOGUINEAN / ECUATOGUINEANA|ERITREAN|ESTONIAN|ESWATINI|ETHIOPIAN|FAROESE|FIJIAN|FILIPINO / FILIPINA|FINNISH|FRENCH / FRANCAISE|FRENCH GUIANA NATIONAL|FRENCH POLYNESIAN|GABONESE|GAMBIAN|GEORGIAN|GERMAN|GHANAIAN|GIBRALTARIAN|GREEK|GREENLANDER|GRENADIAN|GUAMANIAN|GUATEMALAN / GUATEMALTECA|GUERNSEYMAN / GUERNSEYWOMAN|GUINEA BISSAU NATIONAL|GUINEEN / GUINEENNE|GUYANESE|HAITIAN|HONDURAN|HONG KONG SAR NATIONAL|HUNGARIAN|ICELANDIC|INDIAN|INDONESIAN|IRANIAN|IRAQI|IRISH|ISLE OF MAN NATIONAL|ISRAELI|ITALIAN / ITALIANA|IVOIRIEN / IVOIRIENNE|JAMAICAN|JAPANESE|JERSEY NATIONAL|JORDANIAN|KAZAKHSTANI|KENYAN|KIRIBATI NATIONAL|KOSOVAR|KUWAITI|KYRGYZ|LAO|LATVIAN|LEBANESE|LESOTHO NATIONAL|LIBERIAN|LIBYAN|LIECHTENSTEINER|LITHUANIAN|LUXEMBOURGISH|MACANESE|MALAGASY|MALAWIAN|MALAYSIAN|MALDIVIAN|MALIAN / MALIENNE|MALTESE|MAROCAIN / MAROCAINE|MARSHALLESE|MARTINICAN|MAURITANIAN / MAURITANIENNE|MAURITIAN|MAYOTTE NATIONAL|MEXICAN / MEXICANA|MICRONESIAN|MOLDOVAN|MONEGASQUE|MONGOLIAN|MONTENEGRIN|MONTSERRATIAN|MOROCCAN|MOZAMBICAN|MYANMAR|NAMIBIAN|NAURUAN|NEPALESE|NEW CALEDONIAN|NEW ZEALANDER|NICARAGUAN / NICARAGUENSE|NIGERIAN|NIUEAN|NORTH KOREAN|NORTH MACEDONIAN|NORWEGIAN|OMANI|PAKISTANI|PALAUAN|PALESTINIAN|PANAMANIAN / PANAMENA|PAPUA NEW GUINEAN|PARAGUAYAN / PARAGUAYA|PERUVIAN / PERUANA|POLISH|PORTUGUESE|PUERTO RICAN|QATARI|REUNIONESE|ROMANIAN|RUSSIAN|RWANDAN|SAINT KITTS AND NEVIS NATIONAL|SAINT LUCIAN|SAINT PIERRAIS / MIQUELONNAIS|SAINT VINCENTIAN|SAMOAN|SAN MARINESE|SAO TOMEAN|SAUDI / SAUDI ARABIAN|SENEGAIS / SENEGALAISE|SERBIAN|SEYCHELLOIS / SEYCHELLOISE|SIERRA LEONEAN|SINGAPOREAN|SLOVAK|SLOVENIAN|SOLOMON ISLANDER|SOMALI|SOUTH AFRICAN|SOUTH KOREAN|SOUTH SUDANESE|SPANISH / ESPANOLA|SRI LANKAN|SUDANESE|SURINAMESE|SWEDISH|SWISS|SYRIAN|TAIWANESE|TAJIK|TANZANIAN|TCHADIENNE|THAI|TIMORESE|TOGOLESE|TOKELAUAN|TONGAN|TRINIDADIAN AND TOBAGONIAN|TUNISIEN / TUNISIENNE|TURKISH|TURKMEN|TUVALUAN|UGANDAN|UKRAINIAN|URUGUAYAN / URUGUAYA|US VIRGIN ISLANDER|UZBEK|VANUATUAN|VATICAN NATIONAL|VENEZUELAN / VENEZOLANA|VIETNAMESE|YEMENI|ZAMBIAN|ZIMBABWEAN
`
  .trim()
  .split("|");

const PHOTO_MAX_SIZE = 5 * 1024 * 1024;
const PDF_MAX_SIZE = 10 * 1024 * 1024;

function formatDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function getApplicantName(record) {
  return [record.surname, record.given_names].filter(Boolean).join(" ");
}

async function apiRequest(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error("API URL is not configured. Check VITE_API_URL.");
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!data || typeof data !== "object") {
    throw new Error(
      `The server returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok || data.success === false) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Your admin session has expired. Please log in again.");
    }

    if (response.status === 409) {
      throw new Error(
        data.message || "This Application ID or Grant Number already exists.",
      );
    }

    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

export default function Admin() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [pdf, setPdf] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // Applicant photo preview
  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPhotoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // Load records
  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("records.php");
      setRecords(Array.isArray(data.records) ? data.records : []);
    } catch (err) {
      setError(err.message || "Unable to load records.");
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }, []);

  // Frontend route guard only. The PHP API must also verify admin sessions.
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("admin_logged_in") === "true";

    if (!loggedIn) {
      navigate("/admin/login", { replace: true });
      setChecking(false);
      return;
    }

    loadRecords();
  }, [navigate, loadRecords]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setPhoto(null);
    setPdf(null);
    setEditingId(null);

    const photoInput = document.getElementById("applicant-photo");
    const pdfInput = document.getElementById("applicant-pdf");

    if (photoInput) photoInput.value = "";
    if (pdfInput) pdfInput.value = "";
  }

  function handlePhotoChange(event) {
    setPhoto(event.target.files?.[0] || null);
  }

  function handlePdfChange(event) {
    setPdf(event.target.files?.[0] || null);
  }

  // Create / Update record
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!editingId && !photo) {
      setError("Please select an applicant photo.");
      return;
    }

    if (photo) {
      const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedPhotoTypes.includes(photo.type)) {
        setError("Photo must be JPG, PNG, or WEBP.");
        return;
      }

      if (photo.size > PHOTO_MAX_SIZE) {
        setError("Photo size must not exceed 5 MB.");
        return;
      }
    }

    if (pdf) {
      const isPdf =
        pdf.type === "application/pdf" ||
        pdf.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        setError("The application document must be a PDF file.");
        return;
      }

      if (pdf.size > PDF_MAX_SIZE) {
        setError("PDF size must not exceed 10 MB.");
        return;
      }
    }

    setLoading(true);

    try {
      const body = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        body.append(key, value ?? "");
      });

      if (editingId) {
        body.append("id", String(editingId));
      }

      if (photo) {
        body.append("photo", photo);
      }

      if (pdf) {
        body.append("pdf", pdf);
      }

      const endpoint = editingId ? "edit.php" : "upload.php";

      const data = await apiRequest(endpoint, {
        method: "POST",
        body,
      });

      setSuccess(
        data.message ||
          (editingId
            ? "Application record updated successfully."
            : "Application record added successfully."),
      );

      resetForm();
      await loadRecords();
    } catch (err) {
      setError(err.message || "Unable to save the application.");
    } finally {
      setLoading(false);
    }
  }

  // Populate edit form
  function handleEdit(record) {
    setEditingId(record.id);

    setForm({
      surname: record.surname || "",
      given_names: record.given_names || "",
      sex: record.sex || "",
      dob: formatDate(record.dob),
      nationality: record.nationality || "",
      application_id: record.application_id || "",
      application_date: formatDate(record.application_date),
      territory: record.territory || "",
      travel_document: record.travel_document || "",
      visa_category: record.visa_category || "",
      grant_number: record.grant_number || "",
      grant_date: formatDate(record.grant_date),
      validity_date: formatDate(record.validity_date),
      status: record.status || "Pending",
      status_message: record.status_message || "",
    });

    setPhoto(null);
    setPdf(null);
    setError("");
    setSuccess("");

    const photoInput = document.getElementById("applicant-photo");
    const pdfInput = document.getElementById("applicant-pdf");

    if (photoInput) photoInput.value = "";
    if (pdfInput) pdfInput.value = "";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Delete record
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this record?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await apiRequest("delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (String(editingId) === String(id)) {
        resetForm();
      }

      setSuccess(data.message || "Record deleted successfully.");
      await loadRecords();
    } catch (err) {
      setError(err.message || "Unable to delete this record.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_logged_in");
    navigate("/admin/login", { replace: true });
  }

  // Search records
  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return records;

    return records.filter((record) =>
      [
        record.surname,
        record.given_names,
        record.application_id,
        record.grant_number,
        record.travel_document,
        record.nationality,
        record.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }, [records, search]);

  function renderInput(
    label,
    name,
    type = "text",
    required = false,
    placeholder,
  ) {
    return (
      <div className="admin-field" key={name}>
        <label htmlFor={name}>
          {label}
          {required && <span className="required-mark"> *</span>}
        </label>

        <input
          id={name}
          name={name}
          type={type}
          value={form[name] ?? ""}
          onChange={handleChange}
          required={required}
          autoComplete="off"
          placeholder={
            placeholder ??
            (type === "date" ? "" : `Enter ${label.toLowerCase()}`)
          }
        />
      </div>
    );
  }

  if (checking) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Topbar */}
      <header className="admin-topbar">
        <div>
          <h2>Application Admin</h2>
          <small>Application Record Management</small>
        </div>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="admin-content">
        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-alert admin-alert-success" role="status">
            {success}
          </div>
        )}

        {/* Dashboard */}
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Manage application information and records.</p>
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={loadRecords}
              disabled={loading}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span>Total Applications</span>
              <strong>{records.length}</strong>
            </div>

            <div className="admin-stat-card">
              <span>Approved</span>
              <strong>
                {records.filter((item) => item.status === "Approved").length}
              </strong>
            </div>

            <div className="admin-stat-card">
              <span>Pending</span>
              <strong>
                {records.filter((item) => item.status === "Pending").length}
              </strong>
            </div>
          </div>
        </section>

        {/* Add / Edit form */}
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>{editingId ? "Edit Application" : "Add Application"}</h2>
              <p>
                {editingId
                  ? "Update the selected application record."
                  : "Add an application record to the database."}
              </p>
            </div>
          </div>

          <form className="admin-upload-form" onSubmit={handleSubmit}>
            {/* Applicant information */}
            <div className="admin-form-section-title">
              01. Applicant Information
            </div>

            <div className="admin-form-grid">
              {renderInput("Surname", "surname", "text", true)}
              {renderInput("Given Name(s)", "given_names", "text", true)}

              <div className="admin-field">
                <label htmlFor="sex">Sex</label>
                <select
                  id="sex"
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {renderInput("Date of Birth", "dob", "date", true)}

              <div className="admin-field">
                <label htmlFor="nationality">
                  Nationality <span className="required-mark">*</span>
                </label>

                <select
                  id="nationality"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Nationality</option>
                  {NATIONALITY_OPTIONS.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
              </div>

              {renderInput(
                "Travel Document Number",
                "travel_document",
                "text",
                true,
              )}
            </div>

            {/* Application information */}
            <div className="admin-form-section-title">
              02. Application Information
            </div>

            <div className="admin-form-grid">
              {renderInput("Application ID", "application_id", "text", true)}
              {renderInput(
                "Application Date",
                "application_date",
                "date",
                true,
              )}
              {renderInput("Territory to Visit", "territory", "text", true)}
              {renderInput(
                "E-Visa Category & Type",
                "visa_category",
                "text",
                true,
              )}
            </div>

            {/* Visa decision */}
            <div className="admin-form-section-title">
              03. Application Status & Decision
            </div>

            <div className="admin-form-grid">
              {renderInput("E-Visa Grant Number", "grant_number")}

              {renderInput("E-Visa Grant Date", "grant_date", "date")}

              {renderInput("E-Visa Validity", "validity_date", "date")}

              <div className="admin-field">
                <label htmlFor="status">
                  Current Status <span className="required-mark">*</span>
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="status_message">
                Status Message / Additional Information
              </label>

              <textarea
                id="status_message"
                name="status_message"
                rows="3"
                value={form.status_message}
                onChange={handleChange}
                placeholder="Enter an optional status message..."
              />
            </div>

            {/* Applicant photo */}
            <div className="admin-form-section-title">04. Applicant Photo</div>

            <div className="admin-field admin-field-full">
              <label htmlFor="applicant-photo">
                Applicant Photo {editingId ? "(Optional)" : "*"}
              </label>

              <input
                id="applicant-photo"
                type="file"
                name="photo"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                required={!editingId}
              />

              <small>
                JPG, PNG or WEBP. Maximum 5 MB.
                {editingId ? " Leave empty to keep the current photo." : ""}
              </small>

              {photoPreview && (
                <div className="admin-photo-preview">
                  <img src={photoPreview} alt="Selected applicant preview" />
                  <span>{photo?.name}</span>
                </div>
              )}
            </div>

            {/* Application PDF */}
            <div className="admin-form-section-title">05. Application PDF</div>

            <div className="admin-field admin-field-full">
              <label htmlFor="applicant-pdf">
                Upload Application PDF {editingId ? "(Optional)" : ""}
              </label>

              <input
                id="applicant-pdf"
                type="file"
                name="pdf"
                accept="application/pdf,.pdf"
                onChange={handlePdfChange}
              />

              <small>
                PDF only. Maximum 10 MB.
                {editingId ? " Leave empty to keep the existing PDF." : ""}
              </small>

              {pdf && (
                <div className="admin-file-selected">
                  <span>PDF selected</span>
                  <strong>{pdf.name}</strong>
                  <small>{(pdf.size / (1024 * 1024)).toFixed(2)} MB</small>
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="admin-form-actions">
              {editingId && (
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel Edit
                </button>
              )}

              <button
                type="submit"
                className="admin-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Application"}
              </button>
            </div>
          </form>
        </section>

        {/* Records table */}
        <section className="admin-section admin-records-section">
          <div className="admin-section-heading admin-records-heading">
            <div>
              <h2>Application Records</h2>
              <p>{filteredRecords.length} records shown</p>
            </div>

            <div className="admin-search">
              <input
                type="search"
                placeholder="Search name, ID, grant number, passport..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Application ID</th>
                  <th>Grant Number</th>
                  <th>Travel Document</th>
                  <th>Nationality</th>
                  <th>Status</th>
                  <th>Validity</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{getApplicantName(record) || "—"}</td>
                      <td>{record.application_id || "—"}</td>
                      <td>{record.grant_number || "—"}</td>
                      <td>{record.travel_document || "—"}</td>
                      <td>{record.nationality || "—"}</td>

                      <td>
                        <span
                          className={`admin-status status-${String(
                            record.status || "pending",
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {record.status || "Pending"}
                        </span>
                      </td>

                      <td>{formatDate(record.validity_date) || "—"}</td>

                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-edit-btn"
                            onClick={() => handleEdit(record)}
                            disabled={loading}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-btn"
                            onClick={() => handleDelete(record.id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="admin-empty">
                      {loading
                        ? "Loading records..."
                        : "No application records found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
