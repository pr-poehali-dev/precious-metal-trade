import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { NavItem } from "@/types/section";

interface HeaderProps {
  nav: NavItem[];
}

const Header = ({ nav }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#ede8df] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-left flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1410] flex items-center justify-center flex-shrink-0">
            <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-lg text-[#C8A050] leading-none">З</span>
          </div>
          <div className="leading-none">
            <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl text-[#1A1410]">Золотов</span>
            <span className="font-body text-[9px] tracking-[0.25em] text-[#A07830] uppercase block mt-0.5">Драгоценные металлы</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {nav.map(n => (
            <NavLink
              key={n.path}
              to={n.path}
              end={n.path === "/"}
              className={({ isActive }) =>
                `font-body text-sm tracking-widest uppercase transition-colors relative pb-1 ${
                  isActive
                    ? "text-[#A07830] after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#A07830]"
                    : "text-[#6b5e52] hover:text-[#1A1410]"
                }`
              }
            >
              {n.label}
            </NavLink>
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
            <NavLink
              key={n.path}
              to={n.path}
              end={n.path === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `font-body text-sm tracking-wider text-left py-3 border-b border-[#f5f0ea] last:border-0 ${isActive ? "text-[#A07830]" : "text-[#6b5e52]"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
