# 🔍 API SEARCH COMMANDS - QUICK REFERENCE

## 🎯 HƯỚNG DẪN TÌM KIẾM NHANH

**Sử dụng `Ctrl+F` trong IDE để tìm kiếm các API cần thay thế:**

---

## 🔑 SEARCH KEYWORDS

### **1. Tìm tất cả API placeholders:**
```
TODO_API_REPLACE
```
**Kết quả**: Tìm thấy tất cả chỗ cần thay thế bằng API thực

### **2. Tìm mock data cần xóa:**
```
MOCK_DATA
```
**Kết quả**: Tìm thấy tất cả section mock data cần loại bỏ

### **3. Tìm theo HTTP method:**
```
GET /api/
POST /api/
PUT /api/
DELETE /api/
```
**Kết quả**: Tìm theo từng loại HTTP request

---

## 📁 SEARCH BY SERVICE

### **Authentication Service**
```
// File: src/services/authService.js
TODO_API_REPLACE: Line 37-50    - Login API
TODO_API_REPLACE: Line 75-88    - Register API  
TODO_API_REPLACE: Line 100-107  - Logout API
```

### **Blog Service**
```
// File: src/services/blogService.js
TODO_API_REPLACE: Line 37-50    - Get public blogs
TODO_API_REPLACE: Line 177-191  - Create blog
TODO_API_REPLACE: Line 220-235  - Update blog
TODO_API_REPLACE: Line 265-275  - Delete blog
TODO_API_REPLACE: Line 140-155  - Get blogs by author
TODO_API_REPLACE: Line 300-315  - Admin get all blogs
```

### **Geolib Service**
```
// File: src/services/geolibService.js
TODO_API_REPLACE: Line 352-367  - Find nearby donors
```

### **Notification Service**
```
// File: src/services/notificationService.js
TODO_API_REPLACE: Line 90-104   - Get notifications
TODO_API_REPLACE: Line 120-130  - Mark as read
TODO_API_REPLACE: Line 155-170  - Create notification
```

### **Admin Service**
```
// File: src/services/adminService.js
TODO_API_REPLACE: Line 29-52    - Dashboard stats
TODO_API_REPLACE: Line 160-175  - Get users
TODO_API_REPLACE: Line 215-230  - Create user
TODO_API_REPLACE: Line 250-265  - Update user
TODO_API_REPLACE: Line 285-300  - Delete user
```

---

## 📄 SEARCH BY PAGE

### **Member Pages**
```
// File: src/pages/member/BloodDonationFormPage.jsx
TODO_API_REPLACE: handleAppointmentSubmit function - Submit donation

// File: src/pages/member/BloodRequestFormPage.jsx  
TODO_API_REPLACE: handleSubmit function - Submit blood request

// File: src/pages/member/ActivityHistoryPage.jsx
TODO_API_REPLACE: useEffect - Load activity history

// File: src/pages/member/MemberProfilePage.jsx
TODO_API_REPLACE: handleSave function - Update profile
```

### **Doctor Pages**
```
// File: src/pages/doctor/DoctorDonorManagementPage.jsx
TODO_API_REPLACE: useEffect - Load pending donations
TODO_API_REPLACE: handleStatusUpdate - Update donation status

// File: src/pages/doctor/DoctorBloodRequestsPage.jsx
TODO_API_REPLACE: useEffect - Load blood requests
TODO_API_REPLACE: handleApprove - Approve request
TODO_API_REPLACE: handleReject - Reject request
```

### **Manager Pages**
```
// File: src/pages/manager/BloodInventoryPage.jsx
TODO_API_REPLACE: useEffect - Load inventory
TODO_API_REPLACE: handleInventoryUpdate - Update stock

// File: src/pages/manager/DonationSchedulePage.jsx
TODO_API_REPLACE: useEffect - Load donations
TODO_API_REPLACE: handleStatusUpdate - Update status
```

### **Admin Pages**
```
// File: src/pages/admin/AdminDashboard.jsx
TODO_API_REPLACE: useEffect - Load dashboard data

// File: src/pages/admin/BlogApproval.jsx
TODO_API_REPLACE: useEffect - Load published blogs
TODO_API_REPLACE: handleDelete - Delete blog
```

---

## 🔧 SEARCH BY FUNCTIONALITY

### **Authentication Functions**
```
// Login functionality
POST /api/auth/login

// Registration functionality  
POST /api/auth/register

// Logout functionality
POST /api/auth/logout
```

### **CRUD Operations**
```
// Create operations
POST /api/

// Read operations
GET /api/

// Update operations
PUT /api/

// Delete operations
DELETE /api/
```

### **Role-based APIs**
```
// Admin APIs
/api/admin/

// Doctor APIs
/api/doctor/

// Manager APIs
/api/manager/

// Member APIs
/api/members/
```

---

## 📊 SEARCH BY DATA TYPE

### **Blog Management**
```
/api/blogs
/api/admin/blogs
blogService.createBlog
blogService.updateBlog
blogService.deleteBlog
```

### **Blood Donation**
```
/api/donations
/api/donations/schedule
handleAppointmentSubmit
handleDonationSubmit
```

### **Blood Requests**
```
/api/blood-requests
handleBloodRequest
handleRequestApproval
```

### **User Management**
```
/api/admin/users
/api/users/profile
handleUserUpdate
handleProfileSave
```

### **Notifications**
```
/api/notifications
notificationService.getNotifications
notificationService.createNotification
```

### **Inventory Management**
```
/api/manager/inventory
handleInventoryUpdate
getInventoryStats
```

---

## 🚀 QUICK REPLACEMENT GUIDE

### **Step 1: Find API placeholder**
```bash
Ctrl+F: "TODO_API_REPLACE"
```

### **Step 2: Identify the API endpoint**
```javascript
// Look for comment like:
// GET /api/blogs?category={category}
```

### **Step 3: Replace with actual fetch call**
```javascript
const response = await fetch(`${config.api.baseUrl}/endpoint`, {
  method: 'GET/POST/PUT/DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  },
  body: JSON.stringify(data) // for POST/PUT only
});
```

### **Step 4: Remove mock data section**
```bash
Ctrl+F: "MOCK_DATA"
# Delete the entire mock section
```

### **Step 5: Test the integration**
```javascript
// Verify response handling
if (response.ok) {
  const data = await response.json();
  // Handle success
} else {
  // Handle error
}
```

---

## 📝 REPLACEMENT CHECKLIST

### **For each API replacement:**
- [ ] Find `TODO_API_REPLACE` comment
- [ ] Identify correct endpoint from comment
- [ ] Replace with actual fetch call
- [ ] Add proper headers (Content-Type, Authorization)
- [ ] Handle response properly
- [ ] Remove `MOCK_DATA` section
- [ ] Test the functionality
- [ ] Update error handling

### **Common patterns to replace:**
```javascript
// OLD (Mock)
await this.simulateDelay();
return mockData;

// NEW (Real API)
const response = await fetch(endpoint, options);
const data = await response.json();
return data;
```

**Use these search commands to quickly find and replace all API placeholders!** 🎯
