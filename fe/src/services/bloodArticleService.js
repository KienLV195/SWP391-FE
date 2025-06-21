// Service for BloodArticles API
import config from "../config/environment";
import axios from "axios";
const API_URL = config.api.bloodArticles;

export async function getBloodArticles() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function updateArticle(articleId, data) {
  // Đổi sang dùng POST đúng API yêu cầu
  const response = await axios.post(`${API_URL}/${articleId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function updateBlog(articleId, data) {
  // Đổi sang dùng PUT đúng API yêu cầu mới
  const response = await axios.put(`${API_URL}/${articleId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function deleteArticle(articleId) {
  const response = await axios.delete(`${API_URL}/${articleId}`);
  return response.data;
}

export async function getBloodArticleDetail(articleId) {
  const response = await axios.get(`${API_URL}/${articleId}`);
  return response.data;
}
