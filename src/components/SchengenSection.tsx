import React, { useState } from 'react';
import { ShieldCheck, ClipboardList, HelpCircle, FileText, Globe } from 'lucide-react';

export const SchengenSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'questions'>('docs');

  const docChecklist = [
    { title: 'Schengen Visa Application Form', desc: 'Fully completed, printed, and signed by the applicant.' },
    { title: 'Valid Bangladeshi Passport', desc: 'Must be valid for at least 3 months beyond the planned stay with at least 2 blank pages.' },
    { title: 'University Offer & Acceptance Letter', desc: 'Official admission certificate from an accredited Schengen university.' },
    { title: 'Proof of Financial Solvency', desc: 'Bank statement of the last 6 months showing sufficient funds, or proof of scholarship/grant.' },
    { title: 'Travel Health Insurance', desc: 'Minimum coverage of €30,000 for emergency medical expenses across all Schengen countries.' },
    { title: 'Proof of Accommodation', desc: 'Dormitory booking voucher, rental contract, or invitation letter from hosts.' },
    { title: 'Academic Certificates & Transcripts', desc: 'Verified and attested copies of SSC, HSC, and Bachelor documents.' },
    { title: 'No Objection Certificate (NOC)', desc: 'From the previous academic institution or employer.' }
  ];

  const interviewQuestions = [
    { q: 'Why did you choose this specific Schengen country for studies?', a: 'Focus on high education standards, specific lab resources, and research opportunities that are unique to the host country compared to Bangladesh.' },
    { q: 'How will you cover your living expenses and tuition fees?', a: 'Be precise about your funding source. Refer directly to your bank statement or sponsor, indicating exactly how much has been allocated.' },
    { q: 'Do you plan to stay in the Schengen zone after graduation?', a: 'Emphasize your intention to return to Bangladesh. State how the degree fits into the Bangladeshi career landscape and job opportunities.' },
    { q: 'What is your course structure and duration?', a: 'You must know your course curriculum, credits, core modules, and the name of your department head.' }
  ];

  return (
    <div className="flex flex-col w-full bg-white" id="schengen-section">
      {/* Page Header */}
      <section className="bg-blue-950 text-white py-16 px-4 text-center relative overflow-hidden" id="schengen-banner">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#da1e28] text-xs font-black uppercase tracking-widest bg-red-500/10 px-3.5 py-1 rounded-full">
            EUROPEAN IMMIGRATION STANDARD
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1">
            Schengen Zone Student Visas
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold max-w-lg mt-1">
            Understand the strict criteria for visa processing across Sweden, Spain, Germany, and other Schengen countries.
          </p>
        </div>
      </section>

      {/* Main content body */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full text-left flex flex-col gap-10" id="schengen-content">
        
        {/* Intro bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50 p-6 md:p-10 rounded-3xl border border-gray-100" id="schengen-intro">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight">
              One Single Visa, 29 European Nations
            </h2>
            <p className="text-sm font-semibold text-gray-500 leading-relaxed">
              Applying for a student visa in any Schengen country unlocks incredible travel freedom. It allows you to move freely without border controls throughout the entire Schengen zone during your studies.
            </p>
            <div className="flex gap-2.5 items-center mt-2 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm w-fit">
              <ShieldCheck className="text-red-600" size={20} />
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider">Joy Fast Fly Official Schengen Portal Companion</span>
            </div>
          </div>
          
          <div className="lg:col-span-5 grid grid-cols-2 gap-4" id="schengen-highlights">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-center">
              <span className="text-3xl">🇨🇾</span>
              <h4 className="font-extrabold text-blue-950 text-sm mt-2">Cyprus</h4>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-center">
              <span className="text-3xl">🇷🇸</span>
              <h4 className="font-extrabold text-blue-950 text-sm mt-2">Serbia</h4>
            </div>
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm text-center">
              <span className="text-3xl">🇷🇴</span>
              <h4 className="font-extrabold text-blue-950 text-sm mt-2">Romania</h4>
            </div>
          </div>
        </div>

        {/* Dynamic interactive tabs for checklist vs questions */}
        <div className="flex flex-col gap-8" id="schengen-tab-wrapper">
          <div className="flex justify-center border-b border-gray-100 gap-6" id="schengen-tabs">
            <button
              onClick={() => setActiveTab('docs')}
              className={`pb-4 px-2 text-sm font-black flex items-center gap-2 transition-all ${
                activeTab === 'docs' 
                  ? 'border-b-4 border-[#da1e28] text-[#da1e28]' 
                  : 'text-gray-400 hover:text-blue-950'
              }`}
              id="schengen-tab-docs"
            >
              <ClipboardList size={16} />
              Required Document Checklist
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-4 px-2 text-sm font-black flex items-center gap-2 transition-all ${
                activeTab === 'questions' 
                  ? 'border-b-4 border-[#da1e28] text-[#da1e28]' 
                  : 'text-gray-400 hover:text-blue-950'
              }`}
              id="schengen-tab-questions"
            >
              <HelpCircle size={16} />
              Embassy Interview Preparation
            </button>
          </div>

          {/* Tab Content 1: Document checklist */}
          {activeTab === 'docs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" id="schengen-docs-grid">
              {docChecklist.map((doc, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white" id={`doc-item-${idx}`}>
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#da1e28]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-extrabold text-blue-950 text-sm">{doc.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">{doc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 2: Interview Questions */}
          {activeTab === 'questions' && (
            <div className="flex flex-col gap-6 animate-fade-in" id="schengen-questions-wrapper">
              {interviewQuestions.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm flex flex-col gap-3" id={`q-item-${idx}`}>
                  <div className="flex gap-3 items-start" id={`q-item-question-${idx}`}>
                    <span className="bg-red-100 text-[#da1e28] text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0">
                      Q {idx + 1}
                    </span>
                    <h4 className="font-black text-blue-950 text-sm md:text-base leading-snug">
                      {item.q}
                    </h4>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 ml-0 md:ml-12 text-xs font-semibold text-gray-600 leading-relaxed" id={`q-item-answer-${idx}`}>
                    <span className="font-extrabold text-[#da1e28] block mb-1">Recommended Response Guidance:</span>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
};
