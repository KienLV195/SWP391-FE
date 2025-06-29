import React from "react";
import { Tag } from "antd";
import { FaTag } from "react-icons/fa";

const ArticleTags = ({ tags }) => (
  <span>
    {tags &&
      tags.map((tag, index) => {
        // Xử lý cả string và object tags
        const tagText =
          typeof tag === "object" && tag.tagName ? tag.tagName : tag;
        const tagKey =
          typeof tag === "object" && tag.tagId ? tag.tagId : tag || index;

        return (
          <Tag key={tagKey} color="blue">
            <FaTag
              style={{
                opacity: 0.7,
                marginRight: 4,
                fontSize: 13,
                verticalAlign: "-2px",
              }}
            />
            {tagText}
          </Tag>
        );
      })}
  </span>
);

export default ArticleTags;
