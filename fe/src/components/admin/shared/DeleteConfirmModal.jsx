import React from "react";
import { Modal } from "antd";

const DeleteConfirmModal = ({
  visible,
  onOk,
  onCancel,
  title = "Xác nhận xóa",
  content = "Bạn có chắc chắn muốn xóa?",
  okText = "Xóa",
  cancelText = "Hủy",
  okButtonProps = { danger: true },
}) => (
  <Modal
    open={visible}
    title={title}
    onOk={onOk}
    onCancel={onCancel}
    okText={okText}
    okButtonProps={okButtonProps}
    cancelText={cancelText}
  >
    <p>{content}</p>
  </Modal>
);

export default DeleteConfirmModal;
