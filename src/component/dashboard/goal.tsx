import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import { IGoal } from "../../interfaces/goal";
import GoalModal from "./goalModal";
import Cards from "./Cards";
import { DateObject } from "react-multi-date-picker";

function Goal() {
  const { user } = useUser();
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IGoal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // داده‌های نمونه برای تست UI
  useEffect(() => {
    setGoals([
      {
        id: "1",
        title: "خرید ماشین",
        targetAmount: 500000000,
        currentAmount: 100000000,
        deadline: new Date("2024-12-31"),
        userId: "user1",
        user: { id: "user1", name: "کاربر تست" },
      },
      {
        id: "2",
        title: "سفر اروپا",
        targetAmount: 30000000,
        currentAmount: 5000000,
        deadline: new Date("2025-06-30"),
        userId: "user1",
        user: { id: "user1", name: "کاربر تست" },
      },
    ]);
  }, []);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("توکن احراز هویت یافت نشد");
        const res = await axios.get<IGoal[]>("http://localhost:5000/api/goal", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(res.data);
        setSuccessMessage("اهداف با موفقیت بارگذاری شدند");
      } catch (err: any) {
        console.error("خطا در دریافت اهداف:", err.response?.data || err.message);
        setErrorMessage("خطا در دریافت اهداف: " + (err.response?.data?.message || err.message));
      }
    };
    fetchGoals;
  }, []);

  const addGoal = async (newGoal: IGoal) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("token not found");
      const res = await axios.post<IGoal>("http://localhost:5000/api/goal", newGoal, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals((prev) => [...prev, res.data]);
      setSuccessMessage("Goal added successfully");
    } catch (err: any) {
      console.error("Error adding goal:", err.response?.data || err.message);
      setErrorMessage("Failed to add goal: " + (err.response?.data?.message || err.message));
    }
  };

  const updateGoal = async (updatedGoal: IGoal) => {
    try {
      if (!updatedGoal.id) throw new Error("شناسه هدف نامعتبر است");
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("توکن احراز هویت یافت نشد");
      const res = await axios.put<IGoal>(`http://localhost:5000/api/goal/${updatedGoal.id}`, updatedGoal, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
      setGoals((prev) =>
        prev.map((goal) => (goal.id === updatedGoal.id ? res.data : goal))
      );
      setSuccessMessage("هدف با موفقیت به‌روزرسانی شد");
    } catch (err: any) {
      console.error("خطا در ویرایش هدف:", err.response?.data || err.message);
      setErrorMessage("خطا در به‌روزرسانی هدف: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      if (!goalId) throw new Error("شناسه هدف نامعتبر است");
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("توکن احراز هویت یافت نشد");
      await axios.delete(`http://localhost:5000/api/goal/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
      setShowDeleteConfirm(null);
      setSuccessMessage("هدف با موفقیت حذف شد");
    } catch (err: any) {
      console.error("خطا در حذف هدف:", err.response?.data || err.message);
      setErrorMessage("خطا در حذف هدف: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditGoal = (goal: IGoal) => {
    console.log("Editing goal:", goal); // دیباگ
    if (!goal.id) {
      setErrorMessage("شناسه هدف نامعتبر است");
      return;
    }
    setEditingGoal(goal);
    setShowModal(true);
  };

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const progressPercent = totalTargetAmount
    ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)
    : "0";

  return (
    <div className="flex-1 p-6 bg-gray-100" dir="rtl">
      {/* پیام‌های بازخورد */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 shadow-md animate-slideIn">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 100-16 8 8 0 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 shadow-md animate-slideIn">
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
          مدیریت اهداف مالی، {user?.name || "کاربر"}
        </h2>
        <div className="flex gap-3">
          <button
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 hover:scale-105 transition-all duration-200 text-sm font-semibold shadow-md"
            onClick={() => {
              console.log("Opening modal for new goal"); // دیباگ
              setEditingGoal(null);
              setShowModal(true);
            }}
          >
            هدف جدید
          </button>
          <Link
            to="/Dashboard"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 text-sm font-semibold shadow-md"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* خلاصه اهداف */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">خلاصه اهداف</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Cards
            title="مجموع هدف"
            amount={`${totalTargetAmount.toLocaleString()} تومان`}
            bgColor="bg-gradient-to-br from-blue-50 to-blue-200"
            textColor="text-blue-700"
            icon="/icons/target.svg"
            className="hover:scale-105 transition-all duration-200 shadow-md"
          />
          <Cards
            title="جمع‌آوری‌شده"
            amount={`${totalCurrentAmount.toLocaleString()} تومان`}
            bgColor="bg-gradient-to-br from-green-50 to-green-200"
            textColor="text-green-700"
            icon="/icons/saved.svg"
            className="hover:scale-105 transition-all duration-200 shadow-md"
          />
          <Cards
            title="درصد پیشرفت"
            amount={`${progressPercent}%`}
            bgColor="bg-gradient-to-br from-yellow-50 to-yellow-200"
            textColor="text-yellow-700"
            icon="/icons/progress.svg"
            className="hover:scale-105 transition-all duration-200 shadow-md"
          />
        </div>
      </div>

      {/* لیست اهداف */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">لیست اهداف</h3>
        {goals.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 0 000-20z"
              />
            </svg>
            <p className="text-sm">هیچ هدفی ثبت نشده است.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-3 font-semibold text-gray-700">عنوان</th>
                  <th className="p-3 font-semibold text-gray-700">هدف (تومان)</th>
                  <th className="p-3 font-semibold text-gray-700">جمع‌آوری‌شده</th>
                  <th className="p-3 font-semibold text-gray-700">مهلت</th>
                  <th className="p-3 font-semibold text-gray-700">پیشرفت</th>
                  <th className="p-3 font-semibold text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => {
                  const progress = goal.targetAmount
                    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                    : 0;
                  const isWarning = progress >= 80;
                  return (
                    <tr
                      key={goal.id || ''} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="p-3 flex items-center gap-2">
                        {goal.title}
                        {isWarning && <span className="text-green-600">✅</span>}
                      </td>
                      <td className="p-3">{goal.targetAmount.toLocaleString()}</td>
                      <td className="p-3">{goal.currentAmount.toLocaleString()}</td>
                      <td className="text-right p-3">
                        {typeof goal.deadline === "string" || goal.deadline instanceof DateObject
                          ? new DateObject(goal.deadline).format("YYYY-MM-DD")
                          : goal.deadline instanceof Date
                          ? new DateObject(goal.deadline).format("YYYY-MM-DD")
                          : ""}
                      </td>
                      <td className="p-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${isWarning ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-blue-500 to-blue-600"}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEditGoal(goal)}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          ویرایش
                        </button>
                        <button
                          onClick={() => {
                            console.log("Delete button clicked for goal ID:", goal.id); // دیباگ
                            setShowDeleteConfirm(goal.id);
                          }}
                          className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {/* مدال حذف هدف */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out"
          dir="rtl"
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-500 ease-in-out animate-slideUp"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">تأیید حذف</h3>
            <p className="text-gray-600 mb-6 text-sm">آیا مطمئن هستید که می‌خواهید این هدف را حذف کنید؟</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  console.log("Cancel delete modal"); // دیباگ
                  setShowDeleteConfirm(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  console.log("Confirm delete for goal ID:", showDeleteConfirm); // دیباگ
                  deleteGoal(showDeleteConfirm!);
                }}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مدال افزودن/ویرایش هدف */}
      {showModal && (
        <GoalModal
          onClose={() => {
            console.log("Closing goal modal"); // دیباگ
            setShowModal(false);
            setEditingGoal(null);
          }}
          addGoal={addGoal}
          updateGoal={updateGoal}
          editingGoal={editingGoal}
        />
      )}
    </div>
  );
};

export default Goal;