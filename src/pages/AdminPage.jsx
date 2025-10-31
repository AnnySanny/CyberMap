import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import AdminHeader from "../components/AdminHeader";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Усі");
  const [priceSort, setPriceSort] = useState("none");

  // Отримати всі замовлення
  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setOrders(data);
    setFilteredOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Оновити статус
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire({
        title: "Статус оновлено!",
        toast: true,
        position: "bottom-end",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
        background: "#fff",
        color: "#ff5c8a",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Видалити замовлення
  const handleDelete = async (order) => {
    const result = await Swal.fire({
      title: "Видалити замовлення?",
      text: `${order.name} (${order.phone})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Так, видалити",
      cancelButtonText: "Скасувати",
      confirmButtonColor: "#ff5c8a",
      cancelButtonColor: "#aaa",
      background: "#fff8fa",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "orders", order.id));
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      Swal.fire({
        title: "Видалено!",
        icon: "success",
        showConfirmButton: false,
        timer: 1200,
        background: "#fff",
        color: "#ff5c8a",
      });
    }
  };

  // Фільтрація і сортування
  useEffect(() => {
    let data = [...orders];

    // Пошук
    if (search.trim() !== "") {
      data = data.filter(
        (order) =>
          order.name.toLowerCase().includes(search.toLowerCase()) ||
          order.phone.includes(search)
      );
    }

    // Фільтр за статусом
    if (statusFilter !== "Усі") {
      data = data.filter((order) => (order.status || "Очікує") === statusFilter);
    }

    // Сортування за ціною
    if (priceSort === "asc") {
      data.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (priceSort === "desc") {
      data.sort((a, b) => b.totalPrice - a.totalPrice);
    }

    setFilteredOrders(data);
  }, [search, statusFilter, priceSort, orders]);

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-[#fff8fa] py-16 px-6">
        <h1 className="text-3xl font-bold text-center text-[#ff5c8a] mb-8">
          Замовлення
        </h1>

        {/* Пошук і фільтри */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Пошук за ім’ям або телефоном..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 border border-[#ffd6de] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/50 transition"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#ffd6de] text-[#ff5c8a] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition"
          >
            <option value="Усі">Усі статуси</option>
            <option value="Очікує">Очікує виконання</option>
            <option value="Виконано">Виконано</option>
            <option value="Скасовано">Скасовано</option>
          </select>

          <select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="border border-[#ffd6de] text-[#ff5c8a] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition"
          >
            <option value="none">Без сортування</option>
            <option value="asc">Від дешевших</option>
            <option value="desc">Від дорожчих</option>
          </select>
        </div>

        {/* Картки замовлень */}
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            Замовлень не знайдено.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="relative bg-white rounded-2xl shadow-md border border-[#ffd6de] overflow-hidden hover:shadow-lg transition p-6 flex flex-col justify-between"
              >
                {/* Видалення */}
                <button
                  onClick={() => handleDelete(order)}
                  className="absolute top-3 right-3 bg-white/90 text-[#ff5c8a] hover:bg-[#ff5c8a] hover:text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition"
                  title="Видалити"
                >
                  ✕
                </button>

                <div className="space-y-2 mb-3">
                  <p className="text-sm text-gray-500">
                    <strong>Дата:</strong>{" "}
                    {new Date(order.createdAt?.seconds * 1000).toLocaleString("uk-UA")}
                  </p>
                  <p className="font-semibold text-[#ff5c8a] text-lg">{order.name}</p>
                  <p className="text-gray-700 text-sm">{order.phone}</p>
                </div>

                <div className="bg-[#fff5f7] border border-[#ffd6de] rounded-xl p-3 text-gray-700 text-sm space-y-1 mb-3">
                  {order.services?.map((s, i) => (
                    <p key={i}>• {s}</p>
                  ))}
                  <hr className="my-2 border-[#ffd6de]" />
                  <p className="font-bold text-gray-500">
                    Загальна сума:{" "}
                    <span className="text-[#ff5c8a]">{order.totalPrice} ₴</span>
                  </p>
                </div>

                {/* Керування статусом */}
                <div className="flex items-center justify-between">
                  <select
                    value={order.status || "Очікує"}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-[#ffd6de] text-gray-500 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60 transition"
                  >
                    <option value="Очікує">Очікує виконання</option>
                    <option value="Виконано">Виконано</option>
                    <option value="Скасовано">Скасовано</option>
                  </select>

                  <div>
                    {order.status === "Виконано" && (
                      <CheckCircle className="text-green-500" size={22} />
                    )}
                    {order.status === "Очікує" && (
                      <Clock className="text-yellow-500" size={22} />
                    )}
                    {order.status === "Скасовано" && (
                      <XCircle className="text-red-500" size={22} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
