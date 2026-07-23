import React, { useState, useMemo } from 'react';
import { getMergedCountries } from '../data';
import { CountryInfo } from '../types';
import { 
  Compass, 
  GraduationCap, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  HelpCircle, 
  Search, 
  MessageSquare,
  Hotel,
  Code,
  Landmark,
  Hammer,
  Package,
  Truck,
  Leaf,
  Globe,
  DollarSign,
  Calendar,
  Download,
  ChevronLeft,
  Check
} from 'lucide-react';

interface ExploreCountrySectionProps {
  setSection?: (section: string) => void;
  setSelectedCountryId?: (id: string | null) => void;
}

export const ExploreCountrySection: React.FC<ExploreCountrySectionProps> = ({
  setSection,
  setSelectedCountryId
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'student' | 'work'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filter countries by tab and search query
  const filteredCountries = useMemo(() => {
    return getMergedCountries().filter(country => {
      // Filter by category
      if (activeTab !== 'All' && country.visaType !== activeTab) {
        return false;
      }
      // Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = country.name.toLowerCase().includes(query);
        const matchesCourses = country.popularCourses.some(course => course.toLowerCase().includes(query));
        const matchesHighlights = country.highlights.some(hl => hl.toLowerCase().includes(query));
        return matchesName || matchesCourses || matchesHighlights;
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  // Handle CTA actions
  const handleApplyNow = (countryId: string) => {
    if (setSelectedCountryId) {
      setSelectedCountryId(countryId);
    }
    if (setSection) {
      setSection('contact');
    }
    setSelectedCountry(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppChat = () => {
    window.open('https://wa.me/4531875125', '_blank');
  };

  const triggerDownload = (countryId: string, countryName: string) => {
    try {
      const savedPdfsStr = localStorage.getItem('joyfastfly_country_pdfs');
      if (savedPdfsStr) {
        const savedPdfs = JSON.parse(savedPdfsStr);
        const countryPdf = savedPdfs[countryId.toLowerCase()];
        if (countryPdf && countryPdf.pdfUrl) {
          // Trigger actual download of the base64 pdf file
          const link = document.createElement('a');
          link.href = countryPdf.pdfUrl;
          link.download = countryPdf.pdfName || `${countryName}_Document_Checklist.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setDownloadSuccess(true);
          setTimeout(() => {
            setDownloadSuccess(false);
          }, 4000);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to download custom country PDF:', e);
    }

    // Fallback: Generate a clean text-based document checklist
    const checklistText = `=====================================================
          JOY FAST FLY - CONSULTANCY PORTAL
       Official Document Checklist: ${countryName}
=====================================================

Dear Applicant,

Please prepare the following required documents for your visa application
process to ${countryName}:

[ ] 1. Valid International Passport (With minimum 1-year validity)
[ ] 2. All Academic Certificates & Marksheets (Attested/Apostilled)
[ ] 3. Professional Passport-size Photographs (White background)
[ ] 4. Proof of Financial Solvency / Bank Statement
[ ] 5. Medical Health Insurance Certificate
[ ] 6. Accommodation Proof / Host Agreement
[ ] 7. Completed and Signed Visa Application Form

For any queries, please contact Joy Fast Fly at joyfastfly@gmail.com
Or call us at: +8801746983358, +8801944554355

Thank you,
Joy Fast Fly Team
Web: joyfastfly.com`;

    const blob = new Blob([checklistText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${countryName}_Document_Checklist.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  // Helper to map country-specific currencies and membership subtitles
  const getCountrySpecs = (country: CountryInfo) => {
    const id = country.id.toLowerCase();
    switch (id) {
      case 'cyprus':
        return {
          subtitle: 'European Union Member',
          language: 'English',
          currency: 'Euro (EUR)',
          intakes: 'Jan, May, Sep'
        };
      case 'south-cyprus':
        return {
          subtitle: 'European Union Member',
          language: 'English / Greek',
          currency: 'Euro (EUR)',
          intakes: 'Feb, Sep'
        };
      case 'northern-cyprus':
        return {
          subtitle: 'European Continent',
          language: 'English / Turkish',
          currency: 'Turkish Lira (TRY)',
          intakes: 'Feb, Sep'
        };
      case 'greece':
        return {
          subtitle: 'Schengen Zone Member',
          language: 'Greek / English',
          currency: 'Euro (EUR)',
          intakes: 'Feb, Sep, Oct'
        };
      case 'serbia':
        return {
          subtitle: 'European Continent',
          language: 'English / Serbian',
          currency: 'Serbian Dinar (RSD)',
          intakes: 'All Year Round'
        };
      case 'romania':
        return {
          subtitle: 'European Union Member',
          language: 'English / Romanian',
          currency: 'Romanian Leu (RON)',
          intakes: 'All Year Round'
        };
      default:
        return {
          subtitle: 'Schengen Member',
          language: 'English',
          currency: 'Euro (EUR)',
          intakes: 'Jan, Sep'
        };
    }
  };

  // Helper to dynamically match icons for popular courses
  const getDisciplineIcon = (courseName: string) => {
    const name = courseName.toLowerCase();
    if (name.includes('hotel') || name.includes('tourism') || name.includes('culinary') || name.includes('hospitality')) {
      return <Hotel size={24} className="text-[#da1e28]" />;
    }
    if (name.includes('business') || name.includes('administration') || name.includes('economics') || name.includes('management')) {
      return <Briefcase size={24} className="text-[#da1e28]" />;
    }
    if (name.includes('computer') || name.includes('software') || name.includes('science') || name.includes('it') || name.includes('engineering') || name.includes('cyber')) {
      return <Code size={24} className="text-[#da1e28]" />;
    }
    if (name.includes('accounting') || name.includes('finance') || name.includes('bank')) {
      return <Landmark size={24} className="text-[#da1e28]" />;
    }
    if (name.includes('construction') || name.includes('masonry') || name.includes('welders') || name.includes('weld') || name.includes('building')) {
      return <Hammer size={24} className="text-[#da1e28]" />;
    }
    if (name.includes('factory') || name.includes('packing') || name.includes('warehouse') || name.includes('packers') || name.includes('assistant')) {
      return <Package size={24} className="text-[#da1e28]" />;
    }
    if (name.includes('driver') || name.includes('drivers') || name.includes('logistics')) {
      return <Truck size={24} className="text-[#da1e28]" />;
    }
    if (name.includes('agriculture') || name.includes('farms') || name.includes('leaf') || name.includes('food')) {
      return <Leaf size={24} className="text-[#da1e28]" />;
    }
    return <GraduationCap size={24} className="text-[#da1e28]" />;
  };

  // If a country is selected, show the magnificent, highly detailed, screenshot-matched view!
  if (selectedCountry) {
    const specs = getCountrySpecs(selectedCountry);
    const isStudent = selectedCountry.visaType === 'student';

    return (
      <div className="flex flex-col w-full bg-[#fcfdfe] font-sans pb-24 text-left animate-fade-in" id="country-detail-view-container">
        
        {/* Back navigation & Breadcrumbs Bar */}
        <div className="bg-slate-50 border-b border-slate-100 py-4 px-4 md:px-8 select-none" id="country-detail-breadcrumbs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => { setSelectedCountry(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 text-slate-700 hover:text-[#da1e28] text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              id="back-to-destinations-btn"
            >
              <ChevronLeft size={16} className="stroke-[3]" />
              Back to Destinations
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Home</span>
              <span>/</span>
              <span>Explore Countries</span>
              <span>/</span>
              <span className="text-slate-800 font-black">{selectedCountry.name}</span>
            </div>
          </div>
        </div>

        {/* 1. HERO HEADER AREA (Matches Cyprus screenshot) */}
        <section 
          className="relative text-white py-16 md:py-24 px-4 md:px-8 overflow-hidden" 
          id="detail-hero-banner"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(11, 27, 61, 0.95) 45%, rgba(15, 23, 42, 0.4)), url('${selectedCountry.bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left side texts */}
            <div className="lg:col-span-7 flex flex-col items-start text-left gap-5" id="detail-hero-left">
              
              {/* Pill badge (STUDY IN EUROPE or WORK PERMIT) */}
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xs" id="detail-category-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                {isStudent ? 'STUDY IN EUROPE' : 'WORK IN EUROPE'}
              </span>

              {/* Title: Study in Cyprus or Work Permit in Poland */}
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase" id="detail-main-title">
                {isStudent ? 'Study in' : 'Work Permit in'} <span className="text-[#da1e28]">{selectedCountry.name}</span>
              </h1>

              {/* Long description subtitle */}
              <p className="text-slate-200 text-base md:text-lg max-w-xl font-medium leading-relaxed" id="detail-subtitle">
                {selectedCountry.highlights[1] || selectedCountry.highlights[0] || 'Quality education pathways, high visa success rates, and stable career paths across the European continent.'}
              </p>

              {/* Highlights pills */}
              <div className="flex flex-wrap items-center gap-6 mt-4 w-full" id="detail-highlights-row">
                {/* Highlight 1: No IELTS */}
                <div className="flex items-center gap-2 text-xs md:text-sm font-black text-white bg-white/10 backdrop-blur-md border border-white/25 px-4 py-2.5 rounded-xs" id="detail-hl-ielts">
                  <ShieldCheck size={18} className="text-green-400 stroke-[2.5]" />
                  <span>No IELTS Required</span>
                </div>
                {/* Highlight 2: Processing Duration */}
                <div className="flex items-center gap-2 text-xs md:text-sm font-black text-white bg-white/10 backdrop-blur-md border border-white/25 px-4 py-2.5 rounded-xs" id="detail-hl-timeline">
                  <Clock size={18} className="text-[#da1e28] stroke-[2.5]" />
                  <span>{selectedCountry.intakes[0]} Processing</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6 w-full" id="detail-hero-actions">
                <button
                  type="button"
                  onClick={() => handleApplyNow(selectedCountry.id)}
                  className="px-8 py-4 bg-[#da1e28] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-all shadow-xl hover:-translate-y-0.5 border-b-4 border-red-900 flex items-center justify-center gap-2"
                  id="detail-apply-btn"
                >
                  Apply Now <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-all border border-white/30 flex items-center justify-center gap-2"
                  id="detail-expert-btn"
                >
                  <MessageSquare size={15} className="fill-white" />
                  Talk to Expert
                </button>
              </div>

            </div>

            {/* Right side floating specification card (Matches screenshot exactly!) */}
            <div className="lg:col-span-5 flex justify-center" id="detail-hero-right">
              <div className="bg-white text-slate-800 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl border border-slate-100 flex flex-col gap-6" id="detail-spec-card">
                
                {/* Specs Header: Flag, Country, Subtitle */}
                <div className="flex items-center gap-4 border-b border-gray-100 pb-5" id="spec-card-header">
                  <div className="w-16 h-11 shrink-0 overflow-hidden rounded-md border border-slate-200 shadow-md">
                    <img 
                      src={selectedCountry.flagUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                      {selectedCountry.name}
                    </h3>
                    <span className="text-xs font-black text-[#da1e28] uppercase tracking-wide mt-1">
                      {specs.subtitle}
                    </span>
                  </div>
                </div>

                {/* Specification Table Rows */}
                <div className="flex flex-col gap-4 text-sm font-semibold text-slate-700" id="spec-card-rows">
                  
                  {/* Row 1: Language */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50" id="spec-row-lang">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Globe size={18} className="text-[#da1e28]" />
                      <span>Language</span>
                    </div>
                    <span className="text-slate-900 font-black">{specs.language}</span>
                  </div>

                  {/* Row 2: Currency */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-50" id="spec-row-curr">
                    <div className="flex items-center gap-3 text-slate-500">
                      <DollarSign size={18} className="text-[#da1e28]" />
                      <span>Currency</span>
                    </div>
                    <span className="text-slate-900 font-black">{specs.currency}</span>
                  </div>

                  {/* Row 3: Intakes / Onboarding */}
                  <div className="flex items-center justify-between py-1" id="spec-row-intakes">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Calendar size={18} className="text-[#da1e28]" />
                      <span>Intakes</span>
                    </div>
                    <span className="text-[#da1e28] font-black">{specs.intakes}</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SUCCESS NOTIFICATION TOAST FOR PDF DOWNLOADS */}
        {downloadSuccess && (
          <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-3 z-50 animate-slide-up" id="download-success-toast">
            <span className="w-7 h-7 rounded-full bg-[#da1e28] flex items-center justify-center text-white shrink-0">
              <Check size={14} className="stroke-[3]" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black uppercase tracking-wider text-[#da1e28]">Success</span>
              <span className="text-xs font-bold text-gray-300">Official checklist for {selectedCountry.name} downloaded!</span>
            </div>
          </div>
        )}

        {/* 2. POPULAR DISCIPLINES SECTION (Matches screenshot grid) */}
        <section className="bg-white py-16 px-4 md:px-8 border-b border-gray-100" id="detail-disciplines-section">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            
            {/* Headers */}
            <div className="text-left" id="disciplines-header">
              <span className="text-xs font-black uppercase text-[#da1e28] tracking-[0.2em]">
                POPULAR DISCIPLINES
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight mt-1">
                {isStudent ? `Top Fields to Study in ${selectedCountry.name}` : `In-Demand Job Sectors in ${selectedCountry.name}`}
              </h2>
            </div>

            {/* Disciplines Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="disciplines-grid">
              {selectedCountry.popularCourses.map((course, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 hover:bg-white border border-slate-150/50 hover:border-red-100 p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center justify-between gap-5 group min-h-[180px]"
                  id={`discipline-card-${idx}`}
                >
                  <div className="w-14 h-14 bg-red-50/60 rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110" id={`discipline-icon-${idx}`}>
                    {getDisciplineIcon(course)}
                  </div>
                  
                  <h4 className="text-sm font-black text-blue-950 tracking-tight leading-snug max-w-[180px]" id={`discipline-title-${idx}`}>
                    {course}
                  </h4>

                  <ArrowRight size={14} className="text-[#da1e28] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all stroke-[3]" />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 3. WHY CHOOSE SECTION (Matches Cyprus screenshot's horizontal layout style) */}
        <section className="py-16 px-4 md:px-8 bg-[#fafbfc] border-b border-gray-100" id="detail-why-choose-section">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            
            {/* Headers */}
            <div className="text-left" id="why-choose-header">
              <span className="text-xs font-black uppercase text-[#da1e28] tracking-[0.2em]">
                WHY CHOOSE {selectedCountry.name.toUpperCase()}?
              </span>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="why-choose-grid">
              
              {/* Card 1: Costs */}
              <div className="bg-white border border-gray-150/50 p-6 rounded-2xl flex items-start gap-4 text-left shadow-xs hover:shadow-md transition-all" id="why-choose-card-1">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0" id="why-icon-1">
                  <DollarSign size={18} className="text-[#da1e28]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    {isStudent ? 'Affordable Tuition Fees' : 'Guaranteed Legal Salary'}
                  </h4>
                  <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                    {isStudent 
                      ? `Affordable education at reasonable cost with transparent semester structures of ${selectedCountry.tuitionFee}.` 
                      : `Highly stable contracts with stable monthly salaries and guaranteed overtime allowances.`}
                  </p>
                </div>
              </div>

              {/* Card 2: Visa Success Rate */}
              <div className="bg-white border border-gray-150/50 p-6 rounded-2xl flex items-start gap-4 text-left shadow-xs hover:shadow-md transition-all" id="why-choose-card-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0" id="why-icon-2">
                  <ShieldCheck size={18} className="text-[#da1e28]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    High Visa Success Rate
                  </h4>
                  <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                    Easy visa and work permit application processes with highly dedicated legal submission guidance.
                  </p>
                </div>
              </div>

              {/* Card 3: Safe & Peaceful */}
              <div className="bg-white border border-gray-150/50 p-6 rounded-2xl flex items-start gap-4 text-left shadow-xs hover:shadow-md transition-all" id="why-choose-card-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0" id="why-icon-3">
                  <Compass size={18} className="text-[#da1e28]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    Safe & Peaceful
                  </h4>
                  <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                    Extremely safe, peaceful, multi-cultural environment suitable for international students and workers.
                  </p>
                </div>
              </div>

              {/* Card 4: Work Opportunities */}
              <div className="bg-white border border-gray-150/50 p-6 rounded-2xl flex items-start gap-4 text-left shadow-xs hover:shadow-md transition-all" id="why-choose-card-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0" id="why-icon-4">
                  <Briefcase size={18} className="text-[#da1e28]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    {isStudent ? 'Work Opportunities' : 'Permanent Settlement (TRC)'}
                  </h4>
                  <p className="text-gray-500 text-xs font-semibold leading-relaxed">
                    {isStudent 
                      ? 'Legal rights to work part-time (up to 20 hours/week) during sessions and full-time on vacations.'
                      : 'Straightforward pathways to apply for renewable temporary residence cards (TRC) and long-term stays.'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. REQUIRED DOCUMENTS SECTION (Matches Cyprus screenshot's two-column details) */}
        <section className="bg-white py-16 px-4 md:px-8 border-b border-gray-100" id="detail-documents-section">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Checklist items - 8 cols */}
            <div className="lg:col-span-8 flex flex-col items-start text-left gap-8" id="documents-left">
              <div id="documents-header">
                <span className="text-xs font-black uppercase text-[#da1e28] tracking-[0.2em]">
                  REQUIRED DOCUMENTS
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight mt-1">
                  Documents You Need to Prepare
                </h3>
              </div>

              {/* Two-Column Documents Checklist (Replicated from screenshot) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" id="documents-checklist-grid">
                
                {[
                  'Valid International Passport',
                  isStudent ? 'University Admission Offer Letter' : 'Approved Work Permit Copy',
                  'All Academic Certificates & Marksheets',
                  'Proof of Financial Solvency / Solvency Guide',
                  'English Proficiency Certification (if any)',
                  'Medical Health Insurance Policy',
                  'Accommodation Proof / Host Agreement',
                  'Duly Filled Visa Application Form'
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3.5 p-4 bg-slate-50 border border-slate-100 rounded-xl" id={`doc-item-${idx}`}>
                    <span className="w-5.5 h-5.5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Check size={12} className="stroke-[3.5]" />
                    </span>
                    <span className="text-xs font-black text-slate-800">{doc}</span>
                  </div>
                ))}

              </div>

              {/* Academic/Language specific logs from data file */}
              <div className="bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-6 w-full text-left flex flex-col gap-3 mt-4" id="academic-spec-box">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Additional Criteria Guide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-700 font-semibold mt-1">
                  <div className="flex flex-col gap-1 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-black uppercase">ACADEMIC EXCELLENCE</span>
                    <span className="text-slate-900 font-black">{selectedCountry.requirements.education}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-black uppercase">LANGUAGE BARRIERS</span>
                    <span className="text-slate-900 font-black">{selectedCountry.requirements.ielts}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-black uppercase">FUNDS GUIDE</span>
                    <span className="text-slate-900 font-black line-clamp-3 leading-relaxed">{selectedCountry.requirements.funds}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Checklist CTA download card - 4 cols (Matches Cyprus screenshot's download block) */}
            <div className="lg:col-span-4 w-full flex justify-center" id="documents-right">
              <div className="bg-[#fdf3f3] border border-red-100/50 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center justify-center gap-5 shadow-sm max-w-sm w-full min-h-[220px]" id="download-checklist-card">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xs border border-red-50 text-[#da1e28]">
                  <Download size={22} className="stroke-[2]" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    Download Full Document Checklist
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Get a personalized PDF document checklist for {selectedCountry.name} sent to your system.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => triggerDownload(selectedCountry.id, selectedCountry.name)}
                  className="w-full bg-[#da1e28] hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  id="download-pdf-btn"
                >
                  <span>Download PDF</span>
                  <Download size={14} className="stroke-[3]" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* 5. IMMERSIVE JOURNEY CTA BANNER (Matches screenshot's bottom segment) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full" id="detail-journey-cta-section">
          <div 
            className="rounded-3xl p-10 md:p-14 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(115deg, rgba(11, 27, 61, 0.98), rgba(21, 35, 68, 0.93)), url('https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            
            {/* Left Texts */}
            <div className="flex flex-col gap-3 text-white max-w-xl relative z-10" id="detail-journey-texts">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight uppercase" id="detail-journey-title">
                Ready to Start Your Journey?
              </h3>
              <p className="text-slate-300 text-sm font-semibold" id="detail-journey-sub">
                Talk to our visa experts and get free consultation today. We process with high success ratios.
              </p>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto relative z-10" id="detail-journey-actions">
              <button
                type="button"
                onClick={() => handleApplyNow(selectedCountry.id)}
                className="w-full sm:w-auto bg-[#da1e28] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 border-b-4 border-red-900"
                id="detail-journey-apply-btn"
              >
                Apply Now <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={handleWhatsAppChat}
                className="w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-sm transition-all flex items-center justify-center gap-2"
                id="detail-journey-chat-btn"
              >
                <MessageSquare size={14} className="fill-white" />
                Chat on WhatsApp
              </button>
            </div>

          </div>
        </section>

      </div>
    );
  }

  // DEFAULT VIEW: Grid list of countries (Matches Screen 1 of Explore Section)
  return (
    <div className="flex flex-col w-full bg-[#f8fafc] font-sans pb-24 text-left" id="explore-country-section">
      
      {/* 1. IMMERSIVE HERO BANNER */}
      <section 
        className="relative bg-slate-950 text-white py-20 px-4 md:px-8 text-center overflow-hidden border-b border-slate-900/40 select-none" 
        id="explore-country-banner"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11, 27, 61, 0.94), rgba(15, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#da1e28] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            GLOBAL ACCREDITED PARTNERS
          </span>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mt-1 uppercase">
            Explore Destination <span className="text-[#da1e28]">Countries</span>
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base max-w-2xl font-medium leading-relaxed mt-2">
            Choose from the world's most academically renowned and migrant-friendly destination hubs.
          </p>

          {/* Centered Search & Filter Pill Container */}
          <div className="w-full max-w-3xl mt-8" id="search-filter-dock">
            <div className="bg-white p-2 rounded-2xl md:rounded-full shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-2 w-full">
              
              {/* Search input field with icon */}
              <div className="relative flex-1 w-full flex items-center pl-4">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search your dream country (Cyprus, Romania, Serbia...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 focus:ring-0 focus:outline-hidden pl-3 py-2 text-sm font-semibold text-slate-800 placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-600 pr-2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Toggle Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-50/50 rounded-full w-full md:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('All')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'All'
                      ? 'bg-[#0b1b3d] text-white shadow-md font-black'
                      : 'text-slate-600 hover:text-slate-900 font-bold'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('student')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'student'
                      ? 'bg-[#0b1b3d] text-white shadow-md font-black'
                      : 'text-slate-600 hover:text-slate-900 font-bold'
                  }`}
                >
                  Student Visa
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('work')}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'work'
                      ? 'bg-[#0b1b3d] text-white shadow-md font-black'
                      : 'text-slate-600 hover:text-slate-900 font-bold'
                  }`}
                >
                  Work Permit
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. COUNTRIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full" id="explore-main-area">
        
        {filteredCountries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="explore-country-grid">
            {filteredCountries.map((country) => (
              <div 
                key={country.id}
                className="bg-white border border-gray-150/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full text-left group cursor-pointer"
                id={`explore-card-${country.id}`}
                onClick={() => { setSelectedCountry(country); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                {/* Image Banner Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100" id={`explore-card-img-${country.id}`}>
                  <img 
                    src={country.bgImage} 
                    alt={country.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Flag float badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl shadow-md flex items-center justify-center border border-slate-100">
                    <img 
                       src={country.flagUrl} 
                       alt={`${country.name} flag`} 
                       className="w-7 h-5 object-cover rounded-sm shadow-xs border border-slate-150"
                       referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Country Card Details (Matches Cyprus screenshot header specs layout) */}
                <div className="p-6 flex flex-col flex-grow justify-between gap-4 animate-fade-in" id={`explore-card-body-${country.id}`}>
                  
                  <div>
                    {/* Country Title */}
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
                      {country.name}
                    </h3>
                    
                    {/* Visa Category Subtitle & Inline Badges on the right */}
                    <div className="flex flex-row items-center justify-between gap-2 mt-2 mb-3">
                      <span className="block text-xs md:text-sm font-black text-[#da1e28] whitespace-nowrap">
                        {country.visaType === 'work' ? `Work Permit in ${country.name}` : `Study in ${country.name}`}
                      </span>

                      {/* Badges Row */}
                      <div className="flex items-center gap-3">
                        {/* Badge: No IELTS */}
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-600">
                          <ShieldCheck size={13} className="text-[#da1e28] stroke-[2.5]" />
                          <span>No IELTS</span>
                        </div>
                        
                        {/* Badge: Duration */}
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-slate-600">
                          <Clock size={13} className="text-[#da1e28] stroke-[2.5]" />
                          <span>{country.intakes[0]}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description Paragraph */}
                    <p className="text-gray-500 text-[13px] leading-relaxed font-semibold mt-2 min-h-[38px]">
                      {country.highlights[0]}
                    </p>
                  </div>

                  {/* Explore Now Button on Right */}
                  <div className="flex justify-end mt-4">
                    <button 
                      type="button"
                      className="bg-[#da1e28] hover:bg-red-700 text-white text-xs font-black px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                    >
                      Explore Now <ArrowRight size={13} className="stroke-[3]" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 animate-fade-in max-w-lg mx-auto" id="no-countries-found">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <HelpCircle size={28} />
            </div>
            <h4 className="text-lg font-black text-slate-900 tracking-tight">No Destinations Found</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              We couldn't find any countries matching "{searchQuery}". Try selecting "All" or typing different keywords.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('All'); }}
              className="mt-2 px-5 py-2.5 bg-blue-950 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* 3. BOTTOM HELP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 w-full" id="explore-bottom-banner">
        <div className="bg-[#f0f4f8] border border-slate-200/40 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left z-10">
            {/* Consultant Avatar Profile */}
            <div className="relative w-20 h-20 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200" 
                alt="Consultant Agent" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex flex-col text-left">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Need Help Choosing the Right Country?
              </h3>
              <p className="text-slate-600 text-sm font-semibold mt-1">
                Talk to our visa experts and get free consultation.
              </p>
            </div>
          </div>

          {/* Buttons Group on Right */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto z-10">
            <button
              type="button"
              onClick={handleWhatsAppChat}
              className="w-full sm:w-auto bg-white border-2 border-[#128c7e] hover:bg-emerald-50 text-[#128c7e] font-black text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-xs"
            >
              <MessageSquare size={16} className="fill-[#128c7e]" />
              <span>Chat on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyNow('italy')}
              className="w-full sm:w-auto bg-[#da1e28] hover:bg-red-700 text-white font-black text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Apply Now</span>
              <ArrowRight size={16} className="stroke-[3]" />
            </button>
          </div>

          <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none hidden lg:block">
            <Compass size={180} className="text-slate-950 absolute -right-10 -bottom-10" />
          </div>

        </div>
      </section>

    </div>
  );
};
