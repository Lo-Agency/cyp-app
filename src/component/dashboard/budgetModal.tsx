import { useEffect, useState } from "react";
import axios from "axios";
import { BudgetPeriod, IBudget } from "../../interfaces/budget";
import { ICategory } from "../../interfaces/category";

interface BudgetModalProps {
  onClose: () => void;
  addBudget: (budget: IBudget) => void;
  updateBudget: (budget: IBudget) => void;
  editingBudget: IBudget | null;
}

const BudgetModal = ({
  onClose,
  addBudget,
  updateBudget,
  editingBudget,
}: BudgetModalProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState({
    categoryId: 0,
    amount: 0,
    period: BudgetPeriod.Monthly,
  });
  const [formErrors, setFormErrors] = useState<{
    categoryId?: string;
    amount?: string;
    period?: string;
  }>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    return () => setIsOpen(false);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
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
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        categoryId: editingBudget.category?.id || 0,
        amount: editingBudget.amount,
        period: editingBudget.period || BudgetPeriod.Monthly,
      });
    } else {
      setFormData({ categoryId: 0, amount: 0, period: BudgetPeriod.Monthly });
    }
  }, [editingBudget]);

  const validateForm = () => {
    const errors: { categoryId?: string; amount?: string; period?: string } = {};
    if (formData.categoryId === 0) errors.categoryId = "لطفاً یک دسته‌بندی انتخاب کنید";
    if (formData.amount <= 0) errors.amount = "مبلغ بودجه باید بیشتر از صفر باشد";
    if (!Object.values(BudgetPeriod).includes(formData.period))
      errors.period = "بازه زمانی معتبر انتخاب کنید";
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const selectedCategory = categories.find(
      (c) => c.id === formData.categoryId
    );
    if (!selectedCategory) {
      setFormErrors({ categoryId: "دسته‌بندی نامعتبر است" });
      return;
    }

    const budget: IBudget = {
      id: editingBudget?.id || "",
      category: selectedCategory,
      categoryId: formData.categoryId,
      amount: formData.amount,
      spent: editingBudget?.spent || 0,
      period: formData.period,
      userId: "",
      user: {
        id: "",
        name: "",
      },
    };

    if (editingBudget) {
      updateBudget(budget);
    } else {
      addBudget(budget);
    }
    setFormErrors({});
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
      dir="rtl"
    >
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out ${isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editingBudget ? "ویرایش بودجه" : "افزودن بودجه‌بندی جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              دسته‌بندی
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: Number(e.target.value) })
              }
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            >
              <option value={0}>انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formErrors.categoryId && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.categoryId}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              مبلغ بودجه (تومان)
            </label>
            <input
              type="number"
              min="1"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
            {formErrors.amount && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.amount}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              بازه زمانی
            </label>
            <select
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value as BudgetPeriod })
              }
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            >
              <option value="monthly">ماهانه</option>
              <option value="weekly">هفتگی</option>
              <option value="yearly">سالانه</option>
            </select>
            {formErrors.period && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                {formErrors.period}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 hover:scale-105 transition-all duration-200 text-sm font-semibold"
            >
              لغو
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-sm font-semibold"
            >
              {editingBudget ? "به‌روزرسانی" : "افزودن"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;