import React from "react";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import { Input, Select, Space, Typography, Spin, Alert } from "antd";
import { FaSearch, FaFilter } from "react-icons/fa";
import { getBloodArticles } from "../../services/bloodArticleService";
import ArticleGroup from "../../components/common/ArticleGroup";
import useRequest from "../../hooks/useFetchData";
import useSearchAndFilter from "../../hooks/useSearchAndFilter";
import { getShortContent } from "../../utils/textUtils";
import "../../styles/pages/BloodInfoPage.scss";

const { Option } = Select;
const { Title, Paragraph } = Typography;

const TAG_GROUPS = [
  { key: "Nhóm Máu", label: "Nhóm Máu" },
  { key: "Hiến Máu", label: "Hiến Máu" },
  { key: "Truyền máu", label: "Truyền máu" },
];

const BloodInfoPage = ({ CustomNavbar, hideNavbar }) => {
  // Fetch articles
  const {
    data: articles = [],
    loading,
    error,
  } = useRequest(getBloodArticles, []);

  // Search/filter logic
  const searchFn = (article, keyword) => {
    const lower = keyword.toLowerCase();
    return (
      article.title?.toLowerCase().includes(lower) ||
      article.summary?.toLowerCase().includes(lower) ||
      article.content?.toLowerCase().includes(lower) ||
      (Array.isArray(article.tags) &&
        article.tags.some((tag) => tag.toLowerCase().includes(lower)))
    );
  };
  const filterFn = (article, tag) =>
    tag === "all" ||
    (Array.isArray(article.tags) && article.tags.includes(tag));
  const {
    searchTerm,
    setSearchTerm,
    filter: selectedTag,
    setFilter: setSelectedTag,
    filteredData: filteredArticles,
  } = useSearchAndFilter(articles, searchFn, filterFn);

  // Group articles by main tags
  const groupedArticles = React.useMemo(() => {
    const result = {};
    TAG_GROUPS.forEach((group) => {
      result[group.key] = filteredArticles.filter(
        (article) =>
          Array.isArray(article.tags) && article.tags.includes(group.key)
      );
    });
    return result;
  }, [filteredArticles]);

  // Format article data for ArticleGroup component
  const getGroupData = (groupKey) =>
    groupedArticles[groupKey]?.map((article) => ({
      id: article.articleId,
      title: article.title,
      summary: article.summary,
      imgUrl: article.imgUrl || article.image,
      shortContent: getShortContent(article.content, searchTerm),
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
                  value={selectedTag || "all"}
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
