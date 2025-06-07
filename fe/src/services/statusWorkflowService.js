// TODO: Replace with actual API calls when backend is ready
class StatusWorkflowService {
  // Donation Status Workflow
  static DONATION_STATUSES = {
    // Initial status
    REGISTERED: 'registered', // Đăng ký thành công

    // Doctor Blood Department statuses (Doctor có toàn quyền quản lý)
    HEALTH_CHECKED: 'health_checked', // Đã khám
    NOT_ELIGIBLE_AFTER_HEALTH_CHECK: 'not_eligible_after_health_check', // Không đủ điều kiện (sau khám)
    DONATED: 'donated', // Đã hiến máu
    BLOOD_TESTED: 'blood_tested', // Xét nghiệm
    NOT_ELIGIBLE_AFTER_TEST: 'not_eligible_after_test', // Không đủ điều kiện (sau xét nghiệm)
    COMPLETED: 'completed', // Hoàn thành (Doctor xác nhận đủ điều kiện)

    // Manager statuses (chỉ quản lý nhập kho)
    STORED: 'stored', // Nhập kho
  };

  // Blood Request Status Workflow
  static REQUEST_STATUSES = {
    // Common statuses
    PENDING: 'pending', // Đang chờ xử lý
    APPROVED: 'approved', // Đủ điều kiện
    REJECTED: 'rejected', // Không đủ điều kiện
    FULFILLED: 'fulfilled', // Xuất kho
    COMPLETED: 'completed', // Hoàn thành

    // Doctor specific
    DOCTOR_APPROVED: 'doctor_approved', // Chấp nhận (Doctor)
    DOCTOR_REJECTED: 'doctor_rejected', // Không chấp nhận (Doctor)
  };

  // User roles for workflow
  static USER_ROLES = {
    GUEST: 'guest',
    MEMBER: 'member',
    DOCTOR: 'doctor',
    MANAGER: 'manager',
    ADMIN: 'admin'
  };

  // Doctor types
  static DOCTOR_TYPES = {
    BLOOD_DEPARTMENT: 'blood_department',
    OTHER_DEPARTMENT: 'other_department'
  };

  // Get allowed status transitions for donation workflow
  static getDonationStatusTransitions(currentStatus, userRole, doctorType = null) {
    const transitions = {
      // Doctor khoa máu có toàn quyền quản lý workflow y tế
      [this.USER_ROLES.DOCTOR]: {
        [this.DOCTOR_TYPES.BLOOD_DEPARTMENT]: {
          [this.DONATION_STATUSES.REGISTERED]: [
            this.DONATION_STATUSES.HEALTH_CHECKED,
            this.DONATION_STATUSES.NOT_ELIGIBLE_AFTER_HEALTH_CHECK
          ],
          [this.DONATION_STATUSES.HEALTH_CHECKED]: [
            this.DONATION_STATUSES.DONATED,
            this.DONATION_STATUSES.NOT_ELIGIBLE_AFTER_HEALTH_CHECK
          ],
          [this.DONATION_STATUSES.DONATED]: [
            this.DONATION_STATUSES.BLOOD_TESTED
          ],
          [this.DONATION_STATUSES.BLOOD_TESTED]: [
            this.DONATION_STATUSES.COMPLETED,
            this.DONATION_STATUSES.NOT_ELIGIBLE_AFTER_TEST
          ]
        }
      },
      // Manager chỉ có thể cập nhật nhập kho
      [this.USER_ROLES.MANAGER]: {
        [this.DONATION_STATUSES.COMPLETED]: [
          this.DONATION_STATUSES.STORED
        ]
      }
    };

    if (userRole === this.USER_ROLES.DOCTOR && doctorType) {
      return transitions[userRole]?.[doctorType]?.[currentStatus] || [];
    }

    return transitions[userRole]?.[currentStatus] || [];
  }

