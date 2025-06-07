import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../common/LogoutButton";
import authService from "../../services/authService";
import { DOCTOR_TYPES } from "../../services/mockData";
import "../../styles/components/DoctorSidebar.scss";

const DoctorSidebar = () => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  
  // Determine doctor type and menu items
  const isBloodDepartment = currentUser?.doctorType === DOCTOR_TYPES.BLOOD_DEPARTMENT;
  
  const menuItems = [
    {
      path: "/doctor",
      label: "🏠 Dashboard",
      exact: true
    },
    {
      path: "/doctor/blood-requests",
      label: "📋 Yêu cầu máu"
    },
    {
      path: "/doctor/blood-inventory",
      label: "🏦 Xem kho máu"
    }
  ];

  // Add specific items for blood department doctors
  if (isBloodDepartment) {
    menuItems.splice(2, 0, {
      path: "/doctor/external-requests",
      label: "🌐 Yêu cầu bên ngoài"
    });
    menuItems.splice(3, 0, {
      path: "/doctor/donor-management",
      label: "👥 Quản lý người hiến"
    });
  }

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="doctor-sidebar">
      <div className="doctor-sidebar__header">
        <h2>Doctor Panel</h2>
        <div className="doctor-type">
          {isBloodDepartment ? (
            <span className="blood-dept">🩸 Khoa Huyết học</span>
          ) : (
            <span className="other-dept">🏥 Khoa khác</span>
          )}
        </div>
      </div>
      
      <nav className="doctor-sidebar__nav">
        <ul className="doctor-sidebar__menu">
          {menuItems.map((item) => (
            <li key={item.path} className="doctor-sidebar__menu-item">
              <Link
                to={item.path}
                className={`doctor-sidebar__link ${
                  isActive(item.path, item.exact) ? "active" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="doctor-sidebar__footer">
        <div className="user-info">
          <div className="user-name">{currentUser?.name}</div>
          <div className="user-department">{currentUser?.department}</div>
        </div>
        <LogoutButton variant="sidebar" />
      </div>
    </div>
  );
};

export default DoctorSidebar;
