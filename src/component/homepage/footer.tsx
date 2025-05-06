function Footer() {
    return (
        <footer className="bg-footer text-footer py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 text-center md:text-right">
                <div className="flex justify-center md:justify-end">
                    <img
                        src="/src/asset/logo.png"
                        alt="لوگو"
                        className="w-18 md:w-28 h-auto animate-fade-in"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <a
                        href="#"
                        className="footer-link text-sm md:text-base font-medium animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                    >
                        درباره ما
                    </a>
                    <a
                        href="#"
                        className="footer-link text-sm md:text-base font-medium animate-fade-in"
                        style={{ animationDelay: "0.3s" }}
                    >
                        ویژگی‌ها
                    </a>
                    <a
                        href="#"
                        className="footer-link text-sm md:text-base font-medium animate-fade-in"
                        style={{ animationDelay: "0.4s" }}
                    >
                        تماس با ما
                    </a>
                </div>

                <div className="flex justify-center md:justify-end gap-4">
                    <a
                        href="#"
                        className="animate-fade-in"
                        style={{ animationDelay: "0.5s" }}
                    >
                        <img
                            src="/src/asset/insta.svg"
                            alt="Instagram"
                            className="w-6 h-6 hover:scale-110 hover:filter hover:brightness-125 transition-all duration-200"
                        />
                    </a>
                    <a
                        href="#"
                        className="animate-fade-in"
                        style={{ animationDelay: "0.6s" }}
                    >
                        <img
                            src="/src/asset/twitter.svg"
                            alt="Twitter"
                            className="w-6 h-6 hover:scale-110 hover:filter hover:brightness-125 transition-all duration-200"
                        />
                    </a>
                </div>

                <div className="text-xs  mt-4 md:mt-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
                    © {new Date().getFullYear()} CYP | تمامی حقوق محفوظ است.
                </div>
            </div>
        </footer>
    )
}
export default Footer;