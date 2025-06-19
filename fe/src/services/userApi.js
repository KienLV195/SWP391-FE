import config from '../config/environment';

// API service for fetching user data from external API
const API_URL = config.api.information;

export async function fetchUsersFromApi() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu người dùng');
  return response.json();
}

// Force reload user list, tránh cache bằng cách thêm query string random
export async function fetchUsersFromApiForce() {
  const url = `${API_URL}?_=${Date.now()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu người dùng');
  return response.json();
}

// API service for posting (creating) a new user
export async function postUserToApi(userData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Lỗi khi thêm người dùng');
  return response.json();
}

// API service for deleting a user by userID
export async function deleteUserFromApi(userID) {
  const response = await fetch(`${API_URL}/${userID}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Lỗi khi xóa người dùng');
  return response.json();
}

// API service for updating (editing) a user by userID
export async function updateUserToApi(userID, userData) {
  
  const response = await fetch(
    `${API_URL}/${userID}`,
    {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }
  );
  if (!response.ok) throw new Error('Lỗi khi cập nhật người dùng');
//   return response.json();
}
