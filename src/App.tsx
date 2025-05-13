import { useState } from "react";
import Dashbord from "./component/dashbord/Dashbord";
import Header from "./component/homepage/Header";
import Main from "./component/homepage/Main";
import LoginModal from "./component/homepage/LoginModal";
import RegisterModal from "./component/homepage/RegisterModal";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [modalType, setModalType] = useState<null | "login" | "register">(null);

  const closeModal = () => setModalType(null);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Main onLoginClick={() => setModalType("login")} />{" "}
              </>
            }
          />
          <Route path="/Dashbord" element={<Dashbord />} />
        </Routes>
      </BrowserRouter>

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
}

export default App;
