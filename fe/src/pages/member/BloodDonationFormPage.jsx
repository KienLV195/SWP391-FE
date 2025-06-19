import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemberNavbar from "../../components/member/MemberNavbar";
import LocationPicker from "../../components/member/LocationPicker";
import AddressForm from "../../components/member/AddressForm";
import authService from "../../services/authService";
import NotificationService from "../../services/notificationService";
import GeolibService from "../../services/geolibService";
import { DONATION_STATUS, BLOOD_TYPES } from "../../constants/systemConstants";
import { getUserName } from "../../utils/userUtils";
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
    address: {
      houseNumber: "",
      street: "",
      province: "",
      district: "",
      ward: "",
      provinceName: "",
      districtName: "",
      wardName: "",
      fullAddress: "",
      coordinates: { lat: null, lng: null },
      distance: null,
      travelTime: null,
      formattedAddress: "",
    },
  });
  const [healthSurvey, setHealthSurvey] = useState({
    // Basic Info
    weight: "",
    height: "",
    bloodPressure: "",
    heartRate: "",
    bloodType: "",

    // Question 1: Previous Donation
    hasDonatedBefore: null, // true/false/null

    // Question 2: Current Medical Conditions
    hasCurrentMedicalConditions: null, // true/false/null

    // Question 3: Previous Serious Conditions
    hasPreviousSeriousConditions: null, // true/false/null
    otherPreviousConditions: "", // text input for other conditions

    // Question 4: Last 12 Months
    hadMalariaSyphilisTuberculosis: false,
    hadBloodTransfusion: false,
    hadVaccination: false,
    last12MonthsNone: false,

    // Question 5: Last 6 Months
    hadTyphoidSepsis: false,
    unexplainedWeightLoss: false,
    persistentLymphNodes: false,
    invasiveMedicalProcedures: false,
    tattoosPiercings: false,
    drugUse: false,
    bloodExposure: false,
    livedWithHepatitisB: false,
    sexualContactWithInfected: false,
    sameSexContact: false,
    last6MonthsNone: false,

    // Question 6: Last 1 Month
    hadUrinaryInfection: false,
    visitedEpidemicArea: false,
    last1MonthNone: false,

    // Question 7: Last 14 Days
    hadFluSymptoms: false,
    last14DaysNone: false,
    otherSymptoms: "", // text input for other symptoms

    // Question 8: Last 7 Days
    tookAntibiotics: false,
    last7DaysNone: false,
    otherMedications: "", // text input for other medications

    // Question 9: Women Only
    isPregnantOrNursing: false,
    hadPregnancyTermination: false,
    womenQuestionsNone: false,
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
      hasCurrentMedicalConditions,
      hasPreviousSeriousConditions,
      otherPreviousConditions,
      hadMalariaSyphilisTuberculosis,
      hadBloodTransfusion,
      hadVaccination,
      last12MonthsNone,
      hadTyphoidSepsis,
      unexplainedWeightLoss,
      persistentLymphNodes,
      invasiveMedicalProcedures,
      tattoosPiercings,
      drugUse,
      bloodExposure,
      livedWithHepatitisB,
      sexualContactWithInfected,
      sameSexContact,
      last6MonthsNone,
      hadUrinaryInfection,
      visitedEpidemicArea,
      last1MonthNone,
      hadFluSymptoms,
      last14DaysNone,
      otherSymptoms,
      tookAntibiotics,
      last7DaysNone,
      otherMedications,
      isPregnantOrNursing,
      hadPregnancyTermination,
      womenQuestionsNone
    } = healthSurvey;

    // Age check (assuming dateOfBirth is in personalInfo)
    const age = calculateAge(personalInfo.dateOfBirth);
    if (age < 18 || age > 60) {
      return { eligible: false, reason: "Tuổi không đủ điều kiện (18-60 tuổi)" };
    }

    // Weight check based on gender
    const minWeight = personalInfo.gender === "female" ? 42 : 45;
    if (parseFloat(weight) < minWeight) {
      return { eligible: false, reason: `Cân nặng dưới ${minWeight}kg` };
    }

    // Question 3: Previous Serious Conditions
    if (hasPreviousSeriousConditions === true || hasPreviousSeriousConditions === "other") {
      return { eligible: false, reason: "Có tiền sử bệnh nghiêm trọng" };
    }

    // Question 4: Last 12 Months
    if (!last12MonthsNone && (hadMalariaSyphilisTuberculosis || hadBloodTransfusion || hadVaccination)) {
      return { eligible: false, reason: "Có yếu tố rủi ro trong 12 tháng qua" };
    }

    // Question 5: Last 6 Months
    if (!last6MonthsNone && (
      hadTyphoidSepsis ||
      unexplainedWeightLoss ||
      persistentLymphNodes ||
      invasiveMedicalProcedures ||
      tattoosPiercings ||
      drugUse ||
      bloodExposure ||
      livedWithHepatitisB ||
      sexualContactWithInfected ||
      sameSexContact
    )) {
      return { eligible: false, reason: "Có yếu tố rủi ro trong 6 tháng qua" };
    }

    // Question 6: Last 1 Month
    if (!last1MonthNone && (hadUrinaryInfection || visitedEpidemicArea)) {
      return { eligible: false, reason: "Có yếu tố rủi ro trong 1 tháng qua" };
    }

    // Question 7: Last 14 Days
    if (!last14DaysNone && (hadFluSymptoms || otherSymptoms)) {
      return { eligible: false, reason: "Có triệu chứng bệnh trong 14 ngày qua" };
    }

    // Question 8: Last 7 Days
    if (!last7DaysNone && (tookAntibiotics || otherMedications)) {
      return { eligible: false, reason: "Đã sử dụng thuốc trong 7 ngày qua" };
    }

    // Question 9: Women Only
    if (personalInfo.gender === "female" && !womenQuestionsNone && (isPregnantOrNursing || hadPregnancyTermination)) {
      return { eligible: false, reason: "Không đủ điều kiện về thai sản" };
    }

    return { eligible: true, reason: "" };
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
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
      // TODO_API_REPLACE: Replace with actual API call
      // const response = await fetch(`${config.api.baseUrl}/donations/schedule`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   body: JSON.stringify({
      //     donorId: currentUser.id,
      //     healthSurvey: healthAnswers,
      //     appointmentDate: selectedDate,
      //     timeSlot: selectedTimeSlot,
      //     address: formData.address,
      //     coordinates: coordinates,
      //     distance: distance
      //   })
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   setRegistrationResult({
      //     status: "scheduled",
      //     message: "ĐẶT LỊCH THÀNH CÔNG",
      //     description: "Lịch hẹn hiến máu đã được gửi đến Manager. Bạn sẽ nhận được xác nhận sớm."
      //   });
      // } else {
      //   alert(`Lỗi: ${data.message}`);
      // }

      // MOCK_DATA: Remove this section when implementing real API
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
        appointmentDate: `${appointmentData.preferredDate}T${appointmentData.timeSlot === "morning" ? "09:00:00" : "15:00:00"
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
    const loadUserProfile = async () => {
      try {
        // Lấy thông tin từ localStorage trước
        const storedMemberInfo = JSON.parse(localStorage.getItem("memberInfo") || "{}");

        // Lấy thông tin từ currentUser
        const userProfile = currentUser?.profile || {};

        // Tạo địa chỉ đầy đủ từ các thành phần
        const fullAddress = [
          storedMemberInfo.address || userProfile.address,
          storedMemberInfo.wardName || userProfile.wardName,
          storedMemberInfo.districtName || userProfile.districtName,
          storedMemberInfo.provinceName || userProfile.provinceName,
        ].filter(Boolean).join(", ");

        // Cập nhật personalInfo với thông tin thực từ hồ sơ
        const bloodGroup = storedMemberInfo.bloodGroup || userProfile.bloodGroup || "";
        const rhType = storedMemberInfo.rhType || userProfile.rhType || "";
        let bloodType = "";
        if (bloodGroup && rhType) {
          // Chuẩn hóa ký hiệu Rh
          const rhSymbol = rhType === "Rh+" || rhType === "+" ? "+" : (rhType === "Rh-" || rhType === "-" ? "-" : rhType);
          bloodType = `${bloodGroup}${rhSymbol}`;
        }
        setPersonalInfo((prev) => ({
          ...prev,
          fullName: getUserName(),
          email: storedMemberInfo.email || userProfile.email || currentUser?.email || "",
          phone: storedMemberInfo.phone || userProfile.phone || currentUser?.phone || "",
          dateOfBirth: storedMemberInfo.dateOfBirth
            ? new Date(storedMemberInfo.dateOfBirth).toISOString().split('T')[0]
            : userProfile.dateOfBirth || "",
          gender: storedMemberInfo.gender || userProfile.gender || "",
          address: {
            houseNumber: storedMemberInfo.houseNumber || "",
            street: storedMemberInfo.street || "",
            province: storedMemberInfo.province || "",
            district: storedMemberInfo.district || "",
            ward: storedMemberInfo.ward || "",
            provinceName: storedMemberInfo.provinceName || "",
            districtName: storedMemberInfo.districtName || "",
            wardName: storedMemberInfo.wardName || "",
            fullAddress: fullAddress,
            coordinates: { lat: null, lng: null },
            distance: null,
            travelTime: null,
            formattedAddress: fullAddress,
          },
          bloodType: bloodType,
        }));
        // Set luôn cho healthSurvey
        setHealthSurvey(prev => ({
          ...prev,
          bloodType: bloodType
        }));

        // Nếu có địa chỉ đầy đủ, thực hiện geocoding
        if (fullAddress && fullAddress.length > 10) {
          try {
            // Import NominatimService để geocoding
            const NominatimService = (await import("../../services/nominatimService")).default;
            const geocodeResult = await NominatimService.geocodeAddress(fullAddress);

            if (geocodeResult) {
              setPersonalInfo((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  coordinates: {
                    lat: geocodeResult.lat,
                    lng: geocodeResult.lng,
                  },
                  formattedAddress: geocodeResult.address || fullAddress,
                },
              }));

              // Tính khoảng cách
              const distance = GeolibService.getDistanceToHospital({
                lat: geocodeResult.lat,
                lng: geocodeResult.lng,
              });

              setDistanceInfo({
                distance,
                formattedDistance: GeolibService.formatDistance(distance),
                travelTime: "",
                priority: GeolibService.getDistancePriority(distance),
              });
            }
          } catch (geocodeError) {
            // console.warn("Không thể geocoding địa chỉ:", geocodeError);
          }
        }

      } catch (error) {
        console.error("Lỗi khi load thông tin hồ sơ:", error);

        // Fallback với mock data nếu có lỗi
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
      const distance = GeolibService.getDistanceToHospital(
        personalInfo.location
      );
      setDistanceInfo({
        distance,
        formattedDistance: GeolibService.formatDistance(distance),
        travelTime: "", // Empty travel time
      });
    }
  }, [personalInfo.location]);

  // Auto-fill blood type from personal info
  useEffect(() => {
    if (personalInfo.bloodType && !healthSurvey.bloodType) {
      setHealthSurvey(prev => ({
        ...prev,
        bloodType: personalInfo.bloodType
      }));
    }
  }, [personalInfo.bloodType, healthSurvey.bloodType]);

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Calculate distance when location changes
    if (field === "location" && value) {
      const distance = GeolibService.getDistanceToHospital(value);
      setDistanceInfo({
        distance,
        formattedDistance: GeolibService.formatDistance(distance),
        travelTime: "", // Empty travel time
        priority: GeolibService.getDistancePriority(distance),
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
                    onClick={() => navigate("/member/")}
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
                          bloodType: "",
                          hasDonatedBefore: null,
                          hasCurrentMedicalConditions: null,
                          hasPreviousSeriousConditions: null,
                          otherPreviousConditions: "",
                          hadMalariaSyphilisTuberculosis: false,
                          hadBloodTransfusion: false,
                          hadVaccination: false,
                          last12MonthsNone: false,
                          hadTyphoidSepsis: false,
                          unexplainedWeightLoss: false,
                          persistentLymphNodes: false,
                          invasiveMedicalProcedures: false,
                          tattoosPiercings: false,
                          drugUse: false,
                          bloodExposure: false,
                          livedWithHepatitisB: false,
                          sexualContactWithInfected: false,
                          sameSexContact: false,
                          last6MonthsNone: false,
                          hadUrinaryInfection: false,
                          visitedEpidemicArea: false,
                          last1MonthNone: false,
                          hadFluSymptoms: false,
                          last14DaysNone: false,
                          otherSymptoms: "",
                          tookAntibiotics: false,
                          last7DaysNone: false,
                          otherMedications: "",
                          isPregnantOrNursing: false,
                          hadPregnancyTermination: false,
                          womenQuestionsNone: false,
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
              className={`step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""
                }`}
            >
              <div className="step-number">1</div>
              <div className="step-text">Thông tin cá nhân</div>
            </div>
            <div
              className={`step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""
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
                  <strong>Thông tin đã được điền sẵn từ hồ sơ cá nhân</strong>
                  <p>
                    Các thông tin dưới đây được lấy từ hồ sơ cá nhân của bạn.
                    <span style={{ color: 'red' }}> Bạn không thể chỉnh sửa các thông tin này tại đây.</span>
                    Nếu cần thay đổi, vui lòng cập nhật tại trang hồ sơ cá nhân.
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
                        readOnly
                        disabled
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        readOnly
                        disabled
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
                        readOnly
                        disabled
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
                        readOnly
                        disabled
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      value={personalInfo.gender}
                      disabled
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Address Form */}
                <AddressForm
                  initialAddress={personalInfo.address}
                  onAddressChange={() => { }}
                  readOnly={true}
                />

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
              <p>Vui lòng trả lời các câu hỏi sau để đánh giá tình trạng sức khỏe</p>

              <form className="health-form">
                {/* Basic Health Info */}
                <div className="form-section">
                  <h3>Thông tin cơ bản</h3>

                  {personalInfo.bloodType && (
                    <div className="profile-info-notice" style={{ marginBottom: '1rem' }}>
                      <div className="notice-icon">🩸</div>
                      <div className="notice-content">
                        <strong>Nhóm máu được lấy từ hồ sơ cá nhân.</strong>
                        <p>Nhóm máu: <strong>{personalInfo.bloodType}</strong></p>
                      </div>
                    </div>
                  )}

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

                </div>

                {/* Question 1 */}
                <div className="form-section">
                  <h3>1. Anh/chị từng hiến máu chưa?</h3>
                  <div className="radio-group">
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="hasDonatedBefore"
                        value="true"
                        checked={healthSurvey.hasDonatedBefore === true}
                        onChange={(e) =>
                          handleHealthSurveyChange("hasDonatedBefore", e.target.value === "true")
                        }
                      />
                      <span>Có</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="hasDonatedBefore"
                        value="false"
                        checked={healthSurvey.hasDonatedBefore === false}
                        onChange={(e) =>
                          handleHealthSurveyChange("hasDonatedBefore", e.target.value === "true")
                        }
                      />
                      <span>Không</span>
                    </label>
                  </div>
                </div>

                {/* Question 2 */}
                <div className="form-section">
                  <h3>2. Hiện tại, anh/chị có mắc bệnh lý nào không?</h3>
                  <div className="radio-group">
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="hasCurrentMedicalConditions"
                        value="true"
                        checked={healthSurvey.hasCurrentMedicalConditions === true}
                        onChange={(e) =>
                          handleHealthSurveyChange("hasCurrentMedicalConditions", e.target.value === "true")
                        }
                      />
                      <span>Có</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="hasCurrentMedicalConditions"
                        value="false"
                        checked={healthSurvey.hasCurrentMedicalConditions === false}
                        onChange={(e) =>
                          handleHealthSurveyChange("hasCurrentMedicalConditions", e.target.value === "true")
                        }
                      />
                      <span>Không</span>
                    </label>
                  </div>
                </div>

                {/* Question 3 */}
                <div className="form-section">
                  <h3>3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?</h3>
                  <div className="radio-group">
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="hasPreviousSeriousConditions"
                        value="true"
                        checked={healthSurvey.hasPreviousSeriousConditions === true}
                        onChange={(e) =>
                          handleHealthSurveyChange("hasPreviousSeriousConditions", e.target.value === "true")
                        }
                      />
                      <span>Có</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="hasPreviousSeriousConditions"
                        value="false"
                        checked={healthSurvey.hasPreviousSeriousConditions === false}
                        onChange={(e) =>
                          handleHealthSurveyChange("hasPreviousSeriousConditions", e.target.value === "true")
                        }
                      />
                      <span>Không</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="hasPreviousSeriousConditions"
                        value="other"
                        checked={healthSurvey.hasPreviousSeriousConditions === "other"}
                        onChange={(e) =>
                          handleHealthSurveyChange("hasPreviousSeriousConditions", "other")
                        }
                      />
                      <span>Bệnh khác</span>
                    </label>
                  </div>
                  {healthSurvey.hasPreviousSeriousConditions === "other" && (
                    <div className="form-group">
                      <input
                        type="text"
                        value={healthSurvey.otherPreviousConditions}
                        onChange={(e) =>
                          handleHealthSurveyChange("otherPreviousConditions", e.target.value)
                        }
                        placeholder="Vui lòng mô tả bệnh"
                      />
                    </div>
                  )}
                </div>

                {/* Question 4 */}
                <div className="form-section">
                  <h3>4. Trong 12 tháng gần đây, anh/chị có:</h3>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.hadMalariaSyphilisTuberculosis}
                        onChange={(e) =>
                          handleHealthSurveyChange("hadMalariaSyphilisTuberculosis", e.target.checked)
                        }
                      />
                      <span>Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não-màng não, uốn ván, phẫu thuật ngoại khoa</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.hadBloodTransfusion}
                        onChange={(e) =>
                          handleHealthSurveyChange("hadBloodTransfusion", e.target.checked)
                        }
                      />
                      <span>Được truyền máu hoặc các chế phẩm máu</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.hadVaccination}
                        onChange={(e) =>
                          handleHealthSurveyChange("hadVaccination", e.target.checked)
                        }
                      />
                      <span>Tiêm Vacxin</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.last12MonthsNone}
                        onChange={(e) =>
                          handleHealthSurveyChange("last12MonthsNone", e.target.checked)
                        }
                      />
                      <span>Không</span>
                    </label>
                  </div>
                </div>

                {/* Question 5 */}
                <div className="form-section">
                  <h3>5. Trong 06 tháng gần đây, anh/chị có:</h3>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.hadTyphoidSepsis}
                        onChange={(e) =>
                          handleHealthSurveyChange("hadTyphoidSepsis", e.target.checked)
                        }
                      />
                      <span>Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tụy, viêm tủy xương</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.unexplainedWeightLoss}
                        onChange={(e) =>
                          handleHealthSurveyChange("unexplainedWeightLoss", e.target.checked)
                        }
                      />
                      <span>Sút cân nhanh không rõ nguyên nhân</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.persistentLymphNodes}
                        onChange={(e) =>
                          handleHealthSurveyChange("persistentLymphNodes", e.target.checked)
                        }
                      />
                      <span>Nổi hạch kéo dài</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.invasiveMedicalProcedures}
                        onChange={(e) =>
                          handleHealthSurveyChange("invasiveMedicalProcedures", e.target.checked)
                        }
                      />
                      <span>Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,…)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.tattoosPiercings}
                        onChange={(e) =>
                          handleHealthSurveyChange("tattoosPiercings", e.target.checked)
                        }
                      />
                      <span>Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.drugUse}
                        onChange={(e) =>
                          handleHealthSurveyChange("drugUse", e.target.checked)
                        }
                      />
                      <span>Sử dụng ma túy</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.bloodExposure}
                        onChange={(e) =>
                          handleHealthSurveyChange("bloodExposure", e.target.checked)
                        }
                      />
                      <span>Tiếp xúc trực tiếp với máu, dịch tiết của người khác hoặc bị thương bởi kim tiêm</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.livedWithHepatitisB}
                        onChange={(e) =>
                          handleHealthSurveyChange("livedWithHepatitisB", e.target.checked)
                        }
                      />
                      <span>Sinh sống chung với người nhiễm bệnh Viêm gan siêu vi B</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.sexualContactWithInfected}
                        onChange={(e) =>
                          handleHealthSurveyChange("sexualContactWithInfected", e.target.checked)
                        }
                      />
                      <span>Quan hệ tình dục với người nhiễm viêm gan siêu vi B, C, HIV, giang mai hoặc người có nguy cơ nhiễm viêm gan siêu vi B, C, HIV, giang mai</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.sameSexContact}
                        onChange={(e) =>
                          handleHealthSurveyChange("sameSexContact", e.target.checked)
                        }
                      />
                      <span>Quan hệ tình dục với người cùng giới</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.last6MonthsNone}
                        onChange={(e) =>
                          handleHealthSurveyChange("last6MonthsNone", e.target.checked)
                        }
                      />
                      <span>Không</span>
                    </label>
                  </div>
                </div>

                {/* Question 6 */}
                <div className="form-section">
                  <h3>6. Trong 01 tháng gần đây, anh/chị có:</h3>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.hadUrinaryInfection}
                        onChange={(e) =>
                          handleHealthSurveyChange("hadUrinaryInfection", e.target.checked)
                        }
                      />
                      <span>Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.visitedEpidemicArea}
                        onChange={(e) =>
                          handleHealthSurveyChange("visitedEpidemicArea", e.target.checked)
                        }
                      />
                      <span>Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,…)</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.last1MonthNone}
                        onChange={(e) =>
                          handleHealthSurveyChange("last1MonthNone", e.target.checked)
                        }
                      />
                      <span>Không</span>
                    </label>
                  </div>
                </div>

                {/* Question 7 */}
                <div className="form-section">
                  <h3>7. Trong 14 ngày gần đây, anh/chị có:</h3>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.hadFluSymptoms}
                        onChange={(e) =>
                          handleHealthSurveyChange("hadFluSymptoms", e.target.checked)
                        }
                      />
                      <span>Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.last14DaysNone}
                        onChange={(e) =>
                          handleHealthSurveyChange("last14DaysNone", e.target.checked)
                        }
                      />
                      <span>Không</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.otherSymptoms}
                        onChange={(e) =>
                          handleHealthSurveyChange("otherSymptoms", e.target.checked)
                        }
                      />
                      <span>Khác (cụ thể)</span>
                    </label>
                  </div>
                  {healthSurvey.otherSymptoms && (
                    <div className="form-group">
                      <input
                        type="text"
                        value={healthSurvey.otherSymptoms}
                        onChange={(e) =>
                          handleHealthSurveyChange("otherSymptoms", e.target.value)
                        }
                        placeholder="Vui lòng mô tả triệu chứng"
                      />
                    </div>
                  )}
                </div>

                {/* Question 8 */}
                <div className="form-section">
                  <h3>8. Trong 07 ngày gần đây, anh/chị có:</h3>
                  <div className="checkbox-list">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.tookAntibiotics}
                        onChange={(e) =>
                          handleHealthSurveyChange("tookAntibiotics", e.target.checked)
                        }
                      />
                      <span>Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.last7DaysNone}
                        onChange={(e) =>
                          handleHealthSurveyChange("last7DaysNone", e.target.checked)
                        }
                      />
                      <span>Không</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={healthSurvey.otherMedications}
                        onChange={(e) =>
                          handleHealthSurveyChange("otherMedications", e.target.checked)
                        }
                      />
                      <span>Khác (cụ thể)</span>
                    </label>
                  </div>
                  {healthSurvey.otherMedications && (
                    <div className="form-group">
                      <input
                        type="text"
                        value={healthSurvey.otherMedications}
                        onChange={(e) =>
                          handleHealthSurveyChange("otherMedications", e.target.value)
                        }
                        placeholder="Vui lòng mô tả thuốc"
                      />
                    </div>
                  )}
                </div>

                {/* Question 9 - Women Only */}
                {personalInfo.gender === "female" && (
                  <div className="form-section">
                    <h3>9. Câu hỏi dành cho phụ nữ:</h3>
                    <div className="checkbox-list">
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={healthSurvey.isPregnantOrNursing}
                          onChange={(e) =>
                            handleHealthSurveyChange("isPregnantOrNursing", e.target.checked)
                          }
                        />
                        <span>Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={healthSurvey.hadPregnancyTermination}
                          onChange={(e) =>
                            handleHealthSurveyChange("hadPregnancyTermination", e.target.checked)
                          }
                        />
                        <span>Chấm dứt thai kỳ trong 12 tháng gần đây (sảy thai, phá thai, thai ngoài tử cung)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={healthSurvey.womenQuestionsNone}
                          onChange={(e) =>
                            handleHealthSurveyChange("womenQuestionsNone", e.target.checked)
                          }
                        />
                        <span>Không</span>
                      </label>
                    </div>
                  </div>
                )}

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
