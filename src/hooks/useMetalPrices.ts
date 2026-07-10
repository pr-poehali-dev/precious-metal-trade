import { useState, useEffect } from "react";
import { METALS, SELL_ITEMS } from "@/data/metals";

const PRICES_URL = "https://functions.poehali.dev/4a210323-b28f-46af-bd5e-adebaaeea54a";
const METALS_PRICES_URL = "https://functions.poehali.dev/ec611c68-8981-4ab8-8be8-6d1248f75d5b";

export function useMetalPrices() {
  const [cbBuy, setCbBuy] = useState<Record<string, number>>({});
  const [cbSell, setCbSell] = useState<Record<string, number>>({});
  const [manualBuy, setManualBuy] = useState<Record<string, number>>({});
  const [manualSell, setManualSell] = useState<Record<string, number>>({});
  const [cbDate, setCbDate] = useState<string | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [usdHistory, setUsdHistory] = useState<number[]>([]);
  const [usdOpen, setUsdOpen] = useState<number | null>(null);
  const [usdtRate, setUsdtRate] = useState<number | null>(null);
  const [exchangeOnline, setExchangeOnline] = useState<boolean | null>(null);
  const [goldHistory, setGoldHistory] = useState<number[]>([]);
  const [silverHistory, setSilverHistory] = useState<number[]>([]);

  useEffect(() => {
    fetch(PRICES_URL).then(r => r.json()).then(data => {
      const buy: Record<string, number> = {};
      const sell: Record<string, number> = {};
      Object.entries(data).forEach(([id, v]) => {
        const val = v as { buy: number | null; sell: number | null };
        if (val.buy !== null && val.buy !== undefined) buy[id] = val.buy;
        if (val.sell !== null && val.sell !== undefined) sell[id] = val.sell;
      });
      setManualBuy(buy);
      setManualSell(sell);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCbPrices = async () => {
      try {
        const res = await fetch(METALS_PRICES_URL);
        const data = await res.json();
        setExchangeOnline(data.exchange_online ?? !!(data.gold?.buy || data.silver?.buy || data.usd));
        if (data.gold?.buy) {
          setCbBuy(prev => ({ ...prev, gold: data.gold.buy }));
          setCbSell(prev => ({ ...prev, gold: data.gold.sell }));
        }
        if (data.silver?.buy) {
          setCbBuy(prev => ({ ...prev, silver: data.silver.buy }));
          setCbSell(prev => ({ ...prev, silver: data.silver.sell }));
        }
        if (data.gold?.date) setCbDate(data.gold.date);
        if (data.usd) {
          setUsdRate(data.usd);
        }
        if (data.usd_history && data.usd_history.length > 1) {
          setUsdHistory(data.usd_history);
        } else if (data.usd) {
          setUsdHistory(prev => {
            const updated = [...prev, data.usd].slice(-20);
            return updated;
          });
        }
        if (data.usd_open) setUsdOpen(data.usd_open);
        if (data.usdt) setUsdtRate(data.usdt);
        if (data.gold_history && data.gold_history.length > 1) setGoldHistory(data.gold_history);
        if (data.silver_history && data.silver_history.length > 1) setSilverHistory(data.silver_history);
      } catch (e) { console.error(e); setExchangeOnline(false); }
    };
    fetchCbPrices();
    const interval = setInterval(fetchCbPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  const getPrice = (id: string, type: "buy" | "sell") => {
    const fallback = METALS.find(m => m.id === id)?.price ?? SELL_ITEMS.find(m => m.id === id)?.defaultPrice ?? 0;
    if (type === "buy") return manualBuy[id] ?? cbBuy[id] ?? fallback;
    if (manualSell[id] !== undefined) return manualSell[id];
    if (id === "gold585") {
      const goldPrice = cbBuy["gold"] ?? METALS.find(m => m.id === "gold")?.price ?? 0;
      return Math.round(goldPrice * (585 / 999.9) * 0.94 * 100) / 100;
    }
    const cbPrice = cbBuy[id] ?? fallback;
    const discount = 0.96;
    return Math.round(cbPrice * discount * 100) / 100;
  };

  const saveEdit = (key: string, val: number) => {
    const [id, type] = key.split("_");
    if (type === "buy") setManualBuy(prev => ({ ...prev, [id]: val }));
    else setManualSell(prev => ({ ...prev, [id]: val }));
    fetch(PRICES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type, price: val }),
    }).catch(() => {});
  };

  const resetManual = (id: string, type: "buy" | "sell") => {
    if (type === "buy") setManualBuy(prev => { const n = { ...prev }; delete n[id]; return n; });
    else setManualSell(prev => { const n = { ...prev }; delete n[id]; return n; });
    fetch(PRICES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, type: `reset_${type}` }),
    }).catch(() => {});
  };

  return {
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
    saveEdit,
    resetManual,
  };
}
