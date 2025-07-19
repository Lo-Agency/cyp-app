import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
  FaShoppingCart,
} from "react-icons/fa";

interface SummaryData {
  transactions: number;
  budget: number;
  income: number;
  expense: number;
  deficit: number;
}

interface ChartItem {
  name: string;
  value: number;
  color?: string;
}

interface ReportResponse {
  summary: SummaryData;
  lineChart: ChartItem[];
  barChart: ChartItem[];
  pieChart: ChartItem[];
}

export default function FinancialReportDashboard() {
  const [summary, setSummary] = useState<SummaryData>({
    transactions: 0,
    budget: 0,
    income: 0,
    expense: 0,
    deficit: 0,
  });
  const [lineData, setLineData] = useState<ChartItem[]>([]);
  const [barData, setBarData] = useState<ChartItem[]>([]);
  const [pieData, setPieData] = useState<ChartItem[]>([]);
  const [filter, setFilter] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  const [showFilter, setShowFilter] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setShowFilter(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get<ReportResponse>("/api/report", {
          params: { filter },
        });
        const data = res.data;
        setSummary(data.summary);
        setLineData(data.lineChart || []);
        setBarData(data.barChart || []);
        setPieData(data.pieChart || []);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };

    fetchReport();
  }, [filter]);

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { نوع: "بودجه", مقدار: summary.budget },
      { نوع: "درآمد", مقدار: summary.income },
      { نوع: "هزینه", مقدار: summary.expense },
      { نوع: "کسری بودجه", مقدار: summary.deficit },
      { نوع: "تعداد تراکنش", مقدار: summary.transactions },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "گزارش");
    XLSX.writeFile(workbook, "financial_report.xlsx");
  };

  const summaryCards = [
    {
      title: "تراکنش‌ها",
      value: `${summary.transactions} عدد`,
      icon: <FaShoppingCart className="text-blue-600 text-xl" />,
      change: "+5%",
      color: "blue",
    },
    {
      title: "بودجه",
      value: `${summary.budget.toLocaleString()} تومان`,
      icon: <FaMoneyBillWave className="text-green-600 text-xl" />,
      change: "+3.9%",
      color: "green",
    },
    {
      title: "درآمد",
      value: `${summary.income.toLocaleString()} تومان`,
      icon: <FaArrowUp className="text-emerald-600 text-xl" />,
      change: "+2.1%",
      color: "emerald",
    },
    {
      title: "هزینه",
      value: `${summary.expense.toLocaleString()} تومان`,
      icon: <FaArrowDown className="text-red-500 text-xl" />,
      change: "-1.4%",
      color: "red",
    },
    {
      title: "کسری بودجه",
      value: `${summary.deficit.toLocaleString()} تومان`,
      icon: <FaChartPie className="text-yellow-500 text-xl" />,
      change: "+0.5%",
      color: "yellow",
    },
  ];

  return (
    <div className="p-6">
      {/* دکمه فیلتر و اکسل */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm shadow hover:bg-gray-50"
          >
            فیلتر
          </button>
          {showFilter && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow z-10">
              {["daily", "weekly", "monthly", "yearly"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilter(
                      type as "daily" | "weekly" | "monthly" | "yearly"
                    );
                    setShowFilter(false);
                  }}
                  className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-100 ${
                    filter === type ? "bg-gray-100 font-bold" : ""
                  }`}
                >
                  {
                    {
                      daily: "روزانه",
                      weekly: "هفتگی",
                      monthly: "ماهانه",
                      yearly: "سالانه",
                    }[type]
                  }
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleExportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
        >
          دریافت اکسل
        </button>
      </div>

      {/* کارت‌های خلاصه */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {summaryCards.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow p-4 border border-gray-100 flex justify-between items-center"
          >
            <div>
              <h3 className="text-gray-500 text-sm">{item.title}</h3>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {item.value}
              </p>
              <p className={`text-${item.color}-500 text-xs mt-1`}>
                {item.change} نسبت به هفته قبل
              </p>
            </div>
            <div className={`bg-${item.color}-100 p-2 rounded-full`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* نمودار خطی و میله‌ای */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow border col-span-1 xl:col-span-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            روند تراکنش‌ها
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-4 shadow border">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            درآمد روزانه
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نمودار دایره‌ای */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow border">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            نسبت درآمد/هزینه/بودجه
          </h4>
          <div className="flex gap-4 mb-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span> بودجه
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>{" "}
              درآمد
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span> هزینه
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#6366f1"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
