import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Section, NavItem } from "@/types/section";

interface HeaderProps {
  active: Section;
  setActive: (s: Section) => void;
  nav: NavItem[];
}

const Header = ({ active, setActive, nav }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#ede8df] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <button onClick={() => setActive("home")} className="text-left flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1410] flex items-center justify-center flex-shrink-0">
            <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-lg text-[#C8A050] leading-none">З</span>
          </div>
          <div className="leading-none">
            <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl text-[#1A1410]">Золотов</span>
            <span className="font-body text-[9px] tracking-[0.25em] text-[#A07830] uppercase block mt-0.5">Драгоценные металлы</span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map(n => (
            <button
              key={n.key}
              onClick={() => setActive(n.key)}
              className={`font-body text-sm tracking-widest uppercase transition-colors relative pb-1 ${
                active === n.key
                  ? "text-[#A07830] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#A07830]"
                  : "text-[#6b5e52] hover:text-[#1A1410]"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <button
          className="md:hidden text-[#1A1410] p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#ede8df] px-6 py-2 flex flex-col">
          {nav.map(n => (
            <button
              key={n.key}
              onClick={() => { setActive(n.key); setMenuOpen(false); }}
              className={`font-body text-sm tracking-wider text-left py-3 border-b border-[#f5f0ea] last:border-0 ${active === n.key ? "text-[#A07830]" : "text-[#6b5e52]"}`}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
