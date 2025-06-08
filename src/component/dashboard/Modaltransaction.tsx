import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import axios from "axios";
import { ICategory } from "../../interfaces/category";


interface ModalProps {
  onClose: () => void;
  addTransaction: (transaction: {
    date: string;
    payee: string;
    category: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
  }) => void;
}

export default function Modal({ onClose, addTransaction }: ModalProps) {
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    "EXPENSE"
  );

  const [newTransaction, setNewTransaction] = useState<{
    date: DateObject;
    payee: string;
    category: string;
    amount: string | number;
  }>({
    date: new DateObject(),
    payee: "",
    category: "",
    amount: "",
  });

  const [formErrors, setFormErrors] = useState<{
    payee?: string;
    amount?: string;
    category?: string;
  }>({});

  const [categories, setCategories] = useState<ICategory[]>([])
  
   const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCategories(res.data)

    } catch (error) {
      console.error("خطا:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);



 const handleSubmit = async () => {
  const errors: { payee?: string; amount?: string; category?: string } = {};

  const amount = Number(newTransaction.amount);

  if (!newTransaction.payee) errors.payee = "پرداخت‌کننده را وارد کنید";
  if (isNaN(amount) || amount <= 0) errors.amount = "مبلغ معتبر وارد کنید";
  if (!newTransaction.category) errors.category = "دسته‌بندی را انتخاب کنید";

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  const formatted = {
    ...newTransaction,
    amount,
    date: newTransaction.date?.format("YYYY-MM-DD"),
    type: transactionType,
  };

  try {
    await axios.post("http://localhost:5000/api/transactions", formatted, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    // اگر موفق بود، به state لوکال هم اضافه کن
    addTransaction(formatted);
    onClose();
  } catch (error) {
    console.error("خطا در ثبت تراکنش:", error);
    // اینجا می‌تونی پیام خطا نشون بدی یا مدیریت دیگه‌ای انجام بدی
  }
};


  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6 space-y-4 text-right">
        <h3 className="text-xl font-bold">تراکنش جدید</h3>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-2">
          <button
            onClick={() => setTransactionType("INCOME")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              transactionType === "INCOME"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            درآمد
          </button>
          <button
            onClick={() => setTransactionType("EXPENSE")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              transactionType === "EXPENSE"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            هزینه
          </button>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm mb-1">تاریخ</label>
          <DatePicker
            value={newTransaction.date}
            onChange={(date) =>
              setNewTransaction({ ...newTransaction, date: date as DateObject })
            }
            calendar={persian}
            locale={persian_fa}
            inputClass="w-full border rounded p-2 text-right"
            format="YYYY/MM/DD"
          />
        </div>

        {/* Payee */}
        <div>
          <label className="block text-sm mb-1">
            {transactionType === "INCOME" ? "پرداخت‌کننده" : "هزینه بابت"}
          </label>
          <input
            type="text"
            value={newTransaction.payee}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, payee: e.target.value })
            }
            className="w-full border rounded p-2 text-right"
          />
          {formErrors.payee && (
            <p className="text-red-500 text-sm">{formErrors.payee}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm mb-1">دسته‌بندی</label>
          <select
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
            className="w-full border rounded p-2 text-right"
          >
            <option value="">-- انتخاب کنید --</option>
            {categories.filter(cat => cat.type === transactionType).map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <p className="text-red-500 text-sm">{formErrors.category}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm mb-1">مبلغ</label>
          <input
            type="number"
            min="0"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                amount: e.target.value,
              })
            }
            className="w-full border rounded p-2"
          />
          {formErrors.amount && (
            <p className="text-red-500 text-sm">{formErrors.amount}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
}
