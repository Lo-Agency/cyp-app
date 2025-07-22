import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { IDebt } from "../../interfaces/debt";
import { useUser } from "../../contexts/userContext";

interface DebtModalProps {
  onClose: () => void;
  addDebt: (debt: IDebt) => void;
  updateDebt: (debt: IDebt) => void;
  editingDebt: IDebt | null;
}

const DebtModal = ({ onClose, addDebt, updateDebt, editingDebt }: DebtModalProps) => {
 const { user } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    paidAmount: 0,
    interestRate: 0,
    dueDate: new DateObject(),
    creditor: "",
  });
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    amount?: string;
    paidAmount?: string;
    interestRate?: string;
    dueDate?: string;
    creditor?: string;
  }>({});

  useEffect(() => {
    if (editingDebt) {
      setFormData({
        title: editingDebt.title,
        amount: editingDebt.amount,
        paidAmount: editingDebt.paidAmount || 0,
        interestRate: editingDebt.interestRate || 0,
        dueDate:
          typeof editingDebt.dueDate === "string"
            ? new DateObject(new Date(editingDebt.dueDate))
            : new DateObject(editingDebt.dueDate),
        creditor: editingDebt.creditor,
      });
    } else {
      setFormData({
        title: "",
        amount: 0,
        paidAmount: 0,
        interestRate: 0,
        dueDate: new DateObject(),
        creditor: "",
      });
    }
  }, [editingDebt]);

  const validateForm = () => {
    const errors: { title?: string; amount?: string; paidAmount?: string; interestRate?: string; dueDate?: string; creditor?: string } = {};
    if (!formData.title) errors.title = "عنوان بدهی الزامی است";
    if (formData.amount <= 0) errors.amount = "مبلغ بدهی باید مثبت باشد";
    if (formData.paidAmount < 0) errors.paidAmount = "مبلغ پرداخت‌شده نمی‌تواند منفی باشد";
    if (formData.interestRate < 0) errors.interestRate = "نرخ سود نمی‌تواند منفی باشد";
    if (!formData.dueDate) errors.dueDate = "مهلت الزامی است";
    if (!formData.creditor) errors.creditor = "نام بستانکار الزامی است";
    if (formData.paidAmount > formData.amount) errors.paidAmount = "مبلغ پرداخت‌شده نمی‌تواند بیشتر از بدهی باشد";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const debt: IDebt = {
      id: editingDebt?.id || "",
      title: formData.title,
      amount: formData.amount,
      paidAmount: formData.paidAmount,
      interestRate: formData.interestRate,
      dueDate: formData.dueDate.toDate().toISOString(),
      creditor: formData.creditor,
      userId: String(user?.id) || "",
      remainingAmount: formData.amount - formData.paidAmount,
      user: {
        id: "",
        name: ""
      }
    };

    if (editingDebt) {
      updateDebt(debt);
    } else {
      addDebt(debt);
    }
    setFormErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingDebt ? "ویرایش بدهی" : "ثبت بدهی جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ بدهی (تومان)</label>
            <input
              type="number"
              min="1"
              value={formData.amount || ""}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {formErrors.amount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ پرداخت‌شده (تومان)</label>
            <input
              type="number"
              min="0"
              value={formData.paidAmount || ""}
              onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {formErrors.paidAmount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.paidAmount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نرخ سود (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.interestRate || ""}
              onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {formErrors.interestRate && (
              <p className="text-red-500 text-sm mt-1">{formErrors.interestRate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مهلت</label>
            <DatePicker
              value={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date as DateObject })}
              calendar={persian}
              locale={persian_fa}
              inputClass="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              format="YYYY/MM/DD"
            />
            {formErrors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">بستانکار</label>
            <input
              type="text"
              value={formData.creditor}
              onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {formErrors.creditor && (
              <p className="text-red-500 text-sm mt-1">{formErrors.creditor}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              لغو
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {editingDebt ? "به‌روزرسانی" : "افزودن"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DebtModal;