import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import Cards from "./Cards";
import { IGoal } from "../../interfaces/goal";
import GoalModal from "./goalModal";
function Goal() {
  const { user } = useUser();
  const [goals, setGoals] = useState<IGoal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<IGoal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get<IGoal[]>("http://localhost:5000/api/goal", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setGoals(res.data);
      } catch (err) {
        console.error("خطا در دریافت اهداف:", err);
      }
    };
    fetchGoals();
  }, []);

  const addGoal = async (newGoal: IGoal) => {
    try {
      const res = await axios.post<IGoal>(
        "http://localhost:5000/api/goal",
        newGoal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setGoals((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("خطا در افزودن هدف:", err);
    }
  };

  const updateGoal = async (updatedGoal: IGoal) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/goal/${updatedGoal.id}`,
        updatedGoal,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setGoals((prev) =>
        prev.map((g) => (g.id === updatedGoal.id ? (res.data as IGoal) : g))
      );
    } catch (err) {
      console.error("خطا در ویرایش هدف:", err);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/goal/${goalId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("خطا در حذف هدف:", err);
    }
  };

  const handleEditGoal = (goal: IGoal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const progressPercent = totalTargetAmount
    ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)
    : "0";

  return (
    <div className="flex-1 p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          مدیریت اهداف مالی، {user?.name || "کاربر"}
        </h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setEditingGoal(null);
              setShowModal(true);
            }}
          >
            هدف جدید
          </button>
          <Link
            to="/Dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* خلاصه اهداف */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          خلاصه اهداف
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Cards
            title="مجموع هدف"
            amount={`${totalTargetAmount.toLocaleString()} تومان`}
          />
          <Cards
            title="جمع‌آوری‌شده"
            amount={`${totalCurrentAmount.toLocaleString()} تومان`}
          />
          <Cards title="درصد پیشرفت" amount={`${progressPercent}%`} />
        </div>
      </div>

      {/* لیست اهداف */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text مخالف-gray-700 mb-4">
          لیست اهداف
        </h3>
        {goals.length === 0 ? (
          <p className="text-gray-500">هیچ هدفی ثبت نشده است.</p>
        ) : (
          <table className="w-full text-right">
            <thead>
              <tr className="border-b">
                <th className="p-2">عنوان</th>
                <th className="p-2">هدف (تومان)</th>
                <th className="p-2">جمع‌آوری‌شده</th>
                <th className="p-2">مهلت</th>
                <th className="p-2">پیشرفت</th>
                <th className="p-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => {
                const progress = goal.targetAmount
                  ? Math.min(
                      (goal.currentAmount / goal.targetAmount) * 100,
                      100
                    )
                  : 0;
                const isWarning = progress >= 80 ? "warning" : "safe";
                return (
                  <tr key={goal.id} className="border-b">
                    <td className="p-2 flex items-center gap-2">
                      {goal.title}
                      {isWarning && <span className="text-red-500">⚠️</span>}
                    </td>
                    <td className="p-2">
                      {goal.targetAmount.toLocaleString()}
                    </td>
                    <td className="p-2">
                      {goal.currentAmount.toLocaleString()}
                    </td>
                    <td className="p-2">
                      {typeof goal.deadline === "string"
                        ? new Date(goal.deadline).toLocaleDateString("fa-IR")
                        : goal.deadline instanceof Date
                        ? goal.deadline.toLocaleDateString("fa-IR")
                        : ""}
                    </td>
                    <td className="p-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            isWarning ? "bg-red-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(goal.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* مدال حذف هدف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">تأیید حذف</h3>
            <p className="text-gray-600 mb-4">
              آیا مطمئن هستید که می‌خواهید این هدف را حذف کنید؟
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                انصراف
              </button>
              <button
                onClick={() => deleteGoal(showDeleteConfirm)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
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
}

export default Goal;
