import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Header />
      <main>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
