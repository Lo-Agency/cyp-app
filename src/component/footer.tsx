function Footer() {
    return (
      <footer className="bg-gray-500 text-white py-10 mt-16 mb-0">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 items-center gap-8 text-center md:text-right">
          <div className="flex justify-center md:justify-start">
            <img src="src/asset/logo.png" alt="لوگو" className="w-28" />
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
            <a href="#" className="hover:underline">درباره ما</a>
            <a href="#" className="hover:underline">ویژگی‌ها</a>
            <a href="#" className="hover:underline">تماس با ما</a>
          </div>
          <div className="flex justify-center md:justify-end gap-4">
            <a href="#"><img src="src/asset/insta.svg" alt="Instagram" className="w-5 h-5" /></a>
            <a href="#"><img src="src/asset/twitter.svg" alt="Twitter" className="w-5 h-5" /></a>
            <a href="#"><img src="src/asset/facebook.svg" alt="Facebook" className="w-5 h-5" /></a>
            <a href="#"><img src="src/asset/linkedin.svg" alt="LinkedIn" className="w-5 h-5" /></a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} مدیریت مالی | تمامی حقوق محفوظ است.
        </div>
      </footer>
    );
  }
  
  export default Footer;
  