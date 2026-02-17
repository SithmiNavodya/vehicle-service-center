import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    setMounted(true);
    const p = new URLSearchParams(location.search).get('email');
    if (p) setEmail(p);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await login(email, password);
    if (!result.success) setError(result.error);
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
        }

        html, body { height: 100%; }

        .lr-root {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--blue-50) 0%, var(--off-white) 100%);
          display: flex;
          font-family: 'Figtree', sans-serif;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .lr-root.in { opacity: 1; transform: translateY(0); }

        /* LEFT PANEL */
        .lr-left {
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
        .lr-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .geo-circle {
          position: absolute;
          width: 420px; height: 420px;
          border-radius: 50%;
          border: 1.5px solid rgba(58, 166, 245, 0.25);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse-ring 6s ease-in-out infinite;
        }
        .geo-circle-2 {
          width: 280px; height: 280px;
          border-color: rgba(58, 166, 245, 0.35);
          animation-delay: 1.5s;
        }
        .geo-circle-3 {
          width: 160px; height: 160px;
          background: rgba(58, 166, 245, 0.08);
          border-color: rgba(58, 166, 245, 0.5);
          animation-delay: 3s;
        }
        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50%       { transform: translate(-50%, -50%) scale(1.04); opacity: 0.7; }
        }
        .geo-line {
          position: absolute;
          width: 2px; height: 220px;
          background: linear-gradient(to bottom, transparent, var(--blue-400), transparent);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(35deg);
          opacity: 0.55;
        }
        .geo-line-2 { transform: translate(-50%, -50%) rotate(-55deg); opacity: 0.3; }

        .geo-dot {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--blue-400); opacity: 0.7;
        }
        .geo-dot-1 { top: 3.5rem; right: 3.5rem; }
        .geo-dot-2 { bottom: 3.5rem; left: 3.5rem; }

        .tick-row {
          position: absolute;
          bottom: 5.5rem; right: 3.5rem;
          display: flex; flex-direction: column; gap: 6px;
        }
        .tick { width: 24px; height: 2px; background: rgba(255,255,255,0.2); border-radius: 2px; }
        .tick:first-child { width: 40px; background: var(--blue-400); }

        .lr-logo {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 12px;
        }
        .lr-logo-mark {
          width: 44px; height: 44px;
          border: 2px solid var(--blue-400); border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
        }
        .lr-logo-mark span {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem; font-weight: 900; color: var(--blue-300); line-height: 1;
        }
        .lr-logo-name {
          font-size: 1rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.9);
        }

        .lr-left-copy { position: relative; z-index: 2; }
        .lr-tagline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 900; color: var(--white);
          line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 1.25rem;
        }
        .lr-tagline em { color: var(--blue-300); font-style: normal; }
        .lr-desc {
          font-size: 1rem; color: rgba(255,255,255,0.7);
          line-height: 1.7; max-width: 320px; font-weight: 300;
        }

        /* RIGHT PANEL */
        .lr-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 3rem 4rem; background: linear-gradient(135deg, var(--off-white) 0%, var(--white) 100%);
          position: relative;
        }
        .lr-right::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(26, 131, 230, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none; opacity: 0.5;
        }

        .lr-form-wrap {
          width: 100%; max-width: 380px; position: relative; z-index: 1;
        }

        .form-eyebrow {
          font-size: 0.725rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--blue-500); margin-bottom: 0.75rem;
          display: flex; align-items: center; gap: 8px;
        }
        .form-eyebrow::after {
          content: ''; flex: 1; height: 1px;
          background: var(--blue-400); opacity: 0.3;
        }
        .form-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem; font-weight: 900; color: var(--ink);
          line-height: 1.05; letter-spacing: -0.025em; margin-bottom: 0.5rem;
        }
        .form-sub {
          font-size: 0.9rem; color: var(--ink-lighter);
          margin-bottom: 2.25rem; font-weight: 300;
        }

        .err-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 0.875rem 1rem;
          background: #feeceb;
          border-left: 3px solid var(--red);
          border-radius: 0 8px 8px 0;
          margin-bottom: 1.5rem;
          animation: errSlide 0.3s ease;
        }
        @keyframes errSlide {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .err-msg { font-size: 0.8125rem; color: var(--red); }

        .fields { display: flex; flex-direction: column; gap: 1.125rem; }
        .field-lbl {
          display: block; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--blue-700); margin-bottom: 0.5rem;
        }
        .field-wrap { position: relative; }
        .field-in {
          width: 100%; padding: 0.875rem 1rem;
          background: var(--white); border: 1.5px solid var(--border);
          border-radius: 10px; font-family: 'Figtree', sans-serif;
          font-size: 0.9375rem; color: var(--ink); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-in::placeholder { color: #a7b8cc; }
        .field-in:focus {
          border-color: var(--blue-400);
          box-shadow: 0 0 0 3px rgba(58, 166, 245, 0.1);
        }
        .field-in.has-pw { padding-right: 3rem; }

        .pw-btn {
          position: absolute; right: 0.875rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--ink-lighter); display: flex; align-items: center;
          padding: 2px; transition: color 0.2s;
        }
        .pw-btn:hover { color: var(--blue-500); }

        .meta-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 1rem;
        }
        .check-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .check-input { accent-color: var(--blue-500); cursor: pointer; }
        .check-txt { font-size: 0.8125rem; color: var(--ink-light); }
        .forgot-a {
          font-size: 0.8125rem; font-weight: 500;
          color: var(--blue-500); text-decoration: none; transition: color 0.2s;
        }
        .forgot-a:hover { color: var(--blue-700); }

        .cta-btn {
          width: 100%; padding: 1rem 1.5rem; margin-top: 1.75rem;
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
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .bottom-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border);
        }
        .bottom-txt { font-size: 0.8125rem; color: var(--ink-lighter); }
        .bottom-link {
          font-size: 0.8125rem; font-weight: 600; color: var(--blue-600);
          text-decoration: none; border-bottom: 1.5px solid var(--blue-400);
          padding-bottom: 1px; transition: color 0.2s, border-color 0.2s;
        }
        .bottom-link:hover { color: var(--blue-800); border-color: var(--blue-600); }

        .home-a {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.8125rem; font-weight: 500;
          color: var(--ink-lighter); text-decoration: none; transition: color 0.2s;
        }
        .home-a:hover { color: var(--blue-600); }
        .home-a svg { width: 14px; height: 14px; }

        @media (max-width: 780px) {
          .lr-left { display: none; }
          .lr-right { padding: 2rem 1.5rem; }
          .form-heading { font-size: 2rem; }
        }
      `}</style>

      <div className={`lr-root${mounted ? ' in' : ''}`}>

        {/* LEFT PANEL */}
        <div className="lr-left">
          <div className="geo-circle" />
          <div className="geo-circle geo-circle-2" />
          <div className="geo-circle geo-circle-3" />
          <div className="geo-line" />
          <div className="geo-line geo-line-2" />
          <div className="geo-dot geo-dot-1" />
          <div className="geo-dot geo-dot-2" />
          <div className="tick-row">
            <div className="tick" /><div className="tick" /><div className="tick" />
          </div>

          <div className="lr-logo">
            <div className="lr-logo-mark"><span>VCS</span></div>
            <span className="lr-logo-name">VCS Manager</span>
          </div>

          <div className="lr-left-copy">
            <h2 className="lr-tagline">
              Streamline your<br/><em>vehicle service center</em>
            </h2>
            <p className="lr-desc">
              Manage repairs, track inventory, and delight your customers — all in one powerful platform.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lr-right">
          <div className="lr-form-wrap">

            <div className="form-eyebrow">Sign In</div>
            <h1 className="form-heading">Welcome<br/>back.</h1>
            <p className="form-sub">Enter your credentials to continue.</p>

            {error && (
              <div className="err-bar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e54c4c" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span className="err-msg">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="fields">
                <div>
                  <label className="field-lbl">Email Address</label>
                  <input
                    type="email" className="field-in"
                    placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                </div>
                <div>
                  <label className="field-lbl">Password</label>
                  <div className="field-wrap">
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="field-in has-pw"
                      placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)} required
                    />
                    <button type="button" className="pw-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="meta-row">
                <label className="check-label">
                  <input type="checkbox" className="check-input" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <span className="check-txt">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-a">Forgot password?</Link>
              </div>

              <button type="submit" className="cta-btn" disabled={loading}>
                {loading ? (
                  <><div className="spin" /> Signing in…</>
                ) : (
                  <>
                    Sign In
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
                No account?{' '}
                <Link to={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`} className="bottom-link">
                  Create one
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

export default LoginPage;