import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#fff0f5] shadow-md py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between text-[#ff5c8a] rounded-b-2xl sticky top-0 z-50">
      {/* Логотип */}
      <Link
        to="/admin"
        className="text-2xl font-extrabold tracking-wide hover:opacity-90 transition flex items-center gap-2"
      >
        <span className="text-[#ff5c8a]">BeautyBook</span>
        <span className="text-gray-500 text-lg font-medium">Admin</span>
      </Link>

      {/* Навігація */}
      <nav className="flex flex-wrap items-center justify-center md:justify-end gap-6 mt-3 md:mt-0 text-base font-medium">
        {[
          { to: "/admin", label: "Замовлення" },
          { to: "/admin/catalog", label: "Каталог послуг" },
          { to: "/admin/statistics", label: "Статистика" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`relative transition-all duration-300 ${
              isActive(to)
                ? "text-[#ff5c8a] font-semibold scale-105"
                : "text-gray-700"
            } hover:text-[#ff5c8a] hover:scale-105`}
          >
            {label}
            {isActive(to) && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#ff5c8a] rounded-full"></span>
            )}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="border border-[#ff5c8a] px-4 py-1.5 rounded-xl text-[#ff5c8a] hover:bg-[#ff5c8a] hover:text-white transition font-medium"
        >
          Вийти
        </button>
      </nav>
    </header>
  );
}
