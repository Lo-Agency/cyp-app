import { memo } from "react";

interface ButtonsCardProps {
  title: string;
  amount: string | number;
}

function ButtonsCard({ title, amount }: ButtonsCardProps) {
  return (
    <button className="flex flex-col items-start bg-gray-50 border font-Yekan border-gray-200 rounded-lg p-4 w-40 h-20 hover:shadow-md transition">
      <span className="text-sm text-gray-600">{title}</span>
      <span className="text-2xl font-bold text-gray-800 mt-2">{amount}</span>
    </button>
  );
}

export default memo(ButtonsCard);
