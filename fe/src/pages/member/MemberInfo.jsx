import React from "react";
import MemberNavbar from "../../components/member/MemberNavbar";

const MemberInfo = () => {
  return (
    <>
      <MemberNavbar />
      <div style={{ padding: 32 }}>
        <h2>Hồ sơ cá nhân</h2>
        <p>Thông tin cá nhân của bạn sẽ hiển thị tại đây.</p>
      </div>
    </>
  );
};

export default MemberInfo;
