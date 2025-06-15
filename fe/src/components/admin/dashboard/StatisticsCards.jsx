import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  HeartOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "../../../styles/components/admin/StatisticsCards.scss";

const StatisticsCards = ({
  totalDonors = 0,
  totalRecipients = 0,
  totalBloodUnits = 0,
  totalRequests = 0,
}) => {
  const cardsData = [
    {
      title: "Tổng số người hiến",
      value: totalDonors,
      icon: <UserOutlined />,
      color: "#1890ff",
      suffix: "người",
    },
    {
      title: "Tổng số người nhận",
      value: totalRecipients,
      icon: <TeamOutlined />,
      color: "#52c41a",
      suffix: "người",
    },
    {
      title: "Tổng đơn vị máu",
      value: totalBloodUnits,
      icon: <HeartOutlined />,
      color: "#ff4d4f",
      suffix: "đơn vị",
    },
    {
      title: "Tổng yêu cầu",
      value: totalRequests,
      icon: <FileTextOutlined />,
      color: "#722ed1",
      suffix: "yêu cầu",
    },
  ];

  return (
    <div className="statistics-cards">
      <Row gutter={[16, 16]}>
        {cardsData.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="statistic-card" bordered={false}>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={React.cloneElement(card.icon, {
                  style: { color: card.color, fontSize: "24px" },
                })}
                suffix={card.suffix}
                valueStyle={{ color: card.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StatisticsCards;
