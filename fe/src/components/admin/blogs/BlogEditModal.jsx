import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";

const { Option } = Select;

const BlogEditModal = ({
  visible,
  selectedBlog,
  activeTab,
  editImage,
  tags = [],
  tagsLoading = false,
  onCancel,
  onSubmit,
  onImageChange,
  form,
}) => {
  useEffect(() => {
    if (selectedBlog && tags && !tagsLoading) {
      // Format tags for the form
      const formattedTags =
        selectedBlog.tags
          ?.map((tag) => {
            if (typeof tag === "object" && tag.tagId && tag.tagName) {
              return tag.tagId;
            } else if (typeof tag === "string") {
              return tag;
            } else {
              return "";
            }
          })
          .filter(Boolean) || [];

      form.setFieldsValue({
        title: selectedBlog.title,
        content: selectedBlog.content,
        tags: formattedTags,
      });
    }
  }, [selectedBlog, tags, tagsLoading, form]);

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
        {(activeTab === "Tài liệu" || activeTab === "Tin tức") && (
          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              placeholder="Chọn tags hoặc nhập tags mới"
              allowClear
              loading={tagsLoading}
              showSearch
              style={{ width: "100%" }}
            >
              {tags.map((tag) => {
                // Xử lý cả string và object tags
                const tagValue =
                  typeof tag === "object" && tag.tagId ? tag.tagId : tag;
                const tagText =
                  typeof tag === "object" && tag.tagName ? tag.tagName : tag;

                return (
                  <Option key={tagValue} value={tagValue}>
                    {tagText}
                  </Option>
                );
              })}
            </Select>
            <small style={{ color: "#666", fontSize: "12px" }}>
              Bạn có thể chọn tags có sẵn hoặc nhập tags mới
            </small>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default BlogEditModal;
