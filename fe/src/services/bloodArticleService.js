// Service for BloodArticles API
import config from "../config/environment";
import axios from "axios";
const API_URL = config.api.bloodArticles;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function getBloodArticles() {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export async function createArticle(data) {
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
    title: data.title || "",
    content: data.content || "",
    imgUrl: data.imgUrl || "",
    tagIds: tagIds,
    newTags: newTags,
    userId: data.userId,
  };

  try {
    const response = await axios.post(API_URL, requestData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Create article error:", error);
    throw error;
  }
}

export async function updateArticle(articleId, data) {
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
    title: data.title || "",
    content: data.content || "",
    imgUrl: data.imgUrl || "",
    tagIds: tagIds,
    newTags: newTags,
    userId: data.userId,
  };

  try {
    const response = await axios.put(`${API_URL}/${articleId}`, requestData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Update article error:", error);
    throw error;
  }
}

export async function updateBlog(articleId, data) {
  if (articleId === "" || !articleId) {
    return createArticle(data);
  } else {
    return updateArticle(articleId, data);
  }
}

export async function deleteArticle(articleId) {
  const headers = getAuthHeaders();

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

  // Add userId to headers if available
  if (userId) {
    headers["X-User-Id"] = userId;
  }

  try {
    // Send userId as query parameter instead of request body
    const url = userId
      ? `${API_URL}/${articleId}?userId=${userId}`
      : `${API_URL}/${articleId}`;

    const response = await axios.delete(url, {
      headers: headers,
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

export async function getBloodArticleDetail(articleId) {
  const response = await axios.get(`${API_URL}/${articleId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}
