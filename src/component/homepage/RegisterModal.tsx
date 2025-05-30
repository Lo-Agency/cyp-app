import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterModal({
  onClose,
  onSwitchToLogin,
}: {
  onClose: () => void;
  onSwitchToLogin: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameRegx = /^[آ-ی\s]{2,50}$/;
    const emailRegx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegx = /^.{6,}$/;

    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "نام نباید خالی باشد";
      isValid = false;
    } else if (!nameRegx.test(formData.name)) {
      newErrors.name = "فقط حروف فارسی بین ۲ تا ۵۰ کاراکتر مجاز است";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "ایمیل نباید خالی باشد";
      isValid = false;
    } else if (!emailRegx.test(formData.email)) {
      newErrors.email = "ایمیل وارد شده معتبر نیست";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "رمز عبور نباید خالی باشد";
      isValid = false;
    } else if (!passwordRegx.test(formData.password)) {
      newErrors.password = "رمز عبور باید حداقل ۶ کاراکتر باشد";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "تکرار رمز عبور نباید خالی باشد";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "رمز عبور با تکرار آن مطابقت ندارد";
      isValid = false;
    }

    setError(newErrors);

    if (isValid) {
      console.log("فرم معتبر است:", formData);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center border-e-gray-300 z-50 bg-opacity-50 overflow-auto p-4">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white p-8 rounded-xl w-full max-w-md relative shadow-xl max-h-[90vh] overflow-auto">
        <button
          onClick={() => {
            onClose();
            navigate("/");
          }}
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-black font-medium">نام</label>
            <input
              type="text"
              name="name"
              placeholder="لطفا نام خود را وارد کنید"
              className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
              value={formData.name}
              onChange={handleChange}
            />
            {error.name && (
              <div className="text-red-500 text-sm mb-3">{error.name}</div>
            )}
          </div>

          <div>
            <label className="block text-black text-sm font-medium">
              ایمیل
            </label>
            <input
              type="email"
              name="email"
              placeholder="لطفا ایمیل خود را وارد کنید"
              className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
              value={formData.email}
              onChange={handleChange}
            />
            {error.email && (
              <div className="text-red-500 text-sm mb-3">{error.email}</div>
            )}
          </div>

          <div>
            <label className="block text-black text-sm font-medium">
              رمز عبور
            </label>
            <input
              type="password"
              name="password"
              placeholder="لطفا رمزعبور خود را وارد کنید"
              className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
              value={formData.password}
              onChange={handleChange}
            />
            {error.password && (
              <div className="text-red-500 text-sm mb-3">{error.password}</div>
            )}
          </div>

          <div>
            <label className="block text-black text-sm font-medium">
              تکرار رمز عبور
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="لطفا رمزعبور را دوباره وارد کنید"
              className="w-full px-4 py-2 mt-1 rounded-xl text-gray-900 bg-gray-100 outline-none focus:ring-2 focus:ring-black/10"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {error.confirmPassword && (
              <div className="text-red-500 text-sm mb-3">
                {error.confirmPassword}
              </div>
            )}
          </div>

          <div className="flex text-black items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1 text-black accent-cyan-900"
            />
            <span>
              با{" "}
              <a href="#" className="text-blue-600 underline">
                قوانین و مقررات
              </a>{" "}
              موافقم
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
          <span className="mx-3 text-gray-500 text-sm">یا</span>
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
          حساب دارید؟{" "}
          <span
            onClick={onSwitchToLogin}
            className="flex items-center justify-center w-full bg-cyan-900 text-white py-2 rounded-xl hover:bg-cyan-800 transition"
          >
            ورود
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;
