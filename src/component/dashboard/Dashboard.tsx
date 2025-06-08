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
import { useUser } from "../../contexts/userContext";
import { ITransaction } from "../../interfaces/transaction";



const chartData = [
  { name: "فروردین", INCOME: 4000, EXPENSE: 2400 },
  { name: "اردیبهشت", INCOME: 3000, EXPENSE: 1398 },
  { name: "خرداد", INCOME: 2000, EXPENSE: 9800 },
  { name: "تیر", INCOME: 2780, EXPENSE: 3908 },
];
const dashboardItems = [
  { title: "داشبورد", path: "/Dashboard" },
  { title: "تراکنش‌ها", path: "/transactions" },
  { title: "گزارش‌ها", path: "/reports" },
  { title: "بودجه", path: "/budget" },
  { title: "خروج", path: "/" },
];

export default function Dashboard() {
  const {user, setUser, logout} = useUser();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات کاربر");
        const data = await res.json();
        console.log("داده‌های کاربر:", data);
        setUser({ name: data.name, id: data.id, email: data.email, password:data.password });
      } catch (err) {
        console.error("خطا:", err);
        // داخل پرانتز
        setUser({
          name: "کاربر ناشناس",
          id: 0,
          email: "",
          password: ""
        });

      }
    };

    fetchUser();
  }, [setUser]);


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
    // date: string;
    payee: string;
    category: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
  }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/transaction",
        {
          title: transaction.payee,
          amount: transaction.amount,
          type: transaction.type.toUpperCase(),
          categoryId: parseInt(transaction.category),
          // date: transaction.date,
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
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
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
                  onClick={item.title === "خروج" ? logout : undefined}
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
            <h2 className="text-2xl font-bold">خوش آمدید، {user?.name || "کاربر"}</h2>
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
                dataKey="INCOME"
                stroke="#10B981"
                name="درآمد"
              />
              <Line
                type="monotone"
                dataKey="EXPENSE"
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
          addTransaction={handleAddTransaction}
        />
      )}
    </div>
  );
}
