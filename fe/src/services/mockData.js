// Mock data for Blood Management System based on database schema

// User roles matching database Roles table
export const ROLES = {
  GUEST: 'Guest',
  MEMBER: 'Member',
  STAFF_DOCTOR: 'Staff-Doctor',
  STAFF_BLOOD_MANAGER: 'Staff-BloodManager',
  ADMIN: 'Admin'
};

// User status matching database Users table
export const USER_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
  BANNED: 2
};

// Blood groups
export const BLOOD_GROUPS = {
  A: 'A',
  B: 'B',
  AB: 'AB',
  O: 'O'
};

// Rh types
export const RH_TYPES = {
  POSITIVE: 'Rh+',
  NEGATIVE: 'Rh-'
};

// Blood request status matching database
export const REQUEST_STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  COMPLETED: 2,
  REJECTED: 3
};

// Blood request urgency levels
export const URGENCY_LEVELS = {
  NORMAL: 0,
  URGENT: 1,
  CRITICAL: 2
};

// Blood component types
export const COMPONENT_TYPES = {
  WHOLE: 'Whole',
  RED_CELLS: 'RedCells',
  PLASMA: 'Plasma',
  PLATELETS: 'Platelets'
};

// Doctor types for different departments
export const DOCTOR_TYPES = {
  BLOOD_DEPARTMENT: 'blood_department',
  OTHER_DEPARTMENT: 'other_department'
};

