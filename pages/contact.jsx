import PageBanner from "@/src/components/PageBanner";

import Layout from "@/src/layouts/Layout";
import Link from "next/link";
import { useTranslation } from 'next-i18next';
import { getWhatsAppLink } from '@/lib/site-settings';
import { supabaseAdmin } from '@/lib/supabase';

const Contact = ({ siteSettings }) => {
  const { t } = useTranslation('common');
  
  return (
    <Layout header={3} footer={3}>
      <PageBanner pageName={t('contactPage.pageTitle')} />

      {/*====== Start Contact Info section ======*/}
      <section className="contact-info-section pt-100 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="section-title text-center wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('contactPage.info.subtitle')}
                </span>
                <h2>{t('contactPage.info.title')}</h2>
                <p className="section-description">
                  {t('contactPage.description') || 'We\'re here to help you. Contact us for prices and premium Mediterranean products'}
                </p>
              </div>
            </div>
          </div>
          <div className="contact-info-wrapper wow fadeInUp" data-wow-delay="0.2s">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 mb-40">
                {/*====== Contact Info Item ======*/}
                <div className="contact-info-item-professional text-center wow fadeInUp" data-wow-delay="0.1s">
                  <div className="icon-wrapper">
                    <div className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="info">
                    <h4 className="title">{t('contactPage.info.address')}</h4>
                    <p className="address">{siteSettings?.address || t('footer.address')}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-40">
                {/*====== Contact Info Item ======*/}
                <div className="contact-info-item-professional text-center wow fadeInUp" data-wow-delay="0.2s">
                  <div className="icon-wrapper">
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                  </div>
                  <div className="info">
                    <h4 className="title">{t('contactPage.info.email')}</h4>
                    <p className="email">
                      <a href={`mailto:${siteSettings?.email || 'marketing@bello-food.com'}`}>
                        {siteSettings?.email || t('footer.email')}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-40">
                {/*====== Contact Info Item ======*/}
                <div className="contact-info-item-professional text-center wow fadeInUp" data-wow-delay="0.3s">
                  <div className="icon-wrapper">
                    <div className="icon">
                      <i className="fas fa-phone"></i>
                    </div>
                  </div>
                  <div className="info">
                    <h4 className="title">{t('contactPage.info.phone')}</h4>
                    <p className="phone">
                      <a href={`tel:${siteSettings?.phone || '+20 1101 5111 85'}`}>
                        {siteSettings?.phone || t('footer.phoneNumber')}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Contact Info section ======*/}
      {/*====== Start Contact section ======*/}
      <section className="contact-section pt-95 pb-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              {/*====== Section-title ======*/}
              <div className="section-title wow fadeInRight mb-50">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('contactPage.subtitle')}
                </span>
                <h2>{t('contactPage.title')}</h2>
              </div>
            </div>
          </div>
          <div className="contact-wrapper">
            <div className="row">
              <div className="col-lg-6">
                {/*=== Interactive Map Box ===*/}
                <div className="interactive-map-box wow fadeInLeft mb-50">
                  <div 
                    className="map-container"
                    onClick={() => {
                      // Open Google Maps in new tab with specific location
                      window.open(siteSettings?.google_maps_url || 'https://maps.app.goo.gl/j7Qa6LR51jspaizn8?g_st=com.google.maps.preview.copy', '_blank', 'noopener,noreferrer');
                    }}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
                      transition: 'all 0.3s ease',
                      background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: 'white',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)';
                    }}
                  >
                    {/* Background Pattern */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("/assets/images/bg/about-bg-1.jpg") center/cover',
                      opacity: 0.1,
                      zIndex: 1
                    }}></div>

                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '30px',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        margin: '0 auto 30px'
                      }}>
                        <i className="fas fa-map-marker-alt" style={{ fontSize: '40px', color: '#ffffff' }}></i>
                      </div>
                      
                      <h3 style={{ 
                        fontSize: '28px', 
                        fontWeight: '700',
                        marginBottom: '15px',
                        color: '#ffffff'
                      }}>
                        {t('contactPage.map.title') || 'Visit Our Location'}
                      </h3>
                      
                      <p style={{ 
                        fontSize: '16px', 
                        opacity: 0.95,
                        lineHeight: '1.5',
                        marginBottom: '25px',
                        maxWidth: '300px',
                        margin: '0 auto 25px'
                      }}>
                        {siteSettings?.address || t('contactPage.map.description') || '10th of Ramadan City, Egypt'}
                      </p>
                      
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '12px 24px',
                        borderRadius: '50px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        transition: 'all 0.3s ease'
                      }}>
                        <i className="fas fa-external-link-alt" style={{ marginRight: '10px', fontSize: '14px' }}></i>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>
                          {t('contactPage.map.viewOnMaps') || 'View on Google Maps'}
                        </span>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      width: '60px',
                      height: '60px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      zIndex: 1,
                      animation: 'float 3s ease-in-out infinite'
                    }}></div>
                    
                    <div style={{
                      position: 'absolute',
                      bottom: '30px',
                      right: '30px',
                      width: '40px',
                      height: '40px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      zIndex: 1,
                      animation: 'float 4s ease-in-out infinite reverse'
                    }}></div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                {/*====== Contact Form Wrapper ======*/}
                <div className="contact-form-wrapper mb-50 wow fadeInRight">
                  <form
                    onSubmit={async (e) => {
                      console.log('Contact form submission started');
                      e.preventDefault();
                      
                      try {
                        const formData = new FormData(e.target);
                        
                        // Validate required fields
                        const name = formData.get('name');
                        const email = formData.get('email');
                        const phone = formData.get('phone');
                        const subject = formData.get('subject');
                        const message = formData.get('message');
                        
                        if (!name || !email || !phone || !subject || !message) {
                          alert('Please fill in all required fields.');
                          return;
                        }
                        
                        // Prepare data for database
                        const submissionData = {
                          name: name.trim(),
                          email: email.trim(),
                          phone: phone.trim(),
                          subject: subject.trim(),
                          message: message.trim()
                        };
                        
                        // Show loading state
                        const submitButton = e.target.querySelector('button[type="submit"]');
                        if (submitButton) {
                          const originalText = submitButton.innerHTML;
                          submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
                          submitButton.disabled = true;
                          
                          try {
                            console.log('Submitting contact message...');
                            
                            const response = await fetch('/api/contact', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(submissionData)
                            });
                            
                            const result = await response.json();
                            
                            if (result.success) {
                              console.log('Contact message sent successfully');
                              alert('✅ Thank you! Your message has been sent successfully. We will get back to you soon.');
                              e.target.reset();
                            } else {
                              console.error('Contact submission failed:', result.error);
                              alert(`❌ Error: ${result.error}`);
                            }
                            
                          } catch (error) {
                            console.error('Contact submission error:', error);
                            alert('❌ There was an error sending your message. Please try again or contact us directly.');
                          } finally {
                            // Restore button state
                            submitButton.innerHTML = originalText;
                            submitButton.disabled = false;
                          }
                        }
                      } catch (error) {
                        console.error('Contact form error:', error);
                        alert('There was an error processing your message. Please try again.');
                      }
                    }}
                    className="contact-form"
                  >
                    <div className="form_group">
                      <label>
                        <i className="far fa-user" />
                      </label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder={t('contactPage.form.name')}
                        name="name"
                        required
                      />
                    </div>
                    <div className="form_group">
                      <label>
                        <i className="far fa-envelope" />
                      </label>
                      <input
                        type="email"
                        className="form_control"
                        placeholder={t('contactPage.form.email')}
                        name="email"
                        required
                      />
                    </div>
                    <div className="form_group">
                      <label>
                        <i className="far fa-phone-plus" />
                      </label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder={t('contactPage.form.phone')}
                        name="phone"
                        required
                      />
                    </div>
                    <div className="form_group">
                      <label>
                        <i className="far fa-map-marker-exclamation" />
                      </label>
                      <input
                        type="text"
                        className="form_control"
                        placeholder={t('contactPage.form.subject')}
                        name="subject"
                        required
                      />
                    </div>
                    <div className="form_group">
                      <label>
                        <i className="far fa-pen-fancy" />
                      </label>
                      <textarea
                        className="form_control"
                        rows={3}
                        placeholder={t('contactPage.form.message')}
                        name="message"
                        defaultValue={""}
                      />
                    </div>
                    <div className="form_group">
                      <button type="submit" className="main-btn primary-btn">
                        {t('contactPage.form.submit')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Contact section ======*/}
      {/*====== Start WhatsApp Section ======*/}
      <section className="whatsapp-section py-100" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              {/*====== Professional WhatsApp Card ======*/}
              <div 
                className="professional-whatsapp-card wow fadeInUp" 
                data-wow-delay="0.1s"
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '60px 50px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    background: 'linear-gradient(135deg, #25d366 0%, #20c55a 100%)',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(37, 211, 102, 0.25)'
                  }}>
                    <i className="fab fa-whatsapp" style={{ fontSize: '45px', color: '#ffffff' }}></i>
                  </div>
                </div>
                
                {/* Title */}
                <h3 style={{ 
                  color: '#2c3e50', 
                  fontSize: '28px', 
                  fontWeight: '700',
                  marginBottom: '20px',
                  fontFamily: '"Montserrat", sans-serif'
                }}>
                  {t('contactPage.whatsapp.title')}
                </h3>
                
                {/* Description */}
                <p style={{ 
                  color: '#6c757d', 
                  fontSize: '16px', 
                  lineHeight: '1.7',
                  marginBottom: '35px',
                  maxWidth: '500px',
                  margin: '0 auto 35px'
                }}>
                  {t('contactPage.whatsapp.description')}
                </p>
                
                {/* Button */}
                <div>
                  <a
                    href={getWhatsAppLink(siteSettings || {})}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #25d366 0%, #20c55a 100%)',
                      color: '#ffffff',
                      padding: '16px 40px',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #20c55a 0%, #1ea952 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #25d366 0%, #20c55a 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.3)';
                    }}
                  >
                    <i className="fab fa-whatsapp" style={{ marginRight: '12px', fontSize: '20px' }}></i>
                    {t('contactPage.whatsapp.buttonText')}
                  </a>
                </div>
                
                {/* Additional Info */}
                <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #e8e8e8' }}>
                  <p style={{ color: '#95a5a6', fontSize: '14px', margin: 0 }}>
                    <i className="far fa-clock" style={{ marginRight: '8px' }}></i>
                    {siteSettings?.working_hours || t('contactPage.whatsapp.availability')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End WhatsApp Section ======*/}

    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  const { serverSideTranslations } = await import('next-i18next/serverSideTranslations');
  
  // Fetch site settings directly from Supabase
  let siteSettings = null;
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .single();

    if (data && !error) {
      siteSettings = data;
    } else {
      // Return defaults if no settings found
      siteSettings = {
        address: '10th of Ramadan City, Industrial Area, Egypt',
        email: 'marketing@bello-food.com',
        phone: '+20 11 0 15 111 85',
        whatsapp_number: '201101511185',
        whatsapp_message: 'Hello Bello Food, I would like to inquire about your products',
        working_hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
        google_maps_url: 'https://maps.app.goo.gl/j7Qa6LR51jspaizn8?g_st=com.google.maps.preview.copy'
      };
    }
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Return defaults on error
    siteSettings = {
      address: '10th of Ramadan City, Industrial Area, Egypt',
      email: 'marketing@bello-food.com',
      phone: '+20 11 0 15 111 85',
      whatsapp_number: '201101511185',
      whatsapp_message: 'Hello Bello Food, I would like to inquire about your products',
      working_hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
      google_maps_url: 'https://maps.app.goo.gl/j7Qa6LR51jspaizn8?g_st=com.google.maps.preview.copy'
    };
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      siteSettings,
    },
    revalidate: 10, // Revalidate every 10 seconds (changed from 60)
  }
}

export default Contact;
