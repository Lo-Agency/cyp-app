export default function Dashbord() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow flex overflow-hidden min-h-screen">
        <div className="w-64 bg-white border-r border-gray-300">
          <h1 className="text-2xl font-bold mb-4 p-6">Dashboard</h1>
        </div>
        <div className="flex gap-4 p-8">
          <button className="flex flex-col items-start bg-gray-50 border border-gray-200 rounded-lg p-4 w-40 h-20">
            <span>Incom</span>
          </button>
          <button className="flex flex-col items-start bg-gray-50 border border-gray-200 rounded-lg p-4 w-40 h-20">
            <span>Expenses</span>
          </button>
          <button className="flex flex-col items-start bg-gray-50 border border-gray-200 rounded-lg p-4 w-40 h-20">
            <span>Budgeted</span>
          </button>
        </div>
      </div>
    </div>
  );
}