// Mock users matching database Users table structure
export const mockUsers = [
  // Members (can be both donors and recipients)
  {
    userID: 1,
    firebaseUID: 'firebase_uid_001',
    email: 'member1@test.com',
    phone: '0123456789',
    password: 'Member1@', // In real app, this would be hashed
    name: 'Nguyễn Văn A',
    age: 34,
    gender: 'Male',
    address: 'Quận 1, TP.HCM',
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.POSITIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 2, // Member role
    role: ROLES.MEMBER,
    department: null,
    createdAt: '2024-01-01T00:00:00Z',
    // Additional fields for frontend
    profile: {
      fullName: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'member1@test.com',
      bloodType: 'O+',
      address: 'Quận 1, TP.HCM',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    },
    activityHistory: [
      {
        id: 'act1',
        type: 'donation',
        date: '2024-01-10',
        bloodType: 'O+',
        quantity: 450,
        location: 'Bệnh viện XYZ',
        status: 'completed',
        notes: 'Hiến máu thành công'
      }
    ]
  },
  {
    userID: 2,
    firebaseUID: 'firebase_uid_002',
    email: 'member2@test.com',
    phone: '0123456790',
    password: 'Member2@',
    name: 'Trần Thị B',
    age: 32,
    gender: 'Female',
    address: 'Quận 2, TP.HCM',
    bloodGroup: BLOOD_GROUPS.A,
    rhType: RH_TYPES.POSITIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 2,
    role: ROLES.MEMBER,
    department: null,
    createdAt: '2024-01-02T00:00:00Z',
    profile: {
      fullName: 'Trần Thị B',
      phone: '0123456790',
      email: 'member2@test.com',
      bloodType: 'A+',
      address: 'Quận 2, TP.HCM',
      dateOfBirth: '1992-05-15',
      gender: 'female'
    },
    activityHistory: [
      {
        id: 'act2',
        type: 'donation',
        date: '2024-01-08',
        bloodType: 'A+',
        quantity: 450,
        location: 'Bệnh viện XYZ',
        status: 'medical_checked',
        notes: 'Đã khám sàng lọc, chờ lịch hiến máu'
      }
    ]
  },
  {
    userID: 3,
    firebaseUID: 'firebase_uid_003',
    email: 'member3@test.com',
    phone: '0123456791',
    password: 'Member3@',
    name: 'Lê Văn C',
    age: 36,
    gender: 'Male',
    address: 'Quận 3, TP.HCM',
    bloodGroup: BLOOD_GROUPS.B,
    rhType: RH_TYPES.POSITIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 2,
    role: ROLES.MEMBER,
    department: null,
    createdAt: '2024-01-03T00:00:00Z',
    profile: {
      fullName: 'Lê Văn C',
      phone: '0123456791',
      email: 'member3@test.com',
      bloodType: 'B+',
      address: 'Quận 3, TP.HCM',
      dateOfBirth: '1988-12-20',
      gender: 'male'
    },
    activityHistory: [
      {
        id: 'act3',
        type: 'request',
        date: '2024-01-12',
        bloodType: 'B+',
        quantity: 2,
        reason: 'Phẫu thuật khẩn cấp',
        status: 'approved',
        notes: 'Yêu cầu đã được duyệt'
      }
    ]
  },
  {
    id: 'member4',
    email: 'member4@test.com',
    password: 'Member4@',
    role: ROLES.MEMBER,
    profile: {
      fullName: 'Phạm Thị D',
      phone: '0123456792',
      email: 'member4@test.com',
      bloodType: 'AB+',
      address: 'Quận 4, TP.HCM',
      dateOfBirth: '1995-03-10',
      gender: 'female'
    },
    activityHistory: [
      {
        id: 'act4',
        type: 'donation',
        date: '2024-01-05',
        bloodType: 'AB+',
        quantity: 450,
        location: 'Bệnh viện XYZ',
        status: 'completed',
        notes: 'Hiến máu thành công, kết quả xét nghiệm tốt'
      },
      {
        id: 'act5',
        type: 'request',
        date: '2023-12-20',
        bloodType: 'AB+',
        quantity: 1,
        reason: 'Điều trị ung thư',
        status: 'completed',
        notes: 'Đã nhận máu thành công'
      }
    ]
  },
  {
    id: 'member5',
    email: 'member5@test.com',
    password: 'Member5@',
    role: ROLES.MEMBER,
    profile: {
      fullName: 'Hoàng Văn E',
      phone: '0123456793',
      email: 'member5@test.com',
      bloodType: 'O-',
      address: 'Quận 5, TP.HCM',
      dateOfBirth: '1987-08-25',
      gender: 'male'
    },
    activityHistory: [
      {
        id: 'act6',
        type: 'donation',
        date: '2024-01-10',
        bloodType: 'O-',
        quantity: 450,
        location: 'Bệnh viện XYZ',
        status: 'completed',
        notes: 'Hiến máu thành công, kết quả xét nghiệm tốt'
      },
      {
        id: 'act7',
        type: 'donation',
        date: '2023-10-15',
        bloodType: 'O-',
        quantity: 450,
        location: 'Bệnh viện XYZ',
        status: 'completed',
        notes: 'Hiến máu định kỳ'
      },
      {
        id: 'act8',
        type: 'request',
        date: '2023-08-20',
        bloodType: 'O-',
        quantity: 1,
        reason: 'Tai nạn giao thông khẩn cấp',
        status: 'completed',
        notes: 'Đã nhận máu kịp thời'
      }
    ]
  },

  // Staff-Doctor (Other Department)
  {
    userID: 6,
    firebaseUID: 'firebase_uid_006',
    email: 'doctor1@test.com',
    phone: '0123456796',
    password: 'Doctor1@',
    name: 'BS. Nguyễn Văn H',
    age: 45,
    gender: 'Male',
    address: 'Quận 1, TP.HCM',
    bloodGroup: BLOOD_GROUPS.A,
    rhType: RH_TYPES.POSITIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 3,
    role: ROLES.STAFF_DOCTOR,
    department: 'Khoa Tim Mạch',
    doctorType: DOCTOR_TYPES.OTHER_DEPARTMENT,
    createdAt: '2024-01-06T00:00:00Z',
    profile: {
      fullName: 'BS. Nguyễn Văn H',
      phone: '0123456796',
      email: 'doctor1@test.com',
      department: 'Khoa Tim Mạch',
      specialization: 'Tim mạch',
      licenseNumber: 'BS001'
    }
  },
  // Staff-Doctor (Blood Department)
  {
    userID: 7,
    firebaseUID: 'firebase_uid_007',
    email: 'doctor2@test.com',
    phone: '0123456797',
    password: 'Doctor2@',
    name: 'BS. Trần Thị I',
    age: 38,
    gender: 'Female',
    address: 'Quận 3, TP.HCM',
    bloodGroup: BLOOD_GROUPS.AB,
    rhType: RH_TYPES.NEGATIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 3,
    role: ROLES.STAFF_DOCTOR,
    department: 'Khoa Huyết học',
    doctorType: DOCTOR_TYPES.BLOOD_DEPARTMENT,
    createdAt: '2024-01-07T00:00:00Z',
    profile: {
      fullName: 'BS. Trần Thị I',
      phone: '0123456797',
      email: 'doctor2@test.com',
      department: 'Khoa Huyết học',
      specialization: 'Huyết học',
      licenseNumber: 'BS002'
    }
  },

  // Staff-BloodManager
  {
    userID: 8,
    firebaseUID: 'firebase_uid_008',
    email: 'manager@test.com',
    phone: '0123456798',
    password: 'Manager1@',
    name: 'Lê Văn J',
    age: 42,
    gender: 'Male',
    address: 'Quận 1, TP.HCM',
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.NEGATIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 4,
    role: ROLES.STAFF_BLOOD_MANAGER,
    department: 'Quản lý Ngân hàng Máu',
    createdAt: '2024-01-08T00:00:00Z',
    profile: {
      fullName: 'Lê Văn J',
      phone: '0123456798',
      email: 'manager@test.com',
      department: 'Quản lý Ngân hàng Máu',
      position: 'Trưởng phòng'
    }
  },
  // Admin Users
  {
    userID: 9,
    firebaseUID: 'firebase_uid_009',
    email: 'admin@test.com',
    phone: '0123456799',
    password: 'Admin123@',
    name: 'Nguyễn Văn Admin',
    age: 44,
    gender: 'Male',
    address: 'Quận 1, TP.HCM',
    bloodGroup: BLOOD_GROUPS.A,
    rhType: RH_TYPES.POSITIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 5,
    role: ROLES.ADMIN,
    department: 'Quản trị hệ thống',
    createdAt: '2023-01-01T00:00:00Z',
    profile: {
      fullName: 'Nguyễn Văn Admin',
      phone: '0123456799',
      email: 'admin@test.com',
      department: 'Quản trị hệ thống',
      position: 'Quản trị viên'
    }
  },
  {
    userID: 10,
    firebaseUID: 'firebase_uid_010',
    email: 'superadmin@test.com',
    phone: '0123456800',
    password: 'SuperAdmin1@',
    name: 'Trần Thị Super Admin',
    age: 46,
    gender: 'Female',
    address: 'Quận 3, TP.HCM',
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.POSITIVE,
    status: USER_STATUS.ACTIVE,
    roleID: 5,
    role: ROLES.ADMIN,
    department: 'Quản trị hệ thống',
    createdAt: '2023-01-01T00:00:00Z',
    profile: {
      fullName: 'Trần Thị Super Admin',
      phone: '0123456800',
      email: 'superadmin@test.com',
      department: 'Quản trị hệ thống',
      position: 'Quản trị viên cấp cao'
    }
  }
];

