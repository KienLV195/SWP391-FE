import authService from '../services/authService';

/**
 * Lấy tên người dùng từ database hoặc profile
 * Ưu tiên: localStorage memberInfo > user profile > fallback
 * @returns {string} Tên người dùng
 */
export const getUserName = () => {
    // Ưu tiên lấy từ localStorage memberInfo trước (dữ liệu từ database)
    const storedInfo = JSON.parse(localStorage.getItem("memberInfo") || "{}");
    if (storedInfo.name) {
        return storedInfo.name;
    }

    // Nếu không có, lấy từ user profile
    const user = authService.getCurrentUser();
    return user?.profile?.name || user?.profile?.fullName || "Member";
};

/**
 * Lấy thông tin người dùng từ localStorage memberInfo
 * @returns {Object} Thông tin người dùng từ database
 */
export const getStoredUserInfo = () => {
    return JSON.parse(localStorage.getItem("memberInfo") || "{}");
};

/**
 * Cập nhật thông tin người dùng trong localStorage
 * @param {Object} userInfo - Thông tin người dùng mới
 */
export const updateStoredUserInfo = (userInfo) => {
    localStorage.setItem("memberInfo", JSON.stringify(userInfo));
}; 