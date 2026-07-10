import Icon from "@/components/ui/icon";
import { METALS } from "@/data/metals";
import { Section } from "@/types/section";

interface CatalogSectionProps {
  setActive: (s: Section) => void;
  getPrice: (id: string, type: "buy" | "sell") => number;
  manualBuy: Record<string, number>;
  manualSell: Record<string, number>;
  editingKey: string | null;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (key: string, val: number) => void;
  saveEdit: (key: string) => void;
  setEditingKey: (key: string | null) => void;
  resetManual: (id: string, type: "buy" | "sell") => void;
}

const CatalogSection = ({
  setActive,
  getPrice,
  manualBuy,
  manualSell,
  editingKey,
  editValue,
  setEditValue,
  startEdit,
  saveEdit,
  setEditingKey,
  resetManual,
}: CatalogSectionProps) => {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
      <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
        <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">Наши товары</p>
        <h2 className="font-display text-3xl md:text-5xl text-[#1A1410]">Каталог металлов</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-5 md:gap-8">
        {METALS.map((m) => (
          <div key={m.id} className="bg-white border border-[#ede8df] overflow-hidden group hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
            <div className="p-4 md:p-6 flex flex-col flex-1">
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
                            <button onClick={() => startEdit(key, price)} aria-label="Изменить цену" className="text-[#A07830] hover:text-[#8a6428] transition-colors p-1 -m-1">
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
              <div className="flex-1" />
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
  );
};

export default CatalogSection;
