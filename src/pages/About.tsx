import AboutSection from "@/components/sections/AboutSection";
import Seo from "@/components/layout/Seo";

const About = () => (
  <>
    <Seo
      title="О компании Золотов — дилер драгоценных металлов в Москве"
      description="Золотов — профессиональный дилер драгоценных металлов с многолетним опытом на российском рынке. Инвестиционные слитки, сертификаты, полное юридическое сопровождение сделок."
      path="/about"
    />
    <AboutSection />
  </>
);

export default About;
