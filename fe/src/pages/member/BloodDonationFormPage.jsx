import React, { useState, useEffect } from "react";
import Slidebar from "../../components/member/Slidebar.jsx";
import "../../styles/pages/BloodDonationFormPage.scss";


const BloodDonationFormPage = () => {
    const [step, setStep] = useState(0);
    const [infoValid, setInfoValid] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Questionnaire sub-steps (for step 2 - questionnaire)
    const [questionnaireStep, setQuestionnaireStep] = useState(0);
    const totalQuestionnaireSteps = 4; // We'll divide 9 questions into 4 pages

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

    // Questionnaire answers state
    const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});

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
    };    // Step 1: Điền thông tin (hiển thị lại thông tin từ MemberInfoPage, cho phép chỉnh sửa)
    const renderStep1 = () => (
        <div className="donation-form-step step-1">
            <div className="step-header">
                <div className="user-avatar-inline">
                    <div className="avatar-circle-small">
                        <i className="bi bi-person-fill"></i>
                    </div>
                </div>
                <div className="header-content">
                    <h4 className="step-title">Kiểm tra lại thông tin cá nhân</h4>
                    <p className="step-subtitle">Vui lòng kiểm tra kỹ thông tin cá nhân trước khi tiếp tục. Nếu có sai sót, hãy chỉnh sửa tại đây.</p>
                </div>
            </div>

            <div className="info-review-form">
                <div className="form-row">
                    <div className="form-col">
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
                    <div className="form-col">
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
                </div>

                <div className="form-row">
                    <div className="form-col">
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
                    <div className="form-col">
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
                </div>

                <div className="form-row">
                    <div className="form-col">
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
                    <div className="form-col">
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
                </div>

                <div className="form-row">
                    <div className="form-col">
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
                    <div className="form-col">
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
                </div>

                <div className="form-row">
                    <div className="form-col">
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
                    <div className="form-col">
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

            <div className="form-actions">
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
    );    // Update questionnaire answer
    const updateQuestionnaireAnswer = (questionName, value) => {
        setQuestionnaireAnswers(prev => ({
            ...prev,
            [questionName]: value
        }));
    };

    // Step 3: Questionnaire - Page 1 (Basic Questions)
    const renderQuestionnairePage1 = () => (
        <div className="donation-form-step questionnaire-step">
            <div className="questionnaire-header">
                <h4>Phiếu khám sàng lọc người hiến máu tình nguyện</h4>
                <p className="text-muted">Phần 1: Thông tin cơ bản</p>
                <div className="progress-indicator">
                    <span className="current-step">1</span> / {totalQuestionnaireSteps}
                </div>
            </div>

            {/* Câu hỏi 1 */}
            <div className="question-block">
                <div className="question-header">1. Anh/chị từng hiến máu chưa?</div>
                <div className="question-body">
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="q1"
                                value="yes"
                                checked={questionnaireAnswers.q1 === 'yes'}
                                onChange={(e) => updateQuestionnaireAnswer('q1', e.target.value)}
                            /> Có
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="q1"
                                value="no"
                                checked={questionnaireAnswers.q1 === 'no'}
                                onChange={(e) => updateQuestionnaireAnswer('q1', e.target.value)}
                            /> Không
                        </label>
                    </div>
                </div>
            </div>

            {/* Câu hỏi 2 */}
            <div className="question-block">
                <div className="question-header">2. Hiện tại, anh/chị có mắc bệnh lý nào không?</div>
                <div className="question-body">
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="q2"
                                value="yes"
                                checked={questionnaireAnswers.q2 === 'yes'}
                                onChange={(e) => updateQuestionnaireAnswer('q2', e.target.value)}
                            /> Có
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="q2"
                                value="no"
                                checked={questionnaireAnswers.q2 === 'no'}
                                onChange={(e) => updateQuestionnaireAnswer('q2', e.target.value)}
                            /> Không
                        </label>
                    </div>
                    {questionnaireAnswers.q2 === 'yes' && (
                        <div className="question-detail">
                            <label>Nếu có, xin ghi rõ:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ghi rõ bệnh lý..."
                                value={questionnaireAnswers.q2_detail || ''}
                                onChange={(e) => updateQuestionnaireAnswer('q2_detail', e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Câu hỏi 3 */}
            <div className="question-block">
                <div className="question-header">3. Anh/chị đã từng mắc một trong các bệnh sau đây trước đây chưa:</div>
                <div className="question-subtext">viêm gan B, viêm gan C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen suyễn, hoặc đã từng được cấy ghép mô/tạng?</div>
                <div className="question-body">
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="q3"
                                value="yes"
                                checked={questionnaireAnswers.q3 === 'yes'}
                                onChange={(e) => updateQuestionnaireAnswer('q3', e.target.value)}
                            /> Có
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="q3"
                                value="no"
                                checked={questionnaireAnswers.q3 === 'no'}
                                onChange={(e) => updateQuestionnaireAnswer('q3', e.target.value)}
                            /> Không
                        </label>
                    </div>
                </div>
            </div>            <div className="form-actions">
                <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => { e.preventDefault(); setStep(1); }}
                >
                    QUAY VỀ
                </button>
                <button
                    className="btn btn-danger"
                    onClick={(e) => { e.preventDefault(); setQuestionnaireStep(1); }}
                >
                    TIẾP THEO
                </button>
            </div>
        </div>
    );

    // Step 3: Questionnaire - Page 2 (12 Month History)
    const renderQuestionnairePage2 = () => (
        <div className="donation-form-step questionnaire-step">
            <div className="questionnaire-header">
                <h4>Phiếu khám sàng lọc người hiến máu tình nguyện</h4>
                <p className="text-muted">Phần 2: Tiền sử 12 tháng gần đây</p>
                <div className="progress-indicator">
                    <span className="current-step">2</span> / {totalQuestionnaireSteps}
                </div>
            </div>

            {/* Câu hỏi 4 */}
            <div className="question-block">
                <div className="question-header">4. Trong 12 tháng gần đây, anh/chị có:</div>
                <div className="question-body">
                    <div className="sub-questions">
                        <div className="sub-question">
                            <span>Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não-màng não, uốn ván, phẫu thuật ngoại khoa?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q4a"
                                        value="yes"
                                        checked={questionnaireAnswers.q4a === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q4a', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q4a"
                                        value="no"
                                        checked={questionnaireAnswers.q4a === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q4a', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Được truyền máu hoặc các chế phẩm máu?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q4b"
                                        value="yes"
                                        checked={questionnaireAnswers.q4b === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q4b', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q4b"
                                        value="no"
                                        checked={questionnaireAnswers.q4b === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q4b', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Tiêm Vacxin?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q4c"
                                        value="yes"
                                        checked={questionnaireAnswers.q4c === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q4c', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q4c"
                                        value="no"
                                        checked={questionnaireAnswers.q4c === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q4c', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            <div className="form-actions">
                <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => { e.preventDefault(); setQuestionnaireStep(0); }}
                >
                    QUAY VỀ
                </button>
                <button
                    className="btn btn-danger"
                    onClick={(e) => { e.preventDefault(); setQuestionnaireStep(2); }}
                >
                    TIẾP THEO
                </button>
            </div>
        </div>
    );

    // Step 3: Questionnaire - Page 3 (6 Month History)
    const renderQuestionnairePage3 = () => (
        <div className="donation-form-step questionnaire-step">
            <div className="questionnaire-header">
                <h4>Phiếu khám sàng lọc người hiến máu tình nguyện</h4>
                <p className="text-muted">Phần 3: Tiền sử 6 tháng gần đây</p>
                <div className="progress-indicator">
                    <span className="current-step">3</span> / {totalQuestionnaireSteps}
                </div>
            </div>

            {/* Câu hỏi 5 - First half */}
            <div className="question-block">
                <div className="question-header">5. Trong 06 tháng gần đây, anh/chị có:</div>
                <div className="question-body">
                    <div className="sub-questions">
                        <div className="sub-question">
                            <span>Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tụy, viêm tủy xương?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q5a"
                                        value="yes"
                                        checked={questionnaireAnswers.q5a === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5a', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q5a"
                                        value="no"
                                        checked={questionnaireAnswers.q5a === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5a', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Sút cân nhanh không rõ nguyên nhân?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q5b"
                                        value="yes"
                                        checked={questionnaireAnswers.q5b === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5b', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q5b"
                                        value="no"
                                        checked={questionnaireAnswers.q5b === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5b', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Nổi hạch kéo dài?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q5c"
                                        value="yes"
                                        checked={questionnaireAnswers.q5c === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5c', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q5c"
                                        value="no"
                                        checked={questionnaireAnswers.q5c === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5c', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,…)?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q5d"
                                        value="yes"
                                        checked={questionnaireAnswers.q5d === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5d', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q5d"
                                        value="no"
                                        checked={questionnaireAnswers.q5d === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5d', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q5e"
                                        value="yes"
                                        checked={questionnaireAnswers.q5e === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5e', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q5e"
                                        value="no"
                                        checked={questionnaireAnswers.q5e === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q5e', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-actions">
                <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => { e.preventDefault(); setQuestionnaireStep(1); }}
                >
                    QUAY VỀ
                </button>
                <button
                    className="btn btn-danger"
                    onClick={(e) => { e.preventDefault(); setQuestionnaireStep(3); }}
                >
                    TIẾP THEO
                </button>
            </div>
        </div>
    );

    // Step 3: Questionnaire - Page 4 (Recent History & Final Questions)
    const renderQuestionnairePage4 = () => (
        <div className="donation-form-step questionnaire-step">
            <div className="questionnaire-header">
                <h4>Phiếu khám sàng lọc người hiến máu tình nguyện</h4>
                <p className="text-muted">Phần 4: Tiền sử gần đây & Câu hỏi đặc biệt</p>
                <div className="progress-indicator">
                    <span className="current-step">4</span> / {totalQuestionnaireSteps}
                </div>
            </div>

            {/* Câu hỏi 6 */}
            <div className="question-block">
                <div className="question-header">6. Trong 01 tháng gần đây, anh/chị có:</div>
                <div className="question-body">
                    <div className="sub-questions">
                        <div className="sub-question">
                            <span>Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q6a"
                                        value="yes"
                                        checked={questionnaireAnswers.q6a === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q6a', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q6a"
                                        value="no"
                                        checked={questionnaireAnswers.q6a === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q6a', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,…)?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q6b"
                                        value="yes"
                                        checked={questionnaireAnswers.q6b === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q6b', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q6b"
                                        value="no"
                                        checked={questionnaireAnswers.q6b === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q6b', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Câu hỏi 7 */}
            <div className="question-block">
                <div className="question-header">7. Trong 14 ngày gần đây, anh/chị có:</div>
                <div className="question-body">
                    <div className="sub-questions">
                        <div className="sub-question">
                            <span>Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q7a"
                                        value="yes"
                                        checked={questionnaireAnswers.q7a === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q7a', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q7a"
                                        value="no"
                                        checked={questionnaireAnswers.q7a === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q7a', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Câu hỏi 8 */}
            <div className="question-block">
                <div className="question-header">8. Trong 07 ngày gần đây, anh/chị có:</div>
                <div className="question-body">
                    <div className="sub-questions">
                        <div className="sub-question">
                            <span>Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q8a"
                                        value="yes"
                                        checked={questionnaireAnswers.q8a === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q8a', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q8a"
                                        value="no"
                                        checked={questionnaireAnswers.q8a === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q8a', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Câu hỏi 9 */}
            <div className="question-block">
                <div className="question-header">9. Câu hỏi dành cho phụ nữ:</div>
                <div className="question-body">
                    <div className="sub-questions">
                        <div className="sub-question">
                            <span>Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q9a"
                                        value="yes"
                                        checked={questionnaireAnswers.q9a === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q9a', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q9a"
                                        value="no"
                                        checked={questionnaireAnswers.q9a === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q9a', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                        <div className="sub-question">
                            <span>Chấm dứt thai kỳ trong 12 tháng gần đây (sảy thai, phá thai, thai ngoài tử cung)?</span>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="q9b"
                                        value="yes"
                                        checked={questionnaireAnswers.q9b === 'yes'}
                                        onChange={(e) => updateQuestionnaireAnswer('q9b', e.target.value)}
                                    /> Có
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="q9b"
                                        value="no"
                                        checked={questionnaireAnswers.q9b === 'no'}
                                        onChange={(e) => updateQuestionnaireAnswer('q9b', e.target.value)}
                                    /> Không
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            <div className="form-actions">
                <button
                    className="btn btn-outline-secondary"
                    onClick={(e) => { e.preventDefault(); setQuestionnaireStep(2); }}
                >
                    QUAY VỀ
                </button>
                <button
                    className="btn btn-danger"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowSuccess(true);
                    }}
                >
                    XÁC NHẬN
                </button>
            </div>

            {showSuccess && (
                <div className="success-notification">
                    <i className="bi bi-check-circle-fill"></i>
                    ĐÃ NHẬN ĐƯỢC ĐƠN ĐĂNG KÝ CỦA BẠN, THEO DÕI THANH THÔNG BÁO Ở TRANG CHỦ ĐỂ BIẾT THÊM THÔNG TIN
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
                    {step === 2 && (
                        <>
                            {questionnaireStep === 0 && renderQuestionnairePage1()}
                            {questionnaireStep === 1 && renderQuestionnairePage2()}
                            {questionnaireStep === 2 && renderQuestionnairePage3()}
                            {questionnaireStep === 3 && renderQuestionnairePage4()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BloodDonationFormPage;