  // Get allowed status transitions for blood request workflow
  static getRequestStatusTransitions(currentStatus, userRole, doctorType = null, requestType = 'internal') {
    const transitions = {
      [this.USER_ROLES.DOCTOR]: {
        [this.DOCTOR_TYPES.BLOOD_DEPARTMENT]: {
          internal: {
            [this.REQUEST_STATUSES.PENDING]: [
              this.REQUEST_STATUSES.DOCTOR_APPROVED,
              this.REQUEST_STATUSES.DOCTOR_REJECTED
            ]
          },
          external: {
            [this.REQUEST_STATUSES.PENDING]: [
              this.REQUEST_STATUSES.DOCTOR_APPROVED,
              this.REQUEST_STATUSES.DOCTOR_REJECTED
            ]
          }
        },
        [this.DOCTOR_TYPES.OTHER_DEPARTMENT]: {
          internal: {
            [this.REQUEST_STATUSES.PENDING]: [
              this.REQUEST_STATUSES.DOCTOR_APPROVED,
              this.REQUEST_STATUSES.DOCTOR_REJECTED
            ]
          },
          external: {} // No access to external requests
        }
      },
      [this.USER_ROLES.MANAGER]: {
        [this.REQUEST_STATUSES.PENDING]: [
          this.REQUEST_STATUSES.APPROVED,
          this.REQUEST_STATUSES.REJECTED
        ],
        [this.REQUEST_STATUSES.DOCTOR_APPROVED]: [
          this.REQUEST_STATUSES.APPROVED,
          this.REQUEST_STATUSES.REJECTED
        ],
        [this.REQUEST_STATUSES.APPROVED]: [
          this.REQUEST_STATUSES.FULFILLED
        ],
        [this.REQUEST_STATUSES.FULFILLED]: [
          this.REQUEST_STATUSES.COMPLETED
        ]
      }
    };

    if (userRole === this.USER_ROLES.DOCTOR) {
      return transitions[userRole]?.[doctorType]?.[requestType]?.[currentStatus] || [];
    }

    return transitions[userRole]?.[currentStatus] || [];
  }

  // Get status display information
  static getStatusInfo(status, type = 'donation') {
    const donationStatusInfo = {
      [this.DONATION_STATUSES.REGISTERED]: {
        text: 'Đăng ký thành công',
        color: '#17a2b8',
        icon: '✅',
        description: 'Đã đăng ký hiến máu thành công'
      },
      [this.DONATION_STATUSES.HEALTH_CHECKED]: {
        text: 'Đã khám',
        color: '#28a745',
        icon: '🏥',
        description: 'Đã hoàn thành khám sức khỏe'
      },
      [this.DONATION_STATUSES.NOT_ELIGIBLE_AFTER_HEALTH_CHECK]: {
        text: 'Không đủ điều kiện (sau khám)',
        color: '#dc3545',
        icon: '⚠️',
        description: 'Không đủ điều kiện hiến máu sau khi khám sức khỏe'
      },
      [this.DONATION_STATUSES.DONATED]: {
        text: 'Đã hiến máu',
        color: '#6f42c1',
        icon: '🩸',
        description: 'Đã hoàn thành việc hiến máu'
      },
      [this.DONATION_STATUSES.BLOOD_TESTED]: {
        text: 'Xét nghiệm',
        color: '#fd7e14',
        icon: '🔬',
        description: 'Đang thực hiện xét nghiệm máu'
      },
      [this.DONATION_STATUSES.COMPLETED]: {
        text: 'Hoàn thành',
        color: '#28a745',
        icon: '✅',
        description: 'Doctor xác nhận đủ điều kiện, sẵn sàng nhập kho'
      },
      [this.DONATION_STATUSES.NOT_ELIGIBLE_AFTER_TEST]: {
        text: 'Không đủ điều kiện (sau xét nghiệm)',
        color: '#dc3545',
        icon: '🚫',
        description: 'Không đủ điều kiện hiến máu sau khi xét nghiệm'
      },
      [this.DONATION_STATUSES.STORED]: {
        text: 'Nhập kho',
        color: '#007bff',
        icon: '🏪',
        description: 'Máu đã được nhập kho thành công'
      }
    };

    const requestStatusInfo = {
      [this.REQUEST_STATUSES.PENDING]: {
        text: 'Đang chờ xử lý',
        color: '#ffc107',
        icon: '⏳',
        description: 'Yêu cầu đang chờ được xử lý'
      },
      [this.REQUEST_STATUSES.DOCTOR_APPROVED]: {
        text: 'Bác sĩ chấp nhận',
        color: '#17a2b8',
        icon: '👨‍⚕️',
        description: 'Bác sĩ đã chấp nhận yêu cầu'
      },
      [this.REQUEST_STATUSES.DOCTOR_REJECTED]: {
        text: 'Bác sĩ từ chối',
        color: '#dc3545',
        icon: '❌',
        description: 'Bác sĩ đã từ chối yêu cầu'
      },
      [this.REQUEST_STATUSES.APPROVED]: {
        text: 'Đủ điều kiện',
        color: '#28a745',
        icon: '✅',
        description: 'Yêu cầu đã được duyệt'
      },
      [this.REQUEST_STATUSES.REJECTED]: {
        text: 'Không đủ điều kiện',
        color: '#dc3545',
        icon: '❌',
        description: 'Yêu cầu bị từ chối'
      },
      [this.REQUEST_STATUSES.FULFILLED]: {
        text: 'Xuất kho',
        color: '#6f42c1',
        icon: '📦',
        description: 'Đã xuất máu từ kho'
      },
      [this.REQUEST_STATUSES.COMPLETED]: {
        text: 'Hoàn thành',
        color: '#28a745',
        icon: '🎉',
        description: 'Hoàn thành toàn bộ quy trình'
      }
    };

    const statusMap = type === 'donation' ? donationStatusInfo : requestStatusInfo;
    return statusMap[status] || {
      text: 'Không xác định',
      color: '#6c757d',
      icon: '❓',
      description: 'Trạng thái không xác định'
    };
  }

