import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ContentManager() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('translations');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [allTranslations, setAllTranslations] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);
  
  // Contact Info state
  const [contactInfo, setContactInfo] = useState({
    address: '',
    email: '',
    phone: ''
  });
  const [savingContact, setSavingContact] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'eg', name: 'Egyptian Arabic', flag: '🇪🇬' }
  ];

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTranslations();
      if (activeTab === 'contact') {
        fetchContactInfo();
      }
    }
  }, [isAuthenticated, selectedLanguage, activeTab]);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/site-settings');
      const data = await response.json();
      if (data.success) {
        setContactInfo({
          address: data.data.address || '',
          email: data.data.email || '',
          phone: data.data.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const saveContactInfo = async () => {
    setSavingContact(true);
    setSaveMessage({ type: '', text: '' });

    try {
      // First, fetch current settings
      const getResponse = await fetch('/api/site-settings');
      const currentData = await getResponse.json();
      
      if (!currentData.success) {
        throw new Error('Failed to fetch current settings');
      }

      // Merge with new contact info
      const updatedSettings = {
        ...currentData.data,
        address: contactInfo.address,
        email: contactInfo.email,
        phone: contactInfo.phone
      };

      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSettings)
      });

      const result = await response.json();
      
      if (result.success) {
        setSaveMessage({ type: 'success', text: '✓ Contact information saved successfully!' });
        
        // Refresh the data to show updated values
        await fetchContactInfo();
        
        setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      } else {
        setSaveMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save contact information' });
    } finally {
      setSavingContact(false);
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const fetchTranslations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/content-manager/translations?language=${selectedLanguage}`, {
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || 'dummy')
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setTranslations(data.translations);
        
        // Also fetch all languages for comparison
        const allResponse = await fetch('/api/content-manager/translations', {
          headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || 'dummy')
          }
        });
        const allData = await allResponse.json();
        if (allData.success) {
          setAllTranslations(allData.translations);
        }
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setIsLoading(false);
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

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const startEditing = (path, value) => {
    setEditingKey(path);
    setEditValue(value);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const saveTranslation = async (path) => {
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/content-manager/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('authToken') || 'dummy')
        },
        body: JSON.stringify({
          language: selectedLanguage,
          path,
          value: editValue
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSaveMessage({ type: 'success', text: `✓ Saved successfully!` });
        setEditingKey(null);
        fetchTranslations(); // Reload translations
        
        setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000);
      } else {
        setSaveMessage({ type: 'error', text: `Error: ${data.error}` });
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save translation' });
    } finally {
      setIsSaving(false);
    }
  };

  const renderTranslationTree = (obj, parentPath = '') => {
    if (!obj) return null;

    return Object.entries(obj).map(([key, value]) => {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;
      const isExpanded = expandedSections[currentPath];
      const isEditing = editingKey === currentPath;
      const matchesSearch = searchTerm === '' || 
        currentPath.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch && typeof value === 'string') {
        return null;
      }

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Section
        return (
          <div key={currentPath} style={{ marginBottom: '10px' }}>
            <div
              onClick={() => toggleSection(currentPath)}
              style={{
                padding: '12px 15px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #dee2e6',
                marginBottom: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`} style={{ fontSize: '12px', color: '#6c757d' }}></i>
                <span style={{ fontWeight: '600', color: '#495057', fontSize: '14px' }}>{key}</span>
                <span style={{ 
                  padding: '2px 8px', 
                  background: '#5a7249', 
                  color: 'white', 
                  borderRadius: '12px',fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {Object.keys(value).length}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'monospace' }}>{currentPath}</span>
            </div>
            
            {isExpanded && (
              <div style={{ marginLeft: '20px', marginTop: '8px' }}>
                {renderTranslationTree(value, currentPath)}
              </div>
            )}
          </div>
        );
      } else if (Array.isArray(value)) {
        // Array
        return (
          <div key={currentPath} style={{ marginBottom: '10px' }}>
            <div
              onClick={() => toggleSection(currentPath)}
              style={{
                padding: '12px 15px',
                background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #ffeaa7',
                marginBottom: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`} style={{ fontSize: '12px' }}></i>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{key}</span>
                <span style={{ 
                  padding: '2px 8px', 
                  background: '#856404', 
                  color: 'white', 
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  [{value.length}]
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#856404', fontFamily: 'monospace' }}>{currentPath}</span>
            </div>
            
            {isExpanded && (
              <div style={{ marginLeft: '20px', marginTop: '8px' }}>
                {value.map((item, index) => (
                  <div key={`${currentPath}[${index}]`} style={{ marginBottom: '8px' }}>
                    {typeof item === 'string' ? (
                      <div style={{
                        padding: '10px',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #dee2e6'
                      }}>
                        <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '5px' }}>
                          [{index}]
                        </div>
                        <div>{item}</div>
                      </div>
                    ) : (
                      renderTranslationTree({ [index]: item }, currentPath)
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      } else {
        // String value - editable
        return (
          <div key={currentPath} style={{
            marginBottom: '8px',
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            border: isEditing ? '2px solid #5a7249' : '1px solid #dee2e6',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '8px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#6c757d', marginBottom: '4px', fontFamily: 'monospace' }}>
                  {currentPath}
                </div>
                {isEditing ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '10px',
                      border: '1px solid #ced4da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    autoFocus
                  />
                ) : (
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#212529',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {value || <span style={{ color: '#adb5bd', fontStyle: 'italic' }}>Empty</span>}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '5px', marginLeft: '15px' }}>
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveTranslation(currentPath)}
                      disabled={isSaving}
                      style={{
                        padding: '6px 12px',
                        background: '#5a7249',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      {isSaving ? <i className="fas fa-spinner fa-spin"></i> : '✓ Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={isSaving}
                      style={{
                        padding: '6px 12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: isSaving ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEditing(currentPath, value)}
                    style={{
                      padding: '6px 12px',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                )}
              </div>
            </div>
            
            {/* Show translations in other languages */}
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e9ecef' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#6c757d', marginBottom: '6px' }}>
                Other Languages:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {languages.filter(l => l.code !== selectedLanguage).map(lang => {
                  const otherValue = getNestedValue(allTranslations[lang.code], currentPath);
                  return (
                    <div key={lang.code} style={{
                      padding: '6px 10px',
                      background: '#f8f9fa',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      <span style={{ fontWeight: '600', marginRight: '6px' }}>{lang.flag} {lang.name}:</span>
                      <span style={{ color: '#6c757d' }}>
                        {otherValue || <em style={{ color: '#adb5bd' }}>Not set</em>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
    }).filter(Boolean);
  };

  const getNestedValue = (obj, path) => {
    if (!obj) return null;
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
        padding: '20px 40px',
        color: 'white',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>
              <i className="fas fa-language"></i> Content Manager
            </h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              Edit website content and contact information
            </p>
          </div>
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
                fontWeight: '500'
              }}
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
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 20px' }}>
        {/* Success/Error Message */}
        {saveMessage.text && (
          <div style={{
            padding: '15px 20px',
            marginBottom: '20px',
            borderRadius: '8px',
            background: saveMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            color: saveMessage.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${saveMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {saveMessage.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          background: 'white',
          padding: '10px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <button
            onClick={() => setActiveTab('translations')}
            style={{
              flex: 1,
              padding: '15px 20px',
              background: activeTab === 'translations' 
                ? 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)'
                : 'transparent',
              color: activeTab === 'translations' ? 'white' : '#495057',
              border: activeTab === 'translations' ? 'none' : '2px solid #dee2e6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <i className="fas fa-language"></i>
            Translations
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            style={{
              flex: 1,
              padding: '15px 20px',
              background: activeTab === 'contact' 
                ? 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)'
                : 'transparent',
              color: activeTab === 'contact' ? 'white' : '#495057',
              border: activeTab === 'contact' ? 'none' : '2px solid #dee2e6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <i className="fas fa-address-card"></i>
            Contact Information
          </button>
        </div>

        {/* Controls Bar - Only show for translations */}
        {activeTab === 'translations' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
            {/* Language Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                Select Language:
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setSearchTerm('');
                      setExpandedSections({});
                      setEditingKey(null);
                    }}
                    style={{
                      padding: '10px 20px',
                      background: selectedLanguage === lang.code 
                        ? 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)'
                        : '#f8f9fa',
                      color: selectedLanguage === lang.code ? 'white' : '#495057',
                      border: selectedLanguage === lang.code ? 'none' : '2px solid #dee2e6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      flex: 1
                    }}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#495057', fontSize: '14px' }}>
                Search:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by key or value..."
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                Object.keys(translations).forEach(key => {
                  setExpandedSections(prev => ({ ...prev, [key]: true }));
                });
              }}
              style={{
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-expand"></i> Expand All
            </button>
            <button
              onClick={() => setExpandedSections({})}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-compress"></i> Collapse All
            </button>
            <button
              onClick={fetchTranslations}
              style={{
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>
        )}

        {/* Translation Tree - Only show for translations tab */}
        {activeTab === 'translations' && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            minHeight: '400px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#495057' }}>
              {languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name} Content
            </h3>
            
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
                <p>Loading translations...</p>
              </div>
            ) : (
              <div>
                {renderTranslationTree(translations)}
              </div>
            )}
          </div>
        )}

        {/* Contact Information Tab */}
        {activeTab === 'contact' && (
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: '10px', 
              color: '#495057',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              <i className="fas fa-address-card"></i> Edit Contact Page Information
            </h3>
            <p style={{ color: '#6c757d', marginBottom: '30px', fontSize: '14px' }}>
              Edit the information displayed in the three contact cards on your contact page.
            </p>

            {/* Contact Info Form */}
            <div style={{ maxWidth: '800px' }}>
              {/* Headquarters */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px', 
                  fontWeight: '600', 
                  color: '#495057', 
                  fontSize: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  Headquarters Address
                </label>
                <textarea
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  placeholder="10th of Ramadan City, Industrial Area, Egypt"
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  This will be displayed in the "Headquarters" card on the contact page
                </small>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px', 
                  fontWeight: '600', 
                  color: '#495057', 
                  fontSize: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  Email Address
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  placeholder="marketing@bello-food.com"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  This will be displayed in the "Email" card with a clickable mailto link
                </small>
              </div>

              {/* Phone / WhatsApp */}
              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px', 
                  fontWeight: '600', 
                  color: '#495057', 
                  fontSize: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  placeholder="+20 11 0 15 111 85"
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    border: '2px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  This will be displayed in the "Phone / WhatsApp" card with a clickable tel link
                </small>
              </div>

              {/* Info Box */}
              <div style={{
                padding: '15px 20px',
                background: '#e7f3ff',
                border: '1px solid #b3d9ff',
                borderRadius: '8px',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'start',
                gap: '12px'
              }}>
                <i className="fas fa-info-circle" style={{ color: '#0066cc', fontSize: '18px', marginTop: '2px' }}></i>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: '#0066cc', display: 'block', marginBottom: '5px' }}>Note:</strong>
                  <p style={{ margin: 0, fontSize: '13px', color: '#004d99', lineHeight: '1.5' }}>
                    These changes will be reflected on the Contact page in the three information cards. 
                    The information will also be updated in the footer across all pages.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={saveContactInfo}
                disabled={savingContact}
                style={{
                  padding: '14px 40px',
                  background: savingContact ? '#95a5a6' : 'linear-gradient(135deg, #5a7249 0%, #4a5f3a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: savingContact ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(90, 114, 73, 0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (!savingContact) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(90, 114, 73, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!savingContact) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(90, 114, 73, 0.3)';
                  }
                }}
              >
                {savingContact ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save Contact Information
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

