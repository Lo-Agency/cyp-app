import { useEffect, useState } from "react";
import axios from "axios";
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

// تعریف اینترفیس‌ها
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

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get<ReportResponse>("/api/report");
        console.log("Report data:", res.data);
        if (!res.data || !res.data.summary) {
          console.error("Invalid response from API:", res.data);
          return;
        }

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
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 xl:grid-cols-3">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">تراکنش‌ها</h3>
        <p className="text-xl font-bold">{summary.transactions} عدد</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">بودجه</h3>
        <p className="text-xl font-bold">
          {summary.budget.toLocaleString()} تومان
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">درآمد</h3>
        <p className="text-xl font-bold">
          {summary.income.toLocaleString()} تومان
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">هزینه</h3>
        <p className="text-xl font-bold">
          {summary.expense.toLocaleString()} تومان
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm text-gray-500">کسری بودجه</h3>
        <p className="text-xl font-bold">
          {summary.deficit.toLocaleString()} تومان
        </p>
      </div>

      <div className="col-span-1 md:col-span-2 xl:col-span-1 bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-bold mb-2">روند تراکنش‌ها</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-bold mb-2">درآمد روزانه</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#00C49F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-bold mb-2">نسبت درآمد/هزینه/بودجه</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
