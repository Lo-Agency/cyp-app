
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

const BudgetModal = ({ onClose, addBudget , updateBudget, editingBudget}: BudgetModalProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState({
    categoryId: 0,
    amount: 0,
    period: "monthly",
  });


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
        categoryId: editingBudget.category.id || 0,
        amount: editingBudget.amount,
        period: editingBudget.period || "monthly",
      });
    }
  }, [editingBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find((c) => c.id === formData.categoryId);
    if (!selectedCategory) {
    alert("لطفاً یک دسته‌بندی انتخاب کنید");
    return;
  }
    if (formData.amount <= 0){
      alert("مبلغ بودجه باید بیشتر از صفر باشد");
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
        name: ""
      }
    };

    if (editingBudget) {
      updateBudget(budget);
    } else {
      addBudget(budget);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingBudget ? "ویرایش بودجه" : "افزودن بودجه بندی جدید"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">دسته‌بندی</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            >
              <option value={0}>انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">مبلغ بودجه (تومان)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">بازه زمانی</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="monthly">ماهانه</option>
              <option value="weekly">هفتگی</option>
              <option value="yearly">سالانه</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {editingBudget ? "به‌روزرسانی" : "افزودن"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              لغو
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
