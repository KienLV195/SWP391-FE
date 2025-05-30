import React from "react";
import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";

const BlogPage = () => {
  return (
    <>
      <GuestNavbar />
      <div className="guest-home-page">
        <section className="content-section">
          <h1 className="merriweather-title">TIN TỨC HIẾN MÁU</h1>
          <p className="merriweather-content">
            Đây là trang tin tức nội dung tin tức, bài viết, hoặc các thông tin
            liên quan đến hiến máu tại đây.
          </p>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;
