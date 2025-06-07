import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Cards from "./Cards";
import Modal from "./Modaltransaction";

type Transaction = {
  id: number;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
};

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
  const [userName, setUserName] = useState(" ");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");
        const data = await res.json();
        setUserName(data.name);
      } catch (err) {
        console.error("خطا:", err);
        setUserName("کاربر ناشناس");
      }
    };

    fetchUser();
  }, []);


  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transaction", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("خطا در گرفتن تراکنش‌ها:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const handleAddTransaction = async (transaction: {
    date: string;
    payee: string;
    category: string;
    amount: number;
    type: "income" | "expense";
  }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/transaction",
        {
          title: transaction.payee,
          amount: transaction.amount,
          type: transaction.type.toUpperCase(),
          categoryId: parseInt(transaction.category),
          date: transaction.date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTransactions((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("خطا در افزودن تراکنش:", error);
    }
  };
  console.log({transactions})


  // محاسبه داینامیک
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const budget = totalIncome - totalExpense;

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
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
              onClick={() => setShowModal(true)}
            >
              تراکنش جدید
            </button>
          </div>
          <div className="flex flex-row justify-between gap-4 p-8">
            <Cards
              title="درآمدها"
              amount={`${totalIncome.toLocaleString()} تومان`}
            />
            <Cards
              title="هزینه ها"
              amount={`${totalExpense.toLocaleString()} تومان`}
            />
            <Cards title="بودجه" amount={`${budget.toLocaleString()} تومان`} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              روند درآمد و هزینه
            </h3>
            <LineChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                name="درآمد"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                name="هزینه"
              />
            </LineChart>
          </div>
          <div className="p-8">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">تراکنش ها</h2>
            </div>

            {/* Transactions Table */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                تراکنش‌های اخیر
              </h3>
              {transactions.length === 0 ? (
                <p className="text-gray-500">تراکنشی ثبت نشده است.</p>
              ) : (
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
                        <td className="p-2">
                          {transaction.amount.toLocaleString()}
                        </td>
                        <td className="p-2">{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* مدال اضافه کردن تراکنش */}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTransaction}
        />
      )}
    </div>
  );
}
