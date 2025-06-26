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

// Định nghĩa lại TAG_GROUPS cho đúng yêu cầu
const TAG_GROUPS = [
  { key: "hien-mau", label: "Hiến máu" },
  { key: "truyen-mau", label: "Truyền máu" },
  { key: "nhom-mau", label: "Nhóm máu" },
];

const BloodInfoPage = ({ CustomNavbar, hideNavbar }) => {
  // Fetch articles
  const {
    data: articles = [],
    loading,
    error,
  } = useRequest(getBloodArticles, []);

  // Search/filter logic
  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}|[\u0300-\u036f]/gu, "")
      .trim();

  const searchFn = (article, keyword) => {
    const keywordNorm = normalize(keyword);
    return (
      normalize(article.title).includes(keywordNorm) ||
      normalize(article.summary).includes(keywordNorm) ||
      normalize(article.content).includes(keywordNorm) ||
      (Array.isArray(article.tags) &&
        article.tags.some((tag) => normalize(tag).includes(keywordNorm)))
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
  } = useSearchAndFilter(articles, { searchFn, filterFn });

  // Nhóm lại bài viết theo yêu cầu mới
  const groupedArticles = React.useMemo(() => {
    const hienMau = filteredArticles.filter(
      (a) =>
        Array.isArray(a.tags) &&
        a.tags.some((tag) => tag.toLowerCase().includes("hiến máu"))
    );
    const truyenMau = filteredArticles.filter(
      (a) =>
        Array.isArray(a.tags) &&
        a.tags.some((tag) => tag.toLowerCase().includes("truyền máu"))
    );
    const nhomMau = filteredArticles.filter(
      (a) =>
        !(
          Array.isArray(a.tags) &&
          (a.tags.some((tag) => tag.toLowerCase().includes("hiến máu")) ||
            a.tags.some((tag) => tag.toLowerCase().includes("truyền máu")))
        )
    );
    return {
      "hien-mau": hienMau,
      "truyen-mau": truyenMau,
      "nhom-mau": nhomMau,
    };
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
          {selectedTag === "all" || !selectedTag ? (
            TAG_GROUPS.map((group) => (
              <ArticleGroup
                key={group.key}
                title={group.label}
                articles={getGroupData(group.key)}
                tagColor={group.color}
                gradient={group.gradient}
                icon={group.icon}
              />
            ))
          ) : (
            <ArticleGroup
              title={TAG_GROUPS.find((g) => g.key === selectedTag)?.label || ""}
              articles={getGroupData(selectedTag)}
              tagColor={TAG_GROUPS.find((g) => g.key === selectedTag)?.color}
              gradient={TAG_GROUPS.find((g) => g.key === selectedTag)?.gradient}
              icon={TAG_GROUPS.find((g) => g.key === selectedTag)?.icon}
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
