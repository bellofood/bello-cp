import { useState, useEffect } from 'react';

const AdPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [adImage, setAdImage] = useState('/assets/images/promo-banner.jpg');

  useEffect(() => {
    console.log('AdPopup component mounted');
    
    // Check if user has already seen the ad in this session
    const hasSeenAd = sessionStorage.getItem('hasSeenAd');
    console.log('Has seen ad:', hasSeenAd);
    
    if (!hasSeenAd) {
      // Fetch the current ad image from the database
      fetch('/api/ad-settings')
        .then(res => res.json())
        .then(data => {
          console.log('Ad settings fetched:', data);
          if (data.success && data.adImage) {
            // Add timestamp to prevent caching
            const imageUrl = data.adImage.includes('?') 
              ? `${data.adImage}&t=${Date.now()}`
              : `${data.adImage}?t=${Date.now()}`;
            setAdImage(imageUrl);
          }
          // Show the popup after a short delay
          setTimeout(() => {
            console.log('Showing ad popup');
            setIsVisible(true);
          }, 1000);
        })
        .catch(error => {
          console.error('Error fetching ad:', error);
          // Show default ad even if fetch fails
          setTimeout(() => {
            console.log('Showing default ad popup');
            setIsVisible(true);
          }, 1000);
        });
    } else {
      console.log('Ad already seen in this session');
    }
  }, []);

  const handleClose = () => {
    console.log('Closing ad popup');
    setIsVisible(false);
    // Remember that user has seen the ad for this session
    sessionStorage.setItem('hasSeenAd', 'true');
  };

  // Removed console.log to prevent spam

  if (!isVisible) return null;

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
              e.currentTarget.style.backgroundColor = '#d32f2f';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              e.currentTarget.style.transform = 'scale(1)';
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
              // Fallback to default image if custom image fails to load
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
};

export default AdPopup;
