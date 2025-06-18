/**
 * Nominatim Geocoding Service
 * Free alternative to Google Maps API using OpenStreetMap data
 */

class NominatimService {
  // Nominatim API endpoint
  static BASE_URL = 'https://nominatim.openstreetmap.org';

  // Hospital coordinates (Bệnh viện Đa khoa Ánh Dương)
  static HOSPITAL_COORDINATES = {
    lat: 10.7751237,
    lng: 106.6862143,
    name: 'Bệnh viện Đa khoa Ánh Dương',
    address: 'Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam'
  };

  /**
   * Geocode an address to get coordinates
   * @param {string} address - The address to geocode
   * @returns {Promise<Object>} - Object containing lat, lng, and formatted_address
   */
  static async geocodeAddress(address) {
    try {
      if (!address || address.trim().length < 5) {
        throw new Error('Địa chỉ quá ngắn');
      }

      // Build search URL with Vietnam country code
      const searchParams = new URLSearchParams({
        q: address,
        format: 'json',
        countrycodes: 'vn',
        limit: 1,
        addressdetails: 1,
        'accept-language': 'vi'
      });

      const url = `${this.BASE_URL}/search?${searchParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BloodDonationApp/1.0 (Contact: admin@blooddonation.com)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error('Không tìm thấy địa chỉ này. Vui lòng kiểm tra lại địa chỉ.');
      }

      const result = data[0];

      // Log for debugging
      console.log('Nominatim geocoding result:', {
        input: address,
        formatted: result.display_name,
        coordinates: { lat: result.lat, lon: result.lon },
        importance: result.importance
      });

      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name,
        place_id: result.place_id,
        importance: result.importance,
        boundingbox: result.boundingbox,
        addressDetails: result.address
      };
    } catch (error) {
      // console.error('Nominatim geocoding error:', error);
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to get address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} - Object containing address information
   */
  static async reverseGeocode(lat, lng) {
    try {
      const searchParams = new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: 1,
        'accept-language': 'vi'
      });

      const url = `${this.BASE_URL}/reverse?${searchParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BloodDonationApp/1.0 (Contact: admin@blooddonation.com)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        address: data.display_name,
        addressDetails: data.address
      };
    } catch (error) {
      console.error('Nominatim reverse geocoding error:', error);
      throw error;
    }
  }

  /**
   * Search for places with autocomplete suggestions
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of place suggestions
   */
  static async searchPlaces(query) {
    try {
      if (!query || query.trim().length < 3) {
        return [];
      }

      const searchParams = new URLSearchParams({
        q: query,
        format: 'json',
        countrycodes: 'vn',
        limit: 5,
        addressdetails: 1,
        'accept-language': 'vi'
      });

      const url = `${this.BASE_URL}/search?${searchParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BloodDonationApp/1.0 (Contact: admin@blooddonation.com)'
        }
      });

      if (!response.ok) {
        console.warn('Places search failed:', response.status);
        return [];
      }

      const data = await response.json();

      return data.map(item => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        importance: item.importance,
        type: item.type,
        addressDetails: item.address
      }));
    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  /**
   * Get detailed information about a specific place
   * @param {string} placeId - Nominatim place ID
   * @returns {Promise<Object>} - Detailed place information
   */
  static async getPlaceDetails(placeId) {
    try {
      const searchParams = new URLSearchParams({
        place_id: placeId,
        format: 'json',
        addressdetails: 1,
        'accept-language': 'vi'
      });

      const url = `${this.BASE_URL}/details?${searchParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'BloodDonationApp/1.0 (Contact: admin@blooddonation.com)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lon),
        address: data.display_name,
        addressDetails: data.address,
        category: data.category,
        type: data.type
      };
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  }

  /**
   * Check if Nominatim service is available
   * @returns {Promise<boolean>} - True if service is available
   */
  static async isServiceAvailable() {
    try {
      const response = await fetch(`${this.BASE_URL}/status`, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'BloodDonationApp/1.0 (Contact: admin@blooddonation.com)'
        }
      });
      return response.ok;
    } catch (error) {
      console.warn('Nominatim service check failed:', error);
      return false;
    }
  }

  /**
   * Get hospital coordinates
   * @returns {Object} - Hospital coordinates and info
   */
  static getHospitalCoordinates() {
    return this.HOSPITAL_COORDINATES;
  }

  /**
   * Format address from Nominatim result for display
   * @param {Object} addressDetails - Address details from Nominatim
   * @returns {string} - Formatted address string
   */
  static formatAddress(addressDetails) {
    if (!addressDetails) return '';

    const parts = [];

    // House number and street
    if (addressDetails.house_number) parts.push(addressDetails.house_number);
    if (addressDetails.road) parts.push(addressDetails.road);

    // Ward/Suburb
    if (addressDetails.suburb) parts.push(addressDetails.suburb);
    else if (addressDetails.quarter) parts.push(addressDetails.quarter);

    // District
    if (addressDetails.city_district) parts.push(addressDetails.city_district);
    else if (addressDetails.county) parts.push(addressDetails.county);

    // City
    if (addressDetails.city) parts.push(addressDetails.city);
    else if (addressDetails.town) parts.push(addressDetails.town);

    // Country
    if (addressDetails.country) parts.push(addressDetails.country);

    return parts.join(', ');
  }
}

export default NominatimService;
