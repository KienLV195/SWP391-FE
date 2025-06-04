import React from "react";
import BlogPage from "../guest/BlogPage";
import MemberNavbar from "../../components/member/MemberNavbar";

const MemberBlogPage = () => {
  return (
    <>
      <MemberNavbar />
      <BlogPage hideNavbar />
    </>
  );
};

export default MemberBlogPage;
