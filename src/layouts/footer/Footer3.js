import Link from "next/link";
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import { getSocialMediaLinks } from '@/lib/site-settings';

const Footer3 = () => {
  const { t } = useTranslation('common');
  const [siteSettings, setSiteSettings] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    // Fetch site settings on component mount
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        const data = await response.json();
        if (data.success) {
          setSiteSettings(data.data);
          setSocialLinks(getSocialMediaLinks(data.data));
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  return (
    <footer className="footer-area footer-wave pt-100 p-r z-1">
      <div className="wave-shapes">
        <img
          src="/assets/images/shape/wave-shape-1.png"
          className="w-shape one"
          alt="wave shape"
        />
        <img
          src="/assets/images/shape/wave-shape-2.png"
          className="w-shape two"
          alt="wave shape"
        />
      </div>
      <div className="footer-wrapper text-white main-bg p-r z-1">
        <div className="shape shape-one animate-float-y">
          <span>
            <img src="/assets/images/shape/tree.png" alt="Tree Image" />
          </span>
        </div>
        <div className="shape shape-two animate-float-y">
          <span>
            <img src="/assets/images/shape/tree2.png" alt="Tree Image" />
          </span>
        </div>
        <div className="container">
          {/*====== Footer Widget ======*/}
          <div className="footer-widget-area pt-55 pb-40 p-r z-1">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12">
                {/*====== Footer Widget ======*/}
                <div className="footer-widget footer-about-widget mb-40 pr-lg-70 wow fadeInDown">
                  <div className="widget-content">
                    <div className="footer-logo mb-25">
                      <Link legacyBehavior href="/">
                        <a>
                          <div style={{ 
                            color: 'white', 
                            fontSize: '24px', 
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif',
                            textDecoration: 'none'
                          }}>
                            Bello Food
                          </div>
                        </a>
                      </Link>
                    </div>
                    <p>
                      {t('footer.aboutCompany')}
                    </p>
                    <Link legacyBehavior href="/contact">
                      <a className="main-btn filled-btn filled-white">
                        {t('footer.contactUs')}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                {/*====== Footer Widget ======*/}
                <div className="footer-widget contact-info-widget mb-40 wow fadeInUp">
                  <h4 className="widget-title">{t('footer.getInTouch')}</h4>
                  <div className="widget-content">
                    <ul className="info-list">
                      <li>{siteSettings?.address || t('footer.address')}</li>
                      <li>
                        <a href={`mailto:${siteSettings?.email || t('footer.email')}`}>
                          {siteSettings?.email || t('footer.email')}
                        </a>
                      </li>
                      <li>
                        <a href={`tel:${siteSettings?.phone || t('footer.phone')}`}>
                          {siteSettings?.phone || t('footer.phone')}
                        </a>
                      </li>
                      <li>
                        <a 
                          href={`https://${siteSettings?.website || t('footer.website')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {siteSettings?.website || t('footer.website')}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-12">
                {/*====== Footer Widget ======*/}
                <div className="footer-widget footer-nav-widget mb-40 wow fadeInDown">
                  <h4 className="widget-title">{t('footer.quickLink')}</h4>
                  <div className="widget-content">
                    <ul className="footer-nav">
                      <li>
                        <Link legacyBehavior href="/about">
                          <a>{t('footer.aboutCompanyLink')}</a>
                        </Link>
                      </li>
                      <li>
                        <Link legacyBehavior href="/products">
                          <a>{t('footer.ourProducts')}</a>
                        </Link>
                      </li>
                      <li>
                        <Link legacyBehavior href="/join-us">
                          <a>{t('footer.joinUs')}</a>
                        </Link>
                      </li>
                      <li>
                        <Link legacyBehavior href="/contact">
                          <a>{t('footer.contactUs')}</a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                {/*====== Footer Widget - Social Media ======*/}
                <div className="footer-widget footer-social-widget float-lg-right mb-30 wow fadeInUp">
                  <h4 className="widget-title">{t('footer.followUs')}</h4>
                  <div className="widget-content">
                    {socialLinks.length > 0 ? (
                      <ul className="social-icons-list">
                        {socialLinks.map((link, index) => (
                          <li key={index}>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="social-icon"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <i className={link.icon} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="social-icons-list">
                        <li>
                          <div className="social-icon">
                            <i className="fab fa-facebook-f" />
                          </div>
                        </li>
                        <li>
                          <div className="social-icon">
                            <i className="fab fa-instagram" />
                          </div>
                        </li>
                        <li>
                          <div className="social-icon">
                            <i className="fab fa-linkedin-in" />
                          </div>
                        </li>
                      </ul>
                    )}
                  </div>
                  
                  {/*====== Newsletter Form ======*/}
                  <div className="footer-newsletter mt-25 wow fadeInUp" data-wow-delay=".3s">
                    <h5 style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      letterSpacing: '0.5px'
                    }}>
                      Subscribe to Newsletter
                    </h5>
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        
                        const email = e.target.email.value;
                        if (!email || !email.trim()) {
                          alert('Please enter a valid email address.');
                          return;
                        }

                        const submitButton = e.target.querySelector('button[type="submit"]');
                        const originalHTML = submitButton.innerHTML;
                        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                        submitButton.disabled = true;

                        try {
                          const response = await fetch('/api/newsletter/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              email: email.trim(),
                              source: 'Footer',
                              language: 'en'
                            })
                          });

                          const result = await response.json();
                          if (result.success) {
                            alert('✓ Successfully subscribed to newsletter!');
                            e.target.reset();
                          } else {
                            alert(result.error || 'Failed to subscribe');
                          }
                        } catch (error) {
                          alert('An error occurred. Please try again.');
                        } finally {
                          submitButton.innerHTML = originalHTML;
                          submitButton.disabled = false;
                        }
                      }}
                      style={{
                        display: 'flex',
                        gap: '8px'
                      }}
                    >
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Enter your email address"
                        required
                        style={{
                          flex: 1,
                          height: '42px',
                          padding: '0 15px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,255,255,0.3)',
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          color: 'white',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                        className="footer-newsletter-input"
                      />
                      <button 
                        type="submit"
                        style={{
                          height: '42px',
                          padding: '0 20px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'white',
                          color: '#4D602C',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f0f0f0';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <i className="far fa-envelope"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*=== Copyright Area ===*/}
          <div className="copyright-area">
            <div className="row">
              <div className="col-lg-6">
                {/*====== Copyright Text ======*/}
                <div className="copyright-text">
                  <p>{t('footer.copyright')}</p>
                </div>
              </div>
              <div className="col-lg-6">
                {/*====== Copyright Nav ======*/}
                <div className="copyright-nav float-lg-right">
                  <ul>
                    <li>
                      <a href="#">{t('footer.settingPrivacy')}</a>
                    </li>
                    <li>
                      <a href="#">{t('footer.faqs')}</a>
                    </li>
                    <li>
                      <Link legacyBehavior href="/products">
                        <a>{t('footer.products')}</a>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer3;
