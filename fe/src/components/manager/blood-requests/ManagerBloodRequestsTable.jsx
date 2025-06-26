import { Table } from "antd";

export default function ManagerBloodRequestsTable({ data, columns, ...props }) {
  return (
    <Table columns={columns} dataSource={data} rowKey="requestID" {...props} />
  );
}
