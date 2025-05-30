import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import "../../styles/pages/NotFoundPage.scss";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <GuestNavbar />
      <main>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
