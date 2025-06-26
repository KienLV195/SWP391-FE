import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../../styles/components/manager/ChartsSection.scss";

const ChartsSection = ({ bloodGroupData, monthlyRequestsData }) => {
  // Colors for blood group chart
  const BLOOD_GROUP_COLORS = {
    "A+": "#D93E4C",
    "A-": "#20374E",
    "B+": "#DECCAA",
    "B-": "#D91022",
    "AB+": "#4caf50",
    "AB-": "#ff9800",
    "O+": "#2196f3",
    "O-": "#9c27b0",
  };

  return (
    <div className="charts-section">
      <div className="charts-grid">
        {/* Blood Group Distribution Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Tỷ lệ nhóm máu trong kho</h3>
            <span className="chart-subtitle">Phân bố theo đơn vị máu</span>
          </div>
          <div className="chart-content">
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
                      fill={BLOOD_GROUP_COLORS[entry.name] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Requests Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Yêu cầu máu theo tháng</h3>
            <span className="chart-subtitle">Xu hướng 6 tháng gần nhất</span>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRequestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#D93E4C"
                  strokeWidth={3}
                  dot={{ fill: "#D93E4C", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
