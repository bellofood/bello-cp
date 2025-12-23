import Preloader from "@/src/layouts/Preloader";
import AdPopup from "@/components/AdPopup";
import Head from "next/head";
import Script from "next/script";
import { Fragment, useEffect, useState } from "react";
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import "/styles/globals.css";
const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // Set dir attribute based on locale with safety checks
    if (typeof window !== 'undefined' && document.documentElement) {
      const isRTL = router.locale === 'ar';
      const direction = isRTL ? 'rtl' : 'ltr';
      const language = router.locale || 'en';
      
      // Only update if values have changed to prevent unnecessary re-renders
      if (document.documentElement.getAttribute('dir') !== direction) {
        document.documentElement.setAttribute('dir', direction);
      }
      if (document.documentElement.getAttribute('lang') !== language) {
        document.documentElement.setAttribute('lang', language);
      }
      
      // Also set on body for extra compatibility
      document.body.setAttribute('dir', direction);
    }
  }, [router.locale]);

  return (
    <Fragment>
      <Head>
        {/*====== Required meta tags ======*/}
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="description"
          content="Landscaping, Gardening, Florists, Groundskeeping"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/*====== Title ======*/}
        <title>Bello - Premium Olive Products &amp; Mediterranean Specialties</title>
        {/*====== Favicon Icon ======*/}
        <link
          rel="shortcut icon"
          href="/assets/images/favicon.ico"
          type="image/png"
        />
        {/*====== Social Media Footer CSS ======*/}
        <link
          rel="stylesheet"
          href="/assets/css/social-media-footer.css"
        />

      </Head>
      {loading && <Preloader />}
      {!loading && (
        <>
          {/* Don't show AdPopup on admin pages */}
          {!router.pathname.startsWith('/admin') && 
           !router.pathname.startsWith('/website-editor') && 
           !router.pathname.startsWith('/login') && (
          <AdPopup />
          )}
          <Component {...pageProps} />
        </>
      )}
      
      {/* Call Button */}
      <div 
        id="call-button" 
        onClick={() => window.open('tel:+201101511185', '_self')}
        style={{
          position: 'fixed',
          bottom: '120px',
          right: '30px',
          width: '70px',
          height: '70px',
          backgroundColor: '#4D602C',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(77, 96, 44, 0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-5px) scale(1.05)';
          e.target.style.boxShadow = '0 8px 30px rgba(77, 96, 44, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(77, 96, 44, 0.4)';
        }}
      >
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="white"
        >
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
      </div>

      {/* WhatsApp Button */}
      <div 
        id="whatsapp-button" 
        onClick={() => window.open('https://wa.me/01101511185', '_blank')}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '70px',
          height: '70px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-5px) scale(1.05)';
          e.target.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
        }}
      >
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="white"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.690z"/>
        </svg>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div 
          id="scroll-to-top-button"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '210px',
            right: '30px',
            width: '50px',
            height: '50px',
            backgroundColor: '#5a7249',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(90, 114, 73, 0.4)',
            transition: 'all 0.3s ease',
            animation: 'fadeInUp 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(90, 114, 73, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(90, 114, 73, 0.4)';
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="white"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* RTL Support for Scroll to Top Button */
        html[dir="rtl"] #scroll-to-top-button {
          right: auto !important;
          left: 30px !important;
        }
        
        @media (max-width: 768px) {
          html[dir="rtl"] #scroll-to-top-button {
            left: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          html[dir="rtl"] #scroll-to-top-button {
            left: 15px !important;
          }
        }
      `}</style>
    </Fragment>
  );
};
export default appWithTranslation(App);
