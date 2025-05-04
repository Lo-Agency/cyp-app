import { useState } from "react";
import Cards from "./Cards";
import Modal from "./Modaltransaction";

const cardlist = [
  { title: "درآمدها", amount: "0ریال" },
  { title: "هزینه ها", amount: "0ریال" },
  { title: "بودجه", amount: "0ریال" },
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([
    { id: 1, category: "خوراک", amount: 500, date: "1404/01/01" },
    { id: 2, category: "حمل‌ونقل", amount: 200, date: "1404/01/02" },
    { id: 3, category: "سرگرمی", amount: 1000, date: "1404/01/03" },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleAddTransaction = (transaction: {
    date: string;
    payee: string;
    category: string;
    amount: string;
  }) => {
    setTransactions((prev) => [
      ...prev,
      {
        ...transaction,
        id: prev.length + 1,
        amount: parseFloat(transaction.amount), // Convert amount to number
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow flex min-h-screen">
        <div className="w-64 bg-white border-r border-gray-300"></div>

        <div className="flex-1 flex flex-col">
          <div className="flex flex-row justify-between gap-4 p-8">
            {cardlist.map((item) => (
              <Cards key={item.title} title={item.title} amount={item.amount} />
            ))}
          </div>

          <div className="p-8">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">تراکنش ها</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                onClick={() => setShowModal(true)}
              >
                تراکنش جدید
              </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                تراکنش‌های اخیر
              </h3>
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">دسته‌بندی</th>
                    <th className="p-2">مبلغ (تومان)</th>
                    <th className="p-2">تاریخ</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="p-2">{transaction.category}</td>
                      <td className="p-2">
                        {transaction.amount.toLocaleString()}
                      </td>
                      <td className="p-2">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* استفاده از کامپوننت Modal */}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onAdd={handleAddTransaction}
        />
      )}
    </div>
  );
}
