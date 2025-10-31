import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminHeader from "../components/AdminHeader";

export default function AdminStat() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };
    fetchOrders();
  }, []);

  // === Дані для графіків ===
  const замовленняЗаСтатусом = [
    { назва: "Виконано", кількість: orders.filter(o => o.status === "Виконано").length },
    { назва: "Очікує", кількість: orders.filter(o => o.status === "Очікує").length },
    { назва: "Скасовано", кількість: orders.filter(o => o.status === "Скасовано").length },
  ];

  const КОЛЬОРИ = ["#ff5c8a", "#ff8fa3", "#ffd6de"];

  const замовленняЗаДатою = orders.reduce((acc, o) => {
    const дата = new Date(o.createdAt?.seconds * 1000).toLocaleDateString("uk-UA");
    acc[дата] = (acc[дата] || 0) + 1;
    return acc;
  }, {});
  const даніЛінії = Object.entries(замовленняЗаДатою).map(([дата, кількість]) => ({
    дата,
    кількість,
  }));

  const середняЦінаЗаДатою = orders.reduce((acc, o) => {
    const дата = new Date(o.createdAt?.seconds * 1000).toLocaleDateString("uk-UA");
    acc[дата] = acc[дата] || { сума: 0, кількість: 0 };
    acc[дата].сума += o.totalPrice || 0;
    acc[дата].кількість++;
    return acc;
  }, {});
  const даніСтовпчиків = Object.entries(середняЦінаЗаДатою).map(([дата, val]) => ({
    дата,
    "Середня ціна": Math.round(val.сума / val.кількість),
  }));

  const сумаПоМісяцях = orders.reduce((acc, o) => {
    const місяць = new Date(o.createdAt?.seconds * 1000).toLocaleString("uk-UA", {
      month: "short",
    });
    acc[місяць] = (acc[місяць] || 0) + (o.totalPrice || 0);
    return acc;
  }, {});
  const даніПлощі = Object.entries(сумаПоМісяцях).map(([місяць, сума]) => ({
    місяць,
    сума,
  }));

  // === Підсумкова статистика ===
  const totalOrders = orders.length;
  const totalSum = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const completed = orders.filter((o) => o.status === "Виконано").length;
  const pending = orders.filter((o) => o.status === "Очікує").length;
  

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-[#fff8fa] py-16 px-6">
        <h1 className="text-3xl font-bold text-center text-[#ff5c8a] mb-10">
          Статистика замовлень
        </h1>

        {/* Підсумкові картки */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {[
            { label: "Усього замовлень", value: totalOrders },
            { label: "Загальна сума", value: `${totalSum} ₴` },
            { label: "Виконано", value: completed },
            { label: "Очікує", value: pending },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#ffd6de] p-6 shadow-md text-center hover:shadow-lg transition"
            >
              <p className="text-[#ff8fa3] text-sm font-medium mb-2">
                {card.label}
              </p>
              <h3 className="text-2xl font-bold text-[#ff5c8a]">{card.value}</h3>
            </div>
          ))}
        </div>

        {/* Графіки */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* 1. Лінійний графік — кількість замовлень */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-[#ffd6de]">
            <h3 className="text-[#ff5c8a] font-semibold mb-4 text-center">
              Кількість замовлень по днях
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={даніЛінії}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffd6de" />
                <XAxis dataKey="дата" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="кількість" stroke="#ff5c8a" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Кругова діаграма — статуси */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-[#ffd6de]">
            <h3 className="text-[#ff5c8a] font-semibold mb-4 text-center">
              Розподіл замовлень за статусом
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={замовленняЗаСтатусом}
                  dataKey="кількість"
                  nameKey="назва"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {замовленняЗаСтатусом.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={КОЛЬОРИ[index % КОЛЬОРИ.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 3. Стовпчикова — середня ціна */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-[#ffd6de]">
            <h3 className="text-[#ff5c8a] font-semibold mb-4 text-center">
              Середня ціна замовлень по днях
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={даніСтовпчиків}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffd6de" />
                <XAxis dataKey="дата" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Середня ціна" fill="#ff8fa3" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 4. Area — загальна сума по місяцях */}
          <div className="bg-white p-6 rounded-3xl shadow-md border border-[#ffd6de]">
            <h3 className="text-[#ff5c8a] font-semibold mb-4 text-center">
              Загальна сума замовлень по місяцях
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={даніПлощі}>
                <defs>
                  <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5c8a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff5c8a" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="місяць" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="сума"
                  stroke="#ff5c8a"
                  fillOpacity={1}
                  fill="url(#colorPink)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
