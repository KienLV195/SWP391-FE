import React from "react";
import { Input, DatePicker, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const BlogFilterBar = ({
  searchTerm,
  onSearchChange,
  activeTab,
  dateFilter,
  onDateFilterChange,
  onClearDateFilter,
}) => (
  <div style={{ marginBottom: 16 }}>
    <Input
      placeholder="Tìm kiếm bài viết..."
      value={searchTerm}
      onChange={onSearchChange}
      style={{ width: 300, marginBottom: 8 }}
      prefix={<SearchOutlined />}
    />
    {activeTab === "Tin tức" && (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <DatePicker
          placeholder="Lọc theo ngày đăng"
          value={dateFilter}
          onChange={onDateFilterChange}
          format="DD/MM/YYYY"
          allowClear
          style={{ width: 200 }}
        />
        {dateFilter && (
          <Button size="small" onClick={onClearDateFilter}>
            Xóa lọc ngày
          </Button>
        )}
      </div>
    )}
  </div>
);

export default BlogFilterBar;
