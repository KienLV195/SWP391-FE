import React from "react";
import { Modal, Button, Steps, Tag, Row, Col, Divider } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const { Step } = Steps;

// Donation process statuses
const DONATION_STATUSES = {
  REGISTERED: "registered",
  HEALTH_CHECKED: "health_checked",
  ELIGIBLE: "eligible",
  NOT_ELIGIBLE: "not_eligible",
  DONATED: "donated",
  BLOOD_TESTED: "blood_tested",
  COMPLETED: "completed",
  STORED: "stored",
};

const ProcessWorkflowModal = ({
  visible,
  onCancel,
  selectedItem,
  onStoreBlood,
  isManager = false,
  title = "Quy trình hiến máu",
}) => {
  // Get status info for display
  const getStatusInfo = (status) => {
    const statusMap = {
      [DONATION_STATUSES.REGISTERED]: {
        text: "Đã đăng ký",
        color: "#1890ff",
        icon: <UserOutlined />,
        step: 0,
      },
      [DONATION_STATUSES.HEALTH_CHECKED]: {
        text: "Đã khám sức khỏe",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        step: 1,
      },
      [DONATION_STATUSES.ELIGIBLE]: {
        text: "Đủ điều kiện",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        step: 2,
      },
      [DONATION_STATUSES.NOT_ELIGIBLE]: {
        text: "Không đủ điều kiện",
        color: "#ff4d4f",
        icon: <ExclamationCircleOutlined />,
        step: 2,
      },
      [DONATION_STATUSES.DONATED]: {
        text: "Đã hiến máu",
        color: "#722ed1",
        icon: <HeartOutlined />,
        step: 3,
      },
      [DONATION_STATUSES.BLOOD_TESTED]: {
        text: "Đã xét nghiệm",
        color: "#fa8c16",
        icon: <ClockCircleOutlined />,
        step: 4,
      },
      [DONATION_STATUSES.COMPLETED]: {
        text: "Hoàn thành",
        color: "#52c41a",
        icon: <CheckCircleOutlined />,
        step: 5,
      },
      [DONATION_STATUSES.STORED]: {
        text: "Đã nhập kho",
        color: "#13c2c2",
        icon: <CheckCircleOutlined />,
        step: 6,
      },
    };
    return statusMap[status] || statusMap[DONATION_STATUSES.REGISTERED];
  };

  // Get donation process steps
  const getDonationSteps = () => [
    {
      title: "Đăng ký",
      description: "Đăng ký hiến máu",
      icon: <UserOutlined />,
    },
    {
      title: "Kiểm tra sức khỏe",
      description: "Khám sàng lọc",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Đánh giá",
      description: "Đủ điều kiện/Không đủ điều kiện",
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Hiến máu",
      description: "Thực hiện hiến máu",
      icon: <HeartOutlined />,
    },
    {
      title: "Xét nghiệm máu",
      description: "Kiểm tra chất lượng máu",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Hoàn thành",
      description: "Máu đủ điều kiện sử dụng",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Nhập kho",
      description: "Lưu trữ vào kho máu",
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleStoreBlood = () => {
    if (onStoreBlood && selectedItem) {
      onStoreBlood(selectedItem.id);
      onCancel();
    }
  };

  if (!selectedItem) return null;

  // Get the name field - could be donorName or name depending on the data structure
  const itemName = selectedItem.donorName || selectedItem.name;
  const itemStatus = selectedItem.status || selectedItem.donationStatus;

  return (
    <Modal
      title={`${title}: ${itemName}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
        itemStatus === DONATION_STATUSES.COMPLETED && (
          <Button key="store" type="primary" onClick={handleStoreBlood}>
            Nhập kho
          </Button>
        ),
      ]}
      width={800}
    >
      <div className="process-workflow">
        <div className="donor-summary">
          <Row gutter={16}>
            <Col span={8}>
              <div className="summary-item">
                <strong>Người hiến:</strong> {itemName}
              </div>
            </Col>
            <Col span={8}>
              <div className="summary-item">
                <strong>Nhóm máu:</strong>
                <Tag color="#D93E4C" style={{ marginLeft: 8 }}>
                  {selectedItem.bloodType}
                </Tag>
              </div>
            </Col>
            <Col span={8}>
              <div className="summary-item">
                <strong>Ngày hẹn:</strong>{" "}
                {selectedItem.appointmentDate
                  ? new Date(selectedItem.appointmentDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : selectedItem.registrationDate
                  ? new Date(selectedItem.registrationDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : "Chưa có"}
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        <div className="workflow-steps">
          <Steps
            current={getStatusInfo(itemStatus).step}
            status={
              itemStatus === DONATION_STATUSES.NOT_ELIGIBLE
                ? "error"
                : "process"
            }
            direction="vertical"
            size="small"
          >
            {getDonationSteps().map((step, index) => (
              <Step
                key={index}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </div>

        {itemStatus === DONATION_STATUSES.COMPLETED && (
          <div className="action-section">
            <Divider />
            <div className="action-info">
              <h4>Hành động tiếp theo</h4>
              <p>
                Máu đã được xét nghiệm và đủ điều kiện sử dụng. Bạn có thể nhập
                vào kho máu.
              </p>
            </div>
          </div>
        )}

        {selectedItem.notes && (
          <div className="notes-section">
            <Divider />
            <h4>Ghi chú</h4>
            <p>{selectedItem.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProcessWorkflowModal;
export { DONATION_STATUSES };
