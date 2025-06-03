import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "../../styles/components/NavbarCommon.scss";

const NavbarBase = ({ logoSrc, logoAlt, navItems, actionItems, userInfo }) => {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logoSrc} alt={logoAlt} className="logo-img" />
        </Link>
      </div>

      <nav className="navbar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${location.pathname === item.path ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="navbar-actions">
        {actionItems.map((item) => (
          <Link key={item.path} to={item.path} className={item.className}>
            {item.label}
          </Link>
        ))}
        {userInfo && (
          <div className="user-info">
            <span className="user-name">{userInfo.name}</span>
            <div className="user-avatar">
              {userInfo.avatar || userInfo.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

NavbarBase.propTypes = {
  logoSrc: PropTypes.string.isRequired,
  logoAlt: PropTypes.string.isRequired,
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default NavbarBase;
