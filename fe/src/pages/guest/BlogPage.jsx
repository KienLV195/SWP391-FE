import React from "react";
import { useNavigate } from "react-router-dom";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";
import {
  Input,
  Row,
  Col,
  Card,
  Carousel,
  Pagination,
  Spin,
  Typography,
} from "antd";
import { FaSearch, FaEye, FaCalendarAlt } from "react-icons/fa";
import useRequest from "../../hooks/useFetchData";
import useSearchAndFilter from "../../hooks/useSearchAndFilter";
import usePagination from "../../hooks/usePagination";
import { fetchAllNews } from "../../services/newsService";
import "../../styles/pages/BlogPage.scss";

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const BlogPage = ({ CustomNavbar, hideNavbar }) => {
  // Fetch news
  const { data: news = [], loading, error } = useRequest(fetchAllNews, []);

  // Search/filter logic
  const searchFn = (item, keyword) => {
    const lower = keyword.toLowerCase();
    return (
      item.title?.toLowerCase().includes(lower) ||
      item.summary?.toLowerCase().includes(lower) ||
      item.content?.toLowerCase().includes(lower) ||
      (Array.isArray(item.tags) &&
        item.tags.some((tag) => {
          // Xử lý cả string và object tags
          const tagText =
            typeof tag === "object" && tag.tagName ? tag.tagName : tag;
          return tagText.toLowerCase().includes(lower);
        }))
    );
  };
  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredNews,
  } = useSearchAndFilter(news, searchFn);

  // Pagination
  const pageSize = 4;
  const {
    currentPage,
    setCurrentPage,
    paginatedData: paginatedPosts,
  } = usePagination(filteredNews, pageSize);

  // Carousel posts
  const carouselPosts = filteredNews.slice(0, Math.min(3, filteredNews.length));

  const navigate = useNavigate();
  const handleKnowMore = (post) => {
    if (post && post.postId) {
      navigate(`/blog/${post.postId}`);
    }
  };

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
                      <Meta title={post.title} description={post.summary} />
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
                                post.postedAt || post.createdAt || post.date
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          </div>

                          <h3 className="document-title">{post.title}</h3>

                          <p className="document-summary">
                            {post.summary || post.content}
                          </p>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="pagination-section">
                <Pagination
                  current={currentPage}
                  total={filteredNews.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <div className="no-results">
              <Title level={3}>Không tìm thấy kết quả phù hợp</Title>
              <Paragraph>Hãy thử thay đổi từ khóa tìm kiếm.</Paragraph>
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
