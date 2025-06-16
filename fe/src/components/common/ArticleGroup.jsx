import React from "react";
import { Typography, Card, Tag, Pagination } from "antd";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";

const { Title, Paragraph } = Typography;

const ArticleGroup = ({ title, articles = [], gradient, keyword = "" }) => {
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
                    <Highlighter
                      highlightClassName="highlight-text"
                      searchWords={keyword ? [keyword] : []}
                      autoEscape={true}
                      textToHighlight={article.title || ""}
                      caseSensitive={false}
                    />
                  </Title>
                  {article.summary && (
                    <Paragraph className="article-summary">
                      <Highlighter
                        highlightClassName="highlight-text"
                        searchWords={keyword ? [keyword] : []}
                        autoEscape={true}
                        textToHighlight={article.summary}
                        caseSensitive={false}
                      />
                    </Paragraph>
                  )}
                  <Paragraph className="article-description">
                    <Highlighter
                      highlightClassName="highlight-text"
                      searchWords={keyword ? [keyword] : []}
                      autoEscape={true}
                      textToHighlight={
                        article.shortContent || article.description || ""
                      }
                      caseSensitive={false}
                    />
                  </Paragraph>
                  <div className="article-tags">
                    {article.tags &&
                      article.tags.map((tag) => (
                        <Tag key={tag}>
                          <Highlighter
                            highlightClassName="highlight-text"
                            searchWords={keyword ? [keyword] : []}
                            autoEscape={true}
                            textToHighlight={tag}
                            caseSensitive={false}
                          />
                        </Tag>
                      ))}
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
