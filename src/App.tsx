import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feature from "./component/feature";
import Dashbord from "./component/dashbord/Dashbord";
import Header from "./component/homepage/Header";
import Main from "./component/homepage/Main";
import Footer from "./component/footer";


function Layout({ children, defaultDropDown }: { children: React.ReactNode; defaultDropDown?: boolean }) {
  return (
    <>
      <Header defaultDropDown={defaultDropDown} />
      <Feature />
      {children}
      <Footer/>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Main />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout defaultDropDown={true}>
              <Main />
            </Layout>
          }
        />
        <Route path="/Dashbord" element={<Dashbord />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;