import React from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";

const { Option } = Select;

const BlogEditModal = ({
  visible,
  selectedBlog,
  activeTab,
  editImage,
  onCancel,
  onSubmit,
  onImageChange,
  form,
}) => {
  if (!selectedBlog) return null;

  return (
    <Modal
      title="Chỉnh sửa bài viết"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          Lưu
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical" initialValues={{ ...selectedBlog }}>
        <Form.Item name="title" label="Tiêu đề">
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Nội dung">
          <Input.TextArea rows={6} />
        </Form.Item>
        <Form.Item name="imgUrl" label="Ảnh thumbnail">
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => onImageChange(e.target.result);
              reader.readAsDataURL(file);
              return false;
            }}
          >
            {editImage ? (
              <img
                src={editImage}
                alt="thumbnail"
                style={{
                  width: 80,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            ) : (
              <div>Chọn ảnh</div>
            )}
          </Upload>
        </Form.Item>
        {activeTab === "Tài liệu" && (
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" style={{ width: "100%" }} allowClear />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default BlogEditModal;
