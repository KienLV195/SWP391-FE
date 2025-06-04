import React, { useState, useEffect } from "react";
import axios from "axios";
import MemberNavbar from "../../components/member/MemberNavbar";
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
  // Lấy thông tin đã đăng ký từ localStorage (nếu có)
  const storedInfo = JSON.parse(localStorage.getItem("memberInfo") || "{}");
  const [form, setForm] = useState({
    documentType: storedInfo.documentType || "cccd",
    documentNumber: storedInfo.documentNumber || "",
    fullName: storedInfo.fullName || "",
    dob: storedInfo.dob || "",
    gender: storedInfo.gender || "male",
    province: storedInfo.province || "",
    district: storedInfo.district || "",
    ward: storedInfo.ward || "",
    address: storedInfo.address || "",
    email: storedInfo.email || "",
    phone: storedInfo.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [isValid, setIsValid] = useState(false);

  // Xác định trường nào đã được đăng ký (email hoặc phone)
  const registeredEmail = storedInfo.email || "";
  const registeredPhone = storedInfo.phone || "";

  // Load city/district/ward data
  useEffect(() => {
    axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
      .then(res => setCityList(res.data));
  }, []);

  useEffect(() => {
    if (form.province) {
      const city = cityList.find(c => c.Id === form.province);
      setDistrictList(city ? city.Districts : []);
    } else {
      setDistrictList([]);
    }
    setForm(f => ({ ...f, district: "", ward: "" }));
  }, [form.province, cityList]);

  useEffect(() => {
    if (form.district) {
      const district = districtList.find(d => d.Id === form.district);
      setWardList(district ? district.Wards : []);
    } else {
      setWardList([]);
    }
    setForm(f => ({ ...f, ward: "" }));
  }, [form.district, districtList]);

  // Validation + enable/disable button
  useEffect(() => {
    setIsValid(validate());
    // eslint-disable-next-line
  }, [form]);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.documentNumber) newErrors.documentNumber = "Vui lòng nhập số giấy tờ.";
    if (!form.fullName) newErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!form.dob) newErrors.dob = "Vui lòng chọn ngày sinh.";
    if (!form.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố.";
    if (!form.district) newErrors.district = "Vui lòng chọn quận/huyện.";
    if (!form.ward) newErrors.ward = "Vui lòng chọn phường/xã.";
    if (!form.address) newErrors.address = "Vui lòng nhập số nhà, tên đường.";
    // Email/phone: chỉ bắt buộc 1 trong 2, nhưng nếu đã đăng ký thì không bắt buộc cái còn lại
    if (!form.email && !form.phone) {
      if (!registeredEmail && !registeredPhone) {
        newErrors.email = "Cần nhập email hoặc số điện thoại.";
        newErrors.phone = "Cần nhập email hoặc số điện thoại.";
      }
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem("memberInfo", JSON.stringify(form));
      alert("Lưu thông tin thành công!");
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
            <p style={{ fontSize: "1.15rem" }}>Các thông tin điền theo thông tin căn cước công dân để đảm bảo chính xác, nếu thông tin không chính xác, khi cần đến làm thủ tục trực tiếp sẽ phải làm lại để xác thực một lần nữa</p>
          </div>
        </div>
        <div className="member-info-form-box">
          <form className="member-info-form" onSubmit={handleSubmit} id="member-info-form">
            <div className="form-col">
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Chọn loại giấy tờ</label>
                <select className="form-select form-select-lg" name="documentType" value={form.documentType} onChange={handleChange} style={{ fontSize: "1.1rem" }}>
                  {documentTypes.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Số {form.documentType === "passport" ? "hộ chiếu" : form.documentType === "cmnd" ? "chứng minh nhân dân" : "căn cước công dân"} <span className="text-danger">*</span></label>
                <input type="text" className={`form-control form-control-lg${errors.documentNumber ? " is-invalid" : ""}`} name="documentNumber" value={form.documentNumber} onChange={handleChange} style={{ fontSize: "1.1rem" }} />
                {errors.documentNumber && <div className="invalid-feedback">{errors.documentNumber}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Họ và tên <span className="text-danger">*</span></label>
                <input type="text" className={`form-control form-control-lg${errors.fullName ? " is-invalid" : ""}`} name="fullName" value={form.fullName} onChange={handleChange} style={{ fontSize: "1.1rem" }} />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Ngày sinh <span className="text-danger">*</span></label>
                <input type="date" className={`form-control form-control-lg${errors.dob ? " is-invalid" : ""}`} name="dob" value={form.dob} onChange={handleChange} style={{ fontSize: "1.1rem" }} />
                {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Giới tính</label>
                <select className="form-select form-select-lg" name="gender" value={form.gender} onChange={handleChange} style={{ fontSize: "1.1rem" }}>
                  {genders.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Tỉnh/Thành Phố <span className="text-danger">*</span></label>
                <select className="form-select form-select-lg" name="province" value={form.province} onChange={handleChange} style={{ fontSize: "1.1rem" }}>
                  <option value="">Chọn tỉnh thành</option>
                  {cityList.map(city => (
                    <option key={city.Id} value={city.Id}>{city.Name}</option>
                  ))}
                </select>
                {errors.province && <div className="invalid-feedback">{errors.province}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Quận/Huyện <span className="text-danger">*</span></label>
                <select className="form-select form-select-lg" name="district" value={form.district} onChange={handleChange} style={{ fontSize: "1.1rem" }} disabled={!form.province}>
                  <option value="">Chọn quận huyện</option>
                  {districtList.map(d => (
                    <option key={d.Id} value={d.Id}>{d.Name}</option>
                  ))}
                </select>
                {errors.district && <div className="invalid-feedback">{errors.district}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Phường/Xã <span className="text-danger">*</span></label>
                <select className="form-select form-select-lg" name="ward" value={form.ward} onChange={handleChange} style={{ fontSize: "1.1rem" }} disabled={!form.district}>
                  <option value="">Chọn phường xã</option>
                  {wardList.map(w => (
                    <option key={w.Id} value={w.Id}>{w.Name}</option>
                  ))}
                </select>
                {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Số nhà, tên đường <span className="text-danger">*</span></label>
                <input type="text" className={`form-control form-control-lg${errors.address ? " is-invalid" : ""}`} name="address" value={form.address} onChange={handleChange} style={{ fontSize: "1.1rem" }} />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Email {registeredEmail ? <span className="text-success">(Đã đăng ký)</span> : null}</label>
                <input type="email" className={`form-control form-control-lg${errors.email ? " is-invalid" : ""}`} name="email" value={form.email} onChange={handleChange} disabled={!!registeredEmail} style={{ fontSize: "1.1rem" }} />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="form-group input-box">
                <label style={{ fontSize: "1.1rem" }}>Số điện thoại {registeredPhone ? <span className="text-success">(Đã đăng ký)</span> : null}</label>
                <input type="text" className={`form-control form-control-lg${errors.phone ? " is-invalid" : ""}`} name="phone" value={form.phone} onChange={handleChange} disabled={!!registeredPhone} style={{ fontSize: "1.1rem" }} />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>
          </form>
          <div className="member-info-actions">
            <button type="submit" className="btn btn-primary" form="member-info-form" disabled={!isValid}>Xác Nhận</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberInfoPage;
