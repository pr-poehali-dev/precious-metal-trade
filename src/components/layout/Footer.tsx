import { Link } from "react-router-dom";
import { NavItem } from "@/types/section";

interface FooterProps {
  nav: NavItem[];
}

const Footer = ({ nav }: FooterProps) => {
  return (
    <footer className="bg-[#1A1410] border-t border-[#2a2018] py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#A07830] flex items-center justify-center flex-shrink-0">
            <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-base text-[#1A1410] leading-none">З</span>
          </div>
          <div className="leading-none text-left">
            <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-xl text-white">Золотов</span>
            <span className="font-body text-[9px] tracking-[0.25em] text-[#A07830] uppercase block mt-0.5">Драгоценные металлы</span>
          </div>
        </Link>
        <div className="flex gap-8">
          {nav.map(n => (
            <Link
              key={n.path}
              to={n.path}
              className="font-body text-xs text-[#6b5e52] hover:text-[#C8A050] tracking-widest uppercase transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </div>
        <p className="font-body text-xs text-[#4a3f35] tracking-wider">© 2024 Золотов. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
