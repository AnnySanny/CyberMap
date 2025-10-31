import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    datetime: "",
  });
  const [total, setTotal] = useState(0);

  // Отримуємо товари з localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

    const sum = storedCart.reduce((acc, item) => acc + Number(item.price), 0);
    setTotal(sum);
  }, []);

  // Видалення товару
  const handleRemove = (id, title) => {
    Swal.fire({
      title: "Видалити послугу?",
      text: `"${title}" буде видалено з кошика.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Так, видалити",
      cancelButtonText: "Скасувати",
      confirmButtonColor: "#ff5c8a",
      cancelButtonColor: "#aaa",
      background: "#fff8fa",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCart = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        const sum = updatedCart.reduce(
          (acc, item) => acc + Number(item.price),
          0
        );
        setTotal(sum);

        Swal.fire({
          title: "Видалено!",
          text: "Послугу успішно видалено з кошика.",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          background: "#fff",
          color: "#ff5c8a",
        });
      }
    });
  };

  // Обробка зміни полів
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Збереження замовлення
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.datetime || cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Заповніть усі поля!",
        background: "#fff",
        color: "#ff5c8a",
      });
      return;
    }

    const orderData = {
      name: form.name,
      phone: form.phone,
      datetime: form.datetime,
      services: cartItems.map((s) => `${s.title} — ${s.price} ₴`),
      totalPrice: total,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      Swal.fire({
        title: "Замовлення успішно оформлено!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        background: "#fff",
        color: "#ff5c8a",
      });

      // очищення форми і кошика
      setForm({ name: "", phone: "", datetime: "" });
      setCartItems([]);
      setTotal(0);
      localStorage.removeItem("cart");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Помилка при збереженні!",
        text: error.message,
        background: "#fff",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8fa] py-16 px-6">
      <h1 className="text-3xl font-bold text-center text-[#ff5c8a] mb-8">
        Кошик
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Ваш кошик порожній.</p>
      ) : (
        <>
          {/* Список товарів */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl shadow-md border border-[#ffd6de] overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[#ff5c8a] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>
                  <p className="text-lg font-bold text-[#ff5c8a]">
                    {item.price} ₴
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.id, item.title)}
                  className="absolute bottom-3 right-3 bg-white/90 text-[#ff5c8a] hover:bg-[#ff5c8a] hover:text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
                  title="Видалити з кошика"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Форма оформлення */}
          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg border border-[#ffd6de] p-8">
            <h2 className="text-2xl font-bold text-center text-[#ff5c8a] mb-6">
              Оформлення замовлення
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-[#ff5c8a] mb-1">
                  Прізвище та ім’я
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Введіть своє ім’я та прізвище"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-[#ffc9d4] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8fa3] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ff5c8a] mb-1">
                  Контактний номер телефону
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+380..."
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-[#ffc9d4] p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8fa3] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#ff5c8a] mb-1">
                  Дата та час
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="datetime"
                    value={form.datetime}
                    min={new Date().toISOString().slice(0, 16)} 
                    onChange={(e) => {
                      const value = e.target.value;
                      const date = new Date(value);
                      const day = date.getDay(); 
                      const hours = date.getHours();
                      if (day === 0) {
                        Swal.fire({
                          icon: "warning",
                          title: "Ми не працюємо у неділю!",
                          background: "#fff",
                          color: "#ff5c8a",
                          timer: 1500,
                          showConfirmButton: false,
                        });
                        e.target.value = "";
                        return;
                      }
                      if (hours < 9 || hours >= 19) {
                        Swal.fire({
                          icon: "warning",
                          title: "Доступний час: 09:00 — 19:00",
                          background: "#fff",
                          color: "#ff5c8a",
                          timer: 1500,
                          showConfirmButton: false,
                        });
                        e.target.value = "";
                        return;
                      }

                      handleChange(e);
                    }}
                    className="w-full border border-[#ffc9d4] p-3 rounded-xl bg-white shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3] transition hover:shadow-md
                 text-gray-700 accent-[#ff5c8a]"
                    style={{
                      accentColor: "#ff5c8a",
                    }}
                    required
                  />
                </div>
              </div>

              {/* Список послуг */}
              <div>
                <label className="block text-sm font-medium text-[#ff5c8a] mb-1">
                  Обрані послуги
                </label>
                <div className="bg-[#fff5f7] border border-[#ffd6de] rounded-xl p-3 text-gray-700 text-sm space-y-1">
                  {cartItems.map((item) => (
                    <p key={item.id}>
                      • {item.title} — {item.price} ₴
                    </p>
                  ))}
                  <hr className="my-2 border-[#ffd6de]" />
                  <p className="font-bold text-[#ff5c8a]">
                    Загальна сума: {total} ₴
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#ff8fa3] hover:bg-[#ff5c8a] transition text-white font-semibold py-3 rounded-xl shadow-md mt-4"
              >
                Зберегти замовлення
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
