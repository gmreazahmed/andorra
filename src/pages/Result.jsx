import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Result.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://andorra.fragavenuebd.com/api"
).replace(/\/+$/, "");

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

    const dateString = String(value).split(" ")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    }

    return value;
  };

  const getPhotoUrl = (value) => {
    if (!value || value === "—") return "";

    const photo = String(value).trim();

    if (/^https?:\/\//i.test(photo)) return photo;

    return `${API_URL}/${photo.replace(/^\/+/, "")}`;
  };

  const photo = getPhotoUrl(
    getValue("photo_url", "photoUrl", "applicant_photo", "photo"),
  );

  const status = getValue("status", "visa_status", "visaStatus");

  const statusClass = String(status).toLowerCase().replace(/\s+/g, "-");

  const fields = [
    {
      label: "Applicant Name",
      sub: "Full name of applicant",
      value: getValue("applicant_name", "applicantName", "full_name", "name"),
    },
    {
      label: "Application ID",
      sub: "Application reference number",
      value: getValue("application_id", "applicationId"),
    },
    {
      label: "Visa Grant Number",
      sub: "Visa reference number",
      value: getValue(
        "visa_grant_number",
        "visaGrantNumber",
        "visa_number",
        "visaNumber",
      ),
    },
    {
      label: "Travel Document Number",
      sub: "Passport / travel document",
      value: getValue(
        "travel_document_number",
        "documentNumber",
        "passport_num",
        "passport_number",
      ),
    },
    {
      label: "Date of Birth",
      sub: "Applicant date of birth",
      value: formatDate(getValue("date_of_birth", "dateOfBirth")),
    },
    {
      label: "Nationality",
      sub: "Country of citizenship",
      value: getValue("nationality", "citizenship"),
    },
    {
      label: "Application Type",
      sub: "Type of application",
      value: getValue("application_type", "applicationType", "visa_type"),
    },
    {
      label: "Submission Date",
      sub: "Date application was submitted",
      value: formatDate(
        getValue("submission_date", "submissionDate", "created_at"),
      ),
    },
    {
      label: "Current Status",
      sub: "Latest application status",
      value: status,
      status: true,
    },
    {
      label: "Decision Date",
      sub: "Date of final decision",
      value: formatDate(getValue("decision_date", "decisionDate")),
    },
    {
      label: "Expiry Date",
      sub: "Visa validity end date",
      value: formatDate(getValue("expiry_date", "expiryDate", "visa_validity")),
    },
    {
      label: "Visit Purpose",
      sub: "Purpose of visit",
      value: getValue("visit_purpose", "visitPurpose"),
    },
  ];

  if (!result) {
    return (
      <main className="sr-wrap">
        <div className="sr-empty">
          <h2>No Result Available</h2>
          <p>
            No application result was provided. Please return to the status
            check page and search again.
          </p>

          <Link to="/status" className="btn btn-primary">
            Back to Status Check
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="sr-wrap">
      <header className="sr-header">
        <div className="sr-gov">
          <div>Application Information Service</div>
          <div>Application Status Result</div>
        </div>

        <div className="sr-title">APPLICATION STATUS DETAILS</div>
      </header>

      <section className="sr-card">
        {photo && (
          <div className="sr-top">
            <img
              src={photo}
              alt="Applicant"
              className="sr-photo"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="sr-grid">
          {fields.map((field) => (
            <React.Fragment key={field.label}>
              <div className="sr-field-label">
                <div className="lbl">{field.label}</div>
                <span className="sub">{field.sub}</span>
              </div>

              <div
                className={`val ${
                  field.status ? `sr-status-value status-${statusClass}` : ""
                }`}
              >
                {field.value}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="sr-disclaimer">
          This result displays information returned by the authorized
          application database. This interface is an independent information
          service and is not an official government website.
        </div>
      </section>

      <div className="sr-actions">
        <Link to="/status" className="btn">
          Back
        </Link>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          Print Result
        </button>
      </div>
    </main>
  );
}