// Mock blood requests matching database BloodRequests table
export const mockBloodRequests = [
  {
    requestID: 1,
    userID: 3, // Lê Văn C
    bloodGroup: BLOOD_GROUPS.A,
    rhType: RH_TYPES.NEGATIVE,
    quantity: 2,
    urgencyLevel: URGENCY_LEVELS.CRITICAL,
    neededTime: '2024-01-16T08:00:00Z',
    reason: 'Phẫu thuật khẩn cấp - tai nạn giao thông',
    isAutoApproved: false,
    status: REQUEST_STATUS.PENDING,
    createdTime: '2024-01-15T10:30:00Z',
    // Additional fields for display
    bloodType: 'A-',
    component: COMPONENT_TYPES.WHOLE,
    urgency: 'critical',
    doctorInfo: {
      name: 'BS. Nguyễn Văn K',
      department: 'Khoa Ngoại',
      phone: '0123456799',
      email: 'doctor.k@hospital.com'
    },
    notes: []
  },
  {
    requestID: 2,
    userID: 2, // Trần Thị B
    bloodGroup: BLOOD_GROUPS.AB,
    rhType: RH_TYPES.NEGATIVE,
    quantity: 1,
    urgencyLevel: URGENCY_LEVELS.NORMAL,
    neededTime: '2024-01-18T14:00:00Z',
    reason: 'Điều trị ung thư - cần truyền tiểu cầu',
    isAutoApproved: false,
    status: REQUEST_STATUS.ACCEPTED,
    createdTime: '2024-01-14T14:20:00Z',
    // Additional fields for display
    bloodType: 'AB-',
    component: COMPONENT_TYPES.PLATELETS,
    urgency: 'normal',
    doctorInfo: {
      name: 'BS. Trần Thị L',
      department: 'Khoa Ung bướu',
      phone: '0123456800',
      email: 'doctor.l@hospital.com'
    },
    notes: [
      {
        author: 'BS. Trần Thị I',
        content: 'Đã xác minh nhu cầu, chấp thuận yêu cầu',
        timestamp: '2024-01-14T16:00:00Z'
      }
    ]
  },
  {
    requestID: 3,
    userID: 6, // BS. Nguyễn Văn H (Staff-Doctor)
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.NEGATIVE,
    quantity: 3,
    urgencyLevel: URGENCY_LEVELS.URGENT,
    neededTime: '2024-01-17T06:00:00Z',
    reason: 'Phẫu thuật tim mạch khẩn cấp',
    isAutoApproved: true, // Auto-approved for Staff-Doctor
    status: REQUEST_STATUS.ACCEPTED,
    createdTime: '2024-01-16T22:30:00Z',
    // Additional fields for display
    bloodType: 'O-',
    component: COMPONENT_TYPES.RED_CELLS,
    urgency: 'urgent',
    doctorInfo: {
      name: 'BS. Nguyễn Văn H',
      department: 'Khoa Tim Mạch',
      phone: '0123456796',
      email: 'doctor1@test.com'
    },
    notes: [
      {
        author: 'System',
        content: 'Tự động chấp thuận cho bác sĩ',
        timestamp: '2024-01-16T22:30:00Z'
      }
    ]
  }
];

