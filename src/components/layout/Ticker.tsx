import { METALS } from "@/data/metals";

interface TickerProps {
  cbDate: string | null;
  usdRate: number | null;
  usdtRate: number | null;
  getPrice: (id: string, type: "buy" | "sell") => number;
}

const Ticker = ({ cbDate, usdRate, usdtRate, getPrice }: TickerProps) => {
  return (
    <div className="bg-[#1A1410] text-[#C8A050] py-2 overflow-hidden relative">
      {cbDate && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-[10px] text-[#6b5e52] tracking-wider z-10">
          MOEX · {cbDate}
        </span>
      )}
      <div className="flex animate-ticker whitespace-nowrap">
        {[...METALS, ...METALS].map((m, i) => (
          <span key={i} className="font-body text-xs tracking-widest mx-8">
            {m.symbol}&nbsp;
            <span className="text-white font-medium">
              {(getPrice(m.id, "buy")).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
            </span>
            &nbsp;
            <span className={m.change >= 0 ? "text-green-400" : "text-red-400"}>
              {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change)}%
            </span>
          </span>
        ))}
        {usdRate && (
          <span className="font-body text-xs tracking-widest mx-8">
            USD/RUB&nbsp;
            <span className="text-white font-medium">
              {usdRate.toLocaleString("ru-RU", { minimumFractionDigits: 4 })} ₽
            </span>
            &nbsp;<span className="text-[#C8A050] text-[10px]">MOEX</span>
          </span>
        )}
        {usdtRate && (
          <span className="font-body text-xs tracking-widest mx-8">
            USDT/RUB&nbsp;
            <span className="text-white font-medium">
              {usdtRate.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
            </span>
            &nbsp;<span className="text-[#C8A050] text-[10px]">CoinGecko</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Ticker;
