import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeColor = "#ff5c8a";
  const baseColor = "#ff5c8a";

  const links = [
    { to: "/", label: "Головна" },
    { to: "/dashboard/catalog", label: "Каталог" },
    { to: "/dashboard/cart", label: "Кошик" },
    { to: "/login", label: "Адміністрування" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header className="bg-[#fff0f5] shadow-md py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between rounded-b-2xl sticky top-0 z-50">
      {/* ЛОГОТИП */}
      <Link
        to="/"
        className="text-3xl font-extrabold tracking-wide hover:opacity-90 transition flex items-center gap-2"
      >
        <span className="text-[#ff5c8a]">BeautyBook</span>
      </Link>

      {/* НАВІГАЦІЯ */}
      <nav className="flex flex-wrap items-center justify-center md:justify-end gap-6 mt-3 md:mt-0 text-base font-medium">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`relative transition-all duration-300 ${
              isActive(to)
                ? `text-[${activeColor}] font-semibold scale-105`
                : `text-[${baseColor}]`
            } hover:text-[${activeColor}] hover:scale-105`}
          >
            {label}
            {isActive(to) && (
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#ff5c8a] rounded-full"></span>
            )}
          </Link>
        ))}

        {user && (
          <button
            onClick={handleLogout}
            className="ml-4 border border-[#ff5c8a] px-4 py-1.5 rounded-xl text-[#ff5c8a] hover:bg-[#ff5c8a] hover:text-white transition"
          >
            Вийти
          </button>
        )}
      </nav>
    </header>
  );
}
