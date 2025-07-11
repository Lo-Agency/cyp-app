import { useEffect, useState } from "react";
import axios from "axios";
import TransactionChart from "./Transactionchart";
import TransactionTable from "./Transactiontable";
import { ITransaction } from "../../../interfaces/transaction";
import Modaltransaction from "../Modaltransaction";

const TransactionReportPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get<ITransaction[]>(
          "http://localhost:5000/api/transaction",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error("❌ خطا در دریافت تراکنش‌ها:", err);
      }
    };

    fetchTransactions();
  }, []);

  const handleEdite = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:5000/api/transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      alert("تراکنش با موفقیت حذف شد.");
    } catch (err) {
      console.log("❌ خطا در حذف تراکنش:", err);
      alert("خطا در حذف تراکنش. لطفاً دوباره تلاش کنید.");
    }
  };
  return (
    <div className="p-6 space-y-6">
      <div dir="ltr">
        <TransactionChart transactions={transactions} />
      </div>
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdite}
        onDelete={handleDelete}
      />
      {isModalOpen && selectedTransaction && (
        <Modaltransaction
          transaction={selectedTransaction}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TransactionReportPage;
