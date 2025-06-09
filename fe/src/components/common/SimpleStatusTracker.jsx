import React from 'react';
import { 
  DONATION_STATUS, 
  REQUEST_STATUS, 
  URGENCY_LABELS,
  URGENCY_COLORS,
  URGENCY_ICONS
} from '../../constants/systemConstants';
import '../../styles/components/SimpleStatusTracker.scss';

const SimpleStatusTracker = ({ 
  currentStatus, 
  workflowType = 'donation',
  urgency = null,
  compact = false 
}) => {
  
  const getStatusInfo = (status, type) => {
    if (type === 'donation') {
      switch (status) {
        case DONATION_STATUS.REGISTERED:
          return { text: 'Đăng ký thành công', color: '#007bff', icon: '📝' };
        case DONATION_STATUS.HEALTH_CHECKED:
          return { text: 'Đã khám sàng lọc', color: '#17a2b8', icon: '🩺' };
        case DONATION_STATUS.NOT_ELIGIBLE_HEALTH:
          return { text: 'Không đủ điều kiện (Sức khỏe)', color: '#dc3545', icon: '❌' };
        case DONATION_STATUS.DONATED:
          return { text: 'Đã hiến máu', color: '#28a745', icon: '🩸' };
        case DONATION_STATUS.BLOOD_TESTED:
          return { text: 'Đã xét nghiệm', color: '#ffc107', icon: '🧪' };
        case DONATION_STATUS.NOT_ELIGIBLE_TEST:
          return { text: 'Không đủ điều kiện (Xét nghiệm)', color: '#dc3545', icon: '❌' };
        case DONATION_STATUS.COMPLETED:
          return { text: 'Hoàn thành', color: '#28a745', icon: '✅' };
        case DONATION_STATUS.STORED:
          return { text: 'Đã nhập kho', color: '#6f42c1', icon: '🏦' };
        default:
          return { text: 'Không xác định', color: '#6c757d', icon: '❓' };
      }
    } else {
      switch (status) {
        case REQUEST_STATUS.PENDING:
          return { text: 'Đang chờ xử lý', color: '#ffc107', icon: '⏳' };
        case REQUEST_STATUS.APPROVED:
          return { text: 'Đã duyệt', color: '#28a745', icon: '✅' };
        case REQUEST_STATUS.REJECTED:
          return { text: 'Từ chối', color: '#dc3545', icon: '❌' };
        case REQUEST_STATUS.FULFILLED:
          return { text: 'Đã xuất kho', color: '#17a2b8', icon: '📦' };
        case REQUEST_STATUS.COMPLETED:
          return { text: 'Hoàn thành', color: '#28a745', icon: '🎉' };
        default:
          return { text: 'Không xác định', color: '#6c757d', icon: '❓' };
      }
    }
  };

  const statusInfo = getStatusInfo(currentStatus, workflowType);

  if (compact) {
    return (
      <div className="simple-status-tracker compact">
        <span 
          className="status-badge compact"
          style={{ backgroundColor: statusInfo.color }}
        >
          {statusInfo.icon} {statusInfo.text}
        </span>
        {urgency !== null && (
          <span 
            className="urgency-badge compact"
            style={{ backgroundColor: URGENCY_COLORS[urgency] }}
          >
            {URGENCY_ICONS[urgency]} {URGENCY_LABELS[urgency]}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="simple-status-tracker">
      <div className="status-card">
        <div className="status-icon" style={{ color: statusInfo.color }}>
          {statusInfo.icon}
        </div>
        <div className="status-details">
          <div className="status-title">{statusInfo.text}</div>
          <div className="status-type">
            {workflowType === 'donation' ? 'Hiến máu' : 'Yêu cầu máu'}
          </div>
        </div>
        {urgency !== null && (
          <div className="urgency-info">
            <span 
              className="urgency-badge"
              style={{ backgroundColor: URGENCY_COLORS[urgency] }}
            >
              {URGENCY_ICONS[urgency]} {URGENCY_LABELS[urgency]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleStatusTracker;
