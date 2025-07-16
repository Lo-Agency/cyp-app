import { useEffect, useState } from "react";
import { IBudget } from "../../interfaces/budget";
import axios from "axios";
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
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });
  const [formErrors, setFormErrors] = useState<{
    categoryId?: string;
    amount?: string;
    period?: string;
  }>({});

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

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        categoryId: editingBudget.category?.id || 0,
        amount: editingBudget.amount,
        period: editingBudget.period || "monthly",
      });
    } else {
      setFormData({ categoryId: 0, amount: 0, period: "monthly" });
    }
  }, [editingBudget]);

  const validateForm = () => {
    const errors: { categoryId?: string; amount?: string; period?: string } =
      {};
    if (formData.categoryId === 0)
      errors.categoryId = "لطفاً یک دسته‌بندی انتخاب کنید";
    if (formData.amount <= 0)
      errors.amount = "مبلغ بودجه باید بیشتر از صفر باشد";
    if (!["monthly", "weekly", "yearly"].includes(formData.period))
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
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
      dir="rtl"
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editingBudget ? "ویرایش بودجه" : "افزودن بودجه‌بندی جدید"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دسته‌بندی
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            >
              <option value={0}>انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formErrors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.categoryId}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مبلغ بودجه (تومان)
            </label>
            <input
              type="number"
              min="1"
              value={formData.amount || ""}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {formErrors.amount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              بازه زمانی
            </label>
            <select
              value={formData.period}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  period: e.target.value as "monthly" | "weekly" | "yearly",
                })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="monthly">ماهانه</option>
              <option value="weekly">هفتگی</option>
              <option value="yearly">سالانه</option>
            </select>
            {formErrors.period && (
              <p className="text-red-500 text-sm mt-1">{formErrors.period}</p>
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
              {editingBudget ? "به‌روزرسانی" : "افزودن"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
