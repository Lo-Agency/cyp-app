import { Key } from "react";
import { ITransaction } from "../../../interfaces/transaction";

interface TransactionTableProps {
  transactions: ITransaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
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
            </tr>
          </thead>
          <tbody>
            {transactions.map(
              (
                t: {
                  id: Key | null | undefined;
                  user?: { name: string };
                  category: { name: string };
                  type: string;
                  amount: { toLocaleString: () => string };
                  date: string | number | Date;
                },
                i: number
              ) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{t.user?.name || "-"}</td>
                  <td className="px-4 py-2">{t.category?.name || "-"}</td>
                  <td className="px-4 py-2">
                    {t.type === "income" ? "درآمد" : "هزینه"}
                  </td>
                  <td className="px-4 py-2">
                    {t.amount.toLocaleString()} تومان
                  </td>
                  <td className="px-4 py-2">
                    {new Date(t.date).toLocaleDateString("fa-IR")}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionTable;
