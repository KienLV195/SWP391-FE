# 🔌 API INTEGRATION GUIDE - BLOOD DONATION MANAGEMENT SYSTEM

## 🎯 HƯỚNG DẪN TÍCH HỢP API

**Tìm kiếm nhanh**: Sử dụng `Ctrl+F` với các từ khóa sau để tìm API cần thay thế:
- `TODO_API_REPLACE` - Các chỗ cần thay thế bằng API thực
- `MOCK_DATA` - Các section mock data cần xóa
- `GET /api/` - Tìm các API GET
- `POST /api/` - Tìm các API POST  
- `PUT /api/` - Tìm các API PUT
- `DELETE /api/` - Tìm các API DELETE

---

## 🔐 AUTHENTICATION APIs

### **File**: `src/services/authService.js`

#### **1. Login API**
```javascript
// TODO_API_REPLACE: Line 37-50
POST /api/auth/login
Headers: {
  'Content-Type': 'application/json'
}
Body: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "success": true,
  "user": { id, email, role, profile },
  "token": "jwt_token_here"
}
```

#### **2. Register API**
```javascript
// TODO_API_REPLACE: Line 75-88
POST /api/auth/register
Headers: {
  'Content-Type': 'application/json'
}
Body: {
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyen Van A",
  "phone": "0123456789",
  "role": "member"
}
Response: {
  "success": true,
  "message": "Registration successful"
}
```

