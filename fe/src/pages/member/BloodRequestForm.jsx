import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberNavbar from '../../components/member/MemberNavbar';
import authService from '../../services/authService';
import '../../styles/pages/BloodRequestForm.scss';

const BloodRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bloodType: '',
    component: 'whole_blood',
    quantity: 1,
    urgency: 'normal',
    reason: '',
    neededDate: '',
    doctorInfo: {
      name: '',
      department: '',
      specialization: '',
      phone: '',
      email: '',
      hospital: ''
    },
    medicalDocuments: null,
    additionalNotes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const bloodComponents = [
    { value: 'whole_blood', label: 'Máu toàn phần' },
    { value: 'red_cells', label: 'Hồng cầu' },
    { value: 'platelets', label: 'Tiểu cầu' },
    { value: 'plasma', label: 'Huyết tương' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('doctorInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        doctorInfo: {
          ...prev.doctorInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      medicalDocuments: file
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bloodType) {
      newErrors.bloodType = 'Vui lòng chọn nhóm máu';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Vui lòng nhập lý do cần máu';
    }

    if (!formData.neededDate) {
      newErrors.neededDate = 'Vui lòng chọn ngày cần máu';
    } else {
      const selectedDate = new Date(formData.neededDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.neededDate = 'Ngày cần máu không thể là ngày trong quá khứ';
      }
    }

    if (!formData.doctorInfo.name.trim()) {
      newErrors['doctorInfo.name'] = 'Vui lòng nhập tên bác sĩ';
    }

    if (!formData.doctorInfo.department.trim()) {
      newErrors['doctorInfo.department'] = 'Vui lòng nhập khoa/phòng ban';
    }

    if (!formData.doctorInfo.phone.trim()) {
      newErrors['doctorInfo.phone'] = 'Vui lòng nhập số điện thoại bác sĩ';
    }

    if (!formData.doctorInfo.email.trim()) {
      newErrors['doctorInfo.email'] = 'Vui lòng nhập email bác sĩ';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.doctorInfo.email)) {
      newErrors['doctorInfo.email'] = 'Email không hợp lệ';
    }

    if (!formData.doctorInfo.hospital.trim()) {
      newErrors['doctorInfo.hospital'] = 'Vui lòng nhập tên bệnh viện/cơ sở y tế';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would send data to backend
      console.log('Blood request submitted:', formData);
      
      // Show success message and redirect
      alert('Yêu cầu máu đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');
      navigate('/member/recipient');
      
    } catch (error) {
      console.error('Error submitting blood request:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const user = authService.getCurrentUser();

  return (
    <>
      <MemberNavbar />
      <div className="blood-request-form">
        <div className="form-container">
          <div className="form-header">
            <h1>Tạo yêu cầu máu</h1>
            <p>Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất</p>
          </div>

          <form onSubmit={handleSubmit} className="request-form">
            {/* Blood Information */}
            <div className="form-section">
              <h2>Thông tin máu cần thiết</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="required">Nhóm máu</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className={errors.bloodType ? 'error' : ''}
                  >
                    <option value="">Chọn nhóm máu</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.bloodType && <span className="error-message">{errors.bloodType}</span>}
                </div>

                <div className="form-group">
                  <label>Thành phần máu</label>
                  <select
                    name="component"
                    value={formData.component}
                    onChange={handleInputChange}
                  >
                    {bloodComponents.map(comp => (
                      <option key={comp.value} value={comp.value}>{comp.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số lượng (đơn vị)</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="form-group">
                  <label>Mức độ khẩn cấp</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="normal">Bình thường</option>
                    <option value="emergency">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="required">Ngày cần máu</label>
                <input
                  type="date"
                  name="neededDate"
                  value={formData.neededDate}
                  onChange={handleInputChange}
                  className={errors.neededDate ? 'error' : ''}
                />
                {errors.neededDate && <span className="error-message">{errors.neededDate}</span>}
              </div>

              <div className="form-group">
                <label className="required">Lý do cần máu</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết lý do cần máu (phẫu thuật, điều trị, tai nạn...)"
                  rows="3"
                  className={errors.reason ? 'error' : ''}
                />
                {errors.reason && <span className="error-message">{errors.reason}</span>}
              </div>
            </div>

            {/* Doctor Information */}
            <div className="form-section">
              <h2>Thông tin bác sĩ điều trị</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="required">Tên bác sĩ</label>
                  <input
                    type="text"
                    name="doctorInfo.name"
                    value={formData.doctorInfo.name}
                    onChange={handleInputChange}
                    placeholder="Họ và tên bác sĩ"
                    className={errors['doctorInfo.name'] ? 'error' : ''}
                  />
                  {errors['doctorInfo.name'] && <span className="error-message">{errors['doctorInfo.name']}</span>}
                </div>

                <div className="form-group">
                  <label className="required">Khoa/Phòng ban</label>
                  <input
                    type="text"
                    name="doctorInfo.department"
                    value={formData.doctorInfo.department}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Khoa Ngoại, Khoa Tim mạch..."
                    className={errors['doctorInfo.department'] ? 'error' : ''}
                  />
                  {errors['doctorInfo.department'] && <span className="error-message">{errors['doctorInfo.department']}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Chuyên khoa</label>
                  <input
                    type="text"
                    name="doctorInfo.specialization"
                    value={formData.doctorInfo.specialization}
                    onChange={handleInputChange}
                    placeholder="Chuyên khoa của bác sĩ"
                  />
                </div>

                <div className="form-group">
                  <label className="required">Bệnh viện/Cơ sở y tế</label>
                  <input
                    type="text"
                    name="doctorInfo.hospital"
                    value={formData.doctorInfo.hospital}
                    onChange={handleInputChange}
                    placeholder="Tên bệnh viện hoặc cơ sở y tế"
                    className={errors['doctorInfo.hospital'] ? 'error' : ''}
                  />
                  {errors['doctorInfo.hospital'] && <span className="error-message">{errors['doctorInfo.hospital']}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="required">Số điện thoại</label>
                  <input
                    type="tel"
                    name="doctorInfo.phone"
                    value={formData.doctorInfo.phone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại liên hệ"
                    className={errors['doctorInfo.phone'] ? 'error' : ''}
                  />
                  {errors['doctorInfo.phone'] && <span className="error-message">{errors['doctorInfo.phone']}</span>}
                </div>

                <div className="form-group">
                  <label className="required">Email</label>
                  <input
                    type="email"
                    name="doctorInfo.email"
                    value={formData.doctorInfo.email}
                    onChange={handleInputChange}
                    placeholder="Email liên hệ"
                    className={errors['doctorInfo.email'] ? 'error' : ''}
                  />
                  {errors['doctorInfo.email'] && <span className="error-message">{errors['doctorInfo.email']}</span>}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h2>Thông tin bổ sung</h2>
              
              <div className="form-group">
                <label>Tài liệu y tế (tùy chọn)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <small className="help-text">
                  Đính kèm kết quả xét nghiệm, chẩn đoán hoặc tài liệu y tế liên quan (PDF, JPG, PNG)
                </small>
              </div>

              <div className="form-group">
                <label>Ghi chú thêm</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Thông tin bổ sung khác (nếu có)"
                  rows="3"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/member/recipient')}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BloodRequestForm;
