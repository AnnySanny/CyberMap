import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-6 bg-[#0A0F1F] overflow-hidden">

      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#2a335080_1px,transparent_1px),linear-gradient(to_bottom,#2a335080_1px,transparent_1px)] bg-[size:40px_40px]"></div>


      <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight relative z-10">
        CyberMap
      </h1>

      <p className="text-white/70 max-w-2xl text-center text-lg md:text-xl mb-10 leading-relaxed relative z-10">
        CyberMap — це інтерактивна 3D-система візуалізації кіберпростору, яка 
        відображає глобальні кіберінциденти, кластери шкідливого ПЗ та 
        моделі атак, використовуючи штучний інтелект для аналізу логів, 
        кластеризації та побудови динамічної мапи загроз.
      </p>

    
      <Link
        to="/map"
        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-semibold transition-all relative z-10"
      >
        Перейти до мапи
      </Link>

    </div>
  );
}
