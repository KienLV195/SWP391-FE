import React from "react";
import { Typography, Card, Tag, Pagination } from "antd";
import { Link } from "react-router-dom";
import { FaTag } from "react-icons/fa";
import ArticleTags from "./ArticleTags";

const { Title, Paragraph } = Typography;

const ArticleGroup = ({ title, articles = [], gradient }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentArticles = articles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(articles.length / pageSize);

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="article-group" style={{ "--header-gradient": gradient }}>
      <div className="group-header">
        <div className="group-header-content">
          <Title level={3} className="group-title">
            {title}
          </Title>
          <div className="group-count">{articles.length} bài viết</div>
        </div>
      </div>

      <div className="article-grid">
        <div className="article-list">
          {currentArticles.map((article) => (
            <Card
              key={article.id}
              className="article-card fade-in"
              hoverable
              cover={
                <div className="article-image-container">
                  <img
                    alt={article.title}
                    src={
                      article.imgUrl ||
                      article.imageUrl ||
                      "https://via.placeholder.com/400x200?text=Blood+Donation"
                    }
                  />
                </div>
              }
            >
              <Link to={`/blood-info/${article.id}`}>
                <div className="article-content">
                  <Title level={4} className="article-title">
                    {article.title || ""}
                  </Title>
                  {article.summary && (
                    <Paragraph className="article-summary">
                      {article.summary}
                    </Paragraph>
                  )}
                  <Paragraph className="article-description">
                    {article.shortContent || article.description || ""}
                  </Paragraph>
                  <div className="article-tags">
                    <ArticleTags tags={article.tags} />
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={articles.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              className="article-pagination"
              showTotal={(total) => `Tổng số ${total} bài viết`}
              itemRender={(page, type, originalElement) => {
                if (type === "page") {
                  if (page <= 3 || page === totalPages) return originalElement;
                  if (page === 4 && totalPages > 4)
                    return <span key="ellipsis">...</span>;
                  return null;
                }
                return originalElement;
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleGroup;
