import { memo } from "react";

interface CardProps {
  title: string;
  amount: string | number;
  icon?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

function Cards({ title, amount, icon, bgColor = "bg-gray-50", textColor = "text-gray-800" }: CardProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${bgColor} ${textColor} w-full max-w-xs sm:max-w-[200px]`}
    >
      {icon && <img src={icon} alt={title} className="w-6 h-6" />}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <span className="text-xl font-bold mt-1">{amount}</span>
      </div>
    </div>
  );
}

export default memo(Cards);