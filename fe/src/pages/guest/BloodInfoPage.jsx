import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import { Input, Select, Space } from "antd";
import { FaSearch, FaFilter } from "react-icons/fa";
import { fetchBloodArticles } from "../../services/bloodArticleService";
import ArticleGroup from "../../components/common/ArticleGroup";
import "../../styles/pages/BlogPage.scss";

const { Option } = Select;

const TAG_GROUPS = [
  { key: "Nhóm Máu", label: "Tài liệu về Nhóm Máu" },
  { key: "Hiến Máu", label: "Tài liệu về Hiến Máu" },
  { key: "Truyền máu", label: "Tài liệu về Truyền Máu" },
];

const BloodInfoPage = ({ CustomNavbar, hideNavbar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBloodArticles()
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]));
  }, []);

  // Lọc bài viết theo search và tag
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase());
      if (selectedTag === "all") return matchesSearch;
      return (
        matchesSearch &&
        Array.isArray(article.tags) &&
        article.tags.includes(selectedTag)
      );
    });
  }, [articles, searchTerm, selectedTag]);

  // Nhóm bài viết theo tag chính
  const groupedArticles = useMemo(() => {
    const result = {};
    TAG_GROUPS.forEach((group) => {
      result[group.key] = filteredArticles.filter(
        (a) => Array.isArray(a.tags) && a.tags.includes(group.key)
      );
    });
    return result;
  }, [filteredArticles]);

  // Rút gọn nội dung
  const getShortContent = (content) => {
    if (!content) return "";
    return content.length > 120 ? content.slice(0, 120) + "..." : content;
  };

  // Chuẩn hóa dữ liệu cho ArticleGroup
  const getGroupData = (groupKey) =>
    groupedArticles[groupKey]?.map((a) => ({
      id: a.id,
      title: a.title,
      imgUrl: a.imgUrl || a.image,
      shortContent: getShortContent(a.content),
    })) || [];

  return (
    <>
      {!hideNavbar && (CustomNavbar ? <CustomNavbar /> : <GuestNavbar />)}
      <div className="guest-home-page">
        <section className="content-section">
          <div className="page-header">
            <h1 className="page-title merriweather-title">TÀI LIỆU HIẾN MÁU</h1>
            <p className="page-description merriweather-content">
              Khám phá kho tài liệu phong phú về hiến máu, từ kiến thức cơ bản
              đến hướng dẫn chuyên sâu
            </p>
          </div>

          {/* Controls */}
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
              />
            ))
          ) : (
            <ArticleGroup
              title={TAG_GROUPS.find((g) => g.key === selectedTag)?.label || ""}
              articles={getGroupData(selectedTag)}
            />
          )}

          {TAG_GROUPS.every((g) => getGroupData(g.key).length === 0) && (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3>Không tìm thấy tài liệu nào</h3>
              <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
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
