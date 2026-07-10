import { useState } from "react";
import { METALS } from "@/data/metals";
import { Section, NavItem } from "@/types/section";
import { useMetalPrices } from "@/hooks/useMetalPrices";
import Ticker from "@/components/layout/Ticker";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminPasswordModal from "@/components/metals/AdminPasswordModal";
import HomeSection from "@/components/sections/HomeSection";
import CatalogSection from "@/components/sections/CatalogSection";
import AboutSection from "@/components/sections/AboutSection";
import SellSection from "@/components/sections/SellSection";
import ContactsSection from "@/components/sections/ContactsSection";

const nav: NavItem[] = [
  { key: "home", label: "Главная" },
  { key: "catalog", label: "Купить" },
  { key: "sell", label: "Продать" },
  { key: "about", label: "О компании" },
  { key: "contacts", label: "Контакты" },
];

const Index = () => {
  const [active, setActive] = useState<Section>("home");
  const [selectedMetal, setSelectedMetal] = useState(METALS[0]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pendingEditKey, setPendingEditKey] = useState<{ key: string; val: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  const {
    manualBuy,
    manualSell,
    cbDate,
    usdRate,
    usdHistory,
    usdOpen,
    usdtRate,
    exchangeOnline,
    goldHistory,
    silverHistory,
    getPrice,
    saveEdit: persistEdit,
    resetManual,
  } = useMetalPrices();

  const startEdit = (key: string, val: number) => {
    if (!isAdmin) {
      setPendingEditKey({ key, val });
      setShowPasswordModal(true);
      setPasswordInput("");
      setPasswordError(false);
      return;
    }
    setEditingKey(key);
    setEditValue(String(val));
  };

  const submitPassword = () => {
    if (passwordInput === "Shumakulik22!") {
      setIsAdmin(true);
      setShowPasswordModal(false);
      if (pendingEditKey) {
        const { key, val } = pendingEditKey;
        setEditingKey(key);
        setEditValue(String(val));
        setPendingEditKey(null);
      }
    } else {
      setPasswordError(true);
    }
  };

  const saveEdit = (key: string) => {
    const val = parseFloat(editValue.replace(",", "."));
    if (!isNaN(val) && val > 0) {
      persistEdit(key, val);
    }
    setEditingKey(null);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Ticker cbDate={cbDate} usdRate={usdRate} usdtRate={usdtRate} getPrice={getPrice} />

      <Header active={active} setActive={setActive} nav={nav} />

      {active === "home" && (
        <HomeSection
          setActive={setActive}
          getPrice={getPrice}
          exchangeOnline={exchangeOnline}
          goldHistory={goldHistory}
          silverHistory={silverHistory}
          usdRate={usdRate}
          usdOpen={usdOpen}
          usdHistory={usdHistory}
          usdtRate={usdtRate}
          selectedMetal={selectedMetal}
          setSelectedMetal={setSelectedMetal}
        />
      )}

      {active === "catalog" && (
        <CatalogSection
          setActive={setActive}
          getPrice={getPrice}
          manualBuy={manualBuy}
          manualSell={manualSell}
          editingKey={editingKey}
          editValue={editValue}
          setEditValue={setEditValue}
          startEdit={startEdit}
          saveEdit={saveEdit}
          setEditingKey={setEditingKey}
          resetManual={resetManual}
        />
      )}

      {active === "about" && <AboutSection />}

      {active === "sell" && (
        <SellSection
          setActive={setActive}
          getPrice={getPrice}
          manualSell={manualSell}
          editingKey={editingKey}
          editValue={editValue}
          setEditValue={setEditValue}
          startEdit={startEdit}
          saveEdit={saveEdit}
          setEditingKey={setEditingKey}
          resetManual={resetManual}
        />
      )}

      {active === "contacts" && <ContactsSection />}

      <Footer setActive={setActive} nav={nav} />

      {showPasswordModal && (
        <AdminPasswordModal
          passwordInput={passwordInput}
          setPasswordInput={setPasswordInput}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
          onSubmit={submitPassword}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
