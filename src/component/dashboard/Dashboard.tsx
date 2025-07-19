import { useState, useEffect } from "react";
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
import Modal from "./Modaltransaction";
import { useUser } from "../../contexts/userContext";
import { ITransaction } from "../../interfaces/transaction";

const chartData = [
  { name: "فروردین", INCOME: 4000, EXPENSE: 2400 },
  { name: "اردیبهشت", INCOME: 3000, EXPENSE: 1398 },
  { name: "خرداد", INCOME: 2000, EXPENSE: 9800 },
  { name: "تیر", INCOME: 2780, EXPENSE: 3908 },
];

const Card = ({
  title,
  amount,
  bgColor,
  textColor,
}: {
  title: string;
  amount: string;
  bgColor: string;
  textColor: string;
}) => (
  <div
    className={`rounded-2xl p-4 shadow flex flex-col justify-between ${bgColor} ${textColor}`}
  >
    <h4 className="text-sm font-semibold">{title}</h4>
    <p className="text-lg font-bold whitespace-nowrap">{amount}</p>
  </div>
);

export default function Dashboard() {
  const { user, setUser } = useUser();
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
        setUser({
          name: data.name,
          id: data.id,
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        console.error("خطا:", err);
        setUser({
          name: "کاربر ناشناس",
          id: 0,
          email: "",
          password: "",
        });
      }
    };

    fetchUser();
  }, [setUser]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get<ITransaction[]>(
        "http://localhost:5000/api/transaction",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setTransactions(res.data);
    } catch (error) {
      console.error("خطا در گرفتن تراکنش‌ها:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const budget = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            خوش آمدید، {user?.name || "کاربر"}
          </h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            + تراکنش جدید
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card
            title="درآمدها"
            amount={`${totalIncome.toLocaleString()} تومان`}
            bgColor="bg-green-100"
            textColor="text-green-700"
          />
          <Card
            title="هزینه‌ها"
            amount={`${totalExpense.toLocaleString()} تومان`}
            bgColor="bg-red-100"
            textColor="text-red-700"
          />
          <Card
            title="بودجه"
            amount={`${budget.toLocaleString()} تومان`}
            bgColor="bg-yellow-100"
            textColor="text-yellow-700"
          />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            روند درآمد و هزینه
          </h3>
          <LineChart width={800} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="INCOME"
              stroke="#16a34a"
              name="درآمد"
            />
            <Line
              type="monotone"
              dataKey="EXPENSE"
              stroke="#dc2626"
              name="هزینه"
            />
          </LineChart>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            تراکنش‌های اخیر
          </h3>
          {transactions.length === 0 ? (
            <p className="text-gray-500">تراکنشی ثبت نشده است.</p>
          ) : (
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="bg-gray-100 border-b text-gray-600">
                  <th className="p-2 font-medium">دسته‌بندی</th>
                  <th className="p-2 font-medium">مبلغ (تومان)</th>
                  <th className="p-2 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {[...transactions]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 10)
                  .map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2">{transaction.category.name}</td>
                      <td
                        className={`p-2 font-semibold ${
                          transaction.type === "INCOME"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {transaction.amount.toLocaleString()}
                      </td>
                      <td className="p-2">
                        {typeof transaction.date === "string"
                          ? new Date(transaction.date).toLocaleDateString(
                              "fa-IR"
                            )
                          : transaction.date instanceof Date
                          ? transaction.date.toLocaleDateString()
                          : ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
}
