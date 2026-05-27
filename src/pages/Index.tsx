import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const SELL_ITEMS = [
  { id: "gold", name: "Золото", symbol: "XAU", purity: "999.9", defaultPrice: 10314, img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/d4adee9f-63bd-4111-9624-ed7b47e7154f.jpg" },
  { id: "silver", name: "Серебро", symbol: "XAG", purity: "999", defaultPrice: 171, img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/9e2715fb-de1f-43b0-a923-a1f70c44791f.jpg" },
  { id: "gold585", name: "Лом Золото", symbol: "AU", purity: "585", defaultPrice: 6100, img: "https://cdn.poehali.dev/projects/78efbc03-a523-46f9-bb59-48a63171a417/files/363a4f64-874a-4469-a531-2a489685e54d.jpg" },
];

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

type Section = "home" | "catalog" | "sell" | "about" | "contacts";

function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [metal, setMetal] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const submit = async () => {
    if (!name.trim() || !contact.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("https://functions.poehali.dev/9009c010-2fa3-4c6b-8331-52eea5618f2d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, metal, comment }),
      });
      if (res.ok) {
        setStatus("ok");
        setName(""); setContact(""); setMetal(""); setComment("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        placeholder="Ваше имя"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors"
      />
      <input
        placeholder="Телефон или email"
        value={contact}
        onChange={e => setContact(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors"
      />
      <select
        value={metal}
        onChange={e => setMetal(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#6b5e52] focus:outline-none focus:border-[#A07830] transition-colors"
      >
        <option value="">Интересующий металл</option>
        {METALS.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
      </select>
      <textarea
        placeholder="Комментарий или вопрос"
        rows={4}
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="border border-[#ede8df] bg-white px-4 py-3 font-body text-sm text-[#1A1410] placeholder:text-[#c0b8ae] focus:outline-none focus:border-[#A07830] transition-colors resize-none"
      />
      {status === "ok" && (
        <p className="font-body text-sm text-green-600">Заявка отправлена! Мы свяжемся с вами.</p>
      )}
      {status === "error" && (
        <p className="font-body text-sm text-red-500">Ошибка отправки. Попробуйте ещё раз или свяжитесь напрямую.</p>
      )}
      <button
        onClick={submit}
        disabled={status === "loading"}
        className="bg-[#A07830] text-white font-body text-sm py-3 tracking-wider hover:bg-[#8a6428] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Отправка..." : "Отправить заявку"}
      </button>
    </div>
  );
}

const Index = () => {
  const [active, setActive] = useState<Section>("home");
  const [selectedMetal, setSelectedMetal] = useState(METALS[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cbBuy, setCbBuy] = useState<Record<string, number>>({});
  const [cbSell, setCbSell] = useState<Record<string, number>>({});
  const [manualBuy, setManualBuy] = useState<Record<string, number>>({});
  const [manualSell, setManualSell] = useState<Record<string, number>>({});

  const PRICES_URL = "https://functions.poehali.dev/4a210323-b28f-46af-bd5e-adebaaeea54a";

  useEffect(() => {
    fetch(PRICES_URL).then(r => r.json()).then(data => {
      const buy: Record<string, number> = {};
      const sell: Record<string, number> = {};
      Object.entries(data).forEach(([id, v]) => {
        const val = v as { buy: number | null; sell: number | null };
        if (val.buy !== null && val.buy !== undefined) buy[id] = val.buy;
        if (val.sell !== null && val.sell !== undefined) sell[id] = val.sell;
      });
      setManualBuy(buy);
      setManualSell(sell);
    }).catch(() => {});
  }, []);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pendingEditKey, setPendingEditKey] = useState<{ key: string; val: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [cbDate, setCbDate] = useState<string | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [usdHistory, setUsdHistory] = useState<number[]>([]);
  const [usdOpen, setUsdOpen] = useState<number | null>(null);
  const [usdtRate, setUsdtRate] = useState<number | null>(null);
  const [exchangeOnline, setExchangeOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCbPrices = async () => {
      try {
        const res = await fetch("https://functions.poehali.dev/ec611c68-8981-4ab8-8be8-6d1248f75d5b");
        const data = await res.json();
        const hasLiveData = !!(data.gold?.buy || data.silver?.buy || data.usd);
        setExchangeOnline(hasLiveData);
        if (data.gold?.buy) {
          setCbBuy(prev => ({ ...prev, gold: data.gold.buy }));
          setCbSell(prev => ({ ...prev, gold: data.gold.sell }));
        }
        if (data.silver?.buy) {
          setCbBuy(prev => ({ ...prev, silver: data.silver.buy }));
          setCbSell(prev => ({ ...prev, silver: data.silver.sell }));
        }
        if (data.gold?.date) setCbDate(data.gold.date);
        if (data.usd) {
          setUsdRate(data.usd);
        }
        if (data.usd_history && data.usd_history.length > 1) {
          setUsdHistory(data.usd_history);
        } else if (data.usd) {
          setUsdHistory(prev => {
            const updated = [...prev, data.usd].slice(-20);
            return updated;
          });
        }
        if (data.usd_open) setUsdOpen(data.usd_open);
        if (data.usdt) setUsdtRate(data.usdt);
      } catch (e) { console.error(e); setExchangeOnline(false); }
    };
    fetchCbPrices();
    const interval = setInterval(fetchCbPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPrice = (id: string, type: "buy" | "sell") => {
    const fallback = METALS.find(m => m.id === id)?.price ?? SELL_ITEMS.find(m => m.id === id)?.defaultPrice ?? 0;
    if (type === "buy") return manualBuy[id] ?? cbBuy[id] ?? fallback;
    if (manualSell[id] !== undefined) return manualSell[id];
    if (id === "gold585") {
      const goldPrice = cbBuy["gold"] ?? METALS.find(m => m.id === "gold")?.price ?? 0;
      return Math.round(goldPrice * (585 / 999.9) * 0.94 * 100) / 100;
    }
    const cbPrice = cbBuy[id] ?? fallback;
    const discount = 0.96;
    return Math.round(cbPrice * discount * 100) / 100;
  };

  const startEdit = (key: string, val: number) => {
    if (!isAdmin) {
      setPendingEditKey({ key, val });
      setShowPasswordModal(true);
      setPasswordInput("");
      setPasswordError(false);
      return;
    }
    setEditingKey(key);
    setEditValue(String(val));
  };

  const submitPassword = () => {
    if (passwordInput === "Shumakulik22!") {
      setIsAdmin(true);
      setShowPasswordModal(false);
      if (pendingEditKey) {
        const { key, val } = pendingEditKey;
        setEditingKey(key);
        setEditValue(String(val));
        setPendingEditKey(null);
      }
    } else {
      setPasswordError(true);
    }
  };

  const saveEdit = (key: string) => {
    const val = parseFloat(editValue.replace(",", "."));
    if (!isNaN(val) && val > 0) {
      const [id, type] = key.split("_");
      if (type === "buy") setManualBuy(prev => ({ ...prev, [id]: val }));
      else setManualSell(prev => ({ ...prev, [id]: val }));
      fetch(PRICES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, price: val }),
      }).catch(() => {});
    }
    setEditingKey(null);
  };

  const resetManual = (id: string, type: "buy" | "sell") => {
    if (type === "buy") setManualBuy(prev => { const n = { ...prev }; delete n[id]; return n; });
    else setManualSell(prev => { const n = { ...prev }; delete n[id]; return n; });
    fetch(PRICES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type: `reset_${type}` }),
    }).catch(() => {});
  };

  const nav: { key: Section; label: string }[] = [
    { key: "home", label: "Главная" },
    { key: "catalog", label: "Купить" },
    { key: "sell", label: "Продать" },
    { key: "about", label: "О компании" },
    { key: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Ticker */}
      <div className="bg-[#1A1410] text-[#C8A050] py-2 overflow-hidden relative">
        {cbDate && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-[10px] text-[#6b5e52] tracking-wider z-10">
            MOEX · {cbDate}
          </span>
        )}
        <div className="flex animate-ticker whitespace-nowrap">
          {[...METALS, ...METALS].map((m, i) => (
            <span key={i} className="font-body text-xs tracking-widest mx-8">
              {m.symbol}&nbsp;
              <span className="text-white font-medium">
                {(getPrice(m.id, "buy")).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
              </span>
              &nbsp;
              <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
                {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change)}%
              </span>
            </span>
          ))}
          {usdRate && (
            <span className="font-body text-xs tracking-widest mx-8">
              USD/RUB&nbsp;
              <span className="text-white font-medium">
                {usdRate.toLocaleString("ru-RU", { minimumFractionDigits: 4 })} ₽
              </span>
              &nbsp;<span className="text-[#C8A050] text-[10px]">MOEX</span>
            </span>
          )}
          {usdtRate && (
            <span className="font-body text-xs tracking-widest mx-8">
              USDT/RUB&nbsp;
              <span className="text-white font-medium">
                {usdtRate.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
              </span>
              &nbsp;<span className="text-[#C8A050] text-[10px]">CoinGecko</span>
            </span>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#ede8df] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => setActive("home")} className="text-left flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1410] flex items-center justify-center flex-shrink-0">
              <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-lg text-[#C8A050] leading-none">З</span>
            </div>
            <div className="leading-none">
              <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl text-[#1A1410]">Золотов</span>
              <span className="font-body text-[9px] tracking-[0.25em] text-[#A07830] uppercase block mt-0.5">Драгоценные металлы</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {nav.map(n => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className={`font-body text-sm tracking-widest uppercase transition-colors relative pb-1 ${
                  active === n.key
                    ? "text-[#A07830] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#A07830]"
                    : "text-[#6b5e52] hover:text-[#1A1410]"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <button className="md:hidden text-[#1A1410] p-2 -mr-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#ede8df] px-6 py-2 flex flex-col">
            {nav.map(n => (
              <button
                key={n.key}
                onClick={() => { setActive(n.key); setMenuOpen(false); }}
                className={`font-body text-sm tracking-wider text-left py-3 border-b border-[#f5f0ea] last:border-0 ${active === n.key ? "text-[#A07830]" : "text-[#6b5e52]"}`}
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
                  onClick={() => setActive("catalog")}
                  className="flex-1 md:flex-none bg-[#A07830] text-white font-body text-sm px-8 py-3 tracking-wider hover:bg-[#8a6428] transition-colors"
                >
                  Купить
                </button>
                <button
                  onClick={() => setActive("sell")}
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
              <LargeChart metal={selectedMetal} key={selectedMetal.id} />
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
      )}

      {/* CATALOG */}
      {active === "catalog" && (
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
            <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">Наши товары</p>
            <h1 className="font-display text-3xl md:text-5xl text-[#1A1410]">Каталог металлов</h1>
          </div>
          <div className="grid md:grid-cols-2 gap-5 md:gap-8">
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
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="font-display text-2xl md:text-3xl text-[#1A1410]">{m.name}</h2>
                    <span className={`font-body text-sm ${m.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {m.change >= 0 ? "+" : ""}{m.change}%
                    </span>
                  </div>
                  <p className="font-body text-sm text-[#6b5e52] leading-relaxed mb-6">{m.desc}</p>

                  {/* Цена покупки */}
                  <div className="mb-4">
                    {(["buy"] as const).map(type => {
                      const key = `${m.id}_${type}`;
                      const price = getPrice(m.id, type);
                      const isManual = type === "buy" ? manualBuy[m.id] !== undefined : manualSell[m.id] !== undefined;
                      const isEditing = editingKey === key;
                      return (
                        <div key={type} className="border border-[#ede8df] p-3 bg-[#faf9f7]">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-body text-xs text-[#9e9080] tracking-wider uppercase">
                              {type === "buy" ? "Купить" : "Продать"}
                            </p>
                            <div className="flex items-center gap-1">
                              {isManual && (
                                <button onClick={() => resetManual(m.id, type)} className="font-body text-[10px] text-[#9e9080] hover:text-red-500 transition-colors">↺</button>
                              )}
                              {!isEditing && (
                                <button onClick={() => startEdit(key, price)} className="text-[#A07830] hover:text-[#8a6428] transition-colors">
                                  <Icon name="Pencil" size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                type="number"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") saveEdit(key); if (e.key === "Escape") setEditingKey(null); }}
                                className="w-full border border-[#A07830] bg-white px-2 py-1 font-body text-sm text-[#1A1410] focus:outline-none"
                              />
                              <button onClick={() => saveEdit(key)} className="bg-[#A07830] text-white px-2 py-1 font-body text-xs">✓</button>
                              <button onClick={() => setEditingKey(null)} className="border border-[#ede8df] px-2 py-1 font-body text-xs text-[#9e9080]">✕</button>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <p className="font-display text-xl text-[#1A1410]">
                                {price.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                              </p>
                              {isManual && <span className="font-body text-[10px] text-[#A07830]">●</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: "Проба", value: m.purity },
                      { label: "Мин. вес", value: m.minWeight },
                    ].map(s => (
                      <div key={s.label} className="bg-[#faf9f7] p-3 text-center border border-[#ede8df]">
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

          {/* Как купить металл */}
          <section className="bg-[#1A1410] p-6 md:p-12 mt-20">
            <h2 className="font-display text-2xl md:text-4xl text-white text-center mb-8 md:mb-12">Как купить металл</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { num: "01", title: "Заявка", desc: "Выберите металл и оставьте заявку на сайте или по телефону" },
                { num: "02", title: "Подтверждение", desc: "Мы свяжемся и зафиксируем цену по актуальным котировкам" },
                { num: "03", title: "Оплата", desc: "Удобный способ оплаты — наличными или банковским переводом" },
                { num: "04", title: "Получение", desc: "Передача металла с документами и сертификатами в день сделки" },
              ].map(s => (
                <div key={s.num} className="text-center">
                  <p className="font-display text-3xl md:text-5xl text-[#A07830] mb-2 md:mb-4">{s.num}</p>
                  <h3 className="font-display text-lg md:text-xl text-white mb-1 md:mb-2">{s.title}</h3>
                  <p className="font-body text-xs md:text-sm text-[#9e9080] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ABOUT */}
      {active === "about" && (
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
            <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">О компании</p>
            <h1 className="font-display text-3xl md:text-5xl text-[#1A1410]">Экспертиза в мире металлов</h1>
          </div>
          <section className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <p className="font-body text-[#6b5e52] leading-relaxed mb-6 text-base">
                Золотов — профессиональный дилер драгоценных металлов с многолетним опытом работы на российском рынке. Специализируемся на инвестиционных слитках и монетах высшей пробы.
              </p>
              <p className="font-body text-[#6b5e52] leading-relaxed mb-8">
                Каждая сделка сопровождается полным пакетом документов и сертификатами происхождения. Работаем с частными инвесторами, корпоративными клиентами и финансовыми учреждениями.
              </p>
              <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10">
                {[
                  { num: "15+", label: "Лет на рынке" },
                  { num: "₽ 3 млрд", label: "Объём сделок" },
                  { num: "2", label: "Металла" },
                ].map(s => (
                  <div key={s.label} className="border-l-2 border-[#A07830] pl-4">
                    <p className="font-display text-xl md:text-3xl text-[#1A1410]">{s.num}</p>
                    <p className="font-body text-[10px] md:text-xs text-[#9e9080] tracking-wider mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "Award", title: "Качество", desc: "Только сертифицированные металлы" },
                  { icon: "Lock", title: "Надёжность", desc: "Полное юридическое сопровождение" },
                  { icon: "Eye", title: "Прозрачность", desc: "Честные цены без скрытых комиссий" },
                  { icon: "HeartHandshake", title: "Партнёрство", desc: "Долгосрочные отношения с клиентом" },
                ].map(p => (
                  <div key={p.title} className="border border-[#ede8df] p-5 bg-white">
                    <div className="w-10 h-10 border border-[#ede8df] flex items-center justify-center mb-4">
                      <Icon name={p.icon} fallback="Star" size={20} className="text-[#A07830]" />
                    </div>
                    <p className="font-display text-xl text-[#1A1410] mb-1">{p.title}</p>
                    <p className="font-body text-sm text-[#9e9080]">{p.desc}</p>
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
        </main>
      )}

      {/* SELL */}
      {active === "sell" && (
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
            <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">Выкуп металлов</p>
            <h1 className="font-display text-3xl md:text-5xl text-[#1A1410]">Продать металл</h1>
          </div>

          {/* Карточки с ценами выкупа */}
          <div className="grid md:grid-cols-2 gap-5 md:gap-8 mb-10 md:mb-20">
            {SELL_ITEMS.map(m => (
              <div key={m.id} className="bg-white border border-[#ede8df] overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1">
                    <span className="font-body text-xs tracking-widest text-[#A07830]">{m.symbol} · {m.purity}</span>
                  </div>
                </div>
                <div className="p-4 md:p-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl text-[#1A1410]">{m.name}</h2>
                    <p className="font-body text-xs text-[#9e9080] tracking-widest mt-1">{m.purity} проба</p>
                  </div>
                  <div className="w-12 h-12 bg-[#faf9f7] border border-[#ede8df] flex items-center justify-center">
                    <Icon name="TrendingDown" size={20} className="text-[#A07830]" />
                  </div>
                </div>

                {/* Цена выкупа с редактированием */}
                {(["sell"] as const).map(type => {
                  const key = `${m.id}_${type}`;
                  const price = getPrice(m.id, type);
                  const isManual = manualSell[m.id] !== undefined;
                  const isEditing = editingKey === key;
                  return (
                    <div key={type} className="border border-[#ede8df] p-4 bg-[#faf9f7] mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-body text-xs text-[#9e9080] tracking-wider uppercase">Цена выкупа за грамм</p>
                        <div className="flex items-center gap-2">
                          {isManual && (
                            <button onClick={() => resetManual(m.id, "sell")} className="font-body text-xs text-[#9e9080] hover:text-red-500 transition-colors">Сбросить</button>
                          )}
                          {!isEditing && (
                            <button onClick={() => startEdit(key, price)} className="flex items-center gap-1 font-body text-xs text-[#A07830] hover:text-[#8a6428] transition-colors">
                              <Icon name="Pencil" size={11} /> Изменить
                            </button>
                          )}
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(key); if (e.key === "Escape") setEditingKey(null); }}
                            className="flex-1 border border-[#A07830] bg-white px-3 py-2 font-display text-2xl text-[#1A1410] focus:outline-none"
                          />
                          <span className="font-display text-xl text-[#9e9080]">₽</span>
                          <button onClick={() => saveEdit(key)} className="bg-[#A07830] text-white px-3 py-2 font-body text-xs tracking-wider hover:bg-[#8a6428] transition-colors">ОК</button>
                          <button onClick={() => setEditingKey(null)} className="border border-[#ede8df] px-3 py-2 font-body text-xs text-[#9e9080]">✕</button>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <p className="font-display text-3xl text-[#1A1410]">
                            {price.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => setActive("contacts")}
                  className="w-full bg-[#A07830] text-white font-body text-sm py-3 tracking-wider hover:bg-[#8a6428] transition-colors"
                >
                  Оставить заявку на продажу
                </button>
                </div>
              </div>
            ))}
          </div>

          {/* Как это работает */}
          <section className="bg-[#1A1410] p-6 md:p-12">
            <h2 className="font-display text-2xl md:text-4xl text-white text-center mb-8 md:mb-12">Как продать металл</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { num: "01", title: "Заявка", desc: "Оставьте заявку с указанием металла и количества" },
                { num: "02", title: "Оценка", desc: "Мы свяжемся и согласуем условия по актуальной цене" },
                { num: "03", title: "Проверка", desc: "Экспертиза подлинности и пробы металла" },
                { num: "04", title: "Расчёт", desc: "Оплата в день сделки — наличными или переводом" },
              ].map(s => (
                <div key={s.num} className="text-center">
                  <p className="font-display text-3xl md:text-5xl text-[#A07830] mb-2 md:mb-4">{s.num}</p>
                  <h3 className="font-display text-lg md:text-xl text-white mb-1 md:mb-2">{s.title}</h3>
                  <p className="font-body text-xs md:text-sm text-[#9e9080] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* CONTACTS */}
      {active === "contacts" && (
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
            <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">Связь с нами</p>
            <h1 className="font-display text-3xl md:text-5xl text-[#1A1410]">Контакты</h1>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-[#1A1410] mb-8">Оставьте заявку</h2>
              <ContactForm />
            </div>
            <div>
              <h2 className="font-display text-3xl text-[#1A1410] mb-8">Реквизиты</h2>
              <div className="flex flex-col gap-6">
                {[
                  { icon: "MapPin", title: "Адрес", value: "Комсомольский проспект, 7с2", href: null },
                  { icon: "Phone", title: "Телефон", value: "+7 (903) 711-82-28", href: "tel:+79037118228" },
                  { icon: "Mail", title: "Email", value: "mr.zolotov.msk@yandex.ru", href: "mailto:mr.zolotov.msk@yandex.ru" },
                  { icon: "Clock", title: "Часы работы", value: "Пн–Пт: 9:00–18:00", href: null },
                  { icon: "MessageCircle", title: "WhatsApp", value: "+7 (903) 711-82-28", href: "https://wa.me/79037118228" },
                  { icon: "Send", title: "Telegram", value: "@zolotov_mr", href: "https://t.me/zolotov_mr" },
                ].map(c => (
                  <div key={c.title} className="flex gap-4">
                    <div className="w-10 h-10 border border-[#ede8df] flex items-center justify-center flex-shrink-0">
                      <Icon name={c.icon} fallback="Star" size={16} className="text-[#A07830]" />
                    </div>
                    <div>
                      <p className="font-body text-xs text-[#9e9080] tracking-wider mb-1">{c.title}</p>
                      {c.href ? (
                        <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="font-body text-sm text-[#1A1410] hover:text-[#A07830] transition-colors">{c.value}</a>
                      ) : (
                        <p className="font-body text-sm text-[#1A1410]">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1410] border-t border-[#2a2018] py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <button onClick={() => setActive("home")} className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#A07830] flex items-center justify-center flex-shrink-0">
              <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-base text-[#1A1410] leading-none">З</span>
            </div>
            <div className="leading-none text-left">
              <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-xl text-white">Золотов</span>
              <span className="font-body text-[9px] tracking-[0.25em] text-[#A07830] uppercase block mt-0.5">Драгоценные металлы</span>
            </div>
          </button>
          <div className="flex gap-8">
            {nav.map(n => (
              <button
                key={n.key}
                onClick={() => setActive(n.key)}
                className="font-body text-xs text-[#6b5e52] hover:text-[#C8A050] tracking-widest uppercase transition-colors"
              >
                {n.label}
              </button>
            ))}
          </div>
          <p className="font-body text-xs text-[#4a3f35] tracking-wider">© 2024 Золотов. Все права защищены.</p>
        </div>
      </footer>

      {/* Модалка пароля */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 max-w-sm w-full">
            <h3 className="font-display text-2xl text-[#1A1410] mb-2">Вход для администратора</h3>
            <p className="font-body text-sm text-[#9e9080] mb-6">Введите пароль для изменения цен</p>
            <input
              autoFocus
              type="password"
              value={passwordInput}
              placeholder="Пароль"
              onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
              onKeyDown={e => { if (e.key === "Enter") submitPassword(); if (e.key === "Escape") setShowPasswordModal(false); }}
              className={`w-full border px-4 py-3 font-body text-sm text-[#1A1410] focus:outline-none mb-2 ${passwordError ? "border-red-400" : "border-[#ede8df] focus:border-[#A07830]"}`}
            />
            {passwordError && <p className="font-body text-xs text-red-500 mb-4">Неверный пароль</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={submitPassword} className="flex-1 bg-[#A07830] text-white font-body text-sm py-3 tracking-wider hover:bg-[#8a6428] transition-colors">
                Войти
              </button>
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 border border-[#ede8df] font-body text-sm py-3 text-[#9e9080] hover:border-[#9e9080] transition-colors">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;