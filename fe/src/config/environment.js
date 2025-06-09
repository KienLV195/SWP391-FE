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
  // API configuration
  api: {
    baseUrl: getEnvVar('VITE_API_URL', 'http://localhost:8080/api'),
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
  console.log('Environment configuration:', {
    environment: config.app.environment,
    apiBaseUrl: config.api.baseUrl,
    hospital: config.hospital.name
  });
}

export default config;
