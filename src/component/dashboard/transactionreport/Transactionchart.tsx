import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
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

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-md" dir="ltr">
      <h2 className="font-semibold text-lg mb-4">Transaction Status</h2>
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
  );
};

export default TransactionChart;
