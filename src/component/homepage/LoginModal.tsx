import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../asset/logo.png";

function LoginModal({
  onClose,
  onSwitchToRegister,
}: {
  onClose: () => void;
  onSwitchToRegister: () => void;
}) {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleLogin = () => {
    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (!email) {
      setEmailError("ایمیل نباید خالی باشد.");
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("فرمت ایمیل معتبر نیست.");
        valid = false;
      }
    }

    if (!password) {
      setPasswordError("رمز عبور نباید خالی باشد.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/Dashbord");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white p-8 rounded-xl w-[400px] relative shadow-xl">
        <button
          className="absolute top-2 right-3 text-black text-xl"
          onClick={() => {
            onClose();
            navigate("/");
          }}
        >
          ✖
        </button>
        <div>
          <img src={logo} alt="logo" className=" block w-28 h-20 " />
        </div>
        <h2 dir="rtl" className="text-2xl font-semibold mb-1">
          خوش آمدید!
        </h2>
        <p className="text-sm text-white mb-6" dir="rtl">
          لطفا اطلاعات خود را در کادر پایین وارد کنید
        </p>

        <input
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          className="w-full mb-1 px-4 py-2 border text-gray-950 rounded-md bg-gray-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && (
          <div className="text-red-500 text-sm mb-3">{emailError}</div>
        )}

        <input
          type="password"
          placeholder="پسورد خودرا وارد کنید"
          className="w-full mb-1 px-4 py-2 border text-gray-900 rounded-md bg-gray-50"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && (
          <div className="text-red-500 text-sm mb-3">{passwordError}</div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-800"
          }`}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          هیچ اکانتی ندارید ?{" "}
          <span
            onClick={onSwitchToRegister}
            className="text-blue-600 cursor-pointer"
          >
            ثبت نام
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
