import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiTwitter } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';
import './Footer.css';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 
  'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__top container">
        <div className="footer__grid">
          <div className="footer__col">
            <h4 className="footer__heading">About</h4>
            <ul>
              <li><Link to="/">Our Videos</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Customer Reviews</Link></li>
              <li><Link to="/">Money Tips</Link></li>
              <li><Link to="/">News</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Support</h4>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/">Store Locator</Link></li>
              <li><Link to="/">FAQs</Link></li>
              <li><Link to="/">Security</Link></li>
              <li><Link to="/">Site Accessibility</Link></li>
              <li><Link to="/">Site Map</Link></li>
            </ul>
          </div>

          <div className="footer__col footer__col--states">
            <h4 className="footer__heading">Find a Loan in Your State</h4>
            <div className="footer__states-grid">
              {states.map((s) => (
                <Link to="/" key={s} className="footer__state-link">{s}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom-row">
          <div className="footer__social">
            <a href="/" className="footer__social-icon" aria-label="Facebook"><FiFacebook /></a>
            <a href="/" className="footer__social-icon" aria-label="Instagram"><FiInstagram /></a>
            <a href="/" className="footer__social-icon" aria-label="YouTube"><FiYoutube /></a>
            <a href="/" className="footer__social-icon" aria-label="Pinterest"><FaPinterestP /></a>
            <a href="/" className="footer__social-icon" aria-label="X (Twitter)"><FiTwitter /></a>
          </div>

          <div className="footer__legal-links">
            <Link to="/">Privacy & Terms</Link>
            <span className="footer__divider">|</span>
            <Link to="/">Cookies & Advertising</Link>
          </div>
        </div>

        <div className="footer__badges">
          {['Direct Lender', 'OLA Member', 'Great Place', 'BBB A+'].map(b => (
            <div className="footer__badge" key={b}>{b}</div>
          ))}
        </div>
      </div>

      <div className="footer__legal-text container">
        <p>
          © 2025 Rise Credit, LLC. All Rights Reserved.
        </p>
        <p>
          Subject to approval. See your local store for more details and additional disclosures. All loans made in California are made pursuant to the California Financing Law. Licensed by the Delaware State Bank Commissioner to engage in business in Delaware. Rhode Island Licensed Check Casher. In Tennessee, a registered credit services organization ("CSO"), and subject to lender's approval.
        </p>
        <p>
          Title Loans mentioned on this website are offered by LoanCenter. Rise Credit is not the lender of these loans. In California, loans are made pursuant to the California Department of Financial Protection and Innovation California Finance Lenders license, with a minimum loan amount of $2,510.
        </p>
        <p>
          *Online approvals before 10:30 AM ET (M-F) are typically funded by 5 PM ET same-day. Approvals after 10:30 AM ET are typically funded next banking day.
        </p>
      </div>

      <div className="footer__sponsor">
        <div className="footer__sponsor-badge">Official Sponsor of Making It Work</div>
      </div>
    </footer>
  );
}

export default Footer;
