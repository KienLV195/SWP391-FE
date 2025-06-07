import React from 'react';
import StatusWorkflowService from '../../services/statusWorkflowService';
import '../../styles/components/StatusStatistics.scss';

const StatusStatistics = ({ 
  items = [], 
  workflowType = 'donation', 
  title = 'Thống kê trạng thái',
  showPercentage = true,
  layout = 'grid' // grid, horizontal, vertical
}) => {
  const statistics = StatusWorkflowService.getStatusStatistics(items, workflowType);
  const totalItems = items.length;

  const getPercentage = (count) => {
    return totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
  };

  const sortedStats = Object.entries(statistics).sort((a, b) => b[1].count - a[1].count);

  if (totalItems === 0) {
    return (
      <div className="status-statistics empty">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>Chưa có dữ liệu</h3>
          <p>Chưa có {workflowType === 'donation' ? 'hiến máu' : 'yêu cầu máu'} nào để thống kê.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`status-statistics ${layout}`}>
      <div className="statistics-header">
        <h3>{title}</h3>
        <div className="total-count">
          Tổng cộng: <strong>{totalItems}</strong> {workflowType === 'donation' ? 'lượt hiến máu' : 'yêu cầu'}
        </div>
      </div>

      <div className="statistics-content">
        {sortedStats.map(([status, data]) => (
          <div key={status} className="stat-item">
            <div className="stat-header">
              <div className="stat-icon-title">
                <span 
                  className="stat-icon"
                  style={{ color: data.color }}
                >
                  {data.icon}
                </span>
                <div className="stat-title">{data.text}</div>
              </div>
              <div className="stat-count">
                <span className="count-number">{data.count}</span>
                {showPercentage && (
                  <span className="count-percentage">
                    ({getPercentage(data.count)}%)
                  </span>
                )}
              </div>
            </div>

            {showPercentage && (
              <div className="stat-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${getPercentage(data.count)}%`,
                      backgroundColor: data.color
                    }}
                  />
                </div>
              </div>
            )}

            <div className="stat-description">
              {data.description}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="statistics-summary">
        <div className="summary-card success">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <div className="summary-title">Thành công</div>
            <div className="summary-count">
              {(() => {
                const successStatuses = workflowType === 'donation' 
                  ? [StatusWorkflowService.DONATION_STATUSES.COMPLETED]
                  : [StatusWorkflowService.REQUEST_STATUSES.COMPLETED];
                
                const successCount = Object.entries(statistics)
                  .filter(([status]) => successStatuses.includes(status))
                  .reduce((sum, [, data]) => sum + data.count, 0);
                
                return successCount;
              })()}
            </div>
          </div>
        </div>

        <div className="summary-card pending">
          <div className="summary-icon">⏳</div>
          <div className="summary-content">
            <div className="summary-title">Đang xử lý</div>
            <div className="summary-count">
              {(() => {
                const pendingStatuses = workflowType === 'donation' 
                  ? [
                      StatusWorkflowService.DONATION_STATUSES.REGISTERED,
                      StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECKED,
                      StatusWorkflowService.DONATION_STATUSES.DONATED,
                      StatusWorkflowService.DONATION_STATUSES.BLOOD_TESTED
                    ]
                  : [
                      StatusWorkflowService.REQUEST_STATUSES.PENDING,
                      StatusWorkflowService.REQUEST_STATUSES.DOCTOR_APPROVED,
                      StatusWorkflowService.REQUEST_STATUSES.APPROVED,
                      StatusWorkflowService.REQUEST_STATUSES.FULFILLED
                    ];
                
                const pendingCount = Object.entries(statistics)
                  .filter(([status]) => pendingStatuses.includes(status))
                  .reduce((sum, [, data]) => sum + data.count, 0);
                
                return pendingCount;
              })()}
            </div>
          </div>
        </div>

        <div className="summary-card failed">
          <div className="summary-icon">❌</div>
          <div className="summary-content">
            <div className="summary-title">Không thành công</div>
            <div className="summary-count">
              {(() => {
                const failedStatuses = workflowType === 'donation' 
                  ? [
                      StatusWorkflowService.DONATION_STATUSES.REGISTRATION_FAILED,
                      StatusWorkflowService.DONATION_STATUSES.HEALTH_CHECK_FAILED,
                      StatusWorkflowService.DONATION_STATUSES.NOT_ELIGIBLE
                    ]
                  : [
                      StatusWorkflowService.REQUEST_STATUSES.REJECTED,
                      StatusWorkflowService.REQUEST_STATUSES.DOCTOR_REJECTED
                    ];
                
                const failedCount = Object.entries(statistics)
                  .filter(([status]) => failedStatuses.includes(status))
                  .reduce((sum, [, data]) => sum + data.count, 0);
                
                return failedCount;
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="success-rate-section">
        <h4>📈 Tỷ lệ thành công</h4>
        <div className="success-rate-chart">
          {(() => {
            const completedCount = statistics[
              workflowType === 'donation' 
                ? StatusWorkflowService.DONATION_STATUSES.COMPLETED
                : StatusWorkflowService.REQUEST_STATUSES.COMPLETED
            ]?.count || 0;
            
            const successRate = getPercentage(completedCount);
            
            return (
              <div className="circular-progress">
                <div className="progress-circle">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#e9ecef"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#28a745"
                      strokeWidth="10"
                      strokeDasharray={`${successRate * 3.14} 314`}
                      strokeDashoffset="78.5"
                      transform="rotate(-90 60 60)"
                      className="progress-stroke"
                    />
                  </svg>
                  <div className="progress-text">
                    <span className="percentage">{successRate}%</span>
                    <span className="label">Thành công</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default StatusStatistics;
