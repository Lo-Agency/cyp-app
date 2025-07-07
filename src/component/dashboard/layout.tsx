import { Outlet, Link, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

const dashboardItems = [
  { title: "داشبورد", path: "/Dashboard",icon:"src/asset/dashboard.svg" },
  { title: "تراکنش‌ها", path: "/transactions",icon:"src/asset/transaction.svg"},
  { title: "گزارش‌ها", path: "/reports" ,icon:"src/asset/report.svg"},
  { title: "بودجه", path: "/budget" ,icon:"src/asset/budget.svg"},
  { title: "اهداف مالی", path: "/goals" ,icon:"src/asset/goal.svg"},
  { title: "مدیریت بدهی", path: "/debt" ,icon:"src/asset/loan.svg"},
  { title: "خروج", path: "/" ,icon:"src/asset/exit.svg"},
];

const Layout = () => {
  const { logout } = useUser();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow flex overflow-hidden min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-300">
          <h1 className="text-2xl font-bold mb-4 p-6">CYP</h1>
          <ul className="space-y-2 p-4">
            {dashboardItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <img
                src={item.icon}
                className="w-5 h-5 "
              />
                <Link
                  to={item.path}
                  onClick={item.title === "خروج" ? logout : undefined}
                  className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 ${location.pathname === item.path ? "bg-blue-100 text-blue-600" : ""
                    }`}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;