import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../asset/logo.png";
import Nav from "./Nav";
import LoginModal from "./LoginModal";

function Header() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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

  return (
    <header className="flex justify-between items-center px-10 py-4 bg-white relative">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="w-28 h-auto" />
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:block">
          <Nav />
        </div>
        <button className="text-blue-600" onClick={handleDropdown}>
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
      </div>

      {openDropdown && (
        <div
          ref={dropRef}
          className="absolute top-24 right-12 bg-white shadow-lg rounded-md w-48 py-2 z-10"
        >
          <button
            onClick={() => setShowLogin(true)}
            className="block w-full text-right px-4 py-2 text-lg text-blue-900 hover:bg-gray-100 after:content-[''] after:block after:h-px after:bg-gray-300 after:my-2"
          >
            ورود / خروج
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="block w-full text-right px-4 py-2 text-lg text-blue-900 hover:bg-gray-100"
          >
            ثبت نام
          </button>
          <Link
            to="/careers"
            className="block w-full text-right px-4 py-2 text-lg text-blue-900 hover:bg-gray-100"
          >
            فرصت‌های شغلی
          </Link>
        </div>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}

export default Header;
