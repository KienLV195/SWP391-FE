import { Table } from "antd";

function getUniqueValues(data, key, customFn) {
  const set = new Set();
  data.forEach((item) => {
    let value = customFn ? customFn(item) : item[key];
    if (value !== undefined && value !== null && value !== "") set.add(value);
  });
  return Array.from(set).map((v) => ({ text: v, value: v }));
}

export default function ManagerBloodInventoryHistoryTable({ data, loading }) {
  const bloodTypeFilters = getUniqueValues(
    data,
    null,
    (item) => `${item.bloodGroup}${item.rhType === "Rh+" ? "+" : "-"}`
  );
  const componentTypeFilters = getUniqueValues(data, "componentType");
  const quantityFilters = getUniqueValues(data, "quantity");
  const bagTypeFilters = getUniqueValues(data, "bagType");
  const expirationDateFilters = getUniqueValues(data, null, (item) =>
    item.expirationDate
      ? new Date(item.expirationDate).toLocaleDateString("vi-VN")
      : ""
  );
  const notesFilters = getUniqueValues(data, "notes");
  const performerFilters = getUniqueValues(data, "performedByName");
  const actionTypeFilters = getUniqueValues(data, "actionType");

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "performedAt",
      key: "performedAt",
      render: (val) => (val ? new Date(val).toLocaleString("vi-VN") : ""),
    },
    {
      title: "Nhóm máu",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      width: 120,
      align: "center",
      filters: bloodTypeFilters,
      onFilter: (value, record) =>
        `${record.bloodGroup}${record.rhType === "Rh+" ? "+" : "-"}` === value,
      render: (text, record) => {
        const bloodType = `${record.bloodGroup}${
          record.rhType === "Rh+" ? "+" : "-"
        }`;
        const isPositive = record.rhType === "Rh+";
        return (
          <span
            className={`blood-type-badge ${
              isPositive ? "positive" : "negative"
            }`}
          >
            {bloodType}
          </span>
        );
      },
    },
    {
      title: "Thành phần",
      dataIndex: "componentType",
      key: "componentType",
      filters: componentTypeFilters,
      onFilter: (value, record) => record.componentType === value,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      filters: quantityFilters,
      onFilter: (value, record) => record.quantity === value,
    },
    {
      title: "Loại túi",
      dataIndex: "bagType",
      key: "bagType",
      filters: bagTypeFilters,
      onFilter: (value, record) => record.bagType === value,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      filters: expirationDateFilters,
      onFilter: (value, record) =>
        (record.expirationDate
          ? new Date(record.expirationDate).toLocaleDateString("vi-VN")
          : "") === value,
      render: (val) => (val ? new Date(val).toLocaleDateString("vi-VN") : ""),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      filters: notesFilters,
      onFilter: (value, record) => record.notes === value,
    },
    {
      title: "Người thực hiện",
      dataIndex: "performedByName",
      key: "performedByName",
      filters: performerFilters,
      onFilter: (value, record) => record.performedByName === value,
    },
    {
      title: "Loại hoạt động",
      dataIndex: "actionType",
      key: "actionType",
      filters: actionTypeFilters,
      onFilter: (value, record) => record.actionType === value,
      render: (actionType) => {
        if (actionType === "CheckOut") return "Xuất kho";
        if (actionType === "CheckIn") return "Nhập kho";
        return actionType || "";
      },
    },
  ];

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
