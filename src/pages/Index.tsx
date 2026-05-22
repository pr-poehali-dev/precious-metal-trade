import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const METALS = [
  {
    id: "gold",
    name: "Золото",
    symbol: "XAU",
    price: 7842.50,
    change: +1.24,
    unit: "за грамм",
    img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/9f8fc474-95d4-4d76-9e4b-ff5bed8c09e8.jpg",
    desc: "Инвестиционное золото высшей пробы 999.9. Мерные слитки и монеты.",
    purity: "999.9",
    minWeight: "1 г",
    chartPoints: [120, 118, 125, 122, 130, 128, 135, 133, 140, 138, 145],
  },
  {
    id: "silver",
    name: "Серебро",
    symbol: "XAG",
    price: 92.30,
    change: -0.47,
    unit: "за грамм",
    img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/e29aa351-29f9-429b-bf8d-575ff5280a0e.jpg",
    desc: "Серебро 999 пробы в слитках и монетах. Промышленное и инвестиционное.",
    purity: "999",
    minWeight: "10 г",
    chartPoints: [100, 98, 102, 99, 97, 95, 96, 94, 93, 92, 92],
  },
  {
    id: "platinum",
    name: "Платина",
    symbol: "XPT",
    price: 3124.80,
    change: +0.82,
    unit: "за грамм",
    img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/35721be2-bcf0-4960-95df-989eebdc646d.jpg",
    desc: "Платина 950 пробы. Редкий металл для серьёзных инвесторов.",
    purity: "950",
    minWeight: "5 г",
    chartPoints: [95, 97, 96, 98, 100, 99, 101, 103, 102, 104, 105],
  },
  {
    id: "palladium",
    name: "Палладий",
    symbol: "XPD",
    price: 5680.20,
    change: +2.14,
    unit: "за грамм",
    img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/35721be2-bcf0-4960-95df-989eebdc646d.jpg",
    desc: "Палладий 999.5 пробы. Один из самых ценных металлов платиновой группы.",
    purity: "999.5",
    minWeight: "5 г",
    chartPoints: [80, 85, 82, 88, 86, 90, 92, 91, 95, 98, 102],
  },
];

