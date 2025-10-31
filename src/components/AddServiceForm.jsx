import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function AddServiceForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "services"), {
        title: form.title,
        description: form.description,
        image: form.image,
        price: form.price,
        createdAt: new Date(),
      });

      Swal.fire({
        icon: "success",
        title: "Послугу успішно додано!",
        timer: 1000,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Помилка при збереженні!",
        text: err.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative border border-[#ffd6de]">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-[#ff5c8a] text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-[#ff5c8a] mb-6">
          Додати нову послугу
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="title"
            placeholder="Назва послуги"
            value={form.title}
            onChange={handleChange}
            className="border border-[#ffd6de] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60"
            required
          />

          <textarea
            name="description"
            placeholder="Короткий опис"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="border border-[#ffd6de] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60"
            required
          ></textarea>

          <input
            type="url"
            name="image"
            placeholder="Посилання на фото"
            value={form.image}
            onChange={handleChange}
            className="border border-[#ffd6de] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Ціна (₴)"
            value={form.price}
            onChange={handleChange}
            className="border border-[#ffd6de] rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#ff8fa3]/60"
            required
          />

          <button
            type="submit"
            className="bg-[#ff8fa3] hover:bg-[#ff5c8a] text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            Зберегти
          </button>
        </form>
      </div>
    </div>
  );
}
