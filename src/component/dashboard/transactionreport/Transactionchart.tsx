import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { ITransaction } from "../../../interfaces/transaction";

const COLORS = ["#8884d8", "#00C49F", "#FFBB28", "#FF8042"];

interface TransactionChartProps {
  transactions: ITransaction[];
}

const TransactionChart = ({ transactions }: TransactionChartProps) => {
  const statusCounts = transactions.reduce(
    (acc: Record<string, number>, transaction) => {
      const categoryName = transaction.category?.name || "نامشخص";

      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }

      acc[categoryName] += 1;
      return acc;
    },
    {}
  );

  const data = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));
  // Area chart for transaction status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const areaData = transactions.reduce((acc: any[], transaction) => {
    const date = new Date(transaction.date).toLocaleDateString("fa-IR");

    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing[transaction.type] += 1;
    } else {
      acc.push({
        date,
        income: transaction.type === "INCOME" ? transaction.amount : 0,
        expense: transaction.type === "EXPENSE" ? transaction.amount : 0,
      });
    }

    return acc;
  }, []);
  return (
    <>
      <div
        className="bg-white p-4 rounded-xl shadow w-full flex flex-row md:flex-row gap-x-60 "
        dir="ltr"
      >
        <h2 className="font-semibold text-lg mb-4">Transaction Status</h2>
        <div>
          <PieChart width={300} height={250}>
            <Pie
              data={data}
              cx={150}
              cy={100}
              outerRadius={80}
              dataKey="value"
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div>
          <ResponsiveContainer width={500} height={250}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF8042" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#00C49F"
                fill="url(#colorIncome)"
                name="درآمد"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#FF8042"
                fill="url(#colorExpense)"
                name="هزینه"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default TransactionChart;
