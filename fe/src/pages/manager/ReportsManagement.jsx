import React, { useState, useEffect } from 'react';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import { 
  mockBloodRequests, 
  mockDonationHistory, 
  mockUsers,
  mockBloodInventory,
  REQUEST_STATUS,
  URGENCY_LEVELS 
} from '../../services/mockData';
import '../../styles/pages/ReportsManagement.scss';

const ReportsManagement = () => {
  const [reportData, setReportData] = useState({
    bloodRequests: [],
    donations: [],
    users: [],
    inventory: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load all data for reports
    setReportData({
      bloodRequests: mockBloodRequests,
      donations: mockDonationHistory,
      users: mockUsers,
      inventory: mockBloodInventory
    });
  }, []);

  // Calculate statistics based on selected period
  const getFilteredData = () => {
    const now = new Date();
    const filterDate = new Date();

    switch (selectedPeriod) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        filterDate.setMonth(now.getMonth() - 1);
    }

    return {
      requests: reportData.bloodRequests.filter(req => 
        new Date(req.createdTime) >= filterDate
      ),
      donations: reportData.donations.filter(donation => 
        new Date(donation.donationDate) >= filterDate
      )
    };
  };

  const filteredData = getFilteredData();

  // Overview Statistics
  const overviewStats = {
    totalRequests: filteredData.requests.length,
    pendingRequests: filteredData.requests.filter(r => r.status === REQUEST_STATUS.PENDING).length,
    completedRequests: filteredData.requests.filter(r => r.status === REQUEST_STATUS.COMPLETED).length,
    urgentRequests: filteredData.requests.filter(r => r.urgencyLevel >= URGENCY_LEVELS.URGENT).length,
    totalDonations: filteredData.donations.length,
    successfulDonations: filteredData.donations.filter(d => d.isSuccessful).length,
    totalBloodUnits: filteredData.donations.reduce((sum, d) => sum + (d.quantity || 0), 0),
    totalUsers: reportData.users.filter(u => u.role === 'Member').length,
    inventoryItems: reportData.inventory.length,
    totalInventoryUnits: reportData.inventory.reduce((sum, i) => sum + i.quantity, 0)
  };

  // Blood Type Distribution
  const bloodTypeDistribution = reportData.inventory.reduce((acc, item) => {
    acc[item.bloodType] = (acc[item.bloodType] || 0) + item.quantity;
    return acc;
  }, {});

  // Monthly trends (simplified)
  const monthlyTrends = {
    requests: [12, 19, 15, 25, 22, 18, 28, 24, 20, 16, 21, 19],
    donations: [8, 14, 12, 18, 16, 13, 22, 19, 15, 12, 17, 14]
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would generate and download a PDF/Excel file
    const reportContent = generateReportContent();
    downloadReport(reportContent);
    
    setIsGenerating(false);
  };

  const generateReportContent = () => {
    return {
      title: `Báo cáo ${getReportTitle()} - ${getPeriodText()}`,
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      data: {
        overview: overviewStats,
        bloodTypes: bloodTypeDistribution,
        trends: monthlyTrends,
        details: {
          requests: filteredData.requests,
          donations: filteredData.donations
        }
      }
    };
  };

  const downloadReport = (content) => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `blood_management_report_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getReportTitle = () => {
    switch (selectedReport) {
      case 'overview': return 'Tổng quan';
      case 'requests': return 'Yêu cầu máu';
      case 'donations': return 'Hiến máu';
      case 'inventory': return 'Kho máu';
      default: return 'Tổng quan';
    }
  };

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case 'week': return '7 ngày qua';
      case 'month': return '30 ngày qua';
      case 'quarter': return '3 tháng qua';
      case 'year': return '12 tháng qua';
      default: return '30 ngày qua';
    }
  };

  return (
    <div className="reports-management">
      <ManagerSidebar />
      
      <div className="reports-content">
        <div className="page-header">
          <div>
            <h1>📊 Báo cáo & Thống kê</h1>
            <p>Tạo và xuất báo cáo chi tiết về hoạt động quản lý máu</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? '⏳ Đang tạo...' : '📄 Xuất báo cáo'}
          </button>
        </div>

        {/* Report Controls */}
        <div className="report-controls">
          <div className="control-group">
            <label>Loại báo cáo:</label>
            <select 
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="overview">Tổng quan</option>
              <option value="requests">Yêu cầu máu</option>
              <option value="donations">Hiến máu</option>
              <option value="inventory">Kho máu</option>
            </select>
          </div>

          <div className="control-group">
            <label>Thời gian:</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">3 tháng qua</option>
              <option value="year">12 tháng qua</option>
            </select>
          </div>
        </div>

        {/* Overview Dashboard */}
        <div className="dashboard-overview">
          <div className="stats-grid">
            <div className="stat-card requests">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>Yêu cầu máu</h3>
                <p className="stat-number">{overviewStats.totalRequests}</p>
                <small>Tổng số yêu cầu</small>
              </div>
            </div>

            <div className="stat-card donations">
              <div className="stat-icon">🩸</div>
              <div className="stat-info">
                <h3>Hiến máu</h3>
                <p className="stat-number">{overviewStats.totalDonations}</p>
                <small>Lượt hiến máu</small>
              </div>
            </div>

            <div className="stat-card blood-units">
              <div className="stat-icon">🏥</div>
              <div className="stat-info">
                <h3>Đơn vị máu</h3>
                <p className="stat-number">{overviewStats.totalBloodUnits}</p>
                <small>ml máu thu được</small>
              </div>
            </div>

            <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Thành viên</h3>
                <p className="stat-number">{overviewStats.totalUsers}</p>
                <small>Người dùng đăng ký</small>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="detailed-stats">
          <div className="stats-section">
            <h2>📈 Thống kê chi tiết - {getPeriodText()}</h2>
            
            <div className="stats-row">
              <div className="stat-item">
                <h4>Yêu cầu máu</h4>
                <div className="stat-breakdown">
                  <div className="breakdown-item">
                    <span className="label">Đang chờ:</span>
                    <span className="value pending">{overviewStats.pendingRequests}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="label">Hoàn thành:</span>
                    <span className="value completed">{overviewStats.completedRequests}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="label">Khẩn cấp:</span>
                    <span className="value urgent">{overviewStats.urgentRequests}</span>
                  </div>
                </div>
              </div>

              <div className="stat-item">
                <h4>Hiến máu</h4>
                <div className="stat-breakdown">
                  <div className="breakdown-item">
                    <span className="label">Thành công:</span>
                    <span className="value success">{overviewStats.successfulDonations}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="label">Tỷ lệ thành công:</span>
                    <span className="value rate">
                      {overviewStats.totalDonations > 0 
                        ? Math.round((overviewStats.successfulDonations / overviewStats.totalDonations) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Type Distribution */}
          <div className="stats-section">
            <h2>🩸 Phân bố nhóm máu trong kho</h2>
            <div className="blood-type-chart">
              {Object.entries(bloodTypeDistribution).map(([bloodType, quantity]) => (
                <div key={bloodType} className="blood-type-item">
                  <div className="blood-type-label">{bloodType}</div>
                  <div className="blood-type-bar">
                    <div 
                      className="blood-type-fill"
                      style={{ 
                        width: `${(quantity / Math.max(...Object.values(bloodTypeDistribution))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="blood-type-value">{quantity} đơn vị</div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="stats-section">
            <h2>📊 Xu hướng theo tháng</h2>
            <div className="trends-chart">
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color requests"></span>
                  <span>Yêu cầu máu</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color donations"></span>
                  <span>Hiến máu</span>
                </div>
              </div>
              <div className="chart-bars">
                {monthlyTrends.requests.map((value, index) => (
                  <div key={index} className="chart-month">
                    <div className="chart-bars-container">
                      <div 
                        className="chart-bar requests"
                        style={{ height: `${(value / 30) * 100}%` }}
                        title={`Yêu cầu: ${value}`}
                      ></div>
                      <div 
                        className="chart-bar donations"
                        style={{ height: `${(monthlyTrends.donations[index] / 30) * 100}%` }}
                        title={`Hiến máu: ${monthlyTrends.donations[index]}`}
                      ></div>
                    </div>
                    <div className="chart-month-label">T{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          <h2>🕒 Hoạt động gần đây</h2>
          <div className="activities-list">
            {filteredData.requests.slice(0, 5).map(request => (
              <div key={request.requestID} className="activity-item">
                <div className="activity-icon">📋</div>
                <div className="activity-content">
                  <div className="activity-title">
                    Yêu cầu máu {request.bloodType} - {request.quantity} đơn vị
                  </div>
                  <div className="activity-time">
                    {new Date(request.createdTime).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className={`activity-status status-${request.status === REQUEST_STATUS.PENDING ? 'warning' : 'success'}`}>
                  {request.status === REQUEST_STATUS.PENDING ? 'Đang chờ' : 'Đã xử lý'}
                </div>
              </div>
            ))}
            
            {filteredData.donations.slice(0, 3).map(donation => (
              <div key={donation.donationID} className="activity-item">
                <div className="activity-icon">🩸</div>
                <div className="activity-content">
                  <div className="activity-title">
                    Hiến máu {donation.bloodType} - {donation.quantity}ml
                  </div>
                  <div className="activity-time">
                    {new Date(donation.donationDate).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className={`activity-status status-${donation.isSuccessful ? 'success' : 'warning'}`}>
                  {donation.isSuccessful ? 'Thành công' : 'Đang xử lý'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;
