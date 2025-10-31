import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      form.email === "admin_bb@gmail.com" &&
      form.password === "admin_bb"
    ) {
      navigate("/admin");
    } else {
      setError("Невірна пошта або пароль адміністратора");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7f9] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-lg border border-[#f3e0e3]">
        <h2 className="text-3xl font-extrabold text-center text-[#ff6e8f] mb-8">
          Вхід адміністратора
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Електронна пошта
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin_info@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[#e8dfe1] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              placeholder="Введіть пароль"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-[#e8dfe1] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition"
              required
            />
          </div>

          {error && (
            <p className="text-[#ff6e8f] text-sm text-center -mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="bg-[#ff8fa3] hover:bg-[#ff6e8f] transition text-white font-semibold py-3 rounded-xl shadow-sm"
          >
            Увійти
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 italic">
          *Доступ лише для адміністратора BeautyBook
        </p>
      </div>
    </div>
  );
}
