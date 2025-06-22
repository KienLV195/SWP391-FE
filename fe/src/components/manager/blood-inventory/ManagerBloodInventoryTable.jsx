import { Table } from "antd";

export default function ManagerBloodInventoryTable({
  data,
  columns,
  ...props
}) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="inventoryId"
      {...props}
    />
  );
}
