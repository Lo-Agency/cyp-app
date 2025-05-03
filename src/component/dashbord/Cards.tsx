import { memo } from "react";

interface CardProps {
  title: string;
  amount: string | number;
}

function Cards({ title, amount }: CardProps) {
  return (
    <div className="flex flex-col items-start bg-gray-50 border font-Yekan border-gray-200 rounded-lg p-4 w-40 h-20 hover:shadow-md transition">
      <span className="text-sm text-gray-600">{title}</span>
      <span className="text-2xl font-bold text-gray-800 mt-2">{amount}</span>
    </div>
  );
}

export default memo(Cards);
