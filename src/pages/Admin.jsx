import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const EMPTY_FORM = {
  application_id: "",
  visa_grant_number: "",
  applicant_name: "",
  travel_document_number: "",
  date_of_birth: "",
  nationality: "",
  application_type: "",
  submission_date: "",
  status: "Pending",
  decision_date: "",
  expiry_date: "",
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

function formatDate(value) {
  return value ? String(value).slice(0, 10) : "";
}

async function apiRequest(endpoint, options = {}) {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
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
    if (response.status === 409) {
      throw new Error(
        data.message ||
          "Duplicate application. Check whether the Application ID or Visa Grant Number already exists.",
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
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return undefined;
    }

    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

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
    setForm(EMPTY_FORM);
    setPhoto(null);
    setEditingId(null);

    const input = document.getElementById("applicant-photo");

    if (input) input.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!editingId && !photo) {
      setError("Please select an applicant photo.");
      return;
    }

    if (photo) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(photo.type)) {
        setError("Photo must be JPG, PNG, or WEBP.");
        return;
      }

      if (photo.size > 5 * 1024 * 1024) {
        setError("Photo size must not exceed 5 MB.");
        return;
      }
    }

    setLoading(true);

    try {
      const body = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        body.append(key, value);
      });

      if (editingId) {
        body.append("id", String(editingId));
      }

      if (photo) {
        body.append("photo", photo);
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

  function handleEdit(record) {
    setEditingId(record.id);

    setForm({
      application_id: record.application_id || "",
      visa_grant_number: record.visa_grant_number || "",
      applicant_name: record.applicant_name || "",
      travel_document_number: record.travel_document_number || "",
      date_of_birth: formatDate(record.date_of_birth),
      nationality: record.nationality || "",
      application_type: record.application_type || "",
      submission_date: formatDate(record.submission_date),
      status: record.status || "Pending",
      decision_date: formatDate(record.decision_date),
      expiry_date: formatDate(record.expiry_date),
    });

    setPhoto(null);
    setError("");
    setSuccess("");

    const input = document.getElementById("applicant-photo");

    if (input) input.value = "";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this application record permanently?")) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiRequest("delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (String(editingId) === String(id)) {
        resetForm();
      }

      setSuccess("Application record deleted successfully.");

      await loadRecords();
    } catch (err) {
      setError(err.message || "Unable to delete the record.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_logged_in");
    navigate("/admin/login", { replace: true });
  }

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return records;

    return records.filter((record) =>
      [
        record.application_id,
        record.visa_grant_number,
        record.applicant_name,
        record.travel_document_number,
        record.nationality,
        record.status,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }, [records, search]);

  function renderInput(label, name, type = "text", required = false) {
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
          value={form[name]}
          onChange={handleChange}
          required={required}
          autoComplete="off"
          placeholder={type === "date" ? "" : `Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  }

  if (checking) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-dashboard">
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

        {/* Add / Edit Application */}
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <h2>{editingId ? "Edit Application" : "Add Application"}</h2>

              <p>
                {editingId
                  ? "Update the selected application record."
                  : "Add an authorized application record to the database."}
              </p>
            </div>
          </div>

          <form className="admin-upload-form" onSubmit={handleSubmit}>
            <div className="admin-form-section-title">
              01. Application Information
            </div>

            <div className="admin-form-grid">
              {renderInput("Application ID", "application_id", "text", true)}

              {renderInput("Visa Grant Number", "visa_grant_number")}

              {renderInput(
                "Application Type",
                "application_type",
                "text",
                true,
              )}

              {renderInput("Submission Date", "submission_date", "date", true)}
            </div>

            <div className="admin-form-section-title">
              02. Applicant Information
            </div>

            <div className="admin-form-grid">
              {renderInput("Applicant Name", "applicant_name", "text", true)}

              {renderInput(
                "Travel Document Number",
                "travel_document_number",
                "text",
                true,
              )}

              {renderInput("Date of Birth", "date_of_birth", "date", true)}

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
            </div>

            <div className="admin-form-section-title">03. Visa Decision</div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="status">Current Status *</label>

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

              {renderInput("Decision Date", "decision_date", "date")}

              {renderInput("Expiry Date", "expiry_date", "date")}
            </div>

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
                onChange={(event) => setPhoto(event.target.files?.[0] || null)}
                required={!editingId}
              />

              <small>
                JPG, PNG or WEBP. Maximum 5 MB. The server must validate the
                file too.
              </small>

              {photoPreview && (
                <div className="admin-photo-preview">
                  <img src={photoPreview} alt="Selected applicant preview" />
                  <span>{photo?.name}</span>
                </div>
              )}

              {editingId && !photo && (
                <small>Leave empty to keep the existing applicant photo.</small>
              )}
            </div>

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

        {/* Application Records */}
        <section className="admin-section admin-records-section">
          <div className="admin-section-heading admin-records-heading">
            <div>
              <h2>Application Records</h2>
              <p>{filteredRecords.length} records shown</p>
            </div>

            <div className="admin-search">
              <input
                type="search"
                placeholder="Search ID, visa number, name, passport..."
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
                  <th>Visa Grant No.</th>
                  <th>Travel Document</th>
                  <th>Nationality</th>
                  <th>Status</th>
                  <th>Expiry Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.applicant_name || "—"}</td>

                      <td>{record.application_id || "—"}</td>

                      <td>{record.visa_grant_number || "—"}</td>

                      <td>{record.travel_document_number || "—"}</td>

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

                      <td>{formatDate(record.expiry_date) || "—"}</td>

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
