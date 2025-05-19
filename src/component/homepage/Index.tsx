import Header from "./Header";
import Main from "./Main";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useState } from "react";

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
    </>
  );
};
export default HomePage;
