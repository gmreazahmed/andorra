import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Result.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://andorra.fragavenuebd.com/api"
).replace(/\/+$/, "");

const STORAGE_URL = (import.meta.env.VITE_STORAGE_URL || "").replace(/\/+$/, "");

export default function Result({ result: resultProp }) {
  const location = useLocation();
  const result = resultProp || location.state?.result;

  const getValue = (...keys) => {
    for (const key of keys) {
      const value = result?.[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return value;
      }
    }

    return "—";
  };

  const formatDate = (value) => {
    if (!value || value === "—") return "—";

    const date = String(value).trim().split(" ")[0];
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : value;
  };

  // Only accept files hosted by the configured API or configured storage host.
  // This avoids rendering arbitrary URLs supplied by an untrusted record.
  const getFileUrl = (value) => {
    if (!value || value === "—") return "";

    const file = String(value).trim();

    try {
      if (/^https?:\/\//i.test(file)) {
        const url = new URL(file);
        const apiHost = new URL(API_URL).hostname;
        const storageHost = STORAGE_URL ? new URL(STORAGE_URL).hostname : "";

        if (![apiHost, storageHost].filter(Boolean).includes(url.hostname)) {
          return "";
        }

        return url.href;
      }

      if (
        file.includes("..") ||
        file.startsWith("//") ||
        file.includes("\\")
      ) {
        return "";
      }

      return `${API_URL}/${file.replace(/^\/+/, "")}`;
    } catch {
      return "";
    }
  };

  if (!result) {
    return (
      <main className="sr-wrap">
        <section className="sr-empty" aria-labelledby="sr-empty-title">
          <div className="sr-empty-mark" aria-hidden="true">
            !
          </div>
          <h2 id="sr-empty-title">No Application Record Found</h2>
          <p>
            No application information is available to display. Please return
            to the status check page and search again.
          </p>
          <Link to="/status" className="sr-btn sr-btn-primary">
            New Search
          </Link>
        </section>
      </main>
    );
  }

  const photo = getFileUrl(
    getValue("photo_url", "photoUrl", "applicant_photo", "photo")
  );

  const pdfUrl = getFileUrl(
    getValue("pdf_url", "pdfUrl", "pdf_path", "pdfPath", "document_url")
  );

  const status = String(getValue("status", "visa_status", "visaStatus"));
  const statusClass = status
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const statusMessage = getValue("status_message", "statusMessage");

  const fields = [
    [
      {
        label: "Surname",
        sub: "Cognom",
        value: getValue("surname", "last_name", "lastName"),
      },
      {
        label: "Date of Birth",
        sub: "Data de naixement",
        value: formatDate(getValue("dob", "date_of_birth", "dateOfBirth")),
      },
    ],
    [
      {
        label: "Given Name(s)",
        sub: "Nom(s)",
        value: getValue(
          "given_names",
          "givenNames",
          "first_name",
          "firstName",
          "applicant_name",
          "applicantName",
          "full_name",
          "name"
        ),
      },
      {
        label: "Application ID",
        sub: "Identificació de sol·licitud",
        value: getValue("application_id", "applicationId"),
      },
    ],
    [
      {
        label: "Sex",
        sub: "Sexe",
        value: getValue("sex", "gender"),
      },
      {
        label: "Date of Application",
        sub: "Data de sol·licitud",
        value: formatDate(
          getValue(
            "application_date",
            "applicationDate",
            "submission_date",
            "submissionDate",
            "created_at"
          )
        ),
      },
    ],
    [
      {
        label: "Nationality",
        sub: "Nacionalitat",
        value: getValue("nationality", "citizenship"),
      },
      {
        label: "To Visit The Territory",
        sub: "Per visitar el territori",
        value: getValue(
          "territory",
          "visit_territory",
          "visitTerritory",
          "visit_purpose",
          "visitPurpose"
        ),
      },
    ],
    [
      {
        label: "Travel Document Number",
        sub: "Document de viatge",
        value: getValue(
          "travel_document",
          "travelDocument",
          "travel_document_number",
          "documentNumber",
          "passport_num",
          "passport_number"
        ),
      },
      {
        label: "E-Visa Category & Type",
        sub: "Categoria i tipus de visat electrònic",
        value: getValue(
          "visa_category",
          "visaCategory",
          "application_type",
          "applicationType",
          "visa_type"
        ),
      },
    ],
    [
      {
        label: "E-Visa Grant Number",
        sub: "Número de concessió",
        value: getValue(
          "grant_number",
          "grantNumber",
          "visa_grant_number",
          "visaGrantNumber",
          "visa_number",
          "visaNumber"
        ),
      },
      {
        label: "E-Visa Grant Date",
        sub: "Data de concessió",
        value: formatDate(
          getValue("grant_date", "grantDate", "decision_date", "decisionDate")
        ),
      },
    ],
    [
      {
        label: "E-Visa Validity",
        sub: "Validesa del visat electrònic",
        value: formatDate(
          getValue(
            "validity_date",
            "validityDate",
            "expiry_date",
            "expiryDate",
            "visa_validity"
          )
        ),
      },
      null,
    ],
  ];

  return (
    <main className="sr-wrap">
      <section className="sr-heading-card">
        <div className="sr-heading-content">
          <div className="sr-heading-emblem">
            <img src="/assets/coat-of-arms.png" alt="" />
          </div>

          <h1>GOVERNMENT OF ANDORRA</h1>
          <p className="sr-heading-local">Govern d'Andorra</p>
          <p className="sr-heading-description">
            Ministry of Foreign Affairs and European Integration
          </p>
        </div>

        <div className="sr-heading-band">
          <h2>Application Details as per Ministry Record</h2>
        </div>
      </section>

      <section className="sr-card" aria-label="Applicant information">
        <div className="sr-top">
          {photo ? (
            <img
              src={photo}
              alt="Applicant"
              className="sr-photo"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="sr-photo-placeholder">Applicant Photo</div>
          )}
        </div>

        <div className="sr-grid">
          {fields.map((row, index) => (
            <div className="sr-detail-row" key={`${row[0].label}-${index}`}>
              <div className="sr-field-label">
                <p>{row[0].label}</p>
                <span>{row[0].sub}</span>
              </div>

              <p className="sr-value">{row[0].value}</p>

              {row[1] ? (
                <>
                  <div className="sr-field-label">
                    <p>{row[1].label}</p>
                    <span>{row[1].sub}</span>
                  </div>
                  <p className="sr-value">{row[1].value}</p>
                </>
              ) : (
                <>
                  <div className="sr-field-label sr-empty-cell" />
                  <p className="sr-value sr-empty-cell" />
                </>
              )}
            </div>
          ))}
        </div>

        <p className="sr-date-note">
          Note: Dates are displayed in YYYY-MM-DD format.
        </p>
      </section>

      <section
        className={`sr-status-panel status-${statusClass}`}
        aria-live="polite"
        aria-label="Application status"
      >
        <h2>
          APPLICATION STATUS: <strong>{status}</strong>
        </h2>
        <p>
          {statusMessage !== "—"
            ? statusMessage
            : status === "—"
              ? "No status information is currently available."
              : `The recorded application status is ${status}.`}
        </p>
      </section>

      <div className="sr-actions">
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sr-btn sr-btn-primary"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8M8 17h8" />
            </svg>
            Print PDF
          </a>
        ) : (
          <button type="button" className="sr-btn sr-btn-primary" disabled>
            PDF Not Uploaded
          </button>
        )}

        <Link to="/status" className="sr-btn sr-btn-secondary">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          New Search
        </Link>
      </div>
    </main>
  );
}
