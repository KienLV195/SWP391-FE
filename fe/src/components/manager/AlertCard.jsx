import React from 'react';
import { FiAlertTriangle, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../../styles/components/AlertCard.scss';

const AlertCard = ({ 
  alerts = [], 
  onDismiss = () => {},
  showPagination = true 
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextAlert = () => {
    setCurrentIndex((prev) => (prev + 1) % alerts.length);
  };

  const prevAlert = () => {
    setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
  };

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const currentAlert = alerts[currentIndex];

  return (
    <div className="alert-card">
      <div className="alert-header">
        <div className="alert-title">
          <FiAlertTriangle className="alert-icon" />
          <span>CẢNH BÁO</span>
        </div>
        {showPagination && alerts.length > 1 && (
          <div className="alert-pagination">
            <button 
              className="pagination-btn" 
              onClick={prevAlert}
              disabled={alerts.length <= 1}
            >
              <FiChevronLeft />
            </button>
            <span className="pagination-info">
              {currentIndex + 1} / {alerts.length}
            </span>
            <button 
              className="pagination-btn" 
              onClick={nextAlert}
              disabled={alerts.length <= 1}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="alert-content">
        <div className="alert-item">
          <div className="alert-status">
            <span className="status-indicator critical">Sắp Hết</span>
          </div>
          <div className="alert-message">
            {currentAlert.message || "Nhóm máu O đang sắp hết."}
          </div>
        </div>
      </div>

      <div className="alert-dots">
        {alerts.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AlertCard;
