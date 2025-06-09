/**
 * Geolib Service - Location and distance calculations
 * Clean version without syntax errors
 */

class GeolibService {
  // Hospital coordinates
  static HOSPITAL_COORDINATES = {
    name: 'Bệnh viện Đa khoa Ánh Dương',
    address: 'Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam',
    lat: 10.7751237,
    lng: 106.6862143
  };

  /**
   * Calculate distance between two points using Haversine formula
   */
  static getDistance(point1, point2) {
    if (!point1 || !point2 || !point1.lat || !point1.lng || !point2.lat || !point2.lng) {
      return null;
    }

    const R = 6371; // Earth's radius in kilometers
    const dLat = GeolibService.toRadians(point2.lat - point1.lat);
    const dLng = GeolibService.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(GeolibService.toRadians(point1.lat)) * 
              Math.cos(GeolibService.toRadians(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100;
  }

  /**
   * Convert degrees to radians
   */
  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate distance from a point to the hospital
   */
  static getDistanceToHospital(coordinates) {
    return GeolibService.getDistance(coordinates, GeolibService.HOSPITAL_COORDINATES);
  }

  /**
   * Format distance for display
   */
  static formatDistance(distance) {
    if (!distance) return 'Không xác định';
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance}km`;
  }

  /**
   * Get priority level based on distance for emergency cases
   */
  static getDistancePriority(distance) {
    if (!distance) return 'unknown';
    
    if (distance <= 5) return 'very_high';
    if (distance <= 10) return 'high';
    if (distance <= 20) return 'medium';
    if (distance <= 50) return 'low';
    return 'very_low';
  }

  /**
   * Get priority text
   */
  static getPriorityText(priority) {
    switch (priority) {
      case 'very_high': return 'Rất cao';
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      case 'very_low': return 'Rất thấp';
      default: return 'Không xác định';
    }
  }

  /**
   * Get priority color
   */
  static getPriorityColor(priority) {
    switch (priority) {
      case 'very_high': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      case 'very_low': return '#6c757d';
      default: return '#6c757d';
    }
  }

  /**
   * Check blood type compatibility
   */
  static isBloodTypeCompatible(donorType, recipientType) {
    const compatibility = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };

    return compatibility[donorType]?.includes(recipientType) || false;
  }

  /**
   * Get distance category for UI styling
   */
  static getDistanceCategory(distance) {
    if (!distance) return 'unknown';

    if (distance <= 5) return 'very-close';
    if (distance <= 10) return 'close';
    if (distance <= 20) return 'moderate';
    if (distance <= 50) return 'far';
    return 'very-far';
  }

  /**
   * Get current location using browser geolocation
   */
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  /**
   * Generate Google Maps directions URL
   */
  static getDirectionsUrl(destination) {
    if (!destination) return '#';

    const hospital = GeolibService.HOSPITAL_COORDINATES;
    return `https://www.google.com/maps/dir/${destination.lat},${destination.lng}/${hospital.lat},${hospital.lng}`;
  }

  /**
   * Find nearby donors - TODO_API_REPLACE with actual API call
   * GET /api/donors/nearby?bloodType={bloodType}&maxDistance={maxDistance}&urgency={urgency}
   */
  static async findNearbyDonors(bloodType, maxDistance = 50, urgency = 'normal') {
    try {
      // TODO_API_REPLACE: Replace with actual API call
      // const response = await fetch(`${config.api.baseUrl}/donors/nearby?bloodType=${bloodType}&maxDistance=${maxDistance}&urgency=${urgency}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   return data.donors;
      // } else {
      //   throw new Error(data.message);
      // }

      // MOCK_DATA: Remove this section when implementing real API
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockDonors = [
            {
              id: 1,
              name: 'Nguyễn Văn A',
              bloodType: 'O+',
              phone: '0123456789',
              email: 'nguyenvana@email.com',
              coordinates: { lat: 10.7751000, lng: 106.6862000 },
              address: '120 Đường ABC, Quận 1, TP.HCM',
              lastDonationDate: '2024-10-15',
              isEligible: true,
              healthStatus: 'healthy',
              totalDonations: 8,
              registrationDate: '2022-01-15'
            },
            {
              id: 2,
              name: 'Trần Thị B',
              bloodType: 'O+',
              phone: '0987654321',
              email: 'tranthib@email.com',
              coordinates: { lat: 10.7800000, lng: 106.6900000 },
              address: '456 Đường XYZ, Quận 3, TP.HCM',
              lastDonationDate: '2024-09-20',
              isEligible: true,
              healthStatus: 'healthy',
              totalDonations: 12,
              registrationDate: '2021-06-10'
            }
          ];

          let compatibleDonors = mockDonors.filter(donor => {
            return GeolibService.isBloodTypeCompatible(donor.bloodType, bloodType);
          });

          compatibleDonors = compatibleDonors.map(donor => {
            const distance = GeolibService.getDistanceToHospital(donor.coordinates);
            const priority = GeolibService.getDistancePriority(distance);

            return {
              ...donor,
              distance,
              priority,
              priorityText: GeolibService.getPriorityText(priority),
              priorityColor: GeolibService.getPriorityColor(priority)
            };
          });

          compatibleDonors = compatibleDonors.filter(donor =>
            donor.distance && donor.distance <= maxDistance
          );

          compatibleDonors.sort((a, b) => {
            if (a.isEligible && !b.isEligible) return -1;
            if (!a.isEligible && b.isEligible) return 1;
            return a.distance - b.distance;
          });

          if (urgency === 'emergency') {
            compatibleDonors = compatibleDonors.filter(donor => donor.distance <= 20);
          }

          resolve(compatibleDonors);
        }, 800);
      });
    } catch (error) {
      console.error('Error finding nearby donors:', error);
      return [];
    }
  }
}

export default GeolibService;
