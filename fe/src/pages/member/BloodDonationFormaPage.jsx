import React, { useState, useEffect } from "react";
import Slidebar from "../../components/member/Slidebar";
import "../../styles/pages/MemberInfoPage.scss";

const BloodDonationFormaPage = () => {
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
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 1: Điền thông tin (hiển thị lại thông tin từ MemberInfoPage, cho phép chỉnh sửa)
    const renderStep1 = () => (
        <div className="donation-form-step">
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Số căn cước công dân *</label>
                        <input type="text" className={`form-control${errors.documentNumber ? " is-invalid" : ""}`} value={form.documentNumber} onChange={e => setForm(f => ({ ...f, documentNumber: e.target.value }))} />
                        {errors.documentNumber && <div className="invalid-feedback">{errors.documentNumber}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Tỉnh/Thành Phố *</label>
                        <input type="text" className={`form-control${errors.province ? " is-invalid" : ""}`} value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} />
                        {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Họ và tên *</label>
                        <input type="text" className={`form-control${errors.fullName ? " is-invalid" : ""}`} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Quận/Huyện *</label>
                        <input type="text" className={`form-control${errors.district ? " is-invalid" : ""}`} value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
                        {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Ngày sinh *</label>
                        <input type="date" className={`form-control${errors.dob ? " is-invalid" : ""}`} value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                        {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Phường/Xã *</label>
                        <input type="text" className={`form-control${errors.ward ? " is-invalid" : ""}`} value={form.ward} onChange={e => setForm(f => ({ ...f, ward: e.target.value }))} />
                        {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Giới tính *</label>
                        <input type="text" className={`form-control${errors.gender ? " is-invalid" : ""}`} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} />
                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Số nhà, tên đường *</label>
                        <input type="text" className={`form-control${errors.address ? " is-invalid" : ""}`} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className={`form-control${errors.email ? " is-invalid" : ""}`} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="text" className={`form-control${errors.phone ? " is-invalid" : ""}`} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                </div>
            </div>
            <div className="form-row d-flex justify-content-end mt-4">
                <button className="btn btn-danger px-4 py-2" onClick={e => {
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
            <div className="form-row">
                <div className="form-group" style={{ width: "100%" }}>
                    <label>Chọn ngày hiến máu</label>
                    <input type="date" style={{ width: "100%" }} />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group" style={{ width: "100%" }}>
                    <label>Địa điểm hiến máu</label>
                    <div className="info-box">
                        <div><b>📞</b> (028) 3957 1343</div>
                        <div><b>✉️</b> anhduonghospital@gmail.com</div>
                        <div><b>🕒</b> Thứ 2 – Chủ nhật:<br />Sáng: 07:00 – 12:00<br />Chiều: 13:00 – 16:30</div>
                    </div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group" style={{ width: "100%" }}>
                    <label>Khung giờ làm việc của địa điểm</label>
                    <input type="text" style={{ width: "100%" }} />
                </div>
            </div>
            <div className="form-row" style={{ justifyContent: "space-between" }}>
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
                        <input type="checkbox" /> Tôi đồng ý
                    </div>
                </div>
            ))}
            <div className="form-row" style={{ justifyContent: "space-between" }}>
                <button className="btn btn-outline-secondary" onClick={e => { e.preventDefault(); setStep(1); }}>QUAY VỀ</button>
                <button className="btn btn-danger" onClick={e => {
                    e.preventDefault();
                    setShowSuccess(true);
                }}>XÁC NHẬN</button>
            </div>
            {showSuccess && (
                <div className="alert alert-success mt-3" style={{ fontSize: "1.1rem" }}>
                    ĐÃ NHẬN ĐƯỢC ĐƠN ĐĂNG KÝ CỦA BẠN, THEO DÕI THANH THÔNG BÁO Ở HOME ĐỂ BIẾT THÊM
                </div>
            )}
        </div>
    );

    return (
        <div className="donation-form-wrapper" style={{ display: "flex", background: "#f4f4f4", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
            <div className="donation-form-card" style={{ display: "flex", borderRadius: 32, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", background: "#fff", width: 1000, maxWidth: "98vw" }}>
                <Slidebar step={step} infoValid={infoValid} />
                <div style={{ flex: 1, padding: 40, minWidth: 350 }}>
                    {step === 0 && renderStep1()}
                    {step === 1 && renderStep2()}
                    {step === 2 && renderStep3()}
                </div>
            </div>
        </div>
    );
};

export default BloodDonationFormaPage;
