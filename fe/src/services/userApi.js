import config from "../config/environment";
import axios from "axios";

// API service for fetching user data from external API
const API_URL = config.api.information;

export async function getUsers() {
  const response = await axios.get(API_URL);
  return response.data;
}

// Force reload user list, tránh cache bằng cách thêm query string random
export async function getUsersForce() {
  const url = `${API_URL}?_=${Date.now()}`;
  const response = await axios.get(url);
  return response.data;
}

// API service for posting (creating) a new user
export async function createUser(userData) {
  const response = await axios.post(API_URL, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

// API service for deleting a user by userID
export async function deleteUser(userID) {
  const response = await axios.delete(`${API_URL}/${userID}`);
  return response.data;
}

// API service for updating (editing) a user by userID
export async function updateUser(userID, userData) {
  const response = await axios.put(`${API_URL}/${userID}`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
