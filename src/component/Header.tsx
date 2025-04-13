import { useEffect, useRef, useState } from "react";
import logo from "../asset/logo.png";
import Nav from "./Nav";
function Header() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };
  const handleClickOutside = (e: MouseEvent) => {
    if (!dropRef?.current?.contains(e.target as Node)) {
      setOpenDropdown(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const dropdownItems = [
    { label: "ورود / خروج", href: "#" },
    { label: "ثبت نام", href: "#" },
    { label: "فرصت‌های شغلی", href: "#" },
  ];

  return (
    <header className="flex justify-between items-center px-10 py-4 bg-white relative">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="w-28 h-auto" />
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:block">
          <Nav />
        </div>
        <button className="text-blue-600 " onClick={handleDropdown}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {openDropdown && (
          <div className="absolute top-24 right-12 bg-white shadow-lg rounded-md w-48 h-48 py-2 z-10 ">
            {dropdownItems.map((item, index) => {
              const isFirst = index === 0;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`block px-4 py-2 text-lg text-blue-700 hover:bg-gray-100
        ${
          isFirst
            ? "after:content-[''] after:block after:h-px after:bg-gray-300 after:my-2"
            : ""
        }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
