/**
 * Environment configuration for the application
 * Safely handles environment variables in browser context
 */

// Get environment variable with fallback
const getEnvVar = (key, defaultValue = '') => {
  return import.meta.env[key] || defaultValue;
};

// Environment configuration
const config = {
  azureBaseURL: import.meta.env.VITE_AZURE_BASE_URL || 'https://blooddonationswp391-h6b6cvehfca8dpey.canadacentral-01.azurewebsites.net',
  // API configuration
  api: {
    baseUrl: getEnvVar('VITE_API_URL', 'http://localhost:8080/api'),
    news: getEnvVar('VITE_NEWS_API', ''),
    bloodArticles: getEnvVar('VITE_BLOOD_ARTICLES_API', ''),
    auth: getEnvVar('VITE_AUTH_API', ''),
    information: getEnvVar('VITE_INFORMATION_API', ''),
    nominatim: getEnvVar('VITE_NOMINATIM_API', ''),
  },

  // Application environment
  app: {
    environment: getEnvVar('VITE_ENVIRONMENT', 'development'),
    isDevelopment: function() {
      return this.environment === 'development';
    },
    isProduction: function() {
      return this.environment === 'production';
    }
  },

  // Hospital coordinates (fixed)
  hospital: {
    name: 'Bệnh viện Đa khoa Ánh Dương',
    address: 'Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam',
    coordinates: {
      lat: 10.7751237,
      lng: 106.6862143
    }
  }
};

// Log configuration in development
if (config.app.isDevelopment()) {
  }

export default config;
