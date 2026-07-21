import React, { useState, useMemo } from 'react';
import { NewsPost } from '../types';
import { 
  X, 
  Calendar, 
  ArrowRight, 
  Play, 
  Newspaper, 
  ArrowLeft, 
  Clock, 
  Search, 
  Check, 
  ChevronRight, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2,
  Sparkles,
  Award,
  BookOpen,
  Globe,
  Bell,
  TrendingUp,
  Tag
} from 'lucide-react';

const getYoutubeThumbnail = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return null;
};

const MediaPreview: React.FC<{ post: NewsPost; className?: string }> = ({ 
  post, 
  className = "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
}) => {
  if (post.fileType === 'image') {
    return (
      <img 
        src={post.mediaUrl} 
        alt={post.title} 
        className={className} 
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  } else {
    const ytThumb = getYoutubeThumbnail(post.mediaUrl);
    if (ytThumb) {
      return (
        <div className="relative w-full h-full overflow-hidden">
          <img src={ytThumb} alt={post.title} className={className} loading="lazy" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
            <div className="w-12 h-12 bg-[#da1e28] text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 pl-0.5">
              <Play size={22} fill="currentColor" className="text-white" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-full h-full overflow-hidden">
        <video src={post.mediaUrl} className={className} muted playsInline />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors duration-300">
          <div className="w-12 h-12 bg-[#da1e28] text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 pl-0.5">
            <Play size={22} fill="currentColor" className="text-white" />
          </div>
        </div>
      </div>
    );
  }
};

interface NewsSectionProps {
  category: string | null;
  posts: NewsPost[];
  setPosts: React.Dispatch<React.SetStateAction<NewsPost[]>>;
  setSection?: (section: string) => void;
  selectedPost?: NewsPost | null;
  setSelectedPost?: (post: NewsPost | null) => void;
  heroBanner?: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ 
  category, 
  posts, 
  setPosts, 
  setSection, 
  selectedPost, 
  setSelectedPost,
  heroBanner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All News');
  const [sortBy, setSortBy] = useState<'Latest' | 'Oldest'>('Latest');
  const [visibleCount, setVisibleCount] = useState(6);
  const [showShareToast, setShowShareToast] = useState(false);

  // Categories list
  const categories = useMemo(() => [
    'All News', 
    'Visa Update', 
    'Student Visa', 
    'Work Permit', 
    'Embassy Notice', 
    'Success Story', 
    'Admission', 
    'Scholarship'
  ], []);

  // Sync category prop with selection from App header menus
  React.useEffect(() => {
    if (category) {
      if (category === 'News') {
        setSelectedCategory('All News');
      } else if (categories.includes(category)) {
        setSelectedCategory(category);
      } else if (category === 'Videos' || category === 'Pictures') {
        setSelectedCategory('All News');
      }
    } else {
      setSelectedCategory('All News');
    }
    setSearchQuery('');
    setAppliedSearch('');
  }, [category, categories]);

  // Filter and Search logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by fileType if Videos or Pictures are selected
    if (category === 'Videos') {
      result = result.filter(post => post.fileType === 'video');
    } else if (category === 'Pictures') {
      result = result.filter(post => post.fileType === 'image');
    }

    // Category Filter
    if (selectedCategory !== 'All News') {
      result = result.filter(post => post.category === selectedCategory);
    }

    // Search Filter
    if (appliedSearch.trim() !== '') {
      const q = appliedSearch.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.body.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'Latest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, selectedCategory, appliedSearch, sortBy, category]);

  // Calculate first post to render as Hero (only under All News & when not searching)
  const isHeroActive = !appliedSearch && selectedCategory === 'All News';
  const heroPost = useMemo(() => {
    if (filteredPosts.length > 0) {
      const featured = filteredPosts.find(post => post.isFeatured);
      return featured || filteredPosts[0];
    }
    return null;
  }, [filteredPosts]);

  // Posts list for the grid (excluding the hero post if it is active)
  const gridPosts = useMemo(() => {
    if (isHeroActive && heroPost) {
      return filteredPosts.filter(p => p.id !== heroPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, isHeroActive, heroPost]);

  // Trending / Recent Posts list for the sidebar
  const trendingPosts = useMemo(() => {
    return posts.slice(0, 5);
  }, [posts]);

  // Category count mapping for sidebar and tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All News': posts.length };
    posts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  // Category Icon Mapping
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'All News': return <Newspaper size={14} />;
      case 'Visa Update': return <Bell size={14} />;
      case 'Student Visa': return <BookOpen size={14} />;
      case 'Work Permit': return <Award size={14} />;
      case 'Embassy Notice': return <Globe size={14} />;
      case 'Success Story': return <Sparkles size={14} />;
      case 'Admission': return <Check size={14} />;
      case 'Scholarship': return <TrendingUp size={14} />;
      default: return <Tag size={14} />;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    if (setSelectedPost) {
      setSelectedPost(null);
    }
  };

  // Navigation handlers for detailed view
  const handleNextArticle = (currentId?: string) => {
    const currentIndex = posts.findIndex(p => p.id === currentId);
    if (currentIndex !== -1 && currentIndex < posts.length - 1 && setSelectedPost) {
      setSelectedPost(posts[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevArticle = (currentId?: string) => {
    const currentIndex = posts.findIndex(p => p.id === currentId);
    if (currentIndex !== -1 && currentIndex > 0 && setSelectedPost) {
      setSelectedPost(posts[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Safe Social Share URLs construction
  const getShareLink = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    const pageUrl = window.location.href;
    const shareText = selectedPost ? encodeURIComponent(selectedPost.title) : 'Check out this update!';
    const encodedUrl = encodeURIComponent(pageUrl);

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      default:
        return '';
    }
  };

  const handleCopyLink = () => {
    const pageUrl = window.location.href;
    navigator.clipboard.writeText(pageUrl).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  return (
    <div className="bg-white min-h-screen pb-24 font-sans selection:bg-[#da1e28] selection:text-white" id="news-section-viewport">
      
      {/* 1. Header Banner matching Home Hero style */}
      <section 
        className="relative h-[25vh] min-h-[180px] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        id="news-header-banner"
      >
        {/* Dynamic Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000'})` }}
          id="news-banner-bg-image"
        ></div>
        {/* Deep blue gradient overlay exactly matching home screen */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/80 to-blue-950/90 z-0"></div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-500/15 text-[#da1e28] text-[9px] font-black rounded-sm w-fit tracking-widest uppercase">
            <span className="w-1 h-1 rounded-full bg-[#da1e28] animate-pulse"></span>
            News & Updates (বিজ্ঞপ্তি ও নোটিশ)
          </span>
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-none uppercase drop-shadow-2xl">
            Joy Fast <span className="text-[#da1e28]">Fly Updates</span>
          </h1>
        </div>
      </section>

      {/* 2. Flat (Non-Sticky) Horizontal Category Tabs */}
      <div className="bg-gray-50 border-b border-gray-200 py-4 px-4 md:px-8" id="category-tabs-static">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 rounded-sm cursor-pointer shrink-0 border ${
                    isActive 
                      ? 'bg-[#da1e28] text-white border-[#da1e28] shadow-sm' 
                      : 'bg-white text-blue-950 hover:bg-slate-100/60 hover:text-gray-800 border-gray-200'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#da1e28]'}>
                    {getCategoryIcon(cat)}
                  </span>
                  <span>{cat}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-black ${
                    isActive ? 'bg-white text-[#da1e28]' : 'bg-slate-100 text-gray-500'
                  }`}>
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Widget */}
          <div className="w-full md:max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border border-gray-200 focus-within:border-[#da1e28] rounded-sm pl-3 pr-1 py-1 shadow-xs transition-all duration-300">
              <Search size={14} className="text-gray-400 shrink-0 mr-1.5" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-blue-950 placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setAppliedSearch('');
                  }}
                  className="p-1 text-gray-400 hover:text-[#da1e28] transition-colors mr-1"
                >
                  <X size={12} />
                </button>
              )}
              <button 
                type="submit"
                className="bg-blue-950 hover:bg-[#da1e28] text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-sm transition-all shrink-0 cursor-pointer"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10" id="main-content-layout">
        
        {selectedPost ? (
          /* ==========================================================
             A. DETAILED POST VIEW (ULTRA CLEAN, EDITORIAL & MINIMAL)
             ========================================================== */
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-8 animate-fade-in text-left">
            
            {/* Inline success toast notification for copied link */}
            {showShareToast && (
              <div className="fixed bottom-5 right-5 bg-blue-950 text-white text-xs font-bold px-4 py-3 rounded-sm shadow-xl border-l-4 border-[#da1e28] z-50 flex items-center gap-2 animate-bounce">
                <Check size={16} className="text-green-400" />
                <span>Link copied to clipboard successfully! (লিংক কপি করা হয়েছে)</span>
              </div>
            )}

            {/* Navigation back with minimal sleek visual line */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <button 
                onClick={() => {
                  if (setSelectedPost) setSelectedPost(null);
                }}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-950 hover:text-[#da1e28] transition-colors group cursor-pointer"
              >
                <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Updates
              </button>
              
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Published in {selectedPost.category}
              </span>
            </div>

            {/* Premium Header */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-5xl font-black text-blue-950 tracking-tight leading-tight">
                {selectedPost.title}
              </h1>

              {/* Minimal Meta details with Left Accent Border */}
              <div className="flex items-center gap-4 text-xs text-gray-500 font-bold border-l-2 border-[#da1e28] pl-3 py-1">
                <span>{selectedPost.date}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>By {selectedPost.author || 'Joy Fast Fly Editorial'}</span>
                {selectedPost.readTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{selectedPost.readTime}</span>
                  </>
                )}
              </div>
            </div>

            {/* Main Full-Width Featured Cover Image / Video with beautiful subtle shadow */}
            <div className="relative w-full aspect-[16/10] bg-slate-100 rounded-sm overflow-hidden border border-gray-150">
              {selectedPost.fileType === 'image' ? (
                <img 
                  src={selectedPost.mediaUrl} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (() => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = selectedPost.mediaUrl?.match(regExp);
                const youtubeId = (match && match[2].length === 11) ? match[2] : null;
                
                const vimeoReg = /vimeo\.com\/(\d+)/;
                const vimeoMatch = selectedPost.mediaUrl?.match(vimeoReg);
                const vimeoId = vimeoMatch ? vimeoMatch[1] : null;

                if (youtubeId) {
                  return (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1`}
                      title={selectedPost.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                } else if (vimeoId) {
                  return (
                    <iframe
                      src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1`}
                      title={selectedPost.title}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  );
                } else {
                  return (
                    <video src={selectedPost.mediaUrl} controls autoPlay muted className="w-full h-full object-cover" />
                  );
                }
              })()}
            </div>

            {/* Body Content with dynamic formatting & clean spacing */}
            <div className="text-slate-800 text-base md:text-lg leading-relaxed whitespace-pre-line font-medium font-sans">
              {selectedPost.body}
            </div>

            {/* Highlights bullet section rendered as clean minimal quotes block (only if highlights exist) */}
            {selectedPost.highlights && selectedPost.highlights.length > 0 && (
              <div className="border-t border-b border-gray-150 py-6 my-2">
                <span className="text-[10px] font-black text-[#da1e28] uppercase tracking-widest block mb-4">
                  Key Circular Takeaways:
                </span>
                <ul className="flex flex-col gap-3">
                  {selectedPost.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-800 font-bold leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-[#da1e28] rounded-full mt-2 shrink-0"></span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sleek bottom actions containing Share & Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-150 pt-8 mt-4">
              
              {/* Working active direct platform links */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share Update:</span>
                <div className="flex items-center gap-1.5">
                  <a 
                    href={getShareLink('facebook')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-sm border border-gray-200 hover:border-[#da1e28] hover:bg-red-50 hover:text-[#da1e28] flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    title="Share on Facebook"
                  >
                    <Facebook size={14} />
                  </a>
                  <a 
                    href={getShareLink('twitter')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-sm border border-gray-200 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-500 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    title="Share on Twitter"
                  >
                    <Twitter size={14} />
                  </a>
                  <a 
                    href={getShareLink('linkedin')} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-sm border border-gray-200 hover:border-blue-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={14} />
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="w-9 h-9 rounded-sm border border-gray-200 hover:border-green-600 hover:bg-green-50 hover:text-green-600 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                    title="Copy link to clipboard"
                  >
                    <Link2 size={14} />
                  </button>
                </div>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePrevArticle(selectedPost.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-blue-950 text-[10px] font-black uppercase tracking-wider rounded-sm border border-gray-200 transition-all cursor-pointer group"
                >
                  <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" /> Previous
                </button>
                <button 
                  onClick={() => handleNextArticle(selectedPost.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#da1e28] hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider rounded-sm border border-[#da1e28] transition-all cursor-pointer group"
                >
                  Next <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* ==========================================================
             B. DYNAMIC FEED VIEW (HERO CARD & FEEDS LIST WITH SIDEBAR)
             ========================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* LEFT 8 COLUMNS: List Feed */}
            <div className="lg:col-span-8 flex flex-col gap-8 text-left">
              
              {/* Featured Hero Card */}
              {isHeroActive && heroPost && (
                <div 
                  onClick={() => {
                    if (setSelectedPost) setSelectedPost(heroPost);
                  }}
                  className="bg-white border border-gray-200 hover:border-gray-300 rounded-sm overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer group relative flex flex-col md:flex-row min-h-[280px]"
                  id="news-featured-hero-card"
                >
                  {/* Visual Badge */}
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <span className="px-2.5 py-1 bg-[#da1e28] text-white text-[8px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1 shadow-md">
                      <Sparkles size={10} fill="currentColor" /> FEATURED UPDATE
                    </span>
                  </div>

                  {/* Media Column */}
                  <div className="w-full md:w-5/12 relative bg-slate-950 overflow-hidden shrink-0 aspect-video md:aspect-auto">
                    <MediaPreview post={heroPost} />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-blue-950/60 via-blue-950/10 to-transparent"></div>
                  </div>

                  {/* Content Column */}
                  <div className="w-full md:w-7/12 p-5 md:p-6 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-black text-[#da1e28] uppercase tracking-widest">
                        {heroPost.category}
                      </span>
                      
                      <h2 className="text-base md:text-lg font-black text-blue-950 group-hover:text-[#da1e28] transition-colors leading-tight">
                        {heroPost.title}
                      </h2>
                      
                      <p className="text-slate-600 text-xs font-semibold line-clamp-3 leading-relaxed">
                        {heroPost.body}
                      </p>
                    </div>

                    {/* Footer Details */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px]">
                        <Calendar size={11} className="text-[#da1e28]" />
                        <span>{heroPost.date}</span>
                      </div>
                      
                      <span className="text-[#da1e28] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read News <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid Subtitle */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-[#da1e28] rounded-sm"></span>
                  <h2 className="text-xs font-black text-blue-950 uppercase tracking-widest">
                    {selectedCategory === 'All News' 
                      ? (appliedSearch ? 'Search Results' : 'Latest Stories') 
                      : `${selectedCategory} Circulars`
                    }
                  </h2>
                </div>

                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Showing {gridPosts.length} post{gridPosts.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* Main News Circular Grid - 3-Column Compact/Simple Design */}
              {gridPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {gridPosts.slice(0, visibleCount).map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        if (setSelectedPost) setSelectedPost(post);
                      }}
                      className="bg-white border border-gray-150 hover:border-gray-350 rounded-sm overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer group flex flex-col h-full"
                    >
                      {/* Compact Cover */}
                      <div className="w-full h-36 bg-slate-950 relative overflow-hidden shrink-0">
                        <MediaPreview post={post} />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-blue-950/90 text-white text-[8px] font-black uppercase tracking-wider rounded-sm">
                          {post.category}
                        </span>
                      </div>

                      {/* Text Block */}
                      <div className="p-4 flex flex-col justify-between flex-grow text-left">
                        <div className="flex flex-col gap-1.5">
                          <h3 className="text-xs sm:text-sm font-black text-blue-950 group-hover:text-[#da1e28] transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed font-semibold">
                            {post.body}
                          </p>
                        </div>

                        {/* Footer and Date */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[10px]">
                          <div className="flex items-center gap-1 text-gray-400 font-bold">
                            <Calendar size={11} className="text-[#da1e28]" />
                            <span>{post.date}</span>
                          </div>

                          <span className="text-[#da1e28] font-black uppercase tracking-wider flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            Read <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EMPTY STATE FILTER FAIL */
                <div className="bg-white border border-gray-200 py-16 px-4 text-center rounded-sm shadow-xs flex flex-col items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-red-50 text-[#da1e28] rounded-sm flex items-center justify-center mb-1">
                    <Newspaper size={26} />
                  </div>
                  <p className="text-blue-950 text-sm font-black uppercase tracking-wider">
                    কোনো নোটিশ বা পোস্ট পাওয়া যায়নি।
                  </p>
                  <p className="text-gray-400 text-xs max-w-sm -mt-2">
                    No updates match your active filters or keywords. Reset search query to read our latest releases.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setAppliedSearch('');
                      setSelectedCategory('All News');
                    }}
                    className="mt-2 px-6 py-2.5 bg-blue-950 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-[#da1e28] transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Load More Button Trigger */}
              {visibleCount < gridPosts.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-8 py-3.5 bg-blue-950 hover:bg-[#da1e28] text-white text-xs font-black uppercase tracking-widest rounded-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                  >
                    Load More Updates (পরবর্তী আপডেট) <ArrowRight size={14} />
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT 4 COLUMNS: UNIFIED SIDEBAR */}
            <aside className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Recent Circulars / Related News ticker */}
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xs text-left">
                <h3 className="font-black text-blue-950 text-xs uppercase tracking-widest border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#da1e28] rounded-sm"></span>
                  Trending Circulars
                </h3>
                
                <div className="flex flex-col gap-4">
                  {trendingPosts.map((post, index) => (
                    <div 
                      key={post.id || index}
                      onClick={() => {
                        if (setSelectedPost) {
                          setSelectedPost(post);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="flex gap-3 cursor-pointer group items-start pb-3.5 border-b border-slate-100 last:border-0 last:pb-0"
                    >
                      <div className="w-20 h-14 shrink-0 bg-slate-950 overflow-hidden relative border border-gray-100 rounded-sm shadow-xs">
                        <MediaPreview post={post} />
                      </div>
                      
                      <div className="flex flex-col flex-1 justify-between min-h-[56px]">
                        <h4 className="text-xs font-black text-blue-950 group-hover:text-[#da1e28] transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-extrabold flex items-center gap-1 mt-1 uppercase">
                          <Calendar size={10} className="text-[#da1e28]" /> {post.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support / Counselor Help Card */}
              <div className="bg-blue-950 border border-blue-900 text-white rounded-sm p-6 shadow-md text-left relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#da1e28]/5 rounded-full translate-x-10 -translate-y-10"></div>
                
                <div className="relative w-full h-44 overflow-hidden bg-blue-900 border border-blue-800 rounded-sm mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" 
                    alt="Joy Fast Fly Counselor" 
                    className="w-full h-full object-cover object-top mix-blend-luminosity" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-[9px] font-black text-white bg-[#da1e28] px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    Senior Counselor Desk
                  </span>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <h3 className="font-black text-white text-base leading-tight">
                    Need Help with Visa Process?
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    Get absolute transparency, free step-by-step document review, and guidance directly from experts.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    if (setSection) setSection('contact');
                  }}
                  className="w-full bg-[#da1e28] hover:bg-red-700 text-white py-3 px-4 text-[10px] font-black uppercase tracking-widest transition-all mt-4 rounded-sm cursor-pointer shadow-lg"
                >
                  Contact Desk
                </button>
              </div>

            </aside>

          </div>
        )}

      </main>

    </div>
  );
};
