import axios from "axios";
import config from "../config/environment";

const API_URL = config.api.activityLog;

export async function getActivityLogs() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    // Kiểm tra nếu response.data là 0 hoặc không phải array
    if (response.data === 0 || !Array.isArray(response.data)) {
      const mockData = getMockActivityLogs();
      return { data: mockData }; // Wrap trong object có data property
    }

    return response; // Trả về response thay vì response.data
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    // Trả về dữ liệu mẫu để test UI khi API chưa sẵn sàng
    const mockData = getMockActivityLogs();
    return { data: mockData }; // Wrap trong object có data property
  }
}

// Hàm tạo dữ liệu mẫu cho activity logs
function getMockActivityLogs() {
  return [
    {
      id: 1,
      userID: "user1",
      activityType: "Create",
      entityType: "Article",
      entityId: "123",
      description: "Tạo bài viết mới về hiến máu",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      userID: "user2",
      activityType: "Update",
      entityType: "News",
      entityId: "456",
      description: "Cập nhật tin tức về sự kiện hiến máu",
      createdAt: "2024-01-15T09:15:00Z",
    },
    {
      id: 3,
      userID: "user3",
      activityType: "Delete",
      entityType: "Blog",
      entityId: "789",
      description: "Xóa bài viết cũ không còn phù hợp",
      createdAt: "2024-01-15T08:45:00Z",
    },
    {
      id: 4,
      userID: "user1",
      activityType: "Update",
      entityType: "Article",
      entityId: "124",
      description: "Chỉnh sửa nội dung bài viết về quy trình hiến máu",
      createdAt: "2024-01-15T07:20:00Z",
    },
    {
      id: 5,
      userID: "user2",
      activityType: "Create",
      entityType: "News",
      entityId: "457",
      description: "Đăng tin tức mới về chương trình hiến máu tình nguyện",
      createdAt: "2024-01-15T06:10:00Z",
    },
  ];
}

export async function getActivityLogsByUser(userId) {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching activity logs by user:", error);
    throw error;
  }
}

export async function getActivityLogsByType(activityType) {
  try {
    const response = await axios.get(`${API_URL}/type/${activityType}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching activity logs by type:", error);
    throw error;
  }
}
