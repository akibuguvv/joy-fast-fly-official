import React, { useState } from 'react';
import { COUNTRIES } from '../data';
import { Compass, GraduationCap, Calendar, DollarSign, ExternalLink, ShieldCheck } from 'lucide-react';

interface ExploreCountrySectionProps {
  setSection?: (section: string) => void;
  setSelectedCountryId?: (id: string | null) => void;
}

export const ExploreCountrySection: React.FC<ExploreCountrySectionProps> = ({
  setSection,
  setSelectedCountryId
}) => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Student', 'Work'];

  const getCategoryCountries = (cat: string) => {
    switch (cat) {
      case 'Student': return COUNTRIES.filter(c => c.visaType === 'student');
      case 'Work': return COUNTRIES.filter(c => c.visaType === 'work');
      default: return COUNTRIES;
    }
  };

  const countriesToShow = getCategoryCountries(activeTab);

  return (
    <div className="flex flex-col w-full bg-white" id="explore-country-section">
      {/* Page Header */}
      <section className="bg-blue-950 text-white py-16 px-4 text-center relative overflow-hidden" id="explore-country-banner">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#da1e28] text-xs font-black uppercase tracking-widest bg-red-500/10 px-3.5 py-1 rounded-full">
            GLOBAL ACCREDITED CENTERS
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1">
            Explore Destination Countries
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold max-w-lg mt-1">
            Choose from the world's most academically renowned and migrant-friendly destination hubs.
          </p>
        </div>
      </section>

      {/* Filters & Bento cards of countries */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-12" id="explore-country-content">
        
        {/* Filtering Tabs */}
        <div className="flex justify-center items-center gap-2.5 flex-wrap" id="explore-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all border ${
                activeTab === cat
                  ? 'bg-blue-950 border-blue-950 text-white shadow-md'
                  : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-500'
              }`}
              id={`explore-filter-btn-${cat.toLowerCase().replace(' ', '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Countries cards mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="explore-country-grid">
          {countriesToShow.map((country) => (
            <div 
              key={country.id}
              className="bg-white border border-gray-100/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full text-left group cursor-pointer"
              id={`explore-card-${country.id}`}
              onClick={() => {
                if (setSelectedCountryId) {
                  setSelectedCountryId(country.id);
                }
                if (setSection) {
                  setSection('contact');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {/* Image banner */}
              <div className="relative h-48 overflow-hidden shrink-0" id={`explore-card-img-wrapper-${country.id}`}>
                <img 
                  src={country.bgImage} 
                  alt={country.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                
                {/* Flag on top left */}
                <div className="absolute top-4 left-4 bg-white/95 border border-gray-200/50 p-1.5 rounded-xl shadow flex items-center gap-2" id={`explore-card-flag-${country.id}`}>
                  <img 
                     src={country.flagUrl} 
                     alt={country.name} 
                     className="w-8 h-5.5 object-cover rounded-sm"
                     referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-black text-blue-950 pr-1">{country.code}</span>
                </div>
                
                {/* Tuition banner on bottom right */}
                <div className="absolute bottom-4 right-4 bg-[#da1e28] text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded shadow" id={`explore-card-tuition-${country.id}`}>
                  {country.tuitionFee}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-grow gap-6" id={`explore-card-body-${country.id}`}>
                
                <div className="flex flex-col gap-4" id={`explore-card-info-top-${country.id}`}>
                  <h3 className="text-xl font-black text-blue-950 tracking-tight" id={`explore-card-title-${country.id}`}>
                    {country.visaType === 'work' ? `Work Permit in ${country.name}` : `Study in ${country.name}`}
                  </h3>
                  
                  {/* Highlights list */}
                  <ul className="flex flex-col gap-2.5 text-xs text-gray-500 font-semibold" id={`explore-card-highlights-${country.id}`}>
                    {country.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx} className="flex gap-2 items-start" id={`explore-card-highlight-${country.id}-${idx}`}>
                        <span className="text-[#da1e28] font-black shrink-0">✓</span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements footer bar */}
                <div className="border-t border-gray-100 pt-4 flex flex-col gap-3" id={`explore-card-info-bottom-${country.id}`}>
                  <div className="flex justify-between items-center text-xs font-bold" id={`explore-card-requirements-${country.id}`}>
                    <span className="text-gray-400">
                      {country.visaType === 'work' ? 'Language Need' : 'Min English'}
                    </span>
                    <span className="text-blue-950 font-black bg-red-50 text-[#da1e28] px-2.5 py-0.5 rounded-md">
                      {country.visaType === 'work' ? 'No IELTS' : country.requirements.ielts}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-bold" id={`explore-card-intakes-${country.id}`}>
                    <span className="text-gray-400">
                      {country.visaType === 'work' ? 'Processing' : 'Intakes'}
                    </span>
                    <span className="text-blue-950 font-black uppercase text-[10px] tracking-wide text-right">
                      {country.intakes.join(', ')}
                    </span>
                  </div>

                  {setSection && (
                    <button
                      onClick={() => {
                        if (setSelectedCountryId) {
                          setSelectedCountryId(country.id);
                        }
                        setSection('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full mt-2 py-2.5 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-sm ${
                        country.visaType === 'work' 
                          ? 'bg-blue-950 hover:bg-blue-900' 
                          : 'bg-[#da1e28] hover:bg-red-700'
                      }`}
                      id={`explore-btn-${country.id}`}
                    >
                      {country.visaType === 'work' ? 'Explore Work Permit' : 'Explore Study Entry'}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};
