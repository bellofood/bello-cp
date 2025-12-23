import Link from "next/link";
import { Modal } from "react-bootstrap";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const Sidebar = ({ show, handleClose }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <Modal
      className="modal fade sidebar-panel-wrapper"
      show={show}
      onHide={handleClose}
      size="xl"
    >
      <div className="modal-content">
        <button className="close" data-dismiss="modal" onClick={handleClose}>
          <i className="far fa-times" />
        </button>
        <div className="sidebar-wrapper">
          <div className="sidebar-information-area">
            <div className="row no-gutters">
              <div className="col-lg-5 sidebar-widget">
                <div className="sidebar-info-widget">
                  <h4 className="title">Bello Food</h4>
                  <Link legacyBehavior href="/">
                    <a className="footer-logo">
                      <img
                        src="/assets/images/logo/01-04.svg"
                        alt="Bello Food Logo"
                        style={{ filter: 'brightness(0) invert(1)', maxHeight: '60px' }}
                      />
                    </a>
                  </Link>
                  <p>
                    {t('footer.about')}
                  </p>
                  <div className="social-item">
                    <h6>{t('footer.followUs')}</h6>
                    <ul className="social-link">
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-youtube" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-pinterest-p" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 sidebar-widget">
                <div className="sidebar-info-widget">
                  <h4 className="title">{t('footer.getInTouch')}</h4>
                  <div className="contact-info-item-two">
                    <h6 className="title">
                      <i className="far fa-map-marker-alt" />
                      {t('footer.location')}
                    </h6>
                    <p>{t('footer.address')}</p>
                  </div>
                  <div className="contact-info-item-two">
                    <h6 className="title">
                      <i className="far fa-envelope-open" />
                      {t('footer.emailUs')}
                    </h6>
                    <p>
                      <a href="mailto:marketing@bello-food.com">{t('footer.email')}</a>
                    </p>
                  </div>
                  <div className="contact-info-item-two">
                    <h6 className="title">
                      <i className="far fa-phone-plus" />
                      {t('common.contactUs')}
                    </h6>
                    <p>
                      <a href="tel:+2+20 1101 5111 85">{t('footer.phone')}</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 sidebar-widget">
                <div className="sidebar-info-widget newsletter-widget" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  padding: '25px 20px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Subtle Decorative Element */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(241, 210, 169, 0.05)',
                    borderRadius: '50%',
                    zIndex: '1'
                  }}></div>
                  
                  {/* Newsletter Icon Header */}
                  <div className="newsletter-header text-center mb-3" style={{ position: 'relative', zIndex: '2' }}>
                    <div className="newsletter-icon mb-3" style={{
                      background: 'rgba(241, 210, 169, 0.1)',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(241, 210, 169, 0.2)'
                    }}>
                      <i className="fas fa-envelope-open" style={{ 
                        fontSize: '18px', 
                        color: '#F1D2A9' 
                      }}></i>
                    </div>
                    <h4 className="title mb-2" style={{ 
                      fontSize: '18px',
                      fontWeight: '600',
                      textAlign: 'center',
                      color: '#fff'
                    }}>
                      {t('newsletter.title')}
                    </h4>
                    <p className="mb-0" style={{ 
                      fontSize: '13px',
                      lineHeight: '1.4',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {t('newsletter.description')}
                    </p>
                  </div>

                  {/* Enhanced Form */}
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const email = e.target.email.value;
                      
                      if (!email) {
                        const messageDiv = document.getElementById('sidebar-newsletter-message');
                        messageDiv.innerHTML = '<div style="color: #ff6b6b; padding: 12px; background: rgba(255,107,107,0.1); border-radius: 8px; margin-top: 12px; text-align: center; font-size: 13px;"><i class="fas fa-exclamation-circle mr-2"></i>Please enter your email address</div>';
                        setTimeout(() => messageDiv.innerHTML = '', 3000);
                        return;
                      }
                      
                      try {
                        const submitButton = e.target.querySelector('button[type="submit"]');
                        const originalText = submitButton.innerHTML;
                        const messageDiv = document.getElementById('sidebar-newsletter-message');
                        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>' + t('newsletter.subscribing');
                        submitButton.disabled = true;
                        
                        const response = await fetch('/api/newsletter/subscribe', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            email: email.trim(),
                            source: 'Sidebar',
                            language: router.locale || 'en'
                          })
                        });

                        const result = await response.json();

                        if (result.success) {
                          messageDiv.innerHTML = '<div style="color: #4D602C; padding: 12px; background: rgba(77,96,44,0.1); border-radius: 8px; margin-top: 12px; text-align: center; font-size: 13px; border: 1px solid rgba(77,96,44,0.3);"><i class="fas fa-check-circle mr-2"></i>' + result.message + '</div>';
                        e.target.reset();
                          setTimeout(() => messageDiv.innerHTML = '', 5000);
                        } else {
                          messageDiv.innerHTML = '<div style="color: #ff6b6b; padding: 12px; background: rgba(255,107,107,0.1); border-radius: 8px; margin-top: 12px; text-align: center; font-size: 13px;"><i class="fas fa-exclamation-circle mr-2"></i>' + result.error + '</div>';
                          setTimeout(() => messageDiv.innerHTML = '', 5000);
                        }
                        
                        // Restore button
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                      } catch (error) {
                        const messageDiv = document.getElementById('sidebar-newsletter-message');
                        messageDiv.innerHTML = '<div style="color: #ff6b6b; padding: 12px; background: rgba(255,107,107,0.1); border-radius: 8px; margin-top: 12px; text-align: center; font-size: 13px;"><i class="fas fa-exclamation-circle mr-2"></i>' + (t('newsletter.errorMessage') || 'An error occurred') + '</div>';
                        setTimeout(() => messageDiv.innerHTML = '', 5000);
                        const submitButton = e.target.querySelector('button[type="submit"]');
                        submitButton.innerHTML = t('newsletter.subscribe');
                        submitButton.disabled = false;
                      }
                    }}
                    className="newsletter-form"
                    style={{ position: 'relative', zIndex: '2' }}
                  >
                    <div className="form-group mb-3">
                      <input 
                        type="email" 
                        name="email"
                        className="form-control newsletter-input-enhanced" 
                        placeholder={t('newsletter.emailPlaceholder')}
                        required
                        style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          fontSize: '14px',
                          marginBottom: '12px',
                          color: '#fff',
                          transition: 'all 0.3s ease',
                          boxShadow: 'none'
                        }}
                      />
                      <button 
                        type="submit" 
                        className="newsletter-btn-enhanced w-100"
                        style={{ 
                          background: '#4D602C',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="far fa-envelope mr-2"></i>
                        {t('newsletter.subscribe')}
                      </button>
                    </div>
                    <div id="sidebar-newsletter-message"></div>
                  </form>

                  {/* Benefits List */}
                  <div className="newsletter-benefits mt-3" style={{ position: 'relative', zIndex: '2' }}>
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="fas fa-check mr-2" style={{ fontSize: '12px', color: '#4D602C' }}></i>
                      <small style={{ fontWeight: '400', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {t('newsletter.benefits.updates')}
                      </small>
                    </div>
                    
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="fas fa-check mr-2" style={{ fontSize: '12px', color: '#4D602C' }}></i>
                      <small style={{ fontWeight: '400', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {t('newsletter.benefits.offers')}
                      </small>
                    </div>
                    
                    <div className="benefit-item d-flex align-items-center mb-2">
                      <i className="fas fa-check mr-2" style={{ fontSize: '12px', color: '#4D602C' }}></i>
                      <small style={{ fontWeight: '400', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {t('newsletter.benefits.news')}
                      </small>
                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="newsletter-privacy mt-3 text-center" style={{ position: 'relative', zIndex: '2' }}>
                    <p style={{ 
                      fontSize: '11px',
                      fontStyle: 'italic',
                      margin: '0',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      <i className="fas fa-shield-alt mr-1" style={{ color: '#4D602C', fontSize: '10px' }}></i>
                      {t('newsletter.privacyNotice') || 'We respect your privacy. Unsubscribe at any time.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  );
};
export default Sidebar;
