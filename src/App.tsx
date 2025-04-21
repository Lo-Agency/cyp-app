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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
