import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feature from "./component/homepage/feature";
import Dashboard from "./component/dashboard/Dashboard";
import Header from "./component/homepage/Header";
import Main from "./component/homepage/Main";
import Footer from "./component/homepage/footer";

function Layout({
  children,
  defaultDropDown,
}: {
  children: React.ReactNode;
  defaultDropDown?: boolean;
}) {
  return (
    <>
      <Header defaultDropDown={defaultDropDown} />
      <Feature />
      {children}
      <Footer />
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
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
