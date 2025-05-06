import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../asset/logo.png";
import Nav from "./Nav";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useNavigate } from "react-router-dom";

function Header({ defaultDropDown }: { defaultDropDown?: boolean }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setShowRegister(defaultDropDown || false);
  }, [defaultDropDown]);


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
    <header className="flex justify-between items-center px-4 md:px-8 py-4 bg-background shadow-sm relative z-20">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-20 md:w-24 h-auto" />
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex">
          <Nav />
        </div>

        {/* اینو گذاشتم فقط برای دسکتاپ */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => setShowLogin(true)}
            className="text-primary hover:text-secondary font-medium px-4 py-1.5 rounded-md transition-colors"
          >
            ورود
          </button>
          <button
            onClick={() => {
              setShowRegister(true);
              navigate("/register");
            }}
            className="bg-primary text-white font-medium px-4 py-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            ثبت‌ نام
          </button>
        </div>
        {/* این همبرگر منو که تو موبایل فقط نشون بده */}
        <button className="md:hidden text-primary hover:text-secondary p-1" onClick={handleDropdown}>
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
          className="absolute top-16 right-4 bg-background shadow-lg rounded-lg w-56 py-3 animate-fade-in md:hidden"
        >
          <button
            onClick={() => {
              setShowLogin(true)
              setOpenDropdown(false);
            }}
            className="block w-full text-right px-4 py-2 text-text-primary hover:bg-accent hover:text-primary"
          >
            ورود
          </button>
          <button
            onClick={() => {
              setShowRegister(true);
              navigate("/register");
              setOpenDropdown(false);
            }}
            className="block w-full text-right px-4 py-2 text-text-primary hover:bg-accent hover:text-primary"
          >
            ثبت نام
          </button>
          <Link
            to="/careers"
            onClick={() => setOpenDropdown(false)}
            className="block w-full text-right px-4 py-2 text-text-primary hover:bg-accent hover:text-primary"
          >
            فرصت‌های شغلی
          </Link>
        </div>
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </header>
  );
}

export default Header;
