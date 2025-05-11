function Main() {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-8 py-8 md:py-12 bg-accent mt-20">
        <div className="max-w-3xl mx-auto">
          <h1
            dir="rtl"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4 animate-fade-in"
          >
            با CYP پولت رو هوشمندانه مدیریت کن
          </h1>
          <p
            dir="rtl"
            className="text-lg md:text-xl text-secondary mb-8 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            اپلیکیشن ساده برای کنترل دخل و خرج روزانه
          </p>
          <button
            className="hero-button font-semibold text-base md:text-lg animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            شروع رایگان
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;