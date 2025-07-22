import Dashboard from "./component/dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./component/NotFound";
import HomePage from "./component/homepage/Index";
import { UserProvider } from "./contexts/userContext";
import Budget from "./component/dashboard/budgets";
import Layout from "./component/dashboard/layout";
import Transactionreport from "./component/dashboard/transactionreport/Transactionreport";
import Goal from "./component/dashboard/goal";
import Debt from "./component/dashboard/debt";
import Report from "./component/dashboard/Report";
import Privateroute from "./component/dashboard/PrivateRoute";

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              element={
                <Privateroute>
                  <Layout />
                </Privateroute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/transactions" element={<Transactionreport />} />
              <Route path="/report" element={<Report />} />
                    <Route path="/goals" element={<Goal />} />
            <Route path="/debt" element={<Debt />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
