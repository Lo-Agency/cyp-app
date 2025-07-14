import Dashboard from "./component/dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./component/NotFound";
import HomePage from "./component/homepage/Index";
import { UserProvider } from "./contexts/userContext";
import Budget from "./component/dashboard/budgets";
import Layout from "./component/dashboard/layout";
import Transactionreport from "./component/dashboard/transactionreport/Transactionreport";

function App() {
  return (
    <>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          
            <Route path="/transactions" element={<Transactionreport />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
