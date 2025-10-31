import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { ShoppingBasket } from "lucide-react";

export default function Catalog() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  // Завантаження послуг
  const fetchServices = async () => {
    const querySnapshot = await getDocs(collection(db, "services"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setServices(data);
    setFilteredServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Пошук + сортування
  useEffect(() => {
    let filtered = services.filter((s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === "asc") {
      filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "desc") {
      filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredServices(filtered);
  }, [searchTerm, sortOrder, services]);

  // Додавання до кошика у localStorage
  const handleAddToCart = (service) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    // перевірка, чи вже додано
    if (storedCart.find((item) => item.id === service.id)) {
      Swal.fire({
        title: "Послугу вже додано!",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 1200,
        background: "#fff",
        color: "#ff5c8a",
      });
      return;
    }

    storedCart.push(service);
    localStorage.setItem("cart", JSON.stringify(storedCart));

    Swal.fire({
      title: "Додано в кошик!",
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 1200,
      background: "#fff",
      color: "#ff5c8a",
    });
  };

  return (
    <div className="min-h-screen bg-[#fff8fa] py-16 px-6">
      <h1 className="text-3xl font-bold text-center text-[#ff5c8a] mb-8">
        Каталог послуг
      </h1>

      {/* Пошук і фільтри */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Пошук за назвою..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-[#ffd6de] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition text-gray-700"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-[#ffd6de] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition text-gray-700 bg-white w-full md:w-1/4"
        >
          <option value="none">Без фільтру</option>
          <option value="asc">Дешевші спочатку</option>
          <option value="desc">Дорожчі спочатку</option>
        </select>
      </div>

      {/* Картки послуг */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="relative bg-white rounded-2xl shadow-md border border-[#ffd6de] overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-[#ff5c8a] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <p className="text-lg font-bold text-[#ff5c8a]">{service.price} ₴</p>
              </div>

              {/* Плюсик */}
              <button
                onClick={() => handleAddToCart(service)}
                className="absolute bottom-3 right-3 bg-white/90 text-[#ff5c8a] hover:bg-[#ff5c8a] hover:text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
                title="Додати в кошик"
              >
                <ShoppingBasket size={22} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Послуг не знайдено.
          </p>
        )}
      </div>
    </div>
  );
}
