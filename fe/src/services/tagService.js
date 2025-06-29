// Service for Tags API
import config from "../config/environment";
import axios from "axios";
const API_URL = config.api.bloodArticles;
const NEWS_API_URL = config.api.news;

// Lấy tất cả tags từ các bài viết
export async function getAllTags() {
  try {
    const response = await axios.get(API_URL);
    const articles = response.data;

    // Map tagName -> tagId (giả sử mỗi article có tags: [{tagId, tagName}] hoặc tags: [string] và có articleTags)
    const tagMap = new Map();
    articles.forEach((article) => {
      if (article.tags && Array.isArray(article.tags)) {
        // Nếu tags là array object {tagId, tagName}
        article.tags.forEach((tag) => {
          if (typeof tag === "object" && tag.tagId && tag.tagName) {
            tagMap.set(tag.tagId, tag.tagName);
          } else if (typeof tag === "string") {
            // Nếu chỉ là string, tạm thời bỏ qua
          }
        });
      }
    });
    // Trả về mảng [{tagId, tagName}]
    return Array.from(tagMap.entries()).map(([tagId, tagName]) => ({
      tagId,
      tagName,
    }));
  } catch (error) {
    console.error("Error fetching tags:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
}

// Lấy tags từ News API
export async function getNewsTags() {
  try {
    const response = await axios.get(NEWS_API_URL);
    const news = response.data;

    // Map tagName -> tagId từ news articles
    const tagMap = new Map();
    news.forEach((article) => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag) => {
          if (typeof tag === "object" && tag.tagId && tag.tagName) {
            tagMap.set(tag.tagId, tag.tagName);
          }
        });
      }
    });

    const result = Array.from(tagMap.entries()).map(([tagId, tagName]) => ({
      tagId,
      tagName,
    }));

    // Nếu không có tags từ News API, thử lấy từ Blood Articles API
    if (result.length === 0) {
      return await getAllTags();
    }

    return result;
  } catch (error) {
    console.error("Error fetching news tags:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Fallback: lấy tags từ Blood Articles API
    try {
      return await getAllTags();
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw error;
    }
  }
}

// Lấy tags từ một bài viết cụ thể
export async function getTagsFromArticle(articleId) {
  try {
    const response = await axios.get(`${API_URL}/${articleId}`);
    const article = response.data;
    return article.tags || [];
  } catch (error) {
    console.error("Error fetching article tags:", error);
    throw error;
  }
}

// Chuyển đổi tag names thành tag IDs (nếu cần)
export function convertTagNamesToIds(tagNames) {
  // Nếu API yêu cầu tag IDs, chúng ta cần mapping
  // Hiện tại giả sử API chấp nhận tag names
  return tagNames;
}

// Tạo tag mới (nếu cần)
export async function createTag(tagName) {
  try {
    // Ghi chú: API này có thể không tồn tại, tags thường được tạo thông qua bài viết
    const response = await axios.post(`${API_URL}/tags`, { tagName });
    return response.data;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
}

// Tạo tags mới thông qua API riêng
export async function createTags(tagNames) {
  try {
    // Thử tạo tags mới thông qua API riêng
    const response = await axios.post(`${API_URL}/tags/bulk`, {
      tagNames: Array.isArray(tagNames) ? tagNames : [tagNames],
    });

    return response.data;
  } catch (error) {
    console.error("Error creating tags:", error);
    return null;
  }
}
