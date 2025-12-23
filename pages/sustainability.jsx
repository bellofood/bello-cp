import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layouts/Layout";
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';

const Sustainability = () => {
  const { t } = useTranslation('common');
  const [images, setImages] = useState({
    qualityControl: '/assets/images/Sustainability/sus 1.jpg',
    production: '/assets/images/Sustainability/sus 2.jpg',
    globalReach: '/assets/images/Sustainability/sus 3.jpg',
    customerPromise: '/assets/images/Sustainability/sus 4.png'
  });

  // Fetch dynamic images from website configuration
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/website-images/config');
        const data = await response.json();
        if (data.success && data.images) {
          setImages({
            qualityControl: data.images['sustainability-1'] || '/assets/images/Sustainability/sus 1.jpg',
            production: data.images['sustainability-2'] || '/assets/images/Sustainability/sus 2.jpg',
            globalReach: data.images['sustainability-3'] || '/assets/images/Sustainability/sus 3.jpg',
            customerPromise: data.images['sustainability-4'] || '/assets/images/Sustainability/sus 4.png'
          });
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, []);
  
  return (
    <Layout header={3} footer={3}>
      <PageBanner pageName={t('sustainabilityPage.pageTitle')} />
      
      {/* Hero Content Section - Full Width with Background */}
      <section 
        className="sustainability-intro-section pt-130 pb-130 p-r z-1"
        style={{
          background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center text-white wow fadeInUp">
                <span className="sub-title" style={{ color: '#f0e68c', fontSize: '16px', fontWeight: '600', letterSpacing: '1px' }}>
                  <i className="flaticon-plant" style={{ marginRight: '10px' }} />
                  {t('sustainabilityPage.subtitle')}
                </span>
                <h1 style={{ fontSize: '48px', fontWeight: '700', marginTop: '20px', marginBottom: '30px', lineHeight: '1.2' }}>
                  {t('sustainabilityPage.title')}
                </h1>
                <p style={{ fontSize: '20px', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', opacity: '0.95' }}>
                  {t('sustainabilityPage.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '0',
          width: '100%',
          height: '100px',
          background: 'white',
          clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)'
        }} />
      </section>

      {/* Commitment Values - Enhanced Design */}
      <section className="pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center mb-70">
            <div className="col-lg-8 text-center">
              <div className="section-title wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('sustainabilityPage.commitment.title')}
                </span>
                <h2>Our Core Values</h2>
                <p style={{ marginTop: '20px', fontSize: '17px', color: '#666' }}>
                  The principles that guide everything we do
                </p>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-center">
            {t('sustainabilityPage.commitment.items', { returnObjects: true }).map((item, index) => {
              const icons = ['fa-seedling', 'fa-shield-alt', 'fa-users', 'fa-award'];
              const gradients = [
                'linear-gradient(135deg, #5a7249 0%, #6b8e59 100%)',
                'linear-gradient(135deg, #4a5f3a 0%, #5a7249 100%)',
                'linear-gradient(135deg, #6b8e59 0%, #7a9d69 100%)',
                'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)'
              ];
              
              return (
                <div key={index} className="col-lg-6 col-md-6 col-sm-12">
                  <div 
                    className="value-card-horizontal mb-40 wow fadeInUp" 
                    data-wow-delay={`.${index * 1}s`}
                    style={{
                      background: 'white',
                      padding: '35px 30px',
                      borderRadius: '20px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      transition: 'all 0.4s ease',
                      border: '2px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '25px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(10px)';
                      e.currentTarget.style.borderColor = '#5a7249';
                      e.currentTarget.style.boxShadow = '0 15px 50px rgba(90, 114, 73, 0.2)';
                      e.currentTarget.querySelector('.icon-wrapper').style.transform = 'rotate(360deg) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = '#f0f0f0';
                      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
                      e.currentTarget.querySelector('.icon-wrapper').style.transform = 'rotate(0deg) scale(1)';
                    }}
                  >
                    {/* Decorative background element */}
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '-30px',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'rgba(90, 114, 73, 0.03)',
                      zIndex: 0
                    }} />
                    
                    {/* Icon */}
                    <div 
                      className="icon-wrapper"
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '20px',
                        background: gradients[index],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 10px 25px rgba(90, 114, 73, 0.25)',
                        transition: 'all 0.6s ease',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      <i className={`fas ${icons[index]}`} style={{ fontSize: '36px', color: 'white' }} />
                    </div>
                    
                    {/* Text Content */}
                    <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '5px 15px',
                        background: 'rgba(90, 114, 73, 0.08)',
                        borderRadius: '20px',
                        marginBottom: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#5a7249',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Value {index + 1}
                      </div>
                      <p style={{ 
                        fontSize: '16px', 
                        lineHeight: '1.7', 
                        color: '#333',
                        margin: 0,
                        fontWeight: '500'
                      }}>
                        {item}
                      </p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(90, 114, 73, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <i className="fas fa-arrow-right" style={{ fontSize: '16px', color: '#5a7249' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Assurance & Certifications */}
      <section className="pt-90 pb-90" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="wow fadeInLeft">
                <div className="section-title mb-40">
                  <span className="sub-title">
                    <i className="flaticon-plant" />
                    {t('sustainabilityPage.qualityAssurance.title')}
                  </span>
                  <h2>International Standards</h2>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.8', color: '#555', marginBottom: '40px' }}>
                  {t('sustainabilityPage.qualityAssurance.description')}
                </p>
                
                {/* Image Gallery */}
                <div className="row">
                  <div className="col-6 mb-20">
                    <img 
                      src={images.qualityControl}
                      alt="Quality Control"
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                  <div className="col-6 mb-20">
                    <img 
                      src={images.production}
                      alt="Production"
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="wow fadeInRight">
                <div 
                  style={{
                    background: 'white',
                    padding: '50px 40px',
                    borderRadius: '20px',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.1)'
                  }}
                >
                  <h4 style={{ marginBottom: '35px', color: '#333', textAlign: 'center', fontSize: '24px' }}>
                    {t('sustainabilityPage.qualityAssurance.certifications.title')}
                  </h4>
                  
                  <div className="certifications-list">
                    {[
                      { img: '/assets/images/icon/brc-logo.png', alt: 'BRC', index: 0 },
                      { img: '/assets/images/icon/fda.jpg', alt: 'FDA', index: 1 },
                      { img: '/assets/images/icon/iso.jpg', alt: 'ISO', index: 2 },
                      { img: '/assets/images/icon/حلا-01-01.png', alt: 'Halal', index: 3 }
                    ].map((cert) => (
                      <div 
                        key={cert.index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '20px',
                          marginBottom: '15px',
                          borderRadius: '12px',
                          background: '#f8f9fa'
                        }}
                      >
                        <div 
                          style={{
                            width: '70px',
                            height: '70px',
                            background: 'white',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '20px',
                            flexShrink: 0,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                          }}
                        >
                          <img 
                            src={cert.img}
                            alt={cert.alt}
                            style={{
                              maxWidth: '55px',
                              maxHeight: '55px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: '#333' }}>
                          {t('sustainabilityPage.qualityAssurance.certifications.items', { returnObjects: true })[cert.index]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="pt-100 pb-50">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="wow fadeInLeft">
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
                    padding: '60px 40px',
                    borderRadius: '20px',
                    color: 'white',
                    boxShadow: '0 20px 60px rgba(90, 114, 73, 0.3)'
                  }}
                >
                  <div style={{ marginBottom: '30px' }}>
                    <i className="fas fa-globe" style={{ fontSize: '50px', color: '#f0e68c' }} />
                  </div>
                  <h3 style={{ fontSize: '28px', marginBottom: '20px', color: 'white' }}>
                    {t('sustainabilityPage.globalReach.title')}
                  </h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', opacity: '0.95' }}>
                    {t('sustainabilityPage.globalReach.description')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-7">
              <div className="wow fadeInRight">
                <img 
                  src={images.globalReach}
                  alt="Global Reach"
                  style={{
                    width: '100%',
                    borderRadius: '20px',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.15)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Promise Section */}
      <section className="pt-50 pb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 order-lg-1 order-2">
              <div className="wow fadeInLeft">
                <img 
                  src={images.customerPromise}
                  alt="Customer Promise"
                  style={{
                    width: '100%',
                    borderRadius: '20px',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.15)'
                  }}
                />
              </div>
            </div>
            
            <div className="col-lg-5 order-lg-2 order-1 mb-lg-0 mb-40">
              <div className="wow fadeInRight">
                <div className="section-title mb-30">
                  <span className="sub-title">
                    <i className="flaticon-plant" />
                    {t('sustainabilityPage.customerPromise.title')}
                  </span>
                  <h3>Our Commitment to You</h3>
                </div>
                
                <div>
                  {t('sustainabilityPage.customerPromise.items', { returnObjects: true }).map((item, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '20px',
                        padding: '15px',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(10px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(90, 114, 73, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
                      }}
                    >
                      <div 
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '15px',
                          flexShrink: 0
                        }}
                      >
                        <i className="fas fa-check" style={{ color: 'white', fontSize: '16px' }} />
                      </div>
                      <p style={{ margin: 0, fontSize: '15px', color: '#555', lineHeight: '1.6' }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 36px !important;
          }
          
          .value-card-horizontal {
            flex-direction: column !important;
            text-align: center !important;
            gap: 20px !important;
            padding: 30px 25px !important;
          }
          
          .value-card-horizontal .icon-wrapper {
            width: 80px !important;
            height: 80px !important;
          }
          
          .certifications-list > div {
            padding: 15px !important;
          }
        }
        
        @media (max-width: 576px) {
          h1 {
            font-size: 28px !important;
          }
          
          p[style*="fontSize: '28px'"] {
            font-size: 18px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  const { serverSideTranslations } = await import('next-i18next/serverSideTranslations');
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Sustainability;
