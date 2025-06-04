import React, { useState, useEffect } from "react";
import Slidebar from "../../components/member/Slidebar.jsx";
import "../../styles/pages/BloodDonationFormPage.scss";


const BloodDonationFormPage = () => {
    const [step, setStep] = useState(0);
    const [infoValid, setInfoValid] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Dummy form state for step 1
    const [form, setForm] = useState({
        documentNumber: "",
        fullName: "",
        dob: "",
        gender: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Lấy thông tin từ localStorage nếu có
        const info = JSON.parse(localStorage.getItem("memberInfo") || "{}");
        if (info && Object.keys(info).length > 0) {
            setForm(f => ({ ...f, ...info }));
        }
    }, []);

    // Validate info step
    const validateInfo = () => {
        const newErrors = {};
        if (!form.documentNumber) newErrors.documentNumber = "Bắt buộc";
        if (!form.fullName) newErrors.fullName = "Bắt buộc";
        if (!form.dob) newErrors.dob = "Bắt buộc";
        if (!form.gender) newErrors.gender = "Bắt buộc";
        if (!form.province) newErrors.province = "Bắt buộc";
        if (!form.district) newErrors.district = "Bắt buộc";
        if (!form.ward) newErrors.ward = "Bắt buộc";
        if (!form.address) newErrors.address = "Bắt buộc";
        if (!form.email && !form.phone) {
            newErrors.email = "Bắt buộc 1 trong 2";
            newErrors.phone = "Bắt buộc 1 trong 2";
        } setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 1: Điền thông tin (hiển thị lại thông tin từ MemberInfoPage, cho phép chỉnh sửa)
    const renderStep1 = () => (
        <div className="donation-form-step">
            <div className="mb-4">
                <h4 className="fw-bold mb-2" style={{ color: '#02314B' }}>Kiểm tra lại thông tin cá nhân</h4>
                <div className="text-secondary mb-3" style={{ fontSize: '15px' }}>Vui lòng kiểm tra kỹ thông tin cá nhân trước khi tiếp tục. Nếu có sai sót, hãy chỉnh sửa tại đây.</div>
            </div>
            <div className="user-avatar mb-4">
                <div className="avatar-circle">
                    <i className="bi bi-person-fill"></i>
                </div>
            </div>
            <div className="info-review-box p-4 mb-3 bg-light border rounded-4 shadow-sm">
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Số căn cước công dân</label>
                            <input
                                type="text"
                                className={`form-control${errors.documentNumber ? " is-invalid" : ""}`}
                                value={form.documentNumber}
                                onChange={e => setForm(f => ({ ...f, documentNumber: e.target.value }))}
                            />
                            {errors.documentNumber && <div className="invalid-feedback">{errors.documentNumber}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Tỉnh/Thành Phố</label>
                            <select
                                className={`form-select${errors.province ? " is-invalid" : ""}`}
                                value={form.province}
                                onChange={e => setForm(f => ({ ...f, province: e.target.value }))}
                            >
                                <option value="">Chọn tỉnh/thành phố</option>
                                <option value="Ho Chi Minh">Hồ Chí Minh</option>
                                <option value="Ha Noi">Hà Nội</option>
                                <option value="Da Nang">Đà Nẵng</option>
                            </select>
                            {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Họ và tên</label>
                            <input
                                type="text"
                                className={`form-control${errors.fullName ? " is-invalid" : ""}`}
                                value={form.fullName}
                                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                            />
                            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Quận/Huyện</label>
                            <select
                                className={`form-select${errors.district ? " is-invalid" : ""}`}
                                value={form.district}
                                onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                            >
                                <option value="">Chọn quận/huyện</option>
                                <option value="District 1">Quận 1</option>
                                <option value="District 2">Quận 2</option>
                                <option value="District 3">Quận 3</option>
                            </select>
                            {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Ngày sinh</label>
                            <div className="date-input-wrapper">
                                <input
                                    type="date"
                                    className={`form-control${errors.dob ? " is-invalid" : ""}`}
                                    value={form.dob}
                                    onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                                />
                                <i className="bi bi-calendar3 date-icon"></i>
                            </div>
                            {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Phường/Xã</label>
                            <select
                                className={`form-select${errors.ward ? " is-invalid" : ""}`}
                                value={form.ward}
                                onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
                            >
                                <option value="">Chọn phường/xã</option>
                                <option value="Ward 1">Phường 1</option>
                                <option value="Ward 2">Phường 2</option>
                                <option value="Ward 3">Phường 3</option>
                            </select>
                            {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Giới tính</label>
                            <select
                                className={`form-select${errors.gender ? " is-invalid" : ""}`}
                                value={form.gender}
                                onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="required">Số nhà, tên đường</label>
                            <input
                                type="text"
                                className={`form-control${errors.address ? " is-invalid" : ""}`}
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className={`form-control${errors.email ? " is-invalid" : ""}`}
                                value={form.email}
                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                className={`form-control${errors.phone ? " is-invalid" : ""}`}
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-actions mt-3">
                <div></div>
                <button className="btn btn-danger" onClick={e => {
                    e.preventDefault();
                    if (validateInfo()) {
                        setInfoValid(true);
                        setStep(1);
                    }
                }}>TIẾP THEO</button>
            </div>
        </div>
    );

    // Step 2: Điền thời gian và địa điểm
    const renderStep2 = () => (
        <div className="donation-form-step">
            <div className="form-group">
                <label className="required">Chọn ngày hiến máu</label>
                <div className="date-input-wrapper">
                    <input type="date" className="form-control" />
                    <i className="bi bi-calendar3 date-icon"></i>
                </div>
            </div>

            <div className="form-group">
                <label>Địa điểm hiến máu</label>
                <div className="location-info-box">
                    <div className="info-item">
                        <i className="bi bi-telephone-fill info-icon"></i>
                        <div className="info-content">(028) 3957 1343</div>
                    </div>
                    <div className="info-item">
                        <i className="bi bi-envelope-fill info-icon"></i>
                        <div className="info-content">anhduonghospital@gmail.com</div>
                    </div>
                    <div className="info-item">
                        <i className="bi bi-clock-fill info-icon"></i>
                        <div className="info-content">
                            <div><strong>Thứ 2 – Chủ nhật:</strong></div>
                            <div className="schedule">
                                <div className="schedule-line">• Sáng: 07:00 – 12:00</div>
                                <div className="schedule-line">• Chiều: 13:00 – 16:30</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-group working-hours-input">
                <label>Khung giờ làm việc của địa điểm</label>
                <select className="form-select">
                    <option value="">Chọn khung giờ</option>
                    <option value="7:00-11:00">Sáng: 07:00 – 11:00</option>
                    <option value="13:00-17:00">Chiều: 13:00 – 17:00</option>
                </select>
            </div>

            <div className="form-actions">
                <button className="btn btn-outline-secondary" onClick={e => { e.preventDefault(); setStep(0); }}>QUAY VỀ</button>
                <button className="btn btn-danger" onClick={e => { e.preventDefault(); setStep(2); }}>TIẾP THEO</button>
            </div>
        </div>
    );

    // Step 3: Điền phiếu hiến máu
    const renderStep3 = () => (
        <div className="donation-form-step">
            {/* Giả lập các câu hỏi phiếu hiến máu */}
            {[1, 2, 3, 4].map((q, idx) => (
                <div className="question-block" key={idx}>
                    <div className="question-header">Câu hỏi {q}</div>
                    <div className="question-body">
                        <label>
                            <input type="checkbox" /> Tôi đồng ý
                        </label>
                    </div>
                </div>
            ))}

            <div className="form-actions">
                <button className="btn btn-outline-secondary" onClick={e => { e.preventDefault(); setStep(1); }}>QUAY VỀ</button>
                <button className="btn btn-danger" onClick={e => {
                    e.preventDefault();
                    setShowSuccess(true);
                }}>XÁC NHẬN</button>
            </div>

            {showSuccess && (
                <div className="success-notification">
                    ĐÃ NHẬN ĐƯỢC ĐƠN ĐĂNG KÝ CỦA BẠN, THEO DÕI THANH THÔNG BÁO Ở HOME ĐỂ BIẾT THÊM
                </div>
            )}
        </div>
    ); return (
        <div className="donation-form-wrapper">
            <div className="donation-form-card">
                <Slidebar step={step} infoValid={infoValid} />
                <div className="donation-form-content">
                    {step === 0 && renderStep1()}
                    {step === 1 && renderStep2()}
                    {step === 2 && renderStep3()}
                </div>
            </div>
        </div>
    );
};

export default BloodDonationFormPage;
