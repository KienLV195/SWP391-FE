import { Row, Col, Card, Statistic } from "antd";
import {
  DatabaseOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  StarOutlined,
} from "@ant-design/icons";

export default function ManagerBloodInventoryStats({
  totalUnits,
  criticalItems,
  lowItems,
  rareBloodUnits,
}) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Tổng đơn vị"
            value={totalUnits}
            prefix={<DatabaseOutlined style={{ color: "#20374E" }} />}
            valueStyle={{ color: "#20374E", fontFamily: "$font-manager" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Cực kỳ thiếu"
            value={criticalItems}
            prefix={<ExclamationCircleOutlined style={{ color: "#D91022" }} />}
            valueStyle={{ color: "#D91022", fontFamily: "$font-manager" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Thiếu"
            value={lowItems}
            prefix={<WarningOutlined style={{ color: "#fa8c16" }} />}
            valueStyle={{ color: "#fa8c16", fontFamily: "$font-manager" }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Máu hiếm"
            value={rareBloodUnits}
            prefix={<StarOutlined style={{ color: "#D93E4C" }} />}
            valueStyle={{ color: "#D93E4C", fontFamily: "$font-manager" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
