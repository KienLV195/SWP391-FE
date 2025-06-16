import axios from "axios";

const API_BASE = "https://blooddonationswp391-h6b6cvehfca8dpey.canadacentral-01.azurewebsites.net/api/News";

export const fetchAllNews = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const fetchNewsById = async (postId) => {
  const res = await axios.get(`${API_BASE}/${postId}`);
  return res.data;
};

export const createNews = async (data) => {
  const res = await axios.post(API_BASE, data);
  return res.data;
};

export const updateNews = async (postId, data) => {
  const res = await axios.put(`${API_BASE}/${postId}`, data);
  return res.data;
};

export const deleteNews = async (postId) => {
  const res = await axios.delete(`${API_BASE}/${postId}`);
  return res.data;
};
