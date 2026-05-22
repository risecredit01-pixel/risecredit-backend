import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rates from './pages/Rates';
import Apply from './pages/Apply';
import Partners from './pages/Partners';
import CreditInsurance from './pages/CreditInsurance';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Silent wake-up ping – Render free tier sleeps after inactivity.
// This fires on first page load so the backend is warm by the time user needs it.
function WakeUpBackend() {
  useEffect(() => {
    fetch('https://risecredit-api.onrender.com/api/health').catch(() => {});
  }, []);
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <WakeUpBackend />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/creditinsurance" element={<CreditInsurance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
