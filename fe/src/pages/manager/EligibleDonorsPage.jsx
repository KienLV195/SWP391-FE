import React, { useState, useEffect } from "react";
import ManagerSidebar from "../../components/manager/ManagerSidebar";
import NearbyDonorsModal from "../../components/manager/NearbyDonorsModal";
import GeolibService from "../../services/geolibService";
import NotificationService from "../../services/notificationService";
import authService from "../../services/authService";
import "../../styles/pages/EligibleDonorsPage.scss";

const EligibleDonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodType: "all",
    maxDistance: 50,
    eligibilityStatus: "eligible",
    sortBy: "priority", // priority, distance, donations, lastDonation
  });
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [emergencyRequest, setEmergencyRequest] = useState(null);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadEligibleDonors();
  }, [filters]);

  const loadEligibleDonors = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call - GET /api/donors/eligible
      const mockDonors = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          bloodType: "O+",
          phone: "0123456789",
          email: "nguyenvana@email.com",
          coordinates: { lat: 10.7751, lng: 106.6862 },
          address: {
            houseNumber: "120",
            street: "Đường Nguyễn Huệ",
            ward: "Phường Bến Nghé",
            district: "Quận 1",
            city: "TP. Hồ Chí Minh",
            fullAddress:
              "120 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
          },
          lastDonationDate: "2024-10-15",
          nextEligibleDate: "2024-12-10",
          isEligible: true,
          healthStatus: "excellent",
          totalDonations: 8,
          registrationDate: "2022-01-15",
          gender: "male",
          age: 28,
          weight: 65,
          chronicDiseases: [],
          recentActivities: [],
          emergencyAvailable: true,
          preferredTimeSlots: ["morning", "afternoon"],
          notes: "Người hiến tích cực, sức khỏe tốt",
        },
        {
          id: 2,
          name: "Trần Thị B",
          bloodType: "A+",
          phone: "0987654321",
          email: "tranthib@email.com",
          coordinates: { lat: 10.78, lng: 106.69 },
          address: {
            houseNumber: "456",
            street: "Đường Lê Lợi",
            ward: "Phường 8",
            district: "Quận 3",
            city: "TP. Hồ Chí Minh",
            fullAddress: "456 Đường Lê Lợi, Phường 8, Quận 3, TP. Hồ Chí Minh",
          },
          lastDonationDate: "2024-09-20",
          nextEligibleDate: "2024-12-13",
          isEligible: true,
          healthStatus: "good",
          totalDonations: 12,
          registrationDate: "2021-06-10",
          gender: "female",
          age: 32,
          weight: 55,
          chronicDiseases: [],
          recentActivities: [],
          emergencyAvailable: true,
          preferredTimeSlots: ["afternoon"],
          notes: "Người hiến kinh nghiệm",
        },
        {
          id: 3,
          name: "Lê Văn C",
          bloodType: "O-",
          phone: "0345678901",
          email: "levanc@email.com",
          coordinates: { lat: 10.8, lng: 106.7 },
          address: {
            houseNumber: "789",
            street: "Đường Nguyễn Văn Linh",
            ward: "Phường Tân Thuận Đông",
            district: "Quận 7",
            city: "TP. Hồ Chí Minh",
            fullAddress:
              "789 Đường Nguyễn Văn Linh, Phường Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh",
          },
          lastDonationDate: "2024-08-30",
          nextEligibleDate: "2024-12-05",
          isEligible: true,
          healthStatus: "excellent",
          totalDonations: 15,
          registrationDate: "2020-09-12",
          gender: "male",
          age: 35,
          weight: 70,
          chronicDiseases: [],
          recentActivities: [],
          emergencyAvailable: true,
          preferredTimeSlots: ["morning"],
          notes: "Máu hiếm O-, sẵn sàng hỗ trợ khẩn cấp",
        },
        {
          id: 4,
          name: "Phạm Thị D",
          bloodType: "AB+",
          phone: "0567890123",
          email: "phamthid@email.com",
          coordinates: { lat: 10.75, lng: 106.65 },
          address: {
            houseNumber: "321",
            street: "Đường Trần Hưng Đạo",
            ward: "Phường 7",
            district: "Quận 5",
            city: "TP. Hồ Chí Minh",
            fullAddress:
              "321 Đường Trần Hưng Đạo, Phường 7, Quận 5, TP. Hồ Chí Minh",
          },
          lastDonationDate: "2024-11-20",
          nextEligibleDate: "2025-01-15",
          isEligible: false,
          healthStatus: "good",
          totalDonations: 6,
          registrationDate: "2023-03-20",
          gender: "female",
          age: 26,
          weight: 52,
          chronicDiseases: [],
          recentActivities: ["recent_donation"],
          emergencyAvailable: false,
          preferredTimeSlots: ["afternoon"],
          notes: "Vừa hiến máu gần đây",
        },
      ];

      // Calculate distances and priorities
      const donorsWithDistance = mockDonors.map((donor) => {
        const distance = GeolibService.getDistanceToHospital(donor.coordinates);

        const priority = GeolibService.getDistancePriority(distance);
        const daysUntilEligible = NotificationService.getDaysUntilEligible(
          donor.lastDonationDate,
          donor.gender
        );

        return {
          ...donor,
          distance,
          priority,
          priorityText: GeolibService.getPriorityText(priority),
          priorityColor: GeolibService.getPriorityColor(priority),
          daysUntilEligible,
          isCurrentlyEligible: daysUntilEligible <= 0,
        };
      });

      // Apply filters
      let filteredDonors = donorsWithDistance;

      if (filters.bloodType !== "all") {
        filteredDonors = filteredDonors.filter(
          (d) => d.bloodType === filters.bloodType
        );
      }

      if (filters.maxDistance) {
        filteredDonors = filteredDonors.filter(
          (d) => d.distance <= filters.maxDistance
        );
      }

      if (filters.eligibilityStatus === "eligible") {
        filteredDonors = filteredDonors.filter(
          (d) => d.isEligible && d.isCurrentlyEligible
        );
      } else if (filters.eligibilityStatus === "upcoming") {
        filteredDonors = filteredDonors.filter(
          (d) => d.daysUntilEligible > 0 && d.daysUntilEligible <= 7
        );
      }

      // Sort donors
      filteredDonors.sort((a, b) => {
        switch (filters.sortBy) {
          case "priority":
            // Sort by: eligibility -> distance -> health -> donations
            if (a.isCurrentlyEligible && !b.isCurrentlyEligible) return -1;
            if (!a.isCurrentlyEligible && b.isCurrentlyEligible) return 1;
            if (a.distance !== b.distance) return a.distance - b.distance;
            if (a.healthStatus !== b.healthStatus) {
              const healthOrder = { excellent: 3, good: 2, fair: 1 };
              return (
                (healthOrder[b.healthStatus] || 0) -
                (healthOrder[a.healthStatus] || 0)
              );
            }
            return b.totalDonations - a.totalDonations;
          case "distance":
            return a.distance - b.distance;
          case "donations":
            return b.totalDonations - a.totalDonations;
          case "lastDonation":
            return new Date(b.lastDonationDate) - new Date(a.lastDonationDate);
          default:
            return 0;
        }
      });

      setDonors(filteredDonors);
    } catch (error) {
      console.error("Error loading eligible donors:", error);
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

  const handleContactSelected = async () => {
    if (selectedDonors.length === 0) return;

    try {
      // TODO: Replace with actual API call - POST /api/notifications/contact-donors
      for (const donorId of selectedDonors) {
        const donor = donors.find((d) => d.id === donorId);
        if (donor) {
          await NotificationService.sendUrgentBloodRequest(donorId, {
            id: Date.now(),
            bloodType: donor.bloodType,
            quantity: "1 đơn vị",
            urgency: "urgent",
            hospital: "Bệnh viện XYZ",
            contactPerson: currentUser.name,
          });
        }
      }

      alert(`Đã gửi thông báo đến ${selectedDonors.length} người hiến máu!`);
      setSelectedDonors([]);
    } catch (error) {
      console.error("Error contacting donors:", error);
      alert("Có lỗi xảy ra khi gửi thông báo!");
    }
  };

  const handleEmergencyRequest = (bloodType) => {
    setEmergencyRequest({ bloodType, urgency: "emergency" });
    setShowNearbyModal(true);
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "#28a745";
      case "good":
        return "#17a2b8";
      case "fair":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  const getHealthStatusText = (status) => {
    switch (status) {
      case "excellent":
        return "Xuất sắc";
      case "good":
        return "Tốt";
      case "fair":
        return "Khá";
      default:
        return "Không xác định";
    }
  };

  const eligibleCount = donors.filter(
    (d) => d.isEligible && d.isCurrentlyEligible
  ).length;
  const upcomingCount = donors.filter(
    (d) => d.daysUntilEligible > 0 && d.daysUntilEligible <= 7
  ).length;
  const emergencyAvailableCount = donors.filter(
    (d) => d.emergencyAvailable && d.isCurrentlyEligible
  ).length;

  return (
    <div className="eligible-donors-page">
      <ManagerSidebar />

      <div className="donors-content">
        <div className="page-header">
          <div>
            <h1>👥 Người hiến đủ điều kiện</h1>
            <p>Danh sách người hiến máu sẵn sàng hỗ trợ</p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-danger"
              onClick={() => handleEmergencyRequest("O+")}
            >
              🚨 Yêu cầu khẩn cấp
            </button>
            <button
              className="btn btn-primary"
              onClick={loadEligibleDonors}
              disabled={loading}
            >
              {loading ? "⏳ Đang tải..." : "🔄 Làm mới"}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-card eligible">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{eligibleCount}</div>
              <div className="stat-label">Đủ điều kiện</div>
            </div>
          </div>

          <div className="stat-card upcoming">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-number">{upcomingCount}</div>
              <div className="stat-label">Sắp đủ điều kiện</div>
            </div>
          </div>

          <div className="stat-card emergency">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <div className="stat-number">{emergencyAvailableCount}</div>
              <div className="stat-label">Sẵn sàng khẩn cấp</div>
            </div>
          </div>

          <div className="stat-card selected">
            <div className="stat-icon">☑️</div>
            <div className="stat-content">
              <div className="stat-number">{selectedDonors.length}</div>
              <div className="stat-label">Đã chọn</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Nhóm máu:</label>
            <select
              value={filters.bloodType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, bloodType: e.target.value }))
              }
            >
              <option value="all">Tất cả</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Khoảng cách tối đa:</label>
            <select
              value={filters.maxDistance}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxDistance: Number(e.target.value),
                }))
              }
            >
              <option value={5}>5km</option>
              <option value={10}>10km</option>
              <option value={20}>20km</option>
              <option value={50}>50km</option>
              <option value={100}>100km</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              value={filters.eligibilityStatus}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  eligibilityStatus: e.target.value,
                }))
              }
            >
              <option value="eligible">Đủ điều kiện ({eligibleCount})</option>
              <option value="upcoming">
                Sắp đủ điều kiện ({upcomingCount})
              </option>
              <option value="all">Tất cả</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sắp xếp:</label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
            >
              <option value="priority">Ưu tiên</option>
              <option value="distance">Khoảng cách</option>
              <option value="donations">Số lần hiến</option>
              <option value="lastDonation">Lần hiến cuối</option>
            </select>
          </div>
        </div>

        {/* Selected Actions */}
        {selectedDonors.length > 0 && (
          <div className="selected-actions">
            <div className="selected-info">
              Đã chọn {selectedDonors.length} người hiến máu
            </div>
            <div className="action-buttons">
              <button
                className="btn btn-success"
                onClick={handleContactSelected}
              >
                📞 Liên hệ ({selectedDonors.length})
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedDonors([])}
              >
                ❌ Bỏ chọn tất cả
              </button>
            </div>
          </div>
        )}

        {/* Donors List */}
        <div className="donors-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải danh sách người hiến...</p>
            </div>
          ) : donors.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👥</span>
              <h3>Không tìm thấy người hiến</h3>
              <p>Thử điều chỉnh bộ lọc để tìm thêm người hiến máu.</p>
            </div>
          ) : (
            <div className="donors-list">
              {donors.map((donor) => (
                <div
                  key={donor.id}
                  className={`donor-card ${
                    !donor.isCurrentlyEligible ? "not-eligible" : ""
                  } ${selectedDonors.includes(donor.id) ? "selected" : ""}`}
                >
                  <div className="donor-header">
                    <div className="donor-selection">
                      <input
                        type="checkbox"
                        checked={selectedDonors.includes(donor.id)}
                        onChange={() => handleDonorSelect(donor.id)}
                        disabled={!donor.isCurrentlyEligible}
                      />
                    </div>

                    <div className="donor-basic-info">
                      <div className="donor-name">{donor.name}</div>
                      <div className="donor-contact">
                        📞 {donor.phone} | 📧 {donor.email}
                      </div>
                      <div className="blood-type-badge">{donor.bloodType}</div>
                      {["O-", "AB-", "B-"].includes(donor.bloodType) && (
                        <span className="rare-badge">⭐ Máu hiếm</span>
                      )}
                    </div>

                    <div className="donor-status">
                      <div
                        className={`eligibility-status ${
                          donor.isCurrentlyEligible
                            ? "eligible"
                            : "not-eligible"
                        }`}
                      >
                        {donor.isCurrentlyEligible
                          ? "✅ Đủ điều kiện"
                          : `⏳ Còn ${donor.daysUntilEligible} ngày`}
                      </div>
                      {donor.emergencyAvailable &&
                        donor.isCurrentlyEligible && (
                          <div className="emergency-badge">
                            🚨 Sẵn sàng khẩn cấp
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="donor-details">
                    <div className="detail-row">
                      <span className="detail-label">📍 Khoảng cách:</span>
                      <span
                        className={`distance-info priority-${donor.priority}`}
                      >
                        {DistanceService.formatDistance(donor.distance)}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">🏥 Sức khỏe:</span>
                      <span
                        className="health-status"
                        style={{
                          color: getHealthStatusColor(donor.healthStatus),
                        }}
                      >
                        {getHealthStatusText(donor.healthStatus)}
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
                      <span className="detail-label">🏠 Địa chỉ:</span>
                      <span className="address">
                        {typeof donor.address === "object"
                          ? donor.address.fullAddress
                          : donor.address}
                      </span>
                    </div>

                    {donor.notes && (
                      <div className="detail-row">
                        <span className="detail-label">📝 Ghi chú:</span>
                        <span className="notes">{donor.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="donor-actions">
                    <a
                      href={`tel:${donor.phone}`}
                      className="btn btn-success btn-sm"
                    >
                      📞 Gọi
                    </a>

                    <a
                      href={`mailto:${donor.email}`}
                      className="btn btn-info btn-sm"
                    >
                      📧 Email
                    </a>

                    <a
                      href={DistanceService.getDirectionsUrl(donor.coordinates)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
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

      {/* Nearby Donors Modal */}
      <NearbyDonorsModal
        isOpen={showNearbyModal}
        onClose={() => setShowNearbyModal(false)}
        bloodRequest={emergencyRequest}
      />
    </div>
  );
};

export default EligibleDonorsPage;
