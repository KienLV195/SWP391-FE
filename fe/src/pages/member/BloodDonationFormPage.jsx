import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Steps,
  Form,
  Input,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
  Button,
  Alert,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Divider
} from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  HeartOutlined,
  CalendarOutlined,
  RightOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CloseOutlined
} from "@ant-design/icons";
import MemberNavbar from "../../components/member/MemberNavbar";
import AddressForm from "../../components/member/AddressForm";
import authService from "../../services/authService";
import NotificationService from "../../services/notificationService";
import GeolibService from "../../services/geolibService";
import { DONATION_STATUS, BLOOD_TYPES } from "../../constants/systemConstants";
import { getUserName } from "../../utils/userUtils";
import dayjs from "dayjs";
import Footer from "../../components/common/Footer";
import axios from "axios";
import "../../styles/pages/BloodDonationFormPage.scss";

const { Title, Text } = Typography;

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
    lastDonationDate: "", // New field for last donation date

    // Question 2: Current Medical Conditions
    hasCurrentMedicalConditions: null, // true/false/null
    currentMedicalConditionsDetail: "", // New field for current medical conditions detail

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
    hasOtherSymptoms: false, // checkbox for "Khác (cụ thể)"
    otherSymptoms: "", // text input for other symptoms

    // Question 8: Last 7 Days
    tookAntibiotics: false,
    last7DaysNone: false,
    hasOtherMedications: false, // checkbox for "Khác (cụ thể)"
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

  const handleHealthSurveyChange = (field, value) => {
    setHealthSurvey((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper function để xử lý logic checkbox cho các câu hỏi
  const handleCheckboxChange = (field, value, noneField, otherFields = []) => {
    if (field === noneField) {
      // Nếu chọn "Không", bỏ chọn tất cả các checkbox khác
      if (value) {
        const updates = { [field]: value };
        otherFields.forEach(otherField => {
          updates[otherField] = false;
        });
        setHealthSurvey(prev => ({ ...prev, ...updates }));
      } else {
        handleHealthSurveyChange(field, value);
      }
    } else {
      // Nếu chọn checkbox khác, bỏ chọn "Không"
      if (value) {
        setHealthSurvey(prev => ({
          ...prev,
          [field]: value,
          [noneField]: false
        }));
      } else {
        handleHealthSurveyChange(field, value);
      }
    }
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
    // Validate required fields for health survey
    const requiredFields = [
      "weight",
      "hasDonatedBefore",
      "hasCurrentMedicalConditions",
      "hasPreviousSeriousConditions",
      // Câu 4
      "hadMalariaSyphilisTuberculosis",
      "hadBloodTransfusion",
      "hadVaccination",
      "last12MonthsNone",
      // Câu 5
      "hadTyphoidSepsis",
      "unexplainedWeightLoss",
      "persistentLymphNodes",
      "invasiveMedicalProcedures",
      "tattoosPiercings",
      "drugUse",
      "bloodExposure",
      "livedWithHepatitisB",
      "sexualContactWithInfected",
      "sameSexContact",
      "last6MonthsNone",
      // Câu 6
      "hadUrinaryInfection",
      "visitedEpidemicArea",
      "last1MonthNone",
      // Câu 7
      "hadFluSymptoms",
      "last14DaysNone",
      // Câu 8
      "tookAntibiotics",
      "last7DaysNone"
    ];
    // Nếu là nữ thì thêm câu 9
    if (personalInfo.gender === "female") {
      requiredFields.push("isPregnantOrNursing", "hadPregnancyTermination", "womenQuestionsNone");
    }

    // Kiểm tra cân nặng
    if (!healthSurvey.weight) {
      alert("Vui lòng nhập cân nặng của bạn để tiếp tục khảo sát sức khỏe!");
      return;
    }

    // Kiểm tra các câu hỏi radio/checkbox
    // Câu 1
    if (healthSurvey.hasDonatedBefore === null || healthSurvey.hasDonatedBefore === undefined) {
      alert("Vui lòng trả lời câu hỏi 1: Anh/chị từng hiến máu chưa?");
      return;
    }
    // Nếu chọn Có thì phải chọn ngày
    if (healthSurvey.hasDonatedBefore === true && !healthSurvey.lastDonationDate) {
      alert("Vui lòng chọn ngày hiến máu gần nhất!");
      return;
    }
    // Câu 2
    if (healthSurvey.hasCurrentMedicalConditions === null || healthSurvey.hasCurrentMedicalConditions === undefined) {
      alert("Vui lòng trả lời câu hỏi 2: Hiện tại, anh/chị có mắc bệnh lý nào không?");
      return;
    }
    // Nếu chọn Có thì phải nhập chi tiết
    if (healthSurvey.hasCurrentMedicalConditions === true && !healthSurvey.currentMedicalConditionsDetail) {
      alert("Vui lòng ghi rõ bệnh lý hiện tại!");
      return;
    }
    // Câu 3
    if (healthSurvey.hasPreviousSeriousConditions === null || healthSurvey.hasPreviousSeriousConditions === undefined) {
      alert("Vui lòng trả lời câu hỏi 3: Tiền sử bệnh nghiêm trọng?");
      return;
    }
    if (healthSurvey.hasPreviousSeriousConditions === "other" && !healthSurvey.otherPreviousConditions) {
      alert("Vui lòng mô tả bệnh nghiêm trọng khác!");
      return;
    }
    // Câu 4-8: Ít nhất phải chọn 1 checkbox mỗi nhóm
    // Câu 4
    if (!(
      healthSurvey.hadMalariaSyphilisTuberculosis ||
      healthSurvey.hadBloodTransfusion ||
      healthSurvey.hadVaccination ||
      healthSurvey.last12MonthsNone
    )) {
      alert("Vui lòng chọn ít nhất 1 đáp án cho câu hỏi 4!");
      return;
    }
    // Câu 5
    if (!(
      healthSurvey.hadTyphoidSepsis ||
      healthSurvey.unexplainedWeightLoss ||
      healthSurvey.persistentLymphNodes ||
      healthSurvey.invasiveMedicalProcedures ||
      healthSurvey.tattoosPiercings ||
      healthSurvey.drugUse ||
      healthSurvey.bloodExposure ||
      healthSurvey.livedWithHepatitisB ||
      healthSurvey.sexualContactWithInfected ||
      healthSurvey.sameSexContact ||
      healthSurvey.last6MonthsNone
    )) {
      alert("Vui lòng chọn ít nhất 1 đáp án cho câu hỏi 5!");
      return;
    }
    // Câu 6
    if (!(
      healthSurvey.hadUrinaryInfection ||
      healthSurvey.visitedEpidemicArea ||
      healthSurvey.last1MonthNone
    )) {
      alert("Vui lòng chọn ít nhất 1 đáp án cho câu hỏi 6!");
      return;
    }
    // Câu 7
    if (!(
      healthSurvey.hadFluSymptoms ||
      healthSurvey.last14DaysNone ||
      (typeof healthSurvey.otherSymptoms === "string" && healthSurvey.otherSymptoms)
    )) {
      alert("Vui lòng chọn ít nhất 1 đáp án cho câu hỏi 7!");
      return;
    }
    // Nếu chọn Khác (cụ thể) thì phải nhập text
    if (!!healthSurvey.otherSymptoms && typeof healthSurvey.otherSymptoms === "string" && healthSurvey.otherSymptoms.trim() === "") {
      alert("Vui lòng mô tả triệu chứng ở câu hỏi 7!");
      return;
    }
    // Câu 8
    if (!(
      healthSurvey.tookAntibiotics ||
      healthSurvey.last7DaysNone ||
      (typeof healthSurvey.otherMedications === "string" && healthSurvey.otherMedications)
    )) {
      alert("Vui lòng chọn ít nhất 1 đáp án cho câu hỏi 8!");
      return;
    }
    if (!!healthSurvey.otherMedications && typeof healthSurvey.otherMedications === "string" && healthSurvey.otherMedications.trim() === "") {
      alert("Vui lòng mô tả thuốc ở câu hỏi 8!");
      return;
    }
    // Câu 9 (nữ)
    if (personalInfo.gender === "female") {
      if (!(
        healthSurvey.isPregnantOrNursing ||
        healthSurvey.hadPregnancyTermination ||
        healthSurvey.womenQuestionsNone
      )) {
        alert("Vui lòng chọn ít nhất 1 đáp án cho câu hỏi 9!");
        return;
      }
    }
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

    // Validate required fields for appointment
    if (!appointmentData.preferredDate) {
      setLoading(false);
      alert("Vui lòng chọn ngày đặt lịch!");
      return;
    }
    if (!appointmentData.timeSlot) {
      setLoading(false);
      alert("Vui lòng chọn khung giờ đặt lịch!");
      return;
    }
    if (!healthSurvey.weight) {
      setLoading(false);
      alert("Vui lòng nhập cân nặng!");
      return;
    }

    // Validate 84-day gap if user has donated before
    if (healthSurvey.hasDonatedBefore && healthSurvey.lastDonationDate) {
      const lastDonationDate = dayjs(healthSurvey.lastDonationDate);
      const appointmentDate = dayjs(appointmentData.preferredDate);
      const daysDifference = appointmentDate.diff(lastDonationDate, 'day');

      if (daysDifference < 84) {
        const earliestDate = lastDonationDate.add(84, 'day');
        setLoading(false);
        alert(`Bạn cần chờ ít nhất 84 ngày từ lần hiến máu gần nhất (${lastDonationDate.format('DD/MM/YYYY')}). Ngày sớm nhất có thể hiến máu là: ${earliestDate.format('DD/MM/YYYY')}`);
        return;
      }
    }

    try {
      // Prepare API payload according to the schema
      // Fix timezone issue by using local date format or setting specific time
      const requestedDate = dayjs(appointmentData.preferredDate).format('YYYY-MM-DD') + 'T12:00:00.000Z';
      const lastDonationDateFormatted = healthSurvey.hasDonatedBefore && healthSurvey.lastDonationDate
        ? dayjs(healthSurvey.lastDonationDate).format('YYYY-MM-DD') + 'T12:00:00.000Z'
        : null;

      const apiPayload = {
        userId: parseInt(currentUser.id),
        requestedDonationDate: requestedDate,
        timeSlot: appointmentData.timeSlot === "morning" ? "Sáng (7:00-12:00)" : "Chiều (13:00-17:00)",
        weight: parseFloat(healthSurvey.weight),
        height: healthSurvey.height ? parseFloat(healthSurvey.height) : null,
        hasDonated: healthSurvey.hasDonatedBefore === true,
        lastDonationDate: lastDonationDateFormatted
      };

      console.log("Sending blood donation appointment request:", apiPayload);
      console.log("API URL:", import.meta.env.VITE_BLOOD_DONATION_API);
      console.log("Auth token:", localStorage.getItem('authToken') ? 'Present' : 'Missing');

      // Call the blood donation API
      const BLOOD_DONATION_API = import.meta.env.VITE_BLOOD_DONATION_API;
      const response = await axios.post(BLOOD_DONATION_API, apiPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      console.log("Blood donation appointment response:", response.data);

      // Send notification
      await NotificationService.sendAppointmentReminder(currentUser.id, {
        id: Date.now(),
        appointmentDate: `${appointmentData.preferredDate}T${appointmentData.timeSlot === "morning" ? "09:00:00" : "15:00:00"}`,
        location: "Bệnh viện Đa khoa Ánh Dương - Khoa Huyết học, Tầng 2",
      });

      setRegistrationResult({
        status: "scheduled",
        message: "ĐẶT LỊCH THÀNH CÔNG",
        description: "Lịch hẹn hiến máu đã được gửi đến Manager. Bạn sẽ nhận được xác nhận sớm.",
      });
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      // Handle different types of API errors
      let errorMessage = "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.";

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        console.log("Server error details:", data);

        if (status === 400) {
          // Try to extract detailed error message from server response
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data?.message) {
            errorMessage = data.message;
          } else if (data?.errors) {
            // Handle validation errors
            const validationErrors = Object.values(data.errors).flat();
            errorMessage = validationErrors.join(', ');
          } else if (data?.title) {
            errorMessage = data.title;
          } else {
            errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
          }
        } else if (status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (status === 409) {
          errorMessage = data?.message || "Lịch hẹn bị trùng. Vui lòng chọn thời gian khác.";
        } else if (status >= 500) {
          errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
        } else {
          errorMessage = data?.message || errorMessage;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
      }

      setRegistrationResult({
        status: "error",
        message: "LỖI ĐẶT LỊCH",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotText = (slot) => {
    return slot === "morning" ? "7:00 - 12:00 (Sáng)" : "13:00 - 17:00 (Chiều)";
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
            ? storedMemberInfo.dateOfBirth.split("T")[0] // Chỉ lấy phần ngày
            : userProfile.dateOfBirth ? userProfile.dateOfBirth.split("T")[0] : "",
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
      registrationResult.status === "scheduled" ||
      registrationResult.status === "error")
  ) {
    return (
      <div className="blood-donation-form-page">


        <div className="registration-content">
          <div className="result-section">
            <div className={`result-card ${registrationResult.status}`}>
              <div className="result-icon">
                {registrationResult.status === "failed" || registrationResult.status === "error" ? <CloseOutlined /> : <CheckOutlined />}
              </div>
              <div className="result-content">
                <h2>{registrationResult.message}</h2>
                <p>{registrationResult.description}</p>

                {registrationResult.status === "scheduled" && (
                  <div className="appointment-summary">
                    <h3>Thông tin lịch hẹn</h3>
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

                  {(registrationResult.status === "failed" || registrationResult.status === "error") && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setRegistrationResult(null);
                        // For error status, go back to appointment step (step 3)
                        // For failed status, go back to beginning (step 1)
                        if (registrationResult.status === "error") {
                          setStep(3);
                        } else {
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
                        }
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
          {/* Hero Section */}
          <div className="hero-section">
            {/* Background decoration */}
            <div className="hero-decoration-1" />
            <div className="hero-decoration-2" />

            <div className="hero-content">
              <Title level={1} className="hero-title " >
                🩸 Đăng ký hiến máu
              </Title>
              <Text className="hero-subtitle">
                Hoàn thành các bước để đăng ký hiến máu
              </Text>
              
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="steps-navigation">
            <Steps
              current={step - 1}
              className="custom-steps"
              size="default"
              items={[
                {
                  title: <span className="step-title">Thông tin cá nhân</span>,
                  icon: <UserOutlined className="step-icon" />,
                  description: <span className="step-description">Kiểm tra & xác nhận thông tin</span>
                },
                {
                  title: <span className="step-title">Khảo sát sức khỏe</span>,
                  icon: <HeartOutlined className="step-icon" />,
                  description: <span className="step-description">Đánh giá tình trạng sức khỏe</span>
                },
                {
                  title: <span className="step-title">Đặt lịch hẹn</span>,
                  icon: <CalendarOutlined className="step-icon" />,
                  description: <span className="step-description">Chọn thời gian phù hợp</span>
                }
              ]}
            />
          </div>
        </div>

        {step === 1 && (
          <Card
            title={
              <div className="card-title">
                <UserOutlined className="title-icon" />
                <span>Thông tin cá nhân</span>
              </div>
            }
            className="form-card"
            styles={{
              header: {
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px 12px 0 0',
                borderBottom: '2px solid #1890ff'
              }
            }}
          >
            <div className="info-section">
              <Text className="info-text">
                <CheckOutlined/> Vui lòng kiểm tra và xác nhận thông tin cá nhân của bạn
              </Text>

              <Alert
                message={
                  <span className="alert-title">
                     Thông tin đã được điền sẵn từ hồ sơ cá nhân
                  </span>
                }
                description={
                  <div className="alert-description">
                    <Text>
                       Các thông tin dưới đây được lấy từ hồ sơ cá nhân của bạn và
                      <Text type="danger" strong> không thể chỉnh sửa tại đây</Text>.
                    </Text>
                    <br />
                    <Text type="secondary">
                       Nếu cần thay đổi, vui lòng cập nhật tại trang
                      <Text strong className="alert-link" onClick={() => navigate("/member/profile")}> Hồ sơ cá nhân</Text>.
                    </Text>
                  </div>
                }
                type="info"
                icon={<InfoCircleOutlined />}
                className="custom-alert"
              />
            </div>

            <Form layout="vertical">
              <div className="personal-info-header">
                <Title level={4} className="header-title">
                   Thông tin cơ bản
                </Title>
              </div>

              <div className="personal-info-section">
                <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className="form-label">Họ và tên</span>}
                    required
                  >
                    <Input
                      value={personalInfo.fullName}
                      disabled
                      placeholder="Nhập họ và tên"
                      className="disabled-input"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={<span className="form-label">Email</span>}>
                    <Input
                      value={personalInfo.email}
                      disabled
                      placeholder="Nhập email"
                      className="disabled-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="form-label">Số điện thoại</span>}
                      required
                    >
                      <Input
                        value={personalInfo.phone}
                        disabled
                        placeholder="Nhập số điện thoại"
                        className="disabled-input"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className="form-label">Ngày sinh</span>}
                      required
                    >
                      <DatePicker
                        value={personalInfo.dateOfBirth ? dayjs(personalInfo.dateOfBirth) : null}
                        disabled
                        className="disabled-datepicker"
                        placeholder="Chọn ngày sinh"
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label={<span className="form-label"> Giới tính</span>}>
                  <Radio.Group
                    value={personalInfo.gender}
                    disabled
                    className="radio-group"
                  >
                    <Radio value="male" className="radio-item">Nam</Radio>
                    <Radio value="female" className="radio-item">Nữ</Radio>
                    <Radio value="other" className="radio-item">Khác</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>

              <Divider />

              {/* Address Form */}
              <AddressForm
                initialAddress={personalInfo.address}
                onAddressChange={() => { }}
                readOnly={true}
              />

              <div className="submit-section">
                <Button
                  type="primary"
                  size="large"
                  onClick={handlePersonalInfoSubmit}
                  icon={<RightOutlined />}
                  className="submit-button"
                >
                   Tiếp tục đến khảo sát sức khỏe
                </Button>
              </div>
            </Form>
          </Card>
        )}

        {step === 2 && (
          <Card
            title={
              <Space>
                <HeartOutlined />
                <span>Khảo sát sức khỏe</span>
              </Space>
            }
            className="health-survey-card"
          >
            <Text className="survey-description">
              Vui lòng trả lời các câu hỏi sau để đánh giá tình trạng sức khỏe
            </Text>

            <Form layout="vertical">
              {/* Basic Health Info */}
              <Title level={4} className="section-title">Thông tin cơ bản</Title>

              {personalInfo.bloodType && (
                <Alert
                  message="Nhóm máu được lấy từ hồ sơ cá nhân"
                  description={`Nhóm máu: ${personalInfo.bloodType}`}
                  type="info"
                  icon={<InfoCircleOutlined />}
                  className="blood-type-alert"
                />
              )}

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Cân nặng (kg)" required>
                    <InputNumber
                      value={healthSurvey.weight}
                      onChange={(value) => handleHealthSurveyChange("weight", value)}
                      placeholder="Nhập cân nặng"
                      min={30}
                      max={200}
                      className="input-number"
                      addonAfter="kg"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Chiều cao (cm)">
                    <InputNumber
                      value={healthSurvey.height}
                      onChange={(value) => handleHealthSurveyChange("height", value)}
                      placeholder="Nhập chiều cao"
                      min={100}
                      max={250}
                      className="input-number"
                      addonAfter="cm"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              {/* Question 1 */}
              <Title level={5}>1. Anh/chị từng hiến máu chưa?</Title>
              <Form.Item>
                <Radio.Group
                  value={healthSurvey.hasDonatedBefore}
                  onChange={(e) => handleHealthSurveyChange("hasDonatedBefore", e.target.value)}
                >
                  <Radio value={true}>Có</Radio>
                  <Radio value={false}>Không</Radio>
                </Radio.Group>
              </Form.Item>

              {healthSurvey.hasDonatedBefore === true && (
                <Form.Item label="Ngày hiến máu gần nhất" required>
                  <DatePicker
                    value={healthSurvey.lastDonationDate ? dayjs(healthSurvey.lastDonationDate) : null}
                    onChange={(date) => {
                      if (date && date.isAfter(dayjs())) {
                        alert("Không được chọn ngày trong tương lai!");
                        handleHealthSurveyChange("lastDonationDate", "");
                      } else {
                        handleHealthSurveyChange("lastDonationDate", date ? date.format('YYYY-MM-DD') : "");
                      }
                    }}
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                    className="datepicker-full"
                    placeholder="Chọn ngày hiến máu gần nhất"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              )}

              <Divider />

              {/* Question 2 */}
              <Title level={5}>2. Hiện tại, anh/chị có mắc bệnh lý nào không?</Title>
              <Form.Item>
                <Radio.Group
                  value={healthSurvey.hasCurrentMedicalConditions}
                  onChange={(e) => handleHealthSurveyChange("hasCurrentMedicalConditions", e.target.value)}
                >
                  <Radio value={true}>Có</Radio>
                  <Radio value={false}>Không</Radio>
                </Radio.Group>
              </Form.Item>

              {healthSurvey.hasCurrentMedicalConditions === true && (
                <Form.Item label="Một số bệnh lý hiện tại">
                  <Input.TextArea
                    value={healthSurvey.currentMedicalConditionsDetail || ""}
                    onChange={(e) => handleHealthSurveyChange("currentMedicalConditionsDetail", e.target.value)}
                    placeholder="Vui lòng ghi rõ bệnh lý nếu có"
                    rows={3}
                  />
                </Form.Item>
              )}

              <Divider />

              {/* Question 3 */}
              <Title level={5}>
                3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến,
                phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ,
                động kinh, ung thư, hen, được cấy ghép mô tạng?
              </Title>
              <Form.Item>
                <Radio.Group
                  value={healthSurvey.hasPreviousSeriousConditions}
                  onChange={(e) => handleHealthSurveyChange("hasPreviousSeriousConditions", e.target.value)}
                >
                  <Radio value={true}>Có</Radio>
                  <Radio value={false}>Không</Radio>
                  <Radio value="other">Bệnh khác</Radio>
                </Radio.Group>
              </Form.Item>

              {healthSurvey.hasPreviousSeriousConditions === "other" && (
                <Form.Item label="Mô tả bệnh khác">
                  <Input
                    value={healthSurvey.otherPreviousConditions}
                    onChange={(e) => handleHealthSurveyChange("otherPreviousConditions", e.target.value)}
                    placeholder="Vui lòng mô tả bệnh"
                  />
                </Form.Item>
              )}

              <Divider />

              {/* Question 4 */}
              <Title level={5}>4. Trong 12 tháng gần đây, anh/chị có:</Title>
              <Form.Item>
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hadMalariaSyphilisTuberculosis}
                      onChange={(e) => handleCheckboxChange(
                        "hadMalariaSyphilisTuberculosis",
                        e.target.checked,
                        "last12MonthsNone",
                        ["hadMalariaSyphilisTuberculosis", "hadBloodTransfusion", "hadVaccination"]
                      )}
                    >
                      Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não-màng não, uốn ván, phẫu thuật ngoại khoa
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hadBloodTransfusion}
                      onChange={(e) => handleCheckboxChange(
                        "hadBloodTransfusion",
                        e.target.checked,
                        "last12MonthsNone",
                        ["hadMalariaSyphilisTuberculosis", "hadBloodTransfusion", "hadVaccination"]
                      )}
                    >
                      Được truyền máu hoặc các chế phẩm máu
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hadVaccination}
                      onChange={(e) => handleCheckboxChange(
                        "hadVaccination",
                        e.target.checked,
                        "last12MonthsNone",
                        ["hadMalariaSyphilisTuberculosis", "hadBloodTransfusion", "hadVaccination"]
                      )}
                    >
                      Tiêm Vacxin
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.last12MonthsNone}
                      onChange={(e) => handleCheckboxChange(
                        "last12MonthsNone",
                        e.target.checked,
                        "last12MonthsNone",
                        ["hadMalariaSyphilisTuberculosis", "hadBloodTransfusion", "hadVaccination"]
                      )}
                    >
                      Không
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>

              <Divider />

              {/* Question 5 */}
              <Title level={5}>5. Trong 06 tháng gần đây, anh/chị có:</Title>
              <Form.Item>
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hadTyphoidSepsis}
                      onChange={(e) => handleCheckboxChange(
                        "hadTyphoidSepsis",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tụy, viêm tủy xương
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.unexplainedWeightLoss}
                      onChange={(e) => handleCheckboxChange(
                        "unexplainedWeightLoss",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Sút cân nhanh không rõ nguyên nhân
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.persistentLymphNodes}
                      onChange={(e) => handleCheckboxChange(
                        "persistentLymphNodes",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Nổi hạch kéo dài
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.invasiveMedicalProcedures}
                      onChange={(e) => handleCheckboxChange(
                        "invasiveMedicalProcedures",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,…)
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.tattoosPiercings}
                      onChange={(e) => handleCheckboxChange(
                        "tattoosPiercings",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.drugUse}
                      onChange={(e) => handleCheckboxChange(
                        "drugUse",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Sử dụng ma túy
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.bloodExposure}
                      onChange={(e) => handleCheckboxChange(
                        "bloodExposure",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Tiếp xúc trực tiếp với máu, dịch tiết của người khác hoặc bị thương bởi kim tiêm
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.livedWithHepatitisB}
                      onChange={(e) => handleCheckboxChange(
                        "livedWithHepatitisB",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Sinh sống chung với người nhiễm bệnh Viêm gan siêu vi B
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.sexualContactWithInfected}
                      onChange={(e) => handleCheckboxChange(
                        "sexualContactWithInfected",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Quan hệ tình dục với người nhiễm viêm gan siêu vi B, C, HIV, giang mai hoặc người có nguy cơ nhiễm viêm gan siêu vi B, C, HIV, giang mai
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.sameSexContact}
                      onChange={(e) => handleCheckboxChange(
                        "sameSexContact",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Quan hệ tình dục với người cùng giới
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.last6MonthsNone}
                      onChange={(e) => handleCheckboxChange(
                        "last6MonthsNone",
                        e.target.checked,
                        "last6MonthsNone",
                        ["hadTyphoidSepsis", "unexplainedWeightLoss", "persistentLymphNodes", "invasiveMedicalProcedures", "tattoosPiercings", "drugUse", "bloodExposure", "livedWithHepatitisB", "sexualContactWithInfected", "sameSexContact"]
                      )}
                    >
                      Không
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>

              <Divider />

              {/* Question 6 */}
              <Title level={5}>6. Trong 01 tháng gần đây, anh/chị có:</Title>
              <Form.Item>
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hadUrinaryInfection}
                      onChange={(e) => handleCheckboxChange(
                        "hadUrinaryInfection",
                        e.target.checked,
                        "last1MonthNone",
                        ["hadUrinaryInfection", "visitedEpidemicArea"]
                      )}
                    >
                      Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.visitedEpidemicArea}
                      onChange={(e) => handleCheckboxChange(
                        "visitedEpidemicArea",
                        e.target.checked,
                        "last1MonthNone",
                        ["hadUrinaryInfection", "visitedEpidemicArea"]
                      )}
                    >
                      Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,…)
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.last1MonthNone}
                      onChange={(e) => handleCheckboxChange(
                        "last1MonthNone",
                        e.target.checked,
                        "last1MonthNone",
                        ["hadUrinaryInfection", "visitedEpidemicArea"]
                      )}
                    >
                      Không
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>

              <Divider />

              {/* Question 7 */}
              <Title level={5}>7. Trong 14 ngày gần đây, anh/chị có:</Title>
              <Form.Item>
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hadFluSymptoms}
                      onChange={(e) => handleCheckboxChange(
                        "hadFluSymptoms",
                        e.target.checked,
                        "last14DaysNone",
                        ["hadFluSymptoms"]
                      )}
                    >
                      Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.last14DaysNone}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Nếu chọn "Không" thì bỏ chọn tất cả và xóa text
                          setHealthSurvey(prev => ({
                            ...prev,
                            last14DaysNone: true,
                            hadFluSymptoms: false,
                            hasOtherSymptoms: false,
                            otherSymptoms: ""
                          }));
                        } else {
                          handleHealthSurveyChange("last14DaysNone", false);
                        }
                      }}
                    >
                      Không
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hasOtherSymptoms}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Khi chọn "Khác", bỏ chọn "Không" và hiện ô nhập
                          setHealthSurvey(prev => ({
                            ...prev,
                            last14DaysNone: false,
                            hasOtherSymptoms: true,
                            otherSymptoms: ""
                          }));
                        } else {
                          // Khi bỏ chọn "Khác", xóa text và set về false
                          setHealthSurvey(prev => ({
                            ...prev,
                            hasOtherSymptoms: false,
                            otherSymptoms: ""
                          }));
                        }
                      }}
                    >
                      Khác (cụ thể)
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>

              {healthSurvey.hasOtherSymptoms && (
                <Form.Item label="Mô tả triệu chứng khác">
                  <Input
                    value={healthSurvey.otherSymptoms}
                    onChange={(e) => handleHealthSurveyChange("otherSymptoms", e.target.value)}
                    placeholder="Vui lòng mô tả triệu chứng"
                  />
                </Form.Item>
              )}

              <Divider />

              {/* Question 8 */}
              <Title level={5}>8. Trong 07 ngày gần đây, anh/chị có:</Title>
              <Form.Item>
                <Row gutter={[0, 8]}>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.tookAntibiotics}
                      onChange={(e) => handleCheckboxChange(
                        "tookAntibiotics",
                        e.target.checked,
                        "last7DaysNone",
                        ["tookAntibiotics"]
                      )}
                    >
                      Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.last7DaysNone}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Nếu chọn "Không" thì bỏ chọn tất cả và xóa text
                          setHealthSurvey(prev => ({
                            ...prev,
                            last7DaysNone: true,
                            tookAntibiotics: false,
                            hasOtherMedications: false,
                            otherMedications: ""
                          }));
                        } else {
                          handleHealthSurveyChange("last7DaysNone", false);
                        }
                      }}
                    >
                      Không
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox
                      checked={healthSurvey.hasOtherMedications}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Khi chọn "Khác", bỏ chọn "Không" và hiện ô nhập
                          setHealthSurvey(prev => ({
                            ...prev,
                            last7DaysNone: false,
                            hasOtherMedications: true,
                            otherMedications: ""
                          }));
                        } else {
                          // Khi bỏ chọn "Khác", xóa text và set về false
                          setHealthSurvey(prev => ({
                            ...prev,
                            hasOtherMedications: false,
                            otherMedications: ""
                          }));
                        }
                      }}
                    >
                      Khác (cụ thể)
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>

              {healthSurvey.hasOtherMedications && (
                <Form.Item label="Mô tả thuốc khác">
                  <Input
                    value={healthSurvey.otherMedications}
                    onChange={(e) => handleHealthSurveyChange("otherMedications", e.target.value)}
                    placeholder="Vui lòng mô tả thuốc"
                  />
                </Form.Item>
              )}

              <Divider />

              {/* Question 9 - Women Only */}
              {personalInfo.gender === "female" && (
                <>
                  <Title level={5} className="female-section-title">9. Câu hỏi dành cho phụ nữ:</Title>
                  <Form.Item>
                    <Row gutter={[0, 8]}>
                      <Col span={24}>
                        <Checkbox
                          checked={healthSurvey.isPregnantOrNursing}
                          onChange={(e) => handleCheckboxChange(
                            "isPregnantOrNursing",
                            e.target.checked,
                            "womenQuestionsNone",
                            ["isPregnantOrNursing", "hadPregnancyTermination"]
                          )}
                        >
                          Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi
                        </Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox
                          checked={healthSurvey.hadPregnancyTermination}
                          onChange={(e) => handleCheckboxChange(
                            "hadPregnancyTermination",
                            e.target.checked,
                            "womenQuestionsNone",
                            ["isPregnantOrNursing", "hadPregnancyTermination"]
                          )}
                        >
                          Chấm dứt thai kỳ trong 12 tháng gần đây (sảy thai, phá thai, thai ngoài tử cung)
                        </Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox
                          checked={healthSurvey.womenQuestionsNone}
                          onChange={(e) => handleCheckboxChange(
                            "womenQuestionsNone",
                            e.target.checked,
                            "womenQuestionsNone",
                            ["isPregnantOrNursing", "hadPregnancyTermination"]
                          )}
                        >
                          Không
                        </Checkbox>
                      </Col>
                    </Row>
                  </Form.Item>

                  <Divider />
                </>
              )}

              <div className="survey-submit-section">
                <Space size="large">
                  <Button
                    size="large"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeftOutlined /> Quay lại
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleHealthSurveySubmit}
                    disabled={loading || !healthSurvey.weight}
                    loading={loading}
                    icon={<RightOutlined />}
                  >
                    {loading ? "Đang xử lý..." : "Tiếp tục đến đặt lịch"}
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        )}

        {step === 3 && (
          <Card
            title={
              <Space>
                <CalendarOutlined />
                <span>Đặt lịch hẹn hiến máu</span>
              </Space>
            }
            className="appointment-card"
          >
            <Text className="appointment-description">
              Chọn thời gian phù hợp để đến hiến máu
            </Text>

            {healthSurvey.hasDonatedBefore && healthSurvey.lastDonationDate && (
              <Alert
                message="Lưu ý về khoảng cách hiến máu"
                description={
                  <div>
                    Lần hiến máu gần nhất của bạn: <strong>{dayjs(healthSurvey.lastDonationDate).format('DD/MM/YYYY')}</strong>
                    <br />
                    Bạn cần chờ ít nhất <strong>84 ngày</strong> từ lần hiến máu gần nhất.
                    <br />
                    Ngày sớm nhất có thể hiến máu: <strong>{dayjs(healthSurvey.lastDonationDate).add(84, 'day').format('DD/MM/YYYY')}</strong>
                  </div>
                }
                type="info"
                icon={<InfoCircleOutlined />}
                className="appointment-alert"
              />
            )}

            <Form layout="vertical">
              <Title level={4}><ClockCircleOutlined /> Thời gian</Title>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Ngày mong muốn" required>
                    <DatePicker
                      value={appointmentData.preferredDate ? dayjs(appointmentData.preferredDate) : null}
                      onChange={(date) => {
                        if (date && date.isBefore(dayjs(), 'day')) {
                          alert("Vui lòng chọn ngày từ hôm nay trở đi!");
                          setAppointmentData((prev) => ({ ...prev, preferredDate: "" }));
                        } else if (healthSurvey.hasDonatedBefore && healthSurvey.lastDonationDate) {
                          // Kiểm tra khoảng cách 84 ngày từ lần hiến máu gần nhất
                          const lastDonationDate = dayjs(healthSurvey.lastDonationDate);
                          const daysDifference = date.diff(lastDonationDate, 'day');

                          if (daysDifference < 84) {
                            const earliestDate = lastDonationDate.add(84, 'day');
                            alert(`Bạn cần chờ ít nhất 84 ngày từ lần hiến máu gần nhất (${lastDonationDate.format('DD/MM/YYYY')}). 
                            Sau ngày ${earliestDate.format('DD/MM/YYYY')} bạn đủ điều kiện để tiếp tục hiến máu.`);
                            setAppointmentData((prev) => ({ ...prev, preferredDate: "" }));
                          } else {
                            setAppointmentData((prev) => ({
                              ...prev,
                              preferredDate: date ? date.format('YYYY-MM-DD') : "",
                            }));
                          }
                        } else {
                          setAppointmentData((prev) => ({
                            ...prev,
                            preferredDate: date ? date.format('YYYY-MM-DD') : "",
                          }));
                        }
                      }}
                      disabledDate={(current) => {
                        if (!current) return false;

                        // Không được chọn ngày trong quá khứ
                        if (current < dayjs().startOf('day')) return true;

                        // Nếu đã hiến máu trước đó, không được chọn ngày trong vòng 84 ngày
                        if (healthSurvey.hasDonatedBefore && healthSurvey.lastDonationDate) {
                          const lastDonationDate = dayjs(healthSurvey.lastDonationDate);
                          const daysDifference = current.diff(lastDonationDate, 'day');
                          return daysDifference < 84;
                        }

                        return false;
                      }}
                      className="datepicker-full"
                      placeholder="Chọn ngày mong muốn"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Khung giờ" required>
                    <Radio.Group
                      value={appointmentData.timeSlot}
                      onChange={(e) =>
                        setAppointmentData((prev) => ({
                          ...prev,
                          timeSlot: e.target.value,
                        }))
                      }
                      className="time-radio-group"
                    >
                      <Radio.Button value="morning" className="time-radio-button">
                        7:00 - 11:00<br />
                        <Text type="secondary">Buổi sáng</Text>
                      </Radio.Button>
                      <Radio.Button value="afternoon" className="time-radio-button">
                        13:00 - 17:00<br />
                        <Text type="secondary">Buổi chiều</Text>
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              {/* Location Information */}
              <Title level={4}> Thông tin địa điểm hiến máu</Title>

              <Card className="hospital-card">
                <Row gutter={16} align="middle">
                  <Col span={4} className="hospital-icon">
                    <div className="icon">🏥</div>
                  </Col>
                  <Col span={20}>
                    <Title level={5} className="hospital-title">
                      Bệnh viện Đa khoa Ánh Dương
                    </Title>
                    <Text className="hospital-address">
                       Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam
                    </Text>
                    <Text className="hospital-department">
                       Khoa Huyết học - Tầng 2
                    </Text>
                    <Text type="secondary" className="hospital-note">
                      Vui lòng đến đúng giờ và mang theo giấy tờ tùy thân khi đến hiến máu.
                    </Text>
                  </Col>
                </Row>
              </Card>

              <div className="appointment-submit-section">
                <Space size="large">
                  <Button
                    size="large"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeftOutlined /> Quay lại
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleAppointmentSubmit}
                    disabled={
                      loading ||
                      !appointmentData.preferredDate ||
                      !appointmentData.timeSlot
                    }
                    loading={loading}
                    icon={<CalendarOutlined />}
                  >
                    {loading ? "Đang xử lý..." : "Đặt lịch hẹn"}
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        )}
      </div>

     <Footer />
    </div>
  );
};

export default BloodDonationFormPage;
