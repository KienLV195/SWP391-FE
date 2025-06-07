import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import { 
  mockBloodInventory, 
  getBloodInventoryWithStatus,
  BLOOD_GROUPS,
  RH_TYPES,
  COMPONENT_TYPES 
} from '../../services/mockData';
import '../../styles/pages/BloodInventoryManagement.scss';

const BloodInventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [filters, setFilters] = useState({
    bloodType: 'all',
    component: 'all',
    status: 'all'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newInventory, setNewInventory] = useState({
    bloodGroup: '',
    rhType: '',
    componentType: COMPONENT_TYPES.WHOLE,
    quantity: 0,
    isRare: false
  });

  useEffect(() => {
    // Load inventory with status
    const inventoryWithStatus = getBloodInventoryWithStatus();
    setInventory(inventoryWithStatus);
    setFilteredInventory(inventoryWithStatus);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = inventory;

    if (filters.bloodType !== 'all') {
      filtered = filtered.filter(item => item.bloodType === filters.bloodType);
    }

    if (filters.component !== 'all') {
      filtered = filtered.filter(item => item.componentType === filters.component);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    setFilteredInventory(filtered);
  }, [filters, inventory]);

  const getStatusText = (status) => {
    switch (status) {
      case 'critical': return 'Cực kỳ thiếu';
      case 'low': return 'Thiếu';
      case 'normal': return 'Bình thường';
      case 'high': return 'Dư thừa';
      default: return 'Không xác định';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'danger';
      case 'low': return 'warning';
      case 'normal': return 'success';
      case 'high': return 'info';
      default: return 'secondary';
    }
  };

  const handleUpdateQuantity = (inventoryID, newQuantity) => {
    setInventory(prev => prev.map(item => {
      if (item.inventoryID === inventoryID) {
        const updatedItem = { ...item, quantity: newQuantity };
        
        // Recalculate status
        let status = 'normal';
        if (newQuantity <= 2) {
          status = 'critical';
        } else if (newQuantity <= 5) {
          status = 'low';
        } else if (newQuantity >= 30) {
          status = 'high';
        }
        
        updatedItem.status = status;
        updatedItem.statusIcon = status === 'critical' ? '🚨' : 
                                  status === 'low' ? '⚠️' : 
                                  status === 'high' ? '✅' : '🔵';
        updatedItem.lastUpdated = new Date().toISOString();
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleAddInventory = () => {
    const newItem = {
      inventoryID: inventory.length + 1,
      bloodGroup: newInventory.bloodGroup,
      rhType: newInventory.rhType,
      bloodType: `${newInventory.bloodGroup}${newInventory.rhType}`,
      componentType: newInventory.componentType,
      quantity: newInventory.quantity,
      isRare: newInventory.isRare,
      lastUpdated: new Date().toISOString()
    };

    // Calculate status
    let status = 'normal';
    if (newItem.quantity <= 2) {
      status = 'critical';
    } else if (newItem.quantity <= 5) {
      status = 'low';
    } else if (newItem.quantity >= 30) {
      status = 'high';
    }

    newItem.status = status;
    newItem.statusIcon = status === 'critical' ? '🚨' : 
                         status === 'low' ? '⚠️' : 
                         status === 'high' ? '✅' : '🔵';

    setInventory(prev => [...prev, newItem]);
    setShowAddModal(false);
    setNewInventory({
      bloodGroup: '',
      rhType: '',
      componentType: COMPONENT_TYPES.WHOLE,
      quantity: 0,
      isRare: false
    });
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowUpdateModal(true);
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      handleUpdateQuantity(selectedItem.inventoryID, selectedItem.quantity);
      setShowUpdateModal(false);
      setSelectedItem(null);
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Calculate statistics
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const criticalItems = inventory.filter(item => item.status === 'critical').length;
  const lowItems = inventory.filter(item => item.status === 'low').length;
  const rareBloodUnits = inventory.filter(item => item.isRare).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="blood-inventory-management">
      <ManagerSidebar />
      
      <div className="blood-inventory-content">
        <div className="page-header">
          <div>
            <h1>🏦 Quản lý Kho Máu</h1>
            <p>Theo dõi và quản lý tồn kho máu theo nhóm máu và thành phần</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Thêm kho máu
          </button>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card total">
            <div className="stat-icon">🩸</div>
            <div className="stat-info">
              <h3>Tổng đơn vị</h3>
              <p className="stat-number">{totalUnits}</p>
            </div>
          </div>
          <div className="stat-card critical">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <h3>Cực kỳ thiếu</h3>
              <p className="stat-number">{criticalItems}</p>
            </div>
          </div>
          <div className="stat-card low">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>Thiếu</h3>
              <p className="stat-number">{lowItems}</p>
            </div>
          </div>
          <div className="stat-card rare">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Máu hiếm</h3>
              <p className="stat-number">{rareBloodUnits}</p>
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
              {Object.values(COMPONENT_TYPES).map(component => (
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
              <option value="critical">Cực kỳ thiếu</option>
              <option value="low">Thiếu</option>
              <option value="normal">Bình thường</option>
              <option value="high">Dư thừa</option>
            </select>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="inventory-grid">
          {filteredInventory.map(item => (
            <div key={item.inventoryID} className={`inventory-card ${item.status}`}>
              <div className="card-header">
                <div className="blood-type">
                  <span className="blood-type-text">{item.bloodType}</span>
                  {item.isRare && <span className="rare-badge">⭐ Hiếm</span>}
                </div>
                <div className="status-icon">{item.statusIcon}</div>
              </div>
              
              <div className="card-body">
                <div className="component-type">{item.componentType}</div>
                <div className="quantity">
                  <span className="quantity-number">{item.quantity}</span>
                  <span className="quantity-unit">đơn vị</span>
                </div>
                <div className={`status-text status-${getStatusColor(item.status)}`}>
                  {getStatusText(item.status)}
                </div>
              </div>
              
              <div className="card-footer">
                <small className="last-updated">
                  Cập nhật: {new Date(item.lastUpdated).toLocaleDateString('vi-VN')}
                </small>
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => handleEditItem(item)}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Table */}
        <div className="inventory-table-container">
          <h2>Chi tiết kho máu</h2>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Nhóm máu</th>
                <th>Thành phần</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th>Máu hiếm</th>
                <th>Cập nhật cuối</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map(item => (
                <tr key={item.inventoryID}>
                  <td>
                    <span className="blood-type-badge">{item.bloodType}</span>
                  </td>
                  <td>{item.componentType}</td>
                  <td>
                    <span className="quantity-display">
                      {item.quantity} đơn vị
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${getStatusColor(item.status)}`}>
                      {item.statusIcon} {getStatusText(item.status)}
                    </span>
                  </td>
                  <td>
                    {item.isRare ? (
                      <span className="rare-indicator">⭐ Có</span>
                    ) : (
                      <span className="normal-indicator">Không</span>
                    )}
                  </td>
                  <td>{new Date(item.lastUpdated).toLocaleString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditItem(item)}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm kho máu mới</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nhóm máu:</label>
                <select 
                  value={newInventory.bloodGroup}
                  onChange={(e) => setNewInventory(prev => ({...prev, bloodGroup: e.target.value}))}
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
                  value={newInventory.rhType}
                  onChange={(e) => setNewInventory(prev => ({...prev, rhType: e.target.value}))}
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
                  value={newInventory.componentType}
                  onChange={(e) => setNewInventory(prev => ({...prev, componentType: e.target.value}))}
                >
                  {Object.values(COMPONENT_TYPES).map(component => (
                    <option key={component} value={component}>{component}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Số lượng:</label>
                <input 
                  type="number"
                  value={newInventory.quantity}
                  onChange={(e) => setNewInventory(prev => ({...prev, quantity: parseInt(e.target.value) || 0}))}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={newInventory.isRare}
                    onChange={(e) => setNewInventory(prev => ({...prev, isRare: e.target.checked}))}
                  />
                  Máu hiếm
                </label>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddInventory}
                  disabled={!newInventory.bloodGroup || !newInventory.rhType}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Inventory Modal */}
      {showUpdateModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cập nhật kho máu {selectedItem.bloodType}</h2>
              <button className="close-btn" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nhóm máu:</label>
                <input type="text" value={selectedItem.bloodType} disabled />
              </div>
              <div className="form-group">
                <label>Thành phần:</label>
                <input type="text" value={selectedItem.componentType} disabled />
              </div>
              <div className="form-group">
                <label>Số lượng hiện tại:</label>
                <input 
                  type="number"
                  value={selectedItem.quantity}
                  onChange={(e) => setSelectedItem(prev => ({...prev, quantity: parseInt(e.target.value) || 0}))}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Trạng thái hiện tại:</label>
                <span className={`status-badge status-${getStatusColor(selectedItem.status)}`}>
                  {selectedItem.statusIcon} {getStatusText(selectedItem.status)}
                </span>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                  Hủy
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleUpdateItem}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodInventoryManagement;