  // Check if user can perform action on status
  static canPerformAction(currentStatus, targetStatus, userRole, doctorType = null, requestType = 'internal', workflowType = 'donation') {
    let allowedTransitions;

    if (workflowType === 'donation') {
      allowedTransitions = this.getDonationStatusTransitions(currentStatus, userRole, doctorType);
    } else {
      allowedTransitions = this.getRequestStatusTransitions(currentStatus, userRole, doctorType, requestType);
    }

    return allowedTransitions.includes(targetStatus);
  }

  // TODO: Replace with actual API call - PUT /api/donations/:id/status
  static async updateDonationStatus(donationId, newStatus, userRole, notes = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        const mockDonation = {
          id: donationId,
          currentStatus: 'registered', // Mock current status
          userRole: userRole
        };

        const allowedTransitions = this.getDonationStatusTransitions(mockDonation.currentStatus, userRole);
        
        if (!allowedTransitions.includes(newStatus)) {
          reject(new Error('Không được phép thực hiện hành động này'));
          return;
        }

        // Mock successful update
        resolve({
          id: donationId,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: userRole,
          notes: notes
        });
      }, 500);
    });
  }

  // TODO: Replace with actual API call - PUT /api/blood-requests/:id/status
  static async updateRequestStatus(requestId, newStatus, userRole, doctorType = null, requestType = 'internal', notes = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        const mockRequest = {
          id: requestId,
          currentStatus: 'pending', // Mock current status
          requestType: requestType
        };

        const allowedTransitions = this.getRequestStatusTransitions(mockRequest.currentStatus, userRole, doctorType, requestType);
        
        if (!allowedTransitions.includes(newStatus)) {
          reject(new Error('Không được phép thực hiện hành động này'));
          return;
        }

        // Mock successful update
        resolve({
          id: requestId,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          updatedBy: userRole,
          notes: notes
        });
      }, 500);
    });
  }

  // Get workflow progress for donation
  static getDonationProgress(currentStatus, userRole) {
    const memberWorkflow = [
      this.DONATION_STATUSES.REGISTERED,
      this.DONATION_STATUSES.HEALTH_CHECKED,
      this.DONATION_STATUSES.DONATED,
      this.DONATION_STATUSES.COMPLETED
    ];

    const managerWorkflow = [
      this.DONATION_STATUSES.REGISTERED,
      this.DONATION_STATUSES.HEALTH_CHECKED,
      this.DONATION_STATUSES.DONATED,
      this.DONATION_STATUSES.BLOOD_TESTED,
      this.DONATION_STATUSES.COMPLETED
    ];

    const workflow = userRole === this.USER_ROLES.MANAGER ? managerWorkflow : memberWorkflow;
    const currentIndex = workflow.indexOf(currentStatus);
    
    return {
      workflow,
      currentIndex,
      progress: currentIndex >= 0 ? ((currentIndex + 1) / workflow.length) * 100 : 0,
      isCompleted: currentStatus === this.DONATION_STATUSES.COMPLETED,
      isFailed: [this.DONATION_STATUSES.REGISTRATION_FAILED, this.DONATION_STATUSES.HEALTH_CHECK_FAILED, this.DONATION_STATUSES.NOT_ELIGIBLE].includes(currentStatus)
    };
  }

  // Get workflow progress for blood request
  static getRequestProgress(currentStatus, userRole, doctorType = null) {
    const doctorWorkflow = [
      this.REQUEST_STATUSES.PENDING,
      this.REQUEST_STATUSES.DOCTOR_APPROVED,
      this.REQUEST_STATUSES.APPROVED,
      this.REQUEST_STATUSES.FULFILLED,
      this.REQUEST_STATUSES.COMPLETED
    ];

    const managerWorkflow = [
      this.REQUEST_STATUSES.PENDING,
      this.REQUEST_STATUSES.APPROVED,
      this.REQUEST_STATUSES.FULFILLED,
      this.REQUEST_STATUSES.COMPLETED
    ];

    const workflow = userRole === this.USER_ROLES.DOCTOR ? doctorWorkflow : managerWorkflow;
    const currentIndex = workflow.indexOf(currentStatus);
    
    return {
      workflow,
      currentIndex,
      progress: currentIndex >= 0 ? ((currentIndex + 1) / workflow.length) * 100 : 0,
      isCompleted: currentStatus === this.REQUEST_STATUSES.COMPLETED,
      isFailed: [this.REQUEST_STATUSES.REJECTED, this.REQUEST_STATUSES.DOCTOR_REJECTED].includes(currentStatus)
    };
  }

  // Get next possible actions
  static getNextActions(currentStatus, userRole, doctorType = null, requestType = 'internal', workflowType = 'donation') {
    let allowedTransitions;
    
    if (workflowType === 'donation') {
      allowedTransitions = this.getDonationStatusTransitions(currentStatus, userRole);
    } else {
      allowedTransitions = this.getRequestStatusTransitions(currentStatus, userRole, doctorType, requestType);
    }

    return allowedTransitions.map(status => ({
      status,
      ...this.getStatusInfo(status, workflowType),
      actionText: this.getActionText(status, workflowType)
    }));
  }

  // Get action text for status
  static getActionText(status, workflowType = 'donation') {
    const donationActions = {
      [this.DONATION_STATUSES.HEALTH_CHECKED]: 'Khám sức khỏe',
      [this.DONATION_STATUSES.HEALTH_CHECK_FAILED]: 'Không đủ điều kiện khám',
      [this.DONATION_STATUSES.DONATED]: 'Hiến máu',
      [this.DONATION_STATUSES.BLOOD_TESTED]: 'Xét nghiệm máu',
      [this.DONATION_STATUSES.COMPLETED]: 'Hoàn thành',
      [this.DONATION_STATUSES.NOT_ELIGIBLE]: 'Không đủ điều kiện'
    };

    const requestActions = {
      [this.REQUEST_STATUSES.DOCTOR_APPROVED]: 'Chấp nhận',
      [this.REQUEST_STATUSES.DOCTOR_REJECTED]: 'Từ chối',
      [this.REQUEST_STATUSES.APPROVED]: 'Duyệt yêu cầu',
      [this.REQUEST_STATUSES.REJECTED]: 'Từ chối yêu cầu',
      [this.REQUEST_STATUSES.FULFILLED]: 'Xuất kho',
      [this.REQUEST_STATUSES.COMPLETED]: 'Hoàn thành'
    };

    const actionMap = workflowType === 'donation' ? donationActions : requestActions;
    return actionMap[status] || 'Cập nhật trạng thái';
  }

  // Check if status is visible to user role
  static isStatusVisibleToUser(status, userRole, doctorType = null) {
    // STORED status chỉ hiển thị cho Manager và Doctor khoa máu
    if (status === this.DONATION_STATUSES.STORED) {
      return userRole === this.USER_ROLES.MANAGER ||
             (userRole === this.USER_ROLES.DOCTOR && doctorType === this.DOCTOR_TYPES.BLOOD_DEPARTMENT);
    }

    // Tất cả status khác đều hiển thị cho mọi user
    return true;
  }

  // Get visible statuses for user
  static getVisibleStatuses(userRole, doctorType = null) {
    const allStatuses = Object.values(this.DONATION_STATUSES);
    return allStatuses.filter(status => this.isStatusVisibleToUser(status, userRole, doctorType));
  }

  // Check if user can edit donation status (Manager chỉ có thể edit STORED, Doctor có thể edit tất cả trừ STORED)
  static canEditDonationStatus(status, userRole, doctorType = null) {
    if (userRole === this.USER_ROLES.MANAGER) {
      // Manager chỉ có thể edit trạng thái STORED
      return status === this.DONATION_STATUSES.STORED;
    }

    if (userRole === this.USER_ROLES.DOCTOR && doctorType === this.DOCTOR_TYPES.BLOOD_DEPARTMENT) {
      // Doctor khoa máu có thể edit tất cả trừ STORED
      return status !== this.DONATION_STATUSES.STORED;
    }

    return false;
  }

  // Get status statistics
  static getStatusStatistics(items, workflowType = 'donation') {
    const stats = {};

    items.forEach(item => {
      const status = item.status;
      if (!stats[status]) {
        stats[status] = {
          count: 0,
          ...this.getStatusInfo(status, workflowType)
        };
      }
      stats[status].count++;
    });

    return stats;
  }
}

export default StatusWorkflowService;
