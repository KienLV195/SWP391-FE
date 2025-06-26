import React from "react";
import { Table, Spin } from "antd";

const AdminTable = ({
  columns,
  data,
  loading,
  rowKey = "id",
  pagination = { pageSize: 8, showSizeChanger: false },
  bordered = true,
  size = "large",
  style = {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 8px #f0f1f2",
  },
  scroll = { x: 1000 },
  ...props
}) => (
  <Spin spinning={loading} tip="Đang tải dữ liệu...">
    <Table
      columns={columns}
      dataSource={data}
      rowKey={rowKey}
      pagination={pagination}
      bordered={bordered}
      size={size}
      style={style}
      scroll={scroll}
      {...props}
    />
  </Spin>
);

export default AdminTable;
