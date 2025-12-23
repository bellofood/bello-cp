import { useEffect } from 'react';

const NewsletterSuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        maxWidth: '400px',
        animation: 'slideInRight 0.4s ease-out',
      }}
    >
      <div 
        style={{
          background: 'linear-gradient(135deg, #4D602C 0%, #5a7333 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(77, 96, 44, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div 
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className="fas fa-check" style={{ fontSize: '24px', color: '#fff' }}></i>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '16px', 
            fontWeight: '700',
            color: '#fff'
          }}>
            Successfully Subscribed!
          </h4>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            opacity: 0.95,
            lineHeight: '1.4',
            color: '#fff'
          }}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '4px 8px',
            fontSize: '20px',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => e.target.style.opacity = 1}
          onMouseLeave={(e) => e.target.style.opacity = 0.7}
        >
          ×
        </button>
      </div>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsletterSuccessToast;

