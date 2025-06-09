import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberNavbar from "../../components/member/MemberNavbar";
import LocationPicker from "../../components/member/LocationPicker";
import authService from "../../services/authService";
import NotificationService from "../../services/notificationService";
import {
  REQUEST_STATUS,
  URGENCY_LEVELS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  URGENCY_ICONS,
  BLOOD_TYPES,
} from "../../constants/systemConstants";
import "../../styles/pages/BloodRequestFormPage.scss";

const BloodRequestFormPage = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    bloodType: "",
    quantity: "",
    unit: "ml",
    urgency: URGENCY_LEVELS.NORMAL, // normal, urgent, emergency
    medicalCondition: "",
    hospitalName: "",
    doctorName: "",
    doctorPhone: "",
    patientName: "",
    patientAge: "",
    patientGender: "",
    patientRelation: "", // self, family, friend, other
    medicalReports: "",
    expectedDate: "",
    location: null,
    additionalNotes: "",
    status: REQUEST_STATUS.PENDING, // Initial status when submitted
  });

  const [submissionResult, setSubmissionResult] = useState(null);

  const handleInputChange = (field, value) => {
    setRequestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // TODO: Replace with actual API call - POST /api/blood-requests
      const bloodRequest = {
        id: Date.now(),
        userId: currentUser.id,
        requesterName: currentUser.name,
        requesterPhone: currentUser.phone,
        requesterEmail: currentUser.email,
        ...requestData,
        status: "pending", // Gửi trực tiếp đến doctor khoa máu
        requestType: "external", // external request from member
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Send notification to blood department doctors
      await NotificationService.createNotification({
        userId: "blood_department_doctors", // Special ID for blood department
        type: "new_blood_request",
        title: "📋 Yêu cầu máu mới",
        message: `Yêu cầu máu ${requestData.bloodType} từ ${currentUser.name}`,
        data: {
          requestId: bloodRequest.id,
          bloodType: requestData.bloodType,
          quantity: requestData.quantity,
          urgency: requestData.urgency,
          requesterName: currentUser.name,
        },
      });

      setSubmissionResult({
        status: "success",
        message: "GỬI YÊU CẦU THÀNH CÔNG",
        description:
          "Yêu cầu máu của bạn đã được gửi đến bác sĩ khoa Huyết học. Bạn sẽ nhận được phản hồi sớm.",
        requestId: bloodRequest.id,
      });
    } catch (error) {
      console.error("Error submitting blood request:", error);
      setSubmissionResult({
        status: "error",
        message: "LỖI HỆ THỐNG",
        description: "Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    return URGENCY_COLORS[urgency] || URGENCY_COLORS[URGENCY_LEVELS.NORMAL];
  };

  const getUrgencyText = (urgency) => {
    const icon = URGENCY_ICONS[urgency] || URGENCY_ICONS[URGENCY_LEVELS.NORMAL];
    const label =
      URGENCY_LABELS[urgency] || URGENCY_LABELS[URGENCY_LEVELS.NORMAL];
    return `${icon} ${label}`;
  };

  if (submissionResult) {
    return (
      <div className="blood-request-form-page">
        <MemberNavbar />

        <div className="request-content">
          <div className="result-section">
            <div className={`result-card ${submissionResult.status}`}>
              <div className="result-icon">
                {submissionResult.status === "success" ? "✅" : "❌"}
              </div>
              <div className="result-content">
                <h2>{submissionResult.message}</h2>
                <p>{submissionResult.description}</p>

                {submissionResult.status === "success" && (
                  <div className="request-summary">
                    <h3>📋 Thông tin yêu cầu</h3>
                    <div className="request-details">
                      <div className="detail-item">
                        <strong>Mã yêu cầu:</strong> #
                        {submissionResult.requestId}
                      </div>
                      <div className="detail-item">
                        <strong>Nhóm máu:</strong>
                        <span className="blood-type-badge">
                          {requestData.bloodType}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Số lượng:</strong> {requestData.quantity}{" "}
                        {requestData.unit}
                      </div>
                      <div className="detail-item">
                        <strong>Mức độ:</strong>
                        <span
                          className="urgency-badge"
                          style={{
                            backgroundColor: getUrgencyColor(
                              requestData.urgency
                            ),
                          }}
                        >
                          {getUrgencyText(requestData.urgency)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Bệnh nhân:</strong> {requestData.patientName}
                      </div>
                    </div>
                  </div>
                )}

                <div className="result-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/member/dashboard")}
                  >
                    Về trang chủ
                  </button>

                  {submissionResult.status === "success" && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate("/member/notifications")}
                    >
                      Xem thông báo
                    </button>
                  )}

                  {submissionResult.status === "error" && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSubmissionResult(null)}
                    >
                      Thử lại
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blood-request-form-page">
      <MemberNavbar />

      <div className="request-content">
        <div className="page-header">
          <h1>📋 Yêu cầu máu</h1>
          <p>Điền thông tin để yêu cầu máu từ ngân hàng máu</p>
        </div>

        <div className="form-section">
          <div className="form-card">
            <h2>🩸 Thông tin yêu cầu máu</h2>

            <form className="request-form">
              {/* Blood Information */}
              <div className="form-section-group">
                <h3>Thông tin máu cần thiết</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Nhóm máu <span className="required">*</span>
                    </label>
                    <select
                      value={requestData.bloodType}
                      onChange={(e) =>
                        handleInputChange("bloodType", e.target.value)
                      }
                      required
                    >
                      <option value="">Chọn nhóm máu</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>
                      Số lượng <span className="required">*</span>
                    </label>
                    <div className="quantity-input">
                      <input
                        type="number"
                        value={requestData.quantity}
                        onChange={(e) =>
                          handleInputChange("quantity", e.target.value)
                        }
                        placeholder="Nhập số lượng"
                        min="1"
                        required
                      />
                      <select
                        value={requestData.unit}
                        onChange={(e) =>
                          handleInputChange("unit", e.target.value)
                        }
                      >
                        <option value="ml">ml</option>
                        <option value="đơn vị">đơn vị</option>
                        <option value="túi">túi</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Mức độ khẩn cấp <span className="required">*</span>
                    </label>
                    <select
                      value={requestData.urgency}
                      onChange={(e) =>
                        handleInputChange("urgency", parseInt(e.target.value))
                      }
                      required
                    >
                      <option value={URGENCY_LEVELS.NORMAL}>
                        {URGENCY_ICONS[URGENCY_LEVELS.NORMAL]}{" "}
                        {URGENCY_LABELS[URGENCY_LEVELS.NORMAL]}
                      </option>
                      <option value={URGENCY_LEVELS.URGENT}>
                        {URGENCY_ICONS[URGENCY_LEVELS.URGENT]}{" "}
                        {URGENCY_LABELS[URGENCY_LEVELS.URGENT]}
                      </option>
                      <option value={URGENCY_LEVELS.CRITICAL}>
                        {URGENCY_ICONS[URGENCY_LEVELS.CRITICAL]}{" "}
                        {URGENCY_LABELS[URGENCY_LEVELS.CRITICAL]}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ngày cần máu</label>
                  <input
                    type="date"
                    value={requestData.expectedDate}
                    onChange={(e) =>
                      handleInputChange("expectedDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* Patient Information */}
              <div className="form-section-group">
                <h3>Thông tin bệnh nhân</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Tên bệnh nhân <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={requestData.patientName}
                      onChange={(e) =>
                        handleInputChange("patientName", e.target.value)
                      }
                      placeholder="Nhập tên bệnh nhân"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tuổi</label>
                    <input
                      type="number"
                      value={requestData.patientAge}
                      onChange={(e) =>
                        handleInputChange("patientAge", e.target.value)
                      }
                      placeholder="Tuổi"
                      min="0"
                      max="150"
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      value={requestData.patientGender}
                      onChange={(e) =>
                        handleInputChange("patientGender", e.target.value)
                      }
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mối quan hệ với bệnh nhân</label>
                  <select
                    value={requestData.patientRelation}
                    onChange={(e) =>
                      handleInputChange("patientRelation", e.target.value)
                    }
                  >
                    <option value="">Chọn mối quan hệ</option>
                    <option value="self">Chính tôi</option>
                    <option value="family">Gia đình</option>
                    <option value="friend">Bạn bè</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Tình trạng bệnh lý <span className="required">*</span>
                  </label>
                  <textarea
                    value={requestData.medicalCondition}
                    onChange={(e) =>
                      handleInputChange("medicalCondition", e.target.value)
                    }
                    placeholder="Mô tả tình trạng bệnh lý cần truyền máu..."
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div className="form-section-group">
                <h3>Thông tin y tế</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tên bệnh viện/phòng khám</label>
                    <input
                      type="text"
                      value={requestData.hospitalName}
                      onChange={(e) =>
                        handleInputChange("hospitalName", e.target.value)
                      }
                      placeholder="Tên cơ sở y tế"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tên bác sĩ điều trị</label>
                    <input
                      type="text"
                      value={requestData.doctorName}
                      onChange={(e) =>
                        handleInputChange("doctorName", e.target.value)
                      }
                      placeholder="Tên bác sĩ"
                    />
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại bác sĩ</label>
                    <input
                      type="tel"
                      value={requestData.doctorPhone}
                      onChange={(e) =>
                        handleInputChange("doctorPhone", e.target.value)
                      }
                      placeholder="Số điện thoại bác sĩ"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Báo cáo y tế/Chẩn đoán</label>
                  <textarea
                    value={requestData.medicalReports}
                    onChange={(e) =>
                      handleInputChange("medicalReports", e.target.value)
                    }
                    placeholder="Thông tin về chẩn đoán, kết quả xét nghiệm..."
                    rows="4"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-section-group">
                <h3>Vị trí</h3>
                <LocationPicker
                  onLocationChange={(location) =>
                    handleInputChange("location", location)
                  }
                  initialLocation={requestData.location}
                />
              </div>

              {/* Additional Notes */}
              <div className="form-section-group">
                <h3>Ghi chú thêm</h3>
                <div className="form-group">
                  <textarea
                    value={requestData.additionalNotes}
                    onChange={(e) =>
                      handleInputChange("additionalNotes", e.target.value)
                    }
                    placeholder="Thông tin bổ sung, yêu cầu đặc biệt..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !requestData.bloodType ||
                    !requestData.quantity ||
                    !requestData.patientName ||
                    !requestData.medicalCondition
                  }
                >
                  {loading ? "⏳ Đang gửi yêu cầu..." : "📤 Gửi yêu cầu máu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestFormPage;