// Mock donation history matching database BloodDonationHistory table
export const mockDonationHistory = [
  {
    donationID: 1,
    userID: 1, // Nguyễn Văn A
    donationDate: '2024-01-10T09:00:00Z',
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.POSITIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 450,
    isSuccessful: true,
    notes: 'Hiến máu thành công, kết quả xét nghiệm tốt',
    // Additional fields for display
    bloodType: 'O+',
    location: 'Bệnh viện Đa khoa Ánh Dương',
    status: 'completed',
    testResults: {
      hiv: 'negative',
      hepatitisB: 'negative',
      hepatitisC: 'negative',
      syphilis: 'negative'
    }
  },
  {
    donationID: 2,
    userID: 2, // Trần Thị B
    donationDate: '2024-01-08T11:30:00Z',
    bloodGroup: BLOOD_GROUPS.A,
    rhType: RH_TYPES.POSITIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 450,
    isSuccessful: false,
    notes: 'Đã khám sàng lọc, chờ lịch hiến máu',
    // Additional fields for display
    bloodType: 'A+',
    location: 'Bệnh viện XYZ',
    status: 'medical_checked',
    testResults: null
  },
  {
    donationID: 3,
    userID: 5, // Hoàng Văn E
    donationDate: '2023-10-15T14:00:00Z',
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.NEGATIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 450,
    isSuccessful: true,
    notes: 'Hiến máu định kỳ - máu hiếm O-',
    // Additional fields for display
    bloodType: 'O-',
    location: 'Bệnh viện XYZ',
    status: 'completed',
    testResults: {
      hiv: 'negative',
      hepatitisB: 'negative',
      hepatitisC: 'negative',
      syphilis: 'negative'
    }
  }
];

