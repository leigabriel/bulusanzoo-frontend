import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'bulusan_cookie_consent_v1';

export const getCookieConsent = () => {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const setCookieConsent = (accepted) => {
    const record = {
        decision: accepted ? 'accepted' : 'declined',
        timestamp: new Date().toISOString()
    };
    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch {
        // Storage can be unavailable in private browsing or restricted contexts.
    }
    return record;
};

const CookieConsentBanner = () => {
    const [visible, setVisible] = useState(false);
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const hasDecision = getCookieConsent();
        if (!hasDecision) {
            setVisible(true);
            // Defer so the enter transition actually plays on mount.
            const id = requestAnimationFrame(() => setEntered(true));
            return () => cancelAnimationFrame(id);
        }
    }, []);

    const handleDecision = (accepted) => {
        setCookieConsent(accepted);
        setEntered(false);
        window.setTimeout(() => setVisible(false), 150);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            className={`fixed z-[90] bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6
                w-auto sm:w-[360px] transition-all duration-200 ease-out
                ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
            <div className="bg-white border border-[#1f2d23]/12 rounded-2xl shadow-[0_14px_34px_-12px_rgba(29,74,46,0.45)] px-5 py-4">
                <p className="text-sm font-semibold text-[#1d4a2e] mb-1.5">
                    Cookie notice
                </p>
                <p className="text-[13px] text-[#1d4a2e]/75 leading-relaxed mb-4">
                    We use cookies to keep this site secure, understand how it's used, and
                    process payments through PayMongo.{' '}
                    <Link
                        to="/cookies"
                        className="text-emerald-700 underline underline-offset-2 decoration-emerald-700/30 hover:decoration-emerald-700"
                    >
                        Read our policy
                    </Link>
                    .
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleDecision(true)}
                        className="min-h-11 flex-1 px-3.5 py-2 rounded-full bg-[#1d4a2e] hover:bg-[#1f7a3e] text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDecision(false)}
                        className="min-h-11 flex-1 px-3.5 py-2 rounded-full border border-[#1d4a2e]/20 text-[#1d4a2e] text-sm font-semibold hover:bg-[#e6f1df] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentBanner;