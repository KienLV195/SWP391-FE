import axios from "axios";
import config from "../config/environment";

const API_BASE = config.api.baseUrl;

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE}/upload/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Không thể upload ảnh. Vui lòng thử lại.");
  }
};

export const uploadMultipleImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axios.post(`${API_BASE}/upload/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Không thể upload ảnh. Vui lòng thử lại.");
  }
};
