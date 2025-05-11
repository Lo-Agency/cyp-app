import { Link } from "react-router-dom";

function Footer() {
  const navLinks = [
    { href: "/about", label: "درباره ما" },
    { href: "/features", label: "ویژگی‌ها" },
    { href: "/contact", label: "تماس با ما" },
  ];

  const socialLinks = [
    { href: "https://instagram.com", icon: "src/asset/insta.svg", alt: "اینستاگرام" },
    { href: "https://twitter.com", icon: "src/asset/twitter.svg", alt: "توییتر" },
    { href: "https://facebook.com", icon: "src/asset/facebook.svg", alt: "فیسبوک" },
    { href: "https://linkedin.com", icon: "src/asset/linkedin.svg", alt: "لینکدین" },
  ];

  return (
    <footer className="bg-accent text-text-primary py-10 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-right">
        {/* لوگو */}
        <div className="flex justify-center md:justify-start">
          <img src="src/asset/logo.png" alt="لوگو CYP" className="w-28 h-auto" />
        </div>

        {/* لینک‌های ناوبری */}
        <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="footer-link hover:text-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* آیکون‌های شبکه‌های اجتماعی */}
        <div className="flex justify-center md:justify-end gap-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary hover:text-secondary transition-colors"
            >
              <img
                src={social.icon}
                alt={social.alt}
                className="w-6 h-6"
                aria-label={social.alt}
              />
            </a>
          ))}
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="text-center text-xs text-text-secondary mt-6">
        © {new Date().getFullYear()} CYP | تمامی حقوق محفوظ است.{" "}
        <a href="/privacy" className="underline hover:text-secondary">
          سیاست حفظ حریم خصوصی
        </a>
      </div>
    </footer >
  );
}

export default Footer;