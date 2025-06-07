import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberNavbar from "../../components/member/MemberNavbar";
import LocationPicker from "../../components/member/LocationPicker";
import authService from "../../services/authService";
import NotificationService from "../../services/notificationService";
import DistanceService from "../../services/distanceService";
import "../../styles/pages/BloodDonationFormPage.scss";

const BloodDonationFormPage = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [step, setStep] = useState(1); // 1: Personal Info, 2: Health Survey, 3: Schedule Appointment
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    location: null,
  });
  const [healthSurvey, setHealthSurvey] = useState({
    weight: "",
    height: "",
    bloodPressure: "",
    heartRate: "",
    lastDonationDate: "",
    medications: "",
    chronicDiseases: [],
    recentIllness: false,
    recentTravel: false,
    recentVaccination: false,
    alcoholConsumption: false,
    smoking: false,
    pregnancy: false, // For female donors
    breastfeeding: false, // For female donors
    tattooRecent: false,
    surgeryRecent: false,
    bloodTransfusion: false,
    additionalNotes: "",
  });

  const [appointmentData, setAppointmentData] = useState({
    preferredDate: "",
    timeSlot: "", // morning (7-11) or afternoon (13-17)
    location: null,
  });

  const [registrationResult, setRegistrationResult] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);

  // Health conditions that disqualify donors
  const disqualifyingConditions = [
    "HIV/AIDS",
    "Hepatitis B",
    "Hepatitis C",
    "Syphilis",
    "Malaria",
    "Heart Disease",
    "Cancer",
    "Diabetes (Type 1)",
    "Epilepsy",
    "Severe Anemia",
  ];

  const handleHealthSurveyChange = (field, value) => {
    setHealthSurvey((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChronicDiseaseChange = (disease, checked) => {
    setHealthSurvey((prev) => ({
      ...prev,
      chronicDiseases: checked
        ? [...prev.chronicDiseases, disease]
        : prev.chronicDiseases.filter((d) => d !== disease),
    }));
  };

  const checkEligibility = () => {
    const {
      weight,
      chronicDiseases,
      recentIllness,
      recentTravel,
      alcoholConsumption,
      tattooRecent,
      surgeryRecent,
      bloodTransfusion,
    } = healthSurvey;

    // Weight check
    if (parseFloat(weight) < 45) {
      return { eligible: false, reason: "Cân nặng dưới 45kg" };
    }

    // Chronic diseases check
    const hasDisqualifyingCondition = chronicDiseases.some((disease) =>
      disqualifyingConditions.includes(disease)
    );
    if (hasDisqualifyingCondition) {
      return { eligible: false, reason: "Có bệnh nền không phù hợp" };
    }

    // Recent conditions check
    if (
      recentIllness ||
      recentTravel ||
      alcoholConsumption ||
      tattooRecent ||
      surgeryRecent ||
      bloodTransfusion
    ) {
      return { eligible: false, reason: "Có yếu tố rủi ro gần đây" };
    }

    return { eligible: true, reason: "" };
  };

  const handleHealthSurveySubmit = async () => {
    setLoading(true);

    try {
      const eligibilityResult = checkEligibility();

      // TODO: Replace with actual API call - POST /api/donations/health-survey
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (eligibilityResult.eligible) {
        setRegistrationResult({
          status: "success",
          message: "ĐĂNG KÝ THÀNH CÔNG",
          description: "Bạn đủ điều kiện hiến máu. Vui lòng đặt lịch hẹn.",
        });
        setStep(3);
      } else {
        setRegistrationResult({
          status: "failed",
          message: "ĐĂNG KÝ KHÔNG THÀNH CÔNG",
          description: `VÌ LÝ DO SỨC KHỎE: ${eligibilityResult.reason}`,
        });
      }
    } catch (error) {
      console.error("Error submitting health survey:", error);
      setRegistrationResult({
        status: "error",
        message: "LỖI HỆ THỐNG",
        description: "Có lỗi xảy ra khi xử lý đăng ký. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentSubmit = async () => {
    setLoading(true);

    try {
      // TODO: Replace with actual API call - POST /api/donations/schedule
      const appointmentRequest = {
        userId: currentUser.id,
        personalInfo,
        healthSurvey,
        appointment: {
          ...appointmentData,
          location: personalInfo.location, // Use location from personal info
        },
        status: "registered",
        createdAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Send notification
      await NotificationService.sendAppointmentReminder(currentUser.id, {
        id: Date.now(),
        appointmentDate: `${appointmentData.preferredDate}T${
          appointmentData.timeSlot === "morning" ? "09:00:00" : "15:00:00"
        }`,
        location: "Bệnh viện XYZ - Tầng 2",
      });

      setRegistrationResult({
        status: "scheduled",
        message: "ĐẶT LỊCH THÀNH CÔNG",
        description:
          "Lịch hẹn hiến máu đã được gửi đến Manager. Bạn sẽ nhận được xác nhận sớm.",
      });
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotText = (slot) => {
    return slot === "morning" ? "7:00 - 11:00 (Sáng)" : "13:00 - 17:00 (Chiều)";
  };

  useEffect(() => {
    // Load user profile information from localStorage or API
    const loadUserProfile = () => {
      // Mock user profile data (replace with actual API call)
      const mockProfile = {
        fullName: "Nguyễn Văn A",
        email: "member1@test.com",
        phone: "0123456789",
        dateOfBirth: "1990-01-01",
        gender: "male",
        address: "123 Đường ABC",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        location: {
          lat: 10.7751237,
          lng: 106.6862143,
          address: "123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        },
      };

      // First try to get from currentUser
      if (currentUser?.profile) {
        setPersonalInfo((prev) => ({
          ...prev,
          fullName: currentUser.profile.fullName || mockProfile.fullName,
          email:
            currentUser.profile.email || currentUser.email || mockProfile.email,
          phone:
            currentUser.profile.phone || currentUser.phone || mockProfile.phone,
          dateOfBirth:
            currentUser.profile.dateOfBirth || mockProfile.dateOfBirth,
          gender: currentUser.profile.gender || mockProfile.gender,
          address: currentUser.profile.address || mockProfile.address,
          city: currentUser.profile.city || mockProfile.city,
          district: currentUser.profile.district || mockProfile.district,
          ward: currentUser.profile.ward || mockProfile.ward,
          location: currentUser.profile.location || mockProfile.location,
        }));
      } else {
        // Use mock data as fallback
        setPersonalInfo((prev) => ({
          ...prev,
          ...mockProfile,
        }));
      }
    };

    loadUserProfile();
  }, [currentUser]);

  // Calculate distance when personalInfo.location changes
  useEffect(() => {
    if (personalInfo.location) {
      const distance = DistanceService.calculateDistanceToHospital(
        personalInfo.location
      );
      setDistanceInfo({
        distance,
        formattedDistance: DistanceService.formatDistance(distance),
        travelTime: DistanceService.getEstimatedTravelTime(distance),
      });
    }
  }, [personalInfo.location]);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Calculate distance when location changes
    if (field === "location" && value) {
      const distance = DistanceService.calculateDistanceToHospital(value);
      setDistanceInfo({
        distance,
        formattedDistance: DistanceService.formatDistance(distance),
        travelTime: DistanceService.getEstimatedTravelTime(distance),
        priority: DistanceService.getPriorityLevel(distance),
      });
    }
  };

  const handlePersonalInfoSubmit = () => {
    // Validate required fields
    if (
      !personalInfo.fullName ||
      !personalInfo.phone ||
      !personalInfo.dateOfBirth
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    setStep(2);
  };

  if (
    registrationResult &&
    (registrationResult.status === "failed" ||
      registrationResult.status === "scheduled")
  ) {
    return (
      <div className="blood-donation-form-page">
        <MemberSidebar />

        <div className="registration-content">
          <div className="result-section">
            <div className={`result-card ${registrationResult.status}`}>
              <div className="result-icon">
                {registrationResult.status === "failed" ? "❌" : "✅"}
              </div>
              <div className="result-content">
                <h2>{registrationResult.message}</h2>
                <p>{registrationResult.description}</p>

                {registrationResult.status === "scheduled" && (
                  <div className="appointment-summary">
                    <h3>📅 Thông tin lịch hẹn</h3>
                    <div className="appointment-details">
                      <div className="detail-item">
                        <strong>Ngày:</strong>{" "}
                        {new Date(
                          appointmentData.preferredDate
                        ).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="detail-item">
                        <strong>Khung giờ:</strong>{" "}
                        {getTimeSlotText(appointmentData.timeSlot)}
                      </div>
                      <div className="detail-item">
                        <strong>Địa điểm:</strong> Bệnh viện Đa khoa Ánh Dương -
                        Khoa Huyết học, Tầng 2
                      </div>
                      <div className="detail-item">
                        <strong>Địa chỉ:</strong> Đường Cách Mạng Tháng 8, Quận
                        3, TP.HCM, Vietnam
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

                  {registrationResult.status === "failed" && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setRegistrationResult(null);
                        setStep(1);
                        setHealthSurvey({
                          weight: "",
                          height: "",
                          bloodPressure: "",
                          heartRate: "",
                          lastDonationDate: "",
                          medications: "",
                          chronicDiseases: [],
                          recentIllness: false,
                          recentTravel: false,
                          recentVaccination: false,
                          alcoholConsumption: false,
                          smoking: false,
                          pregnancy: false,
                          breastfeeding: false,
                          tattooRecent: false,
                          surgeryRecent: false,
                          bloodTransfusion: false,
                          additionalNotes: "",
                        });
                      }}
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
    <div className="blood-donation-form-page">
      <MemberNavbar />

      <div className="registration-content">
        <div className="page-header">
          <h1>🩸 Đăng ký hiến máu</h1>
          <p>Hoàn thành các bước để đăng ký hiến máu</p>

          <div className="progress-steps">
            <div
              className={`step ${step >= 1 ? "active" : ""} ${
                step > 1 ? "completed" : ""
              }`}
            >
              <div className="step-number">1</div>
              <div className="step-text">Thông tin cá nhân</div>
            </div>
            <div
              className={`step ${step >= 2 ? "active" : ""} ${
                step > 2 ? "completed" : ""
              }`}
            >
              <div className="step-number">2</div>
              <div className="step-text">Khảo sát sức khỏe</div>
            </div>
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-text">Đặt lịch hẹn</div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="personal-info-section">
            <div className="form-card">
              <h2>👤 Thông tin cá nhân</h2>
              <p>Vui lòng kiểm tra và cập nhật thông tin cá nhân của bạn</p>

              <div className="profile-info-notice">
                <div className="notice-icon">ℹ️</div>
                <div className="notice-content">
                  <strong>Thông tin đã được điền sẵn</strong>
                  <p>
                    Các thông tin dưới đây được lấy từ hồ sơ cá nhân của bạn.
                    Bạn có thể chỉnh sửa nếu cần thiết.
                  </p>
                </div>
              </div>

              <form className="personal-form">
                {/* Basic Personal Info */}
                <div className="form-section">
                  <h3>👤 Thông tin cơ bản</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Họ và tên <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) =>
                          handlePersonalInfoChange("fullName", e.target.value)
                        }
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) =>
                          handlePersonalInfoChange("email", e.target.value)
                        }
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Số điện thoại <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          handlePersonalInfoChange("phone", e.target.value)
                        }
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        Ngày sinh <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) =>
                          handlePersonalInfoChange(
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) =>
                        handlePersonalInfoChange("gender", e.target.value)
                      }
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Current Location */}
                <div className="form-section">
                  <h3>📍 Địa chỉ hiện tại</h3>
                  <p className="section-description">
                    Vui lòng chọn vị trí hiện tại của bạn để chúng tôi tính
                    khoảng cách đến bệnh viện
                  </p>

                  {/* Location Picker */}
                  <div className="location-picker-section">
                    <label>📍 Chọn vị trí hiện tại của bạn</label>
                    <LocationPicker
                      initialLocation={personalInfo.location}
                      onLocationChange={(location) =>
                        handlePersonalInfoChange("location", location)
                      }
                    />

                    {/* Distance Information */}
                    {distanceInfo && (
                      <div className="distance-info">
                        <div className="distance-card">
                          <div className="distance-header">
                            <span className="distance-icon">📏</span>
                            <span className="distance-text">
                              Khoảng cách đến Bệnh viện Đa khoa Ánh Dương
                            </span>
                          </div>
                          <div className="distance-details">
                            <div className="distance-value">
                              <strong>{distanceInfo.formattedDistance}</strong>
                            </div>
                            <div className="travel-time">
                              🚗 {distanceInfo.travelTime}
                            </div>
                          </div>
                          <div className="hospital-info">
                            <div className="hospital-address">
                              🏥 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM,
                              Vietnam
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="location-note">
                      📍 Vị trí này sẽ giúp chúng tôi tính khoảng cách và ưu
                      tiên trong trường hợp khẩn cấp. Bạn có thể click trên bản
                      đồ hoặc sử dụng GPS để chọn vị trí chính xác.
                    </p>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePersonalInfoSubmit}
                  >
                    ➡️ Tiếp tục
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="health-survey-section">
            <div className="form-card">
              <h2>🏥 Khảo sát sức khỏe</h2>
              <p>
                Vui lòng điền đầy đủ thông tin để đánh giá tình trạng sức khỏe
              </p>

              <form className="health-form">
                {/* Basic Health Info */}
                <div className="form-section">
                  <h3>Thông tin cơ bản</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Cân nặng (kg) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        value={healthSurvey.weight}
                        onChange={(e) =>
                          handleHealthSurveyChange("weight", e.target.value)
                        }
                        placeholder="Nhập cân nặng"
                        min="30"
                        max="200"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Chiều cao (cm)</label>
                      <input
                        type="number"
                        value={healthSurvey.height}
                        onChange={(e) =>
                          handleHealthSurveyChange("height", e.target.value)
                        }
                        placeholder="Nhập chiều cao"
                        min="100"
                        max="250"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Huyết áp</label>
                      <input
                        type="text"
                        value={healthSurvey.bloodPressure}
                        onChange={(e) =>
                          handleHealthSurveyChange(
                            "bloodPressure",
                            e.target.value
                          )
                        }
                        placeholder="VD: 120/80"
                      />
                    </div>
                    <div className="form-group">
                      <label>Nhịp tim (bpm)</label>
                      <input
                        type="number"
                        value={healthSurvey.heartRate}
                        onChange={(e) =>
                          handleHealthSurveyChange("heartRate", e.target.value)
                        }
                        placeholder="VD: 72"
                        min="40"
                        max="200"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Lần hiến máu cuối cùng</label>
                    <input
                      type="date"
                      value={healthSurvey.lastDonationDate}
                      onChange={(e) =>
                        handleHealthSurveyChange(
                          "lastDonationDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* Chronic Diseases */}
                <div className="form-section">
                  <h3>Bệnh nền</h3>
                  <div className="checkbox-grid">
                    {disqualifyingConditions.map((disease) => (
                      <label key={disease} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={healthSurvey.chronicDiseases.includes(
                            disease
                          )}
                          onChange={(e) =>
                            handleChronicDiseaseChange(
                              disease,
                              e.target.checked
                            )
                          }
                        />
                        <span>{disease}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="form-section">
                  <h3>Yếu tố rủi ro</h3>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.recentIllness}
                        onChange={(e) =>
                          handleHealthSurveyChange(
                            "recentIllness",
                            e.target.checked
                          )
                        }
                      />
                      <span>Bị ốm trong 2 tuần qua</span>
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.recentTravel}
                        onChange={(e) =>
                          handleHealthSurveyChange(
                            "recentTravel",
                            e.target.checked
                          )
                        }
                      />
                      <span>Du lịch nước ngoài trong 6 tháng qua</span>
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.alcoholConsumption}
                        onChange={(e) =>
                          handleHealthSurveyChange(
                            "alcoholConsumption",
                            e.target.checked
                          )
                        }
                      />
                      <span>Uống rượu trong 24 giờ qua</span>
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.tattooRecent}
                        onChange={(e) =>
                          handleHealthSurveyChange(
                            "tattooRecent",
                            e.target.checked
                          )
                        }
                      />
                      <span>Xăm hình trong 6 tháng qua</span>
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.surgeryRecent}
                        onChange={(e) =>
                          handleHealthSurveyChange(
                            "surgeryRecent",
                            e.target.checked
                          )
                        }
                      />
                      <span>Phẫu thuật trong 6 tháng qua</span>
                    </label>

                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.bloodTransfusion}
                        onChange={(e) =>
                          handleHealthSurveyChange(
                            "bloodTransfusion",
                            e.target.checked
                          )
                        }
                      />
                      <span>Truyền máu trong 12 tháng qua</span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    ⬅️ Quay lại
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleHealthSurveySubmit}
                    disabled={loading || !healthSurvey.weight}
                  >
                    {loading ? "⏳ Đang xử lý..." : "✅ Tiếp tục"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="appointment-section">
            <div className="form-card">
              <h2>📅 Đặt lịch hẹn hiến máu</h2>
              <p>Chọn thời gian phù hợp để đến hiến máu</p>

              <form className="appointment-form">
                <div className="form-section">
                  <h3>Thời gian</h3>
                  <div className="form-group">
                    <label>
                      Ngày mong muốn <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      value={appointmentData.preferredDate}
                      onChange={(e) =>
                        setAppointmentData((prev) => ({
                          ...prev,
                          preferredDate: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Khung giờ <span className="required">*</span>
                    </label>
                    <div className="time-slots">
                      <label className="time-slot">
                        <input
                          type="radio"
                          name="timeSlot"
                          value="morning"
                          checked={appointmentData.timeSlot === "morning"}
                          onChange={(e) =>
                            setAppointmentData((prev) => ({
                              ...prev,
                              timeSlot: e.target.value,
                            }))
                          }
                        />
                        <div className="slot-content">
                          <div className="slot-time">🌅 7:00 - 11:00</div>
                          <div className="slot-label">Buổi sáng</div>
                        </div>
                      </label>

                      <label className="time-slot">
                        <input
                          type="radio"
                          name="timeSlot"
                          value="afternoon"
                          checked={appointmentData.timeSlot === "afternoon"}
                          onChange={(e) =>
                            setAppointmentData((prev) => ({
                              ...prev,
                              timeSlot: e.target.value,
                            }))
                          }
                        />
                        <div className="slot-content">
                          <div className="slot-time">🌇 13:00 - 17:00</div>
                          <div className="slot-label">Buổi chiều</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="form-section">
                  <h3>📍 Thông tin vị trí & Bệnh viện</h3>
                  <div className="location-summary">
                    <div className="location-info-card">
                      <div className="location-header">
                        <span className="location-icon">📍</span>
                        <span className="location-title">
                          Vị trí hiện tại của bạn
                        </span>
                      </div>
                      <div className="location-details">
                        <div className="address-text">
                          {personalInfo.location?.address || "Chưa chọn vị trí"}
                        </div>
                        {distanceInfo && (
                          <div className="distance-summary">
                            <span className="distance-badge">
                              📏 {distanceInfo.formattedDistance}
                            </span>
                            <span className="travel-time-badge">
                              🚗 {distanceInfo.travelTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="hospital-info-card">
                      <div className="location-header">
                        <span className="location-icon">🏥</span>
                        <span className="location-title">
                          Địa điểm hiến máu
                        </span>
                      </div>
                      <div className="hospital-details">
                        <div className="hospital-name">
                          Bệnh viện Đa khoa Ánh Dương
                        </div>
                        <div className="hospital-address">
                          📍 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam
                        </div>
                        <div className="hospital-department">
                          🩸 Khoa Huyết học - Tầng 2
                        </div>
                      </div>
                    </div>

                    <p className="location-note">
                      📍 Khoảng cách được tính từ vị trí hiện tại của bạn đến
                      bệnh viện
                    </p>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(2)}
                  >
                    ⬅️ Quay lại
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAppointmentSubmit}
                    disabled={
                      loading ||
                      !appointmentData.preferredDate ||
                      !appointmentData.timeSlot
                    }
                  >
                    {loading ? "⏳ Đang xử lý..." : "📅 Đặt lịch hẹn"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodDonationFormPage;
