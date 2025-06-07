import React, { useState, useEffect } from "react";
import DistanceService from "../../services/distanceService";
import "../../styles/components/LocationPicker.scss";

const LocationPicker = ({
  onLocationChange,
  initialLocation,
  disabled = false,
}) => {
  const [location, setLocation] = useState(
    initialLocation || { lat: null, lng: null, address: "" }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);

  useEffect(() => {
    if (location.lat && location.lng) {
      const dist = DistanceService.calculateDistanceToHospital(location);
      const time = DistanceService.getEstimatedTravelTime(dist);
      setDistance(dist);
      setTravelTime(time);

      if (onLocationChange) {
        onLocationChange({
          ...location,
          distance: dist,
          travelTime: time,
        });
      }
    }
  }, [location.lat, location.lng, onLocationChange]);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setError("");

    try {
      const coords = await DistanceService.getCurrentLocation();

      // TODO: Replace with actual reverse geocoding API
      // For now, use a mock address
      const mockAddress = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;

      setLocation({
        lat: coords.lat,
        lng: coords.lng,
        address: mockAddress,
      });
    } catch (err) {
      setError(
        "Không thể lấy vị trí hiện tại. Vui lòng nhập địa chỉ thủ công."
      );
      console.error("Geolocation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const address = e.target.value;
    setLocation((prev) => ({ ...prev, address }));

    // TODO: Replace with actual geocoding API
    // For now, simulate coordinates based on address keywords
    if (address.length > 10) {
      let mockLat, mockLng;

      // Simulate different locations based on address content
      const addressLower = address.toLowerCase();

      if (addressLower.includes("hà nội") || addressLower.includes("hanoi")) {
        // Hanoi coordinates (about 1100km from HCM)
        mockLat = 21.0285 + (Math.random() - 0.5) * 0.1;
        mockLng = 105.8542 + (Math.random() - 0.5) * 0.1;
      } else if (
        addressLower.includes("đà nẵng") ||
        addressLower.includes("da nang")
      ) {
        // Da Nang coordinates (about 600km from HCM)
        mockLat = 16.0471 + (Math.random() - 0.5) * 0.1;
        mockLng = 108.2068 + (Math.random() - 0.5) * 0.1;
      } else if (
        addressLower.includes("cần thơ") ||
        addressLower.includes("can tho")
      ) {
        // Can Tho coordinates (about 170km from HCM)
        mockLat = 10.0452 + (Math.random() - 0.5) * 0.1;
        mockLng = 105.7469 + (Math.random() - 0.5) * 0.1;
      } else if (
        addressLower.includes("vũng tàu") ||
        addressLower.includes("vung tau")
      ) {
        // Vung Tau coordinates (about 125km from HCM)
        mockLat = 10.4113 + (Math.random() - 0.5) * 0.1;
        mockLng = 107.1365 + (Math.random() - 0.5) * 0.1;
      } else if (
        addressLower.includes("quận 1") ||
        addressLower.includes("district 1")
      ) {
        // District 1 HCM (close to hospital)
        mockLat = 10.7769 + (Math.random() - 0.5) * 0.01;
        mockLng = 106.7009 + (Math.random() - 0.5) * 0.01;
      } else if (
        addressLower.includes("quận 7") ||
        addressLower.includes("district 7")
      ) {
        // District 7 HCM (further from hospital)
        mockLat = 10.7379 + (Math.random() - 0.5) * 0.02;
        mockLng = 106.7218 + (Math.random() - 0.5) * 0.02;
      } else {
        // Default to somewhere in HCM area
        mockLat = 10.7751237 + (Math.random() - 0.5) * 0.2;
        mockLng = 106.6862143 + (Math.random() - 0.5) * 0.2;
      }

      setLocation((prev) => ({
        ...prev,
        lat: mockLat,
        lng: mockLng,
      }));
    }
  };

  const getDistanceColor = () => {
    if (!distance) return "#6c757d";

    if (distance <= 5) return "#28a745";
    if (distance <= 10) return "#ffc107";
    if (distance <= 20) return "#fd7e14";
    return "#dc3545";
  };

  const getDistanceText = () => {
    if (!distance) return "Chưa xác định";

    if (distance <= 5) return "Rất gần";
    if (distance <= 10) return "Gần";
    if (distance <= 20) return "Trung bình";
    if (distance <= 50) return "Xa";
    return "Rất xa";
  };

  return (
    <div className="location-picker">
      <div className="location-input-section">
        <label className="location-label">
          📍 Địa chỉ của bạn
          <span className="required">*</span>
        </label>

        <div className="input-group">
          <textarea
            value={location.address}
            onChange={handleAddressChange}
            placeholder="Nhập địa chỉ đầy đủ của bạn..."
            className="address-input"
            rows="3"
            disabled={disabled}
          />

          <button
            type="button"
            className="current-location-btn"
            onClick={handleGetCurrentLocation}
            disabled={loading || disabled}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Đang lấy vị trí...
              </>
            ) : (
              <>🎯 Vị trí hiện tại</>
            )}
          </button>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}
      </div>

      {/* Distance Information */}
      {distance && (
        <div className="distance-info-section">
          <h4>📏 Thông tin khoảng cách</h4>

          <div className="distance-details">
            <div className="distance-item">
              <span className="distance-label">Khoảng cách đến bệnh viện:</span>
              <span
                className="distance-value"
                style={{ color: getDistanceColor() }}
              >
                {DistanceService.formatDistance(distance)} ({getDistanceText()})
              </span>
            </div>

            <div className="distance-item">
              <span className="distance-label">
                Thời gian di chuyển ước tính:
              </span>
              <span className="travel-time">{travelTime}</span>
            </div>
          </div>

          <div className="hospital-info">
            <h5>🏥 Thông tin bệnh viện</h5>
            <div className="hospital-details">
              <div className="hospital-item">
                <strong>{DistanceService.HOSPITAL_COORDINATES.name}</strong>
              </div>
              <div className="hospital-item">
                📍 {DistanceService.HOSPITAL_COORDINATES.address}
              </div>
              <div className="hospital-item">
                🗺️ Tọa độ: {DistanceService.HOSPITAL_COORDINATES.lat},{" "}
                {DistanceService.HOSPITAL_COORDINATES.lng}
              </div>
            </div>

            {location.lat && location.lng && (
              <a
                href={DistanceService.getDirectionsUrl(location)}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-link"
              >
                🗺️ Xem đường đi trên Google Maps
              </a>
            )}
          </div>
        </div>
      )}

      {/* Location Preview */}
      {location.lat && location.lng && (
        <div className="location-preview">
          <h4>📌 Vị trí đã chọn</h4>
          <div className="coordinates">
            <span>
              Tọa độ: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </span>
          </div>
          <div className="accuracy-note">
            💡 <strong>Lưu ý:</strong> Vị trí này sẽ được sử dụng để tính khoảng
            cách trong trường hợp khẩn cấp. Hãy đảm bảo địa chỉ chính xác để
            được hỗ trợ tốt nhất.
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
