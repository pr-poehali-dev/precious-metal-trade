import { useOutletContext } from "react-router-dom";
import SellSection from "@/components/sections/SellSection";
import { LayoutContext } from "@/components/layout/Layout";

const Sell = () => {
  const ctx = useOutletContext<LayoutContext>();

  return (
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
  );
};

export default Sell;
