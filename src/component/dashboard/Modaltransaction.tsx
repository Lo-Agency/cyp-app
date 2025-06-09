import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import axios from "axios";
import { ICategory } from "../../interfaces/category";

interface ModalProps {
  onClose: () => void;
}

export default function Modal({ onClose }: ModalProps) {
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    "EXPENSE"
  );

  const [newTransaction, setNewTransaction] = useState<{
    date: DateObject;
    title: string;
    category: string;
    amount: string | number;
  }>({
    date: new DateObject(),
    title: "",
    category: "",
    amount: "",
  });

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    amount?: string;
    category?: string;
  }>({});

  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCategories(res.data as ICategory[]);
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    console.log("test");
    const errors: { title?: string; amount?: string; category?: string } = {};

    const amount = Number(newTransaction.amount);

    if (!newTransaction.title) errors.title = "پرداخت‌کننده را وارد کنید";
    if (isNaN(amount) || amount <= 0) errors.amount = "مبلغ معتبر وارد کنید";
    if (!newTransaction.category) errors.category = "دسته‌بندی را انتخاب کنید";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const formatted = {
      ...newTransaction,
      categoryId: newTransaction.category,
      amount,
      date: newTransaction.date?.toDate().toISOString(),
      type: transactionType,
    };

    try {
      await axios.post("http://localhost:5000/api/transaction", formatted, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // اگر موفق بود، به state لوکال هم اضافه کن
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
            onChange={(date) => {
              console.log(date);
              setNewTransaction({
                ...newTransaction,
                date: date as DateObject,
              });
            }}
            calendar={persian}
            locale={persian_fa}
            inputClass="w-full border rounded p-2 text-right"
            format="YYYY/MM/DD"
          />
        </div>

        {/* title */}
        <div>
          <label className="block text-sm mb-1">
            {transactionType === "INCOME" ? "پرداخت‌کننده" : "هزینه بابت"}
          </label>
          <input
            type="text"
            value={newTransaction.title}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, title: e.target.value })
            }
            className="w-full border rounded p-2 text-right"
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm">{formErrors.title}</p>
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
            {categories
              .filter((cat) => cat.type === transactionType)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
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
