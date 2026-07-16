import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Globe, 
  Compass, 
  Luggage, 
  GraduationCap, 
  ArrowRight, 
  Play,
  Users
} from 'lucide-react';
import { getMergedCountries } from '../data';

interface SchengenSectionProps {
  setSection?: (sec: string) => void;
  setSelectedCountryId?: (id: string | null) => void;
}

export const SchengenSection: React.FC<SchengenSectionProps> = ({ setSection, setSelectedCountryId }) => {
  const highlights = [
    {
      title: 'One Single Visa',
      desc: 'Travel across 29 European countries',
      icon: Compass,
    },
    {
      title: 'Easy Travel',
      desc: 'Move freely without border controls',
      icon: Luggage,
    },
    {
      title: 'For Students',
      desc: 'Study, explore & build your future in Europe',
      icon: GraduationCap,
    },
    {
      title: 'Trusted Guidance',
      desc: 'Official Schengen portal companion',
      icon: Globe,
    }
  ];

  // Filter only the Schengen countries present in our database/list of countries
  const schengenCountryIds = ['italy', 'hungary', 'poland', 'romania'];
  const countriesList = getMergedCountries();
  const exploreCountries = countriesList.filter(c => 
    schengenCountryIds.includes(c.id.toLowerCase()) || 
    c.name.toLowerCase().includes('italy') || 
    c.name.toLowerCase().includes('hungary') || 
    c.name.toLowerCase().includes('poland') || 
    c.name.toLowerCase().includes('romania') ||
    c.highlights.some(h => h.toLowerCase().includes('schengen'))
  );

  const journeySteps = [
    {
      step: '01',
      title: 'Prepare Documents',
      desc: 'Gather all required documents as per the checklist.',
      icon: FileText
    },
    {
      step: '02',
      title: 'University Offer',
      desc: 'Get admission offer from a recognized university.',
      icon: GraduationCap
    },
    {
      step: '03',
      title: 'Embassy Interview',
      desc: 'Attend your interview and submit biometrics.',
      icon: Users
    },
    {
      step: '04',
      title: 'Visa Approved',
      desc: 'Receive your visa and start your journey.',
      icon: ShieldCheck
    }
  ];

  const checklistLeft = [
    'Schengen Visa Application Form',
    'Valid Bangladeshi Passport (min. 3 months validity)',
    'University Offer & Acceptance Letter',
    'Proof of Financial Solvency'
  ];

  const checklistRight = [
    'Travel Health Insurance (Min. €30,000 coverage)',
    'Proof of Accommodation',
    'Academic Certificates & Transcripts',
    'No Objection Certificate (NOC)'
  ];

  return (
    <div className="flex flex-col w-full bg-[#f8fafc]" id="schengen-section">
      {/* Banner/Header Block */}
      <section className="relative bg-[#02142d] overflow-hidden py-16 md:py-24 px-4 sm:px-8 text-left" id="schengen-banner">
        {/* Map backdrop silhouette */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200')] bg-cover bg-center"></div>
        
        {/* Beautiful scenic overlay on the right on desktop */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h-full opacity-30 lg:opacity-100 pointer-events-none">
          {/* Soft gradient from deep blue on the left to transparent/image on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#02142d] via-[#02142d]/80 lg:via-[#02142d]/30 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1200"
            alt="Schengen scenic town"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Dynamic circular arrangement of 12 stars */}
        <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] text-yellow-500/10 pointer-events-none hidden lg:block">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x = 50 + 38 * Math.cos(angle);
              const y = 50 + 38 * Math.sin(angle);
              return (
                <path
                  key={i}
                  d="M0,-3 L0.9,-0.9 L3,-0.9 L1.3,0.4 L1.8,2.5 L0,1.2 L-1.8,2.5 L-1.3,0.4 L-3,-0.9 L-0.9,-0.9 Z"
                  transform={`translate(${x}, ${y}) scale(1.5)`}
                  fill="currentColor"
                />
              );
            })}
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-[#da1e28] text-xs font-black uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full w-fit">
              EUROPEAN IMMIGRATION STANDARD
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              Schengen Zone <br className="hidden md:inline" />
              Student Visas
            </h1>
            <p className="text-slate-300 text-sm md:text-base font-semibold max-w-xl leading-relaxed mt-1">
              Understand the strict criteria for visa processing across Sweden, Spain, Germany, and other Schengen countries.
            </p>
            
            {/* Banner buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() => setSection?.('contact')}
                className="bg-[#da1e28] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
              >
                Apply Now
                <span className="w-5 h-5 rounded-full bg-white text-[#da1e28] flex items-center justify-center shrink-0">
                  <ArrowRight size={12} className="stroke-[3]" />
                </span>
              </button>
              
              <button
                onClick={() => {
                  const el = document.getElementById('schengen-journey');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                  <Play size={10} className="fill-white stroke-none ml-0.5" />
                </span>
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights card overlapping the banner */}
      <section className="relative z-30 max-w-6xl mx-auto w-full px-4 -mt-12 sm:-mt-16 mb-16">
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className={`flex items-center gap-4 ${idx > 0 ? 'pt-6 md:pt-0 md:pl-6' : ''}`}>
                  <div className="w-12 h-12 bg-blue-50 text-blue-950 rounded-full flex items-center justify-center shrink-0 border border-blue-100">
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  <div className="text-left leading-tight">
                    <h4 className="font-black text-blue-950 text-sm md:text-base">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-extrabold mt-1 uppercase tracking-tight">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Explore Countries Section */}
      <section className="py-8 max-w-6xl mx-auto w-full px-4 text-center flex flex-col gap-8" id="schengen-explore">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-black text-blue-950 tracking-tight">
            Explore Schengen Countries
          </h2>
          <div className="w-12 h-1 bg-[#da1e28] rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4 max-w-4xl mx-auto justify-center">
          {exploreCountries.map((country) => (
            <div 
              key={country.id} 
              onClick={() => {
                if (setSelectedCountryId) {
                  setSelectedCountryId(country.id);
                }
                if (setSection) {
                  setSection('explore-country');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-3.5 text-center transition-all hover:shadow-lg hover:scale-[1.03] cursor-pointer group hover:border-red-100 shadow-sm"
            >
              <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm shrink-0 transition-transform group-hover:scale-105">
                <img 
                  src={country.flagUrl} 
                  alt={country.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">
                {country.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-12 max-w-6xl mx-auto w-full px-4 text-center flex flex-col gap-10" id="schengen-journey">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-black text-blue-950 tracking-tight">
            Your Journey To Schengen Student Visa
          </h2>
          <div className="w-12 h-1 bg-[#da1e28] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4 relative">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col items-center text-center gap-4 transition-all hover:shadow-lg relative h-full">
                  {/* Step number in top right/left */}
                  <span className="absolute top-4 right-5 text-sm font-black text-[#da1e28]/20 group-hover:text-[#da1e28] transition-colors">
                    {step.step}
                  </span>
                  
                  {/* Circular Icon */}
                  <div className="w-14 h-14 bg-red-50 text-[#da1e28] rounded-full flex items-center justify-center shrink-0 border border-red-100/50">
                    <Icon size={24} className="stroke-[2.5]" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-extrabold text-blue-950 text-sm md:text-base">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Connecting arrow/line on desktop */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-20 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-300 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" strokeDasharray="2 2" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Required Document Checklist */}
      <section className="py-12 max-w-6xl mx-auto w-full px-4 text-center flex flex-col gap-8" id="schengen-checklist">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-black text-blue-950 tracking-tight">
            Required Document Checklist
          </h2>
          <div className="w-12 h-1 bg-[#da1e28] rounded-full"></div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs max-w-5xl mx-auto w-full text-left mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-3">
              {checklistLeft.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#da1e28] flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-black text-blue-950 tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3">
              {checklistRight.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#da1e28] flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-black text-blue-950 tracking-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="max-w-6xl mx-auto w-full px-4 py-8 mb-16" id="schengen-cta">
        <div className="bg-[#01142a] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Decorative vectors / skyline silhouette */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200')] bg-cover bg-center opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
          
          {/* Consultant Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 text-center sm:text-left w-full md:w-auto">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400" 
                alt="Joy Fast Fly Consultant" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl font-black text-white">
                Ready to Study in Europe?
              </h3>
              <p className="text-slate-300 text-xs md:text-sm font-semibold mt-1">
                Talk to our visa experts and get free consultation.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={() => window.open('https://wa.me/4531875125', '_blank')}
              className="w-full sm:w-auto border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {/* WhatsApp Icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.167 1.45 4.8 1.45 5.334 0 9.69-4.322 9.693-9.617a9.55 9.55 0 0 0-2.846-6.784 9.546 9.546 0 0 0-6.79-2.802c-5.341 0-9.694 4.32-9.697 9.617a9.5 9.5 0 0 0 1.47 5.068l-.99 3.613 3.738-.97z" />
              </svg>
              Chat on WhatsApp
            </button>
            
            <button
              onClick={() => setSection?.('contact')}
              className="w-full sm:w-auto bg-[#da1e28] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md shadow-red-600/10 cursor-pointer"
            >
              Apply Now
              <span className="w-5 h-5 rounded-full bg-white text-[#da1e28] flex items-center justify-center shrink-0">
                <ArrowRight size={12} className="stroke-[3]" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
