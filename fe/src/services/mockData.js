// Mock data for testing different user roles and statuses

export const ROLES = {
  GUEST: 'guest',
  MEMBER: 'member',
  DOCTOR: 'doctor',
  MANAGER: 'manager'
};

// Removed MEMBER_TYPES - Members can be both donors and recipients

// Removed DONOR_STATUS and RECIPIENT_STATUS - using activity history instead

export const DOCTOR_TYPES = {
  OTHER_DEPARTMENT: 'other_department',
  BLOOD_DEPARTMENT: 'blood_department'
};

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

// Mock users for testing
export const mockUsers = [
  // Members (can be both donors and recipients)
  {
    id: 'member1',
    email: 'member1@test.com',
    password: '123456',
    role: ROLES.MEMBER,
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
    id: 'member2',
    email: 'member2@test.com',
    password: '123456',
    role: ROLES.MEMBER,
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
    id: 'member3',
    email: 'member3@test.com',
    password: '123456',
    role: ROLES.MEMBER,
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
    password: '123456',
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
    password: '123456',
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

  // Doctors
  {
    id: 'doctor1',
    email: 'doctor1@test.com',
    password: '123456',
    role: ROLES.DOCTOR,
    doctorType: DOCTOR_TYPES.OTHER_DEPARTMENT,
    profile: {
      fullName: 'BS. Nguyễn Văn H',
      phone: '0123456796',
      email: 'doctor1@test.com',
      department: 'Khoa Tim Mạch',
      specialization: 'Tim mạch',
      licenseNumber: 'BS001'
    }
  },
  {
    id: 'doctor2',
    email: 'doctor2@test.com',
    password: '123456',
    role: ROLES.DOCTOR,
    doctorType: DOCTOR_TYPES.BLOOD_DEPARTMENT,
    profile: {
      fullName: 'BS. Trần Thị I',
      phone: '0123456797',
      email: 'doctor2@test.com',
      department: 'Khoa Huyết học',
      specialization: 'Huyết học',
      licenseNumber: 'BS002'
    }
  },

  // Managers
  {
    id: 'manager1',
    email: 'manager@test.com',
    password: '123456',
    role: ROLES.MANAGER,
    profile: {
      fullName: 'Lê Văn J',
      phone: '0123456798',
      email: 'manager@test.com',
      department: 'Quản lý Ngân hàng Máu',
      position: 'Trưởng phòng'
    }
  }
];

// Mock blood requests
export const mockBloodRequests = [
  {
    id: 'req1',
    requesterId: 'recipient1',
    bloodType: 'A-',
    component: 'whole_blood',
    quantity: 2,
    urgency: 'emergency',
    reason: 'Phẫu thuật khẩn cấp',
    doctorInfo: {
      name: 'BS. Nguyễn Văn K',
      department: 'Khoa Ngoại',
      phone: '0123456799',
      email: 'doctor.k@hospital.com'
    },
    status: REQUEST_STATUS.PENDING,
    createdAt: '2024-01-15T10:30:00Z',
    notes: []
  },
  {
    id: 'req2',
    requesterId: 'recipient2',
    bloodType: 'AB-',
    component: 'platelets',
    quantity: 1,
    urgency: 'normal',
    reason: 'Điều trị ung thư',
    doctorInfo: {
      name: 'BS. Trần Thị L',
      department: 'Khoa Ung bướu',
      phone: '0123456800',
      email: 'doctor.l@hospital.com'
    },
    status: REQUEST_STATUS.APPROVED,
    createdAt: '2024-01-14T14:20:00Z',
    notes: [
      {
        author: 'BS. Trần Thị I',
        content: 'Đã xác minh nhu cầu, chấp thuận yêu cầu',
        timestamp: '2024-01-14T16:00:00Z'
      }
    ]
  }
];

// Mock donation history
export const mockDonationHistory = [
  {
    id: 'donation1',
    donorId: 'donor5',
    bloodType: 'O-',
    quantity: 450,
    donationDate: '2024-01-10T09:00:00Z',
    location: 'Bệnh viện XYZ',
    status: 'completed',
    testResults: {
      hiv: 'negative',
      hepatitisB: 'negative',
      hepatitisC: 'negative',
      syphilis: 'negative'
    }
  },
  {
    id: 'donation2',
    donorId: 'donor4',
    bloodType: 'AB+',
    quantity: 450,
    donationDate: '2024-01-12T11:30:00Z',
    location: 'Bệnh viện XYZ',
    status: 'testing',
    testResults: null
  }
];

// Function to get user by email and password
export const authenticateUser = (email, password) => {
  return mockUsers.find(user => user.email === email && user.password === password);
};

// Function to get user by ID
export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

// Function to get blood requests by user role
export const getBloodRequestsByRole = (userRole, userId) => {
  if (userRole === ROLES.MEMBER) {
    return mockBloodRequests.filter(req => req.requesterId === userId);
  }
  return mockBloodRequests;
};

// Function to get donation history by donor ID
export const getDonationHistoryByDonor = (donorId) => {
  return mockDonationHistory.filter(donation => donation.donorId === donorId);
};
