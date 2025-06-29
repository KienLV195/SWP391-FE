import axios from "axios";
import config from "../config/environment";

const API_BASE = config.api.news;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchAllNews = async () => {
  const res = await axios.get(API_BASE, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const fetchNewsById = async (postId) => {
  const res = await axios.get(`${API_BASE}/${postId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createNews = async (data) => {
  // Process tags to separate existing tag IDs and new tag names
  const selectedTags = data.tagIds || [];
  const tagIds = [];
  const newTags = [];

  selectedTags.forEach((tag) => {
    // If it's a number or numeric string, treat as tagId
    if (
      typeof tag === "number" ||
      (typeof tag === "string" && !isNaN(tag) && tag.trim() !== "")
    ) {
      tagIds.push(typeof tag === "number" ? tag : parseInt(tag));
    } else if (typeof tag === "string" && tag.trim() !== "") {
      // If it's a non-numeric string, treat as new tag name
      newTags.push(tag);
    }
  });

  const requestData = {
    title: data.title,
    content: data.content,
    imgUrl: data.imgUrl || "",
    tagIds: tagIds,
    newTags: newTags,
    userId: data.userId,
  };

  try {
    const res = await axios.post(API_BASE, requestData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error response from News API:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
    });
    throw error;
  }
};

export const updateNews = async (postId, data) => {
  // Process tags to separate existing tag IDs and new tag names
  const selectedTags = data.tagIds || [];
  const tagIds = [];
  const newTags = [];

  selectedTags.forEach((tag) => {
    // If it's a number or numeric string, treat as tagId
    if (
      typeof tag === "number" ||
      (typeof tag === "string" && !isNaN(tag) && tag.trim() !== "")
    ) {
      tagIds.push(typeof tag === "number" ? tag : parseInt(tag));
    } else if (typeof tag === "string" && tag.trim() !== "") {
      // If it's a non-numeric string, treat as new tag name
      newTags.push(tag);
    }
  });

  const requestData = {
    title: data.title,
    content: data.content,
    imgUrl: data.imgUrl || "",
    tagIds: tagIds,
    newTags: newTags,
    userId: data.userId,
  };

  try {
    const res = await axios.put(`${API_BASE}/${postId}`, requestData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Update news error:", error);
    throw error;
  }
};

export const deleteNews = async (postId) => {
  // Get current user ID from localStorage
  const currentUser = localStorage.getItem("currentUser");
  let userId = null;
  if (currentUser) {
    try {
      const userData = JSON.parse(currentUser);
      userId = userData.id || userData.userId || userData.userID;
    } catch (error) {
      console.error("Error parsing currentUser:", error);
    }
  }

  // Send userId as query parameter
  const url = userId
    ? `${API_BASE}/${postId}?userId=${userId}`
    : `${API_BASE}/${postId}`;

  try {
    const res = await axios.delete(url, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};
