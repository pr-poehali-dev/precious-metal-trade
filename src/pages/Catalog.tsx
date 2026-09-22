import { useOutletContext } from "react-router-dom";
import CatalogSection from "@/components/sections/CatalogSection";
import { LayoutContext } from "@/components/layout/Layout";
import Seo from "@/components/layout/Seo";

const Catalog = () => {
  const ctx = useOutletContext<LayoutContext>();

  return (
    <>
    <Seo
      title="Купить золото и серебро в Москве — каталог слитков | Золотов"
      description="Каталог инвестиционных золотых и серебряных слитков высшей пробы. Актуальные цены на золото и серебро сегодня. Сертификаты, гарантия качества, доставка по Москве и МО."
      path="/catalog"
    />
    <CatalogSection
      getPrice={ctx.getPrice}
      manualBuy={ctx.manualBuy}
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

export default Catalog;