// Mock blood inventory matching database BloodInventory table
export const mockBloodInventory = [
  {
    inventoryID: 1,
    bloodGroup: BLOOD_GROUPS.A,
    rhType: RH_TYPES.POSITIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 25,
    isRare: false,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    inventoryID: 2,
    bloodGroup: BLOOD_GROUPS.A,
    rhType: RH_TYPES.NEGATIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 8,
    isRare: false,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    inventoryID: 3,
    bloodGroup: BLOOD_GROUPS.B,
    rhType: RH_TYPES.POSITIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 18,
    isRare: false,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    inventoryID: 4,
    bloodGroup: BLOOD_GROUPS.B,
    rhType: RH_TYPES.NEGATIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 3,
    isRare: true,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    inventoryID: 5,
    bloodGroup: BLOOD_GROUPS.AB,
    rhType: RH_TYPES.POSITIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 12,
    isRare: false,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    inventoryID: 6,
    bloodGroup: BLOOD_GROUPS.AB,
    rhType: RH_TYPES.NEGATIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 2,
    isRare: true,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    inventoryID: 7,
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.POSITIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 35,
    isRare: false,
    lastUpdated: '2024-01-15T10:00:00Z'
  },
  {
    inventoryID: 8,
    bloodGroup: BLOOD_GROUPS.O,
    rhType: RH_TYPES.NEGATIVE,
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 5,
    isRare: true,
    lastUpdated: '2024-01-15T10:00:00Z'
  }
];

// Mock hospital info matching database HospitalInfo table
export const mockHospitalInfo = {
  id: 1,
  name: 'Bệnh viện Đa khoa Ánh Dương',
  address: 'Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam',
  phone: '(028) 3957 1343',
  email: 'anhduonghospital@gmail.com',
  workingHours: 'Thứ 2 - Chủ nhật: 07:00 - 17:00',
  mapImageUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=10.7751237,106.6862143&zoom=15&size=600x400&key=YOUR_API_KEY',
  latitude: 10.7751237,
  longitude: 106.6862143
};

// Function to get user by email and password
export const authenticateUser = (email, password) => {
  return mockUsers.find(user =>
    user.email === email &&
    user.password === password &&
    user.status === USER_STATUS.ACTIVE
  );
};

// Function to get user by ID
export const getUserById = (userID) => {
  return mockUsers.find(user => user.userID === userID);
};

// Function to get blood requests by user role
export const getBloodRequestsByRole = (userRole, userID) => {
  if (userRole === ROLES.MEMBER) {
    return mockBloodRequests.filter(req => req.userID === userID);
  }
  return mockBloodRequests;
};

// Function to get donation history by donor ID
export const getDonationHistoryByDonor = (userID) => {
  return mockDonationHistory.filter(donation => donation.userID === userID);
};

// Function to get blood inventory with status
export const getBloodInventoryWithStatus = () => {
  return mockBloodInventory.map(item => {
    let status = 'normal';
    if (item.quantity <= 2) {
      status = 'critical';
    } else if (item.quantity <= 5) {
      status = 'low';
    } else if (item.quantity >= 30) {
      status = 'high';
    }

    return {
      ...item,
      bloodType: `${item.bloodGroup}${item.rhType}`,
      status,
      statusIcon: status === 'critical' ? '🚨' :
                  status === 'low' ? '⚠️' :
                  status === 'high' ? '✅' : '🔵'
    };
  });
};

