import Dashbord from "./component/dashbord/Dashbord";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./component/NotFound";
import HomePage from "./component/homepage/Index";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/somayeh" element={<Dashbord />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
