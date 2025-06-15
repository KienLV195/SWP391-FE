// Service for BloodArticles API
const API_URL = 'https://blooddonationswp391-h6b6cvehfca8dpey.canadacentral-01.azurewebsites.net/api/BloodArticles';

export async function fetchBloodArticles() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Lỗi khi lấy danh sách bài viết tài liệu');
  return response.json();
}

export async function updateBloodArticle(articleId, data) {
  // Đổi sang dùng POST đúng API yêu cầu
  const response = await fetch(`${API_URL}/${articleId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Lỗi khi cập nhật bài viết tài liệu');
  return response.json();
}


export async function putBlog(articleId, data) {
  // Đổi sang dùng PUT đúng API yêu cầu mới
  const response = await fetch(`${API_URL}/${articleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Lỗi khi cập nhật bài viết blog');
  return response.json();
}

export async function deleteBloodArticle(articleId) {
  const response = await fetch(`${API_URL}/${articleId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Lỗi khi xóa bài viết tài liệu');
  return response.json();
}

export async function fetchBloodArticleDetail(articleId) {
  const response = await fetch(`${API_URL}/${articleId}`);
  if (!response.ok) throw new Error('Lỗi khi lấy chi tiết bài viết tài liệu');
  return response.json();
}
