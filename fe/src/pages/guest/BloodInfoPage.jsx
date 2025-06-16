import React, { useEffect, useState, useMemo } from "react";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import { Input, Select, Space, Typography, Spin, Alert } from "antd";
import { FaSearch, FaFilter } from "react-icons/fa";
import { fetchBloodArticles } from "../../services/bloodArticleService";
import ArticleGroup from "../../components/common/ArticleGroup";
import "../../styles/pages/BloodInfoPage.scss";

const { Option } = Select;
const { Title, Paragraph } = Typography;

const TAG_GROUPS = [
  {
    key: "Nhóm Máu",
    label: "Nhóm Máu",
  },
  {
    key: "Hiến Máu",
    label: "Hiến Máu",
  },
  {
    key: "Truyền máu",
    label: "Truyền máu",
  },
];

const BloodInfoPage = ({ CustomNavbar, hideNavbar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchBloodArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải danh sách bài viết. Vui lòng thử lại sau.");
        console.error("Error loading articles:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Filter articles based on search term and selected tag
  const filteredArticles = useMemo(() => {
    if (!searchTerm.trim()) {
      return articles.filter((article) =>
        selectedTag === "all"
          ? true
          : Array.isArray(article.tags) && article.tags.includes(selectedTag)
      );
    }
    const lowerKeyword = searchTerm.toLowerCase();
    return articles.filter((article) => {
      const inTitle = article.title?.toLowerCase().includes(lowerKeyword);
      const inSummary = article.summary?.toLowerCase().includes(lowerKeyword);
      const inContent = article.content?.toLowerCase().includes(lowerKeyword);
      const inTags = Array.isArray(article.tags)
        ? article.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
        : false;
      const matches = inTitle || inSummary || inContent || inTags;
      if (!matches) return false;
      if (selectedTag === "all") return true;
      return Array.isArray(article.tags) && article.tags.includes(selectedTag);
    });
  }, [articles, searchTerm, selectedTag]);

  // Group articles by main tags
  const groupedArticles = useMemo(() => {
    const result = {};
    TAG_GROUPS.forEach((group) => {
      result[group.key] = filteredArticles.filter(
        (article) =>
          Array.isArray(article.tags) && article.tags.includes(group.key)
      );
    });
    return result;
  }, [filteredArticles]);

  // Get short content for article preview, highlight keyword, only show snippet around keyword
  const getShortContent = (content) => {
    if (!content) return "";
    if (!searchTerm.trim())
      return content.length > 120 ? content.slice(0, 120) + "..." : content;
    const lowerContent = content.toLowerCase();
    const lowerKeyword = searchTerm.toLowerCase();
    const idx = lowerContent.indexOf(lowerKeyword);
    if (idx === -1)
      return content.length > 120 ? content.slice(0, 120) + "..." : content;
    const start = Math.max(0, idx - 40);
    const end = Math.min(content.length, idx + lowerKeyword.length + 40);
    let snippet =
      (start > 0 ? "..." : "") +
      content.slice(start, end) +
      (end < content.length ? "..." : "");
    return snippet;
  };

  // Format article data for ArticleGroup component
  const getGroupData = (groupKey) =>
    groupedArticles[groupKey]?.map((article) => ({
      id: article.articleId,
      title: article.title,
      summary: article.summary,
      imgUrl: article.imgUrl || article.image,
      shortContent: getShortContent(article.content),
      tags: article.tags,
    })) || [];

  if (loading) {
    return (
      <div className="guest-home-page">
        <div className="loading-container">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guest-home-page">
        <div className="error-container">
          <Alert message="Error" description={error} type="error" showIcon />
        </div>
      </div>
    );
  }

  return (
    <>
      {!hideNavbar && (CustomNavbar ? <CustomNavbar /> : <GuestNavbar />)}
      <div className="guest-home-page">
        <section className="content-section">
          <div className="page-header">
            <div className="header-content">
              <h1>TÀI LIỆU HIẾN MÁU</h1>
              <p>
                Khám phá kho tài liệu phong phú về hiến máu, từ kiến thức cơ bản
                đến hướng dẫn chuyên sâu
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="controls-section">
            <div className="search-controls">
              <Input
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<FaSearch className="search-icon" />}
                size="large"
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <Space>
                <FaFilter className="filter-icon" />
                <Select
                  value={selectedTag}
                  onChange={setSelectedTag}
                  size="large"
                  className="category-select"
                  style={{ minWidth: 220 }}
                >
                  <Option value="all">Tất cả nhóm tài liệu</Option>
                  {TAG_GROUPS.map((group) => (
                    <Option key={group.key} value={group.key}>
                      {group.label}
                    </Option>
                  ))}
                </Select>
              </Space>
            </div>
          </div>

          {/* Article Groups */}
          {selectedTag === "all" ? (
            TAG_GROUPS.map((group) => (
              <ArticleGroup
                key={group.key}
                title={group.label}
                articles={getGroupData(group.key)}
                tagColor={group.color}
                gradient={group.gradient}
                icon={group.icon}
                keyword={searchTerm}
              />
            ))
          ) : (
            <ArticleGroup
              title={TAG_GROUPS.find((g) => g.key === selectedTag)?.label || ""}
              articles={getGroupData(selectedTag)}
              tagColor={TAG_GROUPS.find((g) => g.key === selectedTag)?.color}
              gradient={TAG_GROUPS.find((g) => g.key === selectedTag)?.gradient}
              icon={TAG_GROUPS.find((g) => g.key === selectedTag)?.icon}
              keyword={searchTerm}
            />
          )}

          {/* No Results Message */}
          {TAG_GROUPS.every((g) => getGroupData(g.key).length === 0) && (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <Title level={3}>
                Không tìm thấy kết quả phù hợp với từ khóa: '{searchTerm}'
              </Title>
              <Paragraph>
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </Paragraph>
            </div>
          )}
        </section>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default BloodInfoPage;
