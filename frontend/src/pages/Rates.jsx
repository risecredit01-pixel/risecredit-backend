import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiPhone } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import './Rates.css';

const rateRanges = [
  { range: '$1,000 – $5,000', term: '12–60 months', apr: '18.0% – 28.0% APR' },
  { range: '$5,001 – $15,000', term: '24–60 months', apr: '19.5% – 32.0% APR' },
  { range: '$15,001 – $25,000', term: '36–60 months', apr: '20.0% – 34.0% APR' },
  { range: '$25,001 – $35,000', term: '48–60 months', apr: '22.0% – 35.0% APR' },
];

const fees = [
  { name: 'Origination Fee', status: 'Always Free', amount: '$0', note: 'One-time setup fee', type: 'free' },
  { name: 'Prepayment Penalty', status: 'Always Free', amount: '$0', note: 'Pay off early for free', type: 'free' },
  { name: 'Late Payment Fee', status: 'If Applicable', amount: '$25', note: 'Only if 15+ days late', type: 'warn' },
];

const tips = [
  'Verify banking for up to 5% lower rates',
  'Choose shorter terms for better rates',
  'Higher income can qualify for lower rates',
  'Stable employment history helps',
];

function Rates() {
  return (<>
    <Helmet>
      <title>Rates & Pricing | Rise Credit</title>
      <meta name="description" content="View our transparent pricing and rates. No hidden fees. Get the exact loan terms you need with Rise Credit." />
    </Helmet>
    {/* HERO */}
    <section className="rates-hero" id="rates-hero">
      <div className="container rates-hero__inner">
        <span className="rates-hero__badge">Transparent Rates & Terms</span>
        <h1 className="rates-hero__title">No hidden fees. Just clear, honest pricing.</h1>
        <p className="rates-hero__subtitle">Explore our current rate ranges, fee structure, and insider tips to help you secure the best available offer.</p>
      </div>
    </section>

    {/* RATE RANGES + FEE STRUCTURE */}
    <section className="section section--alt" id="rates-main">
      <div className="container">
        <div className="rates__two-col">
          {/* Left Column */}
          <div className="rates__col">
            {/* Rate Ranges Card */}
            <div className="rates__card">
              <h2 className="rates__card-title">Our Rate Ranges</h2>
              <p className="rates__card-subtitle">Loan terms vary by amount, credit profile, and verification status.</p>

              <div className="rates__ranges">
                {rateRanges.map((r) => (
                  <div className="rates__range-item" key={r.range}>
                    <div className="rates__range-header">
                      <span>{r.range}</span>
                      <span>{r.term}</span>
                    </div>
                    <p className="rates__range-apr">{r.apr}</p>
                  </div>
                ))}
              </div>

              <div className="rates__note">
                Your actual rate depends on credit score, income, loan amount, term, and banking verification status.
              </div>
            </div>

            {/* Custom Terms */}
            <div className="rates__custom-card">
              <p className="rates__custom-title">Need custom terms?</p>
              <p className="rates__custom-text">
                Speak with our lending specialists at{' '}
                <a href="tel:+18303539921" className="rates__phone-link">+1 (830) 353-9921</a>{' '}or{' '}
                <a href="tel:+18303771366" className="rates__phone-link">+1 (830) 377-1366</a>{' '}
                or visit your local branch for tailored options.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="rates__col">
            {/* Fee Structure Card */}
            <div className="rates__card">
              <h2 className="rates__card-title">Fee Structure</h2>
              <p className="rates__card-subtitle">Simple, transparent fees that are easy to understand.</p>

              <div className="rates__fees">
                {fees.map((f) => (
                  <div className={`rates__fee-item rates__fee-item--${f.type}`} key={f.name}>
                    <div className="rates__fee-header">
                      <span>{f.name}</span>
                      <span>{f.status}</span>
                    </div>
                    <p className="rates__fee-amount">{f.amount}</p>
                    <p className="rates__fee-note">{f.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Improvement Tips */}
            <div className="rates__tips-card">
              <h3 className="rates__tips-title">Rate Improvement Tips</h3>
              <ul className="rates__tips-list">
                {tips.map((tip, i) => (
                  <li key={i}>
                    <span className="rates__tip-num">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* REPRESENTATIVE EXAMPLE + STATE DISCLOSURES */}
    <section className="section" id="rates-bottom">
      <div className="container">
        <div className="rates__bottom-grid">
          <div className="rates__card">
            <h2 className="rates__card-title">Representative Example</h2>
            <p className="rates__example-text">
              Borrow $8,000 for 36 months at 10.5% APR. Monthly payments will be approximately $260, with total interest of $1,360.72. No origination or prepayment fees apply.
            </p>
          </div>

          <div className="rates__card">
            <h3 className="rates__card-title">State Disclosures</h3>
            <p className="rates__disclosure-text">
              Rates may vary by state. Review state-specific disclosures before applying. Additional regulations may apply for residents of CA, NY, and TX.
            </p>
            <p className="rates__disclosure-text">
              Call <a href="tel:+18303539921" className="rates__phone-link">+1 (830) 353-9921</a> or <a href="tel:+18303771366" className="rates__phone-link">+1 (830) 377-1366</a> to confirm eligibility and available products in your area.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="cta-banner" id="rates-cta">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2>Know your rate in minutes</h2>
        <p>Apply online and get a personalized offer based on your credit profile.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <Link to="/apply" className="cta-banner__btn">Start Application <FiArrowRight /></Link>
        </div>
      </div>
    </section>
  </>);
}

export default Rates;
