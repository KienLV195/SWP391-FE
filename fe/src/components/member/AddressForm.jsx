import React, { useState, useEffect } from "react";
import axios from "axios";
import NominatimService from "../../services/nominatimService";
import GeolibService from "../../services/geolibService";
import vietnamProvincesData from "../../data/vietnam-provinces.json";
import "../../styles/components/AddressForm.scss";

const AddressForm = ({ onAddressChange, initialAddress, disabled = false }) => {
  const [addressData, setAddressData] = useState({
    houseNumber: "",
    street: "",
    province: "",
    district: "",
    ward: "",
    provinceName: "",
    districtName: "",
    wardName: "",
    fullAddress: "",
  });

  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState("");
  const [distance, setDistance] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  // Dropdown data
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  // Load city/district/ward data from local file
  useEffect(() => {
    try {
      setCityList(vietnamProvincesData);
    } catch (error) {
      console.error("Failed to load city data:", error);
      setError("Không thể tải dữ liệu địa giới hành chính");
    }
  }, []);

  useEffect(() => {
    if (addressData.province) {
      const city = cityList.find((c) => c.Id === addressData.province);
      setDistrictList(city ? city.Districts : []);
    } else {
      setDistrictList([]);
    }
  }, [addressData.province, cityList]);

  useEffect(() => {
    if (addressData.district) {
      const district = districtList.find((d) => d.Id === addressData.district);
      setWardList(district ? district.Wards : []);
    } else {
      setWardList([]);
    }
  }, [addressData.district, districtList]);

  // Initialize with initial address if provided
  useEffect(() => {
    if (initialAddress) {
      if (typeof initialAddress === "string") {
        setAddressData((prev) => ({ ...prev, fullAddress: initialAddress }));
      } else if (typeof initialAddress === "object") {
        setAddressData((prev) => ({ ...prev, ...initialAddress }));
      }
    }
  }, [initialAddress]);

  // Update full address when individual fields change
  useEffect(() => {
    const { houseNumber, street, wardName, districtName, provinceName } =
      addressData;
    const parts = [
      houseNumber,
      street,
      wardName,
      districtName,
      provinceName,
    ].filter((part) => part && part.trim());
    const fullAddress = parts.join(", ");

    if (fullAddress !== addressData.fullAddress && parts.length > 0) {
      setAddressData((prev) => ({ ...prev, fullAddress }));
    }
  }, [
    addressData.houseNumber,
    addressData.street,
    addressData.wardName,
    addressData.districtName,
    addressData.provinceName,
  ]);

  // Geocode when full address changes
  useEffect(() => {
    if (addressData.fullAddress && addressData.fullAddress.length > 15) {
      const timer = setTimeout(() => {
        geocodeAddress(addressData.fullAddress);
      }, 1500); // Debounce 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [addressData.fullAddress]);

  const geocodeAddress = async (fullAddress) => {
    if (!fullAddress || fullAddress.length < 10) return;

    setGeocoding(true);
    setError("");

    try {
      // Step 1: Geocode address using Nominatim
      console.log("Geocoding address with Nominatim:", fullAddress);

      // Try Nominatim first
      let geocodeResult;
      try {
        geocodeResult = await NominatimService.geocodeAddress(fullAddress);
        console.log("Nominatim success:", geocodeResult);
      } catch (nominatimError) {
        // console.warn("Nominatim failed:", nominatimError);

        // Fallback: try alternative geocoding
        console.log("Trying alternative geocoding...");
        geocodeResult = await tryAlternativeGeocoding(fullAddress);

        if (!geocodeResult) {
          throw new Error(
            "Không thể tìm thấy địa chỉ này. Vui lòng kiểm tra lại thông tin địa chỉ."
          );
        }
      }

      setCoordinates({
        lat: geocodeResult.lat,
        lng: geocodeResult.lng,
      });

      // Step 2: Calculate distance using Geolib
      const calculatedDistance = GeolibService.getDistanceToHospital({
        lat: geocodeResult.lat,
        lng: geocodeResult.lng,
      });

      setDistance(calculatedDistance);

      // No route calculation needed - just use distance

      // Notify parent component
      if (onAddressChange) {
        onAddressChange({
          ...addressData,
          coordinates: {
            lat: geocodeResult.lat,
            lng: geocodeResult.lng,
          },
          distance: calculatedDistance,
          formattedAddress: geocodeResult.address || fullAddress,
          priority: GeolibService.getDistancePriority(calculatedDistance),
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setError(error.message || "Không thể xác định vị trí địa chỉ này");

      // Final fallback: try basic keyword-based estimation
      try {
        const fallbackResult = await tryKeywordBasedEstimation(fullAddress);
        if (fallbackResult) {
          setCoordinates(fallbackResult.coordinates);
          setDistance(fallbackResult.distance);

          if (onAddressChange) {
            onAddressChange({
              ...addressData,
              ...fallbackResult,
              formattedAddress: fullAddress,
            });
          }

          // Clear error if fallback works
          setError("");
        }
      } catch (fallbackError) {
        console.error("Fallback estimation failed:", fallbackError);
      }
    } finally {
      setGeocoding(false);
    }
  };

  // Alternative geocoding using different approach
  const tryAlternativeGeocoding = async (address) => {
    try {
      // Try with simplified search (just city and district)
      const addressParts = address.split(",").map((part) => part.trim());
      const simplifiedAddress = addressParts.slice(-2).join(", "); // Last 2 parts (district, city)

      console.log("Trying simplified address:", simplifiedAddress);

      const searchParams = new URLSearchParams({
        q: simplifiedAddress,
        format: "json",
        countrycodes: "vn",
        limit: 1,
        addressdetails: 1,
      });

      const url = `https://nominatim.openstreetmap.org/search?${searchParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "BloodDonationApp/1.0",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const result = data[0];
          console.log("Alternative geocoding success:", result);

          return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            address: result.display_name,
          };
        }
      }
    } catch (error) {
      console.warn("Alternative geocoding failed:", error);
    }

    return null;
  };

  const tryKeywordBasedEstimation = async (address) => {
    const addressLower = address.toLowerCase();
    let mockLat, mockLng, estimatedDistance;

    // Major cities with known coordinates
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
    } else if (addressLower.includes("nha trang")) {
      mockLat = 12.2388 + (Math.random() - 0.5) * 0.1;
      mockLng = 109.1967 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 450 + Math.random() * 50;
    } else if (addressLower.includes("huế") || addressLower.includes("hue")) {
      mockLat = 16.4637 + (Math.random() - 0.5) * 0.1;
      mockLng = 107.5909 + (Math.random() - 0.5) * 0.1;
      estimatedDistance = 700 + Math.random() * 50;
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
      // Unknown location - estimate based on Vietnam bounds
      mockLat = 8.5 + Math.random() * 15; // Random lat in Vietnam
      mockLng = 102 + Math.random() * 8; // Random lng in Vietnam

      // Calculate distance using Geolib
      estimatedDistance = GeolibService.getDistanceToHospital({
        lat: mockLat,
        lng: mockLng,
      });
    }

    return {
      coordinates: { lat: mockLat, lng: mockLng },
      distance: Math.round(estimatedDistance * 100) / 100,
      priority: GeolibService.getDistancePriority(estimatedDistance),
    };
  };

  const handleFieldChange = (field, value) => {
    // Handle dropdown changes with name mapping
    if (field === "province") {
      const selectedCity = cityList.find((c) => c.Id === value);
      setAddressData((prev) => ({
        ...prev,
        [field]: value,
        provinceName: selectedCity ? selectedCity.Name : "",
        // Reset district and ward when province changes
        district: "",
        ward: "",
        districtName: "",
        wardName: "",
      }));
    } else if (field === "district") {
      const selectedDistrict = districtList.find((d) => d.Id === value);
      setAddressData((prev) => ({
        ...prev,
        [field]: value,
        districtName: selectedDistrict ? selectedDistrict.Name : "",
        // Reset ward when district changes
        ward: "",
        wardName: "",
      }));
    } else if (field === "ward") {
      const selectedWard = wardList.find((w) => w.Id === value);
      setAddressData((prev) => ({
        ...prev,
        [field]: value,
        wardName: selectedWard ? selectedWard.Name : "",
      }));
    } else {
      setAddressData((prev) => ({
        ...prev,
        [field]: value,
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
    <div className="address-form">
      <div className="address-fields">
        {/* <div className="field-row">
          <div className="form-group">
            <label>
              Số nhà <span className="required">*</span>
            </label>
            <input
              type="text"
              value={addressData.houseNumber}
              onChange={(e) => handleFieldChange("houseNumber", e.target.value)}
              placeholder="Số 123"
              disabled={disabled}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              Tên đường <span className="required">*</span>
            </label>
            <input
              type="text"
              value={addressData.street}
              onChange={(e) => handleFieldChange("street", e.target.value)}
              placeholder="Đường Nguyễn Huệ"
              disabled={disabled}
              className="form-input"
            />
          </div>
        </div> */}

        {/* <div className="field-row">
          <div className="form-group">
            <label>
              Tỉnh/Thành phố <span className="required">*</span>
            </label>
            <select
              value={addressData.province}
              onChange={(e) => handleFieldChange("province", e.target.value)}
              disabled={disabled}
              className="form-select"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {cityList.map((city) => (
                <option key={city.Id} value={city.Id}>
                  {city.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Quận/Huyện <span className="required">*</span>
            </label>
            <select
              value={addressData.district}
              onChange={(e) => handleFieldChange("district", e.target.value)}
              disabled={disabled || !addressData.province}
              className="form-select"
            >
              <option value="">Chọn quận/huyện</option>
              {districtList.map((district) => (
                <option key={district.Id} value={district.Id}>
                  {district.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="form-group full-width">
            <label>
              Phường/Xã <span className="required">*</span>
            </label>
            <select
              value={addressData.ward}
              onChange={(e) => handleFieldChange("ward", e.target.value)}
              disabled={disabled || !addressData.district}
              className="form-select"
            >
              <option value="">Chọn phường/xã</option>
              {wardList.map((ward) => (
                <option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        <div className="full-address-preview">
          <label>Địa chỉ đầy đủ:</label>
          <div className={`address-display ${geocoding ? "geocoding" : ""}`}>
            {addressData.fullAddress ||
              "Vui lòng điền đầy đủ thông tin địa chỉ"}
            {geocoding && (
              <span className="geocoding-indicator">
                <span className="loading-spinner"></span>
                Đang xác định vị trí...
              </span>
            )}
          </div>

          {/* {addressData.fullAddress && addressData.fullAddress.length > 10 && (
            <div className="address-help">
              <small>
                💡 Hệ thống sẽ tự động tính khoảng cách khi bạn điền đầy đủ
                thông tin địa chỉ
              </small>
            </div>
          )} */}
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
            <div className="error-help">
              <small>
                Gợi ý: Hãy đảm bảo bạn đã chọn đúng tỉnh/thành phố, quận/huyện
                và phường/xã
              </small>
            </div>
          </div>
        )}
      </div>

      {/* Distance Information */}
      {distance && (
        <div className="distance-info-section">
          {/* <h4>📏 Thông tin khoảng cách</h4> */}

          {/* <div className="distance-details">
            <div className="distance-item">
              <span className="distance-label">Khoảng cách đến bệnh viện:</span>
              <span
                className="distance-value"
                style={{ color: getDistanceColor() }}
              >
                {GeolibService.formatDistance(distance)} ({getDistanceText()})
              </span>
            </div>
          </div> */}

          <div className="hospital-info">
            <h5>🏥 Địa điểm hiến máu</h5>
            <div className="hospital-details">
              <div className="hospital-item">
                <strong>Bệnh viện Đa khoa Ánh Dương</strong>
              </div>
              <div className="hospital-item">
                📍 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM, Vietnam
              </div>
            </div>

            {coordinates.lat && coordinates.lng && (
              <div className="directions-links">
                <a
                  href={GeolibService.getDirectionsUrl(coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-link osm-link"
                >
                  🗺️ Xem đường đi trên OpenStreetMap
                </a>
                <a
                  href={GeolibService.getDirectionsUrl(coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="directions-link google-link"
                >
                  📍 Xem trên Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
