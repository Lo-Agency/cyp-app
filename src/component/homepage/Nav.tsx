function Nav() {
  const navItems = [
    { href: "#", label: "فرصت های شغلی " },
    { href: "#", label: "تماس با ما" },
    { href: "#", label: "ویژگی‌ها" },
    { href: "#", label: "درباره ما" },
  ];
  return (
    <nav>
      <ul className="flex items-center gap-4 lg:gap-6">
        {navItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="nav-link text-base"
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
