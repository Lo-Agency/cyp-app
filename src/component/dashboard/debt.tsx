import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/userContext";
import { Link } from "react-router-dom";
import { IDebt } from "../../interfaces/debt";
import DebtModal from "./debtModal";

function Debt() {
  const { user, setUser } = useUser();
  const [debts, setDebts] = useState<IDebt[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState<IDebt | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // داده‌های نمونه برای تست UI
  useEffect(() => {
    setDebts([
      {
        id: "1",
        title: "وام مسکن",
        creditor: "بانک ملی",
        amount: 100000000,
        paidAmount: 20000000,
        remainingAmount: 80000000,
        interestRate: 4,
        dueDate: new Date("2025-12-31"),
        userId: "user1",
        user: { id: "user1", name: "کاربر تست" },
        isDueSoon: true,
      },
      {
        id: "2",
        title: "قرض شخصی",
        creditor: "علی حسینی",
        amount: 5000000,
        paidAmount: 1000000,
        remainingAmount: 4000000,
        interestRate: 0,
        dueDate: new Date("2025-08-15"),
        userId: "user1",
        user: { id: "user1", name: "کاربر تست" },
        isDueSoon: false,
      },
    ]);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        if (!res.ok) throw new Error(`خطا در دریافت اطلاعات کاربر: ${res.status}`);
        const data = await res.json();
        setUser({
          name: data.name,
          id: String(data.id),
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

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("توکن احراز هویت یافت نشد");
        const res = await axios.get<IDebt[]>("http://localhost:5000/api/debt", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDebts(res.data);
        setSuccessMessage("بدهی‌ها با موفقیت بارگذاری شدند");
      } catch (err: any) {
        console.error("خطا در دریافت بدهی‌ها:", err.response?.data || err.message);
        setErrorMessage("خطا در دریافت بدهی‌ها: " + (err.response?.data?.message || err.message));
      }
    };
    fetchDebts;
  }, []);

  const addDebt = async (newDebt: IDebt) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("توکن احراز هویت یافت نشد");
      const res = await axios.post<IDebt>("http://localhost:5000/api/debt", newDebt, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebts((prev) => [...prev, res.data]);
      setSuccessMessage("بدهی با موفقیت اضافه شد");
    } catch (err: any) {
      console.error("خطا در افزودن بدهی:", err.response?.data || err.message);
      setErrorMessage("خطا در افزودن بدهی: " + (err.response?.data?.message || err.message));
    }
  };

  const updateDebt = async (updatedDebt: IDebt) => {
    try {
      if (!updatedDebt.id) throw new Error("شناسه بدهی نامعتبر است");
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("توکن احراز هویت یافت نشد");
      const res = await axios.put<IDebt>(`http://localhost:5000/api/debt/${updatedDebt.id}`, updatedDebt, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebts((prev) => prev.map((d) => (d.id === updatedDebt.id ? res.data : d)));
      setSuccessMessage("بدهی با موفقیت به‌روزرسانی شد");
    } catch (err: any) {
      console.error("خطا در ویرایش بدهی:", err.response?.data || err.message);
      setErrorMessage("خطا در به‌روزرسانی بدهی: " + (err.response?.data?.message || err.message));
    }
  };

  const payDebtInstallment = async (debtId: string, paymentAmount: number) => {
    try {
      if (!debtId || paymentAmount <= 0) throw new Error("مقدار یا شناسه نامعتبر است");
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("توکن احراز هویت یافت نشد");
      const res = await axios.post<IDebt>(`http://localhost:5000/api/debt/${debtId}/pay`, { paymentAmount }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebts((prev) => prev.map((d) => (d.id === debtId ? res.data : d)));
      setShowPaymentModal(null);
      setPaymentAmount(0);
      setSuccessMessage("پرداخت قسط با موفقیت ثبت شد");
    } catch (err: any) {
      console.error("خطا در پرداخت قسط:", err.response?.data || err.message);
      setErrorMessage("خطا در پرداخت قسط: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteDebt = async (debtId: string) => {
    try {
      if (!debtId) throw new Error("شناسه بدهی نامعتبر است");
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("توکن احراز هویت یافت نشد");
      await axios.delete(`http://localhost:5000/api/debt/${debtId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebts((prev) => prev.filter((d) => d.id !== debtId));
      setShowDeleteConfirm(null);
      setSuccessMessage("بدهی با موفقیت حذف شد");
    } catch (err: any) {
      console.error("خطا در حذف بدهی:", err.response?.data || err.message);
      setErrorMessage("خطا در حذف بدهی: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditDebt = (debt: IDebt) => {
    console.log("Editing debt:", debt); // دیباگ
    if (!debt.id) {
      setErrorMessage("شناسه بدهی نامعتبر است");
      return;
    }
    setEditingDebt(debt);
    setShowModal(true);
  };

  const handlePayment = (debtId: string) => {
    console.log("Opening payment modal for debt ID:", debtId); // دیباگ
    setShowPaymentModal(debtId);
  };

  return (
    <div className="flex-1 p-6 bg-gray-100" dir="rtl">
      {/* پیام‌های بازخورد */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 shadow-md animate-slideIn">
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
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 shadow-md animate-slideIn">
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
          مدیریت بدهی‌ها، {user?.name || "کاربر"}
        </h2>
        <div className="flex gap-3">
          <button
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 text-sm font-semibold shadow-md"
            onClick={() => {
              console.log("Opening modal for new debt"); // دیباگ
              setEditingDebt(null);
              setShowModal(true);
            }}
          >
            ثبت بدهی جدید
          </button>
          <Link
            to="/Dashboard"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 text-sm font-semibold shadow-md"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* لیست بدهی‌ها */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">لیست بدهی‌ها</h3>
        {debts.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 0 000-20z"
              />
            </svg>
            <p className="text-sm">هیچ بدهی‌ای ثبت نشده است.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="p-3 font-semibold text-gray-700">به چه کسی</th>
                  <th className="p-3 font-semibold text-gray-700">مبلغ کل</th>
                  <th className="p-3 font-semibold text-gray-700">مبلغ باقی‌مانده</th>
                  <th className="p-3 font-semibold text-gray-700">تاریخ سررسید</th>
                  <th className="p-3 font-semibold text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {debts.map((debt) => {
                  const isDueSoon = debt.isDueSoon;
                  return (
                    <tr
                      key={debt.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="p-3 flex items-center gap-2">
                        {debt.creditor}
                        {isDueSoon && <span className="text-red-600">⚠️</span>}
                      </td>
                      <td className="p-3">{debt.amount.toLocaleString()} تومان</td>
                      <td className="p-3">{debt.remainingAmount.toLocaleString()} تومان</td>
                      <td className="p-3">
                        {typeof debt.dueDate === "string"
                          ? new Date(debt.dueDate).toLocaleDateString("fa-IR")
                          : debt.dueDate instanceof Date
                          ? debt.dueDate.toLocaleDateString("fa-IR")
                          : ""}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEditDebt(debt)}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          ویرایش
                        </button>
                        <button
                          onClick={() => handlePayment(debt.id)}
                          className="text-green-600 hover:text-green-800 hover:scale-110 transition-all duration-200 text-sm font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2m-4 2h18m-2 4H5a2 2 0 01-2-2v-2a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2z" />
                          </svg>
                          پرداخت قسط
                        </button>
                        <button
                          onClick={() => {
                            console.log("Delete button clicked for debt ID:", debt.id); // دیباگ
                            setShowDeleteConfirm(debt.id);
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

      {/* مدال حذف بدهی */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out"
          dir="rtl"
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-500 ease-in-out animate-slideUp"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">تأیید حذف</h3>
            <p className="text-gray-600 mb-6 text-sm">آیا مطمئن هستید که می‌خواهید این بدهی را حذف کنید؟</p>
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
                  console.log("Confirm delete for debt ID:", showDeleteConfirm); // دیباگ
                  deleteDebt(showDeleteConfirm!);
                }}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مدال پرداخت قسط */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out"
          dir="rtl"
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-500 ease-in-out animate-slideUp"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">پرداخت قسط</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ پرداخت (تومان)</label>
              <input
                type="number"
                min="1"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  console.log("Cancel payment modal"); // دیباگ
                  setShowPaymentModal(null);
                  setPaymentAmount(0);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  console.log("Confirm payment for debt ID:", showPaymentModal, "Amount:", paymentAmount); // دیباگ
                  payDebtInstallment(showPaymentModal!, paymentAmount);
                }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-200 text-sm font-semibold"
              >
                ثبت پرداخت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مدال افزودن/ویرایش بدهی */}
      {showModal && (
        <DebtModal
          onClose={() => {
            console.log("Closing debt modal"); // دیباگ
            setShowModal(false);
            setEditingDebt(null);
          }}
          addDebt={addDebt}
          updateDebt={updateDebt}
          editingDebt={editingDebt}
        />
      )}
    </div>
  );
}

export default Debt;