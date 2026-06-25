import React, { useState } from 'react';
import { Sparkles, Calendar, BookOpen, AlertTriangle } from 'lucide-react';
import './Communitycss.css';

export default function Community() {
  const [formData, setFormData] = useState({
    businessName: '',
    category: 'Guides',
    city: '',
    phone: '',
    description: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { businessName, city, phone, description } = formData;
    
    if (!businessName || !city || !phone || !description) {
      setError('Please fill in all details to submit your listing.');
      return;
    }

    setError('');
    setSuccess(true);
    
    // Reset Form
    setFormData({
      businessName: '',
      category: 'Guides',
      city: '',
      phone: '',
      description: ''
    });

    // Remove success message after 5 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  return (
    <section className="communitySection" id="community">
      <div className="communityContainer">
        
        {/* Form Column */}
        <div className="formCard">
          <span className="formSubtitle">Join the Network</span>
          <h2 className="formTitle">Register Your Service</h2>
          <p className="formDesc">
            Are you a local tourist guide, running a heritage homestay, or crafting traditional items? 
            List your business on Rajasthan Connect to reach visitors globally.
          </p>

          {success && (
            <div className="successAlert">
              ✓ Listing submitted successfully! Our moderators will verify your details within 24 hours.
            </div>
          )}

          {error && (
            <div className="successAlert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#b91c1c' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label className="inputLabel" htmlFor="businessName">Provider / Business Name</label>
              <input 
                type="text" 
                id="businessName" 
                name="businessName"
                className="formInput" 
                placeholder="e.g. Rajputana Heritage Guide"
                value={formData.businessName}
                onChange={handleInputChange}
              />
            </div>

            <div className="inputGroup" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label className="inputLabel" htmlFor="category">Category</label>
                <select 
                  id="category" 
                  name="category"
                  className="formSelect"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Guides">Tour Guide</option>
                  <option value="Artisans">Artisan / Workshop</option>
                  <option value="Stays">Stay / Hotel</option>
                  <option value="Experiences">Experience / Safari</option>
                </select>
              </div>

              <div>
                <label className="inputLabel" htmlFor="city">City / Hub</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  className="formInput" 
                  placeholder="e.g. Jaipur"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="inputGroup">
              <label className="inputLabel" htmlFor="phone">Contact Number (WhatsApp Preferred)</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                className="formInput" 
                placeholder="e.g. +91 98290 XXXXX"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="inputGroup">
              <label className="inputLabel" htmlFor="description">Service Description</label>
              <textarea 
                id="description" 
                name="description"
                rows="4" 
                className="formTextarea" 
                placeholder="Briefly describe what you offer, languages spoken, custom options, etc..."
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button type="submit" className="formSubmitBtn">
              Submit Listing
            </button>
          </form>
        </div>

        {/* Info Column */}
        <div className="infoColumn">
          
          {/* FAQ Block */}
          <div className="infoBlock">
            <h3 className="blockTitle">
              <BookOpen size={20} color="var(--color-primary)" />
              Cultural Etiquette & Safe Travel
            </h3>
            <div className="faqList">
              <div className="faqItem">
                <h4 className="faqQuestion">How should I greet locals?</h4>
                <p className="faqAnswer">
                  A warm fold of hands with a slight bow saying "Khamma Ghani" (Royal greeting in Marwari) or "Namaste" is highly appreciated by the locals.
                </p>
              </div>
              <div className="faqItem">
                <h4 className="faqQuestion">Dress guidelines for historic sites?</h4>
                <p className="faqAnswer">
                  When visiting temples or forts, please dress respectfully, keeping shoulders and knees covered. Remember to remove footwear before entering holy shrines.
                </p>
              </div>
              <div className="faqItem">
                <h4 className="faqQuestion">Negotiating guide fees?</h4>
                <p className="faqAnswer">
                  Always check for Government Tourism cards. Standardized rates exist for monument guides. For directory listings, agree on prices beforehand via the phone contact.
                </p>
              </div>
            </div>
          </div>

          {/* Festival Block */}
          <div className="infoBlock">
            <h3 className="blockTitle">
              <Calendar size={20} color="var(--color-accent)" />
              Upcoming Festival Calendar
            </h3>
            
            <div className="festivalItem">
              <span className="festName">Pushkar Camel Fair (Pushkar)</span>
              <span className="festDate">Nov 2026</span>
            </div>
            <div className="festivalItem">
              <span className="festName">Desert Festival (Jaisalmer)</span>
              <span className="festDate">Feb 2027</span>
            </div>
            <div className="festivalItem">
              <span className="festName">Jaipur Literature Festival (Jaipur)</span>
              <span className="festDate">Jan 2027</span>
            </div>
            <div className="festivalItem">
              <span className="festName">Mewar Festival (Udaipur)</span>
              <span className="festDate">Apr 2027</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
