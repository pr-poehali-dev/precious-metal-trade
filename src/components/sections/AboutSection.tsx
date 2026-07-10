import Icon from "@/components/ui/icon";

const AboutSection = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
      <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
        <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">О компании</p>
        <h2 className="font-display text-3xl md:text-5xl text-[#1A1410]">Экспертиза в мире металлов</h2>
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
              { num: "₽ 10 млрд+", label: "Объём сделок" },
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
  );
};

export default AboutSection;
