import React, { useState, useMemo } from 'react';
import { NewsPost } from '../types';
import { 
  X, 
  Calendar, 
  ArrowRight, 
  PlayCircle, 
  Newspaper, 
  ArrowLeft, 
  Clock, 
  Search, 
  Share2, 
  Check, 
  Send,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle
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

const MediaPreview: React.FC<{ post: NewsPost; className?: string; iconSize?: number }> = ({ post, className = "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105", iconSize = 36 }) => {
  if (post.fileType === 'image') {
    return (
      <img 
        src={post.mediaUrl} 
        alt={post.title} 
        className={className} 
      />
    );
  } else {
    const ytThumb = getYoutubeThumbnail(post.mediaUrl);
    if (ytThumb) {
      return (
        <div className="relative w-full h-full overflow-hidden">
          <img src={ytThumb} alt={post.title} className={className} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
            <PlayCircle size={iconSize} className="text-white drop-shadow-md" />
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-full h-full overflow-hidden">
        <video src={post.mediaUrl} className={className} muted playsInline />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
          <PlayCircle size={iconSize} className="text-white drop-shadow-md" />
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
}

export const NewsSection: React.FC<NewsSectionProps> = ({ category, posts, setPosts, setSection, selectedPost, setSelectedPost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All News');
  const [sortBy, setSortBy] = useState<'Latest' | 'Oldest'>('Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(6);

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

  // Synchronize category prop from App.tsx/Header.tsx selection
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
    setCurrentPage(1);
  }, [category, categories]);

  // Filter and Search logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by fileType if Videos or Pictures are selected under News & Media Menu
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
  }, [posts, selectedCategory, appliedSearch, sortBy]);

  // Featured Post (Romania Student Visa 2026 or fallback first featured/latest)
  const featuredPost = useMemo(() => {
    const featured = posts.find(post => post.isFeatured);
    if (featured) return featured;
    return posts[0] || null;
  }, [posts]);

  // Trending Now posts list
  const trendingPosts = useMemo(() => {
    return posts.slice(0, 5);
  }, [posts]);

  // Popular Tags
  const popularTags = [
    '#Romania', 
    '#Cyprus', 
    '#Serbia', 
    '#StudentVisa', 
    '#WorkPermit', 
    '#Admission', 
    '#Embassy', 
    '#Scholarship'
  ];

  // Category count mapping for sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All News': posts.length };
    posts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setSelectedPost(null);
  };

  const handleTagClick = (tag: string) => {
    const cleanTag = tag.replace('#', '');
    setSearchQuery(cleanTag);
    setAppliedSearch(cleanTag);
    setSelectedCategory('All News');
    setCurrentPage(1);
    setSelectedPost(null);
  };

  // Pagination configuration
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage]);

  // Navigation handlers for detailed view
  const handleNextArticle = (currentId?: string) => {
    const currentIndex = posts.findIndex(p => p.id === currentId);
    if (currentIndex !== -1 && currentIndex < posts.length - 1) {
      setSelectedPost(posts[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevArticle = (currentId?: string) => {
    const currentIndex = posts.findIndex(p => p.id === currentId);
    if (currentIndex !== -1 && currentIndex > 0) {
      setSelectedPost(posts[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`bg-white min-h-screen pb-20 font-sans selection:bg-[#da1e28] selection:text-white`} id="news-section-viewport">
      
      {!selectedPost && (
        <>
          {/* 1. Header Banner */}
          <section className="bg-gradient-to-b from-slate-50 via-blue-50/10 to-white pt-24 pb-14 px-4 md:px-8 border-b border-gray-100 relative overflow-hidden" id="news-header-banner">
            {/* Background decorative patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
            
            <div className="max-w-7xl mx-auto flex flex-col gap-6 text-left relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-none uppercase">
                    News & <span className="text-[#da1e28]">Updates</span>
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 text-[#da1e28] text-xs font-bold rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#da1e28] animate-pulse"></span>
                    খবর ও নোটিশ
                  </span>
                </div>

                {/* Modern search bar container */}
                <div className="w-full md:max-w-md">
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white border border-gray-200 focus-within:border-[#da1e28] focus-within:ring-2 focus-within:ring-red-100 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm hover:shadow-md transition-all duration-300">
                    <Search size={18} className="text-gray-400 shrink-0 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Search news & circulars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setAppliedSearch('');
                          setCurrentPage(1);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors mr-1"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="bg-[#da1e28] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors shrink-0 cursor-pointer"
                    >
                      Search
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 3. Main Dynamic News Engine */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12" id="news-container-grid">
        
        {selectedPost ? (
          /* ======================================================================
             STATE 3/4: DETAILED POST VIEW (Exactly like mockup screens 3 & 4)
             ====================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in text-left">
            
            {/* Left Column (8 cols): Breadcrumb, Big Cover, Meta, Highlights, Table, Body */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Breadcrumb path */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                <button onClick={() => { setSelectedPost(null); handleCategoryClick('All News'); }} className="hover:text-[#da1e28] transition-colors">Home</button>
                <ChevronRight size={12} className="text-gray-300" />
                <button onClick={() => setSelectedPost(null)} className="hover:text-[#da1e28] transition-colors">News</button>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-gray-800 truncate max-w-[150px] md:max-w-[200px] font-extrabold">{selectedPost.title}</span>
              </div>

              {/* Title, Date and Metas */}
              <div className="flex flex-col gap-4">
                <span className="inline-flex items-center px-3 py-1 text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-150/40 rounded-none w-fit">
                  {selectedPost.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                  {selectedPost.title}
                </h1>
                
                {/* Author profile + Date + Social share bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-sm font-bold text-gray-900">Joy Fast Fly Desk</span>
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <Calendar size={12} className="text-[#da1e28]" /> {selectedPost.date} &bull; {selectedPost.readTime || '3 min read'}
                      </span>
                    </div>
                  </div>

                  {/* Share Icons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Share:</span>
                    <a href="#" className="w-8 h-8 rounded-none border border-gray-200 hover:border-[#da1e28] hover:text-[#da1e28] flex items-center justify-center text-gray-400 transition-colors">
                      <Facebook size={14} />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-none border border-gray-200 hover:border-sky-500 hover:text-sky-500 flex items-center justify-center text-gray-400 transition-colors">
                      <Twitter size={14} />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-none border border-gray-200 hover:border-blue-700 hover:text-blue-700 flex items-center justify-center text-gray-400 transition-colors">
                      <Linkedin size={14} />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-none border border-gray-200 hover:border-green-600 hover:text-green-600 flex items-center justify-center text-gray-400 transition-colors">
                      <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Big Featured Cover Image */}
              <div className="relative w-full aspect-[16/9] bg-gray-100 mt-2 shadow-sm rounded-none overflow-hidden border border-gray-200">
                {selectedPost.fileType === 'image' ? (
                  <img src={selectedPost.mediaUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
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
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={selectedPost.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  } else if (vimeoId) {
                    return (
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}`}
                        title={selectedPost.title}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  } else {
                    return (
                      <video src={selectedPost.mediaUrl} controls className="w-full h-full object-cover" />
                    );
                  }
                })()}
              </div>

              {/* Highlights section (if present) */}
              {selectedPost.highlights && selectedPost.highlights.length > 0 && (
                <div className="bg-red-50/40 border-l-4 border-[#da1e28] rounded-none p-6">
                  <h4 className="font-black text-[#da1e28] text-sm uppercase tracking-wider mb-3">Key Highlights:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPost.highlights.map((high, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 font-bold">
                        <Check size={14} className="text-[#da1e28] mt-0.5 shrink-0" />
                        <span>{high}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Student details structured layout (Crucial for mockup screen 4) */}
              {selectedPost.studentDetails && (
                <div className="bg-gray-50 border-2 border-gray-950 rounded-none p-6 md:p-8 shadow-sm">
                  <h4 className="font-black text-[#da1e28] text-sm uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">
                    Student Information (শিক্ষার্থী তথ্য)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                    <div className="flex justify-between border-b border-gray-150 pb-2">
                      <span className="font-bold text-gray-500 uppercase tracking-wider">Name:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-150 pb-2">
                      <span className="font-bold text-gray-500 uppercase tracking-wider">Country:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.country}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-150 pb-2">
                      <span className="font-bold text-gray-500 uppercase tracking-wider">Applied For:</span>
                      <span className="font-black text-[#da1e28] text-right">{selectedPost.studentDetails.appliedFor}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-150 pb-2">
                      <span className="font-bold text-gray-500 uppercase tracking-wider">Intake:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.intake}</span>
                    </div>
                    <div className="sm:col-span-2 flex justify-between border-b border-gray-150 pb-2">
                      <span className="font-bold text-gray-500 uppercase tracking-wider">University:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.university}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Description Body text */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-normal whitespace-pre-wrap mt-4">
                {selectedPost.body}
              </div>

              {/* Gallery Section (ফটো গ্যালারি) */}
              <div className="mt-10 pt-8 border-t border-gray-150/80">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 bg-[#da1e28]"></div>
                  <h3 className="font-black text-gray-950 text-sm uppercase tracking-widest">
                    Media Gallery (ফটো গ্যালারি)
                  </h3>
                </div>
                <p className="text-xs font-semibold text-gray-400 mb-4 uppercase">
                  Moments from our students' journeys and successful visa handovers
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="relative group overflow-hidden rounded-none aspect-video bg-gray-100 border border-gray-200">
                    <img 
                      src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600" 
                      alt="Joy Fast Fly Success" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="relative group overflow-hidden rounded-none aspect-video bg-gray-100 border border-gray-200">
                    <img 
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600" 
                      alt="Joy Fast Fly Campus" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="relative group overflow-hidden rounded-none aspect-video bg-gray-100 border border-gray-200">
                    <img 
                      src="https://images.unsplash.com/photo-1568291843233-64e0023a8542?q=80&w=600" 
                      alt="Joy Fast Fly Student Visa" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Footer navigation for post swapping */}
              <div className="flex items-center justify-between border-y border-gray-200 py-6 mt-8">
                <button 
                  onClick={() => handlePrevArticle(selectedPost.id)}
                  className="flex items-center gap-3 group hover:text-[#da1e28] transition-colors"
                >
                  <ArrowLeft size={18} className="text-gray-400 group-hover:text-[#da1e28] group-hover:-translate-x-1 transition-all" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Previous News</span>
                    <span className="font-black text-gray-900 group-hover:text-[#da1e28] transition-colors text-sm">আগের খবর</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleNextArticle(selectedPost.id)}
                  className="flex items-center gap-3 group hover:text-[#da1e28] transition-colors text-right"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Next News</span>
                    <span className="font-black text-gray-900 group-hover:text-[#da1e28] transition-colors text-sm">পরবর্তী খবর</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-[#da1e28] group-hover:translate-x-1 transition-all" />
                </button>
              </div>

            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              
              {/* Category Counts Widget */}
              <div className="bg-white">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-5">
                  <h3 className="font-black text-gray-950 text-xs uppercase tracking-widest">
                    Categories
                  </h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`flex items-center justify-between py-2 border-b border-gray-150 last:border-0 transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'text-[#da1e28] font-black'
                          : 'text-gray-700 font-bold hover:text-[#da1e28]'
                      }`}
                    >
                      <span className="text-sm">{cat}</span>
                      <span className="text-xs text-gray-400">
                        ({categoryCounts[cat] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Related News / Trending Now Sidebar */}
              <div className="bg-white">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-5">
                  <h3 className="font-black text-gray-950 text-xs uppercase tracking-widest">
                    Related News
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  {trendingPosts.map((post, index) => (
                    <div 
                      key={post.id || index}
                      onClick={() => setSelectedPost(post)}
                      className="flex gap-4 cursor-pointer group items-start pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-24 h-16 shrink-0 bg-gray-100 overflow-hidden relative border border-gray-200 rounded-none">
                        <MediaPreview post={post} iconSize={18} />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] text-[#da1e28] font-black mb-1 font-mono">{post.date}</span>
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#da1e28] transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counselor Help Profile Card */}
              <div className="bg-gray-50 border-2 border-gray-950 p-6 flex flex-col gap-4">
                <div className="relative w-full h-44 overflow-hidden bg-gray-200 border border-gray-300 rounded-none">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" 
                    alt="Joy Fast Fly Expert" 
                    className="w-full h-full object-cover object-top mix-blend-multiply" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-black text-white uppercase tracking-wider font-mono">
                    Senior Counselor
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-left mt-2">
                  <h3 className="font-black text-gray-900 text-lg leading-tight">
                    Need Help with Visa Process?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    Our expert team is ready to guide you step-by-step through the process.
                  </p>
                </div>
                <button
                  onClick={() => setSection?.('contact')}
                  className="w-full bg-[#da1e28] hover:bg-red-700 text-white py-3.5 px-4 text-xs font-black uppercase tracking-widest transition-colors mt-2 rounded-none cursor-pointer"
                >
                  Contact Now
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* ======================================================================
             DEFAULT VIEW: COMPACT GRID OF NEWS ITEMS (Removed sidebars/featured headers)
             ====================================================================== */
          <div className="flex flex-col gap-8">
            {/* Sorting, count and Search result status */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-100 pb-4">
              <div className="flex flex-col gap-1 text-left">
                <h2 className="text-xl font-black text-gray-950 tracking-tight uppercase">
                  {selectedCategory !== 'All News' ? selectedCategory : 'News & Circulars'}
                </h2>
                {appliedSearch && (
                  <p className="text-xs font-semibold text-gray-400">
                    Search results for: <span className="text-[#da1e28]">"{appliedSearch}"</span>
                  </p>
                )}
              </div>

              {/* Sorting selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'Latest' | 'Oldest')}
                  className="border-2 border-gray-950 text-[10px] font-black text-gray-950 rounded-none px-3 py-1.5 bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Latest">LATEST</option>
                  <option value="Oldest">OLDEST</option>
                </select>
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.slice(0, visibleCount).map((post) => (
                  <div
                    key={post.id}
                    onClick={() => {
                      if (setSelectedPost) {
                        setSelectedPost(post);
                      }
                    }}
                    className="flex flex-col bg-white border border-gray-200 group cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 duration-300 text-left overflow-hidden h-full"
                  >
                    {/* Compact Image */}
                    <div className="w-full h-40 relative overflow-hidden bg-gray-50 border-b border-gray-150 shrink-0">
                      <MediaPreview post={post} iconSize={20} />
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col p-4 flex-grow justify-between">
                      <div>
                        <span className="text-[9px] font-black text-[#da1e28] uppercase tracking-widest font-mono block mb-1">
                          {post.category}
                        </span>
                        <h3 className="text-sm font-black text-gray-900 group-hover:text-[#da1e28] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed font-medium">
                          {post.body}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sky-600 font-bold mt-4 pt-3 border-t border-gray-50">
                        <Calendar size={13} className="shrink-0" />
                        <span className="text-[10px] uppercase tracking-wider font-mono">
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 py-16 text-center rounded-none shadow-sm">
                <p className="text-gray-950 text-sm font-black uppercase tracking-wider font-mono">
                  কোনো ফলাফল পাওয়া যায়নি। (No news posts match your filter criteria)
                </p>
              </div>
            )}

            {/* Load More Controller */}
            {visibleCount < filteredPosts.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="px-8 py-3 bg-[#da1e28] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-none shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Load More News
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
