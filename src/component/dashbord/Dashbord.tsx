import ButtonsCard from "./ButtonsCard";
const buttonlist = [
  { title: "Income", amount: "0$" },
  { title: "Expenses", amount: "0$" },
  { title: "Budgeted", amount: "0$" },
];
export default function Dashbord() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow flex overflow-hidden min-h-screen">
        <div className="w-64 bg-white border-r border-gray-300">
          <h1 className="text-2xl font-bold mb-4 p-6">Dashboard</h1>
        </div>
        {/* add Buttons finance */}
        <div className="flex flex-row justify-between gap-4 p-8">
          {buttonlist.map((item) => (
            <ButtonsCard
              key={item.title}
              title={item.title}
              amount={item.amount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
