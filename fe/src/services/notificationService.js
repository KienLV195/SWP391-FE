import config from '../config/environment';

class NotificationService {
  constructor() {
    this.baseURL = config.api.baseUrl;
  }
  // Mock data for notifications
  static mockNotifications = [
    {
      id: 1,
      userId: 1,
      type: 'donation_reminder',
      title: '🩸 Nhắc nhở hiến máu',
      message: 'Bạn đã có thể hiến máu trở lại! Lần hiến máu cuối của bạn là 60 ngày trước.',
      isRead: false,
      createdAt: '2024-12-10T08:00:00Z',
      data: {
        lastDonationDate: '2024-10-11',
        nextEligibleDate: '2024-12-06',
        bloodType: 'O+'
      }
    },
    {
      id: 2,
      userId: 1,
      type: 'urgent_request',
      title: '🚨 Yêu cầu máu khẩn cấp',
      message: 'Cần gấp máu nhóm O+ tại bệnh viện. Bạn có thể giúp đỡ không?',
      isRead: false,
      createdAt: '2024-12-09T14:30:00Z',
      data: {
        requestId: 123,
        bloodType: 'O+',
        quantity: '2 đơn vị',
        urgency: 'emergency',
        hospital: 'Bệnh viện XYZ'
      }
    },
    {
      id: 3,
      userId: 1,
      type: 'appointment_reminder',
      title: '📅 Nhắc nhở lịch hẹn',
      message: 'Bạn có lịch hẹn hiến máu vào ngày mai lúc 9:00 AM.',
      isRead: true,
      createdAt: '2024-12-08T18:00:00Z',
      data: {
        appointmentId: 456,
        appointmentDate: '2024-12-11T09:00:00Z',
        location: 'Bệnh viện XYZ - Tầng 2'
      }
    },
    {
      id: 4,
      userId: 1,
      type: 'health_check',
      title: '🏥 Kết quả khám sức khỏe',
      message: 'Kết quả khám sức khỏe của bạn đã có. Bạn đủ điều kiện hiến máu.',
      isRead: true,
      createdAt: '2024-12-07T10:15:00Z',
      data: {
        checkupId: 789,
        result: 'eligible',
        nextCheckupDate: '2024-06-07'
      }
    },
    {
      id: 5,
      userId: 1,
      type: 'donation_thanks',
      title: '💝 Cảm ơn bạn đã hiến máu',
      message: 'Cảm ơn bạn đã hiến máu hôm nay! Máu của bạn sẽ giúp cứu sống nhiều người.',
      isRead: true,
      createdAt: '2024-12-05T16:45:00Z',
      data: {
        donationId: 101,
        donationDate: '2024-12-05',
        bloodType: 'O+',
        quantity: '450ml'
      }
    }
  ];

