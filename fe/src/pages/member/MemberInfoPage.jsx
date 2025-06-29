  import React, { useState, useEffect } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import axios from "axios";
  import MemberNavbar from "../../components/member/MemberNavbar";
  import authService from "../../services/authService";
  import "../../styles/pages/MemberInfoPage.scss";
  import vietnamProvinces from "../../data/vietnam-provinces.json";

  const documentTypes = [
    { value: "cccd", label: "Căn cước công dân" },
    { value: "passport", label: "Hộ chiếu" },
  ];

  const genders = [
    { value: "male", label: "Nam" },
    { value: "female", label: "Nữ" },
    { value: "other", label: "Khác" },
  ];

  const bloodTypes = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
  ];

  const rhTypes = [
    { value: "Rh+", label: "Rh+" },
    { value: "Rh-", label: "Rh-" },
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
      bloodType: userProfile.bloodGroup || storedInfo.bloodType || "",
      rhType: userProfile.rhType || storedInfo.rhType || "Rh+",
    });
    const [errors, setErrors] = useState({});
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Thêm hàm fetchUserInfo để lấy thông tin người dùng từ API
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          ` https://localhost:7021/api/Information/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`
            }
          }
        );

        if (response.status === 200) {
          const userData = response.data;

          // Format date from "2003-02-16T00:00:00" to "2003-02-16"
          const formattedDate = userData.dateOfBirth
            ? userData.dateOfBirth.split('T')[0]
            : "";

          // Cập nhật form với dữ liệu mới
          setForm({
            documentType: userData.idCardType || "cccd",
            documentNumber: userData.idCard || "",
            fullName: userData.name || "",
            dob: formattedDate,
            gender: userData.gender || "male",
            province: userData.city || "",
            district: userData.district || "",
            ward: userData.ward || "",
            provinceName: userData.provinceName || "",
            districtName: userData.districtName || "",
            wardName: userData.wardName || "",
            address: userData.address || "",
            email: userData.email || "",
            phone: userData.phone || "",
            bloodType: userData.bloodGroup || "",
            rhType: userData.rhType || "Rh+",
            password: userData.password || "",
          });

          // Cập nhật localStorage
          localStorage.setItem("memberInfo", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    // Load city/district/ward data
    useEffect(() => {
      setCityList(vietnamProvinces);
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
        } else if (form.documentType === "passport") {
          if (!/^[A-Z]\d{7}$/.test(form.documentNumber)) {
            newErrors.documentNumber = "Hộ chiếu phải gồm đúng một chữ cái in hoa (đại diện cho loại hộ chiếu) theo sau là 7 chữ số. .";
          }
        }
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
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        try {
          // Tạo địa chỉ đầy đủ từ các thành phần
          const fullAddress = [
            form.address,
            form.wardName,
            form.districtName,
            form.provinceName,
          ]
            .filter(Boolean)
            .join(", ");

          // Format data to match API requirements
          const dataToSave = {
            userID: currentUser.id,
            email: form.email || "",
            phone: form.phone || "",
            idCardType: form.documentType || "",
            idCard: form.documentNumber || "",
            name: form.fullName || "",
            dateOfBirth: form.dob || null,
            age: form.dob ? calculateAge(form.dob) : null,
            gender: form.gender || "",
            city: form.province || "",
            district: form.district || "",
            ward: form.ward || "",
            address: fullAddress || "",
            bloodGroup: form.bloodType || "",
            rhType: form.rhType || "Rh+",
            status: 1,
            roleID: currentUser.roleID || 1,
            department: currentUser.department || "",
            createdAt: new Date().toISOString(),
            password: currentUser.password || "",
          };
          // 
          

          console.log("Data being sent:", dataToSave);

          // Lưu vào localStorage
          localStorage.setItem("memberInfo", JSON.stringify(dataToSave));

          // Gửi thông tin xuống database
          const response = await axios.put(
            ` https://localhost:7021/api/Information/${currentUser.id}`,
            dataToSave,
            {
              headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${currentUser.token}`
              }
            }
          );

          if (response.status === 204 || response.status === 200) {
            // Cập nhật profile của user hiện tại với thông tin từ database
            if (currentUser) {
              // Cập nhật profile với thông tin mới, đảm bảo có trường name
              const updatedProfile = {
                ...currentUser.profile,
                ...dataToSave,
                name: dataToSave.name, // Đảm bảo trường name được cập nhật
              };

              authService.updateProfile(updatedProfile);

              // Nếu là first-time setup, đánh dấu không còn là first login
              if (isFirstTime) {
                const updatedUser = { ...currentUser, isFirstLogin: false };
                authService.setCurrentUser(updatedUser);
              }
            }

            // Lấy thông tin mới nhất từ database sau khi lưu thành công
            
            await fetchUserInfo();
            setNotification({ message: "Lưu thông tin thành công!", type: "success" });
            setTimeout(() => setNotification({ message: '', type: '' }), 3500);
            console.log("Thông tin đã lưu:", dataToSave);
            if (isFirstTime) {
              navigate("/member", {
                state: { message: "Chào mừng bạn đến với hệ thống hiến máu!" },
              });
            }
          }
        } catch (error) {
          console.error("Lỗi khi lưu thông tin:", error);
          if (error.response) {
            console.error("Response status:", error.response.status);
          }
          setNotification({ message: "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại sau.", type: "error" });
          setTimeout(() => setNotification({ message: '', type: '' }), 3500);
        }
      }
    };

    // Thêm useEffect để fetch thông tin người dùng khi component mount
    useEffect(() => {
      if (currentUser?.id) {
        fetchUserInfo();
      }
    }, [currentUser?.id]);

    // Helper function to calculate age from date of birth
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
                    
                    Số{form.documentType === "passport"
                      ? " hộ chiếu"   
                      : " căn cước công dân"} 
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
                <div className="form-group input-box">
                  <label style={{ fontSize: "1.1rem" }}>Nhóm máu</label>
                  <select
                    className="form-select form-select-lg"
                    name="bloodType"
                    value={form.bloodType}
                    onChange={handleChange}
                    style={{ fontSize: "1.1rem" }}
                  >
                    <option value="">Chọn nhóm máu</option>
                    {bloodTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group input-box">
                  <label style={{ fontSize: "1.1rem" }}>Rh</label>
                  <select
                    className="form-select form-select-lg"
                    name="rhType"
                    value={form.rhType}
                    onChange={handleChange}
                    style={{ fontSize: "1.1rem" }}
                  >
                    {rhTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
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
            {notification.message && (
              <div style={{
                marginBottom: 16,
                padding: 12,
                borderRadius: 6,
                color: notification.type === 'success' ? '#155724' : '#721c24',
                background: notification.type === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                fontWeight: 500,
                fontSize: '1.08rem',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}>
                {notification.message}
              </div>
            )}
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
