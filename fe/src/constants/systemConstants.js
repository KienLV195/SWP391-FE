/**
 * UNIFIED SYSTEM CONSTANTS
 * Đảm bảo tính nhất quán giữa tất cả các actors: Guest, Member, Doctor, Manager, Admin
 */

// ===== USER ROLES =====
export const USER_ROLES = {
  GUEST: 'Guest',
  MEMBER: 'Member', 
  STAFF_DOCTOR: 'Staff-Doctor',
  STAFF_BLOOD_MANAGER: 'Staff-BloodManager',
  ADMIN: 'Admin'
};

// ===== USER STATUS =====
export const USER_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  BANNED: 2,
  SUSPENDED: 3
};

// ===== DOCTOR TYPES =====
export const DOCTOR_TYPES = {
  BLOOD_DEPARTMENT: 'blood_department',
  OTHER_DEPARTMENT: 'other_department'
};

// ===== BLOOD INFORMATION =====
export const BLOOD_GROUPS = {
  A: 'A',
  B: 'B', 
  AB: 'AB',
  O: 'O'
};

export const RH_TYPES = {
  POSITIVE: 'Rh+',
  NEGATIVE: 'Rh-'
};

export const BLOOD_TYPES = [
  'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'
];

export const COMPONENT_TYPES = {
  WHOLE: 'Whole',
  RED_CELLS: 'RedCells', 
  PLASMA: 'Plasma',
  PLATELETS: 'Platelets'
};

// ===== BLOOD DONATION WORKFLOW =====
export const DONATION_STATUS = {
  // Member submits donation form
  REGISTERED: 'registered', // Đăng ký thành công
  
  // Doctor Blood Department manages these statuses
  HEALTH_CHECKED: 'health_checked', // Đã khám sàng lọc
  NOT_ELIGIBLE_HEALTH: 'not_eligible_health', // Không đủ điều kiện (sau khám)
  DONATED: 'donated', // Đã hiến máu
  BLOOD_TESTED: 'blood_tested', // Xét nghiệm
  NOT_ELIGIBLE_TEST: 'not_eligible_test', // Không đủ điều kiện (sau xét nghiệm)
  COMPLETED: 'completed', // Hoàn thành (Doctor xác nhận)
  
  // Manager manages storage
  STORED: 'stored' // Đã nhập kho
};

// ===== BLOOD REQUEST WORKFLOW =====
export const REQUEST_STATUS = {
  // Member/Doctor submits request
  PENDING: 'pending', // Đang chờ xử lý
  
  // Doctor Blood Department processes
  APPROVED: 'approved', // Đã duyệt
  REJECTED: 'rejected', // Từ chối
  
  // Manager processes fulfillment
  FULFILLED: 'fulfilled', // Đã xuất kho
  COMPLETED: 'completed' // Hoàn thành
};

// ===== URGENCY LEVELS =====
export const URGENCY_LEVELS = {
  NORMAL: 0,
  URGENT: 1, 
  CRITICAL: 2
};

export const URGENCY_LABELS = {
  [URGENCY_LEVELS.NORMAL]: 'Bình thường',
  [URGENCY_LEVELS.URGENT]: 'Khẩn cấp',
  [URGENCY_LEVELS.CRITICAL]: 'Cực kỳ khẩn cấp'
};

export const URGENCY_COLORS = {
  [URGENCY_LEVELS.NORMAL]: '#28a745',
  [URGENCY_LEVELS.URGENT]: '#fd7e14',
  [URGENCY_LEVELS.CRITICAL]: '#dc3545'
};

export const URGENCY_ICONS = {
  [URGENCY_LEVELS.NORMAL]: '📋',
  [URGENCY_LEVELS.URGENT]: '⚡',
  [URGENCY_LEVELS.CRITICAL]: '🚨'
};

// ===== BLOG SYSTEM =====
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published' // Doctor auto-publishes, no approval needed
};

