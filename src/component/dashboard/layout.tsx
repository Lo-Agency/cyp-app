import { Outlet, Link, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

const dashboardItems = [
  { title: "داشبورد", path: "/Dashboard" },
  { title: "تراکنش‌ها", path: "/transactions" },
  { title: "گزارش‌ها", path: "/reports" },
  { title: "بودجه", path: "/budget" },
  { title: "خروج", path: "/" },
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
              <li key={index}>
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