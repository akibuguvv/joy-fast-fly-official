import React, { useState } from 'react';
import { Menu, X, ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import { JtecLogo } from './JtecLogo';

interface HeaderProps {
  currentSection: string;
  setSection: (section: string) => void;
  setSelectedCountryId?: (id: string | null) => void;
  setSelectedDiscipline?: (discipline: string | null) => void;
  setNewsCategory?: (category: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentSection, 
  setSection,
  setSelectedCountryId,
  setSelectedDiscipline,
  setNewsCategory
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { 
      id: 'study-abroad', 
      label: 'Study Abroad',
      dropdown: ['Italy', 'Hungary']
    },
    {
      id: 'news',
      label: 'News & Media',
      dropdown: ['News', 'Videos', 'Pictures']
    },
    {
      id: 'work-abroad',
      label: 'Work Permits',
      dropdown: ['Poland']
    },
    { id: 'explore-country', label: 'Explore Country' },
    { id: 'schengen', label: 'Schengen Zone' },
    { id: 'contact', label: 'Register Online' }
  ];

  const handleNavClick = (sectionId: string, dropdownValue?: string) => {
    let targetSection = sectionId;
    if (sectionId === 'work-abroad') {
      targetSection = 'study-abroad';
    }
    
    if (targetSection === 'study-abroad') {
      targetSection = 'contact';
    }
    setSection(targetSection);
    
    if (targetSection === 'contact') {
      if (dropdownValue) {
        const countryMap: Record<string, string> = {
          'Italy': 'italy',
          'Hungary': 'hungary',
          'Poland': 'poland',
          'Cyprus': 'cyprus',
          'Romania': 'romania',
          'Serbia': 'serbia'
        };
        if (setSelectedCountryId) {
          setSelectedCountryId(countryMap[dropdownValue] || null);
        }
      }
    } else if (targetSection === 'courses') {
      if (dropdownValue) {
        if (setSelectedDiscipline) {
          setSelectedDiscipline(dropdownValue);
        }
      } else {
        if (setSelectedDiscipline) {
          setSelectedDiscipline('All');
        }
      }
    } else if (targetSection === 'news') {
      if (setNewsCategory) {
        setNewsCategory(dropdownValue || 'News');
      }
    }
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDropdown = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col" id="main-header">
      {/* Top Utility bar */}
      <div className="bg-blue-950 text-white text-[11px] py-2 px-4 md:px-8 hidden sm:flex justify-between items-center select-none" id="top-utility-bar">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 hover:text-red-300 transition-colors">
            <Phone size={12} className="text-[#da1e28]" />
            <a href="tel:+8801746983358">01746-983358 (আতিক)</a>, <a href="tel:+8801944554355">01944-554355 (মশিউর)</a>
          </span>
          <span className="flex items-center gap-1.5 hover:text-red-300 transition-colors border-l border-blue-800 pl-4">
            <Mail size={12} className="text-[#da1e28]" />
            <a href="mailto:joyfastfly@gmail.com">joyfastfly@gmail.com</a>
          </span>
          <span className="flex items-center gap-1.5 hover:text-red-300 transition-colors border-l border-blue-800 pl-4">
            <span className="text-green-400 font-extrabold uppercase text-[9px] tracking-widest bg-green-950 px-1.5 py-0.5 rounded">CEO WhatsApp</span>
            <a href="https://wa.me/4531875125" target="_blank" rel="noreferrer" className="font-extrabold">+45 31 87 51 25</a>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-red-400" />
          <span>34. Noor Jahan Sharif Plaza (2nd Floor), Purana Palton, Dhaka 1000.</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 shadow-sm relative z-30" id="primary-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer relative z-30" onClick={() => handleNavClick('home')} id="nav-logo-trigger">
            <JtecLogo />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2" id="desktop-nav-menu">
            {navItems.map((item) => (
              <div key={item.id} className="relative group" id={`nav-item-${item.id}`}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 transition-all ${
                    currentSection === item.id
                      ? 'text-[#da1e28] bg-red-50/75'
                      : 'text-blue-950 hover:text-[#da1e28] hover:bg-gray-50'
                  }`}
                  id={`nav-btn-${item.id}`}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown size={14} className="opacity-60 group-hover:rotate-180 transition-transform" />
                  )}
                </button>

                {/* Submenu on Hover */}
                {item.dropdown && (
                  <div 
                    className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50"
                    id={`dropdown-${item.id}`}
                  >
                    {item.dropdown.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavClick(item.id, sub)}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:text-[#da1e28] hover:bg-red-50/50 transition-colors"
                        id={`dropdown-${item.id}-item-${idx}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => handleNavClick('contact')}
              className="ml-4 px-5 py-2.5 bg-[#da1e28] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-md hover:bg-red-700 hover:shadow-lg transition-all"
              id="get-started-btn"
            >
              Register Now (রেজিস্ট্রেশন)
            </button>
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <div className="lg:hidden flex items-center" id="mobile-toggle-wrapper">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-blue-950 hover:text-[#da1e28] hover:bg-red-50 transition-colors"
              aria-label="Toggle navigation menu"
              id="mobile-hamburger-btn"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Matches Screen 2 Style) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-sm flex flex-col justify-start" id="mobile-drawer-overlay">
          <div className="w-full bg-white max-h-screen overflow-y-auto flex flex-col shadow-2xl" id="mobile-drawer-content">
            {/* Drawer Header (Crimson color from screenshot 2) */}
            <div className="bg-[#da1e28] px-4 py-4 flex items-center justify-between" id="mobile-drawer-header">
              <JtecLogo inverted={true} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                id="close-drawer-btn"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav List */}
            <div className="py-2 divide-y divide-gray-100" id="mobile-drawer-nav-list">
              {navItems.map((item) => (
                <div key={item.id} className="flex flex-col" id={`mobile-nav-${item.id}`}>
                  <div className="flex items-center justify-between px-6 py-4">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`text-left text-base font-bold tracking-tight ${
                        currentSection === item.id ? 'text-[#da1e28]' : 'text-blue-950'
                      }`}
                      id={`mobile-btn-${item.id}`}
                    >
                      {item.label}
                    </button>
                    {item.dropdown && (
                      <button
                        onClick={(e) => toggleDropdown(item.label, e)}
                        className="p-2 rounded-lg hover:bg-gray-50 text-gray-500"
                        id={`mobile-dropdown-toggle-${item.id}`}
                      >
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform duration-200 ${
                            activeDropdown === item.label ? 'rotate-180 text-[#da1e28]' : ''
                          }`} 
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dropdown Subitems */}
                  {item.dropdown && activeDropdown === item.label && (
                    <div className="bg-gray-50 px-8 py-2 flex flex-col gap-3 border-l-4 border-[#da1e28] mb-2" id={`mobile-sub-menu-${item.id}`}>
                      {item.dropdown.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNavClick(item.id, sub)}
                          className="text-left text-sm font-semibold text-gray-600 hover:text-[#da1e28] py-1"
                          id={`mobile-sub-menu-${item.id}-item-${idx}`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Contact info in Mobile menu */}
            <div className="bg-gray-50 p-6 flex flex-col gap-3 mt-auto" id="mobile-drawer-contacts">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Need Expert Advice?</span>
              <div className="flex flex-col gap-2">
                <a href="tel:+8801746983358" className="flex items-center gap-2 text-sm font-bold text-blue-950 hover:text-[#da1e28]">
                  <Phone size={16} className="text-[#da1e28]" />
                  <span>01746-983358 (আতিক)</span>
                </a>
                <a href="tel:+8801944554355" className="flex items-center gap-2 text-sm font-bold text-blue-950 hover:text-[#da1e28] ml-6">
                  <span>01944-554355 (মশিউর)</span>
                </a>
              </div>
              <a href="https://wa.me/4531875125" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-950 hover:text-[#da1e28]">
                <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded font-black">WhatsApp</span>
                +45 31 87 51 25
              </a>
              <a href="mailto:joyfastfly@gmail.com" className="flex items-center gap-2 text-sm font-bold text-blue-950 hover:text-[#da1e28]">
                <Mail size={16} className="text-[#da1e28]" />
                joyfastfly@gmail.com
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
