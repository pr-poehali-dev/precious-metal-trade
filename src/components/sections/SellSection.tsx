import Icon from "@/components/ui/icon";
import { SELL_ITEMS } from "@/data/metals";
import { Section } from "@/types/section";

interface SellSectionProps {
  setActive: (s: Section) => void;
  getPrice: (id: string, type: "buy" | "sell") => number;
  manualSell: Record<string, number>;
  editingKey: string | null;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (key: string, val: number) => void;
  saveEdit: (key: string) => void;
  setEditingKey: (key: string | null) => void;
  resetManual: (id: string, type: "buy" | "sell") => void;
}

const SellSection = ({
  setActive,
  getPrice,
  manualSell,
  editingKey,
  editValue,
  setEditValue,
  startEdit,
  saveEdit,
  setEditingKey,
  resetManual,
}: SellSectionProps) => {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
      <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
        <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">Выкуп металлов</p>
        <h2 className="font-display text-3xl md:text-5xl text-[#1A1410]">Продать металл</h2>
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
  );
};

export default SellSection;
