import { Table } from "antd";

export default function DoctorBloodRequestsTable({ data, columns, ...props }) {
  return (
    <Table columns={columns} dataSource={data} rowKey="requestID" {...props} />
  );
}
