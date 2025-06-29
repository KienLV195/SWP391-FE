// Utility functions for News data handling
// Handle inconsistent field names in News API responses

// Utility để lấy ID chính xác của tin tức
export const getNewsId = (newsItem) => {
  if (!newsItem) return null;

  // Thử các trường ID khác nhau theo thứ tự ưu tiên
  return newsItem.postId || newsItem.id || newsItem.newsId || newsItem.newsID;
};

// Utility để lấy userId chính xác của tin tức
export const getNewsUserId = (newsItem) => {
  if (!newsItem) return null;

  // Thử các trường userId khác nhau theo thứ tự ưu tiên
  return (
    newsItem.userId ||
    newsItem.userID ||
    newsItem.authorId ||
    newsItem.createdBy
  );
};

// Utility để tìm tin tức theo ID
export const findNewsById = (newsArray, targetId) => {
  if (!Array.isArray(newsArray) || !targetId) return null;

  return newsArray.find((news) => {
    const newsId = getNewsId(news);
    return newsId === targetId || String(newsId) === String(targetId);
  });
};
