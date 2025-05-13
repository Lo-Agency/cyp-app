function Main({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="flex flex-col justify-center items-center text-white bg-blue-900 h-60 bg-auto font-Yekan w-screen">
      <div dir="rtl" className="m-3 text-base block">
        با CYP کنترل مالی و پولت به دستت بگیر
      </div>
      <div dir="rtl" className="m-6 text-base block">
        اپلیکیشنی ساده و کاربردی برای مدیریت دخل و خرج
      </div>
      <button
        className="bg-blue-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 w-32 h-10 rounded-xl"
        onClick={onLoginClick}
      >
        شروع رایگان
      </button>
    </div>
  );
}
export default Main;
