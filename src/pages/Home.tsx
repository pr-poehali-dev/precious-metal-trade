import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { METALS } from "@/data/metals";
import HomeSection from "@/components/sections/HomeSection";
import { LayoutContext } from "@/components/layout/Layout";

const Home = () => {
  const ctx = useOutletContext<LayoutContext>();
  const [selectedMetal, setSelectedMetal] = useState(METALS[0]);

  return (
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
  );
};

export default Home;
