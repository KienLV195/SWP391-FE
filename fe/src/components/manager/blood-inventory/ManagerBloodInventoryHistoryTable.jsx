import { Table } from "antd";

const columns = [
  {
    title: "Thời gian",
    dataIndex: "performedAt",
    key: "performedAt",
    render: (val) => new Date(val).toLocaleString("vi-VN"),
  },
  {
    title: "Nhóm máu",
    dataIndex: "bloodGroup",
    key: "bloodGroup",
    render: (text, record) =>
      `${record.bloodGroup}${record.rhType === "Rh+" ? "+" : "-"}`,
  },
  {
    title: "Loại thành phần",
    dataIndex: "componentType",
    key: "componentType",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Lý do",
    dataIndex: "reason",
    key: "reason",
  },
  {
    title: "Ghi chú",
    dataIndex: "notes",
    key: "notes",
  },
  {
    title: "Người thực hiện",
    key: "performedBy",
    render: (text, record) =>
      record.performedBy?.name || record.performedBy?.userId || "-",
  },
  {
    title: "Loại hoạt động",
    dataIndex: "actionType",
    key: "actionType",
    render: (val) =>
      val === "IN" || val === "CheckIn" ? "Nhập kho" : "Xuất kho",
  },
];

export default function ManagerBloodInventoryHistoryTable({ data, loading }) {
  return (
    <Table
      rowKey={(r) => r.id || r._id || r.historyId || Math.random()}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
}
