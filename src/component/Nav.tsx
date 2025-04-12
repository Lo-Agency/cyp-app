function Nav() {
  const navItems = [
    { href: "#", label: "درباره ما" },
    { href: "#", label: "ویژگی‌ها" },
    { href: "#", label: "تماس با ما" },
  ];
  return (
    <nav>
      <ul className="flex items-center space-x-8 text-blue-600 text-sm font-medium">
        {navItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="hover:text-blue-800 transition-colors duration-200"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
