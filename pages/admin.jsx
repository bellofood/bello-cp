import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Admin() {
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const router = useRouter();

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
      const data = await response.json();
      setUser(data.user);
      fetchData();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch contact submissions
      const contactResponse = await fetch('/api/contact');
      const contactData = await contactResponse.json();
      
      if (contactData.success) {
        setContactSubmissions(contactData.data);
      }

      // Fetch job applications
      const jobResponse = await fetch('/api/job-application');
      const jobData = await jobResponse.json();
      
      if (jobData.success) {
        setJobApplications(jobData.data);
      }

      // Fetch newsletter subscribers
      const newsletterResponse = await fetch('/api/newsletter');
      const newsletterData = await newsletterResponse.json();
      
      if (newsletterData.success) {
        setNewsletterSubscribers(newsletterData.data);
      }

    } catch (err) {
      setError('Failed to fetch data');
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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

  const handleSelectItem = (id, type) => {
    const itemKey = `${type}-${id}`;
    setSelectedItems(prev => 
      prev.includes(itemKey) 
        ? prev.filter(item => item !== itemKey)
        : [...prev, itemKey]
    );
  };

  const handleSelectAll = (type) => {
    const items = type === 'contact' ? contactSubmissions : jobApplications;
    const allItems = items.map(item => `${type}-${item.id}`);
    const currentTypeSelected = selectedItems.filter(item => item.startsWith(`${type}-`));
    
    if (currentTypeSelected.length === allItems.length) {
      // Deselect all of this type
      setSelectedItems(prev => prev.filter(item => !item.startsWith(`${type}-`)));
    } else {
      // Select all of this type
      setSelectedItems(prev => [
        ...prev.filter(item => !item.startsWith(`${type}-`)),
        ...allItems
      ]);
    }
  };

  const handleBulkDelete = async (type) => {
    const itemsToDelete = selectedItems
      .filter(item => item.startsWith(`${type}-`))
      .map(item => item.substring(type.length + 1)); // Remove "type-" prefix to get full ID

    if (itemsToDelete.length === 0) {
      alert('Please select items to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${itemsToDelete.length} ${type} submission(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/${type === 'contact' ? 'contact' : 'job-application'}/bulk-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: itemsToDelete })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove deleted items from state
        if (type === 'contact') {
          setContactSubmissions(prev => prev.filter(item => !itemsToDelete.includes(item.id.toString())));
        } else if (type === 'jobs') {
          setJobApplications(prev => prev.filter(item => !itemsToDelete.includes(item.id.toString())));
        }
        
        // Clear selections
        setSelectedItems(prev => prev.filter(item => !item.startsWith(`${type}-`)));
        
        alert(data.message || `Successfully deleted ${itemsToDelete.length} item(s)`);
        
        // Refresh data
        fetchData();
      } else {
        console.error('Delete failed:', data);
        alert(data.error || 'Failed to delete items. Please try again.');
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Error deleting items. Please try again.');
    }
  };

  const exportToCSV = (data, filename, type) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    let headers, rows;
    if (type === 'contact') {
      headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Submitted'];
      rows = data.map(item => [
        item.display_id ? `#${item.display_id}` : item.id,
        item.name,
        item.email,
        item.phone,
        item.subject,
        item.message.replace(/[\n\r]/g, ' '), // Remove line breaks
        formatDate(item.created_at)
      ]);
    } else {
      headers = ['ID', 'Name', 'Title', 'Position', 'Email', 'Phone', 'Company', 'CV File', 'Submitted'];
      rows = data.map(item => [
        item.display_id ? `#${item.display_id}` : item.id,
        item.name,
        item.title,
        item.position,
        item.email,
        item.phone,
        item.company || 'N/A',
        item.cv_file_name || 'No CV',
        formatDate(item.created_at)
      ]);
    }

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredData = (data) => {
    let filtered = data;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(term)
        )
      );
    }

    // Date filter
    if (dateFilter.start || dateFilter.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
        const endDate = dateFilter.end ? new Date(dateFilter.end + 'T23:59:59') : null;

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    return filtered;
  };

  const ProfileSettings = () => {
    const [profileData, setProfileData] = useState({
      username: user?.username || '',
      full_name: user?.full_name || '',
      email: user?.email || '',
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [profileError, setProfileError] = useState('');

    const handleProfileChange = (e) => {
      setProfileData({
        ...profileData,
        [e.target.name]: e.target.value
      });
      setProfileMessage('');
      setProfileError('');
    };

    const handleProfileSubmit = async (e) => {
      e.preventDefault();
      setProfileLoading(true);
      setProfileMessage('');
      setProfileError('');

      // Validate password change
      if (profileData.new_password && profileData.new_password !== profileData.confirm_password) {
        setProfileError('New passwords do not match');
        setProfileLoading(false);
        return;
      }

      try {
        const updateData = {
          username: profileData.username,
          full_name: profileData.full_name,
          email: profileData.email,
        };

        if (profileData.new_password) {
          updateData.current_password = profileData.current_password;
          updateData.new_password = profileData.new_password;
        }

        const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setProfileMessage('Profile updated successfully');
          // Update local user data
          setUser({ 
            ...user, 
            username: profileData.username,
            full_name: profileData.full_name, 
            email: profileData.email 
          });
          // Clear password fields
          setProfileData({
            ...profileData,
            current_password: '',
            new_password: '',
            confirm_password: ''
          });
        } else {
          setProfileError(data.error || 'Failed to update profile');
        }
      } catch (error) {
        setProfileError('Network error. Please try again.');
      } finally {
        setProfileLoading(false);
      }
    };

    return (
      <div className="admin-profile-container">
        <div className="admin-profile-card">
          <div className="admin-profile-header">
            <h2 className="admin-profile-title">
              <i className="fas fa-user-cog"></i>
              Profile Settings
            </h2>
          </div>
          <div className="admin-profile-body">
            {profileMessage && (
              <div className="admin-alert admin-alert-success">
                <i className="fas fa-check-circle"></i>
                {profileMessage}
              </div>
            )}

            {profileError && (
              <div className="admin-alert admin-alert-danger">
                <i className="fas fa-exclamation-triangle"></i>
                {profileError}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="username" className="admin-form-label">Login Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="admin-form-input"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    required
                    minLength="3"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="full_name" className="admin-form-label">Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    className="admin-form-input"
                    value={profileData.full_name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="email" className="admin-form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="admin-form-input"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <hr className="admin-form-divider" />

              <h6 className="admin-form-section-title">Change Password (Optional)</h6>

              <div className="admin-form-group">
                <label htmlFor="current_password" className="admin-form-label">Current Password</label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  className="admin-form-input"
                  value={profileData.current_password}
                  onChange={handleProfileChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="new_password" className="admin-form-label">New Password</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    className="admin-form-input"
                    value={profileData.new_password}
                    onChange={handleProfileChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="confirm_password" className="admin-form-label">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    className="admin-form-input"
                    value={profileData.confirm_password}
                    onChange={handleProfileChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="admin-form-footer">
                <button
                  type="submit"
                  className="admin-form-submit"
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <>
                      <div className="admin-spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="admin-profile-info">
              <i className="fas fa-info-circle me-1"></i>
              Username: <strong>{user?.username}</strong> | 
              Last login: {user?.last_login ? formatDate(user.last_login) : 'Never'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContactSubmissionsTable = () => {
    const filteredData = getFilteredData(contactSubmissions);
    const selectedContactItems = selectedItems.filter(item => item.startsWith('contact-'));

    return (
      <>
        {/* Advanced Controls */}
        <div className="admin-controls">
          <div className="admin-controls-row">
            <div className="admin-search-container">
              <div className="admin-search-box">
                <i className="fas fa-search admin-search-icon"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="admin-search-clear"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="admin-action-buttons">
              <button 
                className={`admin-btn admin-btn-filters ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="fas fa-filter"></i>
                <span>Filters</span>
              </button>
              <button 
                className="admin-btn admin-btn-export"
                onClick={() => exportToCSV(filteredData, 'contact-submissions.csv', 'contact')}
              >
                <i className="fas fa-download"></i>
                <span>Export CSV</span>
              </button>
              {selectedContactItems.length > 0 && (
                <button 
                  className="admin-btn admin-btn-delete"
                  onClick={() => handleBulkDelete('contact')}
                >
                  <i className="fas fa-trash"></i>
                  <span>Delete Selected ({selectedContactItems.length})</span>
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="admin-filter-panel">
              <div className="admin-filter-row">
                <div className="admin-filter-group">
                  <label className="admin-filter-label">From Date</label>
                  <input
                    type="date"
                    className="admin-filter-input"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="admin-filter-group">
                  <label className="admin-filter-label">To Date</label>
                  <input
                    type="date"
                    className="admin-filter-input"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <div className="admin-filter-group">
                  <label className="admin-filter-label">&nbsp;</label>
                  <button 
                    className="admin-filter-clear"
                    onClick={() => setDateFilter({ start: '', end: '' })}
                  >
                    Clear Dates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="admin-results-summary">
          Showing {filteredData.length} of {contactSubmissions.length} submissions
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    onChange={() => handleSelectAll('contact')}
                    checked={selectedContactItems.length === contactSubmissions.length && contactSubmissions.length > 0}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      checked={selectedItems.includes(`contact-${submission.id}`)}
                      onChange={() => handleSelectItem(submission.id, 'contact')}
                    />
                  </td>
                  <td><span className="admin-badge">#{submission.display_id || submission.id}</span></td>
                  <td className="admin-cell-name">{submission.name}</td>
                  <td className="admin-cell-contact">
                    <div className="admin-contact-info">
                      <div className="admin-contact-item email">
                        <a href={`mailto:${submission.email}`} className="admin-contact-link">
                          <i className="fas fa-envelope admin-contact-icon"></i>
                          <span>{submission.email}</span>
                        </a>
                      </div>
                      <div className="admin-contact-item phone">
                        <a href={`tel:${submission.phone}`} className="admin-contact-link">
                          <i className="fas fa-phone admin-contact-icon"></i>
                          <span>{submission.phone}</span>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="admin-cell-subject">{submission.subject}</td>
                  <td className="admin-cell-message">
                    <div className="admin-message-container">
                      <div className="admin-message-preview" title={submission.message}>
                        {submission.message}
                      </div>
                      {submission.message.length > 100 && (
                        <button 
                          className="admin-message-expand" 
                          title="View full message"
                          onClick={() => {
                            setCurrentMessage(submission);
                            setShowMessageModal(true);
                          }}
                        >
                          <i className="fas fa-expand-alt"></i>
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="admin-cell-date">{formatDate(submission.created_at)}</td>
                  <td className="admin-cell-actions">
                    <button 
                      className="admin-action-btn"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this submission?')) {
                          setSelectedItems([`contact-${submission.id}`]);
                          setTimeout(() => handleBulkDelete('contact'), 100);
                        }
                      }}
                      title="Delete submission"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="admin-no-data">
              <div className="admin-no-data-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <h5 className="admin-no-data-title">No submissions found</h5>
              <p className="admin-no-data-text">
                {searchTerm || dateFilter.start || dateFilter.end 
                  ? 'Try adjusting your search or filters' 
                  : 'Contact submissions will appear here'}
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  const JobApplicationsTable = () => {
    const filteredData = getFilteredData(jobApplications);
    const selectedJobItems = selectedItems.filter(item => item.startsWith('jobs-'));

    return (
      <>
        {/* Advanced Controls */}
        <div className="admin-controls">
          <div className="admin-controls-row">
            <div className="admin-search-container">
              <div className="admin-search-box">
                <i className="fas fa-search admin-search-icon"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="admin-search-clear"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="admin-action-buttons">
              <button 
                className={`admin-btn admin-btn-filters ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="fas fa-filter"></i>
                <span>Filters</span>
              </button>
              <button 
                className="admin-btn admin-btn-export"
                onClick={() => exportToCSV(filteredData, 'job-applications.csv', 'jobs')}
              >
                <i className="fas fa-download"></i>
                <span>Export CSV</span>
              </button>
              {selectedJobItems.length > 0 && (
                <button 
                  className="admin-btn admin-btn-delete"
                  onClick={() => handleBulkDelete('jobs')}
                >
                  <i className="fas fa-trash"></i>
                  <span>Delete Selected ({selectedJobItems.length})</span>
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="admin-filter-panel">
              <div className="admin-filter-row">
                <div className="admin-filter-group">
                  <label className="admin-filter-label">From Date</label>
                  <input
                    type="date"
                    className="admin-filter-input"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="admin-filter-group">
                  <label className="admin-filter-label">To Date</label>
                  <input
                    type="date"
                    className="admin-filter-input"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <div className="admin-filter-group">
                  <label className="admin-filter-label">&nbsp;</label>
                  <button 
                    className="admin-filter-clear"
                    onClick={() => setDateFilter({ start: '', end: '' })}
                  >
                    Clear Dates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="admin-results-summary">
          Showing {filteredData.length} of {jobApplications.length} applications
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    onChange={() => handleSelectAll('jobs')}
                    checked={selectedJobItems.length === jobApplications.length && jobApplications.length > 0}
                  />
                </th>
                <th>ID</th>
                <th>Candidate</th>
                <th>Position</th>
                <th>Contact</th>
                <th>CV</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((application) => (
                <tr key={application.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="admin-checkbox"
                      checked={selectedItems.includes(`jobs-${application.id}`)}
                      onChange={() => handleSelectItem(application.id, 'jobs')}
                    />
                  </td>
                  <td><span className="admin-badge">#{application.display_id || application.id}</span></td>
                  <td className="admin-cell-candidate">
                    <div className="admin-candidate-info">
                      <div className="admin-candidate-name">{application.name}</div>
                      <div className="admin-candidate-title">{application.title}</div>
                      {application.company && (
                        <div className="admin-candidate-company">
                          <i className="fas fa-building"></i>
                          {application.company}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="admin-cell-position">
                    <span className="admin-position-badge">{application.position}</span>
                  </td>
                  <td className="admin-cell-contact">
                    <div className="admin-contact-info">
                      <div className="admin-contact-item email">
                        <a href={`mailto:${application.email}`} className="admin-contact-link">
                          <i className="fas fa-envelope admin-contact-icon"></i>
                          <span>{application.email}</span>
                        </a>
                      </div>
                      <div className="admin-contact-item phone">
                        <a href={`tel:${application.phone}`} className="admin-contact-link">
                          <i className="fas fa-phone admin-contact-icon"></i>
                          <span>{application.phone}</span>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="admin-cell-cv">
                    {application.cv_file_path ? (
                      <div className="admin-cv-container">
                        <div className="admin-cv-file-info">
                          <div className="admin-cv-icon">
                            <i className="fas fa-file-pdf"></i>
                          </div>
                          <div className="admin-cv-details">
                            <div className="admin-cv-name" title={application.cv_file_name}>
                              {application.cv_file_name}
                            </div>
                            <div className="admin-cv-size">
                              {(application.cv_file_size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <a 
                          href={`/api/download-cv/${application.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="admin-cv-download"
                          title="Download CV"
                        >
                          <i className="fas fa-download"></i>
                          <span>Download</span>
                        </a>
                      </div>
                    ) : application.cv_link ? (
                      <div className="admin-cv-container">
                        <div className="admin-cv-file-info">
                          <i className="fas fa-external-link-alt"></i>
                          <span>External CV</span>
                        </div>
                        <a href={application.cv_link} target="_blank" rel="noopener noreferrer" className="admin-cv-download">
                          <i className="fas fa-eye"></i>
                          <span>View</span>
                        </a>
                      </div>
                    ) : (
                      <div className="admin-no-cv">
                        <i className="fas fa-file-times"></i>
                        <span>No CV</span>
                      </div>
                    )}
                  </td>
                  <td className="admin-cell-date">{formatDate(application.created_at)}</td>
                  <td className="admin-cell-actions">
                    <button 
                      className="admin-action-btn"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this application?')) {
                          setSelectedItems([`jobs-${application.id}`]);
                          setTimeout(() => handleBulkDelete('jobs'), 100);
                        }
                      }}
                      title="Delete application"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="admin-no-data">
              <div className="admin-no-data-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h5 className="admin-no-data-title">No applications found</h5>
              <p className="admin-no-data-text">
                {searchTerm || dateFilter.start || dateFilter.end 
                  ? 'Try adjusting your search or filters' 
                  : 'Job applications will appear here'}
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  // Newsletter Subscribers Component
  const NewsletterSection = () => {
    const [newsletterSearch, setNewsletterSearch] = useState('');
    const [exportFormat, setExportFormat] = useState('csv');

    const filteredNewsletter = newsletterSubscribers.filter(subscriber => {
      const searchLower = newsletterSearch.toLowerCase();
      const emailUser = subscriber.email.split('@')[0].toLowerCase();
      return emailUser.includes(searchLower) || subscriber.email.toLowerCase().includes(searchLower);
    });

    const handleExport = async (format) => {
      try {
        const response = await fetch(`/api/newsletter/export?format=${format}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `newsletter-subscribers.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export newsletter subscribers');
      }
    };

    const handleDelete = async (id) => {
      try {
        const response = await fetch(`/api/newsletter?id=${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          fetchData();
        } else {
          alert('Failed to delete subscriber');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete subscriber');
      }
    };

    return (
      <>
        <div className="admin-section-header">
          <div className="admin-section-title">
            <i className="fas fa-mail-bulk me-2"></i>
            <h3>Newsletter Subscribers ({filteredNewsletter.length})</h3>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '14px',
                cursor: 'pointer',
                background: '#fff',
                fontWeight: '500',
                color: '#2d3748',
                transition: 'all 0.2s'
              }}
            >
              <option value="csv">CSV Format</option>
              <option value="json">JSON Format</option>
              <option value="txt">TXT (Emails only)</option>
            </select>
            <button 
              onClick={() => handleExport(exportFormat)}
              style={{ 
                padding: '10px 20px',
                background: '#4D602C',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(77, 96, 44, 0.2)',
                minWidth: '140px',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.target.style.background = '#3d4d23'}
              onMouseOut={(e) => e.target.style.background = '#4D602C'}
            >
              <i className="fas fa-download"></i>
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="admin-filters">
          <div className="admin-filter-group">
            <div className="admin-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by email (before @)..."
                value={newsletterSearch}
                onChange={(e) => setNewsletterSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Email</th>
                <th style={{ width: '15%' }}>Source</th>
                <th style={{ width: '10%' }}>Language</th>
                <th style={{ width: '15%' }}>Subscribed</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsletter.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-envelope" style={{ color: '#4D602C', fontSize: '16px' }}></i>
                      <strong>{subscriber.email}</strong>
                    </div>
                  </td>
                  <td>{subscriber.source || 'Website'}</td>
                  <td>
                    <span className="admin-badge">{subscriber.language || 'en'}</span>
                  </td>
                  <td>{formatDate(subscriber.subscribed_at)}</td>
                  <td>
                    {subscriber.is_active ? (
                      <span className="admin-badge admin-badge-success">
                        <i className="fas fa-check-circle me-1"></i>
                        Active
                      </span>
                    ) : (
                      <span className="admin-badge admin-badge-danger">
                        <i className="fas fa-times-circle me-1"></i>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="admin-action-btn"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${subscriber.email}?`)) {
                          handleDelete(subscriber.id);
                        }
                      }}
                      title="Delete subscriber"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredNewsletter.length === 0 && (
            <div className="admin-no-data">
              <div className="admin-no-data-icon">
                <i className="fas fa-mail-bulk"></i>
              </div>
              <h5 className="admin-no-data-title">No subscribers found</h5>
              <p className="admin-no-data-text">
                {newsletterSearch 
                  ? 'Try adjusting your search' 
                  : 'Newsletter subscribers will appear here'}
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  if (!user) {
    return (
      <div className="admin-body">
        <div className="admin-container">
          <div className="admin-loading">
            <div className="admin-loading-spinner"></div>
            <div className="admin-loading-text">Authenticating...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Belloo</title>
        <meta name="robots" content="noindex, nofollow" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome/css/all.min.css" />
        <link rel="stylesheet" href="/assets/css/admin-modern.css" />
      </Head>

      <div className="admin-body">
        <div className="admin-container">
          <div className="admin-header">
            <div className="admin-header-content">
              <div className="admin-title-wrapper">
                <img src="/assets/images/logo/logo.svg" alt="Belloo Logo" className="admin-logo" />
                <h1 className="admin-title">Admin Dashboard</h1>
              </div>
              <div className="admin-user-info">
                <div className="admin-user-dropdown">
                  <button 
                    className="admin-user-trigger" 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfile(!showProfile);
                    }}
                  >
                    <i className="fas fa-user-circle"></i>
                    <span>{user?.full_name || user?.username}</span>
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  {showProfile && (
                    <div className="admin-user-menu">
                      <button 
                        className="admin-user-menu-item" 
                        onClick={() => {
                          setActiveTab('profile');
                          setShowProfile(false);
                        }}
                      >
                        <i className="fas fa-user-cog me-2"></i>
                        Profile Settings
                      </button>
                      <button 
                        className="admin-user-menu-item danger" 
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={fetchData} 
                  className="admin-refresh-btn"
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="admin-alert admin-alert-danger">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="admin-tabs">
            <ul className="admin-tab-list">
              <li className="admin-tab-item">
                <button 
                  className={`admin-tab-button ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contact')}
                >
                  <i className="fas fa-envelope"></i>
                  <span>Contact Submissions</span>
                  <span className="admin-tab-counter">{contactSubmissions.length}</span>
                </button>
              </li>
              <li className="admin-tab-item">
                <button 
                  className={`admin-tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  <i className="fas fa-briefcase"></i>
                  <span>Job Applications</span>
                  <span className="admin-tab-counter">{jobApplications.length}</span>
                </button>
              </li>
              <li className="admin-tab-item">
                <button 
                  className={`admin-tab-button ${activeTab === 'newsletter' ? 'active' : ''}`}
                  onClick={() => setActiveTab('newsletter')}
                >
                  <i className="fas fa-mail-bulk"></i>
                  <span>Newsletter</span>
                  <span className="admin-tab-counter">{newsletterSubscribers.length}</span>
                </button>
              </li>
              <li className="admin-tab-item">
                <button 
                  className={`admin-tab-button ${activeTab === 'website-editor' ? 'active' : ''}`}
                  onClick={() => router.push('/website-editor')}
                >
                  <i className="fas fa-edit"></i>
                  <span>Website Customizer</span>
                </button>
              </li>
              <li className="admin-tab-item">
                <button 
                  className={`admin-tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user-cog"></i>
                  <span>Profile Settings</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          {loading ? (
            <div className="admin-loading">
              <div className="admin-loading-spinner"></div>
              <div className="admin-loading-text">Loading data...</div>
            </div>
          ) : (
            <div className="admin-content">
              {activeTab === 'contact' && <ContactSubmissionsTable />}
              {activeTab === 'jobs' && <JobApplicationsTable />}
              {activeTab === 'newsletter' && <NewsletterSection />}
              {activeTab === 'profile' && <ProfileSettings />}
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && currentMessage && (
        <div 
          className="admin-modal-overlay"
          onClick={() => setShowMessageModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div 
            className="admin-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'modalSlideIn 0.3s ease-out'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px 28px',
              borderBottom: '2px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #4D602C 0%, #5a7333 100%)',
              borderRadius: '16px 16px 0 0'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: '700',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <i className="fas fa-envelope-open"></i>
                Message Details
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '20px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              {/* Contact Info */}
              <div style={{ 
                marginBottom: '24px',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#64748b', 
                      marginBottom: '6px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Name
                    </div>
                    <div style={{ 
                      fontSize: '15px', 
                      color: '#1e293b',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fas fa-user" style={{ color: '#4D602C', fontSize: '14px' }}></i>
                      {currentMessage.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#64748b', 
                      marginBottom: '6px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Email
                    </div>
                    <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>
                      <a 
                        href={`mailto:${currentMessage.email}`}
                        style={{ 
                          color: '#4D602C',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <i className="fas fa-envelope" style={{ fontSize: '14px' }}></i>
                        {currentMessage.email}
                      </a>
                    </div>
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#64748b', 
                      marginBottom: '6px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Phone
                    </div>
                    <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>
                      <a 
                        href={`tel:${currentMessage.phone}`}
                        style={{ 
                          color: '#4D602C',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <i className="fas fa-phone" style={{ fontSize: '14px' }}></i>
                        {currentMessage.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  marginBottom: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Subject
                </div>
                <div style={{ 
                  fontSize: '18px', 
                  color: '#1e293b',
                  fontWeight: '700',
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  {currentMessage.subject}
                </div>
              </div>

              {/* Message */}
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  marginBottom: '8px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Message
                </div>
                <div style={{ 
                  fontSize: '15px', 
                  color: '#334155',
                  lineHeight: '1.7',
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {currentMessage.message}
                </div>
              </div>

              {/* Date */}
              <div style={{ 
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '13px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-clock"></i>
                Received: {formatDate(currentMessage.created_at)}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </>
  );
}
