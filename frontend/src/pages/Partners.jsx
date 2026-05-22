import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCreditCard, FiSmartphone, FiShoppingBag } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import './Partners.css';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/admin'
  : 'https://risecredit-api.onrender.com/api/admin';

// Fallback partners used when database is empty or API fails
const fallbackPartners = [
  {
    name: 'Visa',
    desc: 'Real-time card processing ensures that purchases and repayments clear quickly.',
    bullets: ['Tap or swipe at any branch checkout counter.', 'Enhanced fraud monitoring on every transaction.'],
  },
  {
    name: 'PayPal',
    desc: 'Flexible online payments let you manage balances on your schedule.',
    bullets: ['Link your PayPal account for instant funding.', 'Secure two-factor authentication keeps access safe.'],
  },
  {
    name: 'Apple Pay',
    desc: 'Use your iPhone or Apple Watch for contactless payments in every Rise Credit branch.',
    bullets: ['Tokenized transactions protect your card details.', 'Lightning-fast checkout with Face ID or Touch ID.'],
  },
  {
    name: 'American Express',
    desc: 'Premium benefits and customer service to match your busy schedule.',
    bullets: ['Preferred rates for qualified Rise Credit customers.', '24/7 card support no matter where you travel.'],
  },
];

function Partners() {
  const [partners, setPartners] = useState(fallbackPartners);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${API_BASE}/partners`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Map API data to the shape the page expects
          setPartners(data.map(p => ({
            name: p.name,
            desc: p.description,
            bullets: p.bullets || [],
          })));
        }
      } catch (err) {
        // Keep fallback partners on network error
      }
    };
    fetchPartners();
  }, []);

  return (<>
    <Helmet>
      <title>Financial Partners | Rise Credit</title>
      <meta name="description" content="Rise Credit works with leading banks, card networks, and digital wallets to make sure your funds arrive quickly and securely." />
    </Helmet>
    {/* ===== HERO ===== */}
    <section className="partners-hero" id="partners-hero">
      <div className="container partners-hero__row">
        <div className="partners-hero__left">
          <span className="partners-hero__badge">
            <span className="partners-hero__badge-dot" />
            Trusted nationwide partners
          </span>
          <h1 className="partners-hero__title">Financial partners who help us serve you faster.</h1>
          <p className="partners-hero__subtitle">Rise Credit works with leading banks, card networks, and digital wallets to make sure your funds arrive quickly and securely—online or in-store.</p>
          <div className="partners-hero__actions">
            <Link to="/apply" className="btn btn-primary btn-large">Start an application</Link>
            <Link to="/contact" className="btn btn-outline btn-large">Talk with support</Link>
          </div>
        </div>
        <div className="partners-hero__right">
          <div className="partners-hero__card">
            <h2 className="partners-hero__card-title">Why partnerships matter</h2>
            <ul className="partners-hero__card-list">
              <li><span className="partners-hero__num">1</span>Faster deposits and withdrawals with trusted banking rails.</li>
              <li><span className="partners-hero__num">2</span>Secure payment processing that keeps your data protected.</li>
              <li><span className="partners-hero__num">3</span>In-person convenience across 1,300+ branch and retail partners.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* ===== HOW WE WORK ===== */}
    <section className="section" id="partner-types">
      <div className="container">
        <div className="sec-header">
          <h2 className="section-title">Digital and in-person partners working for you</h2>
          <p className="section-subtitle">From mobile wallets to local retailers, we collaborate with best-in-class providers so you can access funds however it suits you.</p>
        </div>
        <div className="partners-types__grid">
          {[
            { num: '01', icon: <FiCreditCard />, title: 'Payment networks', desc: 'Trusted card brands like Visa, Mastercard, and American Express help us deliver reliable transactions every day.' },
            { num: '02', icon: <FiSmartphone />, title: 'Digital wallets', desc: 'Apple Pay, PayPal, and other mobile wallets give you seamless checkout whether you are on your phone or in a branch.' },
            { num: '03', icon: <FiShoppingBag />, title: 'Retail partners', desc: 'Nationwide retailers extend our reach so you can make payments or pick up cash where it\'s most convenient.' },
          ].map(c => (
            <div className="partners-types__card" key={c.num}>
              <div className="partners-types__num">{c.num}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== FEATURED PARTNERS (DYNAMIC) ===== */}
    <section className="section section--alt" id="featured-partners">
      <div className="container">
        <div className="sec-header">
          <h2 className="section-title">Meet a few of our featured partners</h2>
          <p className="section-subtitle">We review every partnership to ensure compliance, security, and the ability to serve you better.</p>
        </div>
        <div className="partners-featured__grid">
          {partners.map(p => (
            <div className="partners-featured__card" key={p.name}>
              <div className="partners-featured__header">
                <div className="partners-featured__logo">{p.name.charAt(0)}</div>
                <div>
                  <h3 className="partners-featured__name">{p.name}</h3>
                  <p className="partners-featured__desc">{p.desc}</p>
                </div>
              </div>
              {p.bullets && p.bullets.length > 0 && (
                <ul className="partners-featured__bullets">
                  {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== CTA ===== */}
    <section className="section" id="partners-cta">
      <div className="container">
        <div className="partners-cta">
          <div className="partners-cta__text">
            <h2 className="partners-cta__title">Ready to tap into our partner network?</h2>
            <p className="partners-cta__desc">Submit your application to see lending options available in your area—or chat with a specialist to learn more about regional partners.</p>
          </div>
          <div className="partners-cta__actions">
            <Link to="/apply" className="btn btn-primary">Apply online</Link>
            <Link to="/contact" className="btn btn-outline">Contact us</Link>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Partners;
