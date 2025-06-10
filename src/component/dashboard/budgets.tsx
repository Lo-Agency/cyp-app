import { useUser } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import BudgetModal from "./budgetModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { ITransaction } from "../../interfaces/transaction";
import { IBudget } from "../../interfaces/budget";
import Cards from "./Cards";

function Budget() {
  const { user, setUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
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
      }
      catch (err) {
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

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/budget", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setBudgets(res.data);
      } catch (err) {
        console.error("خطا در دریافت بودجه‌ها:", err);
      }
    };
    fetchBudgets();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = totalIncome - totalExpense
  // حساب کردن ماهانه
  const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const percent = totalMonthlyBudget
    ? ((totalSpent / totalMonthlyBudget) * 100).toFixed(1)
    : "0";
  // اضافه کردن
  const addBudget = async (newBudget: IBudget) => {
    try {
      const res = await axios.post("http://localhost:5000/api/budget", newBudget, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setBudgets((prev) => [...prev, res.data]);
      fetchTransactions();
    }
    catch (err) {
      console.error("خطا در افزودن بودجه:", err);
    }

  }

  //   اپدیت 
  const updateBudget = async (updatedBudget: IBudget) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/budget/${updatedBudget.id}`,
        updatedBudget,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      setBudgets((prev) =>
        prev.map((b) => (b.id === updatedBudget.id ? res.data : b))
      );
    } catch (err) {
      console.error("خطا در ویرایش بودجه:", err);
    }
  };

  const handleEditBudget = (budget: IBudget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  return (
    <div className="flex-1 p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">مدیریت بودجه، {user?.name || "کاربر"}</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setEditingBudget(null);
              setShowModal(true);
            }}
          >
            افزودن بودجه جدید
          </button>
          <Link
            to="/Dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* خلاصه بودجه */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">خلاصه بودجه</h3>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Cards title="درآمد کل" amount={`${totalIncome.toLocaleString()} تومان`} />
            <Cards title="هزینه کل" amount={`${totalExpense.toLocaleString()} تومان`} />
            <Cards title="بودجه باقی‌مانده" amount={`${remainingBudget.toLocaleString()} تومان`} />
            <Cards title="درصد خرج‌شده" amount={`${percent}%`} />
          </div>
        </div>
      </div>

      {/* لیست بودجه‌ها */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">لیست بودجه‌ها</h3>
        {budgets.length === 0 ? (
          <p className="text-gray-500">هیچ بودجه‌ای ثبت نشده است.</p>
        ) : (
          <table className="w-full text-right">
            <thead>
              <tr className="border-b">
                <th className="p-2">دسته‌بندی</th>
                <th className="p-2">بودجه (تومان)</th>
                <th className="p-2">خرج‌شده</th>
                <th className="p-2">پیشرفت</th>
                <th className="p-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => {
                const spent = budget.spent || 0;
                const progress = budget.amount ? Math.min((spent / budget.amount) * 100, 100) : 0;
                const isWarning = progress >= 80;

                return (
                  <tr key={budget.id} className="border-b">
                    <td className="p-2 flex items-center gap-2">
                      {budget.category?.name || "نامشخص"}
                      {isWarning && <span className="text-red-500">⚠️</span>}
                    </td>
                    <td className="p-2">{budget.amount.toLocaleString()}</td>
                    <td className="p-2">{spent.toLocaleString()}</td>
                    <td className="p-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${isWarning ? "bg-red-500" : "bg-blue-500"
                            }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEditBudget(budget)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ویرایش
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* مدال افزودن/ویرایش بودجه */}
      {showModal && (
        <BudgetModal
          onClose={() => {
            setShowModal(false);
            setEditingBudget(null);
          }}
          addBudget={addBudget}
          updateBudget={updateBudget}
          editingBudget={editingBudget}
        />
      )}
    </div>
  )
};
export default Budget;