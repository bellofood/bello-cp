import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdManagement() {
  const router = useRouter();
  const [currentAdImage, setCurrentAdImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
      fetchCurrentAd();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const fetchCurrentAd = async () => {
    try {
      const response = await fetch('/api/ad-settings?t=' + Date.now());
      const data = await response.json();
      console.log('Fetched ad settings:', data);
      if (data.success) {
        // Add timestamp to prevent caching
        const imageUrl = data.adImage.includes('?') 
          ? `${data.adImage}&t=${Date.now()}`
          : `${data.adImage}?t=${Date.now()}`;
        console.log('Setting ad image to:', imageUrl);
        setCurrentAdImage(imageUrl);
      } else {
        console.error('Failed to fetch ad:', data);
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'File size must be less than 10MB' });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('adImage', selectedFile);

      const response = await fetch('/api/upload-ad-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Ad image updated successfully! Users will see the new ad on their next visit.' });
        
        // Add timestamp to prevent caching
        const imageUrl = data.imageUrl.includes('?') 
          ? `${data.imageUrl}&t=${Date.now()}`
          : `${data.imageUrl}?t=${Date.now()}`;
        setCurrentAdImage(imageUrl);
        
        setSelectedFile(null);
        setPreviewUrl('');
        
        // Clear the file input
        document.getElementById('fileInput').value = '';
        
        // Clear session storage so users will see the new ad
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('hasSeenAd');
        }
        
        // Refresh the ad preview
        setTimeout(() => {
          fetchCurrentAd();
        }, 500);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'An error occurred while uploading' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
        padding: '20px 40px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Advertisement Management</h1>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/website-editor')}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            ← Website Customizer
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#d32f2f',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#c62828'}
            onMouseLeave={(e) => e.target.style.background = '#d32f2f'}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
        {/* Message Alert */}
        {message.text && (
          <div style={{
            padding: '15px 20px',
            marginBottom: '30px',
            borderRadius: '12px',
            background: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '15px',
            fontWeight: '500'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Current Ad Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '22px' }}>
              Current Advertisement
            </h2>
            {isLoading ? (
              <div style={{
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                background: '#f9f9f9',
                padding: '100px',
                textAlign: 'center',
                color: '#999'
              }}>
                Loading current ad...
              </div>
            ) : (
              <div style={{
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#f9f9f9'
              }}>
                <img 
                  key={currentAdImage}
                  src={currentAdImage} 
                  alt="Current Ad"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/images/promo-banner.jpg?t=' + Date.now();
                  }}
                />
              </div>
            )}
            <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
              This is the ad that appears when users first visit the website.
            </p>
            <button
              onClick={() => {
                setIsLoading(true);
                fetchCurrentAd();
              }}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                background: '#5a7249',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              🔄 Refresh Preview
            </button>
          </div>

          {/* Upload New Ad Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '22px' }}>
              Upload New Advertisement
            </h2>
            
            {/* File Input */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                color: '#555',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                Select Image File
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px dashed #5a7249',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              />
              <p style={{ marginTop: '8px', fontSize: '13px', color: '#888' }}>
                Supported formats: JPG, PNG, GIF (Max 10MB)
              </p>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div style={{ marginBottom: '25px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  color: '#555',
                  fontSize: '15px',
                  fontWeight: '600'
                }}>
                  Preview
                </label>
                <div style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#f9f9f9'
                }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              style={{
                width: '100%',
                padding: '15px',
                background: selectedFile && !isUploading 
                  ? 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)'
                  : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: selectedFile && !isUploading ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                boxShadow: selectedFile && !isUploading ? '0 4px 15px rgba(90, 114, 73, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedFile && !isUploading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(90, 114, 73, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFile && !isUploading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(90, 114, 73, 0.3)';
                }
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload & Update Advertisement'}
            </button>

            {/* Instructions */}
            <div style={{
              marginTop: '25px',
              padding: '15px',
              background: '#f0f7ff',
              borderRadius: '10px',
              border: '1px solid #d0e7ff'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0066cc' }}>
                📌 Instructions:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#555', lineHeight: '1.8' }}>
                <li>Select an image from your device</li>
                <li>Preview will appear before uploading</li>
                <li>Click upload to update the ad</li>
                <li>Users will see the new ad on their next visit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

