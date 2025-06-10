import React, { useState, useEffect } from "react";
import GeolibService from "../../services/geolibService";
import NotificationService from "../../services/notificationService";
import "../../styles/components/NearbyDonorsModal.scss";

const NearbyDonorsModal = ({ isOpen, onClose, bloodRequest }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [maxDistance, setMaxDistance] = useState(20);
  const [sortBy, setSortBy] = useState("distance"); // distance, donations, registration

  useEffect(() => {
    if (isOpen && bloodRequest) {
      loadNearbyDonors();
    }
  }, [isOpen, bloodRequest, maxDistance]);

  const loadNearbyDonors = async () => {
    if (!bloodRequest) return;

    setLoading(true);
    try {
      const nearbyDonors = await GeolibService.findNearbyDonors(
        bloodRequest.bloodType,
        maxDistance,
        bloodRequest.urgency
      );
      setDonors(nearbyDonors);
    } catch (error) {
      console.error("Error loading nearby donors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonorSelect = (donorId) => {
    setSelectedDonors((prev) => {
      if (prev.includes(donorId)) {
        return prev.filter((id) => id !== donorId);
      } else {
        return [...prev, donorId];
      }
    });
  };

  const handleContactDonors = async () => {
    if (selectedDonors.length === 0) return;

    try {
      // TODO: Replace with actual API call - POST /api/notifications/contact-donors
      for (const donorId of selectedDonors) {
        const donor = donors.find((d) => d.id === donorId);
        if (donor) {
          await NotificationService.sendUrgentBloodRequest(donorId, {
            id: bloodRequest.id,
            bloodType: bloodRequest.bloodType,
            quantity: bloodRequest.quantity,
            urgency: bloodRequest.urgency,
            hospital: "Bệnh viện XYZ",
          });
        }
      }

      alert(`Đã gửi thông báo đến ${selectedDonors.length} người hiến máu!`);
      onClose();
    } catch (error) {
      console.error("Error contacting donors:", error);
      alert("Có lỗi xảy ra khi gửi thông báo!");
    }
  };

  const getSortedDonors = () => {
    const sorted = [...donors];

    switch (sortBy) {
      case "distance":
        return sorted.sort((a, b) => {
          // Eligible donors first
          if (a.isEligible && !b.isEligible) return -1;
          if (!a.isEligible && b.isEligible) return 1;
          // Then by distance
          return a.distance - b.distance;
        });
      case "donations":
        return sorted.sort((a, b) => {
          if (a.isEligible && !b.isEligible) return -1;
          if (!a.isEligible && b.isEligible) return 1;
          return b.totalDonations - a.totalDonations;
        });
      case "registration":
        return sorted.sort((a, b) => {
          if (a.isEligible && !b.isEligible) return -1;
          if (!a.isEligible && b.isEligible) return 1;
          return new Date(a.registrationDate) - new Date(b.registrationDate);
        });
      default:
        return sorted;
    }
  };

  if (!isOpen) return null;

  const eligibleDonors = donors.filter((d) => d.isEligible);
  const ineligibleDonors = donors.filter((d) => !d.isEligible);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="nearby-donors-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-info">
            <h2>🗺️ Người hiến máu gần đây</h2>
            <p>
              Tìm kiếm người hiến máu phù hợp cho yêu cầu #{bloodRequest?.id}
            </p>
            <div className="request-info">
              <span className="blood-type-badge">
                {bloodRequest?.bloodType}
              </span>
              <span className="quantity-info">
                {bloodRequest?.quantity} {bloodRequest?.unit}
              </span>
              <span
                className={`urgency-badge urgency-${bloodRequest?.urgency}`}
              >
                {bloodRequest?.urgency === "emergency"
                  ? "🚨 Cấp cứu"
                  : bloodRequest?.urgency === "urgent"
                  ? "⚡ Khẩn cấp"
                  : "📋 Bình thường"}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Search Controls */}
          <div className="search-controls">
            <div className="control-group">
              <label>Bán kính tìm kiếm:</label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
              >
                <option value={5}>5km</option>
                <option value={10}>10km</option>
                <option value={20}>20km</option>
                <option value={50}>50km</option>
                <option value={100}>100km</option>
              </select>
            </div>

            <div className="control-group">
              <label>Sắp xếp theo:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance">Khoảng cách</option>
                <option value="donations">Số lần hiến</option>
                <option value="registration">Thời gian đăng ký</option>
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={loadNearbyDonors}
              disabled={loading}
            >
              {loading ? "🔄 Đang tìm..." : "🔍 Tìm kiếm"}
            </button>
          </div>

          {/* Statistics */}
          <div className="donor-stats">
            <div className="stat-item">
              <span className="stat-number">{donors.length}</span>
              <span className="stat-label">Tổng số</span>
            </div>
            <div className="stat-item eligible">
              <span className="stat-number">{eligibleDonors.length}</span>
              <span className="stat-label">Đủ điều kiện</span>
            </div>
            <div className="stat-item selected">
              <span className="stat-number">{selectedDonors.length}</span>
              <span className="stat-label">Đã chọn</span>
            </div>
          </div>

          {/* Donors List */}
          <div className="donors-section">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Đang tìm kiếm người hiến máu gần đây...</p>
              </div>
            ) : donors.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>Không tìm thấy người hiến máu</h3>
                <p>Thử tăng bán kính tìm kiếm hoặc kiểm tra lại nhóm máu.</p>
              </div>
            ) : (
              <div className="donors-list">
                {getSortedDonors().map((donor) => (
                  <div
                    key={donor.id}
                    className={`donor-card ${
                      !donor.isEligible ? "ineligible" : ""
                    } ${selectedDonors.includes(donor.id) ? "selected" : ""}`}
                  >
                    <div className="donor-header">
                      <div className="donor-basic-info">
                        <div className="donor-name">{donor.name}</div>
                        <div className="donor-blood-type">
                          <span className="blood-type-badge">
                            {donor.bloodType}
                          </span>
                        </div>
                      </div>
                      <div className="donor-selection">
                        <input
                          type="checkbox"
                          checked={selectedDonors.includes(donor.id)}
                          onChange={() => handleDonorSelect(donor.id)}
                          disabled={!donor.isEligible}
                        />
                      </div>
                    </div>

                    <div className="donor-details">
                      <div className="detail-row">
                        <span className="detail-label">📍 Khoảng cách:</span>
                        <span
                          className={`distance-info distance-${donor.priority}`}
                        >
                          {GeolibService.formatDistance(donor.distance)}
                          <small>({donor.travelTime})</small>
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">🩸 Số lần hiến:</span>
                        <span className="donations-count">
                          {donor.totalDonations} lần
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">📅 Lần cuối:</span>
                        <span className="last-donation">
                          {new Date(donor.lastDonationDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">✅ Trạng thái:</span>
                        <span
                          className={`eligibility-status ${
                            donor.isEligible ? "eligible" : "not-eligible"
                          }`}
                        >
                          {donor.isEligible
                            ? "Đủ điều kiện"
                            : "Chưa đủ điều kiện"}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">📞 Liên hệ:</span>
                        <span className="contact-info">
                          {donor.phone} | {donor.email}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">🏠 Địa chỉ:</span>
                        <span className="address">{donor.address}</span>
                      </div>
                    </div>

                    <div className="donor-actions">
                      <a
                        href={GeolibService.getDirectionsUrl(donor.coordinates)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        🗺️ Chỉ đường
                      </a>

                      <div
                        className={`priority-badge priority-${donor.priority}`}
                      >
                        {donor.priorityText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            <span>Đã chọn {selectedDonors.length} người hiến máu</span>
          </div>
          <div className="footer-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button
              className="btn btn-primary"
              onClick={handleContactDonors}
              disabled={selectedDonors.length === 0}
            >
              📞 Liên hệ ({selectedDonors.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyDonorsModal;
