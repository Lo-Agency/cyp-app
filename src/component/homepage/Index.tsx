import Header from "./Header";
import Main from "./Main";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useState } from "react";
import Feature from "./feature";
import Footer from "./footer";

const HomePage = () => {
  const [modalType, setModalType] = useState<null | "login" | "register">(null);
  const closeModal = () => setModalType(null);
  return (
    <>
      <Header />
      <Main setModalType={setModalType} />
      {modalType === "login" && (
        <LoginModal
          onClose={closeModal}
          onSwitchToRegister={() => setModalType("register")}
        />
      )}

      {modalType === "register" && (
        <RegisterModal
          onClose={closeModal}
          onSwitchToLogin={() => setModalType("login")}
        />
      )}
      <Feature />
      <Footer />
    </>
  );
};
export default HomePage;
