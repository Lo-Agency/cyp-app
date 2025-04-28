import Dashbord from "./component/dashbord/Dashbord";
import Header from "./component/homepage/Header";
import Main from "./component/homepage/Main";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Main />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Header defaultDropDown={true} />
                <Main />
              </>
            }
          />
          <Route path="/Dashboard" element={<Dashbord />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
