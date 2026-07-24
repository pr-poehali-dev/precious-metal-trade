import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import MiniChart from "@/components/metals/MiniChart";
import LargeChart from "@/components/metals/LargeChart";
import { METALS } from "@/data/metals";

interface HomeSectionProps {
  getPrice: (id: string, type: "buy" | "sell") => number;
  exchangeOnline: boolean | null;
  goldHistory: number[];
  silverHistory: number[];
  usdRate: number | null;
  usdOpen: number | null;
  usdHistory: number[];
  usdtRate: number | null;
  selectedMetal: typeof METALS[0];
  setSelectedMetal: (m: typeof METALS[0]) => void;
}

const HomeSection = ({
  getPrice,
  exchangeOnline,
  goldHistory,
  silverHistory,
  usdRate,
  usdOpen,
  usdHistory,
  usdtRate,
  selectedMetal,
  setSelectedMetal,
}: HomeSectionProps) => {
  const navigate = useNavigate();
  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-10 md:pt-20 md:pb-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-6">Профессиональная торговля драгоценными металлами</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-[#1A1410] leading-tight mb-6">
            Драгоценные<br />
            <em className="text-[#A07830] not-italic">металлы</em><br />
            высшей пробы
          </h1>
          <p className="font-body text-[#6b5e52] leading-relaxed mb-8 max-w-sm">
            Золото и серебро с гарантией качества. Живые котировки, сертифицированные слитки.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/catalog")}
              className="flex-1 md:flex-none bg-[#A07830] text-white font-body text-sm px-8 py-3 tracking-wider hover:bg-[#8a6428] transition-colors"
            >
              Купить
            </button>
            <button
              onClick={() => navigate("/sell")}
              className="flex-1 md:flex-none border border-[#A07830] text-[#A07830] font-body text-sm px-8 py-3 tracking-wider hover:bg-[#A07830] hover:text-white transition-colors"
            >
              Продать
            </button>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/bucket/27e32109-547e-4435-8d1b-a437f15f66c9.jpg"
            alt="Золотые слитки"
            className="w-full aspect-square object-cover object-top"
          />
          <div className="absolute -bottom-4 -left-4 bg-white border border-[#ede8df] p-4 shadow-lg">
            <p className="font-body text-xs text-[#9e9080] tracking-widest mb-1">ЗОЛОТО · XAU</p>
            <p className="font-display text-2xl text-[#1A1410]">{getPrice("gold", "buy").toLocaleString("ru-RU")} ₽</p>
            <p className="font-body text-xs text-green-600">▲ +1.24% сегодня</p>
          </div>
        </div>
      </section>

      {/* Live Prices */}
      <section className="bg-white border-y border-[#ede8df] py-8 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6 md:mb-10">
            <div>
              <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-2">Live</p>
              <h2 className="font-display text-2xl md:text-4xl text-[#1A1410]">Котировки в реальном времени</h2>
            </div>
            <div className="flex items-center gap-2 text-[#9e9080]">
              <div className={`w-2 h-2 rounded-full ${exchangeOnline === null ? "bg-gray-400" : exchangeOnline ? "bg-green-500 animate-pulse" : "bg-amber-400"}`} />
              <span className="font-body text-xs tracking-widest hidden md:inline">
                {exchangeOnline === null ? "Загрузка..." : exchangeOnline ? "Обновляется каждую минуту" : "Биржа закрыта"}
              </span>
            </div>
          </div>
          {exchangeOnline === false && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 px-4 py-3 mb-6 text-amber-800">
              <Icon name="Clock" size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
              <p className="font-body text-xs leading-relaxed">
                Московская биржа сейчас закрыта. Отображаются последние актуальные котировки — они могут не отражать текущий рынок. Торги проходят в будние дни с 10:00 до 23:50.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {METALS.map((m) => {
              const history = m.id === 'gold' ? goldHistory : silverHistory;
              const chartPts = history.length > 1 ? history : m.chartPoints;
              const lastPrice = getPrice(m.id, "buy");
              const firstPrice = chartPts[0] ?? lastPrice;
              const up = lastPrice >= firstPrice;
              return (
                <div key={m.id} className="bg-white border border-[#ede8df] p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-body text-xs text-[#9e9080] tracking-widest uppercase mb-1">{m.symbol}</p>
                      <h3 className="font-display text-2xl text-[#1A1410]">{m.name}</h3>
                    </div>
                    <MiniChart points={chartPts} up={up} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-display text-3xl font-light text-[#1A1410]">
                        {getPrice(m.id, "buy").toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                      </p>
                      <p className="font-body text-xs text-[#9e9080] mt-0.5">{m.unit}</p>
                    </div>
                    <span className={`text-sm font-body font-medium ${up ? "text-green-600" : "text-red-500"}`}>
                      {up ? "+" : ""}{m.change}%
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Курс доллара */}
            {usdRate && (() => {
              const usdChange = usdOpen && usdOpen > 0 ? +((usdRate - usdOpen) / usdOpen * 100).toFixed(2) : 0;
              const usdUp = usdChange >= 0;
              const points = usdHistory.length >= 2 ? usdHistory : [usdRate, usdRate];
              return (
                <div className="bg-white border border-[#ede8df] p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-body text-xs text-[#9e9080] tracking-widest uppercase mb-1">USD/RUB</p>
                      <h3 className="font-display text-2xl text-[#1A1410]">Доллар</h3>
                    </div>
                    <MiniChart points={points} up={usdUp} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="font-display text-3xl font-light text-[#1A1410]">
                        {usdRate.toLocaleString("ru-RU", { minimumFractionDigits: 4 })} ₽
                      </p>
                      <p className="font-body text-xs text-[#9e9080] mt-0.5">за 1 доллар</p>
                    </div>
                    <span className={`text-sm font-body font-medium ${usdUp ? "text-green-600" : "text-red-500"}`}>
                      {usdUp ? "+" : ""}{usdChange}%
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Карточка USDT */}
            {usdtRate && (
              <div className="bg-white border border-[#ede8df] p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-body text-xs text-[#9e9080] tracking-widest uppercase mb-1">USDT/RUB</p>
                    <h3 className="font-display text-2xl text-[#1A1410]">Tether</h3>
                  </div>
                  <span className="font-body text-[10px] text-[#A07830] tracking-widest border border-[#ede8df] px-2 py-1">CoinGecko</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-display text-3xl font-light text-[#1A1410]">
                      {usdtRate.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                    </p>
                    <p className="font-body text-xs text-[#9e9080] mt-0.5">за 1 USDT</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="max-w-6xl mx-auto px-6 py-8 md:py-16">
        <div className="mb-6 md:mb-8">
          <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-2">Динамика цен</p>
          <h2 className="font-display text-2xl md:text-4xl text-[#1A1410]">График за 30 дней</h2>
        </div>
        <div className="flex gap-3 mb-8 flex-wrap">
          {METALS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMetal(m)}
              className={`font-body text-xs px-4 py-2 tracking-widest border transition-colors ${selectedMetal.id === m.id ? "bg-[#A07830] text-white border-[#A07830]" : "border-[#ede8df] text-[#9e9080] hover:border-[#A07830] hover:text-[#A07830]"}`}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="bg-white border border-[#ede8df] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display text-2xl md:text-4xl text-[#1A1410]">
                {getPrice(selectedMetal.id, "buy").toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
              </p>
              <p className="font-body text-sm text-[#9e9080] mt-1">{selectedMetal.unit}</p>
            </div>
            <span className={`font-body text-sm font-medium ${selectedMetal.change >= 0 ? "text-green-600" : "text-red-500"}`}>
              {selectedMetal.change >= 0 ? "+" : ""}{selectedMetal.change}% за 30 дней
            </span>
          </div>
          <LargeChart metal={selectedMetal} history={selectedMetal.id === 'gold' ? goldHistory : silverHistory} key={selectedMetal.id} />
          <div className="flex justify-between mt-2">
            {["30 дн. назад", "20 дн.", "10 дн.", "Сегодня"].map(l => (
              <span key={l} className="font-body text-xs text-[#c0b8ae]">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-20 mb-20 px-6">
        <div className="bg-[#1A1410] p-6 md:p-12 max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-4xl text-white text-center mb-8 md:mb-12">Почему выбирают нас</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: "ShieldCheck", title: "Полная гарантия и прозрачность сделки", desc: "Каждая сделка документируется от начала до конца. Никаких скрытых условий — только честные договорённости." },
            { icon: "TrendingUp", title: "Лучшие котировки", desc: "Цены обновляются в реальном времени. Мы работаем с минимальными спредами на рынке." },
            { icon: "Lock", title: "Безопасная сделка", desc: "Гарантия конфиденциальности на каждом этапе. Ваши данные и условия сделки остаются строго между нами." },
          ].map(f => (
            <div key={f.title} className="text-center">
              <div className="w-12 h-12 border border-[#A07830] flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Icon name={f.icon} fallback="Star" size={20} className="text-[#C8A050]" />
              </div>
              <h3 className="font-display text-lg md:text-2xl text-white mb-2 md:mb-3">{f.title}</h3>
              <p className="font-body text-xs md:text-sm text-[#9e9080] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>
    </main>
  );
};

export default HomeSection;