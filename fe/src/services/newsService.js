import axios from "axios";
import config from '../config/environment';

const API_BASE = config.api.news;

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
