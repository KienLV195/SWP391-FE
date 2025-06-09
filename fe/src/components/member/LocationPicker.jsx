import React, { useState, useEffect, useCallback } from "react";
import GeolibService from "../../services/geolibService";
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
  const [geocoding, setGeocoding] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (location.lat && location.lng) {
      const dist = GeolibService.getDistanceToHospital(location);
      setDistance(dist);
      setTravelTime(""); // Empty travel time

      if (onLocationChange) {
        onLocationChange({
          ...location,
          distance: dist,
          travelTime: "", // Empty travel time
        });
      }
    }
  }, [location, onLocationChange]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setError("");

    try {
      const coords = await GeolibService.getCurrentLocation();

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

  // Debounced geocoding function
  const debouncedGeocode = useCallback(async (address) => {
    if (address.length <= 10) return;

    setGeocoding(true);

    try {
      // Use fallback geocoding directly (no Google Maps)
      await handleAddressFallback(address);
    } catch (error) {
      console.error("Geocoding error:", error);
      setError(error.message || "Không thể tìm thấy địa chỉ này");
    } finally {
      setGeocoding(false);
    }
  }, []);

  const handleAddressChange = (e) => {
    const address = e.target.value;
    setLocation((prev) => ({ ...prev, address }));
    setError("");

    // Clear previous results
    setDistance(null);
    setTravelTime(null);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced geocoding
    const newTimer = setTimeout(() => {
      debouncedGeocode(address);
    }, 1500); // Wait 1.5 seconds after user stops typing

    setDebounceTimer(newTimer);
  };

  // Try alternative geocoding services as fallback
  const tryFallbackGeocoding = async (address) => {
    try {
      // Option 1: Try OpenStreetMap Nominatim (free)
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&countrycodes=vn&limit=1`;

      const response = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "BloodDonationApp/1.0",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          console.log("Nominatim geocoding result:", data[0]);
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            address: data[0].display_name,
          };
        }
      }
    } catch (error) {
      console.warn("Nominatim geocoding failed:", error);
    }

    return null;
  };

  // Enhanced fallback method for development or when API fails
  const handleAddressFallback = async (address) => {
    try {
      // First try alternative geocoding service
      const fallbackResult = await tryFallbackGeocoding(address);

      if (fallbackResult) {
        setLocation((prev) => ({
          ...prev,
          lat: fallbackResult.lat,
          lng: fallbackResult.lng,
        }));

        // Calculate distance using Haversine formula
        const calculatedDistance =
          GeolibService.getDistanceToHospital(fallbackResult);

        setDistance(calculatedDistance);
        setTravelTime(""); // Empty travel time

        console.log("Fallback geocoding successful:", {
          address,
          coordinates: fallbackResult,
          distance: calculatedDistance,
        });

        return;
      }
    } catch (error) {
      console.warn("Fallback geocoding failed:", error);
    }

    // If fallback geocoding fails, use keyword-based estimation
    const addressLower = address.toLowerCase();
    let mockLat, mockLng, estimatedDistance;

    if (addressLower.includes("hà nội") || addressLower.includes("hanoi")) {
      mockLat = 21.0285 + (Math.random() - 0.5) * 0.1;
      mockLng = 105.8542 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 1100 + Math.random() * 100;
    } else if (
      addressLower.includes("đà nẵng") ||
      addressLower.includes("da nang")
    ) {
      mockLat = 16.0471 + (Math.random() - 0.5) * 0.1;
      mockLng = 108.2068 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 600 + Math.random() * 50;
    } else if (
      addressLower.includes("cần thơ") ||
      addressLower.includes("can tho")
    ) {
      mockLat = 10.0452 + (Math.random() - 0.5) * 0.1;
      mockLng = 105.7469 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 170 + Math.random() * 20;
    } else if (
      addressLower.includes("vũng tàu") ||
      addressLower.includes("vung tau")
    ) {
      mockLat = 10.4113 + (Math.random() - 0.5) * 0.1;
      mockLng = 107.1365 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 125 + Math.random() * 15;
    } else if (
      addressLower.includes("quận 1") ||
      addressLower.includes("district 1")
    ) {
      mockLat = 10.7769 + (Math.random() - 0.5) * 0.01;
      mockLng = 106.7009 + (Math.random() - 0.5) * 0.01;
      estimatedDistance = 2 + Math.random() * 3;
    } else if (
      addressLower.includes("quận 7") ||
      addressLower.includes("district 7")
    ) {
      mockLat = 10.7379 + (Math.random() - 0.5) * 0.02;
      mockLng = 106.7218 + (Math.random() - 0.5) * 0.02;
      estimatedDistance = 15 + Math.random() * 10;
    } else if (addressLower.includes("nha trang")) {
      mockLat = 12.2388 + (Math.random() - 0.5) * 0.1;
      mockLng = 109.1967 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 450 + Math.random() * 50;
    } else if (addressLower.includes("huế") || addressLower.includes("hue")) {
      mockLat = 16.4637 + (Math.random() - 0.5) * 0.1;
      mockLng = 107.5909 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 700 + Math.random() * 50;
    } else if (
      addressLower.includes("tp.hcm") ||
      addressLower.includes("ho chi minh") ||
      addressLower.includes("sài gòn") ||
      addressLower.includes("saigon")
    ) {
      // General HCM area
      mockLat = 10.7751237 + (Math.random() - 0.5) * 0.1;
      mockLng = 106.6862143 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 5 + Math.random() * 25;
    } else {
      // For any other address, generate random coordinates within Vietnam bounds
      // Vietnam coordinates roughly: lat 8.5-23.5, lng 102-110
      mockLat = 8.5 + Math.random() * 15; // Random lat in Vietnam
      mockLng = 102 + Math.random() * 8; // Random lng in Vietnam

      // Calculate distance using Haversine formula
      const hospitalCoords = { lat: 10.7751237, lng: 106.6862143 };
      estimatedDistance = GeolibService.getDistance(
        { lat: mockLat, lng: mockLng },
        hospitalCoords
      );

      console.log("Generated coordinates for unknown address:", {
        address,
        coordinates: { lat: mockLat, lng: mockLng },
        calculatedDistance: estimatedDistance,
      });
    }

    setLocation((prev) => ({
      ...prev,
      lat: mockLat,
      lng: mockLng,
    }));

    setDistance(Math.round(estimatedDistance * 100) / 100);
    setTravelTime(""); // Empty travel time
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
            className={`address-input ${geocoding ? "geocoding" : ""}`}
            rows="3"
            disabled={disabled || geocoding}
          />

          {geocoding && (
            <div className="geocoding-indicator">
              <span className="loading-spinner"></span>
              Đang tìm kiếm địa chỉ...
            </div>
          )}

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
                {GeolibService.formatDistance(distance)} ({getDistanceText()})
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
                <strong>{GeolibService.HOSPITAL_COORDINATES.name}</strong>
              </div>
              <div className="hospital-item">
                📍 {GeolibService.HOSPITAL_COORDINATES.address}
              </div>
              <div className="hospital-item">
                🗺️ Tọa độ: {GeolibService.HOSPITAL_COORDINATES.lat},{" "}
                {GeolibService.HOSPITAL_COORDINATES.lng}
              </div>
            </div>

            {location.lat && location.lng && (
              <a
                href={GeolibService.getDirectionsUrl(location)}
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
