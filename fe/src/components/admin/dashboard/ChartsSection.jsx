import React from "react";
import { Card, Row, Col } from "antd";
import { Pie, Column, Line } from "@ant-design/charts";
import "../../../styles/components/admin/ChartsSection.scss";

const ChartsSection = ({
  bloodGroupData = [],
  monthlyRequestsData = [],
  dailyVisitsData = [],
}) => {
  const userRoleConfig = {
    data: bloodGroupData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name}: {percentage}",
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    legend: {
      position: "bottom",
    },
    interactions: [{ type: "element-active" }],
  };

  const monthlyRequestsConfig = {
    data: monthlyRequestsData,
    xField: "month",
    yField: "value",
    seriesField: "type",
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: "top",
      style: {
        fill: "#000",
      },
    },
    legend: {
      position: "bottom",
    },
  };

  const dailyVisitsConfig = {
    data: dailyVisitsData,
    xField: "date",
    yField: "value",
    seriesField: "type",
    smooth: true,
    label: {
      style: {
        fill: "#000",
      },
    },
    legend: {
      position: "bottom",
    },
    point: {
      size: 5,
      shape: "diamond",
    },
  };

  return (
    <div className="charts-section">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            title="Phân bố nhóm máu"
            className="chart-card"
            bordered={false}
          >
            <Pie {...userRoleConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card
            title="Yêu cầu theo tháng"
            className="chart-card"
            bordered={false}
          >
            <Column {...monthlyRequestsConfig} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card
            title="Lượt truy cập theo ngày"
            className="chart-card"
            bordered={false}
          >
            <Line {...dailyVisitsConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChartsSection;
