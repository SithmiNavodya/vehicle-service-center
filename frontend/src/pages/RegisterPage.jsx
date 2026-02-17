import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [mounted, setMounted]   = useState(false);
  const location   = useLocation();
  const navigate   = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    setMounted(true);
    const p = new URLSearchParams(location.search).get('email');
    if (p) setFormData(prev => ({ ...prev, email: p }));
  }, [location]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError(''); setSuccess('');
    const result = await register(formData);
    if (result.success) {
      setSuccess('Account created! Redirecting to sign in…');
      setTimeout(() => navigate(`/login?email=${encodeURIComponent(formData.email)}`), 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Figtree:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue-50: #f0f7ff;
          --blue-100: #e0f0fe;
          --blue-200: #bae0fd;
          --blue-300: #7cc5fb;
          --blue-400: #3aa6f5;
          --blue-500: #1a83e6;
          --blue-600: #0e66c2;
          --blue-700: #0a4f9c;
          --blue-800: #093f7a;
          --blue-900: #0a2b4f;
          --white: #ffffff;
          --off-white: #fafcff;
          --ink: #1e2b3f;
          --ink-light: #4b5a6e;
          --ink-lighter: #7f8b9f;
          --border: #dbe5f0;
          --red: #e54c4c;
          --green: #10b981;
          --green-bg: #e7f7f0;
          --green-bd: #a7e0cb;
        }

        html, body { height: 100%; }

        .rp-root {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--blue-50) 0%, var(--off-white) 100%);
          display: flex;
          font-family: 'Figtree', sans-serif;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .rp-root.in { opacity: 1; transform: translateY(0); }

        /* ── LEFT PANEL ── */
        .rp-left {
          width: 45%;
          min-height: 100vh;
          background: linear-gradient(145deg, var(--blue-900) 0%, #123a6b 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3.5rem;
          flex-shrink: 0;
        }
        .rp-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Geometric art */
        .geo-circle {
          position: absolute; border-radius: 50%;
          border: 1.5px solid rgba(58, 166, 245, 0.25);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse-ring 6s ease-in-out infinite;
        }
        .geo-c1 { width: 420px; height: 420px; }
        .geo-c2 { width: 280px; height: 280px; border-color: rgba(58, 166, 245, 0.35); animation-delay: 1.5s; }
        .geo-c3 { width: 160px; height: 160px; background: rgba(58, 166, 245, 0.08); border-color: rgba(58, 166, 245, 0.5); animation-delay: 3s; }

        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50%       { transform: translate(-50%, -50%) scale(1.04); opacity: 0.7; }
        }

        .geo-line {
          position: absolute; width: 2px; height: 220px;
          background: linear-gradient(to bottom, transparent, var(--blue-400), transparent);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(35deg);
          opacity: 0.55;
        }
        .geo-line-2 { transform: translate(-50%, -50%) rotate(-55deg); opacity: 0.3; }

        .geo-dot { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: var(--blue-400); opacity: 0.7; }
        .geo-d1 { top: 3.5rem; right: 3.5rem; }
        .geo-d2 { bottom: 3.5rem; left: 3.5rem; }

        .tick-row { position: absolute; bottom: 5.5rem; right: 3.5rem; display: flex; flex-direction: column; gap: 6px; }
        .tick { width: 24px; height: 2px; background: rgba(255,255,255,0.2); border-radius: 2px; }
        .tick:first-child { width: 40px; background: var(--blue-400); }

        /* Logo */
        .rp-logo { position: relative; z-index: 2; display: flex; align-items: center; gap: 10px; }
        .rp-logo-mark {
          width: 40px; height: 40px;
          border: 2px solid var(--blue-400);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
        }
        .rp-logo-mark span {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--blue-300);
          line-height: 1;
        }
        .rp-logo-name {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
        }

        /* Left copy */
        .rp-left-copy { position: relative; z-index: 2; }
        .rp-tagline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 2.9rem);
          font-weight: 900;
          color: var(--white);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
        }
        .rp-tagline em { color: var(--blue-300); font-style: normal; }
        .rp-desc {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          max-width: 300px;
          font-weight: 300;
          margin-bottom: 1.5rem;
        }

        /* Benefits list */
        .rp-benefits {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .rp-benefit {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rp-benefit-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--blue-400);
          flex-shrink: 0;
          box-shadow: 0 0 10px var(--blue-400);
        }
        .rp-benefit-txt {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
        }

        /* Left footer */
        .rp-left-foot { position: relative; z-index: 2; margin-top: 2rem; }
        .rp-trust {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.04em;
        }

        /* ── RIGHT PANEL ── */
        .rp-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 2.5rem 4rem;
          background: linear-gradient(135deg, var(--off-white) 0%, var(--white) 100%);
          position: relative;
          overflow-y: auto;
        }
        .rp-right::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(26, 131, 230, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none; opacity: 0.5;
        }

        .rp-form-wrap { width: 100%; max-width: 400px; position: relative; z-index: 1; padding: 1rem 0; }

        /* Eyebrow + heading */
        .form-eyebrow {
          font-size: 0.725rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--blue-500); margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 8px;
        }
        .form-eyebrow::after { content: ''; flex: 1; height: 1px; background: var(--blue-400); opacity: 0.3; }

        .form-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          font-weight: 900;
          color: var(--ink);
          line-height: 1.05;
          letter-spacing: -0.025em;
          margin-bottom: 0.4rem;
        }
        .form-sub {
          font-size: 0.9rem;
          color: var(--ink-lighter);
          margin-bottom: 1.75rem;
          font-weight: 300;
        }

        /* Alerts */
        .alert-bar {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 0.875rem 1rem;
          border-radius: 0 8px 8px 0;
          margin-bottom: 1.5rem;
          animation: alertSlide 0.3s ease;
        }
        @keyframes alertSlide { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .alert-err { background: #feeceb; border-left: 3px solid var(--red); }
        .alert-ok  { background: var(--green-bg); border-left: 3px solid var(--green); }
        .alert-bar span { font-size: 0.8125rem; line-height: 1.5; }
        .alert-err span { color: var(--red); }
        .alert-ok  span { color: var(--green); }

        /* Fields */
        .fields { display: flex; flex-direction: column; gap: 1rem; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }

        .field-lbl {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--blue-700);
          margin-bottom: 0.45rem;
        }
        .field-wrap { position: relative; }
        .field-in {
          width: 100%; padding: 0.8125rem 1rem;
          background: var(--white); border: 1.5px solid var(--border);
          border-radius: 10px; font-family: 'Figtree', sans-serif;
          font-size: 0.9375rem; color: var(--ink); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-in::placeholder { color: #a7b8cc; }
        .field-in:focus { border-color: var(--blue-400); box-shadow: 0 0 0 3px rgba(58, 166, 245, 0.1); }
        .field-in.has-pw { padding-right: 3rem; }

        .pw-btn {
          position: absolute; right: 0.875rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--ink-lighter);
          display: flex; align-items: center; padding: 2px; transition: color 0.2s;
        }
        .pw-btn:hover { color: var(--blue-500); }

        /* Password strength */
        .pw-strength { display: flex; gap: 4px; margin-top: 6px; }
        .pw-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
        .pw-bar.weak   { background: #e74c3c; }
        .pw-bar.medium { background: var(--blue-400); }
        .pw-bar.strong { background: var(--green); }
        .pw-hint { font-size: 0.7rem; color: var(--ink-lighter); margin-top: 4px; }

        /* CTA */
        .cta-btn {
          width: 100%; padding: 1rem 1.5rem; margin-top: 1.5rem;
          background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
          color: var(--white);
          border: none; border-radius: 10px;
          font-family: 'Figtree', sans-serif;
          font-size: 1rem; font-weight: 600; letter-spacing: 0.02em;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 8px 20px rgba(26, 131, 230, 0.3);
        }
        .cta-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
          transform: translateX(-100%); transition: transform 0.5s ease;
        }
        .cta-btn:hover::after { transform: translateX(100%); }
        .cta-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(26, 131, 230, 0.4);
        }
        .cta-btn:active:not(:disabled) { transform: translateY(0); }
        .cta-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .cta-arrow {
          width: 22px; height: 22px;
          border: 2px solid rgba(255,255,255,0.7); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: border-color 0.2s, transform 0.2s;
        }
        .cta-btn:hover .cta-arrow { border-color: var(--white); transform: translateX(4px); }
        .cta-arrow svg { width: 10px; height: 10px; }

        .spin {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Bottom */
        .bottom-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 1.75rem; padding-top: 1.5rem; border-top: 1px solid var(--border);
        }
        .bottom-txt { font-size: 0.8125rem; color: var(--ink-lighter); }
        .bottom-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--blue-600);
          text-decoration: none;
          border-bottom: 1.5px solid var(--blue-400);
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }
        .bottom-link:hover { color: var(--blue-800); border-color: var(--blue-600); }

        .home-a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--ink-lighter);
          text-decoration: none;
          transition: color 0.2s;
        }
        .home-a:hover { color: var(--blue-600); }
        .home-a svg { width: 14px; height: 14px; }

        @media (max-width: 780px) {
          .rp-left { display: none; }
          .rp-right { padding: 2rem 1.5rem; }
          .form-heading { font-size: 2rem; }
          .field-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className={`rp-root${mounted ? ' in' : ''}`}>

        {/* ── LEFT PANEL ── */}
        <div className="rp-left">
          {/* Geometric art */}
          <div className="geo-circle geo-c1" />
          <div className="geo-circle geo-c2" />
          <div className="geo-circle geo-c3" />
          <div className="geo-line" />
          <div className="geo-line geo-line-2" />
          <div className="geo-dot geo-d1" />
          <div className="geo-dot geo-d2" />
          <div className="tick-row">
            <div className="tick" /><div className="tick" /><div className="tick" />
          </div>

          {/* Logo - Updated to VCS Manager */}
          <div className="rp-logo">
            <div className="rp-logo-mark"><span>VCS</span></div>
            <span className="rp-logo-name">VCS Manager</span>
          </div>

          {/* Copy - Updated for vehicle service center */}
          <div className="rp-left-copy">
            <h2 className="rp-tagline">Join us,<br/><em>get started.</em></h2>
            <p className="rp-desc">
              Create your account and unlock everything VCS Manager has to offer for your vehicle service center.
            </p>
            <div className="rp-benefits">
              <div className="rp-benefit">
                <div className="rp-benefit-dot"/>
                <span className="rp-benefit-txt">Schedule & track vehicle repairs</span>
              </div>
              <div className="rp-benefit">
                <div className="rp-benefit-dot"/>
                <span className="rp-benefit-txt">Real-time service updates & alerts</span>
              </div>
              <div className="rp-benefit">
                <div className="rp-benefit-dot"/>
                <span className="rp-benefit-txt">Manage parts inventory & suppliers</span>
              </div>
              <div className="rp-benefit">
                <div className="rp-benefit-dot"/>
                <span className="rp-benefit-txt">Secure customer & vehicle database</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="rp-left-foot">
            <p className="rp-trust">Free to join · No credit card required</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="rp-right">
          <div className="rp-form-wrap">

            <div className="form-eyebrow">Create Account</div>
            <h1 className="form-heading">Let's get<br/>you in.</h1>
            <p className="form-sub">Fill in your details to create your account.</p>

            {error && (
              <div className="alert-bar alert-err">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e54c4c" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:'1px'}}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert-bar alert-ok">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:'1px'}}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="fields">

                {/* Name row */}
                <div className="field-row">
                  <div>
                    <label className="field-lbl">First Name</label>
                    <input
                      type="text" name="firstName" className="field-in"
                      placeholder="John"
                      value={formData.firstName} onChange={handleChange} required
                    />
                  </div>
                  <div>
                    <label className="field-lbl">Last Name</label>
                    <input
                      type="text" name="lastName" className="field-in"
                      placeholder="Doe"
                      value={formData.lastName} onChange={handleChange} required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="field-lbl">Email Address</label>
                  <input
                    type="email" name="email" className="field-in"
                    placeholder="you@example.com"
                    value={formData.email} onChange={handleChange} required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="field-lbl">Password</label>
                  <div className="field-wrap">
                    <input
                      type={showPw ? 'text' : 'password'} name="password"
                      className="field-in has-pw"
                      placeholder="Min. 6 characters"
                      value={formData.password} onChange={handleChange} required
                    />
                    <button type="button" className="pw-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {/* Strength bars */}
                  {formData.password.length > 0 && (
                    <>
                      <div className="pw-strength">
                        <div className={`pw-bar ${formData.password.length >= 1 ? (formData.password.length < 6 ? 'weak' : formData.password.length < 10 ? 'medium' : 'strong') : ''}`} />
                        <div className={`pw-bar ${formData.password.length >= 6 ? (formData.password.length < 10 ? 'medium' : 'strong') : ''}`} />
                        <div className={`pw-bar ${formData.password.length >= 10 ? 'strong' : ''}`} />
                      </div>
                      <p className="pw-hint">
                        {formData.password.length < 6 ? 'Too short' : formData.password.length < 10 ? 'Good — could be stronger' : 'Strong password'}
                      </p>
                    </>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="field-lbl">Phone <span style={{color:'var(--ink-lighter)',textTransform:'none',letterSpacing:'0',fontWeight:400,fontSize:'0.7rem'}}>(optional)</span></label>
                  <input
                    type="tel" name="phone" className="field-in"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>

              </div>

              <button type="submit" className="cta-btn" disabled={loading}>
                {loading ? (
                  <><div className="spin" /> Creating account…</>
                ) : (
                  <>Create Account
                    <div className="cta-arrow">
                      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6h8M6 2l4 4-4 4"/>
                      </svg>
                    </div>
                  </>
                )}
              </button>
            </form>

            <div className="bottom-row">
              <span className="bottom-txt">
                Have an account?{' '}
                <Link to={`/login${formData.email ? `?email=${encodeURIComponent(formData.email)}` : ''}`} className="bottom-link">
                  Sign in
                </Link>
              </span>
              <Link to="/" className="home-a">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default RegisterPage;