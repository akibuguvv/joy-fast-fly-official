import React from 'react';
import { Target, Eye, Landmark, GraduationCap, Award, Compass } from 'lucide-react';
import { STEPS, PARTNERS } from '../data';

export const AboutSection: React.FC = () => {
  return (
    <div className="flex flex-col w-full bg-white" id="about-section-container">
      
      {/* 2. Primary Advisory Segment */}
      <section className="flex flex-col" id="about-advisory-section">
        
        {/* Full Screen Image */}
        <div className="w-full relative h-[60vh] md:h-[80vh]" id="about-advisory-img-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000" 
            alt="Happy family traveling abroad with visa" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            id="about-advisory-img"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent flex flex-col items-center justify-end pb-20 px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl mb-4 uppercase tracking-wider" id="about-hero-title">
              About Joy Fast Fly
            </h1>
            <p className="text-lg md:text-2xl font-bold text-white/90 max-w-3xl drop-shadow-lg" id="about-hero-subtitle">
              Empowering students from Bangladesh to accomplish globally certified academic profiles
            </p>
          </div>
        </div>

        {/* Expert Advisory Text */}
        <div className="py-16 px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-8 text-center" id="about-advisory-text">
          <p className="text-base md:text-lg font-semibold text-gray-600 leading-relaxed">
            Joy Fast Fly was established with a clear mission in Dhaka: to skillfully guide academic and travel applicants through the admissions and visa processing stages to any country they aspire to study, travel, or settle.
          </p>
          
          {/* Boxed Counselor quote */}
          <div className="bg-red-50/50 border-l-4 border-r-4 border-[#da1e28] p-6 rounded-xl mx-auto max-w-3xl inline-block" id="about-counsel-box">
            <p className="text-base md:text-lg font-black text-blue-950 italic">
              "We've been counselling students and travelers for educational and immigration pathways in foreign countries for years."
            </p>
          </div>

          {/* Mission & Vision Rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-6" id="about-mission-vision">
            
            {/* Mission Card */}
            <div className="flex flex-col gap-6 p-10 md:p-14 bg-white border-b md:border-r md:border-b-0 border-gray-100 hover:bg-slate-50 transition-colors" id="about-mission">
              <div className="flex items-center gap-4">
                <span className="w-12 h-1 bg-[#da1e28]"></span>
                <h3 className="font-black text-blue-950 text-2xl uppercase tracking-widest">Our Mission</h3>
              </div>
              <p className="text-base md:text-lg font-medium text-gray-500 leading-relaxed text-left">
                To deliver world-class student and travel counseling with absolute effectiveness and transparency, ensuring every applicant's journey is smooth and successful.
              </p>
            </div>

            {/* Vision Card */}
            <div className="flex flex-col gap-6 p-10 md:p-14 bg-blue-950 text-white" id="about-vision">
               <div className="flex items-center gap-4">
                <span className="w-12 h-1 bg-[#da1e28]"></span>
                <h3 className="font-black text-white text-2xl uppercase tracking-widest">Our Vision</h3>
              </div>
              <p className="text-base md:text-lg font-medium text-gray-300 leading-relaxed text-left">
                To contribute to the stability and prosperity of young academic and career aspirants across Bangladesh by opening doors to global opportunities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Your Visa Sorted In Just 4 Super Simple Steps (Matches Screen 4/5) */}
      <section className="bg-gray-50 py-20 px-4 md:px-8 border-y border-gray-100" id="steps-section">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          
          {/* Section Header */}
          <div className="text-center flex flex-col items-center gap-3" id="steps-header">
            <h2 className="text-2xl md:text-4xl font-black text-blue-950 tracking-tight" id="steps-title">
              Your visa sorted in just 4 super simple <span className="text-[#da1e28] italic">Steps</span>
            </h2>
            <div className="h-1.5 w-16 bg-[#da1e28] rounded-full"></div>
          </div>

          {/* Steps Grid (Matches screenshot circular designs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="steps-grid">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center group" id={`step-item-${step.num}`}>
                
                {/* Image Circle with Step Num Overlay */}
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-[#da1e28] transition-all duration-300 flex items-center justify-center mb-6" id={`step-circle-${step.num}`}>
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/50 transition-colors"></div>
                  {/* Overlay text number */}
                  <span className="relative z-10 text-6xl font-black text-white/90 drop-shadow select-none">
                    {step.num}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-extrabold text-blue-950 text-base mb-2 group-hover:text-[#da1e28] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-gray-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Brand Affiliates Slider (Matches Screen 5 partners logo strip) */}
      <section className="py-12 bg-white border-b border-gray-100" id="partners-section">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-6">Our Authorized Global Partners</p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50 hover:opacity-80 transition-opacity" id="partners-row">
            {PARTNERS.map((partner, idx) => (
              <div key={idx} className="flex items-center gap-2 select-none" id={`partner-logo-${idx}`}>
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Compass size={16} className="text-[#da1e28] animate-spin-slow" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-sm font-black text-blue-950 tracking-tight">{partner.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-red-600 font-bold">{partner.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Executive Leadership / Message from CEO */}
      <section className="py-20 px-4 md:px-8 bg-gray-50 text-center" id="ceo-section">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden" id="ceo-card-box">
          <div className="grid grid-cols-1 md:grid-cols-12" id="ceo-card-grid">
            
            {/* CEO photo/badge - Left 5 cols */}
            <div className="md:col-span-5 bg-blue-950 text-white p-8 flex flex-col justify-between relative overflow-hidden" id="ceo-left">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600')] bg-cover opacity-10"></div>
              <div className="relative z-10 flex flex-col gap-1 text-left">
                <span className="text-[#da1e28] text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-2.5 py-1 rounded w-fit">
                  EXECUTIVE PROFILE
                </span>
                <h3 className="text-2xl font-black tracking-tight mt-3">Md. Azizul Mollah</h3>
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">CEO (Denmark Expatriate)</p>
              </div>
              
              <div className="relative z-10 mt-12 flex flex-col gap-4 text-xs font-semibold text-left" id="ceo-left-contacts">
                <a href="https://wa.me/4531875125" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center font-black text-green-400 text-[10px]">WA</span>
                  <span>+45 31 87 51 25</span>
                </a>
                <a href="mailto:joyabdun@gmail.com" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center font-black text-blue-400 text-[10px]">EM</span>
                  <span>joyabdun@gmail.com</span>
                </a>
                <span className="flex items-center gap-2 text-gray-400">
                  <span className="w-6 h-6 rounded-lg bg-gray-500/20 flex items-center justify-center font-black text-gray-300 text-[10px]">HL</span>
                  <span>Hotline: 01766-852120</span>
                </span>
              </div>
            </div>

            {/* CEO Message - Right 7 cols */}
            <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center text-left" id="ceo-right">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">MESSAGE FROM OUR FOUNDER & CEO</span>
              <h4 className="text-xl md:text-2xl font-black text-blue-950 tracking-tight mt-1 mb-4">
                "Directing stable pathways for your dreams"
              </h4>
              <p className="text-xs text-gray-600 font-semibold leading-relaxed mb-4">
                As a Denmark Expatriate who has experienced global integration first-hand, I established Joy Fast Fly with a single, unyielding focus: to build a highly transparent, rapid, and successful roadmap for students and skilled workers from Bangladesh. 
              </p>
              <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                Whether you seek higher education in premium European institutes or want to secure your future through authorized skilled worker agreements in Serbia or Romania, our direct networks ensure high visa approval ratios and complete reliability. Let us fly together towards your secure future.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
