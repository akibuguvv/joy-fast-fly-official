/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { StudyAbroadSection } from './components/StudyAbroadSection';
import { CoursesSection } from './components/CoursesSection';
import { ExploreCountrySection } from './components/ExploreCountrySection';
import { SchengenSection } from './components/SchengenSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { NewsSection } from './components/NewsSection';
import { AdminPanelSection } from './components/AdminPanelSection';
import { NewsPost } from './types';
import { INITIAL_NEWS_POSTS } from './newsData';

export default function App() {
  const [section, setSection] = useState<string>('home');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [newsCategory, setNewsCategory] = useState<string | null>(null);
  const [sharedPosts, setSharedPosts] = useState<NewsPost[]>(INITIAL_NEWS_POSTS);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    
    // Handle Custom Redirect Links
    const path = window.location.pathname.replace(/^\/+/g, '');
    if (path && path !== '' && path !== 'admin') {
      const savedLinks = localStorage.getItem('joyfastfly_links');
      if (savedLinks) {
        try {
          const links = JSON.parse(savedLinks);
          const link = links.find((l: any) => l.slug === path || l.id === path);
          if (link) {
            window.location.href = link.url;
          }
        } catch (e) {
          console.error('Redirect failed');
        }
      }
    }
  }, [section]);

  // Render correct view based on navigation state
  const renderSection = () => {
    switch (section) {
      case 'home':
        return (
          <HomeSection 
            setSection={setSection} 
            setSelectedCountryId={setSelectedCountryId} 
            posts={sharedPosts}
            setSelectedPost={setSelectedPost}
          />
        );
      case 'about':
        return <AboutSection />;
      case 'study-abroad':
        return (
          <StudyAbroadSection 
            selectedCountryId={selectedCountryId} 
            setSelectedCountryId={setSelectedCountryId} 
            setSection={setSection}
          />
        );
      case 'courses':
        return (
          <CoursesSection 
            selectedDiscipline={selectedDiscipline} 
            setSelectedDiscipline={setSelectedDiscipline} 
          />
        );
      case 'explore-country':
        return (
          <ExploreCountrySection 
            setSection={setSection} 
            setSelectedCountryId={setSelectedCountryId} 
          />
        );
      case 'schengen':
        return <SchengenSection />;
      case 'gallery':
        return <GallerySection />;
      case 'contact':
        return <ContactSection />;
      case 'admin':
        return <AdminPanelSection posts={sharedPosts} setPosts={setSharedPosts} setSection={setSection} />;
      case 'news':
        return <NewsSection category={newsCategory} posts={sharedPosts} setPosts={setSharedPosts} setSection={setSection} selectedPost={selectedPost} setSelectedPost={setSelectedPost} />;
      default:
        return <HomeSection setSection={setSection} posts={sharedPosts} setSelectedPost={setSelectedPost} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#da1e28] selection:text-white" id="jtec-root-app">
      {/* Header element */}
      {section !== 'admin' && (
        <Header 
          currentSection={section} 
          setSection={setSection} 
          setSelectedCountryId={setSelectedCountryId}
          setSelectedDiscipline={setSelectedDiscipline}
          setNewsCategory={setNewsCategory}
        />
      )}

      {/* Main Dynamic Viewport */}
      <main className="flex-grow flex flex-col w-full animate-fade-in" id="jtec-main-content">
        {renderSection()}
      </main>

      {/* Footer element */}
      {section !== 'admin' && <Footer setSection={setSection} />}
    </div>
  );
}
