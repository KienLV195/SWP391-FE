export function getShortContent(content, keyword = "", maxLength = 120) {
  if (!content) return "";
  if (!keyword.trim())
    return content.length > maxLength
      ? content.slice(0, maxLength) + "..."
      : content;
  const lowerContent = content.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const idx = lowerContent.indexOf(lowerKeyword);
  if (idx === -1)
    return content.length > maxLength
      ? content.slice(0, maxLength) + "..."
      : content;
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + lowerKeyword.length + 40);
  let snippet =
    (start > 0 ? "..." : "") +
    content.slice(start, end) +
    (end < content.length ? "..." : "");
  return snippet;
}

export function getHighlightedSnippet(content, keyword, maxLength = 120) {
  // Có thể dùng cho highlight UI, trả về đoạn text chứa keyword
  return getShortContent(content, keyword, maxLength);
}
