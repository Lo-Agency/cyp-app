import { useState } from "react";
import { isCookie, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const chartData = [
  { name: "فروردین", income: 4000, expense: 2400 },
  { name: "اردیبهشت", income: 3000, expense: 1398 },
  { name: "خرداد", income: 2000, expense: 9800 },
  { name: "تیر", income: 2780, expense: 3908 },
];

// اینارو فعلا دستی وارد کردم برای دیدن UI
const dashboardItems = [
  { title: "داشبورد", path: "/Dashboard" ,icon:"src/asset/dashboard.svg"},
  { title: "تراکنش‌ها", path: "/transactions" ,icon:"src/asset/transaction.svg"},
  { title: "گزارش‌ها", path: "/reports" ,icon:"src/asset/report.svg"},
  { title: "بودجه", path: "/budget" ,icon:"src/asset/budgets.svg"},
  { title: "حساب کاربری", path: "/account" ,icon:"src/asset/account.svg"},
  { title: "خروج", path: "/" ,icon:"src/asset/exit.svg"},
];

export default function Dashboard() {
  const [userName] = useState("کاربر تست");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-4 md:p-6" dir="rtl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className={`fixed md:static inset-y-0 right-0 w-64 bg-white shadow-md transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0 transition-transform duration-300 z-50 md:z-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-primary animate-fade-in">CYP</h1>
              <button
                className="md:hidden text-primary"
                onClick={toggleSidebar}
                aria-label="بستن منو"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ul className="space-y-2">
              {dashboardItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 p-3 rounded-md text-text-primary hover:bg-accent hover:text-secondary transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label={item.title}
                  >
                       <img
                      src={item.icon}
                      alt={`${item.title} icon`}
                      className="w-4 h-4"
                    />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <main className="flex-1">
          {/* این قسمت برای ورژن موبایل */}
          <button
            className="md:hidden text-primary mb-4 p-2"
            onClick={toggleSidebar}
            aria-label="باز کردن منو"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex justify-between items-center mb-6 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">خوش آمدید، {userName}</h2>
          </div>


         <div className="bg-white p-6 rounded-xl shadow-md mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">روند درآمد و هزینه</h3>
            <LineChart width={600} height={300} data={chartData} className="w-full max-w-full">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-accent)" />
              <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
              <YAxis stroke="var(--color-text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  borderColor: "var(--color-accent)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--color-primary)"
                name="درآمد"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="var(--color-error)"
                name="هزینه"
                strokeWidth={2}
              />
            </LineChart>
          </div>
           </main>
        </div>
       
    </div>
  );
}