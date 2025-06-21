import React from "react";
import { Table, Spin } from "antd";

const UserTable = ({ columns, data, loading, pagination, onChangePage }) => (
  <Spin spinning={loading} tip="Đang tải dữ liệu...">
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        ...pagination,
        onChange: onChangePage,
        showSizeChanger: false,
        showTotal: (total) => `Tổng ${total} người dùng`,
      }}
      bordered
      size="middle"
      style={{ background: "#fff" }}
    />
  </Spin>
);

export default UserTable;