export const BLOG_CATEGORIES = {
  DOCUMENT: 'Tài liệu', // Hiển thị trên Guest/Member
  NEWS: 'Tin tức', // Hiển thị trên Guest/Member  
  ANNOUNCEMENT: 'Thông báo' // Nội bộ
};

export const BLOG_CONTENT_TYPES = {
  DOCUMENT: 'document',
  NEWS: 'news',
  ANNOUNCEMENT: 'announcement'
};

export const BLOG_TARGET_AUDIENCE = {
  PUBLIC: 'public', // Guest/Member
  INTERNAL: 'internal' // Staff only
};

// ===== NOTIFICATION TYPES =====
export const NOTIFICATION_TYPES = {
  // Blood Donation
  DONATION_REMINDER: 'donation_reminder',
  DONATION_ELIGIBLE: 'donation_eligible',
  DONATION_STATUS_UPDATE: 'donation_status_update',
  
  // Blood Request
  NEW_BLOOD_REQUEST: 'new_blood_request',
  REQUEST_STATUS_UPDATE: 'request_status_update',
  URGENT_BLOOD_NEEDED: 'urgent_blood_needed',
  
  // System
  SYSTEM_MAINTENANCE: 'system_maintenance',
  ACCOUNT_UPDATE: 'account_update',
  
  // Blog
  NEW_BLOG_POST: 'new_blog_post'
};

// ===== WORKFLOW PERMISSIONS =====
export const WORKFLOW_PERMISSIONS = {
  // Donation workflow
  DONATION: {
    [USER_ROLES.MEMBER]: {
      canCreate: true,
      canView: ['own'],
      canUpdate: false,
      allowedStatuses: [DONATION_STATUS.REGISTERED]
    },
    [USER_ROLES.STAFF_DOCTOR]: {
      canCreate: false,
      canView: ['all'],
      canUpdate: true,
      allowedStatuses: [
        DONATION_STATUS.HEALTH_CHECKED,
        DONATION_STATUS.NOT_ELIGIBLE_HEALTH,
        DONATION_STATUS.DONATED,
        DONATION_STATUS.BLOOD_TESTED,
        DONATION_STATUS.NOT_ELIGIBLE_TEST,
        DONATION_STATUS.COMPLETED
      ]
    },
    [USER_ROLES.STAFF_BLOOD_MANAGER]: {
      canCreate: false,
      canView: ['all'],
      canUpdate: true,
      allowedStatuses: [DONATION_STATUS.STORED]
    },
    [USER_ROLES.ADMIN]: {
      canCreate: false,
      canView: ['all'],
      canUpdate: false,
      allowedStatuses: []
    }
  },
  
  // Request workflow
  REQUEST: {
    [USER_ROLES.MEMBER]: {
      canCreate: true,
      canView: ['own'],
      canUpdate: false,
      allowedStatuses: [REQUEST_STATUS.PENDING]
    },
    [USER_ROLES.STAFF_DOCTOR]: {
      canCreate: true,
      canView: ['all'],
      canUpdate: true,
      allowedStatuses: [
        REQUEST_STATUS.PENDING,
        REQUEST_STATUS.APPROVED,
        REQUEST_STATUS.REJECTED
      ]
    },
    [USER_ROLES.STAFF_BLOOD_MANAGER]: {
      canCreate: false,
      canView: ['all'],
      canUpdate: true,
      allowedStatuses: [
        REQUEST_STATUS.FULFILLED,
        REQUEST_STATUS.COMPLETED
      ]
    },
    [USER_ROLES.ADMIN]: {
      canCreate: false,
      canView: ['all'],
      canUpdate: false,
      allowedStatuses: []
    }
  },
  
  // Blog workflow
  BLOG: {
    [USER_ROLES.STAFF_DOCTOR]: {
      canCreate: true,
      canView: ['own'],
      canUpdate: ['own'],
      canDelete: ['own'],
      autoPublish: true, // Doctor auto-publishes
      allowedContentTypes: ['document', 'news', 'announcement'] // All types
    },
    [USER_ROLES.STAFF_BLOOD_MANAGER]: {
      canCreate: true,
      canView: ['own'],
      canUpdate: ['own'],
      canDelete: ['own'],
      autoPublish: true, // Manager auto-publishes
      allowedContentTypes: ['news', 'announcement'] // NO Documents
    },
    [USER_ROLES.ADMIN]: {
      canCreate: false,
      canView: ['all'],
      canUpdate: false,
      canDelete: ['all'], // Admin can only delete
      autoPublish: false,
      allowedContentTypes: []
    }
  }
};

