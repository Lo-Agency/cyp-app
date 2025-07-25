import { useUser } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import BudgetModal from "./budgetModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { ITransaction } from "../../interfaces/transaction";
import { BudgetPeriod, IBudget } from "../../interfaces/budget";
import Cards from "./Cards";

function Budget() {
  const { user, setUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<"all" | BudgetPeriod>("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // دریافت اطلاعات کاربر
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!res.ok) throw new Error(`خطا در دریافت اطلاعات کاربر: ${res.status}`);
        const data = await res.json();
        setUser({
          name: data.name,
          id: data.id,
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        console.error("خطا در دریافت کاربر:", err);
        setUser({
          name: "کاربر ناشناس",
          id: "",
          email: "",
          password: "",
        });
      }
    };
    fetchUser();
  }, [setUser]);

  // دریافت تراکنش‌ها
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
    } catch (error: any) {
      console.error("خطا در گرفتن تراکنش‌ها:", error.response?.data || error.message);
      setErrorMessage("خطا در دریافت تراکنش‌ها: " + (error.response?.data?.message || error.message));
    }
  };

  // دریافت بودجه‌ها
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("توکن احراز هویت یافت نشد");
        const res = await axios.get<IBudget[]>("http://localhost:5000/api/budget", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Budgets fetched:", res.data); // دیباگ
        setBudgets(res.data.map(budget => ({
          ...budget,
          spent: calculateSpent(budget),
        })));
      } catch (err: any) {
        console.error("خطا در دریافت بودجه‌ها:", err.response?.data || err.message);
        setErrorMessage("خطا در دریافت بودجه‌ها: " + (err.response?.data?.message || err.message));
      }
    };
    fetchBudgets();
    fetchTransactions();
  }, []);

  // محاسبه مقدار خرج‌شده
  const calculateSpent = (budget: IBudget) => {
    const now = new Date();
    const isSamePeriod = (date: string | Date) => {
      const txDate = typeof date === "string" ? new Date(date) : date;
      if (budget.period === BudgetPeriod.Monthly) {
        return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
      } else if (budget.period === BudgetPeriod.Weekly) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return txDate >= weekStart && txDate <= weekEnd;
      } else if (budget.period === BudgetPeriod.Yearly) {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true;
    };

    return transactions
      .filter((t) => t.type === "EXPENSE" && t.categoryId === budget.categoryId && isSamePeriod(t.date))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // محاسبات کل
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = totalIncome - totalExpense;
  const totalMonthlyBudget = budgets
    .filter((b) => b.period === BudgetPeriod.Monthly || filterPeriod === "all")
    .reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets
    .filter((b) => b.period === BudgetPeriod.Monthly || filterPeriod === "all")
    .reduce((sum, b) => sum + calculateSpent(b), 0);
  const percent = totalMonthlyBudget ? ((totalSpent / totalMonthlyBudget) * 100).toFixed(1) : "0";

  // افزودن بودجه جدید
  const addBudget = async (newBudget: IBudget) => {
    try {
      console.log("Sending new budget to API:", newBudget); // دیباگ
      const budgetToSend = {
        amount: newBudget.amount,
        categoryId: newBudget.categoryId,
        spent: newBudget.spent || 0,
        period: newBudget.period,
      };
      const res = await axios.post<IBudget>("http://localhost:5000/api/budget", budgetToSend, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setBudgets((prev) => [...prev, { ...res.data, spent: calculateSpent(res.data), category: newBudget.category }]);
      setSuccessMessage("بودجه با موفقیت اضافه شد");
      fetchTransactions();
    } catch (err: any) {
      console.error("خطا در افزودن بودجه:", err.response?.data || err.message);
      setErrorMessage("خطا در افزودن بودجه: " + (err.response?.data?.message || err.message));
    }
  };

  // به‌روزرسانی بودجه
  const updateBudget = async (updatedBudget: IBudget) => {
    try {
      if (!updatedBudget.id) throw new Error("شناسه بودجه یافت نشد");
      console.log("Sending updated budget to API:", updatedBudget); // دیباگ
      const budgetToSend = {
        amount: updatedBudget.amount,
        categoryId: updatedBudget.categoryId,
        spent: updatedBudget.spent || 0,
        period: updatedBudget.period,
      };
      const res = await axios.put<IBudget>(
        `http://localhost:5000/api/budget/${updatedBudget.id}`,
        budgetToSend,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      setBudgets((prev) =>
        prev.map((b) => (b.id === updatedBudget.id ? { ...res.data, spent: calculateSpent(res.data), category: updatedBudget.category } : b))
      );
      setSuccessMessage("بودجه با موفقیت به‌روزرسانی شد");
    } catch (err: any) {
      console.error("خطا در ویرایش بودجه:", err.response?.data || err.message);
      setErrorMessage("خطا در به‌روزرسانی بودجه: " + (err.response?.data?.message || err.message));
    }
  };

  // حذف بودجه
  const deleteBudget = async (budgetId: string) => {
    try {
      if (!budgetId) throw new Error("شناسه بودجه نامعتبر است");
      console.log("Deleting budget ID:", budgetId); // دیباگ
      const res = await axios.delete(`http://localhost:5000/api/budget/${budgetId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      console.log("Delete response:", res.data); // دیباگ
      setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
      setShowDeleteConfirm(null);
      setIsDeleteModalOpen(false);
      setSuccessMessage("بودجه با موفقیت حذف شد");
    } catch (err: any) {
      console.error("خطا در حذف بودجه:", err.response?.data || err.message);
      setErrorMessage("خطا در حذف بودجه: " + (err.response?.data?.message || err.message));
    }
  };

  // هندلر ویرایش
  const handleEditBudget = (budget: IBudget) => {
    console.log("Editing budget:", budget); // دیباگ
    if (!budget.id) {
      setErrorMessage("شناسه بودجه نامعتبر است");
      return;
    }
    setEditingBudget(budget);
    setShowModal(true);
  };

  // فیلتر بودجه‌ها
  const filteredBudgets = filterPeriod === "all" ? budgets : budgets.filter((b) => b.period === filterPeriod);

  return (
    <div className="flex-1 p-6 bg-gray-100" dir="rtl">
      {/* پیام‌های بازخورد */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          مدیریت بودجه، {user?.name || "کاربر"}
        </h2>
        <div className="flex gap-3">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-semibold"
            onClick={() => {
              console.log("Opening modal for new budget"); // دیباگ
              setEditingBudget(null);
              setShowModal(true);
            }}
          >
            بودجه‌بندی جدید
          </button>
          <Link
            to="/Dashboard"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 text-sm font-semibold"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* خلاصه بودجه */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">خلاصه بودجه</h3>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as BudgetPeriod | "all")}
            className="w-full sm:w-48 border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          >
            <option value="all">همه بازه‌ها</option>
            <option value="monthly">ماهانه</option>
            <option value="weekly">هفتگی</option>
            <option value="yearly">سالانه</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Cards
            title="درآمد کل"
            amount={`${totalIncome.toLocaleString()} تومان`}
            bgColor="bg-green-50"
            textColor="text-green-700"
            icon="/icons/income.svg"
          />
          <Cards
            title="هزینه کل"
            amount={`${totalExpense.toLocaleString()} تومان`}
            bgColor="bg-red-50"
            textColor="text-red-700"
            icon="/icons/expense.svg"
          />
          <Cards
            title="بودجه باقی‌مانده"
            amount={`${remainingBudget.toLocaleString()} تومان`}
            bgColor="bg-blue-50"
            textColor="text-blue-700"
            icon="/icons/budget.svg"
          />
          <Cards
            title="درصد خرج‌شده"
            amount={`${percent}%`}
            bgColor="bg-yellow-50"
            textColor="text-yellow-700"
            icon="/icons/percent.svg"
          />
        </div>
      </div>

      {/* لیست بودجه‌ها */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">لیست بودجه‌بندی‌ها</h3>
        {filteredBudgets.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 0 000-20z"
              />
            </svg>
            <p className="text-sm">هیچ بودجه‌ای ثبت نشده است.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-3 font-semibold text-gray-700">دسته‌بندی</th>
                  <th className="p-3 font-semibold text-gray-700">بودجه (تومان)</th>
                  <th className="p-3 font-semibold text-gray-700">خرج شده</th>
                  <th className="p-3 font-semibold text-gray-700">پیشرفت</th>
                  <th className="p-3 font-semibold text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((budget) => {
                  const spent = budget.spent || 0;
                  const progress = budget.amount ? Math.min((spent / budget.amount) * 100, 100) : 0;
                  const isWarning = progress >= 80;

                  return (
                    <tr
                      key={budget.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="p-3 flex items-center gap-2">
                        {budget.category?.name || "نامشخص"}
                        {isWarning && <span className="text-red-600">⚠️</span>}
                      </td>
                      <td className="p-3">{budget.amount.toLocaleString()}</td>
                      <td className="p-3">{spent.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${isWarning ? "bg-red-600" : "bg-blue-600"}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEditBudget(budget)}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200 text-sm font-medium"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => {
                            console.log("Delete button clicked for budget ID:", budget.id); // دیباگ
                            setShowDeleteConfirm(budget.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200 text-sm font-medium"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* مدال تأیید حذف */}
      {showDeleteConfirm && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out ${isDeleteModalOpen ? "opacity-100" : "opacity-0"}`}
          dir="rtl"
        >
          <div
            className={`bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-500 ease-in-out ${isDeleteModalOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">تأیید حذف</h3>
            <p className="text-gray-600 mb-6 text-sm">آیا مطمئن هستید که می‌خواهید این بودجه را حذف کنید؟</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  console.log("Cancel delete modal"); // دیباگ
                  setShowDeleteConfirm(null);
                  setIsDeleteModalOpen(false);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  console.log("Confirm delete for budget ID:", showDeleteConfirm); // دیباگ
                  deleteBudget(showDeleteConfirm!);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مدال افزودن/ویرایش بودجه */}
      {showModal && (
        <BudgetModal
          onClose={() => {
            console.log("Closing budget modal"); // دیباگ
            setShowModal(false);
            setEditingBudget(null);
          }}
          addBudget={addBudget}
          updateBudget={updateBudget}
          editingBudget={editingBudget}
        />
      )}
    </div>
  );
}

export default Budget;