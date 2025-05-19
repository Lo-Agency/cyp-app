import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">صفحه مورد نظر پیدا نشد!</p>
      <Link
        to="/"
        className="px-4 py-2 bg-cyan-900 text-white rounded-xl hover:bg-cyan-800 transition"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}

export default NotFound;
