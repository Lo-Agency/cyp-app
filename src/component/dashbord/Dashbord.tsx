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

const transactions = [
  { id: 1, category: "خوراک", amount: 500, date: "1404/01/01" },
  { id: 2, category: "حمل‌ونقل", amount: 200, date: "1404/01/02" },
  { id: 3, category: "سرگرمی", amount: 1000, date: "1404/01/03" },
];

export default function Dashbord() {
  const [userName] = useState("کاربر تست");

  return (
    <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow flex overflow-hidden min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-300">
          <h1 className="text-2xl font-bold mb-4 p-6">CYP</h1>
          <ul className="space-y-2 p-4">
            <li>
              <Link to="/Dashbord" className="block p-2 rounded hover:bg-gray-100">داشبورد</Link>
            </li>
            <li>
              <Link to="/transactions" className="block p-2 rounded hover:bg-gray-100">تراکنش‌ها</Link>
            </li>
            <li>
              <Link to="/reports" className="block p-2 rounded hover:bg-gray-100">گزارش‌ها</Link>
            </li>
            <li>
              <Link to="/budget" className="block p-2 rounded hover:bg-gray-100">بودجه</Link>
            </li>
            <li>
              <Link to="/" className="block p-2 rounded hover:bg-gray-100">خروج</Link>
            </li>
          </ul>
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">خوش آمدید، {userName}</h2>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              افزودن تراکنش
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-700">درآمد کل</h3>
              <p className="text-2xl font-bold text-green-600">12,000,000 تومان</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-700">هزینه کل</h3>
              <p className="text-2xl font-bold text-red-600">8,000,000 تومان</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-700">بودجه باقی‌مانده</h3>
              <p className="text-2xl font-bold text-blue-600">4,000,000 تومان</p>
            </div>
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


          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">تراکنش‌های اخیر</h3>
            <table className="w-full text-right">
              <thead>
                <tr className="border-b">
                  <th className="p-2">دسته‌بندی</th>
                  <th className="p-2">مبلغ (تومان)</th>
                  <th className="p-2">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="p-2">{transaction.category}</td>
                    <td className="p-2">{transaction.amount.toLocaleString()}</td>
                    <td className="p-2">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}