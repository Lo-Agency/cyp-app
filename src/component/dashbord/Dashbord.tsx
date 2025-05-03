import { useState } from "react";
import Cards from "./Cards";

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
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    payee: "",
    category: "",
    amount: "",
  });

  const handleAddTransaction = () => {
    setTransactions([
      ...transactions,
      {
        ...newTransaction,
        id: transactions.length + 1,
        amount: parseFloat(newTransaction.amount) || 0,
      },
    ]);
    setNewTransaction({ date: "", payee: "", category: "", amount: "" });
    setShowModal(false);
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-blue-300/20 backdrop-blur-md border border-white/30 text-black p-8 rounded-xl w-[400px] relative shadow-xl">
            <h3 className="text-xl font-bold mb-4">تراکنش جدید</h3>

            <input
              type="text"
              placeholder="تاریخ (مثلا 04/12/2024)"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="پرداخت کننده (Payee)"
              value={newTransaction.payee}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, payee: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="دسته بندی (مثلا Income)"
              value={newTransaction.category}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  category: e.target.value,
                })
              }
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="مبلغ (مثلا $250.00)"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                انصراف
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddTransaction}
              >
                افزودن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
