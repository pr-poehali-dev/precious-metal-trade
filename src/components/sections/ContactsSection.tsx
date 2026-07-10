import Icon from "@/components/ui/icon";
import ContactForm from "@/components/metals/ContactForm";

const contacts = [
  { icon: "MapPin", title: "Адрес", value: "Комсомольский проспект, 7с2", href: "https://yandex.ru/maps/?text=Комсомольский+проспект,+7с2,+Москва" },
  { icon: "Phone", title: "Телефон", value: "+7 (903) 711-82-28", href: "tel:+79037118228" },
  { icon: "Mail", title: "Email", value: "mr.zolotov.msk@yandex.ru", href: "mailto:mr.zolotov.msk@yandex.ru" },
  { icon: "Clock", title: "Часы работы", value: "Пн–Пт: 9:00–18:00", href: null },
  { icon: "MessageCircle", title: "WhatsApp", value: "+7 (903) 711-82-28", href: "https://wa.me/79037118228" },
  { icon: "Send", title: "Telegram", value: "@zolotov_mr", href: "https://t.me/zolotov_mr" },
];

const ContactsSection = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20">
      <div className="border-b border-[#ede8df] mb-8 md:mb-12 pb-6 md:pb-8">
        <p className="font-body text-xs tracking-[0.3em] text-[#A07830] uppercase mb-3">Связь с нами</p>
        <h2 className="font-display text-3xl md:text-5xl text-[#1A1410]">Контакты</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-[#1A1410] mb-8">Оставьте заявку</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="font-display text-3xl text-[#1A1410] mb-8">Реквизиты</h2>
          <div className="flex flex-col gap-6">
            {contacts.map(c => (
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
  );
};

export default ContactsSection;
