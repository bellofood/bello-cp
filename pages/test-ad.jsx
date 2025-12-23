import { useState } from 'react';

export default function TestAd() {
  const [isVisible, setIsVisible] = useState(true);
  const [adImage] = useState('/assets/images/promo-banner.jpg');

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        background: '#f5f5f5'
      }}>
        <h1>Ad Popup Test Page</h1>
        <p>The popup was closed!</p>
        <button
          onClick={() => setIsVisible(true)}
          style={{
            padding: '15px 30px',
            background: '#5a7249',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Show Ad Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Overlay Background */}
      <div 
        className="ad-popup-overlay"
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-in-out'
        }}
      >
        {/* Popup Container */}
        <div 
          className="ad-popup-container"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90vh',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            animation: 'slideUp 0.4s ease-out'
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d32f2f';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              e.target.style.transform = 'scale(1)';
            }}
            aria-label="Close"
          >
            ×
          </button>

          {/* Ad Image */}
          <img 
            src={adImage}
            alt="Advertisement"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e) => {
              e.target.src = '/assets/images/promo-banner.jpg';
            }}
          />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .ad-popup-container {
            max-width: 95% !important;
            max-height: 85vh !important;
            border-radius: 15px !important;
          }
        }
      `}</style>
    </>
  );
}

