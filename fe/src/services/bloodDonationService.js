import axios from "axios";

const BLOOD_DONATION_API = import.meta.env.VITE_BLOOD_DONATION_API;

/**
 * Service for Blood Donation API operations
 */
class BloodDonationService {

  /**
   * Get user information including blood donation history
   * @param {number} userId - User ID
   * @returns {Promise} API response
   */
  async getUserInfo(userId) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  }

  /**
   * Get blood donation appointments by user ID
   * @param {number} userId - User ID
   * @returns {Promise} API response
   */
  async getAppointmentsByUser(userId) {
    try {
      // First try to get user info which might contain appointment history
      try {
        const userInfo = await this.getUserInfo(userId);

        // Check if user info contains blood donation history
        if (userInfo.bloodDonationHistory && Array.isArray(userInfo.bloodDonationHistory)) {
          return userInfo.bloodDonationHistory;
        }
      } catch (userError) {
        console.log("User info endpoint not available, trying blood donation endpoints");
      }

      // Try multiple blood donation endpoints
      const possibleEndpoints = [
        `${BLOOD_DONATION_API}`, // Get all and filter
        `${BLOOD_DONATION_API}?userId=${userId}`,
        `${BLOOD_DONATION_API}?userID=${userId}`,
        `${BLOOD_DONATION_API}/user/${userId}`,
        `${BLOOD_DONATION_API}/by-user/${userId}`,
        `${import.meta.env.VITE_API_URL}/blood-donations/user/${userId}`,
        `${import.meta.env.VITE_API_URL}/donations/user/${userId}`,
        `${import.meta.env.VITE_API_URL}/appointments/user/${userId}`,
      ];

      let lastError = null;

      for (const endpoint of possibleEndpoints) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });

          // If we get all appointments, filter by userId
          if (Array.isArray(response.data)) {
            const userAppointments = response.data.filter(appointment =>
              appointment.userId === parseInt(userId) ||
              appointment.userID === parseInt(userId) ||
              appointment.UserId === parseInt(userId) ||
              appointment.UserID === parseInt(userId)
            );
            return userAppointments;
          }

          return response.data;
        } catch (error) {
          lastError = error;
          continue;
        }
      }

      // If all endpoints fail, throw the last error
      throw lastError;
    } catch (error) {
      console.error("Error fetching blood donation appointments:", error);
      throw error;
    }
  }

  /**
   * Get specific appointment details
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  async getAppointmentDetails(appointmentId) {
    try {
      const response = await axios.get(`${BLOOD_DONATION_API}/${appointmentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      throw error;
    }
  }

  /**
   * Create new blood donation appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise} API response
   */
  async createAppointment(appointmentData) {
    try {
      const response = await axios.post(BLOOD_DONATION_API, appointmentData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating blood donation appointment:", error);
      throw error;
    }
  }

  /**
   * Update appointment status
   * @param {number} appointmentId - Appointment ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const response = await axios.put(`${BLOOD_DONATION_API}/${appointmentId}/status`, 
        { status }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }

  /**
   * Get all appointments (for admin/manager)
   * @returns {Promise} API response
   */
  async getAllAppointments() {
    try {
      const response = await axios.get(BLOOD_DONATION_API, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all appointments:", error);
      throw error;
    }
  }

  /**
   * Delete appointment
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  async deleteAppointment(appointmentId) {
    try {
      const response = await axios.delete(`${BLOOD_DONATION_API}/${appointmentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  }

  /**
   * Delete appointment
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  async deleteAppointment(appointmentId) {
    try {
      const response = await axios.delete(`${BLOOD_DONATION_API}/${appointmentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  }
}

// Create singleton instance
const bloodDonationService = new BloodDonationService();

export default bloodDonationService;
