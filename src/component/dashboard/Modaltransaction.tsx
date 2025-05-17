import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

const incomeCategories = ["حقوق", "فروش", "هدیه", "سایر درآمدها"];
const expenseCategories = [
  "خوراک",
  "مسکن",
  "حمل و نقل",
  "سرگرمی",
  "موارد دیگر",
];

interface ModalProps {
  onClose: () => void;
  onAdd: (transaction: {
    date: string;
    payee: string;
    category: string;
    amount: number;
    type: "income" | "expense";
  }) => void;
}

export default function Modal({ onClose, onAdd }: ModalProps) {
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
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

  const categories =
    transactionType === "income" ? incomeCategories : expenseCategories;

  const handleSubmit = () => {
    const errors: { payee?: string; amount?: string; category?: string } = {};

    // تبدیل amount به عدد
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
      amount, // مقدار amount به عدد
      date: newTransaction.date?.format("YYYY-MM-DD"),
      type: transactionType,
    };

    onAdd(formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6 space-y-4 text-right">
        <h3 className="text-xl font-bold">تراکنش جدید</h3>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-2">
          <button
            onClick={() => setTransactionType("income")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              transactionType === "income"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            درآمد
          </button>
          <button
            onClick={() => setTransactionType("expense")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              transactionType === "expense"
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
            {transactionType === "income" ? "پرداخت‌کننده" : "هزینه بابت"}
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
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
