import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const categories = [
  "درآمد",
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
    amount: string;
  }) => void;
}

export default function Modal({ onClose, onAdd }: ModalProps) {
  const [newTransaction, setNewTransaction] = useState<{
    date: Date;
    payee: string;
    category: string;
    amount: string;
  }>({
    date: new Date(),
    payee: "",
    category: "",
    amount: "",
  });

  const [formErrors, setFormErrors] = useState<{
    payee?: string;
    amount?: string;
    category?: string;
  }>({});

  const handleSubmit = () => {
    const errors: { payee?: string; amount?: string; category?: string } = {};
    if (!newTransaction.payee) errors.payee = "پرداخت‌کننده را وارد کنید";
    if (!newTransaction.amount || isNaN(parseFloat(newTransaction.amount)))
      errors.amount = "مبلغ معتبر وارد کنید";
    if (!newTransaction.category) errors.category = "دسته‌بندی انتخاب کنید";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // تبدیل تاریخ به رشته قابل خواندن
    const formatted = {
      ...newTransaction,
      date: newTransaction.date.toLocaleDateString("en-CA"), // yyyy-mm-dd
      amount: `$${parseFloat(newTransaction.amount).toFixed(2)}`,
    };

    onAdd(formatted); // ارسال به کامپوننت والد
    onClose(); // بستن مودال
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 text-black p-8 rounded-xl w-[400px] relative shadow-xl">
        <h3 className="text-xl font-bold mb-4">تراکنش جدید</h3>

        <div className="mb-3">
          <label className="block text-sm mb-1">تاریخ</label>
          <DatePicker
            selected={newTransaction.date}
            onChange={(date) =>
              setNewTransaction({ ...newTransaction, date: date || new Date() })
            }
            className="w-full border rounded p-2"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">پرداخت‌کننده</label>
          <input
            type="text"
            value={newTransaction.payee}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, payee: e.target.value })
            }
            className="w-full border rounded p-2"
          />
          {formErrors.payee && (
            <p className="text-red-500 text-sm">{formErrors.payee}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">دسته‌بندی</label>
          <select
            value={newTransaction.category}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, category: e.target.value })
            }
            className="w-full border rounded p-2"
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

        <div className="mb-4">
          <label className="block text-sm mb-1">مبلغ</label>
          <input
            type="text"
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            className="w-full border rounded p-2"
          />
          {formErrors.amount && (
            <p className="text-red-500 text-sm">{formErrors.amount}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
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
