// Cookie Consent Banner
(function () {
    'use strict';

    // Check if user has already given consent
    if (localStorage.getItem('cookieConsent')) {
        return;
    }

    // Create banner HTML
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(30, 41, 59, 0.98));
        backdrop-filter: blur(10px);
        border-top: 2px solid rgba(168, 85, 247, 0.3);
        padding: 1.5rem;
        z-index: 9999;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
    `;

    banner.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;">
            <div style="flex: 1; min-width: 300px;">
                <p style="color: #fff; margin: 0 0 0.5rem 0; font-size: 1.1rem; font-weight: 600;">
                    <i class="fas fa-cookie-bite" style="color: #a855f7; margin-right: 0.5rem;"></i>
                    Cookie Notice
                </p>
                <p style="color: #d1d5db; margin: 0; font-size: 0.9rem; line-height: 1.5;">
                    We use cookies to improve your browsing experience, analyze site traffic, and personalize content. 
                    By clicking "Accept All", you consent to our use of cookies. 
                    <a href="cookie-policy.html" style="color: #a855f7; text-decoration: underline;">Learn more</a> or 
                    <a href="privacy.html" style="color: #a855f7; text-decoration: underline;">Privacy Policy</a>
                </p>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button id="cookie-settings-btn" style="
                    background: transparent;
                    border: 2px solid #6b7280;
                    color: #d1d5db;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    white-space: nowrap;
                " onmouseover="this.style.borderColor='#a855f7'; this.style.color='#fff';" 
                   onmouseout="this.style.borderColor='#6b7280'; this.style.color='#d1d5db';">
                    <i class="fas fa-cog"></i> Settings
                </button>
                <button id="cookie-reject-btn" style="
                    background: #4b5563;
                    border: 2px solid #4b5563;
                    color: #fff;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    white-space: nowrap;
                " onmouseover="this.style.background='#374151';" 
                   onmouseout="this.style.background='#4b5563';">
                    <i class="fas fa-times"></i> Reject All
                </button>
                <button id="cookie-accept-btn" style="
                    background: linear-gradient(135deg, #a855f7, #6366f1);
                    border: none;
                    color: #fff;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                    box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
                    white-space: nowrap;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 15px rgba(168, 85, 247, 0.4)';" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 10px rgba(168, 85, 247, 0.3)';">
                    <i class="fas fa-check"></i> Accept All
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    // Event handlers
    document.getElementById('cookie-accept-btn').addEventListener('click', function () {
        localStorage.setItem('cookieConsent', JSON.stringify({
            necessary: true,
            analytics: true,
            marketing: false,
            timestamp: new Date().toISOString()
        }));
        banner.remove();
    });

    document.getElementById('cookie-reject-btn').addEventListener('click', function () {
        localStorage.setItem('cookieConsent', JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        }));
        banner.remove();
        // Disable Google Analytics
        window['ga-disable-G-34PXPKXXLH'] = true;
    });

    document.getElementById('cookie-settings-btn').addEventListener('click', function () {
        window.location.href = 'cookie-policy.html#settings';
    });
})();
