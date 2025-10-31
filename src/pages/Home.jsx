import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRightCircle,
  Heart,
  Clock,
} from "lucide-react";

export default function Home() {


  return (
    <div className="bg-[#fff5f7] text-[#4b2c20] font-['Outfit',sans-serif] overflow-hidden">
      
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-28 px-6 bg-[#fff0f5]">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-[#ff3f70] tracking-tight">
          BeautyBook
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 leading-relaxed text-[#5a2f35]">
          Ваш онлайн-салон краси — бронюйте послуги швидко, зручно і з любов’ю до себе.
        </p>
        <Link
            to="/dashboard/catalog"
          className="inline-flex items-center gap-2 bg-[#ff9aa2] text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-[#ff7a89] hover:scale-105 transition-transform duration-300"
        >
          Перейти до каталогу <ArrowRightCircle />
        </Link>
      </section>
<section className="py-28 px-6 md:px-20 bg-[#fff8fa] text-center">
  <h2 className="text-4xl font-bold mb-16 text-[#ff5c8a] tracking-tight">
    Популярні послуги
  </h2>

  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {[
      {
        title: "Манікюр та педикюр",
        img: "https://img.tsn.ua/cached/478/tsn-2e5933e84c8f120777c30b7610ecadcd/thumbs/1200x630/b2/00/f7c639e2dcc08074c8afdc8190a300b2.jpeg",
      },
      {
        title: "Брови та вії",
        img: "https://orthomol.life/image/cache/catalog/image/catalog/blogtanya/bt-69/beautiful-girl-face-perfect-skin(2).webp",
      },
      {
        title: "Макіяж",
        img: "https://ezebra.iai-shop.com/data/include/cms/BLOG-UA/Makijaz-na-kazdy-dzien/2_2.jpg",
      },
    ].map((s, i) => (
      <div
        key={i}
        className="relative overflow-hidden rounded-3xl group shadow-md hover:shadow-xl transition duration-500 cursor-pointer"
      >
        <img
          src={s.img}
          alt={s.title}
          className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff9aa2cc] via-[#ffb6b980] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 right-0 text-white text-center p-6 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500">
          <h3 className="text-2xl font-semibold mb-2 drop-shadow-lg">{s.title}</h3>
          <p className="text-sm opacity-90">Ніжність, догляд і стиль у кожній деталі</p>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-8 bg-[#fff0f5] text-center">
        <h2 className="text-4xl font-bold mb-12 text-[#7b3b46]">Як це працює?</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            {
              step: "1",
              title: "Обираєте послугу",
              icon: <Heart size={36} />,
              text: "Перегляньте каталог процедур і додайте бажані в кошик.",
            },
            {
              step: "2",
              title: "Заповнюєте форму",
              icon: <Sparkles size={36} />,
              text: "Вкажіть контактні дані, оберіть час і підтвердьте бронювання.",
            },
            {
              step: "3",
              title: "Очікуєте підтвердження",
              icon: <Clock size={36} />,
              text: "Адміністратор зв’яжеться з вами для уточнення деталей.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="relative bg-white border border-[#ffd7d7] rounded-2xl p-10 shadow-md hover:shadow-xl transition"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#ff9aa2] text-white w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold shadow-md">
                {step.step}
              </div>
              <div className="flex justify-center mb-4 text-[#ff9aa2]">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-[#7b3b46]">
                {step.title}
              </h3>
              <p className="text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-white">
        <h2 className="text-4xl font-bold mb-4 text-[#7b3b46] leading-snug">
          Готові подарувати собі красу?
        </h2>
        <p className="max-w-xl mx-auto text-[#5a2f35] mb-10 text-lg leading-relaxed">
          BeautyBook — це легкий спосіб записатися на улюблені процедури без дзвінків і очікування.  
          Краса починається з турботи про себе.
        </p>
        <Link
          to="/dashboard/catalog"
          className="inline-flex items-center gap-2 bg-[#ff9aa2] text-white px-10 py-4 rounded-full font-semibold shadow-md hover:bg-[#ff7a89] transition"
        >
          Переглянути послуги <ArrowRightCircle />
        </Link>
      </section>
    </div>
  );
}
