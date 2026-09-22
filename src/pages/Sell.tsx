import { useOutletContext } from "react-router-dom";
import SellSection from "@/components/sections/SellSection";
import { LayoutContext } from "@/components/layout/Layout";
import Seo from "@/components/layout/Seo";

const Sell = () => {
  const ctx = useOutletContext<LayoutContext>();

  return (
    <>
    <Seo
      title="Продать золото и серебро в Москве — выгодный выкуп | Золотов"
      description="Скупка золота, серебра и лома 585 пробы в Москве и Московской области по актуальным ценам ЦБ РФ. Быстрая оценка, экспертиза подлинности, расчёт в день сделки."
      path="/sell"
    />
    <SellSection
      getPrice={ctx.getPrice}
      manualSell={ctx.manualSell}
      editingKey={ctx.editingKey}
      editValue={ctx.editValue}
      setEditValue={ctx.setEditValue}
      startEdit={ctx.startEdit}
      saveEdit={ctx.saveEdit}
      setEditingKey={ctx.setEditingKey}
      resetManual={ctx.resetManual}
    />
    </>
  );
};

export default Sell;