function MiniChart({ points, up }: { points: number[]; up: boolean }) {
  const w = 80, h = 32;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / range) * (h - 4) - 2);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={d} stroke={up ? "#2d7a4f" : "#c0392b"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LargeChart({ metal }: { metal: typeof METALS[0] }) {
  const w = 600, h = 120;
  const points = metal.chartPoints;
  const min = Math.min(...points) - 2;
  const max = Math.max(...points) + 2;
  const range = max - min;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / range) * (h - 8) - 4);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${d} L${w},${h} L0,${h} Z`;
  const up = metal.change >= 0;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="none" preserveAspectRatio="none" className="w-full h-28">
      <defs>
        <linearGradient id={`grad-${metal.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? "#2d7a4f" : "#c0392b"} stopOpacity="0.12" />
          <stop offset="100%" stopColor={up ? "#2d7a4f" : "#c0392b"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#grad-${metal.id})`} />
      <path d={d} stroke={up ? "#2d7a4f" : "#c0392b"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Section = "home" | "catalog" | "about" | "contacts";

const Index = () => {
  const [active, setActive] = useState<Section>("home");
  const [selectedMetal, setSelectedMetal] = useState(METALS[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prices, setPrices] = useState(METALS.map(m => m.price));

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => +(p * (1 + (Math.random() - 0.5) * 0.002)).toFixed(2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nav: { key: Section; label: string }[] = [
    { key: "home", label: "Главная" },
    { key: "catalog", label: "Каталог" },
    { key: "about", label: "О компании" },
    { key: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Ticker */}
      <div className="bg-[#1A1410] text-[#C8A050] py-2 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...METALS, ...METALS].map((m, i) => (
            <span key={i} className="font-body text-xs tracking-widest mx-8">
              {m.symbol}&nbsp;
              <span className="text-white font-medium">
                {prices[i % 4]?.toLocaleString("ru-RU", { minimumFractionDigits: 2 }) ?? m.price.toLocaleString("ru-RU")} ₽
              </span>
              &nbsp;
              <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
                {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#ede8df] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setActive("home")} className="text-left">
            <span className="font-display text-2xl text-[#1A1410] tracking-tight">Аурум</span>
            <span className="font-display text-2xl text-[#A07830]">Металл</span>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {nav.map(n => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className={`font-body text-sm tracking-wider transition-colors ${active === n.key ? "text-[#A07830]" : "text-[#9e9080] hover:text-[#1A1410]"}`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setActive("contacts")}
            className="hidden md:block bg-[#A07830] text-white font-body text-sm px-5 py-2 tracking-wider hover:bg-[#8a6428] transition-colors"
          >
            Купить
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#ede8df] px-6 py-4 flex flex-col gap-4">
            {nav.map(n => (
              <button
                key={n.key}
                onClick={() => { setActive(n.key); setMenuOpen(false); }}
                className={`font-body text-sm tracking-wider text-left ${active === n.key ? "text-[#A07830]" : "text-[#9e9080]"}`}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HOME */}
      {active === "home" && (
        <main>
          <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-6">Профессиональная торговля</p>
              <h1 className="font-display text-6xl md:text-7xl text-[#1A1410] leading-tight mb-6">
                Драгоценные<br />
                <em className="text-[#A07830] not-italic">металлы</em><br />
                высшей пробы
              </h1>
              <p className="font-body text-[#6b5e52] leading-relaxed mb-8 max-w-sm">
                Золото, серебро, платина и палладий с гарантией качества. Живые котировки, сертифицированные слитки.
              </p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setActive("catalog")}
                  className="bg-[#A07830] text-white font-body text-sm px-8 py-3 tracking-wider hover:bg-[#8a6428] transition-colors"
                >
                  Перейти в каталог
                </button>
                <button
                  onClick={() => setActive("about")}
                  className="border border-[#A07830] text-[#A07830] font-body text-sm px-8 py-3 tracking-wider hover:bg-[#A07830] hover:text-white transition-colors"
                >
                  О нас
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/9f8fc474-95d4-4d76-9e4b-ff5bed8c09e8.jpg"
                alt="Золотые слитки"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white border border-[#ede8df] p-4 shadow-lg">
                <p className="font-body text-xs text-[#9e9080] tracking-widest mb-1">ЗОЛОТО · XAU</p>
                <p className="font-display text-2xl text-[#1A1410]">{prices[0].toLocaleString("ru-RU")} ₽</p>
                <p className="font-body text-xs text-green-600">▲ +1.24% сегодня</p>
              </div>
            </div>
          </section>

          {/* Live Prices */}
          <section className="bg-white border-y border-[#ede8df] py-16">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-2">Live</p>
                  <h2 className="font-display text-4xl text-[#1A1410]">Котировки в реальном времени</h2>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[#9e9080]">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-body text-xs tracking-widest">Обновляется каждые 3 с</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {METALS.map((m, i) => {
                  const up = m.change >= 0;
                  return (
                    <div key={m.id} className="bg-white border border-[#ede8df] p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-body text-xs text-[#9e9080] tracking-widest uppercase mb-1">{m.symbol}</p>
                          <h3 className="font-display text-2xl text-[#1A1410]">{m.name}</h3>
                        </div>
                        <MiniChart points={m.chartPoints} up={up} />
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-display text-3xl font-light text-[#1A1410]">
                            {prices[i].toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
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
              </div>
            </div>
          </section>

          {/* Chart Section */}
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="mb-8">
              <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-2">Динамика цен</p>
              <h2 className="font-display text-4xl text-[#1A1410]">График за 30 дней</h2>
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
                  <p className="font-display text-4xl text-[#1A1410]">
                    {prices[METALS.findIndex(m => m.id === selectedMetal.id)].toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                  </p>
                  <p className="font-body text-sm text-[#9e9080] mt-1">{selectedMetal.unit}</p>
                </div>
                <span className={`font-body text-sm font-medium ${selectedMetal.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {selectedMetal.change >= 0 ? "+" : ""}{selectedMetal.change}% за 30 дней
                </span>
              </div>
              <LargeChart metal={selectedMetal} key={selectedMetal.id} />
              <div className="flex justify-between mt-2">
                {["30 дн. назад", "20 дн.", "10 дн.", "Сегодня"].map(l => (
                  <span key={l} className="font-body text-xs text-[#c0b8ae]">{l}</span>
                ))}
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-[#1A1410] py-20">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-display text-5xl text-white text-center mb-16">Почему выбирают нас</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: "ShieldCheck", title: "Сертификаты качества", desc: "Все металлы сопровождаются официальными документами и сертификатами соответствия ГОСТ." },
                  { icon: "TrendingUp", title: "Лучшие котировки", desc: "Цены обновляются в реальном времени. Мы работаем с минимальными спредами на рынке." },
                  { icon: "Truck", title: "Безопасная доставка", desc: "Инкассация и доставка по всей России. Полное страхование при транспортировке." },
                ].map(f => (
                  <div key={f.title} className="text-center">
                    <div className="w-12 h-12 border border-[#A07830] flex items-center justify-center mx-auto mb-6">
                      <Icon name={f.icon} fallback="Star" size={20} className="text-[#C8A050]" />
                    </div>
                    <h3 className="font-display text-2xl text-white mb-3">{f.title}</h3>
                    <p className="font-body text-sm text-[#9e9080] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* CATALOG */}
      {active === "catalog" && (
        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-12">
            <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-2">Наши товары</p>
            <h1 className="font-display text-5xl text-[#1A1410]">Каталог металлов</h1>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {METALS.map((m, i) => (
              <div key={m.id} className="bg-white border border-[#ede8df] overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1">
                    <span className="font-body text-xs tracking-widest text-[#A07830]">{m.symbol}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="font-display text-3xl text-[#1A1410]">{m.name}</h2>
                    <span className={`font-body text-sm ${m.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {m.change >= 0 ? "+" : ""}{m.change}%
                    </span>
                  </div>
                  <p className="font-body text-sm text-[#6b5e52] leading-relaxed mb-6">{m.desc}</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: "Проба", value: m.purity },
                      { label: "От", value: m.minWeight },
                      { label: "Цена", value: `${prices[i].toLocaleString("ru-RU")} ₽/г` },
                    ].map(s => (
                      <div key={s.label} className="bg-[#faf9f7] p-3 text-center">
                        <p className="font-body text-xs text-[#9e9080] mb-1">{s.label}</p>
                        <p className="font-body text-sm font-medium text-[#1A1410]">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActive("contacts")}
                    className="w-full bg-[#A07830] text-white font-body text-sm py-3 tracking-wider hover:bg-[#8a6428] transition-colors"
                  >
                    Оставить заявку
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ABOUT */}
      {active === "about" && (
        <main>
          <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-4">О компании</p>
              <h1 className="font-display text-6xl text-[#1A1410] leading-tight mb-6">
                Экспертиза в<br />мире металлов
              </h1>
              <p className="font-body text-[#6b5e52] leading-relaxed mb-6">
                АурумМеталл — профессиональный дилер драгоценных металлов с многолетним опытом работы на российском рынке. Специализируемся на инвестиционных слитках и монетах высшей пробы.
              </p>
              <p className="font-body text-[#6b5e52] leading-relaxed mb-8">
                Каждая сделка сопровождается полным пакетом документов и сертификатами происхождения. Работаем с частными инвесторами, корпоративными клиентами и финансовыми учреждениями.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: "15+", label: "Лет на рынке" },
                  { num: "2 400+", label: "Клиентов" },
                  { num: "₽ 3 млрд", label: "Объём сделок" },
                  { num: "4", label: "Металла в каталоге" },
                ].map(s => (
                  <div key={s.label} className="border-l-2 border-[#A07830] pl-4">
                    <p className="font-display text-3xl text-[#1A1410]">{s.num}</p>
                    <p className="font-body text-xs text-[#9e9080] tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/9f8fc474-95d4-4d76-9e4b-ff5bed8c09e8.jpg"
                alt="О компании"
                className="w-full aspect-square object-cover"
              />
            </div>
          </section>

          <section className="bg-[#F5EDD8] py-16">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="font-display text-4xl text-[#1A1410] text-center mb-12">Наши принципы</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { icon: "Award", title: "Качество", desc: "Только сертифицированные металлы от проверенных производителей" },
                  { icon: "Lock", title: "Надёжность", desc: "Полное юридическое сопровождение каждой сделки" },
                  { icon: "Eye", title: "Прозрачность", desc: "Честные цены без скрытых комиссий" },
                  { icon: "HeartHandshake", title: "Партнёрство", desc: "Долгосрочные отношения с каждым клиентом" },
                ].map(p => (
                  <div key={p.title} className="text-center">
                    <div className="w-10 h-10 flex items-center justify-center mx-auto mb-4">
                      <Icon name={p.icon} fallback="Star" size={24} className="text-[#A07830]" />
                    </div>
                    <h3 className="font-display text-xl text-[#1A1410] mb-2">{p.title}</h3>
                    <p className="font-body text-xs text-[#6b5e52] leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* CONTACTS */}
      {active === "contacts" && (
        <main className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-2">Связь с нами</p>
            <h1 className="font-display text-5xl text-[#1A1410]">Контакты</h1>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-3xl text-[#1A1410] mb-8">Оставьте заявку</h2>
              <div className="flex flex-col gap-4">
                {["Ваше имя", "Телефон или email"].map(pl => (
                  <input
                    key={pl}
                    placeholder={pl}
                    className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors"
                  />
                ))}
                <select className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#6b5e52] focus:outline-none focus:border-[#A07830] transition-colors">
                  <option>Интересующий металл</option>
                  {METALS.map(m => <option key={m.id}>{m.name}</option>)}
                </select>
                <textarea
                  placeholder="Комментарий или вопрос"
                  rows={4}
                  className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors resize-none"
                />
                <button className="bg-[#A07830] text-white font-body text-sm py-3 tracking-wider hover:bg-[#8a6428] transition-colors">
                  Отправить заявку
                </button>
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl text-[#1A1410] mb-8">Реквизиты</h2>
              <div className="flex flex-col gap-6">
                {[
                  { icon: "MapPin", title: "Адрес", value: "Москва, ул. Ильинка, 4, офис 301" },
                  { icon: "Phone", title: "Телефон", value: "+7 (495) 000-00-00" },
                  { icon: "Mail", title: "Email", value: "info@aurummetall.ru" },
                  { icon: "Clock", title: "Часы работы", value: "Пн–Пт: 9:00–18:00" },
                ].map(c => (
                  <div key={c.title} className="flex gap-4">
                    <div className="w-10 h-10 border border-[#ede8df] flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} fallback="Star" size={16} className="text-[#A07830]" />
                    </div>
                    <div>
                      <p className="font-body text-xs text-[#9e9080] tracking-wider mb-1">{c.title}</p>
                      <p className="font-body text-sm text-[#1A1410]">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-6 bg-[#1A1410]">
                <p className="font-display text-2xl text-[#C8A050] mb-2">Прямой выкуп</p>
                <p className="font-body text-sm text-[#9e9080] leading-relaxed">
                  Покупаем металл по рыночным котировкам без дисконта. Оценка и расчёт в день обращения.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1410] border-t border-[#2a2018] py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display text-xl text-white">Аурум</span>
            <span className="font-display text-xl text-[#A07830]">Металл</span>
          </div>
          <p className="font-body text-xs text-[#6b5e52] tracking-wider">© 2024 АурумМеталл. Все права защищены.</p>
          <div className="flex gap-6">
            {nav.map(n => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className="font-body text-xs text-[#6b5e52] hover:text-[#C8A050] tracking-wider transition-colors"
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;