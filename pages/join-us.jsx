import PageBanner from "@/src/components/PageBanner";
import Layout from "@/src/layouts/Layout";
import Link from "next/link";
import Head from "next/head";
import { useTranslation } from 'next-i18next';

const JoinUs = () => {
  const { t } = useTranslation('common');
  
  return (
    <Layout header={3} footer={3}>
      <Head>
        <link rel="stylesheet" href="/assets/css/professional-form.css" />
      </Head>
      <PageBanner pageName={t('joinUsPage.pageTitle')} />
      <section className="team-section pt-95 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('joinUsPage.subtitle')}
                </span>
                <h2>{t('joinUsPage.title')}</h2>
                <p className="mt-20">
                  {t('joinUsPage.description')}
                </p>
              </div>
            </div>
          </div>
          {/* Why Work With Us Section */}
          <div className="row justify-content-center mb-60">
            <div className="col-lg-8">
              <div className="career-item wow fadeInUp text-center">
                <h4 style={{
                  color: '#2c3e50',
                  fontSize: '32px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  fontFamily: '"Montserrat", sans-serif'
                }}>{t('joinUsPage.whyWorkWithUs.title')}</h4>
                <div style={{
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                  borderRadius: '2px',
                  margin: '0 auto 40px auto'
                }}></div>
                <div className="why-work-list" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px',
                  maxWidth: '900px',
                  margin: '0 auto',
                  alignItems: 'start'
                }}>
                  <div className="why-work-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#666',
                    padding: '15px',
                    borderRadius: '12px',
                    background: 'rgba(77, 96, 44, 0.05)',
                    border: '1px solid rgba(77, 96, 44, 0.1)',
                    transition: 'all 0.3s ease'
                  }}><i className="far fa-check" style={{
                    color: '#4d602c',
                    marginRight: '15px',
                    fontSize: '20px',
                    marginTop: '2px',
                    flexShrink: 0
                  }} /><span>{t('joinUsPage.whyWorkWithUs.benefits.competitive')}</span></div>
                  
                  <div className="why-work-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#666',
                    padding: '15px',
                    borderRadius: '12px',
                    background: 'rgba(77, 96, 44, 0.05)',
                    border: '1px solid rgba(77, 96, 44, 0.1)',
                    transition: 'all 0.3s ease'
                  }}><i className="far fa-check" style={{
                    color: '#4d602c',
                    marginRight: '15px',
                    fontSize: '20px',
                    marginTop: '2px',
                    flexShrink: 0
                  }} /><span>{t('joinUsPage.whyWorkWithUs.benefits.development')}</span></div>
                  
                  <div className="why-work-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#666',
                    padding: '15px',
                    borderRadius: '12px',
                    background: 'rgba(77, 96, 44, 0.05)',
                    border: '1px solid rgba(77, 96, 44, 0.1)',
                    transition: 'all 0.3s ease'
                  }}><i className="far fa-check" style={{
                    color: '#4d602c',
                    marginRight: '15px',
                    fontSize: '20px',
                    marginTop: '2px',
                    flexShrink: 0
                  }} /><span>{t('joinUsPage.whyWorkWithUs.benefits.technology')}</span></div>
                  
                  <div className="why-work-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#666',
                    padding: '15px',
                    borderRadius: '12px',
                    background: 'rgba(77, 96, 44, 0.05)',
                    border: '1px solid rgba(77, 96, 44, 0.1)',
                    transition: 'all 0.3s ease'
                  }}><i className="far fa-check" style={{
                    color: '#4d602c',
                    marginRight: '15px',
                    fontSize: '20px',
                    marginTop: '2px',
                    flexShrink: 0
                  }} /><span>{t('joinUsPage.whyWorkWithUs.benefits.environment')}</span></div>
                  
                  <div className="why-work-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#666',
                    padding: '15px',
                    borderRadius: '12px',
                    background: 'rgba(77, 96, 44, 0.05)',
                    border: '1px solid rgba(77, 96, 44, 0.1)',
                    transition: 'all 0.3s ease'
                  }}><i className="far fa-check" style={{
                    color: '#4d602c',
                    marginRight: '15px',
                    fontSize: '20px',
                    marginTop: '2px',
                    flexShrink: 0
                  }} /><span>{t('joinUsPage.whyWorkWithUs.benefits.flexibility')}</span></div>
                </div>
                
                <style jsx>{`
                  .why-work-item:hover {
                    background: rgba(77, 96, 44, 0.08) !important;
                    border-color: rgba(77, 96, 44, 0.2) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(77, 96, 44, 0.1);
                  }
                  
                  @media (max-width: 768px) {
                    .why-work-list {
                      grid-template-columns: 1fr !important;
                      gap: 15px !important;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
          
          {/* Job Listings Section */}
          <div className="row justify-content-center mb-60">
            <div className="col-lg-12">
              <div className="career-openings-section wow fadeInUp">
                <div className="section-header mb-40 text-center">
                  <h4 style={{
                    color: '#2c3e50',
                    fontSize: '32px',
                    fontWeight: '700',
                    marginBottom: '10px',
                    fontFamily: '"Montserrat", sans-serif'
                  }}>{t('joinUsPage.currentOpenings.title')}</h4>
                  <div style={{
                    width: '80px',
                    height: '4px',
                    background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                    borderRadius: '2px',
                    margin: '0 auto 20px auto'
                  }}></div>
                  <p style={{
                    color: '#666',
                    fontSize: '18px',
                    lineHeight: '1.6',
                    margin: 0,
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}>
                    Join our dynamic team and grow your career in the food export industry
                  </p>
                </div>
                
                <div className="row justify-content-center">
                  {/* Quality Manager Position */}
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div 
                      className="job-offer-card wow fadeInUp" 
                      data-wow-delay="0.1s"
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '30px 25px',
                        height: '100%',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(77, 96, 44, 0.15)';
                        e.currentTarget.style.borderColor = '#4d602c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                        e.currentTarget.style.borderColor = '#f0f0f0';
                      }}
                    >
                      {/* Accent Line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)'
                      }}></div>
                      
                      <div className="job-header" style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '15px',
                        flexDirection: 'column',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                          borderRadius: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '15px'
                        }}>
                          <i className="fas fa-clipboard-check" style={{ fontSize: '28px', color: '#ffffff' }}></i>
                        </div>
                        <div>
                          <h5 style={{
                            color: '#2c3e50',
                            fontSize: '20px',
                            fontWeight: '700',
                            margin: '0 0 8px 0',
                            lineHeight: '1.2',
                            fontFamily: '"Montserrat", sans-serif'
                          }}>
                            {t('joinUsPage.currentOpenings.jobs.qualityManager.title')}
                          </h5>
                          <span style={{
                            color: '#4d602c',
                            fontSize: '13px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>Full Time • Quality Department</span>
                        </div>
                      </div>
                      
                      <p style={{
                        color: '#666',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        margin: '0 0 20px 0',
                        textAlign: 'center',
                        flex: 1
                      }}>
                        {t('joinUsPage.currentOpenings.jobs.qualityManager.details')}
                      </p>
                      
                      <div className="job-tags" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '20px',
                        justifyContent: 'center'
                      }}>
                        <span style={{
                          background: '#f8f9fa',
                          color: '#4d602c',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>Food Safety</span>
                        <span style={{
                          background: '#f8f9fa',
                          color: '#4d602c',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>ISO Standards</span>
                        <span style={{
                          background: '#f8f9fa',
                          color: '#4d602c',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>Leadership</span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          document.getElementById('application-form').scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '25px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          justifyContent: 'center',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(77, 96, 44, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Apply Now <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Export Specialist Position */}
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div 
                      className="job-offer-card wow fadeInUp" 
                      data-wow-delay="0.2s"
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '30px 25px',
                        height: '100%',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(77, 96, 44, 0.15)';
                        e.currentTarget.style.borderColor = '#4d602c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                        e.currentTarget.style.borderColor = '#f0f0f0';
                      }}
                    >
                      {/* Accent Line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)'
                      }}></div>
                      
                      <div className="job-header" style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '15px',
                        flexDirection: 'column',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          width: '60px',
                          height: '60px',
                          background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                          borderRadius: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '15px'
                        }}>
                          <i className="fas fa-globe-americas" style={{ fontSize: '28px', color: '#ffffff' }}></i>
                        </div>
                        <div>
                          <h5 style={{
                            color: '#2c3e50',
                            fontSize: '20px',
                            fontWeight: '700',
                            margin: '0 0 8px 0',
                            lineHeight: '1.2',
                            fontFamily: '"Montserrat", sans-serif'
                          }}>
                            {t('joinUsPage.currentOpenings.jobs.exportSpecialist.title')}
                          </h5>
                          <span style={{
                            color: '#4d602c',
                            fontSize: '13px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>Full Time • Sales Department</span>
                        </div>
                      </div>
                      
                      <p style={{
                        color: '#666',
                        fontSize: '15px',
                        lineHeight: '1.6',
                        margin: '0 0 20px 0',
                        textAlign: 'center',
                        flex: 1
                      }}>
                        {t('joinUsPage.currentOpenings.jobs.exportSpecialist.details')}
                      </p>
                      
                      <div className="job-tags" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '20px',
                        justifyContent: 'center'
                      }}>
                        <span style={{
                          background: '#f8f9fa',
                          color: '#4d602c',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>Export Sales</span>
                        <span style={{
                          background: '#f8f9fa',
                          color: '#4d602c',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>International Trade</span>
                        <span style={{
                          background: '#f8f9fa',
                          color: '#4d602c',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>Relationship Management</span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          document.getElementById('application-form').scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '25px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          justifyContent: 'center',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 5px 15px rgba(77, 96, 44, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        Apply Now <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Production Supervisor Position */}
                  <div className="col-lg-4 col-md-6 mb-30">
                    <div 
                      className="job-offer-card wow fadeInUp" 
                      data-wow-delay="0.3s"
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '30px 25px',
                        height: '100%',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(77, 96, 44, 0.15)';
                      e.currentTarget.style.borderColor = '#4d602c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = '#f0f0f0';
                    }}
                  >
                    {/* Accent Line */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)'
                    }}></div>
                    
                    <div className="job-header" style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '15px',
                      flexDirection: 'column',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '15px'
                      }}>
                        <i className="fas fa-cogs" style={{ fontSize: '28px', color: '#ffffff' }}></i>
                      </div>
                      <div>
                        <h5 style={{
                          color: '#2c3e50',
                          fontSize: '20px',
                          fontWeight: '700',
                          margin: '0 0 8px 0',
                          lineHeight: '1.2',
                          fontFamily: '"Montserrat", sans-serif'
                        }}>
                          {t('joinUsPage.currentOpenings.jobs.productionSupervisor.title')}
                        </h5>
                        <span style={{
                          color: '#4d602c',
                          fontSize: '13px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>Full Time • Production Department</span>
                      </div>
                    </div>
                    
                    <p style={{
                      color: '#666',
                      fontSize: '15px',
                      lineHeight: '1.6',
                      margin: '0 0 20px 0',
                      textAlign: 'center',
                      flex: 1
                    }}>
                      {t('joinUsPage.currentOpenings.jobs.productionSupervisor.details')}
                    </p>
                    
                    <div className="job-tags" style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginBottom: '20px',
                      justifyContent: 'center'
                    }}>
                      <span style={{
                        background: '#f8f9fa',
                        color: '#4d602c',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>Production Management</span>
                      <span style={{
                        background: '#f8f9fa',
                        color: '#4d602c',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>Safety Protocols</span>
                      <span style={{
                        background: '#f8f9fa',
                        color: '#4d602c',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>Team Leadership</span>
                    </div>
                    
                    <button 
                      onClick={() => {
                        document.getElementById('application-form').scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #4d602c 0%, #5a6f35 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(77, 96, 44, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Apply Now <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Application Form Section */}
          <div className="row justify-content-center mt-60" id="application-form">
            <div className="col-12">
              <div className="professional-application-form">
                <div className="professional-form-header wow fadeInDown">
                  <h3>{t('joinUsPage.applicationForm.title')}</h3>
                  <p>
                    {t('joinUsPage.applicationForm.description')}
                  </p>
                </div>
                
                  <form className="professional-application-form-content" onSubmit={async (e) => {
                    console.log('Form submission started');
                  e.preventDefault();
                    
                    // Show loading overlay
                    const form = e.target;
                    const loadingOverlay = document.createElement('div');
                    loadingOverlay.className = 'loading-overlay';
                    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
                    form.style.position = 'relative';
                    form.appendChild(loadingOverlay);
                  
                  try {
                    const formData = new FormData(e.target);
                    
                    // Validate required fields
                    const name = formData.get('name');
                    const title = formData.get('title');
                      const position = formData.get('position');
                    const phone = formData.get('phone');
                    const email = formData.get('email');
                      const cvFile = formData.get('cv_file');
                    
                    if (!name || !title || !position || !phone || !email) {
                      alert('Please fill in all required fields.');
                      return;
                    }
                    
                      // Validate file if provided
                      if (cvFile && cvFile.size > 0) {
                        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                        if (!allowedTypes.includes(cvFile.type)) {
                          alert('Please upload a valid CV file (PDF, DOC, or DOCX).');
                          return;
                        }
                        if (cvFile.size > 5 * 1024 * 1024) { // 5MB limit
                          alert('CV file size must be less than 5MB.');
                          return;
                        }
                      }
                      
                        console.log('Submitting application...');
                        
                      // Use the job-application endpoint
                      const apiEndpoint = '/api/job-application';
                      
                      const response = await fetch(apiEndpoint, {
                          method: 'POST',
                        body: formData // Send FormData directly for file upload
                      });
                      
                      const result = await response.json();
                      
                      if (result.success) {
                        console.log('Application submitted successfully');
                        
                        // Show success message
                        const successDiv = document.createElement('div');
                        successDiv.className = 'form-success';
                        successDiv.innerHTML = '<i class="fas fa-check-circle"></i> Application submitted successfully! We will review your application and get back to you soon.';
                        form.insertBefore(successDiv, form.firstChild);
                        
                        // Reset form
                  e.target.reset();
                        
                        // Clear file display
                        const fileDisplay = document.querySelector('.file-name-display');
                        if (fileDisplay) fileDisplay.remove();
                        
                        // Reset file upload wrapper
                        const fileWrapper = document.querySelector('.file-upload-wrapper');
                        if (fileWrapper) {
                          fileWrapper.classList.remove('has-file');
                          fileWrapper.querySelector('.file-upload-text').textContent = 'Click to upload your CV';
                          fileWrapper.querySelector('.file-upload-subtext').textContent = 'PDF, DOC, DOCX up to 5MB';
                        }
                        
                        // Remove success message after 5 seconds
                        setTimeout(() => {
                          if (successDiv && successDiv.parentNode) {
                            successDiv.remove();
                          }
                        }, 5000);
                        
                    } else {
                        console.error('Application submission failed:', result.error);
                        
                        // Show error message
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'form-error';
                        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> Error: ${result.error}`;
                        form.insertBefore(errorDiv, form.firstChild);
                        
                        // Remove error message after 5 seconds
                        setTimeout(() => {
                          if (errorDiv && errorDiv.parentNode) {
                            errorDiv.remove();
                          }
                        }, 5000);
                      }
                      
                  } catch (error) {
                      console.error('Submission error:', error);
                      
                      // Show error message
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'form-error';
                      errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> There was an error submitting your application. Please try again or contact us directly.';
                      form.insertBefore(errorDiv, form.firstChild);
                      
                      // Remove error message after 5 seconds
                      setTimeout(() => {
                        if (errorDiv && errorDiv.parentNode) {
                          errorDiv.remove();
                        }
                      }, 5000);
                      
                    } finally {
                      // Remove loading overlay
                      if (loadingOverlay && loadingOverlay.parentNode) {
                        loadingOverlay.remove();
                      }
                    }
                  }}>
                  <div className="professional-form-row">
                  <div className="row">
                    <div className="col-lg-6">
                        <div className="professional-form-group">
                          <label htmlFor="name" className="professional-form-label">
                            {t('joinUsPage.applicationForm.fields.name')} 
                            <span className="required">*</span>
                          </label>
                          <div className="professional-input-wrapper">
                        <input
                          type="text"
                          id="name"
                          name="name"
                              className="professional-form-control"
                          placeholder={t('joinUsPage.applicationForm.fields.namePlaceholder')}
                          required
                        />
                            <i className="fas fa-user input-icon"></i>
                          </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="professional-form-group">
                          <label htmlFor="title" className="professional-form-label">
                            {t('joinUsPage.applicationForm.fields.title')} 
                            <span className="required">*</span>
                          </label>
                          <div className="professional-input-wrapper">
                        <input
                          type="text"
                          id="title"
                          name="title"
                              className="professional-form-control"
                          placeholder={t('joinUsPage.applicationForm.fields.titlePlaceholder')}
                          required
                        />
                            <i className="fas fa-briefcase input-icon"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="professional-form-row">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="professional-form-group">
                          <label htmlFor="position" className="professional-form-label">
                            {t('joinUsPage.applicationForm.fields.position')} 
                            <span className="required">*</span>
                          </label>
                          <div className="professional-form-select">
                            <i className="fas fa-users input-icon"></i>
                            <select
                              id="position"
                              name="position"
                              className="professional-form-control"
                              required
                            >
                              <option value="">{t('joinUsPage.applicationForm.fields.positionPlaceholder')}</option>
                              <option value="quality-manager">{t('joinUsPage.applicationForm.positions.qualityManager')}</option>
                              <option value="export-specialist">{t('joinUsPage.applicationForm.positions.exportSpecialist')}</option>
                              <option value="production-supervisor">{t('joinUsPage.applicationForm.positions.productionSupervisor')}</option>
                              <option value="other">{t('joinUsPage.applicationForm.positions.other')}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="professional-form-group">
                          <label htmlFor="company" className="professional-form-label">
                            {t('joinUsPage.applicationForm.fields.company')}
                          </label>
                          <div className="professional-input-wrapper">
                        <input
                          type="text"
                          id="company"
                          name="company"
                              className="professional-form-control"
                          placeholder={t('joinUsPage.applicationForm.fields.companyPlaceholder')}
                        />
                            <i className="fas fa-building input-icon"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="professional-form-row">
                  <div className="row">
                    <div className="col-lg-6">
                        <div className="professional-form-group">
                          <label htmlFor="phone" className="professional-form-label">
                            {t('joinUsPage.applicationForm.fields.phone')} 
                            <span className="required">*</span>
                          </label>
                          <div className="professional-input-wrapper">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                              className="professional-form-control"
                          placeholder={t('joinUsPage.applicationForm.fields.phonePlaceholder')}
                          required
                        />
                            <i className="fas fa-phone input-icon"></i>
                          </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="professional-form-group">
                          <label htmlFor="email" className="professional-form-label">
                            {t('joinUsPage.applicationForm.fields.email')} 
                            <span className="required">*</span>
                          </label>
                          <div className="professional-input-wrapper">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="professional-form-control"
                              placeholder={t('joinUsPage.applicationForm.fields.emailPlaceholder')}
                              required
                            />
                            <i className="fas fa-envelope input-icon"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="professional-form-row">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="professional-form-group">
                          <label className="professional-form-label">
                            Upload Your CV/Resume
                          </label>
                          <div className="professional-file-upload">
                            <div 
                              className="file-upload-wrapper"
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileInput = document.getElementById('cv_file');
                                if (fileInput) {
                                  fileInput.click();
                                }
                              }}
                            >
                          <input
                                type="file"
                                id="cv_file"
                                name="cv_file"
                                className="file-upload-input"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  const wrapper = e.target.closest('.file-upload-wrapper');
                                  const existingDisplay = wrapper.parentNode.querySelector('.file-name-display');
                                  
                                  if (existingDisplay) {
                                    existingDisplay.remove();
                                  }
                                  
                                  if (file) {
                                    wrapper.classList.add('has-file');
                                    wrapper.querySelector('.file-upload-text').textContent = 'CV Selected';
                                    wrapper.querySelector('.file-upload-subtext').textContent = 'Click to change file';
                                    
                                    // Create file display
                                    const fileDisplay = document.createElement('div');
                                    fileDisplay.className = 'file-name-display';
                                    fileDisplay.innerHTML = `
                                      <div class="file-icon">
                                        <i class="fas fa-file-${file.type.includes('pdf') ? 'pdf' : 'word'}"></i>
                                      </div>
                                      <div class="file-details">
                                        <div class="file-name">${file.name}</div>
                                        <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                      </div>
                                      <button type="button" class="file-remove-btn" onclick="
                                        this.parentNode.remove();
                                        document.getElementById('cv_file').value = '';
                                        const wrapper = document.querySelector('.file-upload-wrapper');
                                        wrapper.classList.remove('has-file');
                                        wrapper.querySelector('.file-upload-text').textContent = 'Click to upload your CV';
                                        wrapper.querySelector('.file-upload-subtext').textContent = 'PDF, DOC, DOCX up to 5MB';
                                      ">
                                        <i class="fas fa-times"></i>
                                      </button>
                                    `;
                                    wrapper.parentNode.appendChild(fileDisplay);
                                  } else {
                                    wrapper.classList.remove('has-file');
                                    wrapper.querySelector('.file-upload-text').textContent = 'Click to upload your CV';
                                    wrapper.querySelector('.file-upload-subtext').textContent = 'PDF, DOC, DOCX up to 5MB';
                                  }
                                }}
                              />
                              <div className="file-upload-content">
                                <div className="file-upload-icon">
                                  <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div className="file-upload-text">Click to upload your CV</div>
                                <div className="file-upload-subtext">PDF, DOC, DOCX up to 5MB</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="professional-form-row">
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <button 
                        type="submit" 
                          className="professional-submit-btn"
                      >
                          <i className="fas fa-paper-plane"></i>
                        {t('joinUsPage.applicationForm.submitButton')}
                      </button>
                      </div>
                    </div>
                  </div>
                </form>
                
                {/* JavaScript to fix nice-select position field */}
                <script dangerouslySetInnerHTML={{
                  __html: `
                    // Wait for nice-select to be initialized
                    setTimeout(function() {
                      const niceSelect = document.querySelector('.application-form .nice-select');
                      const originalSelect = document.querySelector('.application-form select[name="position"]');
                      
                      if (niceSelect && originalSelect) {
                        console.log('Setting up nice-select sync for position field');
                        
                        // Map display text to form values
                        const positionMap = {
                          'Quality Manager': 'quality-manager',
                          'Export Specialist': 'export-specialist', 
                          'Production Supervisor': 'production-supervisor',
                          'Other': 'other'
                        };
                        
                        // Function to sync values
                        function syncSelectValue() {
                          const currentElement = niceSelect.querySelector('.current');
                          if (currentElement) {
                            const currentText = currentElement.textContent;
                            
                            if (currentText && currentText !== 'Select a position') {
                              const value = positionMap[currentText] || currentText.toLowerCase().replace(/\\s+/g, '-');
                              originalSelect.value = value;
                              originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                          }
                        }
                        
                        // Listen for multiple events
                        niceSelect.addEventListener('click', function(e) {
                          setTimeout(syncSelectValue, 150);
                        });
                        
                        // Also listen for changes in the dropdown list
                        const observer = new MutationObserver(function(mutations) {
                          mutations.forEach(function(mutation) {
                            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                              setTimeout(syncSelectValue, 50);
                            }
                          });
                        });
                        
                        observer.observe(niceSelect, {
                          childList: true,
                          subtree: true,
                          characterData: true
                        });
                        
                        console.log('Professional form detected - disabling nice-select interference');
                      }
                    }, 100);
                    
                    // Disable nice-select for professional form to prevent duplication
                    document.addEventListener('DOMContentLoaded', function() {
                      const professionalForm = document.querySelector('.professional-application-form');
                      if (professionalForm) {
                        // Add a class to prevent nice-select initialization
                        professionalForm.classList.add('no-nice-select');
                        
                        // Remove any existing nice-select elements
                        setTimeout(function() {
                          const niceSelects = professionalForm.querySelectorAll('.nice-select');
                          niceSelects.forEach(function(niceSelect) {
                            niceSelect.style.display = 'none';
                          });
                        }, 500);
                      }
                    });
                  `
                }} />
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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

export default JoinUs;
