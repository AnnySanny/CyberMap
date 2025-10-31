import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import AdminHeader from "../components/AdminHeader";
import AddServiceForm from "../components/AddServiceForm";

export default function AdminCatalog() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  // Отримання послуг з Firestore
  const fetchServices = async () => {
    const querySnapshot = await getDocs(collection(db, "services"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setServices(data);
    setFilteredServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Обробка пошуку
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

  // Видалення послуги
  const handleDelete = async (service) => {
    const result = await Swal.fire({
      title: "Видалити послугу?",
      html: `<p class="text-gray-700">"${service.title}" буде остаточно видалено.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Так, видалити",
      cancelButtonText: "Скасувати",
      confirmButtonColor: "#ff5c8a",
      cancelButtonColor: "#aaa",
      background: "#fff8fa",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "services", service.id));
        setServices((prev) => prev.filter((s) => s.id !== service.id));

        Swal.fire({
          title: "Видалено!",
          text: `Послугу "${service.title}" успішно видалено.`,
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          background: "#fff",
          color: "#ff5c8a",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Помилка при видаленні!",
          text: error.message,
          background: "#fff",
        });
      }
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-[#fff8fa] py-16 px-6">
        <h1 className="text-3xl font-bold text-center text-[#ff5c8a] mb-8">
          Каталог послуг
        </h1>

        {/* Кнопка додавання */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#ff8fa3] hover:bg-[#ff5c8a] text-white font-semibold px-8 py-3 rounded-xl shadow-md transition"
          >
            Додати послугу
          </button>
        </div>

        {/* Пошук і фільтри */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          {/* Поле пошуку */}
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 border border-[#ffd6de] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition text-gray-700"
          />

          {/* Сортування */}
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

        {/* Відображення карток послуг */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="relative bg-white rounded-2xl shadow-md border border-[#ffd6de] overflow-hidden hover:shadow-lg transition"
              >
                {/* Кнопка видалення */}
                <button
                  onClick={() => handleDelete(service)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-[#ff5c8a] hover:text-white text-[#ff5c8a] rounded-full w-8 h-8 flex items-center justify-center shadow-md transition"
                  title="Видалити"
                >
                  ✕
                </button>

                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[#ff5c8a] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {service.description}
                  </p>
                  <p className="text-lg font-bold text-[#ff5c8a]">
                    {service.price} ₴
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Послуг не знайдено.
            </p>
          )}
        </div>

        {/* Форма додавання */}
        {showForm && (
          <AddServiceForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              fetchServices();
              setShowForm(false);
            }}
          />
        )}
      </div>
    </>
  );
}