// Mock Blog Data for testing - Updated for new workflow
// Doctor: Auto-publish all posts (no approval needed)
// Manager: Can only post News and Announcements (not Documents)
// Admin: Can only delete posts (no approval workflow)
export const MOCK_BLOGS = [
  // Doctor posts - Tài liệu (auto-published)
  {
    id: 1,
    title: 'Hướng dẫn chuẩn bị trước khi hiến máu',
    slug: 'huong-dan-chuan-bi-truoc-khi-hien-mau',
    category: 'Tài liệu',
    contentType: 'document',
    status: 'published', // Doctor auto-publishes
    author: 'BS. Nguyễn Văn H',
    authorId: 6, // Doctor Other Department
    authorRole: 'doctor',
    targetAudience: 'public',
    excerpt: 'Hướng dẫn chi tiết các bước chuẩn bị cần thiết trước khi hiến máu để đảm bảo an toàn và hiệu quả.',
    content: `<h2>Chuẩn bị sức khỏe</h2><p>Trước khi hiến máu, bạn cần đảm bảo sức khỏe tốt...</p>`,
    featuredImage: '/images/blog/blood-donation-prep.jpg',
    tags: 'hiến máu, chuẩn bị, hướng dẫn, sức khỏe',
    views: 1245,
    likes: 89,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    publishedAt: '2024-01-15T10:30:00Z' // Auto-published immediately
  },
  {
    id: 2,
    title: 'Thông tin về các nhóm máu và tính tương thích',
    slug: 'thong-tin-ve-cac-nhom-mau-va-tinh-tuong-thich',
    category: 'Tài liệu',
    contentType: 'document',
    status: 'published', // Doctor auto-publishes
    author: 'BS. Trần Thị I',
    authorId: 7, // Doctor Blood Department
    authorRole: 'doctor',
    targetAudience: 'public',
    excerpt: 'Kiến thức cơ bản về hệ nhóm máu ABO, Rh và tính tương thích trong truyền máu.',
    content: `<h2>Hệ nhóm máu ABO</h2><p>Có 4 nhóm máu chính trong hệ ABO...</p>`,
    featuredImage: '/images/blog/blood-types.jpg',
    tags: 'nhóm máu, ABO, Rh, tương thích, truyền máu',
    views: 892,
    likes: 67,
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    publishedAt: '2024-01-12T09:15:00Z' // Auto-published immediately
  },
  {
    id: 3,
    title: 'Quy trình xét nghiệm máu hiến tặng',
    slug: 'quy-trinh-xet-nghiem-mau-hien-tang',
    category: 'Tài liệu',
    contentType: 'document',
    status: 'published', // Doctor auto-publishes
    author: 'BS. Trần Thị I',
    authorId: 7, // Doctor Blood Department
    authorRole: 'doctor',
    targetAudience: 'public',
    excerpt: 'Quy trình xét nghiệm máu hiến tặng để đảm bảo an toàn cho người nhận.',
    content: `<h2>Các xét nghiệm bắt buộc</h2><p>Mọi đơn vị máu hiến tặng đều phải qua các xét nghiệm...</p>`,
    featuredImage: '/images/blog/blood-testing.jpg',
    tags: 'xét nghiệm, máu, an toàn, quy trình',
    views: 654,
    likes: 43,
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    publishedAt: '2024-01-18T14:20:00Z' // Auto-published immediately
  },

  // Manager posts - Tin tức (auto-published)
  {
    id: 4,
    title: 'Tin tức: Chiến dịch hiến máu tháng 2/2024',
    slug: 'tin-tuc-chien-dich-hien-mau-thang-2-2024',
    category: 'Tin tức',
    contentType: 'news',
    status: 'published', // Manager auto-publishes news
    author: 'QL. Lê Văn J',
    authorId: 8, // Manager
    authorRole: 'manager',
    targetAudience: 'public',
    excerpt: 'Bệnh viện Ánh Dương tổ chức chiến dịch hiến máu nhân đạo "Giọt máu hồng - Tình người ấm" trong tháng 2/2024.',
    content: `<h2>Thông tin chiến dịch</h2><p>Bệnh viện Ánh Dương phối hợp với Hội Chữ thập đỏ...</p>`,
    featuredImage: '/images/blog/blood-campaign-2024.jpg',
    tags: 'chiến dịch, hiến máu, tháng 2, bệnh viện, tình nguyện',
    views: 567,
    likes: 45,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    publishedAt: '2024-01-20T14:30:00Z' // Auto-published immediately
  },

  // Manager posts - Thông báo nội bộ (internal)
  {
    id: 5,
    title: 'Thông báo: Lịch trực khoa Huyết học tháng 2/2024',
    slug: 'thong-bao-lich-truc-khoa-huyet-hoc-thang-2-2024',
    category: 'Thông báo',
    contentType: 'announcement',
    status: 'published', // Manager auto-publishes announcements
    author: 'QL. Lê Văn J',
    authorId: 8, // Manager
    authorRole: 'manager',
    targetAudience: 'internal', // Staff only
    excerpt: 'Thông báo lịch trực và phân công công việc cho khoa Huyết học trong tháng 2/2024.',
    content: `<h2>Lịch trực tháng 2/2024</h2><p>Các bác sĩ và nhân viên khoa Huyết học...</p>`,
    featuredImage: '/images/blog/schedule-announcement.jpg',
    tags: 'lịch trực, khoa huyết học, thông báo, nội bộ',
    views: 89,
    likes: 12,
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z',
    publishedAt: '2024-01-25T09:00:00Z' // Auto-published immediately
  }
];
