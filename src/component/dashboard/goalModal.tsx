import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { IGoal } from "../../interfaces/goal";

interface GoalModalProps {
  onClose: () => void;
  addGoal: (goal: IGoal) => void;
  updateGoal: (goal: IGoal) => void;
  editingGoal: IGoal | null;
}

const GoalModal = ({ onClose, addGoal, updateGoal, editingGoal }: GoalModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: new DateObject(),
  });
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    targetAmount?: string;
    currentAmount?: string;
    deadline?: string;
  }>({});

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title,
        targetAmount: editingGoal.targetAmount,
        currentAmount: editingGoal.currentAmount,
        deadline:
          typeof editingGoal.deadline === "string"
            ? new DateObject(new Date(editingGoal.deadline))
            : new DateObject(editingGoal.deadline),
      });
    } else {
      setFormData({
        title: "",
        targetAmount: 0,
        currentAmount: 0,
        deadline: new DateObject(),
      });
    }
  }, [editingGoal]);

  const validateForm = () => {
    const errors: { title?: string; targetAmount?: string; currentAmount?: string; deadline?: string } = {};
    if (!formData.title) errors.title = "عنوان هدف را وارد کنید";
    if (formData.targetAmount <= 0) errors.targetAmount = "مبلغ هدف باید بیشتر از صفر باشد";
    if (formData.currentAmount < 0) errors.currentAmount = "مبلغ جمع‌آوری‌شده نمی‌تواند منفی باشد";
    if (!formData.deadline) errors.deadline = "مهلت را انتخاب کنید";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const goal: IGoal = {
      id: editingGoal?.id || "",
      title: formData.title,
      targetAmount: formData.targetAmount,
      currentAmount: formData.currentAmount,
      deadline: formData.deadline.toDate().toISOString(),
      userId: "",
      user: {
        id: "",
        name: "",
      },
    };

    if (editingGoal) {
      updateGoal(goal);
    } else {
      addGoal(goal);
    }
    setFormErrors({});
    onClose();
  };

  return (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingGoal ? "ویرایش هدف" : "افزودن هدف جدید"}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ هدف (تومان)</label>
            <input
              type="number"
              min="1"
              value={formData.targetAmount || ""}
              onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {formErrors.targetAmount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.targetAmount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مبلغ جمع‌آوری‌شده (تومان)</label>
            <input
              type="number"
              min="0"
              value={formData.currentAmount || ""}
              onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {formErrors.currentAmount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.currentAmount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مهلت</label>
            <DatePicker
              value={formData.deadline}
              onChange={(date) => setFormData({ ...formData, deadline: date as DateObject })}
              calendar={persian}
              locale={persian_fa}
              inputClass="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              format="YYYY/MM/DD"
            />
            {formErrors.deadline && (
              <p className="text-red-500 text-sm mt-1">{formErrors.deadline}</p>
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
              {editingGoal ? "به‌روزرسانی" : "افزودن"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;