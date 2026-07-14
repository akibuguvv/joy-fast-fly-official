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

  // Initial URL-to-state (on mount only)
  React.useEffect(() => {
    const path = window.location.pathname.replace(/^\/+/g, '');
    if (path === 'admin') {
      setSection('admin');
    } else if (['about', 'destinations', 'services', 'contact', 'news', 'stories'].includes(path)) {
      setSection(path);
    } else {
      setSection('home');
    }
  }, []);

  // State-to-URL (when section changes)
  React.useEffect(() => {
    // Scroll to top on section change
    window.scrollTo(0, 0);

    // Update URL without reloading the page
    const newPath = section === 'home' ? '/' : `/${section}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ section }, '', newPath);
    }
  }, [section]);

  // Handle back/forward browser buttons
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.section) {
        setSection(event.state.section);
      } else {
        const path = window.location.pathname.replace(/^\/+/g, '');
        setSection(path === 'admin' ? 'admin' : (path || 'home'));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
