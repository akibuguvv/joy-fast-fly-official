import React from 'react';
import { ArrowRight, GraduationCap, Building, Plane, Globe, FileText, CheckCircle, Calendar } from 'lucide-react';
import { VISA_CATEGORIES } from '../data';
import { NewsPost } from '../types';

interface HomeSectionProps {
  setSection: (section: string) => void;
  setSelectedCountryId?: (id: string | null) => void;
  posts: NewsPost[];
  setSelectedPost?: (post: NewsPost | null) => void;
  heroBanner?: string;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setSection, setSelectedCountryId, posts, setSelectedPost, heroBanner }) => {
  const countryBadges: string[] = ['CYPRUS', 'ROMANIA', 'SERBIA', 'GREECE'];

  const getVisaIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap size={28} className="text-[#da1e28]" />;
      case 'Building': return <Building size={28} className="text-[#da1e28]" />;
      case 'PlaneTakeoff': return <Plane size={28} className="text-[#da1e28]" />;
      case 'Globe': return <Globe size={28} className="text-[#da1e28]" />;
      case 'FileText': return <FileText size={28} className="text-[#da1e28]" />;
      default: return <GraduationCap size={28} className="text-[#da1e28]" />;
    }
  };

  const handleCardClick = (id: string) => {
    if (id === 'inquiry') {
      setSection('contact');
    } else {
      setSection('study-abroad');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full" id="home-section-container">
      
      {/* 1. Hero Section */}
      <section 
        className="relative h-[80vh] min-h-[600px] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        id="hero-banner"
      >
        {/* Dynamic Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2000'})` }}
          id="hero-bg-image"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-950/70 to-blue-950/90 z-0"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-8">
          
          {/* Floating Country Badges */}
          <div className="flex flex-wrap justify-center gap-4" id="hero-country-badges">
            {countryBadges.map((country, idx) => {
              const countryId = country === 'UK' ? 'uk' : country.toLowerCase();
              return (
                <button 
                  key={idx}
                  onClick={() => {
                    if (setSelectedCountryId) {
                      setSelectedCountryId(countryId);
                    }
                    setSection('study-abroad');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white font-black text-xs md:text-sm tracking-widest px-6 py-2.5 rounded-sm shadow-lg hover:-translate-y-1 transition-all text-center uppercase"
                  style={{ animationDelay: `${idx * 150}ms` }}
                  id={`hero-badge-${countryId}`}
                >
                  {country}
                </button>
              );
            })}
          </div>

          {/* Hero Headline content */}
          <div className="flex flex-col items-center gap-5" id="hero-text-content">
            <span className="text-[#ff9800] text-sm md:text-base font-black uppercase tracking-[0.3em] drop-shadow-md">
              Your Gateway to Global Education
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none uppercase drop-shadow-2xl" id="hero-welcome-title">
              Joy Fast <span className="text-[#da1e28]">Fly</span>
            </h1>
            <p className="text-lg md:text-2xl font-bold text-gray-200 max-w-2xl leading-relaxed tracking-wide drop-shadow-lg mt-2" id="hero-welcome-sub">
              Expert Student Visa processing and immigration consultancy for Cyprus, Romania, Serbia, and Greece.
            </p>
            
            <div className="flex flex-row justify-center gap-4 mt-8 w-full">
              <button 
                onClick={() => {
                  setSection('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-3.5 bg-[#da1e28] text-white font-black uppercase tracking-widest rounded-sm shadow-xl hover:bg-red-700 hover:-translate-y-0.5 transition-all text-[10px] sm:text-xs border-b-4 border-red-900 flex justify-center items-center gap-2"
                id="hero-learn-more-btn"
              >
                Learn More
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => {
                  setSection('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-3.5 bg-white text-blue-950 font-black uppercase tracking-widest rounded-sm shadow-xl hover:bg-gray-100 hover:-translate-y-0.5 transition-all text-[10px] sm:text-xs border-b-4 border-gray-300 flex justify-center items-center gap-2"
                id="hero-apply-btn"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Welcome to JTEC (WE MAKE A DIFFERENCE) Section */}
      <section className="bg-white py-24 px-4 md:px-8" id="welcome-section">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Text details */}
            <div className="flex flex-col gap-8 text-left" id="welcome-left-text">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-1 bg-[#da1e28]"></span>
                  <span className="text-[#da1e28] text-sm font-black uppercase tracking-[0.2em]">
                    Who We Are
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-blue-950 tracking-tight leading-[1.1]" id="welcome-header">
                  Welcome to <br /> Joy Fast Fly.
                </h2>
              </div>
              
              <div className="flex flex-col gap-6 text-base text-gray-600 leading-relaxed font-medium border-l-2 border-gray-100 pl-6">
                <p>
                  Joy Fast Fly is one of the premier educational and visa consulting firms in Bangladesh. We facilitate and process student visas for <strong className="text-blue-950 font-black">Cyprus, Romania, Serbia, and Greece</strong>.
                </p>
                <p>
                  A faithful and reliable platform of education and visa consultancy with a stellar record of student visa, short-term study visa, and visit visa success stories across multiple global destinations.
                </p>
                <p>
                  Our expert counseling team walks with you step-by-step—from choosing the right course and university, to preparing financial document guides, up to the final visa submission.
                </p>
              </div>
              
              <button 
                onClick={() => {
                  setSection('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-2 group px-8 py-4 bg-blue-950 text-white font-black text-xs uppercase tracking-widest rounded-sm hover:bg-blue-900 transition-all w-fit flex items-center gap-3 shadow-md hover:shadow-lg"
                id="welcome-explore-more-btn"
              >
                Discover Our Story
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Section: Modern office building image */}
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-sm overflow-hidden group shadow-xl" id="welcome-right-image">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200" 
                alt="Joy Fast Fly Institutional Partner" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent"></div>
              
              {/* Overlaid stats badge */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-sm flex items-center justify-between text-white">
                 <div className="flex flex-col">
                   <span className="text-3xl md:text-4xl font-black">1500+</span>
                   <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-300">Success Stories</span>
                 </div>
                 <div className="w-px h-12 bg-white/20"></div>
                 <div className="flex flex-col text-right md:text-left">
                   <span className="text-3xl md:text-4xl font-black">10+</span>
                   <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-300">Years Experience</span>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 & 4. Combined Visa Solutions and Latest News Section */}
      <section className="bg-slate-50 py-24 border-y border-gray-100" id="combined-visa-news-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-24">
          
          {/* 3. Trusted Visa Solutions Section */}
          <div className="flex flex-col gap-12" id="visa-solutions-content">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-200 pb-8">
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-1 bg-[#da1e28]"></span>
                  <span className="text-[#da1e28] text-sm font-black uppercase tracking-[0.2em]">
                    Our Services
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight leading-[1.1]">
                  Trusted Visa Solutions <br className="hidden md:block"/> for Study & Immigration
                </h2>
              </div>
              <button 
                onClick={() => {
                   setSection('contact');
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="shrink-0 px-8 py-3.5 bg-white text-blue-950 border border-gray-200 font-black text-xs uppercase tracking-widest rounded-sm hover:border-blue-950 hover:bg-blue-950 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Apply Now
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="visa-solutions-grid">
              {VISA_CATEGORIES.map((category) => (
                <div 
                  key={category.id}
                  onClick={() => handleCardClick(category.id)}
                  className="group relative h-[420px] rounded-sm overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer bg-white transition-all duration-300 border border-gray-100"
                >
                  {/* Image half */}
                  <div className="absolute top-0 left-0 right-0 h-[220px] overflow-hidden">
                    <img 
                      src={category.bgImage} 
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>

                  {/* Content half */}
                  <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-white p-8 flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="absolute -top-8 right-8 w-16 h-16 bg-white shadow-xl rounded-sm flex items-center justify-center z-10 transition-transform duration-300 group-hover:-translate-y-2">
                      {getVisaIcon(category.iconName)}
                    </div>
                    
                    <div className="flex flex-col gap-2 relative z-10">
                      <span className="text-[10px] uppercase font-black text-red-600 tracking-widest">
                        {category.subtitle}
                      </span>
                      <h3 className="text-xl font-black text-blue-950 tracking-tight">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 font-medium mt-1">
                        {category.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-black text-blue-950 uppercase tracking-widest mt-4">
                      <span className="group-hover:text-[#da1e28] transition-colors">Read More</span>
                      <ArrowRight size={14} className="text-[#da1e28] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>          {/* 4. Latest News Section */}
          {posts.length > 0 && (
            <div id="latest-news-content" className="flex flex-col gap-8 mt-12">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-1 bg-[#da1e28]"></span>
                  <h2 className="text-3xl font-black text-blue-950 tracking-tight">Latest News</h2>
                </div>
              </div>
              <div className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-sm">
                {posts.map((post, index) => (
                  <article 
                    key={index} 
                    onClick={() => {
                      if (setSelectedPost) {
                        setSelectedPost(post);
                        setSection('news');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer group ${index !== posts.length - 1 ? 'border-b border-dashed border-gray-200' : ''}`}
                  >
                    <div className="w-28 sm:w-48 h-20 sm:h-28 shrink-0 bg-gray-100 border border-gray-200 overflow-hidden relative">
                      {post.fileType === 'image' ? (
                        <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <video src={post.mediaUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-2 flex-1 overflow-hidden py-2">
                      <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-semibold mt-1">
                        <Calendar size={14} className="text-[#da1e28] opacity-70" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features summary badges */}
      <section className="bg-blue-950 py-16 px-4 text-white" id="home-highlights">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 text-center select-none" id="highlights-grid">
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="text-4xl md:text-5xl font-black text-[#ff9800]">10+</span>
            <span className="text-xs text-gray-300 font-black uppercase tracking-[0.2em]">Years Experience</span>
          </div>
          <div className="flex flex-col items-center gap-2 py-4 md:border-l border-white/10">
            <span className="text-4xl md:text-5xl font-black text-[#ff9800]">1500+</span>
            <span className="text-xs text-gray-300 font-black uppercase tracking-[0.2em]">Happy Students</span>
          </div>
          <div className="flex flex-col items-center gap-2 py-4 md:border-l border-white/10">
            <span className="text-4xl md:text-5xl font-black text-[#ff9800]">4+</span>
            <span className="text-xs text-gray-300 font-black uppercase tracking-[0.2em]">Partner Countries</span>
          </div>
        </div>
      </section>
    </div>
  );
};
