import logo from "../asset/logo.png";

function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="w-28 h-auto" />
      </div>

      <div className="flex items-center space-x-6">
        <nav>
          <ul className="flex items-center space-x-8 text-blue-600 text-sm font-medium">
            <li>
              <a
                href="#"
                className="hover:text-blue-800 transition-colors duration-200"
              >
                درباره ما
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-800 transition-colors duration-200"
              >
                ویژگی‌ها
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-blue-800 transition-colors duration-200"
              >
                تماس با ما
              </a>
            </li>
          </ul>
        </nav>
        <button className="text-blue-600">
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
    </header>
  );
}

export default Header;
