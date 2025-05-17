import { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const chartData = [
  { name: "فروردین", income: 4000, expense: 2400 },
  { name: "اردیبهشت", income: 3000, expense: 1398 },
  { name: "خرداد", income: 2000, expense: 9800 },
  { name: "تیر", income: 2780, expense: 3908 },
];

// اینارو فعلا دستی وارد کردم برای دیدن UI
const dashboardItems = [
  { title: "داشبورد", path: "/Dashboard" },
  { title: "تراکنش‌ها", path: "/transactions" },
  { title: "گزارش‌ها", path: "/reports" },
  { title: "بودجه", path: "/budget" },
  { title: "خروج", path: "/" },
];

export default function Dashboard() {
  const [userName] = useState("کاربر تست");

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
            className="block p-2 rounded hover:bg-gray-100"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">خوش آمدید، {userName}</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              افزودن تراکنش
            </button>
          </div>
        
          
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">روند درآمد و هزینه</h3>
            <LineChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" name="درآمد" />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" name="هزینه" />
            </LineChart>
          </div>


          
        </div>
      </div>
    </div>
  );
}