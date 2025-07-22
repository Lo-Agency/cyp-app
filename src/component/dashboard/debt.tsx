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
          id: String(data.id),
          email: data.email,
          password: data.password,
        });
      }
      catch (err) {
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
        const res = await axios.get<IDebt[]>("http://localhost:5000/api/debt", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setDebts(res.data);
      } catch (err) {
        console.error("خطا در دریافت بدهی‌ها:", err);
      }
    };
    fetchDebts();
  }, []);

  const addDebt = async (newDebt: IDebt) => {
    try {
      const res = await axios.post<IDebt>("http://localhost:5000/api/debt", newDebt, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      console.log("Response from server:", res.data);
      setDebts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("خطا در افزودن بدهی:", err);
    }
  };

  const updateDebt = async (updatedDebt: IDebt) => {
    try {
      const res = await axios.put<IDebt>(
        `http://localhost:5000/api/debt/${updatedDebt.id}`,
        updatedDebt,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      setDebts((prev) => prev.map((d) => (d.id === updatedDebt.id ? res.data : d)));
    } catch (err) {
      console.error("خطا در ویرایش بدهی:", err);
    }
  };

  const payDebtInstallment = async (debtId: string, paymentAmount: number) => {
    try {
      const res = await axios.post<IDebt>(
        `http://localhost:5000/api/debt/${debtId}/pay`,
        { paymentAmount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      setDebts((prev) => prev.map((d) => (d.id === debtId ? res.data : d)));
      setShowPaymentModal(null);
      setPaymentAmount(0);
    } catch (err) {
      console.error("خطا در پرداخت قسط:", err);
    }
  };

  const deleteDebt = async (debtId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/debt/${debtId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setDebts((prev) => prev.filter((d) => d.id !== debtId));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("خطا در حذف بدهی:", err);
    }
  };

  const handleEditDebt = (debt: IDebt) => {
    setEditingDebt(debt);
    setShowModal(true);
  };

  const handlePayment = (debtId: string) => {
    setShowPaymentModal(debtId);
  };

  return (
    <div className="flex-1 p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">مدیریت بدهی‌ها، {user?.name || "کاربر"}</h2>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              setEditingDebt(null);
              setShowModal(true);
            }}
          >
            ثبت بدهی جدید
          </button>
          <Link
            to="/Dashboard"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* لیست بدهی‌ها */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">لیست بدهی‌ها</h3>
        {debts.length === 0 ? (
          <p className="text-gray-500">هیچ بدهی‌ای ثبت نشده است.</p>
        ) : (
          <table className="w-full text-right">
            <thead>
              <tr className="border-b">
                <th className="p-2">به چه کسی</th>
                <th className="p-2">مبلغ کل</th>
                <th className="p-2">مبلغ باقی‌مانده</th>
                <th className="p-2">تاریخ سررسید</th>
                <th className="p-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt) => {
                const isDueSoon = debt.isDueSoon;
                return (
                  <tr key={debt.id} className="border-b">
                    <td className="p-2 flex items-center gap-2">
                      {debt.creditor}
                      {isDueSoon && <span className="text-red-500">⚠️</span>}
                    </td>
                    <td className="p-2">{debt.amount.toLocaleString()} تومان</td>
                    <td className="p-2">{debt.remainingAmount.toLocaleString()} تومان</td>
                    <td className="p-2">
                      {typeof debt.dueDate === "string"
                        ? new Date(debt.dueDate).toLocaleDateString("fa-IR")
                        : debt.dueDate instanceof Date
                        ? debt.dueDate.toLocaleDateString("fa-IR")
                        : ""}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEditDebt(debt)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handlePayment(debt.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        پرداخت قسط
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(debt.id)}
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

      {/* مدال حذف بدهی */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">تأیید حذف</h3>
            <p className="text-gray-600 mb-4">آیا مطمئن هستید که می‌خواهید این بدهی را حذف کنید؟</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                انصراف
              </button>
              <button
                onClick={() => deleteDebt(showDeleteConfirm)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مدال پرداخت قسط */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">پرداخت قسط</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ پرداخت (تومان)</label>
              <input
                type="number"
                min="1"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPaymentModal(null);
                  setPaymentAmount(0);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                انصراف
              </button>
              <button
                onClick={() => payDebtInstallment(showPaymentModal, paymentAmount)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
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