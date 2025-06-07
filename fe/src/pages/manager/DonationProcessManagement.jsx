import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import { 
  mockDonationHistory, 
  mockUsers,
  BLOOD_GROUPS,
  RH_TYPES,
  COMPONENT_TYPES 
} from '../../services/mockData';
import '../../styles/pages/DonationProcessManagement.scss';

const DonationProcessManagement = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    bloodType: 'all',
    dateRange: 'all'
  });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState({
    userID: '',
    bloodGroup: '',
    rhType: '',
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 450,
    notes: ''
  });

  // Donation statuses for the process
  const DONATION_STATUS = {
    REGISTERED: 'registered',
    MEDICAL_CHECK: 'medical_check',
    DONATED: 'donated',
    TESTING: 'testing',
    COMPLETED: 'completed',
    REJECTED: 'rejected'
  };

  useEffect(() => {
    // Load donation history with enhanced status
    const enhancedDonations = mockDonationHistory.map(donation => ({
      ...donation,
      status: donation.isSuccessful ? DONATION_STATUS.COMPLETED : DONATION_STATUS.TESTING,
      donorName: mockUsers.find(u => u.userID === donation.userID)?.name || 'Unknown'
    }));
    setDonations(enhancedDonations);
    setFilteredDonations(enhancedDonations);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = donations;

    if (filters.status !== 'all') {
      filtered = filtered.filter(donation => donation.status === filters.status);
    }

    if (filters.bloodType !== 'all') {
      filtered = filtered.filter(donation => donation.bloodType === filters.bloodType);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          filterDate = null;
      }

      if (filterDate) {
        filtered = filtered.filter(donation => 
          new Date(donation.donationDate) >= filterDate
        );
      }
    }

    setFilteredDonations(filtered);
  }, [filters, donations]);

  const getStatusText = (status) => {
    switch (status) {
      case DONATION_STATUS.REGISTERED: return 'Đăng ký thành công';
      case DONATION_STATUS.MEDICAL_CHECK: return 'Đã khám';
      case DONATION_STATUS.DONATED: return 'Đã hiến máu';
      case DONATION_STATUS.TESTING: return 'Xét nghiệm';
      case DONATION_STATUS.COMPLETED: return 'Hoàn thành';
      case DONATION_STATUS.REJECTED: return 'Không đủ điều kiện';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case DONATION_STATUS.REGISTERED: return 'info';
      case DONATION_STATUS.MEDICAL_CHECK: return 'warning';
      case DONATION_STATUS.DONATED: return 'primary';
      case DONATION_STATUS.TESTING: return 'warning';
      case DONATION_STATUS.COMPLETED: return 'success';
      case DONATION_STATUS.REJECTED: return 'danger';
      default: return 'secondary';
    }
  };

  const handleStatusChange = (donationId, newStatus) => {
    setDonations(prev => prev.map(donation => 
      donation.donationID === donationId 
        ? { ...donation, status: newStatus }
        : donation
    ));
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleAddDonation = () => {
    const donation = {
      donationID: donations.length + 1,
      userID: parseInt(newDonation.userID),
      donationDate: new Date().toISOString(),
      bloodGroup: newDonation.bloodGroup,
      rhType: newDonation.rhType,
      bloodType: `${newDonation.bloodGroup}${newDonation.rhType}`,
      componentType: newDonation.componentType,
      quantity: newDonation.quantity,
      isSuccessful: false,
      notes: newDonation.notes,
      status: DONATION_STATUS.REGISTERED,
      donorName: mockUsers.find(u => u.userID === parseInt(newDonation.userID))?.name || 'Unknown'
    };

    setDonations(prev => [...prev, donation]);
    setShowAddModal(false);
    setNewDonation({
      userID: '',
      bloodGroup: '',
      rhType: '',
      componentType: COMPONENT_TYPES.WHOLE,
      quantity: 450,
      notes: ''
    });
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="donation-process-management">
      <ManagerSidebar />
      
      <div className="donation-process-content">
        <div className="page-header">
          <h1>🩸 Quản lý Quy trình Hiến máu</h1>
          <p>Theo dõi và quản lý toàn bộ quy trình hiến máu từ đăng ký đến hoàn thành</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Thêm đăng ký hiến máu
          </button>
        </div>

        {/* Process Flow */}
        <div className="process-flow">
          <div className="flow-step">
            <div className="step-icon">📝</div>
            <div className="step-title">Đăng ký</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-icon">🏥</div>
            <div className="step-title">Khám sàng lọc</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-icon">🩸</div>
            <div className="step-title">Hiến máu</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-icon">🔬</div>
            <div className="step-title">Xét nghiệm</div>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <div className="step-icon">✅</div>
            <div className="step-title">Hoàn thành</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select 
              value={filters.status} 
              onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              <option value={DONATION_STATUS.REGISTERED}>Đăng ký thành công</option>
              <option value={DONATION_STATUS.MEDICAL_CHECK}>Đã khám</option>
              <option value={DONATION_STATUS.DONATED}>Đã hiến máu</option>
              <option value={DONATION_STATUS.TESTING}>Xét nghiệm</option>
              <option value={DONATION_STATUS.COMPLETED}>Hoàn thành</option>
              <option value={DONATION_STATUS.REJECTED}>Không đủ điều kiện</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Nhóm máu:</label>
            <select 
              value={filters.bloodType} 
              onChange={(e) => setFilters(prev => ({...prev, bloodType: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Thời gian:</label>
            <select 
              value={filters.dateRange} 
              onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
            </select>
          </div>
        </div>

        {/* Donations Table */}
        <div className="donations-table-container">
          <table className="donations-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Người hiến</th>
                <th>Nhóm máu</th>
                <th>Số lượng</th>
                <th>Ngày hiến</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map(donation => (
                <tr key={donation.donationID}>
                  <td>#{donation.donationID}</td>
                  <td>{donation.donorName}</td>
                  <td>
                    <span className="blood-type-badge">{donation.bloodType}</span>
                  </td>
                  <td>{donation.quantity}ml</td>
                  <td>{new Date(donation.donationDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`status-badge status-${getStatusColor(donation.status)}`}>
                      {getStatusText(donation.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewDetails(donation)}
                      >
                        Chi tiết
                      </button>
                      {donation.status === DONATION_STATUS.REGISTERED && (
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => handleStatusChange(donation.donationID, DONATION_STATUS.MEDICAL_CHECK)}
                        >
                          Khám sàng lọc
                        </button>
                      )}
                      {donation.status === DONATION_STATUS.MEDICAL_CHECK && (
                        <>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusChange(donation.donationID, DONATION_STATUS.DONATED)}
                          >
                            Hiến máu
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleStatusChange(donation.donationID, DONATION_STATUS.REJECTED)}
                          >
                            Không đủ ĐK
                          </button>
                        </>
                      )}
                      {donation.status === DONATION_STATUS.DONATED && (
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => handleStatusChange(donation.donationID, DONATION_STATUS.TESTING)}
                        >
                          Xét nghiệm
                        </button>
                      )}
                      {donation.status === DONATION_STATUS.TESTING && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusChange(donation.donationID, DONATION_STATUS.COMPLETED)}
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Statistics */}
        <div className="statistics-section">
          <div className="stat-card">
            <h3>Tổng đăng ký</h3>
            <p className="stat-number">{donations.length}</p>
          </div>
          <div className="stat-card">
            <h3>Đang xử lý</h3>
            <p className="stat-number warning">
              {donations.filter(d => [DONATION_STATUS.REGISTERED, DONATION_STATUS.MEDICAL_CHECK, DONATION_STATUS.DONATED, DONATION_STATUS.TESTING].includes(d.status)).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Hoàn thành</h3>
            <p className="stat-number success">
              {donations.filter(d => d.status === DONATION_STATUS.COMPLETED).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Không đủ ĐK</h3>
            <p className="stat-number danger">
              {donations.filter(d => d.status === DONATION_STATUS.REJECTED).length}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedDonation && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết Hiến máu #{selectedDonation.donationID}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Người hiến:</strong> {selectedDonation.donorName}
              </div>
              <div className="detail-row">
                <strong>Nhóm máu:</strong> {selectedDonation.bloodType}
              </div>
              <div className="detail-row">
                <strong>Thành phần:</strong> {selectedDonation.componentType}
              </div>
              <div className="detail-row">
                <strong>Số lượng:</strong> {selectedDonation.quantity}ml
              </div>
              <div className="detail-row">
                <strong>Ngày hiến:</strong> {new Date(selectedDonation.donationDate).toLocaleString('vi-VN')}
              </div>
              <div className="detail-row">
                <strong>Trạng thái:</strong> 
                <span className={`status-badge status-${getStatusColor(selectedDonation.status)}`}>
                  {getStatusText(selectedDonation.status)}
                </span>
              </div>
              {selectedDonation.notes && (
                <div className="detail-row">
                  <strong>Ghi chú:</strong> {selectedDonation.notes}
                </div>
              )}
              {selectedDonation.testResults && (
                <div className="detail-row">
                  <strong>Kết quả xét nghiệm:</strong>
                  <div className="test-results">
                    <div>HIV: {selectedDonation.testResults.hiv}</div>
                    <div>Hepatitis B: {selectedDonation.testResults.hepatitisB}</div>
                    <div>Hepatitis C: {selectedDonation.testResults.hepatitisC}</div>
                    <div>Syphilis: {selectedDonation.testResults.syphilis}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Donation Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm đăng ký hiến máu</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Người hiến:</label>
                <select 
                  value={newDonation.userID}
                  onChange={(e) => setNewDonation(prev => ({...prev, userID: e.target.value}))}
                >
                  <option value="">Chọn người hiến</option>
                  {mockUsers.filter(u => u.role === 'Member').map(user => (
                    <option key={user.userID} value={user.userID}>
                      {user.name} - {user.bloodGroup}{user.rhType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Nhóm máu:</label>
                <select 
                  value={newDonation.bloodGroup}
                  onChange={(e) => setNewDonation(prev => ({...prev, bloodGroup: e.target.value}))}
                >
                  <option value="">Chọn nhóm máu</option>
                  {Object.values(BLOOD_GROUPS).map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Rh:</label>
                <select 
                  value={newDonation.rhType}
                  onChange={(e) => setNewDonation(prev => ({...prev, rhType: e.target.value}))}
                >
                  <option value="">Chọn Rh</option>
                  {Object.values(RH_TYPES).map(rh => (
                    <option key={rh} value={rh}>{rh}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Thành phần:</label>
                <select 
                  value={newDonation.componentType}
                  onChange={(e) => setNewDonation(prev => ({...prev, componentType: e.target.value}))}
                >
                  {Object.values(COMPONENT_TYPES).map(component => (
                    <option key={component} value={component}>{component}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số lượng (ml):</label>
                <input 
                  type="number"
                  value={newDonation.quantity}
                  onChange={(e) => setNewDonation(prev => ({...prev, quantity: parseInt(e.target.value)}))}
                  min="200"
                  max="500"
                />
              </div>
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea 
                  value={newDonation.notes}
                  onChange={(e) => setNewDonation(prev => ({...prev, notes: e.target.value}))}
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddDonation}
                  disabled={!newDonation.userID || !newDonation.bloodGroup || !newDonation.rhType}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationProcessManagement;
