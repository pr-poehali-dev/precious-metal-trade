import { useOutletContext } from "react-router-dom";
import CatalogSection from "@/components/sections/CatalogSection";
import { LayoutContext } from "@/components/layout/Layout";

const Catalog = () => {
  const ctx = useOutletContext<LayoutContext>();

  return (
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
  );
};

export default Catalog;
