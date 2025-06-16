import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import {
  Input,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Pagination,
  Spin,
  Typography,
} from "antd";
import { FaSearch, FaEye, FaCalendarAlt } from "react-icons/fa";
import Highlighter from "react-highlight-words";
import { fetchAllNews } from "../../services/newsService";
import "../../styles/pages/BlogPage.scss";

// Custom highlight style for BlogPage
const highlightStyle = {
  backgroundColor: "#ffe58f",
  fontWeight: "normal", // Không in đậm chữ
  padding: 0,
};

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const BlogPage = ({ CustomNavbar, hideNavbar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchAllNews();
        setNews(Array.isArray(data) ? data : []);
        setError(null);
      } catch {
        setError("Không thể tải danh sách tin tức. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  const filteredNews = useMemo(() => {
    const lowerKeyword = searchTerm.toLowerCase();
    return news
      .filter(
        (item) =>
          item.title?.toLowerCase().includes(lowerKeyword) ||
          item.summary?.toLowerCase().includes(lowerKeyword) ||
          item.content?.toLowerCase().includes(lowerKeyword)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );
  }, [news, searchTerm]);

  const carouselPosts = filteredNews.slice(0, Math.min(3, filteredNews.length));
  const paginatedPosts = filteredNews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleKnowMore = (post) => {
    if (post && post.postId) {
      navigate(`/blog/${post.postId}`);
    }
  };

  function getHighlightedSnippet(content, keyword) {
    if (!content) return "";
    if (!keyword?.trim())
      return content.length > 120 ? content.slice(0, 120) + "..." : content;
    const lowerContent = content.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
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
  }

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
          <Paragraph>{error}</Paragraph>
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
              <h1>TIN TỨC HIẾN MÁU</h1>
              <p>
                Đây là trang tin tức nội dung tin tức, bài viết, hoặc các thông
                tin liên quan đến hiến máu tại đây.
              </p>
            </div>
          </div>

          {/* Carousel Section */}
          {carouselPosts.length > 0 && (
            <div className="carousel-section">
              <Carousel autoplay>
                {carouselPosts.map((post) => (
                  <div key={post.postId} className="carousel-item">
                    <Card
                      hoverable
                      cover={
                        <img alt={post.title} src={post.image || post.imgUrl} />
                      }
                      className="carousel-card"
                      onClick={() => handleKnowMore(post)}
                    >
                      <Meta
                        title={
                          <Highlighter
                            highlightClassName="highlight-text"
                            searchWords={[searchTerm]}
                            autoEscape={true}
                            textToHighlight={post.title}
                            highlightStyle={highlightStyle}
                          />
                        }
                        description={
                          <Highlighter
                            highlightClassName="highlight-text"
                            searchWords={[searchTerm]}
                            autoEscape={true}
                            textToHighlight={post.summary}
                          />
                        }
                      />
                      <div className="carousel-meta">
                        <div className="views-badge">
                          <FaEye /> {post.views?.toLocaleString?.() || 0}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          {/* Search */}
          <div className="controls-section">
            <div className="search-controls">
              <Input
                placeholder="Tìm kiếm tin tức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<FaSearch className="search-icon" />}
                size="large"
                className="search-input"
              />
            </div>
          </div>

          {/* Blog Posts List */}
          {paginatedPosts.length > 0 ? (
            <>
              <div className="category-section">
                <Row gutter={[24, 24]} className="document-grid">
                  {paginatedPosts.map((post) => (
                    <Col xs={24} sm={12} lg={12} key={post.postId}>
                      <Card
                        hoverable
                        cover={
                          <div className="card-cover">
                            <img
                              alt={post.title}
                              src={post.image || post.imgUrl}
                            />
                            <div className="card-overlay">
                              <div className="views-badge">
                                <FaEye /> {post.views?.toLocaleString?.() || 0}
                              </div>
                            </div>
                          </div>
                        }
                        className="document-card"
                        onClick={() => handleKnowMore(post)}
                      >
                        <div className="card-content">
                          <div className="card-meta">
                            <div className="date-tag">
                              <FaCalendarAlt />{" "}
                              {new Date(
                                post.createdAt || post.date
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          </div>

                          <h3 className="document-title">
                            <Highlighter
                              highlightClassName="highlight-text"
                              searchWords={[searchTerm]}
                              autoEscape={true}
                              textToHighlight={post.title}
                              highlightStyle={highlightStyle}
                            />
                          </h3>

                          <p className="document-summary">
                            <Highlighter
                              highlightClassName="highlight-text"
                              searchWords={[searchTerm]}
                              autoEscape={true}
                              textToHighlight={getHighlightedSnippet(
                                post.content || post.summary || "",
                                searchTerm
                              )}
                              highlightStyle={highlightStyle}
                            />
                          </p>

                          <Button
                            type="primary"
                            className="read-more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleKnowMore(post);
                            }}
                          >
                            Đọc ngay
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="pagination-bar">
                <div className="pagination-total">
                  {`Tổng số ${filteredNews.length} bài viết`}
                </div>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredNews.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  itemRender={(page, type, originalElement) => {
                    const totalPages = Math.ceil(
                      filteredNews.length / pageSize
                    );
                    if (type === "page") {
                      if (page <= 3 || page === totalPages)
                        return originalElement;
                      if (page === 4 && totalPages > 4)
                        return <span key="ellipsis">...</span>;
                      return null;
                    }
                    return originalElement;
                  }}
                />
              </div>
            </>
          ) : (
            <div className="no-news">
              <div
                className="no-results-icon"
                style={{ fontSize: 64, marginBottom: 12 }}
              ></div>
              <div className="no-results">
                <div className="no-results-icon">📚</div>
                <Title level={3}>
                  Không tìm thấy kết quả phù hợp với từ khóa: '{searchTerm}'
                </Title>
                <Paragraph>
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </Paragraph>
              </div>
            </div>
          )}
        </section>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
};

export default BlogPage;
