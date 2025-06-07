import React, { useState } from 'react';
import StatusWorkflowService from '../../services/statusWorkflowService';
import '../../styles/components/StatusWorkflowTracker.scss';

const StatusWorkflowTracker = ({ 
  currentStatus, 
  userRole, 
  doctorType = null, 
  requestType = 'internal',
  workflowType = 'donation',
  itemId,
  onStatusUpdate,
  showActions = true,
  compact = false
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [notes, setNotes] = useState('');

  const progress = workflowType === 'donation' 
    ? StatusWorkflowService.getDonationProgress(currentStatus, userRole)
    : StatusWorkflowService.getRequestProgress(currentStatus, userRole, doctorType);

  const nextActions = StatusWorkflowService.getNextActions(
    currentStatus, 
    userRole, 
    doctorType, 
    requestType, 
    workflowType
  );

  const currentStatusInfo = StatusWorkflowService.getStatusInfo(currentStatus, workflowType);

  const handleStatusUpdate = async () => {
    if (!selectedAction || !itemId) return;

    setLoading(true);
    try {
      let result;
      if (workflowType === 'donation') {
        result = await StatusWorkflowService.updateDonationStatus(
          itemId, 
          selectedAction, 
          userRole, 
          notes
        );
      } else {
        result = await StatusWorkflowService.updateRequestStatus(
          itemId, 
          selectedAction, 
          userRole, 
          doctorType, 
          requestType, 
          notes
        );
      }

      if (onStatusUpdate) {
        onStatusUpdate(result);
      }

      setSelectedAction('');
      setNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="status-workflow-tracker compact">
        <div className="current-status-compact">
          <span 
            className="status-badge"
            style={{ backgroundColor: currentStatusInfo.color }}
          >
            {currentStatusInfo.icon} {currentStatusInfo.text}
          </span>
          <div className="progress-bar-compact">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress.progress}%`,
                backgroundColor: progress.isFailed ? '#dc3545' : '#28a745'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="status-workflow-tracker">
      {/* Current Status */}
      <div className="current-status-section">
        <h3>📊 Trạng thái hiện tại</h3>
        <div className="current-status-card">
          <div className="status-icon" style={{ color: currentStatusInfo.color }}>
            {currentStatusInfo.icon}
          </div>
          <div className="status-details">
            <div className="status-title">{currentStatusInfo.text}</div>
            <div className="status-description">{currentStatusInfo.description}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <h4>📈 Tiến trình</h4>
        <div className="workflow-progress">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${progress.isFailed ? 'failed' : 'success'}`}
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="progress-text">
            {progress.isFailed ? '❌ Không thành công' : 
             progress.isCompleted ? '✅ Hoàn thành' : 
             `${Math.round(progress.progress)}% hoàn thành`}
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="workflow-steps">
          {progress.workflow.map((step, index) => {
            const stepInfo = StatusWorkflowService.getStatusInfo(step, workflowType);
            const isActive = index <= progress.currentIndex;
            const isCurrent = step === currentStatus;
            
            return (
              <div 
                key={step}
                className={`workflow-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="step-icon" style={{ color: isActive ? stepInfo.color : '#dee2e6' }}>
                  {stepInfo.icon}
                </div>
                <div className="step-text">{stepInfo.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Actions */}
      {showActions && nextActions.length > 0 && !progress.isCompleted && !progress.isFailed && (
        <div className="actions-section">
          <h4>⚡ Hành động tiếp theo</h4>
          
          <div className="action-form">
            <div className="form-group">
              <label>Chọn hành động:</label>
              <select 
                value={selectedAction} 
                onChange={(e) => setSelectedAction(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Chọn hành động --</option>
                {nextActions.map(action => (
                  <option key={action.status} value={action.status}>
                    {action.icon} {action.actionText}
                  </option>
                ))}
              </select>
            </div>

            {selectedAction && (
              <div className="form-group">
                <label>Ghi chú (tùy chọn):</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú về hành động này..."
                  rows="3"
                  disabled={loading}
                />
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={handleStatusUpdate}
                disabled={!selectedAction || loading}
              >
                {loading ? '⏳ Đang xử lý...' : '✅ Thực hiện'}
              </button>
              
              {selectedAction && (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedAction('');
                    setNotes('');
                  }}
                  disabled={loading}
                >
                  ❌ Hủy
                </button>
              )}
            </div>
          </div>

          {/* Action Preview */}
          {selectedAction && (
            <div className="action-preview">
              <h5>👀 Xem trước hành động</h5>
              <div className="preview-content">
                {(() => {
                  const actionInfo = StatusWorkflowService.getStatusInfo(selectedAction, workflowType);
                  return (
                    <div className="preview-item">
                      <span className="preview-icon" style={{ color: actionInfo.color }}>
                        {actionInfo.icon}
                      </span>
                      <div className="preview-text">
                        <strong>{actionInfo.text}</strong>
                        <p>{actionInfo.description}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion Message */}
      {progress.isCompleted && (
        <div className="completion-section">
          <div className="completion-message success">
            <span className="completion-icon">🎉</span>
            <div className="completion-text">
              <h4>Hoàn thành!</h4>
              <p>
                {workflowType === 'donation' 
                  ? 'Quy trình hiến máu đã hoàn thành thành công.'
                  : 'Yêu cầu máu đã được xử lý hoàn tất.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Failure Message */}
      {progress.isFailed && (
        <div className="completion-section">
          <div className="completion-message failed">
            <span className="completion-icon">❌</span>
            <div className="completion-text">
              <h4>Không thành công</h4>
              <p>
                {workflowType === 'donation' 
                  ? 'Quy trình hiến máu không thể hoàn thành.'
                  : 'Yêu cầu máu đã bị từ chối.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusWorkflowTracker;
