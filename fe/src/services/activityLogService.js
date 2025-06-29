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

    // Trả về dữ liệu từ API, đảm bảo là mảng
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    // Trả về mảng rỗng nếu có lỗi
    return [];
  }
}

export async function getActivityLogsByUser(userId) {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching activity logs by user:", error);
    return [];
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
    const data = response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching activity logs by type:", error);
    return [];
  }
}
