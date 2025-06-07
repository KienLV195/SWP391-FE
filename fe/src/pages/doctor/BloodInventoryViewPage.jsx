import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import authService from '../../services/authService';
import { 
  BLOOD_GROUPS, 
  COMPONENT_TYPES,
  DOCTOR_TYPES 
} from '../../services/mockData';
import '../../styles/pages/BloodInventoryViewPage.scss';

const BloodInventoryViewPage = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [filters, setFilters] = useState({
    bloodType: 'all',
    component: 'all',
    status: 'all'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const currentUser = authService.getCurrentUser();
  const isBloodDepartment = currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;

  useEffect(() => {
    // Mock blood inventory data
    const mockInventory = [
      {
        id: 1,
        bloodType: 'O+',
        component: COMPONENT_TYPES.WHOLE,
        quantity: 45,
        unit: 'đơn vị',
        expiryDate: '2024-12-25',
        status: 'normal',
        location: 'Kho A-1',
        lastUpdated: '2024-12-10T10:30:00',
        isRare: false
      },
      {
        id: 2,
        bloodType: 'O-',
        component: COMPONENT_TYPES.WHOLE,
        quantity: 8,
        unit: 'đơn vị',
        expiryDate: '2024-12-20',
        status: 'low',
        location: 'Kho A-2',
        lastUpdated: '2024-12-10T09:15:00',
        isRare: true
      },
      {
        id: 3,
        bloodType: 'A+',
        component: COMPONENT_TYPES.PLASMA,
        quantity: 32,
        unit: 'ml',
        expiryDate: '2025-01-15',
        status: 'normal',
        location: 'Kho B-1',
        lastUpdated: '2024-12-09T14:20:00',
        isRare: false
      },
      {
        id: 4,
        bloodType: 'AB-',
        component: COMPONENT_TYPES.PLATELETS,
        quantity: 3,
        unit: 'đơn vị',
        expiryDate: '2024-12-15',
        status: 'critical',
        location: 'Kho C-1',
        lastUpdated: '2024-12-10T08:45:00',
        isRare: true
      },
      {
        id: 5,
        bloodType: 'B+',
        component: COMPONENT_TYPES.RED_CELLS,
        quantity: 28,
        unit: 'đơn vị',
        expiryDate: '2024-12-30',
        status: 'normal',
        location: 'Kho A-3',
        lastUpdated: '2024-12-10T11:00:00',
        isRare: false
      },
      {
        id: 6,
        bloodType: 'B-',
        component: COMPONENT_TYPES.WHOLE,
        quantity: 5,
        unit: 'đơn vị',
        expiryDate: '2024-12-18',
        status: 'critical',
        location: 'Kho A-4',
        lastUpdated: '2024-12-09T16:30:00',
        isRare: true
      },
      {
        id: 7,
        bloodType: 'AB+',
        component: COMPONENT_TYPES.PLASMA,
        quantity: 15,
        unit: 'ml',
        expiryDate: '2025-01-20',
        status: 'normal',
        location: 'Kho B-2',
        lastUpdated: '2024-12-10T13:15:00',
        isRare: false
      },
      {
        id: 8,
        bloodType: 'A-',
        component: COMPONENT_TYPES.PLATELETS,
        quantity: 12,
        unit: 'đơn vị',
        expiryDate: '2024-12-22',
        status: 'normal',
        location: 'Kho C-2',
        lastUpdated: '2024-12-10T07:30:00',
        isRare: false
      }
    ];

    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = inventory;

    if (filters.bloodType !== 'all') {
      filtered = filtered.filter(item => item.bloodType === filters.bloodType);
    }

    if (filters.component !== 'all') {
      filtered = filtered.filter(item => item.component === filters.component);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    setFilteredInventory(filtered);
  }, [filters, inventory]);

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return 'Bình thường';
      case 'low': return 'Thấp';
      case 'critical': return 'Cực thấp';
      case 'expired': return 'Hết hạn';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'success';
      case 'low': return 'warning';
      case 'critical': return 'danger';
      case 'expired': return 'secondary';
      default: return 'secondary';
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    return 'normal';
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components = Object.values(COMPONENT_TYPES);

  return (
    <div className="blood-inventory-view">
      <DoctorSidebar />
      
      <div className="blood-inventory-view-content">
        <div className="page-header">
          <div>
            <h1>🏦 Kho máu</h1>
            <p>Xem tình trạng kho máu hiện tại</p>
            <div className="access-level">
              {isBloodDepartment ? (
                <span className="full-access">🩸 Khoa Huyết học - Xem đầy đủ</span>
              ) : (
                <span className="limited-access">🏥 Khoa khác - Chỉ xem</span>
              )}
            </div>
          </div>
          <div className="view-controls">
            <button 
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('grid')}
            >
              📊 Lưới
            </button>
            <button 
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              📋 Bảng
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card total">
            <div className="stat-icon">🩸</div>
            <div className="stat-info">
              <h3>Tổng kho máu</h3>
              <p className="stat-number">{inventory.length}</p>
            </div>
          </div>
          <div className="stat-card critical">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>Cực thấp</h3>
              <p className="stat-number danger">
                {inventory.filter(item => item.status === 'critical').length}
              </p>
            </div>
          </div>
          <div className="stat-card low">
            <div className="stat-icon">📉</div>
            <div className="stat-info">
              <h3>Thấp</h3>
              <p className="stat-number warning">
                {inventory.filter(item => item.status === 'low').length}
              </p>
            </div>
          </div>
          <div className="stat-card rare">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Máu hiếm</h3>
              <p className="stat-number rare">
                {inventory.filter(item => item.isRare).length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
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
            <label>Thành phần:</label>
            <select 
              value={filters.component} 
              onChange={(e) => setFilters(prev => ({...prev, component: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              {components.map(component => (
                <option key={component} value={component}>{component}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select 
              value={filters.status} 
              onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
            >
              <option value="all">Tất cả</option>
              <option value="normal">Bình thường</option>
              <option value="low">Thấp</option>
              <option value="critical">Cực thấp</option>
            </select>
          </div>
        </div>

        {/* Inventory Display */}
        {viewMode === 'grid' ? (
          <div className="inventory-grid">
            {filteredInventory.map(item => (
              <div key={item.id} className={`inventory-card ${getStatusColor(item.status)}`}>
                <div className="card-header">
                  <div className="blood-type-info">
                    <span className="blood-type">{item.bloodType}</span>
                    {item.isRare && <span className="rare-badge">⭐ Hiếm</span>}
                  </div>
                  <div className={`status-icon status-${getStatusColor(item.status)}`}>
                    {item.status === 'critical' ? '⚠️' : 
                     item.status === 'low' ? '📉' : '✅'}
                  </div>
                </div>

                <div className="card-body">
                  <div className="component-type">{item.component}</div>
                  <div className="quantity">
                    <span className="quantity-number">{item.quantity}</span>
                    <span className="quantity-unit">{item.unit}</span>
                  </div>
                  <div className={`status-text status-${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </div>
                </div>

                <div className="card-footer">
                  <div className="location">📍 {item.location}</div>
                  <div className={`expiry expiry-${getExpiryStatus(item.expiryDate)}`}>
                    HSD: {getDaysUntilExpiry(item.expiryDate)} ngày
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="inventory-table-container">
            <h2>Chi tiết kho máu</h2>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Nhóm máu</th>
                  <th>Thành phần</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                  <th>Vị trí</th>
                  <th>Hạn sử dụng</th>
                  <th>Cập nhật cuối</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="blood-type-badge">{item.bloodType}</span>
                      {item.isRare && <span className="rare-indicator">⭐</span>}
                    </td>
                    <td>{item.component}</td>
                    <td>
                      <span className="quantity-display">{item.quantity} {item.unit}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <div className={`expiry-info expiry-${getExpiryStatus(item.expiryDate)}`}>
                        <div>{new Date(item.expiryDate).toLocaleDateString('vi-VN')}</div>
                        <small>({getDaysUntilExpiry(item.expiryDate)} ngày)</small>
                      </div>
                    </td>
                    <td>
                      <small>{new Date(item.lastUpdated).toLocaleString('vi-VN')}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Blood Type Summary */}
        <div className="blood-type-summary">
          <h2>Tổng quan theo nhóm máu</h2>
          <div className="summary-grid">
            {bloodTypes.map(bloodType => {
              const typeItems = inventory.filter(item => item.bloodType === bloodType);
              const totalQuantity = typeItems.reduce((sum, item) => sum + item.quantity, 0);
              const isRare = ['AB-', 'B-', 'O-'].includes(bloodType);
              const hasLowStock = typeItems.some(item => item.status === 'critical' || item.status === 'low');
              
              return (
                <div key={bloodType} className={`summary-card ${hasLowStock ? 'low-stock' : 'normal-stock'}`}>
                  <div className="summary-header">
                    <span className="blood-type-large">{bloodType}</span>
                    {isRare && <span className="rare-badge">⭐</span>}
                  </div>
                  <div className="summary-body">
                    <div className="total-quantity">{totalQuantity}</div>
                    <div className="item-count">{typeItems.length} loại</div>
                    {hasLowStock && (
                      <div className="warning-text">⚠️ Cần bổ sung</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodInventoryViewPage;
