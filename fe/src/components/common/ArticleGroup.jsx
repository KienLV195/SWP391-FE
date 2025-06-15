import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ArticleGroup = ({ title, articles }) => {
  if (!articles || articles.length === 0) return null;
  return (
    <div className="article-group">
      <h2 className="article-group-title">{title}</h2>
      <div className="article-group-list">
        {articles.map((article) => (
          <div className="article-card" key={article.id}>
            <img
              src={article.imgUrl}
              alt={article.title}
              className="article-card-img"
            />
            <div className="article-card-content">
              <h3 className="article-card-title">{article.title}</h3>
              <p className="article-card-desc">{article.shortContent}</p>
              <Link
                to={`/articles/${article.id}`}
                className="article-card-detail-btn"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ArticleGroup.propTypes = {
  title: PropTypes.string.isRequired,
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      imgUrl: PropTypes.string,
      shortContent: PropTypes.string,
    })
  ),
};

export default ArticleGroup;
