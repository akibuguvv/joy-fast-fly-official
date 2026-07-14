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

  // Filter and Search logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

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
          <section className="bg-white pt-16 pb-8 px-4 md:px-8 border-b border-gray-100" id="news-header-banner">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 text-left relative z-10">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                News & Updates
              </h1>
              <p className="text-sm md:text-base text-gray-500 max-w-2xl">
                Stay updated with the latest visa information, embassy announcements, and important notices.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 p-1.5 border border-gray-200 max-w-lg mt-2">
                <div className="flex items-center pl-3 pr-2 text-gray-400">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none py-2 px-1"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </section>

          {/* 2. Horizontal Category Section */}
          <section className="bg-white border-b-2 border-gray-900 px-4 md:px-8 sticky top-20 z-30" id="news-category-bar">
            <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`py-4 text-xs font-black tracking-widest uppercase transition-all shrink-0 border-b-2 -mb-[2px] ${
                    selectedCategory === cat
                      ? 'border-[#da1e28] text-[#da1e28]'
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
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
                <button onClick={() => { setSelectedPost(null); handleCategoryClick('All News'); }} className="hover:text-blue-600 transition-colors">Home</button>
                <ChevronRight size={12} className="text-gray-300" />
                <button onClick={() => setSelectedPost(null)} className="hover:text-blue-600 transition-colors">News</button>
                <ChevronRight size={12} className="text-gray-300" />
                <span className="text-gray-800 truncate max-w-[150px] md:max-w-[200px]">{selectedPost.title}</span>
              </div>

              {/* Title, Date and Metas */}
              <div className="flex flex-col gap-4">
                <span className="text-[#da1e28] text-sm font-black uppercase tracking-widest">{selectedPost.category}</span>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
                  {selectedPost.title}
                </h1>
                
                {/* Author profile + Date + Social share bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col text-left leading-tight">
                      <span className="text-sm font-bold text-gray-900">Joy Fast Fly Desk</span>
                      <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <Calendar size={12} /> {selectedPost.date} &bull; {selectedPost.readTime || '3 min read'}
                      </span>
                    </div>
                  </div>

                  {/* Share Icons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Share:</span>
                    <a href="#" className="w-8 h-8 rounded-full border border-gray-200 hover:border-blue-600 hover:text-blue-600 flex items-center justify-center text-gray-400 transition-colors">
                      <Facebook size={14} />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full border border-gray-200 hover:border-sky-500 hover:text-sky-500 flex items-center justify-center text-gray-400 transition-colors">
                      <Twitter size={14} />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full border border-gray-200 hover:border-blue-700 hover:text-blue-700 flex items-center justify-center text-gray-400 transition-colors">
                      <Linkedin size={14} />
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full border border-gray-200 hover:border-green-600 hover:text-green-600 flex items-center justify-center text-gray-400 transition-colors">
                      <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Big Featured Cover Image */}
              <div className="relative w-full aspect-[16/9] bg-gray-100 mt-2">
                {selectedPost.fileType === 'image' ? (
                  <img src={selectedPost.mediaUrl} alt={selectedPost.title} className="w-full h-full object-cover" />
                ) : (
                  <video src={selectedPost.mediaUrl} controls autoPlay className="w-full h-full object-cover" />
                )}
              </div>

              {/* Highlights section (if present) */}
              {selectedPost.highlights && selectedPost.highlights.length > 0 && (
                <div className="bg-red-50/40 border border-red-100 rounded-2xl p-6">
                  <h4 className="font-black text-blue-950 text-sm uppercase tracking-wider mb-3">Key Highlights:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPost.highlights.map((high, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-700 font-semibold">
                        <Check size={14} className="text-[#da1e28] mt-0.5 shrink-0" />
                        <span>{high}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Student details structured layout (Crucial for mockup screen 4) */}
              {selectedPost.studentDetails && (
                <div className="bg-gray-50 border border-gray-200/50 rounded-2xl p-6 md:p-8">
                  <h4 className="font-black text-blue-950 text-sm uppercase tracking-widest mb-4 border-b border-gray-200/60 pb-2">
                    Student Information (শিক্ষার্থী তথ্য)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-400 uppercase tracking-wider">Name:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-400 uppercase tracking-wider">Country:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.country}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-400 uppercase tracking-wider">Applied For:</span>
                      <span className="font-black text-[#da1e28] text-right">{selectedPost.studentDetails.appliedFor}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-400 uppercase tracking-wider">Intake:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.intake}</span>
                    </div>
                    <div className="sm:col-span-2 flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-400 uppercase tracking-wider">University:</span>
                      <span className="font-black text-blue-950 text-right">{selectedPost.studentDetails.university}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Core Description Body text */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-normal whitespace-pre-wrap mt-4">
                {selectedPost.body}
              </div>

              {/* Gallery Thumbnails Grid (Mockup screen 3 & 4 gallery layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-8">
                <img src="https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=300" alt="Joy Fast Fly Gallery" className="w-full h-40 md:h-32 object-cover bg-gray-100" />
                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300" alt="Joy Fast Fly Gallery" className="w-full h-40 md:h-32 object-cover bg-gray-100" />
                <img src="https://images.unsplash.com/photo-1563294371-2b638848f1ea?q=80&w=300" alt="Joy Fast Fly Gallery" className="w-full h-40 md:h-32 object-cover bg-gray-100" />
              </div>

              {/* Footer navigation for post swapping */}
              <div className="flex items-center justify-between border-y border-gray-200 py-6 mt-8">
                <button 
                  onClick={() => handlePrevArticle(selectedPost.id)}
                  className="flex items-center gap-3 group hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Previous News</span>
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">আগের খবর</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleNextArticle(selectedPost.id)}
                  className="flex items-center gap-3 group hover:text-blue-600 transition-colors text-right"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Next News</span>
                    <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">পরবর্তী খবর</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              
              {/* Category Counts Widget */}
              <div className="bg-white">
                <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-3 mb-5">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
                    Categories
                  </h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 transition-all ${
                        selectedCategory === cat
                          ? 'text-blue-600 font-bold'
                          : 'text-gray-700 font-medium hover:text-blue-600'
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
                <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-3 mb-5">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
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
                      <div className="w-24 h-16 shrink-0 bg-gray-100 overflow-hidden">
                        {post.fileType === 'image' ? (
                          <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <video src={post.mediaUrl} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[10px] text-gray-500 font-bold mb-1">{post.date}</span>
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counselor Help Profile Card */}
              <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col gap-4">
                <div className="relative w-full h-44 overflow-hidden bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" 
                    alt="Joy Fast Fly Expert" 
                    className="w-full h-full object-cover object-top mix-blend-multiply" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white uppercase tracking-wider">
                    Senior Counselor
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-left mt-2">
                  <h3 className="font-black text-gray-900 text-lg leading-tight">
                    Need Help with Visa Process?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our expert team is ready to guide you step-by-step through the process.
                  </p>
                </div>
                <button
                  onClick={() => setSection?.('contact')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors mt-2"
                >
                  Contact Now
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* ======================================================================
             DEFAULT VIEW: DYNAMIC GRID / LIST CONTROLLER (PAGES 1 & 2 OF MOCKUP)
             ====================================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Content Area (8 cols): Featured + Latest Updates / All News List */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {selectedCategory === 'All News' && appliedSearch === '' ? (
                /* ==========================================
                   STATE 1: News Home Layout (Featured block)
                   ========================================== */
                <div className="flex flex-col gap-10">
                  
                  {/* Featured News Widget */}
                  {featuredPost && (
                    <div className="flex flex-col gap-4 text-left border-b border-gray-900 pb-8 cursor-pointer group" onClick={() => setSelectedPost(featuredPost)} id={`featured-post-${featuredPost.id}`}>
                      {/* Featured Image */}
                      <div className="w-full relative overflow-hidden bg-gray-100 mb-2">
                        <img 
                          src={featuredPost.mediaUrl} 
                          alt={featuredPost.title} 
                          className="w-full aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      </div>
                      
                      {/* Featured details */}
                      <div className="flex flex-col gap-3">
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {featuredPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3">
                          {featuredPost.body}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs font-bold text-gray-400">
                          <span className="text-[#da1e28] uppercase">{featuredPost.category}</span>
                          <span>&bull;</span>
                          <span>{featuredPost.date}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Latest Updates Grid block */}
                  <div className="flex flex-col gap-6 text-left">
                    <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-3">
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest text-sm">
                        Latest Updates
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {filteredPosts.slice(0, visibleCount).map((post) => (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="group cursor-pointer flex flex-col gap-4 border-b border-gray-100 pb-6 last:border-0"
                          id={`news-card-${post.id}`}
                        >
                          {/* Image preview */}
                          <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                            {post.fileType === 'image' ? (
                              <img 
                                src={post.mediaUrl} 
                                alt={post.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                <video src={post.mediaUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <PlayCircle size={32} className="text-white opacity-85" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content summary */}
                          <div className="flex flex-col flex-grow text-left justify-between gap-3">
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-black text-[#da1e28] uppercase tracking-wider">
                                {post.category}
                              </span>
                              <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                {post.body}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">
                                {post.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Load More Controller */}
                    {visibleCount < filteredPosts.length && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setVisibleCount(prev => prev + 4)}
                          className="px-8 py-3.5 bg-[#da1e28] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-md hover:shadow-lg transition-all"
                        >
                          Load More News
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* ==========================================
                   STATE 2: News List / Search Results View
                   ========================================== */
                <div className="flex flex-col gap-6 text-left">
                  
                  {/* Dynamic Header details */}
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-100 pb-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-black text-blue-950 tracking-tight">
                        {selectedCategory !== 'All News' ? selectedCategory : 'All News & Updates'}
                      </h2>
                      {appliedSearch && (
                        <p className="text-xs font-semibold text-gray-400">
                          Search results for: <span className="text-[#da1e28]">"{appliedSearch}"</span>
                        </p>
                      )}
                    </div>

                    {/* Sorting selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">Sort by:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'Latest' | 'Oldest')}
                        className="border border-gray-200 text-xs font-black text-blue-950 rounded-xl px-3 py-2 bg-white focus:outline-none"
                      >
                        <option value="Latest">Latest</option>
                        <option value="Oldest">Oldest</option>
                      </select>
                    </div>
                  </div>

                  {/* News list items (horizontal list card layout) */}
                  {paginatedPosts.length > 0 ? (
                    <div className="flex flex-col">
                      {paginatedPosts.map((post) => (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="flex flex-col md:flex-row gap-6 py-6 border-b border-gray-100 group cursor-pointer last:border-0"
                        >
                          {/* Left: Thumbnail container */}
                          <div className="w-full md:w-64 aspect-[3/2] relative overflow-hidden bg-gray-100 shrink-0">
                            {post.fileType === 'image' ? (
                              <img 
                                src={post.mediaUrl} 
                                alt={post.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                            ) : (
                              <div className="relative w-full h-full">
                                <video src={post.mediaUrl} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <PlayCircle size={24} className="text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right: details info */}
                          <div className="flex flex-col justify-between flex-grow text-left">
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-black text-[#da1e28] uppercase tracking-wider">
                                {post.category}
                              </span>
                              <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                {post.body}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 mt-4 text-[10px] font-bold text-gray-400 uppercase">
                              <span>{post.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200/50 rounded-2xl py-16 text-center shadow-sm">
                      <p className="text-gray-400 text-sm font-semibold">
                        কোনো ফলাফল পাওয়া যায়নি। (No news posts match your filter criteria)
                      </p>
                    </div>
                  )}

                  {/* Standard pagination buttons widget */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1.5 mt-8 border-t border-gray-100 pt-6">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-blue-950 flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                            currentPage === i + 1
                              ? 'bg-[#da1e28] text-white shadow-md shadow-red-50'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-blue-950 flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column (4 cols): Trending Now, Popular Tags, Counselor Assist Call */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Trending Now Sidebar */}
              <div className="bg-white">
                <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-3 mb-5">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
                    Trending Now
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {trendingPosts.map((post, index) => (
                    <div 
                      key={post.id || index}
                      onClick={() => setSelectedPost(post)}
                      className="flex gap-4 cursor-pointer group items-start pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-24 h-16 shrink-0 bg-gray-100 overflow-hidden">
                        {post.fileType === 'image' ? (
                          <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <video src={post.mediaUrl} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 text-left">
                        <span className="text-[10px] text-[#da1e28] font-bold mb-1 uppercase">{post.category}</span>
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags cloud */}
              <div className="bg-white mt-4">
                <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-3 mb-5">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest">
                    Popular Tags
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 text-left">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Counselor Help Profile Card */}
              <div className="bg-gray-50 border border-gray-200 p-6 flex flex-col gap-4 mt-4">
                <div className="relative w-full h-44 overflow-hidden bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" 
                    alt="Joy Fast Fly Expert" 
                    className="w-full h-full object-cover object-top mix-blend-multiply" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white uppercase tracking-wider">
                    Our Senior Counselor
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-left mt-2">
                  <h3 className="font-black text-gray-900 text-lg leading-tight">
                    Need Help with Visa Process?
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our expert team is ready to guide you step-by-step through the process.
                  </p>
                </div>
                <button
                  onClick={() => setSection?.('contact')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors mt-2"
                >
                  Contact Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
