import { useEffect, useState } from "react";
import axios from "axios";
import TransactionChart from "./Transactionchart";
import TransactionTable from "./Transactiontable";
import { ITransaction } from "../../../interfaces/transaction";

const TransactionReportPage = () => {
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

  return (
    <div className="p-6 space-y-6">
      <div dir="ltr">
        <TransactionChart transactions={transactions} />
      </div>
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default TransactionReportPage;
