import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Store, ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/api.js";
import "./DirectoryRegister.css";
import useSEO from "../../hooks/useSEO";

export default function DirectoryRegister() {
  useSEO({
    title: "Register Your Local Business / Guide Service — Rajasthan Connect",
    description: "Are you a tour guide, driver, hotel owner, or artisan in Rajasthan? List your service on Rajasthan Connect to connect with travelers directly.",
    keywords: "register business Rajasthan, list tour guide Rajasthan, tourist service directory",
    url: `${window.location.origin}/directory/register`
  });

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Guides");
  const [city, setCity] = useState("Jaipur");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!businessName || !phone || !description) {
      setErrorMsg("Please populate all listing parameters.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setMessage("");

    fetch(`${API_BASE_URL}/api/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName,
        category,
        city,
        phone,
        description,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          let errMsg = "Registration failed";
          try {
            const errData = await res.json();
            if (errData.details && Array.isArray(errData.details)) {
              errMsg = errData.details.join(" ");
            } else if (errData.error) {
              errMsg = errData.error;
            }
          } catch (e) {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(() => {
        setBusinessName("");
        setPhone("");
        setDescription("");
        setCategory("Guides");
        setCity("Jaipur");
        setMessage(
          "Success! Your business has been registered and is pending admin verification."
        );
        setSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(
          err.message ||
            "Failed to connect to the database. Running in offline mode."
        );
        setSubmitting(false);
      });
  };

  return (
    <div className="directoryRegisterPage">
      <div className="registerContainer">
        
        {/* Back Link */}
        <Link to="/directory" className="backToDirLink">
          <ArrowLeft size={16} /> Back to Directory Explorer
        </Link>

        <div className="registerLayout">
          
          {/* Info Card */}
          <div className="registerInfoCol">
            <div className="registerInfoCard">
              <Store className="infoIcon" size={40} />
              <h2>Expand Your Reach in Rajasthan</h2>
              <p>
                Rajasthan Connect is a digital guide used by thousands of heritage travelers. We support local businesses, guides, and hosts to preserve community-driven tourism.
              </p>

              <div className="benefitPoints">
                <div className="benefitItem">
                  <CheckCircle size={18} className="benefitIcon" />
                  <div>
                    <h4>100% Free Listing</h4>
                    <p>No commissions or registration fees. Direct customer interaction.</p>
                  </div>
                </div>
                <div className="benefitItem">
                  <CheckCircle size={18} className="benefitIcon" />
                  <div>
                    <h4>Verified Badging</h4>
                    <p>Verified listings get a checkmark badge to build credibility.</p>
                  </div>
                </div>
                <div className="benefitItem">
                  <CheckCircle size={18} className="benefitIcon" />
                  <div>
                    <h4>Interactive Reviews</h4>
                    <p>Receive feedback and ratings from verified travelers directly.</p>
                  </div>
                </div>
              </div>

              <div className="noticeBox">
                <ShieldCheck size={18} className="noticeIcon" />
                <p>All listings undergo manual admin verification to ensure genuine contact details and quality guidelines are met.</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="registerFormCol">
            <div className="registerFormCard">
              <h3>Register Your Services</h3>
              <p className="formSubtitle">Provide accurate details to start receiving bookings.</p>

              {message && <div className="successNotify">{message}</div>}
              {errorMsg && <div className="errorNotify">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="registerInputsForm">
                
                <div className="formGroup">
                  <label>Business or Guide Name</label>
                  <input
                    type="text"
                    className="formInput"
                    placeholder="e.g. Rajput Walking Tours"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Service Category</label>
                    <select
                      className="formInput"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Guides">Tour Guide / Walk Host</option>
                      <option value="Hotels">Haveli / Homestay / Hotel</option>
                      <option value="Restaurants">Traditional Restaurant / Cafe</option>
                      <option value="Shops">Handicrafts / Art Shop</option>
                      <option value="Transport">Driver / Taxi Operator</option>
                    </select>
                  </div>

                  <div className="formGroup">
                    <label>City Hub</label>
                    <select
                      className="formInput"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="Jaipur">Jaipur</option>
                      <option value="Jodhpur">Jodhpur</option>
                      <option value="Udaipur">Udaipur</option>
                      <option value="Jaisalmer">Jaisalmer</option>
                    </select>
                  </div>
                </div>

                <div className="formGroup">
                  <label>Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    className="formInput"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <small className="inputHelp">Include country code (e.g. +91 for India) for direct WhatsApp links.</small>
                </div>

                <div className="formGroup">
                  <label>Description of Services & Experience</label>
                  <textarea
                    className="formTextarea"
                    rows="5"
                    placeholder="Describe your tours, languages spoken, homestay details, transport vehicle, or shop location..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submitBtn" disabled={submitting}>
                  {submitting ? "Submitting Registration..." : "Submit Service for Approval"}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
