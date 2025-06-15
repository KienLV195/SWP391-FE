import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  Space,
  message,
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "../../../styles/pages/admin/AdminReports.module.scss";

const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
  "#4ECDC4",
];

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportType, setReportType] = useState("all");
  const [bloodGroupData, setBloodGroupData] = useState([]);
  const [monthlyRequestsData, setMonthlyRequestsData] = useState([]);
  const [bloodUsageData, setBloodUsageData] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      const [startDate, endDate] = dateRange;
      const params = new URLSearchParams({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        type: reportType,
      });

      // Fetch blood group distribution
      const bloodGroupResponse = await fetch(
        `/api/reports/blood-groups?${params}`
      );
      const bloodGroupData = await bloodGroupResponse.json();
      setBloodGroupData(bloodGroupData);

      // Fetch monthly requests
      const monthlyRequestsResponse = await fetch(
        `/api/reports/monthly-requests?${params}`
      );
      const monthlyRequestsData = await monthlyRequestsResponse.json();
      setMonthlyRequestsData(monthlyRequestsData);

      // Fetch blood usage
      const bloodUsageResponse = await fetch(
        `/api/reports/blood-usage?${params}`
      );
      const bloodUsageData = await bloodUsageResponse.json();
      setBloodUsageData(bloodUsageData);
    } catch (error) {
      message.error("Không thể tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const [startDate, endDate] = dateRange;
      const params = new URLSearchParams({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        type: reportType,
        format,
      });

      // TODO: Replace with actual API call
      const response = await fetch(`/api/reports/export?${params}`);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `blood-donation-report-${new Date().toISOString()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(`Xuất báo cáo ${format.toUpperCase()} thành công`);
    } catch (error) {
      message.error("Không thể xuất báo cáo");
    }
  };

  return (
    <div className={styles.adminReports}>
      <div className={styles.header}>
        <h1>Báo cáo thống kê</h1>
        <Space>
          <RangePicker
            onChange={setDateRange}
            allowClear
            style={{ width: 300 }}
          />
          <Select
            value={reportType}
            onChange={setReportType}
            style={{ width: 200 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="blood-groups">Nhóm máu</Option>
            <Option value="requests">Yêu cầu máu</Option>
            <Option value="usage">Sử dụng máu</Option>
          </Select>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => handleExport("xlsx")}
          >
            Excel
          </Button>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => handleExport("pdf")}
          >
            PDF
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Blood Group Distribution Chart */}
        <Col xs={24} lg={12}>
          <Card
            title="Tỷ lệ nhóm máu trong kho"
            loading={loading}
            className={styles.chartCard}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodGroupData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Monthly Requests Chart */}
        <Col xs={24} lg={12}>
          <Card
            title="Yêu cầu máu theo tháng"
            loading={loading}
            className={styles.chartCard}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRequestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" name="Số yêu cầu" fill="#8884d8" />
                <Bar dataKey="fulfilled" name="Đã đáp ứng" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Blood Usage Chart */}
        <Col xs={24}>
          <Card
            title="Sử dụng máu theo thời gian"
            loading={loading}
            className={styles.chartCard}
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={bloodUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {bloodGroupData.map((group, index) => (
                  <Line
                    key={group.name}
                    type="monotone"
                    dataKey={group.name}
                    stroke={COLORS[index % COLORS.length]}
                    name={`Nhóm ${group.name}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminReports;
