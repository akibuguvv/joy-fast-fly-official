import React, { useState, useEffect } from 'react';
import { GALLERY_ITEMS } from '../data';
import { Award, Landmark, Eye, Trophy } from 'lucide-react';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [items, setItems] = useState<GalleryItem[]>(GALLERY_ITEMS.map((item: any) => ({
    ...item,
    id: item.id.toString()
  })));

  useEffect(() => {
    const saved = localStorage.getItem('joyfastfly_gallery');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load gallery items', e);
      }
    }
  }, []);

  const filters = ['All', 'Visa Success', 'Student Activities', 'Campus Life', 'Office Events'];

  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter(item => item.category === activeFilter);

  return (
    <div className="flex flex-col w-full bg-white" id="gallery-section">
      {/* Page Header */}
      <section className="bg-blue-950 text-white py-16 px-4 text-center relative overflow-hidden" id="gallery-banner">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#da1e28] text-xs font-black uppercase tracking-widest bg-red-500/10 px-3.5 py-1 rounded-full">
            SUCCESS SNAPSHOTS
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1">
            Student & Campus Gallery
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold max-w-lg mt-1">
            Browse through our wall of fame featuring successful student visas and glimpses of international universities.
          </p>
        </div>
      </section>

      {/* Filter and Photo Grid */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10" id="gallery-content">
        
        {/* Filtering Options */}
        <div className="flex flex-wrap items-center justify-center gap-2" id="gallery-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all border ${
                activeFilter === filter
                  ? 'bg-[#da1e28] border-[#da1e28] text-white shadow-md shadow-red-500/20'
                  : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-500'
              }`}
              id={`gallery-filter-btn-${filter.toLowerCase().replace(' ', '-')}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="gallery-grid">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left"
              id={`gallery-card-${item.id}`}
            >
              {/* Photo Box */}
              <div className="relative aspect-[4/3] overflow-hidden shrink-0" id={`gallery-photo-box-${item.id}`}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                
                {/* Floating category badge on top-left */}
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#da1e28] shadow-sm" id={`gallery-badge-${item.id}`}>
                  {item.category}
                </div>
              </div>

              {/* Photo Caption details */}
              <div className="p-6 flex flex-col gap-1" id={`gallery-caption-${item.id}`}>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.studentName}</span>
                <h3 className="text-base font-black text-blue-950 group-hover:text-[#da1e28] transition-colors">{item.title}</h3>
                <span className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                  <Landmark size={12} className="text-amber-500 shrink-0" />
                  {item.university}
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};
