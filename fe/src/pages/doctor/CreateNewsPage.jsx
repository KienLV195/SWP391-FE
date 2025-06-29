import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Card,
  Space,
  Typography,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import DoctorLayout from "../../components/doctor/DoctorLayout";
import * as newsService from "../../services/newsService";
import authService from "../../services/authService";
import { uploadImage } from "../../services/uploadService";
import { getNewsTags } from "../../services/tagService";
import "../../styles/pages/BlogEditor.scss";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const CreateNewsPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const loadTags = async () => {
      setTagsLoading(true);
      try {
        const tagsData = await getNewsTags();
        setTags(Array.isArray(tagsData) ? tagsData : []);
      } catch (error) {
        console.error("Error loading news tags:", error);
        message.error("Không thể tải danh sách tags từ News API");
      } finally {
        setTagsLoading(false);
      }
    };

    loadTags();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const tagsToProcess =
        selectedTags.length > 0 ? selectedTags : values.tags || [];

      // Tách tags thành 2 loại: existing tags (có ID) và new tags (string)
      const tagIds = [];
      const newTags = [];

      tagsToProcess.forEach((tag) => {
        if (typeof tag === "number" || !isNaN(tag)) {
          // Nếu là number, đó là tagId
          tagIds.push(typeof tag === "number" ? tag : parseInt(tag));
        } else if (typeof tag === "string") {
          // Nếu là string, kiểm tra xem có phải existing tag không
          const existingTag = tags.find(
            (t) =>
              (typeof t === "object" && t.tagName === tag) ||
              (typeof t === "string" && t === tag)
          );

          if (
            existingTag &&
            typeof existingTag === "object" &&
            existingTag.tagId
          ) {
            // Đây là existing tag, thêm tagId
            tagIds.push(existingTag.tagId);
          } else {
            // Đây là new tag
            newTags.push(tag);
          }
        }
      });

      const newsData = {
        title: values.title,
        content: values.content,
        imgUrl: imageUrl,
        tagIds: tagIds,
        newTags: newTags,
        userId: currentUser.id,
      };

      const createdNews = await newsService.createNews(newsData);

      // Fetch the updated news list to see if tags are saved
      const updatedNewsList = await newsService.fetchAllNews();
      const createdNewsInList = updatedNewsList.find(
        (n) => n.postId === createdNews.postId || n.id === createdNews.id
      );

      message.success("Tạo bài viết tin tức thành công!");
      navigate("/doctor/blog?tab=news");
    } catch (error) {
      console.error("Error creating news:", error);
      message.error("Có lỗi xảy ra khi tạo bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    if (info.file.status === "done") {
      try {
        const uploadResult = await uploadImage(info.file.originFileObj);
        setImageUrl(uploadResult.url || uploadResult.imageUrl);
        message.success(`${info.file.name} upload thành công!`);
      } catch (error) {
        message.error(`Upload ${info.file.name} thất bại: ${error.message}`);
      } finally {
        setUploading(false);
      }
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload thất bại.`);
      setUploading(false);
    }
  };

  const uploadProps = {
    name: "file",
    action: "dummy",
    headers: {
      authorization: "authorization-text",
    },
    onChange: handleImageChange,
    customRequest: ({ file, onSuccess, onError }) => {
      uploadImage(file)
        .then((result) => {
          onSuccess(result, file);
        })
        .catch((error) => {
          onError(error);
        });
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Bạn chỉ có thể upload file ảnh!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return false;
      }
      return true;
    },
  };

  return (
    <DoctorLayout
      pageTitle="Tạo bài viết tin tức mới"
      pageDescription="Tạo bài viết tin tức về hoạt động, sự kiện, thông báo mới"
    >
      <Card>
        <div className="blog-editor">
          <div style={{ marginBottom: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/doctor/blog")}
              disabled={loading}
            >
              Quay lại
            </Button>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="blog-form"
          >
            <div className="form-main">
              <div className="form-content">
                <Form.Item
                  name="title"
                  label="Tiêu đề bài viết"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề!" },
                  ]}
                >
                  <Input placeholder="Nhập tiêu đề bài viết..." size="large" />
                </Form.Item>
                <Form.Item
                  name="excerpt"
                  label="Tóm tắt"
                  rules={[
                    { required: true, message: "Vui lòng nhập tóm tắt!" },
                  ]}
                >
                  <TextArea
                    placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                    rows={3}
                    maxLength={200}
                    showCount
                  />
                </Form.Item>
                <Form.Item
                  name="content"
                  label="Nội dung bài viết"
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung!" },
                  ]}
                >
                  <TextArea
                    placeholder="Nhập nội dung chi tiết bài viết..."
                    rows={15}
                    showCount
                  />
                </Form.Item>
              </div>
              <div className="form-sidebar">
                <Card title="Cài đặt bài viết" size="small">
                  <Form.Item name="tags" label="Tags">
                    <Select
                      mode="tags"
                      placeholder="Chọn tags hoặc nhập tags mới"
                      allowClear
                      loading={tagsLoading}
                      showSearch
                      style={{ width: "100%" }}
                      value={selectedTags}
                      onChange={(value) => {
                        setSelectedTags(value || []);
                        form.setFieldsValue({ tags: value });
                      }}
                    >
                      {tags.map((tag) => {
                        const tagValue =
                          typeof tag === "object" && tag.tagName
                            ? tag.tagName
                            : tag;
                        const tagText =
                          typeof tag === "object" && tag.tagName
                            ? tag.tagName
                            : tag;

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
                  <Form.Item
                    name="targetAudience"
                    label="Đối tượng độc giả"
                    initialValue="public"
                  >
                    <Select>
                      <Option value="public">Công chúng (Guest/Member)</Option>
                      <Option value="internal">Nội bộ (Staff only)</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Ảnh đại diện">
                    <Upload
                      {...uploadProps}
                      listType="picture-card"
                      maxCount={1}
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>
                          {uploading ? "Đang upload..." : "Upload"}
                        </div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Card>
                <Card
                  title="Thông tin tác giả"
                  size="small"
                  style={{ marginTop: 16 }}
                >
                  <Text strong>{currentUser?.name}</Text>
                  <br />
                  <Text type="secondary">Bác sĩ khoa Huyết học</Text>
                  <br />
                  <Text type="secondary">Bài viết sẽ được tự động đăng</Text>
                </Card>
              </div>
            </div>
            <div className="form-actions">
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  Đăng bài viết
                </Button>
                <Button onClick={() => navigate("/doctor/blog")} size="large">
                  Hủy
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      </Card>
    </DoctorLayout>
  );
};

export default CreateNewsPage;
