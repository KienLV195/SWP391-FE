import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { SettingOutlined } from "@ant-design/icons";
import "../../styles/pages/SystemSettings.scss";
import AdminCard from "../../components/admin/shared/AdminCard";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: "Hệ thống Hiến máu Ánh Dương",
      siteDescription: "Hệ thống quản lý hiến máu tại Bệnh viện Ánh Dương",
      contactEmail: "contact@anhduong-hospital.com",
      contactPhone: "028-1234-5678",
      address: "CMT8 Street, District 3, Ho Chi Minh City",
      coordinates: {
        lat: 10.7751237,
        lng: 106.6862143,
      },
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireEmailVerification: true,
      enableTwoFactor: false,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      emergencyAlerts: true,
      maintenanceNotices: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retentionDays: 30,
      backupLocation: "cloud",
      lastBackup: "2024-01-15 02:00:00",
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: "Hệ thống đang bảo trì. Vui lòng quay lại sau.",
      scheduledMaintenance: null,
    },
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    // Mock API call to load settings
    const loadSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Settings are already initialized above
        setLoading(false);
      } catch (error) {
        console.error("Error loading settings:", error);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleBackupNow = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      handleSettingChange("backup", "lastBackup", now);
      alert("Sao lưu dữ liệu thành công!");
    } catch (error) {
      console.error("Error creating backup:", error);
      alert("Có lỗi xảy ra khi sao lưu dữ liệu!");
    }
  };

  const handleTestEmail = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Email thử nghiệm đã được gửi thành công!");
    } catch (error) {
      console.error("Error sending test email:", error);
      alert("Có lỗi xảy ra khi gửi email thử nghiệm!");
    }
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h3>Cài đặt chung</h3>

      <div className="form-group">
        <label htmlFor="siteName">Tên hệ thống</label>
        <input
          type="text"
          id="siteName"
          value={settings.general.siteName}
          onChange={(e) =>
            handleSettingChange("general", "siteName", e.target.value)
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="siteDescription">Mô tả hệ thống</label>
        <textarea
          id="siteDescription"
          rows="3"
          value={settings.general.siteDescription}
          onChange={(e) =>
            handleSettingChange("general", "siteDescription", e.target.value)
          }
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contactEmail">Email liên hệ</label>
          <input
            type="email"
            id="contactEmail"
            value={settings.general.contactEmail}
            onChange={(e) =>
              handleSettingChange("general", "contactEmail", e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactPhone">Số điện thoại</label>
          <input
            type="tel"
            id="contactPhone"
            value={settings.general.contactPhone}
            onChange={(e) =>
              handleSettingChange("general", "contactPhone", e.target.value)
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Địa chỉ bệnh viện</label>
        <input
          type="text"
          id="address"
          value={settings.general.address}
          onChange={(e) =>
            handleSettingChange("general", "address", e.target.value)
          }
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitude">Vĩ độ (Latitude)</label>
          <input
            type="number"
            id="latitude"
            step="0.0000001"
            value={settings.general.coordinates.lat}
            onChange={(e) =>
              handleSettingChange("general", "coordinates", {
                ...settings.general.coordinates,
                lat: parseFloat(e.target.value),
              })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Kinh độ (Longitude)</label>
          <input
            type="number"
            id="longitude"
            step="0.0000001"
            value={settings.general.coordinates.lng}
            onChange={(e) =>
              handleSettingChange("general", "coordinates", {
                ...settings.general.coordinates,
                lng: parseFloat(e.target.value),
              })
            }
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Cài đặt bảo mật</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</label>
          <input
            type="number"
            id="sessionTimeout"
            min="5"
            max="480"
            value={settings.security.sessionTimeout}
            onChange={(e) =>
              handleSettingChange(
                "security",
                "sessionTimeout",
                parseInt(e.target.value)
              )
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxLoginAttempts">Số lần đăng nhập tối đa</label>
          <input
            type="number"
            id="maxLoginAttempts"
            min="3"
            max="10"
            value={settings.security.maxLoginAttempts}
            onChange={(e) =>
              handleSettingChange(
                "security",
                "maxLoginAttempts",
                parseInt(e.target.value)
              )
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="passwordMinLength">Độ dài mật khẩu tối thiểu</label>
        <input
          type="number"
          id="passwordMinLength"
          min="6"
          max="20"
          value={settings.security.passwordMinLength}
          onChange={(e) =>
            handleSettingChange(
              "security",
              "passwordMinLength",
              parseInt(e.target.value)
            )
          }
        />
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.security.requireEmailVerification}
              onChange={(e) =>
                handleSettingChange(
                  "security",
                  "requireEmailVerification",
                  e.target.checked
                )
              }
            />
            <span className="checkmark"></span>
            Yêu cầu xác minh email
          </label>
        </div>
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.security.enableTwoFactor}
              onChange={(e) =>
                handleSettingChange(
                  "security",
                  "enableTwoFactor",
                  e.target.checked
                )
              }
            />
            <span className="checkmark"></span>
            Bật xác thực hai yếu tố
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Cài đặt thông báo</h3>

      <div className="notification-options">
        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications",
                    "emailNotifications",
                    e.target.checked
                  )
                }
              />
              <span className="checkmark"></span>
              Thông báo qua Email
            </label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications",
                    "smsNotifications",
                    e.target.checked
                  )
                }
              />
              <span className="checkmark"></span>
              Thông báo qua SMS
            </label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications.pushNotifications}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications",
                    "pushNotifications",
                    e.target.checked
                  )
                }
              />
              <span className="checkmark"></span>
              Thông báo đẩy
            </label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications.emergencyAlerts}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications",
                    "emergencyAlerts",
                    e.target.checked
                  )
                }
              />
              <span className="checkmark"></span>
              Cảnh báo khẩn cấp
            </label>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications.maintenanceNotices}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications",
                    "maintenanceNotices",
                    e.target.checked
                  )
                }
              />
              <span className="checkmark"></span>
              Thông báo bảo trì
            </label>
          </div>
        </div>
      </div>

      <div className="test-section">
        <button className="btn-outline" onClick={handleTestEmail}>
          <i className="fas fa-envelope"></i>
          Gửi email thử nghiệm
        </button>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="settings-section">
      <h3>Cài đặt sao lưu</h3>

      <div className="form-group">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.backup.autoBackup}
              onChange={(e) =>
                handleSettingChange("backup", "autoBackup", e.target.checked)
              }
            />
            <span className="checkmark"></span>
            Tự động sao lưu
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="backupFrequency">Tần suất sao lưu</label>
          <select
            id="backupFrequency"
            value={settings.backup.backupFrequency}
            onChange={(e) =>
              handleSettingChange("backup", "backupFrequency", e.target.value)
            }
          >
            <option value="hourly">Mỗi giờ</option>
            <option value="daily">Hàng ngày</option>
            <option value="weekly">Hàng tuần</option>
            <option value="monthly">Hàng tháng</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="retentionDays">Lưu trữ (ngày)</label>
          <input
            type="number"
            id="retentionDays"
            min="7"
            max="365"
            value={settings.backup.retentionDays}
            onChange={(e) =>
              handleSettingChange(
                "backup",
                "retentionDays",
                parseInt(e.target.value)
              )
            }
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="backupLocation">Vị trí lưu trữ</label>
        <select
          id="backupLocation"
          value={settings.backup.backupLocation}
          onChange={(e) =>
            handleSettingChange("backup", "backupLocation", e.target.value)
          }
        >
          <option value="local">Máy chủ cục bộ</option>
          <option value="cloud">Đám mây</option>
          <option value="both">Cả hai</option>
        </select>
      </div>

      <div className="backup-info">
        <div className="info-item">
          <span className="label">Lần sao lưu cuối:</span>
          <span className="value">
            {new Date(settings.backup.lastBackup).toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      <div className="backup-actions">
        <button className="btn-primary" onClick={handleBackupNow}>
          <i className="fas fa-download"></i>
          Sao lưu ngay
        </button>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="settings-section">
      <h3>Cài đặt bảo trì</h3>

      <div className="form-group">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.maintenance.maintenanceMode}
              onChange={(e) =>
                handleSettingChange(
                  "maintenance",
                  "maintenanceMode",
                  e.target.checked
                )
              }
            />
            <span className="checkmark"></span>
            Chế độ bảo trì
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="maintenanceMessage">Thông báo bảo trì</label>
        <textarea
          id="maintenanceMessage"
          rows="3"
          value={settings.maintenance.maintenanceMessage}
          onChange={(e) =>
            handleSettingChange(
              "maintenance",
              "maintenanceMessage",
              e.target.value
            )
          }
        />
      </div>

      {settings.maintenance.maintenanceMode && (
        <div className="maintenance-warning">
          <i className="fas fa-exclamation-triangle"></i>
          <span>
            Hệ thống đang ở chế độ bảo trì. Người dùng sẽ không thể truy cập.
          </span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải cài đặt...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Cài đặt hệ thống"
        icon={<SettingOutlined />}
        subtitle="Quản lý các thiết lập chung, bảo mật, thông báo và bảo trì hệ thống"
      />
      <div
        className="system-settings"
        style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}
      >
        <div className="settings-container">
          <div className="settings-nav">
            <button
              className={`nav-btn ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              <i className="fas fa-cog"></i>
              Chung
            </button>
            <button
              className={`nav-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <i className="fas fa-shield-alt"></i>
              Bảo mật
            </button>
            <button
              className={`nav-btn ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <i className="fas fa-bell"></i>
              Thông báo
            </button>
            <button
              className={`nav-btn ${activeTab === "backup" ? "active" : ""}`}
              onClick={() => setActiveTab("backup")}
            >
              <i className="fas fa-database"></i>
              Sao lưu
            </button>
            <button
              className={`nav-btn ${
                activeTab === "maintenance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("maintenance")}
            >
              <i className="fas fa-tools"></i>
              Bảo trì
            </button>
          </div>

          <div className="settings-content">
            {activeTab === "general" && renderGeneralSettings()}
            {activeTab === "security" && renderSecuritySettings()}
            {activeTab === "notifications" && renderNotificationSettings()}
            {activeTab === "backup" && renderBackupSettings()}
            {activeTab === "maintenance" && renderMaintenanceSettings()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;