#### **3. Logout API**
```javascript
// TODO_API_REPLACE: Line 100-107
POST /api/auth/logout
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📝 BLOG MANAGEMENT APIs

### **File**: `src/services/blogService.js`

#### **1. Get Public Blogs**
```javascript
// TODO_API_REPLACE: Line 37-50
GET /api/blogs?category={category}&contentType={contentType}&limit={limit}
Headers: {
  'Content-Type': 'application/json'
}
Response: {
  "success": true,
  "blogs": [
    {
      "id": 1,
      "title": "Blog Title",
      "content": "Blog content",
      "category": "Tài liệu",
      "contentType": "document",
      "status": "published",
      "author": "Doctor Name",
      "publishedAt": "2024-01-26T10:00:00Z"
    }
  ]
}
```

#### **2. Create Blog**
```javascript
// TODO_API_REPLACE: Line 177-191
POST /api/blogs
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Body: {
  "title": "Blog Title",
  "content": "Blog content",
  "category": "Tài liệu",
  "contentType": "document",
  "targetAudience": "public",
  "authorId": 123,
  "authorRole": "doctor"
}
Response: {
  "success": true,
  "blog": { id, title, content, status: "published" },
  "message": "Blog created and published successfully"
}
```

#### **3. Update Blog**
```javascript
// TODO_API_REPLACE: Line 220-235
PUT /api/blogs/{id}
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Body: {
  "title": "Updated Title",
  "content": "Updated content"
}
Response: {
  "success": true,
  "blog": { updated_blog_data },
  "message": "Blog updated successfully"
}
```

#### **4. Delete Blog**
```javascript
// TODO_API_REPLACE: Line 265-275
DELETE /api/blogs/{id}
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "message": "Blog deleted successfully"
}
```

#### **5. Get Blogs by Author**
```javascript
// TODO_API_REPLACE: Line 140-155
GET /api/blogs/author/{authorId}?status={status}&category={category}
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "blogs": [ array_of_author_blogs ]
}
```

#### **6. Admin Get All Blogs**
```javascript
// TODO_API_REPLACE: Line 300-315
GET /api/admin/blogs?category={category}&search={search}
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "blogs": [ array_of_published_blogs ]
}
```

---

## 🩸 BLOOD DONATION APIs

### **File**: `src/services/geolibService.js`

#### **1. Find Nearby Donors**
```javascript
// TODO_API_REPLACE: Line 352-367
GET /api/donors/nearby?bloodType={bloodType}&maxDistance={maxDistance}&urgency={urgency}
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "donors": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "bloodType": "O+",
      "phone": "0123456789",
      "coordinates": { "lat": 10.7751, "lng": 106.6862 },
      "distance": 2.5,
      "isEligible": true,
      "lastDonationDate": "2024-10-15"
    }
  ]
}
```

---

## 🔔 NOTIFICATION APIs

### **File**: `src/services/notificationService.js`

#### **1. Get User Notifications**
```javascript
// TODO_API_REPLACE: Line 90-104
GET /api/notifications/{userId}
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "notifications": [
    {
      "id": 1,
      "type": "donation_reminder",
      "title": "Nhắc nhở hiến máu",
      "message": "Bạn đã có thể hiến máu trở lại!",
      "isRead": false,
      "createdAt": "2024-01-26T10:00:00Z"
    }
  ]
}
```

#### **2. Mark Notification as Read**
```javascript
// TODO_API_REPLACE: Line 120-130
PUT /api/notifications/{notificationId}/read
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "message": "Notification marked as read"
}
```

#### **3. Create Notification**
```javascript
// TODO_API_REPLACE: Line 155-170
POST /api/notifications
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Body: {
  "userId": 123,
  "type": "donation_reminder",
  "title": "Notification Title",
  "message": "Notification message",
  "data": { additional_data }
}
Response: {
  "success": true,
  "notification": { created_notification },
  "message": "Notification created successfully"
}
```

---

## 🏥 BLOOD DONATION FORM APIs

### **Files cần thêm API calls**:

#### **1. Submit Donation Form**
```javascript
// File: src/pages/member/BloodDonationFormPage.jsx
// TODO_API_REPLACE: Add to handleSubmit function
POST /api/donations
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Body: {
  "donorId": 123,
  "healthSurvey": { health_answers },
  "appointmentDate": "2024-01-30",
  "timeSlot": "morning",
  "address": "Full address",
  "coordinates": { "lat": 10.7751, "lng": 106.6862 },
  "distance": 2.5
}
Response: {
  "success": true,
  "donation": { donation_record },
  "message": "Donation registered successfully"
}
```

#### **2. Submit Blood Request**
```javascript
// File: src/pages/member/BloodRequestFormPage.jsx
// TODO_API_REPLACE: Add to handleSubmit function
POST /api/blood-requests
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Body: {
  "requesterId": 123,
  "bloodType": "O+",
  "quantity": 2,
  "urgency": "urgent",
  "medicalInfo": "Medical details",
  "hospitalLocation": "Hospital address",
  "doctorInfo": { doctor_details }
}
Response: {
  "success": true,
  "request": { request_record },
  "message": "Blood request submitted successfully"
}
```

---

## 👨‍⚕️ DOCTOR MANAGEMENT APIs

#### **1. Get Pending Donations**
```javascript
// File: src/pages/doctor/DoctorDonorManagementPage.jsx
// TODO_API_REPLACE: Add to useEffect
GET /api/doctor/donations?status=pending
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "donations": [ array_of_pending_donations ]
}
```

#### **2. Update Donation Status**
```javascript
// TODO_API_REPLACE: Add to handleStatusUpdate function
PUT /api/doctor/donations/{donationId}/status
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Body: {
  "status": "health_checked",
  "notes": "Health screening completed"
}
Response: {
  "success": true,
  "donation": { updated_donation },
  "message": "Status updated successfully"
}
```

---

## 👨‍💼 MANAGER INVENTORY APIs

#### **1. Get Blood Inventory**
```javascript
// File: src/pages/manager/BloodInventoryPage.jsx
// TODO_API_REPLACE: Add to useEffect
GET /api/manager/inventory
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "inventory": [
    {
      "bloodType": "O+",
      "quantity": 25,
      "status": "normal",
      "expiryDate": "2024-02-15"
    }
  ]
}
```

#### **2. Update Inventory**
```javascript
// TODO_API_REPLACE: Add to handleInventoryUpdate function
PUT /api/manager/inventory/{bloodType}
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer jwt_token_here'
}
Body: {
  "quantity": 30,
  "operation": "add" // or "subtract"
}
Response: {
  "success": true,
  "inventory": { updated_inventory_item },
  "message": "Inventory updated successfully"
}
```

---

## 🔍 SEARCH & FILTER APIs

#### **1. Search Users (Admin)**
```javascript
// File: src/pages/admin/UserManagement.jsx
// TODO_API_REPLACE: Add to search function
GET /api/admin/users?search={query}&role={role}&status={status}
Headers: {
  'Authorization': 'Bearer jwt_token_here'
}
Response: {
  "success": true,
  "users": [ array_of_filtered_users ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

---

## 🚀 IMPLEMENTATION STEPS

### **1. Find and Replace**
1. Search for `TODO_API_REPLACE` in all files
2. Replace mock implementations with actual API calls
3. Update error handling for real API responses

### **2. Remove Mock Data**
1. Search for `MOCK_DATA` comments
2. Remove mock data sections
3. Clean up mock imports

### **3. Environment Setup**
1. Update `src/config/environment.js` with production API URL
2. Set up proper authentication token handling
3. Configure CORS and API headers

### **4. Testing**
1. Test each API endpoint individually
2. Verify error handling and loading states
3. Test authentication flows

---

## 📋 COMPLETE API ENDPOINTS LIST

### **Authentication Endpoints**
```
POST   /api/auth/login              - User login
POST   /api/auth/register           - User registration
POST   /api/auth/logout             - User logout
POST   /api/auth/refresh            - Refresh token
POST   /api/auth/forgot-password    - Password reset
POST   /api/auth/verify-email       - Email verification
```

### **Blog Management Endpoints**
```
GET    /api/blogs                   - Get public blogs
GET    /api/blogs/slug/{slug}       - Get blog by slug
GET    /api/blogs/author/{id}       - Get blogs by author
POST   /api/blogs                   - Create blog (auto-publish)
PUT    /api/blogs/{id}              - Update blog
DELETE /api/blogs/{id}              - Delete blog
GET    /api/admin/blogs             - Admin get all published blogs
DELETE /api/admin/blogs/{id}        - Admin delete blog
```

### **Blood Donation Endpoints**
```
POST   /api/donations               - Submit donation form
POST   /api/donations/schedule      - Schedule appointment
GET    /api/donations/{id}          - Get donation details
PUT    /api/donations/{id}/status   - Update donation status
GET    /api/doctor/donations        - Get donations for doctor
GET    /api/manager/donations       - Get donations for manager
```

### **Blood Request Endpoints**
```
POST   /api/blood-requests          - Submit blood request
GET    /api/blood-requests/{id}     - Get request details
PUT    /api/blood-requests/{id}     - Update request
DELETE /api/blood-requests/{id}     - Cancel request
GET    /api/doctor/blood-requests   - Get requests for doctor
GET    /api/manager/blood-requests  - Get requests for manager
```

### **User Management Endpoints**
```
GET    /api/admin/users             - Get all users (admin)
POST   /api/admin/users             - Create user (admin)
PUT    /api/admin/users/{id}        - Update user (admin)
DELETE /api/admin/users/{id}        - Delete user (admin)
PUT    /api/admin/users/{id}/status - Change user status
GET    /api/users/profile           - Get user profile
PUT    /api/users/profile           - Update user profile
```

### **Notification Endpoints**
```
GET    /api/notifications/{userId}  - Get user notifications
POST   /api/notifications           - Create notification
PUT    /api/notifications/{id}/read - Mark as read
DELETE /api/notifications/{id}      - Delete notification
PUT    /api/notifications/read-all  - Mark all as read
```

### **Blood Inventory Endpoints**
```
GET    /api/manager/inventory       - Get blood inventory
PUT    /api/manager/inventory/{type} - Update inventory
GET    /api/manager/inventory/stats - Get inventory statistics
POST   /api/manager/inventory/alert - Create low stock alert
```

### **Location & Distance Endpoints**
```
GET    /api/donors/nearby           - Find nearby donors
POST   /api/geocoding/address       - Geocode address
POST   /api/geocoding/reverse       - Reverse geocode
GET    /api/distance/calculate      - Calculate distance
```

### **Admin Dashboard Endpoints**
```
GET    /api/admin/dashboard/stats   - Dashboard statistics
GET    /api/admin/dashboard/activities - Recent activities
GET    /api/admin/dashboard/alerts  - System alerts
GET    /api/admin/reports           - Generate reports
GET    /api/admin/system/settings   - System settings
PUT    /api/admin/system/settings   - Update settings
```

---

## 🔧 IMPLEMENTATION CHECKLIST

### **Phase 1: Authentication**
- [ ] Implement login API
- [ ] Implement registration API
- [ ] Implement logout API
- [ ] Set up JWT token handling
- [ ] Test authentication flow

### **Phase 2: Core Features**
- [ ] Implement blog APIs
- [ ] Implement donation APIs
- [ ] Implement blood request APIs
- [ ] Test CRUD operations

### **Phase 3: Management Features**
- [ ] Implement user management APIs
- [ ] Implement inventory APIs
- [ ] Implement notification APIs
- [ ] Test role-based access

### **Phase 4: Advanced Features**
- [ ] Implement location APIs
- [ ] Implement dashboard APIs
- [ ] Implement reporting APIs
- [ ] Performance optimization

### **Phase 5: Production Ready**
- [ ] Error handling
- [ ] Input validation
- [ ] Security measures
- [ ] API documentation
- [ ] Testing coverage

**All API placeholders are clearly marked and ready for integration!** 🎉
