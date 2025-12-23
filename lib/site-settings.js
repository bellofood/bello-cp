/**
 * Helper functions for fetching and using site settings
 */

/**
 * Fetch site settings from API
 * @returns {Promise<Object>} Site settings data
 */
export async function getSiteSettings() {
  try {
    const response = await fetch('/api/site-settings');
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    
    // Return defaults if fetch fails
    return getDefaultSettings();
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return getDefaultSettings();
  }
}

/**
 * Get default settings (fallback)
 * @returns {Object} Default settings
 */
export function getDefaultSettings() {
  return {
    company_name: 'Bello Food',
    address: '10th of Ramadan City, Industrial Area, Egypt',
    email: 'marketing@bello-food.com',
    phone: '+20 11 0 15 111 85',
    website: 'www.bello-food.com',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
    linkedin_url: '',
    youtube_url: '',
    pinterest_url: '',
    whatsapp_number: '201101511185',
    whatsapp_message: 'Hello Bello Food, I would like to inquire about your products',
    working_hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
    google_maps_url: 'https://maps.app.goo.gl/j7Qa6LR51jspaizn8?g_st=com.google.maps.preview.copy'
  };
}

/**
 * Format social media links for display
 * @param {Object} settings - Site settings object
 * @returns {Array} Array of social media objects with platform, url, and icon
 */
export function getSocialMediaLinks(settings) {
  const links = [];
  
  if (settings.facebook_url) {
    links.push({
      platform: 'Facebook',
      url: settings.facebook_url,
      icon: 'fab fa-facebook-f'
    });
  }
  
  if (settings.instagram_url) {
    links.push({
      platform: 'Instagram',
      url: settings.instagram_url,
      icon: 'fab fa-instagram'
    });
  }
  
  if (settings.linkedin_url) {
    links.push({
      platform: 'LinkedIn',
      url: settings.linkedin_url,
      icon: 'fab fa-linkedin-in'
    });
  }
  
  return links;
}

/**
 * Get WhatsApp link
 * @param {Object} settings - Site settings object
 * @returns {string} WhatsApp link URL
 */
export function getWhatsAppLink(settings) {
  const number = settings.whatsapp_number || '201101511185';
  const message = encodeURIComponent(settings.whatsapp_message || 'Hello Bello Food, I would like to inquire about your products');
  return `https://wa.me/${number}?text=${message}`;
}