// ===== STATUS TRANSITIONS =====
export const STATUS_TRANSITIONS = {
  DONATION: {
    [DONATION_STATUS.REGISTERED]: [DONATION_STATUS.HEALTH_CHECKED, DONATION_STATUS.NOT_ELIGIBLE_HEALTH],
    [DONATION_STATUS.HEALTH_CHECKED]: [DONATION_STATUS.DONATED, DONATION_STATUS.NOT_ELIGIBLE_HEALTH],
    [DONATION_STATUS.DONATED]: [DONATION_STATUS.BLOOD_TESTED],
    [DONATION_STATUS.BLOOD_TESTED]: [DONATION_STATUS.COMPLETED, DONATION_STATUS.NOT_ELIGIBLE_TEST],
    [DONATION_STATUS.COMPLETED]: [DONATION_STATUS.STORED]
  },
  
  REQUEST: {
    [REQUEST_STATUS.PENDING]: [REQUEST_STATUS.APPROVED, REQUEST_STATUS.REJECTED],
    [REQUEST_STATUS.APPROVED]: [REQUEST_STATUS.FULFILLED],
    [REQUEST_STATUS.FULFILLED]: [REQUEST_STATUS.COMPLETED]
  }
};

// ===== HOSPITAL INFORMATION =====
export const HOSPITAL_INFO = {
  NAME: 'Bệnh viện Đa khoa Ánh Dương',
  ADDRESS: 'CMT8 Street, District 3, Ho Chi Minh City, Vietnam',
  COORDINATES: {
    LAT: 10.7751237,
    LNG: 106.6862143
  },
  CONTACT: {
    PHONE: '(028) 1234 5678',
    EMAIL: 'info@anhduong-hospital.com',
    EMERGENCY: '115'
  }
};

// ===== API ENDPOINTS =====
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  
  // Users
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    ACTIVITY_HISTORY: '/api/users/activity-history'
  },
  
  // Blood Donations
  DONATIONS: {
    CREATE: '/api/donations',
    LIST: '/api/donations',
    UPDATE_STATUS: '/api/donations/:id/status',
    DETAILS: '/api/donations/:id'
  },
  
  // Blood Requests
  REQUESTS: {
    CREATE: '/api/blood-requests',
    LIST: '/api/blood-requests',
    UPDATE_STATUS: '/api/blood-requests/:id/status',
    DETAILS: '/api/blood-requests/:id'
  },
  
  // Blogs
  BLOGS: {
    CREATE: '/api/blogs',
    LIST: '/api/blogs',
    UPDATE: '/api/blogs/:id',
    DELETE: '/api/blogs/:id',
    PUBLIC: '/api/blogs/public'
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    BLOGS: '/api/admin/blogs',
    REPORTS: '/api/admin/reports'
  }
};

export default {
  USER_ROLES,
  USER_STATUS,
  DOCTOR_TYPES,
  BLOOD_GROUPS,
  RH_TYPES,
  BLOOD_TYPES,
  COMPONENT_TYPES,
  DONATION_STATUS,
  REQUEST_STATUS,
  URGENCY_LEVELS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  URGENCY_ICONS,
  BLOG_STATUS,
  BLOG_CATEGORIES,
  BLOG_CONTENT_TYPES,
  BLOG_TARGET_AUDIENCE,
  NOTIFICATION_TYPES,
  WORKFLOW_PERMISSIONS,
  STATUS_TRANSITIONS,
  HOSPITAL_INFO,
  API_ENDPOINTS
};
