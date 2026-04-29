import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handle = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('https://risecredit-api.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', text: 'Message sent successfully! We will get back to you within one business day.' });
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Rise Credit</title>
        <meta name="description" content="Reach out to our team anytime. Expert support for every step of your journey. Contact us via phone, email, or find a local branch." />
      </Helmet>
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero__content">
            <span className="contact-hero__badge">We're Here to Help You</span>
            <h1 className="contact-hero__title">Expert Support for Every Step of Your Journey</h1>
            <p className="contact-hero__subtitle">Reach out to our team anytime. Whether you need answers fast or want to talk through your options, we’re here to make it easy.</p>
          </div>
        </div>
      </section>

      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            
            {/* Left: Contact Info */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p className="contact-info__desc">Connect with the team that knows lending inside and out.</p>
              
              <div className="contact-info__list">
                <div className="contact-info__item">
                  <div className="contact-icon"><FiPhone /></div>
                  <div className="contact-details">
                    <p className="contact-label">Customer Support</p>
                    <p className="contact-value"><a href="tel:3122483871">(312)-248-3871</a></p>
                    <p className="contact-sub">Monday – Friday: 8 AM – 8 PM EST</p>
                  </div>
                </div>
                
                <div className="contact-info__item">
                  <div className="contact-icon"><FiMail /></div>
                  <div className="contact-details">
                    <p className="contact-label">Email Support</p>
                    <p className="contact-value"><a href="https://mail.google.com/mail/?view=cm&fs=1&to=risecredit01@gmail.com" target="_blank" rel="noopener noreferrer">risecredit01@gmail.com</a></p>
                    <p className="contact-sub">Response within 1 hour</p>
                  </div>
                </div>
                
                <div className="contact-info__item">
                  <div className="contact-icon"><FiMapPin /></div>
                  <div className="contact-details">
                    <p className="contact-label">Corporate Headquarters</p>
                    <p className="contact-value">1246 W 87th St<br />Chicago, IL 60620, USA</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-info__note">
                Prefer meeting in person? Visit your local branch and our team will be happy to help.
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              <p className="contact-form-card__desc">Fill out the form and we’ll reply within one business day.</p>
              
              {status && (
                <div className={`contact-status contact-status--${status.type}`}>
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label htmlFor="firstName">First Name *</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Your first name" value={formData.firstName} onChange={handle} minLength="2" required />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="lastName">Last Name *</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Your last name" value={formData.lastName} onChange={handle} minLength="2" required />
                  </div>
                </div>
                
                <div className="contact-form__field">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" placeholder="you@email.com" value={formData.email} onChange={handle} required />
                </div>
                
                <div className="contact-form__field">
                  <label htmlFor="subject">How can we help?</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handle}>
                    <option value="">Select inquiry type</option>
                    <option value="Loan Application Support">Loan Application Support</option>
                    <option value="Payment Assistance">Payment Assistance</option>
                    <option value="Account Questions">Account Questions</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
                
                <div className="contact-form__field">
                  <label htmlFor="message">Your Message *</label>
                  <textarea id="message" name="message" rows="5" placeholder="Please describe how we can help you today..." value={formData.message} onChange={handle} minLength="10" required></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Sending...' : <><FiSend /> Send Message</>}
                </button>
                
                <p className="contact-form__privacy">
                  By submitting this form, you agree to our <a href="#">privacy policy</a>.
                </p>
              </form>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
