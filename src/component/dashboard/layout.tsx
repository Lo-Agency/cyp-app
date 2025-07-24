import { Outlet, Link, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/userContext";

const dashboardItems = [
  { title: "داشبورد", path: "/Dashboard", icon: "src/asset/dashboard.svg" },
  {
    title: "تراکنش‌ها",
    path: "/transactions",
    icon: "src/asset/transaction.svg",
  },
  { title: "گزارش‌ها", path: "/report", icon: "src/asset/report.svg" },
  { title: "بودجه", path: "/budget", icon: "src/asset/budget.svg" },
  { title: "اهداف مالی", path: "/goals", icon: "src/asset/goal.svg" },
  { title: "مدیریت بدهی", path: "/debt", icon: "src/asset/loan.svg" },
  { title: "خروج", path: "/", icon: "src/asset/exit.svg" },
];

const Layout = () => {
  const { logout } = useUser();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
      <header className="bg-white rounded-t-2xl shadow p-4 border-b border-gray-300 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CYP</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <img
              src="src/asset/notification.svg"
              alt="نوتیفیکیشن"
              className="w-8 h-8"
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
          <button className="relative">
            <img src="src/asset/account.svg" alt="اکانت" className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-b-2xl shadow flex overflow-x-hidden min-h-[calc(100vh-88px)]">
        {/* Sidebar */}
        <div className="w-16 md:w-20 lg:w-64 bg-white border-r border-gray-300 flex flex-col items-center lg:items-start">
          <ul className="space-y-2 py-4 w-full">
            {dashboardItems.map((item, index) => (
              <li key={index} className="w-full">
                <Link
                  to={item.path}
                  onClick={item.title === "خروج" ? logout : undefined}
                  className={`flex items-center justify-center lg:justify-start gap-2 p-2 rounded hover:bg-gray-100 w-full ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-600"
                      : ""
                  }`}
                >
                  <img src={item.icon} className="w-5 h-5" />
                  <span className="hidden lg:inline">{item.title}</span>
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
