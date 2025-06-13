import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MemberNavbar from "../../components/member/MemberNavbar";
import authService from "../../services/authService";
import "../../styles/pages/MemberInfoPage.scss";

const documentTypes = [
  { value: "cccd", label: "Căn cước công dân" },
  { value: "cmnd", label: "Chứng minh nhân dân" },
  { value: "passport", label: "Hộ chiếu" },
];

const genders = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];

const MemberInfoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const { isFirstTime, message } = location.state || {};

  // Lấy thông tin từ user profile hoặc localStorage
  const storedInfo = JSON.parse(localStorage.getItem("memberInfo") || "{}");
  const userProfile = currentUser?.profile || {};

  const [form, setForm] = useState({
    documentType: userProfile.documentType || storedInfo.documentType || "cccd",
    documentNumber:
      userProfile.documentNumber || storedInfo.documentNumber || "",
    fullName: userProfile.fullName || storedInfo.fullName || "",
    dob: userProfile.dateOfBirth || storedInfo.dob || "",
    gender: userProfile.gender || storedInfo.gender || "male",
    province: userProfile.province || storedInfo.province || "",
    district: userProfile.district || storedInfo.district || "",
    ward: userProfile.ward || storedInfo.ward || "",
    provinceName: userProfile.provinceName || storedInfo.provinceName || "",
    districtName: userProfile.districtName || storedInfo.districtName || "",
    wardName: userProfile.wardName || storedInfo.wardName || "",
    address: userProfile.address || storedInfo.address || "",
    email: userProfile.email || storedInfo.email || "",
    phone: userProfile.phone || storedInfo.phone || "",
    bloodType: userProfile.bloodType || storedInfo.bloodType || "",
  });
  const [errors, setErrors] = useState({});
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [isValid, setIsValid] = useState(false);

  // Xác định trường nào đã được đăng ký (email hoặc phone) - bỏ logic cũ
  // const registeredEmail = storedInfo.email || "";
  // const registeredPhone = storedInfo.phone || "";

  // Load city/district/ward data
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((res) => setCityList(res.data));
  }, []);
  useEffect(() => {
    if (form.province) {
      const city = cityList.find((c) => c.Id === form.province);
      setDistrictList(city ? city.Districts : []);
    } else {
      setDistrictList([]);
    }
    // Không reset district và ward ở đây nữa vì đã xử lý trong handleChange
  }, [form.province, cityList]);

  useEffect(() => {
    if (form.district) {
      const district = districtList.find((d) => d.Id === form.district);
      setWardList(district ? district.Wards : []);
    } else {
      setWardList([]);
    }
    // Không reset ward ở đây nữa vì đã xử lý trong handleChange
  }, [form.district, districtList]);

  // Validation + enable/disable button
  useEffect(() => {
    setIsValid(validate());
    // eslint-disable-next-line
  }, [form]);
  // Validation
  const validate = () => {
    const newErrors = {};
    // Ràng buộc số giấy tờ
    if (!form.documentNumber) {
      newErrors.documentNumber = "Vui lòng nhập số giấy tờ.";
    } else {
      if (form.documentType === "cccd") {
        if (!/^\d{12}$/.test(form.documentNumber)) {
          newErrors.documentNumber = "Căn cước công dân phải gồm đúng 12 số.";
        }
      } else if (form.documentType === "cmnd") {
        if (
          !/^\d{9}$/.test(form.documentNumber) &&
          !/^\d{12}$/.test(form.documentNumber)
        ) {
          newErrors.documentNumber = "CMND phải gồm đúng 9 hoặc 12 số.";
        }
      }
      // Hộ chiếu không kiểm tra độ dài
    }
    if (!form.fullName) newErrors.fullName = "Vui lòng nhập họ và tên.";

    // Validate ngày sinh - không được chọn ngày trong tương lai
    if (!form.dob) {
      newErrors.dob = "Vui lòng chọn ngày sinh.";
    } else {
      const today = new Date();
      const selectedDate = new Date(form.dob);
      if (selectedDate > today) {
        newErrors.dob = "Vui lòng chọn đúng ngày sinh";
      }
    }

    if (!form.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố.";
    if (!form.district) newErrors.district = "Vui lòng chọn quận/huyện.";
    if (!form.ward) newErrors.ward = "Vui lòng chọn phường/xã.";
    if (!form.address) newErrors.address = "Vui lòng nhập số nhà, tên đường.";

    // Email/phone: chỉ bắt buộc 1 trong 2
    if (!form.email && !form.phone) {
      newErrors.email = "Cần nhập email hoặc số điện thoại.";
      newErrors.phone = "Cần nhập email hoặc số điện thoại.";
    } else {
      if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        newErrors.email = "Email không hợp lệ.";
      }
      if (form.phone && !/^0\d{9}$/.test(form.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Lưu tên thay vì ID cho province, district, ward
    if (name === "province") {
      const selectedCity = cityList.find((c) => c.Id === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        provinceName: selectedCity ? selectedCity.Name : "",
        // Reset district và ward khi thay đổi province
        district: "",
        ward: "",
        districtName: "",
        wardName: "",
      }));
    } else if (name === "district") {
      const selectedDistrict = districtList.find((d) => d.Id === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        districtName: selectedDistrict ? selectedDistrict.Name : "",
        // Reset ward khi thay đổi district
        ward: "",
        wardName: "",
      }));
    } else if (name === "ward") {
      const selectedWard = wardList.find((w) => w.Id === value);
      setForm((prev) => ({
        ...prev,
        [name]: value,
        wardName: selectedWard ? selectedWard.Name : "",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Tạo địa chỉ đầy đủ từ các thành phần
      const fullAddress = [
        form.address,
        form.wardName,
        form.districtName,
        form.provinceName,
      ]
        .filter(Boolean)
        .join(", ");

      const dataToSave = {
        ...form,
        fullAddress: fullAddress,
        dateOfBirth: form.dob,
      };

      // Lưu vào localStorage
      localStorage.setItem("memberInfo", JSON.stringify(dataToSave));

      // Cập nhật profile của user hiện tại
      if (currentUser) {
        authService.updateProfile(dataToSave);

        // Nếu là first-time setup, đánh dấu không còn là first login
        if (isFirstTime) {
          const updatedUser = { ...currentUser, isFirstLogin: false };
          authService.setCurrentUser(updatedUser);
        }
      }

      alert("Lưu thông tin thành công!");
      console.log("Thông tin đã lưu:", dataToSave);

      // Redirect based on context
      if (isFirstTime) {
        navigate("/member", {
          state: { message: "Chào mừng bạn đến với hệ thống hiến máu!" },
        });
      }
    }
  };

  return (
    <>
      <MemberNavbar />
      <div className="member-info-bg">
        <div className="member-info-header">
          <div className="avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div>
            <h2>THÔNG TIN TÀI KHOẢN</h2>
            <p style={{ fontSize: "1.15rem" }}>
              Các thông tin điền theo thông tin căn cước công dân để đảm bảo
              chính xác, nếu thông tin không chính xác, khi cần đến làm thủ tục
              trực tiếp sẽ phải làm lại để xác thực một lần nữa
            </p>
          </div>
        </div>
        <div className="member-info-form-box">
          <form
            className="member-info-form"
            onSubmit={handleSubmit}
            id="member-info-form"
          >
            <div className="form-col">
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Chọn loại giấy tờ</label>
                <select
                  className="form-select form-select-lg"
                  name="documentType"
                  value={form.documentType}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                >
                  {documentTypes.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>{" "}
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>
                  Số{" "}
                  {form.documentType === "passport"
                    ? "hộ chiếu"
                    : form.documentType === "cmnd"
                      ? "chứng minh nhân dân"
                      : "căn cước công dân"}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg${errors.documentNumber ? " is-invalid" : ""
                    }`}
                  name="documentNumber"
                  value={form.documentNumber}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  placeholder={`Nhập ${form.documentType === "passport"
                    ? "số hộ chiếu"
                    : form.documentType === "cmnd"
                      ? "số CMND (9 hoặc 12 số)"
                      : "số CCCD (12 số)"
                    }`}
                />
                {errors.documentNumber && (
                  <div className="invalid-feedback">
                    {errors.documentNumber}
                  </div>
                )}
              </div>{" "}
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg${errors.fullName ? " is-invalid" : ""
                    }`}
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  placeholder="Nhập họ và tên đầy đủ"
                />
                {errors.fullName && (
                  <div className="invalid-feedback">{errors.fullName}</div>
                )}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>
                  Ngày sinh <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control form-control-lg${errors.dob ? " is-invalid" : ""
                    }`}
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.dob && (
                  <div className="invalid-feedback">{errors.dob}</div>
                )}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Giới tính</label>
                <select
                  className="form-select form-select-lg"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                >
                  {genders.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>
                  Tỉnh/Thành Phố <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-lg"
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                >
                  <option value="">Chọn tỉnh thành</option>
                  {cityList.map((city) => (
                    <option key={city.Id} value={city.Id}>
                      {city.Name}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <div className="invalid-feedback">{errors.province}</div>
                )}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>
                  Quận/Huyện <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-lg"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  disabled={!form.province}
                >
                  <option value="">Chọn quận huyện</option>
                  {districtList.map((d) => (
                    <option key={d.Id} value={d.Id}>
                      {d.Name}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <div className="invalid-feedback">{errors.district}</div>
                )}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>
                  Phường/Xã <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select form-select-lg"
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  disabled={!form.district}
                >
                  <option value="">Chọn phường xã</option>
                  {wardList.map((w) => (
                    <option key={w.Id} value={w.Id}>
                      {w.Name}
                    </option>
                  ))}
                </select>
                {errors.ward && (
                  <div className="invalid-feedback">{errors.ward}</div>
                )}
              </div>{" "}
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>
                  Số nhà, tên đường <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg${errors.address ? " is-invalid" : ""
                    }`}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  placeholder="Nhập số nhà, tên đường"
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Email</label>
                <input
                  type="email"
                  className={`form-control form-control-lg${errors.email ? " is-invalid" : ""
                    }`}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  placeholder="Nhập địa chỉ email"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Số điện thoại</label>
                <input
                  type="text"
                  className={`form-control form-control-lg${errors.phone ? " is-invalid" : ""
                    }`}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ fontSize: "1.1rem" }}
                  placeholder="Nhập số điện thoại (10 số, bắt đầu bằng 0)"
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}{" "}
              </div>
            </div>
          </form>
          <div className="member-info-actions">
            <button
              type="submit"
              className="btn btn-primary"
              form="member-info-form"
              disabled={!isValid}
            >
              Xác Nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberInfoPage;
