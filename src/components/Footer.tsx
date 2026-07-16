import React from 'react';
import { Facebook, Youtube, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

interface FooterProps {
  setSection: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setSection }) => {
  const handleNavClick = (sectionId: string) => {
    setSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-blue-950 text-white font-sans mt-auto" id="main-footer">
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12" id="footer-upper">
        
        {/* Column 1: Imagine A Better Future */}
        <div className="flex flex-col gap-5" id="footer-col-1">
          <h3 className="text-xl font-bold border-l-4 border-[#da1e28] pl-3 tracking-tight" id="footer-title-1">
            Imagine A Better Future
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            Joy Fast Fly is one of the well-known and premier educational and visa consulting firms in Bangladesh. We process student visas in Canada, USA, UK, Spain, Australia, Sweden, and many more countries.
          </p>
          <button 
            onClick={() => handleNavClick('about')}
            className="text-[#da1e28] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors text-left w-fit mt-2 group"
            id="footer-learn-more-btn"
          >
            Learn More 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          {/* Socials Row */}
          <div className="flex items-center gap-3 mt-2" id="footer-socials">
            <a 
              href="https://www.facebook.com/61568464721808" 
              target="_blank" 
              rel="noreferrer" 
              className="w-9 h-9 rounded-full bg-blue-900 hover:bg-[#da1e28] flex items-center justify-center transition-all shadow"
              aria-label="Facebook Profile"
              id="footer-fb"
            >
              <Facebook size={16} />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noreferrer" 
              className="w-9 h-9 rounded-full bg-blue-900 hover:bg-[#da1e28] flex items-center justify-center transition-all shadow"
              aria-label="YouTube Channel"
              id="footer-yt"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Column 2: Destinations */}
        <div className="flex flex-col gap-5" id="footer-col-2">
          <h3 className="text-xl font-bold border-l-4 border-[#da1e28] pl-3 tracking-tight" id="footer-title-2">
            Major Destinations
          </h3>
          
          {/* Countries List Row */}
          <div className="flex flex-col gap-2.5 mt-2" id="footer-destinations-wrapper">
            <div className="flex flex-wrap items-center gap-4" id="footer-destinations">
              {['Italy', 'Hungary', 'Poland'].map((country) => (
                <div key={country} className="bg-blue-900/40 border border-blue-800/60 px-3 py-1.5 rounded-md text-xs font-semibold" title={country}>
                  {country}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Get In Touch */}
        <div className="flex flex-col gap-5" id="footer-col-3">
          <h3 className="text-xl font-bold border-l-4 border-[#da1e28] pl-3 tracking-tight" id="footer-title-3">
            Get In Touch
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-gray-300 font-medium" id="footer-contact-list">
            <li className="flex gap-2.5" id="footer-address">
              <MapPin size={18} className="text-[#da1e28] shrink-0 mt-0.5" />
              <span>
                Address: <a href="https://www.google.com/maps/search/?api=1&query=34+Noor+Jahan+Sharif+Plaza+Purana+Palton+Dhaka+1000" target="_blank" rel="noreferrer" className="hover:text-red-300 transition-colors">34. Noor Jahan Sharif Plaza (2nd Floor), Purana Palton, Dhaka 1000.</a>
              </span>
            </li>
            <li className="flex items-start gap-2.5" id="footer-phone">
              <Phone size={18} className="text-[#da1e28] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span>Hotline:</span>
                <a href="tel:+8801746983358" className="hover:text-red-300 transition-colors font-bold">01746-983358 (আতিক)</a>
                <a href="tel:+8801944554355" className="hover:text-red-300 transition-colors font-bold">01944-554355 (মশিউর)</a>
                <span className="text-xs text-gray-400">CEO WhatsApp: <a href="https://wa.me/4531875125" target="_blank" rel="noreferrer" className="hover:text-red-300 transition-colors font-extrabold">+45 31 87 51 25</a></span>
              </div>
            </li>
            <li className="flex items-start gap-2.5" id="footer-email">
              <Mail size={18} className="text-[#da1e28] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span>Email: <a href="mailto:joyfastfly@gmail.com" className="hover:text-red-300 transition-colors font-bold">joyfastfly@gmail.com</a></span>
                <span className="text-xs text-gray-400">CEO: Md. Azizul Mollah (Denmark Expatriate)</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Column 4: Promotional Wing Card (Matches Screen 5) */}
        <div className="relative overflow-hidden rounded-xl bg-blue-900/50 border border-blue-800/80 p-5 group shadow-lg flex flex-col justify-between min-h-[220px]" id="footer-col-4">
          {/* Subtle background image overlay */}
          <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600')] bg-cover bg-center opacity-15 transition-transform duration-500 group-hover:scale-105"></div>
          
          <div className="relative z-10 flex flex-col gap-2" id="footer-wing-card-header">
            <span className="bg-[#da1e28] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded w-fit">
              Canada
            </span>
            <h4 className="text-lg font-black tracking-tight uppercase" id="footer-wing-card-title">
              immigrations
            </h4>
          </div>

          <div className="relative z-10 mt-4" id="footer-wing-card-body">
            <p className="text-xs font-semibold text-gray-300 italic tracking-wider">
              "Give Wings to Your Dream"
            </p>
            <div className="mt-3 text-xs bg-blue-950/80 py-2 px-3 rounded-lg border border-blue-800/40 font-bold" id="footer-wing-card-call">
              Hotline: <span className="text-red-400">01746-983358</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-blue-950 border-t border-blue-900/60 py-5 text-center text-xs tracking-wider font-semibold text-gray-400 select-none" id="footer-copyright-bar">
        All Right Reserved JOY FAST FLY
      </div>
    </footer>
  );
};
