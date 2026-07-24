import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavItem } from "@/types/section";
import { useMetalPrices } from "@/hooks/useMetalPrices";
import Ticker from "@/components/layout/Ticker";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminPasswordModal from "@/components/metals/AdminPasswordModal";

const nav: NavItem[] = [
  { path: "/", label: "Главная" },
  { path: "/catalog", label: "Купить" },
  { path: "/sell", label: "Продать" },
  { path: "/about", label: "О компании" },
  { path: "/contacts", label: "Контакты" },
];

export interface LayoutContext {
  getPrice: (id: string, type: "buy" | "sell") => number;
  manualBuy: Record<string, number>;
  manualSell: Record<string, number>;
  cbDate: string | null;
  usdRate: number | null;
  usdHistory: number[];
  usdOpen: number | null;
  usdtRate: number | null;
  exchangeOnline: boolean | null;
  goldHistory: number[];
  silverHistory: number[];
  editingKey: string | null;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (key: string, val: number) => void;
  saveEdit: (key: string) => void;
  setEditingKey: (key: string | null) => void;
  resetManual: (id: string, type: "buy" | "sell") => void;
}

const Layout = () => {
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

  const context: LayoutContext = {
    getPrice,
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
    editingKey,
    editValue,
    setEditValue,
    startEdit,
    saveEdit,
    setEditingKey,
    resetManual,
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <Ticker cbDate={cbDate} usdRate={usdRate} usdtRate={usdtRate} getPrice={getPrice} />
      <Header nav={nav} />

      <Outlet context={context} />

      <Footer nav={nav} />

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

export default Layout;
