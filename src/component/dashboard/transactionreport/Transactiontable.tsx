import { ITransaction } from "../../../interfaces/transaction";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

interface Props {
  transactions: ITransaction[];
  onEdit: (transaction: ITransaction) => void;
  onDelete: (id: number | number) => void;
}

const TransactionTable = ({ transactions, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        گزارش تراکنش‌ها
      </h3>

      {transactions.length === 0 ? (
        <p className="text-gray-500">تراکنشی وجود ندارد.</p>
      ) : (
        <table className="table-auto w-full text-sm text-right">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">نام کاربر</th>
              <th className="px-4 py-2">دسته‌بندی</th>
              <th className="px-4 py-2">نوع</th>
              <th className="px-4 py-2">مبلغ</th>
              <th className="px-4 py-2">تاریخ</th>
              <th className="px-4 py-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{t.user?.name || "-"}</td>
                <td className="px-4 py-2">{t.category?.name || "-"}</td>
                <td className="px-4 py-2">
                  {t.type === "INCOME" ? "درآمد" : "هزینه"}
                </td>
                <td className="px-4 py-2">{t.amount.toLocaleString()} تومان</td>
                <td className="px-4 py-2">
                  {new Date(t.date).toLocaleDateString("fa-IR")}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-3 justify-end">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onEdit(t)}
                      title="ویرایش"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDelete(t.id)}
                      title="حذف"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
