import Dashboard from "./component/dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./component/NotFound";
import HomePage from "./component/homepage/Index";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
