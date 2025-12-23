import PageBanner from "@/src/components/PageBanner";

import Layout from "@/src/layouts/Layout";
import { sliderProps } from "@/src/sliderProps";
import Link from "next/link";
import Slider from "react-slick";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const About = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  return (
    <Layout header={3} footer={3}>
      <PageBanner pageName={t('aboutPage.pageTitle')} />
      <section className="about-section pt-95 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              {/*====== Section-title ======*/}
              <div className="section-title mb-50 wow fadeInLeft">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('aboutPage.subtitle')}
                </span>
                <h2>{t('aboutPage.title')}</h2>
              </div>
            </div>
            <div className="col-lg-6">
              {/*====== About Content Box ======*/}
              <div className="about-content-box mb-50 wow fadeInRight">
                <p className="mb-30">
                  {t('aboutPage.description')}
                </p>
                <ul className="check-style-one mb-40">
                  {t('aboutPage.checkList', { returnObjects: true }).map((item, index) => (
                    <li key={index}>
                      <i className="far fa-check" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 col-sm-6">
              {/*====== About Image Item ======*/}
              <div className="about-img-item mb-30 wow fadeInUp">
                <img src="/assets/images/about/about-3.jpg" alt="About Image" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6">
              {/*====== About Image Item ======*/}
              <div className="about-img-item mb-30 wow fadeInDown">
                <img src="/assets/images/about/about-4.jpg" alt="About Image" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-6">
              {/*====== About Image Item ======*/}
              <div className="about-img-item mb-30 wow fadeInUp">
                <img src="/assets/images/about/about-5.jpg" alt="About Image" />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/*====== About Wrapper ======*/}
              <div className="about-wrapper-two gray-bg mt-minus-110 p-r wow fadeInDown">
                <div className="row no-gutters justify-content-center">
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    {/*====== About features Item ======*/}
                    <div className="about-features-item text-center">
                      <div
                        className="hover-bg bg_cover"
                        style={{
                          backgroundImage:
                            "url(/assets/images/about/hover-bg.jpg)",
                        }}
                      />
                      <div className="icon">
                        <i className="flaticon-target" />
                      </div>
                      <div className="text">
                        <h3 className="title">{t('aboutPage.mission.title')}</h3>
                        <p>
                          {t('aboutPage.mission.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    {/*====== About features Item ======*/}
                    <div className="about-features-item item-active text-center">
                      <div
                        className="hover-bg bg_cover"
                        style={{
                          backgroundImage:
                            "url(/assets/images/about/hover-bg.jpg)",
                        }}
                      />
                      <div className="icon">
                        <i className="flaticon-vision" />
                      </div>
                      <div className="text">
                        <h3 className="title">{t('aboutPage.whyBello.title')}</h3>
                        <p>
                          {t('aboutPage.whyBello.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    {/*====== About features Item ======*/}
                    <div className="about-features-item text-center">
                      <div
                        className="hover-bg bg_cover"
                        style={{
                          backgroundImage:
                            "url(/assets/images/about/hover-bg.jpg)",
                        }}
                      />
                      <div className="icon">
                        <i className="flaticon-management" />
                      </div>
                      <div className="text">
                        <h3 className="title">{t('aboutPage.promise.title')}</h3>
                        <p>
                          {t('aboutPage.promise.description')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End About Section ======*/}
      {/*====== Start Features Section ======*/}
      <section className="features-section p-r z-1" style={{ marginBottom: 0, paddingBottom: 0 }}>
        <div className="features-wrapper" style={{ minHeight: '700px', display: 'flex', alignItems: 'stretch' }}>
          <div
            className="features-bg bg_cover"
            style={{
              backgroundImage: "url(/assets/images/bg/features-bg-1.jpg)",
              position: 'absolute',
              top: 0,
              left: 0,
              width: '60%',
              height: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div 
            className="features-bgc-content-box main-bg text-white wow fadeInRight" 
            style={{
              marginLeft: 'auto',
              width: '55%',
              minHeight: '700px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2,
              padding: '80px 60px'
            }}
          >
            <div className="features-content-box" style={{ width: '100%' }}>
              {/*====== Section-title ======*/}
              <div className="section-title mb-50 wow fadeInUp">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('aboutPage.features.subtitle')}
                </span>
                <h2>{t('aboutPage.features.title')}</h2>
              </div>
              <p className="mb-40">
                {t('aboutPage.features.description')}
              </p>
              <div className="single-features-item mb-30 wow fadeInDown">
                <div className="icon">
                  <img src="/assets/images/icon/jar icon.svg" alt="Premium Quality Products" />
                  <span className="shape-circle" />
                </div>
                <div className="text">
                  <h5 className="title">{t('aboutPage.features.qualityProducts.title')}</h5>
                  <p>
                    {t('aboutPage.features.qualityProducts.description')}
                  </p>
                </div>
              </div>
              <div className="single-features-item mb-30 wow fadeInUp">
                <div className="icon">
                  <img src="/assets/images/icon/001-05.png" alt="Global Export Excellence" />
                  <span className="shape-circle" />
                </div>
                <div className="text">
                  <h5 className="title">{t('aboutPage.features.globalExport.title')}</h5>
                  <p>
                    {t('aboutPage.features.globalExport.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @media (max-width: 1200px) {
            .features-bgc-content-box {
              padding: 60px 40px !important;
            }
          }
          
          @media (max-width: 991px) {
            .features-wrapper {
              flex-direction: column !important;
              min-height: auto !important;
            }
            
            .features-bg {
              position: relative !important;
              width: 100% !important;
              height: 350px !important;
            }
            
            .features-bgc-content-box {
              width: 100% !important;
              margin-left: 0 !important;
              min-height: auto !important;
              padding: 60px 40px !important;
            }
          }
          
          @media (max-width: 768px) {
            .features-bg {
              height: 300px !important;
            }
            
            .features-bgc-content-box {
              padding: 40px 30px !important;
            }
            
            .section-title h2 {
              font-size: 28px !important;
            }
            
            .single-features-item {
              margin-bottom: 25px !important;
            }
          }
          
          @media (max-width: 480px) {
            .features-bgc-content-box {
              padding: 30px 20px !important;
            }
          }
        `}</style>
      </section>
      {/*====== End Features Section ======*/}
      {/*====== Start CTA Section  ======*/}
      <section
        className="cta-bg-section bg_cover pt-100 p-r z-1"
        style={{ backgroundImage: "url(/assets/images/bg/cta-bg-1.jpg)" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              {/*======  CTA Content Box  ======*/}
              <div className="cta-content-box text-white mb-50 wow fadeInLeft">
                <div className="section-title mb-20">
                  <span className="sub-title">
                    <i className="flaticon-plant" />
                    {t('aboutPage.cta.subtitle')}
                  </span>
                  <h2>{t('aboutPage.cta.title')}</h2>
                </div>
                <p className="mb-30">
                  {t('aboutPage.cta.description')}
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              {/*======  CTA Image Box  ======*/}
              <div className="cta-image-box mb-50 wow fadeInRight">
                <img src="/assets/images/gallery/cta-1.jpg" alt="Image" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End CTA Section  ======*/}
      {/*====== Start Important Highlights Section ======*/}
      <section className="features-section pt-95 pb-70">
        <div className="container">
          <div className="row align-items-xl-center">
            <div className="col-lg-6">
              <div className="section-title mb-55 wow fadeInLeft">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('features.subtitle')}
                </span>
                <h2>{t('features.title')}</h2>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="features-content-box mb-55 wow fadeInRight">
                <p>
                  {t('features.description')}
                </p>
          </div>
                    </div>
                  </div>
          {/* Features Grid - Responsive and Aligned */}
          <div className="row features-grid-wrapper">
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
              <div className="features-thumb-item-two enhanced-feature-box h-100 wow fadeInDown" data-wow-delay=".2s">
                <div className="text">
                  <div className="icon">
                    <img src="/assets/images/icon/001-02.png" alt="Global Reach Icon" />
                  </div>
                  <h5 className="title">{t('features.globalReach.title')}</h5>
                  <p>{t('features.globalReach.description')}</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
              <div className="features-thumb-item-two enhanced-feature-box h-100 wow fadeInUp" data-wow-delay=".25s">
                <div className="text">
                  <div className="icon">
                    <img src="/assets/images/icon/002-02.png" alt="Certified Quality Icon" />
                  </div>
                  <h5 className="title">{t('features.certifiedQuality.title')}</h5>
                  <p>{t('features.certifiedQuality.description')}</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
              <div className="features-thumb-item-two enhanced-feature-box h-100 wow fadeInDown" data-wow-delay=".3s">
                <div className="text">
                  <div className="icon">
                    <img src="/assets/images/icon/001-04.png" alt="Unmatched Variety Icon" />
                  </div>
                  <h5 className="title">{t('features.unmatchedVariety.title')}</h5>
                  <p>{t('features.unmatchedVariety.description')}</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
              <div className="features-thumb-item-two enhanced-feature-box h-100 wow fadeInUp" data-wow-delay=".35s">
                <div className="text">
                  <div className="icon">
                    <img src="/assets/images/icon/001-03.png" alt="Flexible Packaging Icon" />
                  </div>
                  <h5 className="title">{t('features.flexiblePackaging.title')}</h5>
                  <p>{t('features.flexiblePackaging.description')}</p>
                </div>
              </div>
            </div>
            
            {/* Fifth box centered */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
              <div className="features-thumb-item-two enhanced-feature-box h-100 wow fadeInDown" data-wow-delay=".4s">
                <div className="text">
                  <div className="icon">
                    <img src="/assets/images/icon/001-05.png" alt="Logistics Strength Icon" />
                  </div>
                  <h5 className="title">{t('features.logisticsStrength.title')}</h5>
                  <p>{t('features.logisticsStrength.description')}</p>
                </div>
              </div>
            </div>
            
            {/* Sixth box - Private Labels */}
            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-4">
              <div className="features-thumb-item-two enhanced-feature-box h-100 wow fadeInUp" data-wow-delay=".45s">
                <div className="text">
                  <div className="icon">
                    <i className="fas fa-tags" style={{ fontSize: '21px', color: '#ffffff' }}></i>
                  </div>
                  <h5 className="title">{t('features.privateLabels.title')}</h5>
                  <p>{t('features.privateLabels.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Important Highlights Section ======*/}

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

export default About;
