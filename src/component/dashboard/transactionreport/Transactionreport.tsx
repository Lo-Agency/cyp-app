import { useEffect, useState } from "react";
import axios from "axios";
import TransactionChart from "./Transactionchart";
import TransactionTable from "./Transactiontable";
import { ITransaction } from "../../../interfaces/transaction";
import Modaltransaction from "../Modaltransaction";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const ITEMS_PER_PAGE = 5;

const TransactionReportPage = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    ITransaction[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [startDate, setStartDate] = useState<DateObject | null>(null);
  const [endDate, setEndDate] = useState<DateObject | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);

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
        setFilteredTransactions(res.data);
      } catch (err) {
        console.error("❌ خطا در دریافت تراکنش‌ها:", err);
      }
    };

    fetchTransactions();
  }, []);

  const handleFilter = () => {
    const result = transactions.filter((t) => {
      const date = new DateObject(t.date);
      const matchDate =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);

      const matchType =
        typeFilter === "all" || t.type.toLowerCase() === typeFilter;

      return matchDate && matchType;
    });

    setFilteredTransactions(result);
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    setIsLoading(true);

    // کد دانلود فایل اکسل خودت رو اینجا قرار بده.
    // فرض مثال: ساخت Blob و دانلود فایل
    const fileName = "sample.xlsx";
    const fileContent = "..."; // این قسمت رو با محتوای واقعی فایل جایگزین کن

    const blob = new Blob([fileContent], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    // بعد از 3 ثانیه انیمیشن رو متوقف کن
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

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
      const updated = transactions.filter((t) => t.id !== id);
      setTransactions(updated);
      setFilteredTransactions(updated);
      alert("تراکنش با موفقیت حذف شد.");
    } catch (err) {
      console.log("❌ خطا در حذف تراکنش:", err);
      alert("خطا در حذف تراکنش. لطفاً دوباره تلاش کنید.");
    }
  };

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6 space-y-6">
      {/* header with filter & export */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 border border-blue-500 text-blue-500 px-4 py-1 rounded-lg hover:bg-blue-50 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13v4.586a1 1 0 01-.293.707l-2 2A1 1 0 0110 20v-7a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          فیلتر
        </button>

        <button
          onClick={handleExportExcel}
          disabled={isLoading}
          className={`bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "در حال دریافت..." : "دریافت Excel"}
        </button>
      </div>

      {/* modal فیلتر */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-xl relative">
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute top-2 left-2 text-gray-500 hover:text-red-500"
            >
              ❌
            </button>

            <h2 className="text-lg font-semibold mb-2">فیلتر تراکنش‌ها</h2>

            <div className="flex flex-col space-y-3">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="از تاریخ"
                calendar={persian}
                locale={persian_fa}
                inputClass="border px-3 py-1 rounded w-full"
              />
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="تا تاریخ"
                calendar={persian}
                locale={persian_fa}
                inputClass="border px-3 py-1 rounded w-full"
              />
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as "all" | "income" | "expense")
                }
                className="border px-3 py-1 rounded w-full"
              >
                <option value="all">همه</option>
                <option value="income">درآمد</option>
                <option value="expense">هزینه</option>
              </select>

              <button
                onClick={() => {
                  handleFilter();
                  setIsFilterModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
              >
                اعمال فیلتر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* chart */}
      <div dir="ltr">
        <TransactionChart transactions={filteredTransactions} />
      </div>

      {/* table */}
      <TransactionTable
        transactions={paginatedTransactions}
        onEdit={handleEdite}
        onDelete={handleDelete}
      />

      {/* pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2 rtl:space-x-reverse">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded-full transition ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* modal ویرایش تراکنش */}
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
