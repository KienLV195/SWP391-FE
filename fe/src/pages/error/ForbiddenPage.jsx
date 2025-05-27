import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./ForbiddenPage.scss";

const ForbiddenPage = () => {
  return (
    <div className="forbidden-page">
      <Header />
      <main>
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
      </main>
      <Footer />
    </div>
  );
};

export default ForbiddenPage;
