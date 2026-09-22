import ContactsSection from "@/components/sections/ContactsSection";
import Seo from "@/components/layout/Seo";

const Contacts = () => (
  <>
    <Seo
      title="Контакты — Золотов, драгоценные металлы в Москве"
      description="Свяжитесь с нами: адрес, телефон, WhatsApp и Telegram. Комсомольский проспект, 7с2, Москва. Оставьте заявку на покупку или продажу драгоценных металлов."
      path="/contacts"
    />
    <ContactsSection />
  </>
);

export default Contacts;
