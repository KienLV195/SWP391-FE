import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBloodArticleDetail } from "../../services/bloodArticleService";
import { Card, Spin, Tag } from "antd";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBloodArticleDetail(id)
      .then((data) => setArticle(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Spin
        tip="Đang tải bài viết..."
        style={{ width: "100%", marginTop: 40 }}
      />
    );
  if (!article) return <div>Bài viết không tồn tại hoặc đã bị xóa.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "32px auto" }}>
      <Card
        title={
          <span style={{ fontSize: 24, fontWeight: 600 }}>{article.title}</span>
        }
        cover={
          article.imgUrl && (
            <img
              alt={article.title}
              src={article.imgUrl}
              style={{ maxHeight: 320, objectFit: "cover" }}
            />
          )
        }
      >
        <div style={{ marginBottom: 12 }}>
          <b>Người viết:</b>{" "}
          {article.userName || article.authorName || article.author || "-"}
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Tags:</b>{" "}
          {article.tags && Array.isArray(article.tags)
            ? article.tags.map((tag, idx) => <Tag key={idx}>{tag}</Tag>)
            : "-"}
        </div>
        <div style={{ marginBottom: 12 }}>
          <b>Nội dung:</b>
          <div
            style={{
              background: "#fafafa",
              padding: 16,
              borderRadius: 8,
              marginTop: 4,
            }}
          >
            {article.content || (
              <span style={{ color: "#aaa" }}>Không có nội dung</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArticleDetailPage;
