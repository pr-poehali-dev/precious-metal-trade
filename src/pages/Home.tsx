import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { METALS } from "@/data/metals";
import HomeSection from "@/components/sections/HomeSection";
import { LayoutContext } from "@/components/layout/Layout";
import Seo from "@/components/layout/Seo";

const Home = () => {
  const ctx = useOutletContext<LayoutContext>();
  const [selectedMetal, setSelectedMetal] = useState(METALS[0]);

  return (
    <>
    <Seo
      title="Золотов — Купить и продать золото и серебро в Москве и МО"
      description="Профессиональная торговля драгоценными металлами в Москве и Московской области. Покупка и продажа золота, серебра, лома 585 пробы по выгодным ценам. Живые котировки ЦБ РФ."
      path="/"
    />
    <HomeSection
      getPrice={ctx.getPrice}
      exchangeOnline={ctx.exchangeOnline}
      goldHistory={ctx.goldHistory}
      silverHistory={ctx.silverHistory}
      usdRate={ctx.usdRate}
      usdOpen={ctx.usdOpen}
      usdHistory={ctx.usdHistory}
      usdtRate={ctx.usdtRate}
      selectedMetal={selectedMetal}
      setSelectedMetal={setSelectedMetal}
    />
    </>
  );
};

export default Home;