  // TODO_API_REPLACE: Replace with actual API call
  // GET /api/notifications/{userId}
  async getNotifications(userId) {
    try {
      // TODO_API_REPLACE: Replace with actual API call
      // const response = await fetch(`${this.baseURL}/notifications/${userId}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   }
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   return data.notifications;
      // } else {
      //   throw new Error(data.message);
      // }

      // MOCK_DATA: Remove this section when implementing real API
      return new Promise((resolve) => {
        setTimeout(() => {
          const userNotifications = this.mockNotifications.filter(n => n.userId === userId);
          resolve(userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }, 500);
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // TODO: Replace with API call - GET /api/notifications/:userId/unread-count
  static async getUnreadCount(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unreadCount = this.mockNotifications.filter(n => n.userId === userId && !n.isRead).length;
        resolve(unreadCount);
      }, 200);
    });
  }

  // TODO: Replace with API call - PUT /api/notifications/:id/mark-read
  static async markAsRead(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = this.mockNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
        resolve(notification);
      }, 300);
    });
  }

  // TODO: Replace with API call - PUT /api/notifications/:userId/mark-all-read
  static async markAllAsRead(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockNotifications.forEach(n => {
          if (n.userId === userId) {
            n.isRead = true;
          }
        });
        resolve(true);
      }, 500);
    });
  }

  // TODO: Replace with API call - DELETE /api/notifications/:id
  static async deleteNotification(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.mockNotifications.findIndex(n => n.id === notificationId);
        if (index !== -1) {
          this.mockNotifications.splice(index, 1);
        }
        resolve(true);
      }, 300);
    });
  }

  // TODO: Replace with API call - POST /api/notifications
  static async createNotification(notification) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNotification = {
          id: Date.now(),
          ...notification,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        this.mockNotifications.push(newNotification);
        resolve(newNotification);
      }, 300);
    });
  }

  // Calculate next eligible donation date
  static calculateNextEligibleDate(lastDonationDate, gender = 'male') {
    const lastDate = new Date(lastDonationDate);
    const waitingPeriod = gender === 'female' ? 84 : 56; // days
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + waitingPeriod);
    return nextDate;
  }

  // Check if user is eligible to donate
  static isEligibleToDonate(lastDonationDate, gender = 'male') {
    if (!lastDonationDate) return true;
    
    const nextEligibleDate = this.calculateNextEligibleDate(lastDonationDate, gender);
    return new Date() >= nextEligibleDate;
  }

  // Get days until next eligible donation
  static getDaysUntilEligible(lastDonationDate, gender = 'male') {
    if (!lastDonationDate) return 0;
    
    const nextEligibleDate = this.calculateNextEligibleDate(lastDonationDate, gender);
    const today = new Date();
    const diffTime = nextEligibleDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  // TODO: Replace with API call - POST /api/notifications/donation-reminder
  static async sendDonationReminder(userId, userData) {
    const daysUntilEligible = this.getDaysUntilEligible(userData.lastDonationDate, userData.gender);
    
    if (daysUntilEligible <= 3 && daysUntilEligible >= 0) {
      const message = daysUntilEligible === 0 
        ? 'Bạn đã có thể hiến máu trở lại! Hãy đăng ký lịch hẹn ngay.'
        : `Còn ${daysUntilEligible} ngày nữa bạn có thể hiến máu trở lại.`;

      return this.createNotification({
        userId,
        type: 'donation_reminder',
        title: '🩸 Nhắc nhở hiến máu',
        message,
        data: {
          lastDonationDate: userData.lastDonationDate,
          nextEligibleDate: this.calculateNextEligibleDate(userData.lastDonationDate, userData.gender).toISOString().split('T')[0],
          bloodType: userData.bloodType,
          daysUntilEligible
        }
      });
    }
    return null;
  }

  // TODO: Replace with API call - POST /api/notifications/urgent-request
  static async sendUrgentBloodRequest(userId, requestData) {
    return this.createNotification({
      userId,
      type: 'urgent_request',
      title: '🚨 Yêu cầu máu khẩn cấp',
      message: `Cần gấp máu nhóm ${requestData.bloodType}. Bạn có thể giúp đỡ không?`,
      data: {
        requestId: requestData.id,
        bloodType: requestData.bloodType,
        quantity: requestData.quantity,
        urgency: requestData.urgency,
        hospital: requestData.hospital || 'Bệnh viện XYZ'
      }
    });
  }

  // TODO: Replace with API call - POST /api/notifications/appointment-reminder
  static async sendAppointmentReminder(userId, appointmentData) {
    const appointmentDate = new Date(appointmentData.appointmentDate);
    const formattedDate = appointmentDate.toLocaleDateString('vi-VN');
    const formattedTime = appointmentDate.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return this.createNotification({
      userId,
      type: 'appointment_reminder',
      title: '📅 Nhắc nhở lịch hẹn',
      message: `Bạn có lịch hẹn hiến máu vào ${formattedDate} lúc ${formattedTime}.`,
      data: {
        appointmentId: appointmentData.id,
        appointmentDate: appointmentData.appointmentDate,
        location: appointmentData.location || 'Bệnh viện XYZ - Tầng 2'
      }
    });
  }

  // Format notification time
  static formatNotificationTime(createdAt) {
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return notificationTime.toLocaleDateString('vi-VN');
  }

  // Get notification icon based on type
  static getNotificationIcon(type) {
    const icons = {
      donation_reminder: '🩸',
      urgent_request: '🚨',
      appointment_reminder: '📅',
      health_check: '🏥',
      donation_thanks: '💝',
      blood_request_update: '📋',
      system_announcement: '📢'
    };
    return icons[type] || '🔔';
  }

  // Get notification color based on type
  static getNotificationColor(type) {
    const colors = {
      donation_reminder: '#28a745',
      urgent_request: '#dc3545',
      appointment_reminder: '#17a2b8',
      health_check: '#6f42c1',
      donation_thanks: '#e83e8c',
      blood_request_update: '#ffc107',
      system_announcement: '#6c757d'
    };
    return colors[type] || '#6c757d';
  }
}

export default NotificationService;
