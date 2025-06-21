import React from "react";
import { Button, Row, Col, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
  deleteConfirmTitle = "Bạn có chắc chắn muốn xóa?",
  deleteConfirmOkText = "Xóa",
  deleteConfirmCancelText = "Hủy",
  size = "small",
  justify = "center",
  gutter = 8,
}) => (
  <Row gutter={gutter} justify={justify}>
    {showView && onView && (
      <Col>
        <Button icon={<EyeOutlined />} onClick={onView} size={size} />
      </Col>
    )}
    {showEdit && onEdit && (
      <Col>
        <Button icon={<EditOutlined />} onClick={onEdit} size={size} />
      </Col>
    )}
    {showDelete && onDelete && (
      <Col>
        <Popconfirm
          title={deleteConfirmTitle}
          onConfirm={onDelete}
          okText={deleteConfirmOkText}
          cancelText={deleteConfirmCancelText}
        >
          <Button icon={<DeleteOutlined />} danger size={size} />
        </Popconfirm>
      </Col>
    )}
  </Row>
);

export default ActionButtons;
