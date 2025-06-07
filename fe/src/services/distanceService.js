// TODO: Replace with actual API calls when backend is ready
class DistanceService {
  // Fixed hospital coordinates
  static HOSPITAL_COORDINATES = {
    lat: 10.7751237,
    lng: 106.6862143,
    name: 'Bệnh viện Đa khoa Ánh Dương',
    address: 'Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam'
  };



  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Calculate distance from donor to hospital
  static calculateDistanceToHospital(donorCoordinates) {
    if (!donorCoordinates || !donorCoordinates.lat || !donorCoordinates.lng) {
      return null;
    }

    return this.calculateDistanceBetweenPoints(
      donorCoordinates.lat,
      donorCoordinates.lng,
      this.HOSPITAL_COORDINATES.lat,
      this.HOSPITAL_COORDINATES.lng
    );
  }

  // Calculate distance between two coordinates using Haversine formula
  static calculateDistanceBetweenPoints(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  // Get estimated travel time (assuming average speed of 30 km/h in city)
  static getEstimatedTravelTime(distance) {
    if (!distance) return null;
    
    const averageSpeed = 30; // km/h
    const timeInHours = distance / averageSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    if (timeInMinutes < 60) {
      return `${timeInMinutes} phút`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}p` : `${hours} giờ`;
    }
  }

  // Get priority level based on distance for emergency cases
  static getDistancePriority(distance) {
    if (!distance) return 'unknown';
    
    if (distance <= 5) return 'very_high';
    if (distance <= 10) return 'high';
    if (distance <= 20) return 'medium';
    if (distance <= 50) return 'low';
    return 'very_low';
  }

  // Get priority text
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

  // Get priority color
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

  // TODO: Replace with actual API call - GET /api/donors/nearby
  static async findNearbyDonors(bloodType, maxDistance = 50, urgency = 'normal') {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock donors with coordinates
        const mockDonors = [
          {
            id: 1,
            name: 'Nguyễn Văn A',
            bloodType: 'O+',
            phone: '0123456789',
            email: 'nguyenvana@email.com',
            coordinates: { lat: 10.7751000, lng: 106.6862000 }, // Very close
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
            coordinates: { lat: 10.7800000, lng: 106.6900000 }, // ~5km
            address: '456 Đường XYZ, Quận 3, TP.HCM',
            lastDonationDate: '2024-09-20',
            isEligible: true,
            healthStatus: 'healthy',
            totalDonations: 12,
            registrationDate: '2021-06-10'
          },
          {
            id: 3,
            name: 'Lê Văn C',
            bloodType: 'O+',
            phone: '0345678901',
            email: 'levanc@email.com',
            coordinates: { lat: 10.8000000, lng: 106.7000000 }, // ~15km
            address: '789 Đường GHI, Quận 7, TP.HCM',
            lastDonationDate: '2024-08-30',
            isEligible: true,
            healthStatus: 'healthy',
            totalDonations: 5,
            registrationDate: '2023-03-20'
          },
          {
            id: 4,
            name: 'Phạm Thị D',
            bloodType: 'O+',
            phone: '0567890123',
            email: 'phamthid@email.com',
            coordinates: { lat: 10.7500000, lng: 106.6500000 }, // ~8km
            address: '321 Đường JKL, Quận 5, TP.HCM',
            lastDonationDate: '2024-07-25',
            isEligible: false, // Not eligible yet
            healthStatus: 'healthy',
            totalDonations: 15,
            registrationDate: '2020-09-12'
          }
        ];

        // Filter by blood type compatibility
        let compatibleDonors = mockDonors.filter(donor => {
          return this.isBloodTypeCompatible(donor.bloodType, bloodType);
        });

        // Calculate distances and add to donor data
        compatibleDonors = compatibleDonors.map(donor => {
          const distance = this.calculateDistanceToHospital(donor.coordinates);
          const travelTime = this.getEstimatedTravelTime(distance);
          const priority = this.getDistancePriority(distance);
          
          return {
            ...donor,
            distance,
            travelTime,
            priority,
            priorityText: this.getPriorityText(priority),
            priorityColor: this.getPriorityColor(priority)
          };
        });

        // Filter by max distance
        compatibleDonors = compatibleDonors.filter(donor => 
          donor.distance && donor.distance <= maxDistance
        );

        // Sort by priority (distance) and eligibility
        compatibleDonors.sort((a, b) => {
          // First priority: eligibility
          if (a.isEligible && !b.isEligible) return -1;
          if (!a.isEligible && b.isEligible) return 1;
          
          // Second priority: distance
          return a.distance - b.distance;
        });

        // For emergency cases, prioritize very close donors
        if (urgency === 'emergency') {
          compatibleDonors = compatibleDonors.filter(donor => donor.distance <= 20);
        }

        resolve(compatibleDonors);
      }, 800);
    });
  }

  // Check blood type compatibility
  static isBloodTypeCompatible(donorType, recipientType) {
    const compatibility = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+'] // Universal recipient (can only donate to AB+)
    };

    return compatibility[donorType]?.includes(recipientType) || false;
  }

  // TODO: Replace with actual API call - GET /api/donors/:id/location
  static async getDonorLocation(donorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock location data
        const mockLocations = {
          1: { lat: 10.7751000, lng: 106.6862000, address: '120 Đường ABC, Quận 1, TP.HCM' },
          2: { lat: 10.7800000, lng: 106.6900000, address: '456 Đường XYZ, Quận 3, TP.HCM' },
          3: { lat: 10.8000000, lng: 106.7000000, address: '789 Đường GHI, Quận 7, TP.HCM' },
          4: { lat: 10.7500000, lng: 106.6500000, address: '321 Đường JKL, Quận 5, TP.HCM' }
        };
        
        resolve(mockLocations[donorId] || null);
      }, 300);
    });
  }

  // TODO: Replace with actual API call - PUT /api/donors/:id/location
  static async updateDonorLocation(donorId, coordinates, address) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock update
        console.log(`Updated location for donor ${donorId}:`, { coordinates, address });
        resolve(true);
      }, 500);
    });
  }

  // Get Google Maps URL for directions
  static getDirectionsUrl(donorCoordinates) {
    if (!donorCoordinates) return null;
    
    const { lat: hospitalLat, lng: hospitalLng } = this.HOSPITAL_COORDINATES;
    const { lat: donorLat, lng: donorLng } = donorCoordinates;
    
    return `https://www.google.com/maps/dir/${donorLat},${donorLng}/${hospitalLat},${hospitalLng}`;
  }

  // Format distance for display
  static formatDistance(distance) {
    if (!distance) return 'Không xác định';
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance}km`;
    }
  }

  // Get distance category for UI styling
  static getDistanceCategory(distance) {
    if (!distance) return 'unknown';

    if (distance <= 5) return 'very-close';
    if (distance <= 10) return 'close';
    if (distance <= 20) return 'moderate';
    if (distance <= 50) return 'far';
    return 'very-far';
  }

  // Get priority level (alias for getDistanceCategory for consistency)
  static getPriorityLevel(distance) {
    return this.getDistanceCategory(distance);
  }

  // TODO: Replace with actual geolocation API
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
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}

export default DistanceService;
