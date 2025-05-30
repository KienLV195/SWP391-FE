import GuestNavbar from "../../components/guest/GuestNavbar";
import Footer from "../../components/common/Footer";
import "../../styles/pages/ForbiddenPage.scss";

const ForbiddenPage = () => {
  return (
    <div className="forbidden-page">
      <GuestNavbar />
      <main>
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
      </main>
      <Footer />
    </div>
  );
};

export default ForbiddenPage;
