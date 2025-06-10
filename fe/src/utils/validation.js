// Validation utilities for forms

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: Minimum 6 characters with lowercase, uppercase, numbers, and special characters
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with details
 */
export const validatePassword = (password) => {
  // Tối thiểu 6 ký tự có chữ thường, chữ hoa, số và ký tự đặc biệt
  const minLength = password.length >= 6;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: minLength && hasLowerCase && hasUpperCase && hasNumbers && hasSpecialChar,
    minLength,
    hasLowerCase,
    hasUpperCase,
    hasNumbers,
    hasSpecialChar
  };
};

/**
 * Get password validation error message
 * @param {string} password - Password to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getPasswordValidationError = (password) => {
  if (!password) {
    return "Mật khẩu là bắt buộc";
  }

  const validation = validatePassword(password);
  if (!validation.isValid) {
    const missingRequirements = [];
    if (!validation.minLength) missingRequirements.push("tối thiểu 6 ký tự");
    if (!validation.hasLowerCase) missingRequirements.push("một chữ thường (a-z)");
    if (!validation.hasUpperCase) missingRequirements.push("một chữ hoa (A-Z)");
    if (!validation.hasNumbers) missingRequirements.push("một chữ số (0-9)");
    if (!validation.hasSpecialChar) missingRequirements.push("một ký tự đặc biệt (!@#$%^&*)");

    return `Mật khẩu phải bao gồm: ${missingRequirements.join(", ")}`;
  }

  return "";
};

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string} - Error message or empty string if valid
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Xác nhận mật khẩu là bắt buộc";
  }

  if (password !== confirmPassword) {
    return "Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập";
  }

  return "";
};

/**
 * Validate full name
 * @param {string} fullName - Full name to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validateFullName = (fullName) => {
  if (!fullName || !fullName.trim()) {
    return "Họ và tên là bắt buộc";
  }

  if (fullName.trim().length < 2) {
    return "Họ và tên phải có tối thiểu 2 ký tự";
  }

  return "";
};

/**
 * Validate phone number (Vietnamese format)
 * @param {string} phone - Phone number to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return "Số điện thoại là bắt buộc";
  }

  // Vietnamese phone number format: 10-11 digits, starts with 0
  const phoneRegex = /^0[0-9]{9,10}$/;
  if (!phoneRegex.test(phone)) {
    return "Số điện thoại không đúng định dạng (10-11 chữ số, bắt đầu bằng 0)";
  }

  return "";
};

/**
 * Password strength indicator
 * @param {string} password - Password to check
 * @returns {object} - Strength level and color
 */
export const getPasswordStrength = (password) => {
  const validation = validatePassword(password);
  let score = 0;
  
  if (validation.minLength) score++;
  if (validation.hasLowerCase) score++;
  if (validation.hasUpperCase) score++;
  if (validation.hasNumbers) score++;
  if (validation.hasSpecialChar) score++;
  
  if (score <= 2) {
    return { level: "Yếu", color: "#ff4d4f", percentage: (score / 5) * 100 };
  } else if (score <= 3) {
    return { level: "Trung bình", color: "#faad14", percentage: (score / 5) * 100 };
  } else if (score <= 4) {
    return { level: "Mạnh", color: "#52c41a", percentage: (score / 5) * 100 };
  } else {
    return { level: "Rất mạnh", color: "#1890ff", percentage: 100 };
  }
};

/**
 * Common validation rules for forms
 */
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 6,
    REQUIRED_PATTERNS: {
      LOWERCASE: /[a-z]/,
      UPPERCASE: /[A-Z]/,
      NUMBERS: /\d/,
      SPECIAL_CHARS: /[!@#$%^&*(),.?":{}|<>]/
    }
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    PATTERN: /^0[0-9]{9,10}$/
  }
};

/**
 * Test passwords for development/testing
 * All these passwords meet the validation requirements
 */
export const TEST_PASSWORDS = {
  MEMBER: 'Member1@',
  DOCTOR: 'Doctor1@',
  MANAGER: 'Manager1@',
  ADMIN: 'Admin123@',
  SUPER_ADMIN: 'SuperAdmin1@'
};
