import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiStar, FiClock, FiShield, FiDollarSign, FiCreditCard, FiTrendingUp, FiPercent, FiMapPin } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import './Home.css';

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Home() {
  const [amt, setAmt] = useState(10000);
  const [term] = useState(36);
  const apr = 10.5, mr = apr / 100 / 12;
  const mp = amt * (mr * Math.pow(1 + mr, term)) / (Math.pow(1 + mr, term) - 1);
  const [sR, sV] = useInView(), [fR, fV] = useInView(), [rR, rV] = useInView(), [lR, lV] = useInView(), [cR, cV] = useInView();

  return (<>
    <Helmet>
      <title>Rise Credit: Fast, Easy Online Loans & Cash Advances</title>
      <meta name="description" content="Fast, easy loans. Get approved in minutes with same-day funding. Installment loans, payday loans, cash advances and more." />
    </Helmet>
    {/* ===== HERO ===== */}
    <section className="hero" id="hero-section">
      <div className="hero__inner container">
        <div className="hero__content">
          <p className="hero__subtitle-text animate-fade-up">You wear a lot of hats.</p>
          <h1 className="hero__title animate-fade-up delay-1">
            Make it work with fast, easy <span className="hero__accent">loans.</span>
          </h1>
          <ul className="hero__features animate-fade-up delay-2">
            <li><FiCheck className="hero__check" /> Approved in minutes.</li>
            <li><FiCheck className="hero__check" /> Money same day.*</li>
            <li><FiCheck className="hero__check" /> Good credit not needed.</li>
          </ul>
          <div className="hero__actions animate-fade-up delay-3">
            <Link to="/apply" className="btn btn-primary btn-large" id="hero-apply-btn">Apply now <FiArrowRight /></Link>
            <Link to="/rates" className="btn btn-outline btn-large" id="hero-rates-btn">View loans available</Link>
          </div>
          <p className="hero__state-text animate-fade-up delay-4">
            View loans available in <Link to="/rates" className="text-link">your state.</Link>
          </p>
        </div>
        <div className="hero__visual animate-fade-right delay-2">
          <div className="hero__card">
            <div className="hero__card-header"><div className="hero__card-dot" /><span>Loan Approved</span></div>
            <div className="hero__card-amount">$5,000</div>
            <div className="hero__card-detail"><span>APR 10.5%</span><span>36 months</span></div>
            <div className="hero__card-bar"><div className="hero__card-bar-fill" /></div>
            <div className="hero__card-status"><FiCheck /> Funded to your account</div>
          </div>
          <div className="hero__card-float"><FiClock /><span>Same-day funding*</span></div>
        </div>
      </div>
    </section>

    {/* ===== RATINGS BAR ===== */}
    <section className="ratings-bar" id="ratings-bar">
      <div className="container ratings-bar__inner">
        <div className="ratings-bar__item">
          <div className="ratings-bar__stars">
            {[...Array(5)].map((_, i) => <FiStar key={i} className="ratings-bar__star" />)}
          </div>
          <span className="ratings-bar__label"><strong>Trustpilot</strong> 4.9 out of 5 based on 120,203 reviews</span>
        </div>
        <div className="ratings-bar__item">
          <div className="ratings-bar__stars">
            {[...Array(5)].map((_, i) => <FiStar key={i} className="ratings-bar__star" />)}
          </div>
          <span className="ratings-bar__label"><strong>200,000+</strong> reviews on Google</span>
        </div>
      </div>
    </section>

    {/* ===== HOW IT WORKS ===== */}
    <section className="section section--alt" ref={sR} id="how-it-works">
      <div className="container">
        <div className={`sec-header ${sV ? 'animate-fade-up' : ''}`}>
          <div className="section-eyebrow">How it works</div>
          <h2 className="section-title">Getting a loan is fast and easy</h2>
        </div>
        <div className="steps__grid">
          {[
            { num: '1', title: 'Apply', desc: 'Start your application online or apply in the store.', icon: <FiCreditCard /> },
            { num: '2', title: 'Get Approved', desc: 'Get approved within minutes.', icon: <FiCheck /> },
            { num: '3', title: 'Receive Money', desc: 'Receive money the same day.*', icon: <FiDollarSign /> },
          ].map((s, i) => (
            <div className={`steps__card ${sV ? `animate-fade-up delay-${i + 1}` : ''}`} key={s.num}>
              <div className="steps__num">{s.num}</div>
              <div className="card__icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="sec-cta"><Link to="/apply" className="btn btn-primary" id="steps-apply-btn">Apply now <FiArrowRight /></Link></div>
        <p className="text-muted-center">*Online approvals before 10:30 AM ET (M-F) are typically funded to your bank account by 5 PM ET same-day. Approvals after 10:30 AM ET are typically funded the next business day.</p>
      </div>
    </section>

    {/* ===== FEATURES ===== */}
    <section className="section" ref={fR} id="features-section">
      <div className="container">
        <div className={`sec-header ${fV ? 'animate-fade-up' : ''}`}>
          <div className="section-eyebrow">Why Rise Credit</div>
          <h2 className="section-title">Turning someday into today starts at Rise Credit</h2>
          <p className="section-subtitle">Through 25+ years and over 157 million loans, Rise Credit has helped our customers build stronger tomorrows. Let's get started on yours.</p>
        </div>
        <div className="feat__grid">
          {[
            { icon: <FiMapPin />, title: "We're here to help", desc: 'With over 800 locations.' },
            { icon: <FiDollarSign />, title: 'We offer same-day funding*', desc: "Get the money you need to tackle life's curveballs." },
            { icon: <FiShield />, title: 'We keep it real', desc: "We're committed to transparency and protecting your personal information." },
          ].map((f, i) => (
            <div className={`card ${fV ? `animate-fade-up delay-${i + 1}` : ''}`} key={f.title}>
              <div className="card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="sec-cta"><Link to="/rates" className="btn btn-secondary" id="explore-loans-btn">Explore our loans <FiArrowRight /></Link></div>
      </div>
    </section>

    {/* ===== TRUSTED BY MILLIONS ===== */}
    <section className="section section--alt" ref={rR} id="reviews-section">
      <div className="container">
        <div className={`sec-header ${rV ? 'animate-fade-up' : ''}`}>
          <div className="section-eyebrow">Testimonials</div>
          <h2 className="section-title">Trusted by millions of customers</h2>
        </div>

        <div className="trust-badges">
          {['BBB A+', 'State Licensed', 'Trustpilot 4.9★'].map(b => (
            <div className="trust-badge" key={b}>{b}</div>
          ))}
        </div>

        <div className="reviews__grid">
          {[
            {
              badge: '200,000+ reviews on Google',
              text: "I needed urgent money and was able to get it from you guys, eternally grateful, super fast and easy, highly recommend.",
              name: 'Stephanie',
              date: '10/31/2024'
            },
            {
              badge: 'Rated 4.9/5 based on 120,203 reviews',
              text: "Very helpful and knowledgeable, eased my fear of running out of money for the month. Very happy smiling good humored person. I would recommend...",
              name: 'Bernalda',
              date: '27/11/2023'
            },
          ].map((r, i) => (
            <div className={`reviews__card ${rV ? `animate-fade-up delay-${i + 1}` : ''}`} key={r.name}>
              <div className="reviews__stars">{[...Array(5)].map((_, j) => <FiStar key={j} className="reviews__star" />)}</div>
              <p className="reviews__badge-text">{r.badge}</p>
              <p className="reviews__text">"{r.text}"</p>
              <div className="reviews__author">
                <span className="reviews__name">— {r.name}, {r.date}</span>
              </div>
              <div className="reviews__trustpilot">
                <span>Trustpilot</span>
                <div className="reviews__stars reviews__stars--sm">{[...Array(5)].map((_, j) => <FiStar key={j} className="reviews__star" />)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== LOAN TYPES ===== */}
    <section className="section" ref={lR} id="loans-section">
      <div className="container">
        <div className={`sec-header ${lV ? 'animate-fade-up' : ''}`}>
          <div className="section-eyebrow">Our Products</div>
          <h2 className="section-title">Apply for a personal loan from Rise Credit</h2>
          <p className="section-subtitle">Easy and fast online Cash Advances, cash loans and more.</p>
        </div>

        <div className="loans__device-card">
          <span className="loans__device-emoji">📱</span>
          <p>Manage your loan from any device</p>
        </div>

        <div className="loans__grid">
          {[
            { icon: <FiTrendingUp />, title: 'Installment Loans', desc: 'Get the money you need now and repay it over time in fixed monthly installments.' },
            { icon: <FiCreditCard />, title: 'Line of Credit', desc: "Tap into your credit line as needed — you'll only pay interest on what you borrow." },
            { icon: <FiDollarSign />, title: 'Payday Loans', desc: 'Get same-day funds for immediate expenses. Repay the loan in full on your next payday.' },
            { icon: <FiPercent />, title: 'Cash Advances', desc: 'Get quick access to cash to cover urgent expenses. Repay your loan in 2-4 weeks.' },
            { icon: <FiShield />, title: 'Title Loans', desc: "Get a secured loan using your car's value while you keep driving it quickly." },
          ].map((l, i) => (
            <div className={`card ${lV ? `animate-fade-up delay-${i + 1}` : ''}`} key={l.title}>
              <div className="card__icon">{l.icon}</div>
              <h3>{l.title}</h3>
              <p>{l.desc}</p>
            </div>
          ))}
        </div>
        <div className="sec-cta"><Link to="/apply" className="btn btn-primary btn-large" id="loans-apply-btn">Apply now <FiArrowRight /></Link></div>
      </div>
    </section>

    {/* ===== CALCULATOR + NEWSLETTER ===== */}
    <section className="section section--alt" ref={cR} id="calculator-section">
      <div className="container">
        <div className={`calc-news__wrapper ${cV ? 'animate-fade-up' : ''}`}>
          {/* Calculator */}
          <div className="calc__card">
            <h2 className="calc__title">Your Loan Calculator</h2>
            <p className="calc__subtitle">See your potential loan amount.</p>
            <div className="calc__slider-group">
              <label className="calc__label">Loan Amount: <strong>${amt.toLocaleString()}</strong></label>
              <input type="range" min="1000" max="35000" step="100" value={amt} onChange={e => setAmt(+e.target.value)} className="calc__slider" id="loan-amount-slider" />
              <div className="calc__range-labels"><span>$1K</span><span>$35K</span></div>
            </div>
            <div className="calc__results-row">
              <div className="calc__result-box">
                <span className="calc__result-label">Monthly Payment</span>
                <span className="calc__result-value">${mp.toFixed(0)}</span>
              </div>
              <div className="calc__result-box">
                <span className="calc__result-label">Starting APR</span>
                <span className="calc__result-value calc__result-value--apr">{apr}%</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter__card">
            <h2 className="newsletter__title">Let's keep in touch</h2>
            <p className="newsletter__subtitle">Sign up for news, updates and exclusive offers from Rise Credit.</p>
              <form className="newsletter__form" onSubmit={e => {
                e.preventDefault();
                const email = e.target.email.value;
                fetch('https://risecredit-api.onrender.com/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
                  .then(() => { alert('Signed up successfully!'); e.target.reset(); })
                  .catch(() => alert('Sign up failed'));
              }}>
              <div className="form-field">
                <label htmlFor="newsletter-email">Email*</label>
                <input type="email" id="newsletter-email" name="email" placeholder="Enter your email" required />
              </div>
              <div className="form-field">
                <label htmlFor="newsletter-state">State*</label>
                <select id="newsletter-state" name="state" required>
                  <option value="">Select your state</option>
                  {['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} id="newsletter-submit">Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default Home;
