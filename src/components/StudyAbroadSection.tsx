import React, { useState } from 'react';
import { getMergedCountries } from '../data';
import { CheckCircle2, GraduationCap, Calendar, Clock, DollarSign, FileText } from 'lucide-react';

interface StudyAbroadSectionProps {
  selectedCountryId?: string | null;
  setSelectedCountryId?: (id: string) => void;
  setSection: (section: string) => void;
}

export const StudyAbroadSection: React.FC<StudyAbroadSectionProps> = ({
  selectedCountryId = null,
  setSelectedCountryId,
  setSection
}) => {
  const countriesList = getMergedCountries();
  const [localSelectedCountry, setLocalSelectedCountry] = useState(countriesList[0]?.id || 'cyprus');

  const activeId = selectedCountryId || localSelectedCountry;
  const setActiveId = (id: string) => {
    if (setSelectedCountryId) {
      setSelectedCountryId(id);
    }
    setLocalSelectedCountry(id);
  };

  const activeCountry = countriesList.find(c => c.id === activeId) || countriesList[0] || { id: 'cyprus', name: 'Cyprus', code: 'CY', flagUrl: '', bgImage: '', highlights: [], intakes: [], requirements: { education: '', ielts: '', funds: '' }, popularCourses: [], tuitionFee: '', visaType: 'student' };
  const isWorkVisa = activeCountry.visaType === 'work';

  return (
    <div className="flex flex-col w-full bg-white" id="study-abroad-section">
      {/* Page Header */}
      <section className="bg-blue-950 text-white py-16 px-4 text-center relative overflow-hidden" id="study-banner">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#da1e28] text-xs font-black uppercase tracking-widest bg-red-500/10 px-3.5 py-1 rounded-full">
            OUR COMPREHENSIVE ROADMAP
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1">
            Study & Work Permits Guide
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold max-w-lg mt-1">
            Pick your target country and learn about the entry requirements, processing timelines, costs, and stable pathways.
          </p>
        </div>
      </section>

      {/* Selector Tabs & Information Panels */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full" id="study-abroad-selector">
        <div className="flex flex-col lg:flex-row gap-12" id="study-abroad-layout">
          
          {/* Left Navigation countries menu */}
          <div className="lg:w-1/3 flex flex-col gap-6 shrink-0" id="study-countries-sidebar">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left pl-2">Study Abroad Destinations</span>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none" id="sidebar-student-tabs">
                {countriesList.filter(c => c.visaType !== 'work').map((country) => (
                  <button
                    key={country.id}
                    onClick={() => setActiveId(country.id)}
                    className={`px-5 py-3.5 rounded-full flex items-center justify-between text-left transition-all shrink-0 font-extrabold text-sm border ${
                      activeId === country.id
                        ? 'bg-[#da1e28] border-[#da1e28] text-white shadow-md shadow-red-500/20'
                        : 'bg-white border-gray-100 hover:bg-gray-50 text-blue-950'
                    }`}
                    id={`tab-btn-${country.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={country.flagUrl} 
                        alt={country.name} 
                        className="w-7 h-5 object-cover rounded-sm border border-gray-200/50"
                        referrerPolicy="no-referrer"
                      />
                      <span>{country.name}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                      activeId === country.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {country.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left pl-2">Work Permits (Skilled Worker)</span>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none" id="sidebar-work-tabs">
                {countriesList.filter(c => c.visaType === 'work').map((country) => (
                  <button
                    key={country.id}
                    onClick={() => setActiveId(country.id)}
                    className={`px-5 py-3.5 rounded-full flex items-center justify-between text-left transition-all shrink-0 font-extrabold text-sm border ${
                      activeId === country.id
                        ? 'bg-blue-950 border-blue-950 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white border-gray-100 hover:bg-gray-50 text-blue-950'
                    }`}
                    id={`tab-btn-${country.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={country.flagUrl} 
                        alt={country.name} 
                        className="w-7 h-5 object-cover rounded-sm border border-gray-200/50"
                        referrerPolicy="no-referrer"
                      />
                      <span>{country.name}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                      activeId === country.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {country.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Information panel detail */}
          <div className="lg:w-2/3 flex flex-col gap-8 bg-gray-50/50 border border-gray-100 rounded-3xl p-6 md:p-10 text-left" id="study-abroad-info-panel">
            
            {/* Header section with cover */}
            <div className="flex flex-col gap-6 pb-6 border-b border-gray-200/60" id="panel-header">
              <img 
                src={activeCountry.bgImage} 
                alt={activeCountry.name} 
                className="w-full h-48 object-cover rounded-2xl shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="flex items-center gap-4">
                <img 
                  src={activeCountry.flagUrl} 
                  alt={activeCountry.name} 
                  className="w-16 h-11 object-cover rounded-md border border-gray-100 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-blue-950 tracking-tight" id="active-country-title">
                    {isWorkVisa ? `Work Permit in ${activeCountry.name}` : `Study in ${activeCountry.name}`}
                  </h2>
                  <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">
                    {isWorkVisa ? 'Authorized Skilled Worker Visa Processing' : 'Authorized processing of student applications'}
                  </p>
                </div>
              </div>
            </div>
              

            </div>

            {/* Highlights bullet grid */}
            <div className="flex flex-col gap-4" id="panel-highlights-container">
              <h3 className="text-base font-black text-blue-950 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#da1e28]" />
                {isWorkVisa ? 'Job Agreement & Worker Benefits' : 'Key Highlights & Stay-Back Benefits'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="panel-highlights-grid">
                {activeCountry.highlights.map((item, idx) => (
                  <div key={idx} className="flex gap-2 bg-white border border-gray-100/80 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow" id={`highlight-item-${idx}`}>
                    <span className="text-red-600 font-extrabold text-xs">✓</span>
                    <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* General Admission Requirements (IELTS, Education, Funds) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="panel-requirements">
              
              {/* Education Box */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3" id="req-education">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-[#da1e28]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isWorkVisa ? 'Required Qualifications' : 'Educational Qualification'}
                  </span>
                  <p className="text-xs font-bold text-blue-950 leading-relaxed">
                    {activeCountry.requirements.education}
                  </p>
                </div>
              </div>

              {/* IELTS Box */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3" id="req-ielts">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-[#da1e28]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isWorkVisa ? 'Language / Video Skill' : 'English Proficiency'}
                  </span>
                  <p className="text-xs font-bold text-blue-950 leading-relaxed">
                    {activeCountry.requirements.ielts}
                  </p>
                </div>
              </div>

              {/* Funds Proof Box */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3" id="req-funds">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <DollarSign size={18} className="text-[#da1e28]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isWorkVisa ? 'Financials & Solvency' : 'Financial Solvency Proof'}
                  </span>
                  <p className="text-xs font-bold text-blue-950 leading-relaxed">
                    {activeCountry.requirements.funds}
                  </p>
                </div>
              </div>

            </div>

            {/* Intakes & Popular Disciplines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2" id="panel-intakes-courses">
              
              {/* Intakes Panel */}
              <div className="bg-blue-950 text-white rounded-2xl p-5 flex items-center justify-between gap-4" id="intake-panel-box">
                {/* LEFT: Button */}
                <button
                  onClick={() => {
                      if (setSelectedCountryId) {
                        setSelectedCountryId(activeCountry.id);
                      }
                      if (setSection) {
                        setSection('contact');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-10 py-4 bg-[#da1e28] text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-red-700 shadow-xl shadow-red-500/20 shrink-0 transition-all hover:scale-105 hover:-translate-y-0.5 border-b-4 border-red-900"
                >
                    Register Now
                </button>

                {/* RIGHT: Intakes */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest text-right">
                    {isWorkVisa ? 'Visa Timeline' : 'Available Intakes'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-end" id="intakes-list">
                    {activeCountry.intakes.map((intake, idx) => (
                      <span key={idx} className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition-colors" id={`intake-badge-${idx}`}>
                        {intake}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular courses */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-2.5" id="popular-panel-box">
                <span className="text-xs font-black text-blue-950 uppercase tracking-wider">
                  {isWorkVisa ? 'In-Demand Job Trades / Sectors' : 'Recommended Disciplines'}
                </span>
                <div className="flex flex-wrap gap-2" id="popular-courses-list">
                  {activeCountry.popularCourses.map((course, idx) => (
                    <span key={idx} className="bg-red-50 text-[#da1e28] px-3 py-1 rounded-full text-[11px] font-bold" id={`course-badge-${idx}`}>
                      {course}
                    </span>
                  ))}
                </div>
              </div>

            </div>

        </div>
      </section>

    </div>
  );
};
