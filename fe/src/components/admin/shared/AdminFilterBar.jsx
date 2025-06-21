import React from "react";
import { Input, Select, Row, Col, Button, DatePicker } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AdminFilterBar = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  onAdd,
  addButtonText = "Thêm mới",
  showAddButton = true,
  dateFilter,
  onDateFilterChange,
  showDateFilter = false,
  dateFilterPlaceholder = "Lọc theo ngày",
  style = {},
}) => (
  <Row gutter={16} style={{ marginBottom: 16, ...style }} align="middle">
    <Col xs={24} sm={12} md={8}>
      <Input
        prefix={<SearchOutlined />}
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={onSearchChange}
        allowClear
      />
    </Col>

    {filters.map((filter, index) => (
      <Col xs={12} sm={6} md={4} key={index}>
        <Select
          value={filter.value}
          onChange={filter.onChange}
          style={{ width: "100%" }}
          placeholder={filter.placeholder}
        >
          {filter.options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Col>
    ))}

    {showDateFilter && (
      <Col xs={12} sm={6} md={4}>
        <DatePicker
          placeholder={dateFilterPlaceholder}
          value={dateFilter}
          onChange={onDateFilterChange}
          format="DD/MM/YYYY"
          allowClear
          style={{ width: "100%" }}
        />
      </Col>
    )}

    {showAddButton && (
      <Col flex="auto" style={{ textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
          style={{ minWidth: 140 }}
        >
          {addButtonText}
        </Button>
      </Col>
    )}
  </Row>
);

export default AdminFilterBar;
