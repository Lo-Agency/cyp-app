import { Link } from "react-router-dom";

function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center border-e-gray-300 z-50 bg-opacity-50 overflow-auto p-4">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white p-8 rounded-xl w-full max-w-md relative shadow-xl max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-black text-xl"
        >
          ✖
        </button>
        <h2
          dir="rtl"
          className="text-2xl text-black font-semibold mb-6 text-center"
        >
          ایجاد اکانت جدید
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-black font-medium">نام</label>
            <input
              type="text"
              placeholder="لطفا نام خود را وارد کنید"
              className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-black text-sm font-medium">
              ایمیل
            </label>
            <input
              type="email"
              placeholder="لطفا ایمیل خود را وارد کنید"
              className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-black text-sm font-medium">
              پسورد
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="لطفا رمزعبور خود را وارد کنید"
                className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
          <div>
            <label className="block text-black text-sm font-medium">
              تایید رمزعبور
            </label>
            <input
              type="password"
              placeholder="لطفا رمزعبور خود را دوباره وارد کنید"
              className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div className="flex text-black items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1 text-black accent-cyan-900"
            />
            <span>
              I agree to all the{" "}
              <a href="#" className="text-blue-600 underline">
                Terms & Conditions
              </a>
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-900 text-white py-2 rounded-xl hover:bg-cyan-800 transition"
          >
            ثبت نام
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-500" />
          <span className="mx-3 text-gray-500 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-500" />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center text-black justify-center gap-2 border w-full py-2 rounded-xl">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Google
          </button>
          <button className="flex items-center text-black justify-center gap-2 border w-full py-2 rounded-xl">
            <img
              src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000"
              alt="Facebook"
              className="w-5 h-5"
            />
            Facebook
          </button>
        </div>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/LoginModal"
            className="flex items-center justify-center text-blue-600 no-underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
export default RegisterModal;
