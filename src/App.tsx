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
import { ExploreCountrySection } from './components/ExploreCountrySection';
import { SchengenSection } from './components/SchengenSection';
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
  const [sharedPosts, setSharedPosts] = useState<NewsPost[]>(() => {
    const savedNews = localStorage.getItem('joyfastfly_news');
    if (savedNews) {
      try {
        return JSON.parse(savedNews);
      } catch (e) {
        console.error('Failed to parse saved news from localStorage', e);
      }
    }
    return INITIAL_NEWS_POSTS;
  });
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [sharedCountries, setSharedCountries] = useState<any[]>([]);
  const [sharedStories, setSharedStories] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    logo_url: '/logo.png',
    favicon_url: '/favicon.ico',
    hero_banner_url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2000'
  });

  // Fetch data from Supabase on mount
  React.useEffect(() => {
    // Check for ?admin=true query parameter to open admin panel directly
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setSection('admin');
    }

    const fetchData = async () => {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('Supabase credentials missing, using local data');
        return;
      }

      const { supabase } = await import('./lib/supabase');
      if (!supabase) return;

      try {
        // Fetch News
        const { data: newsData } = await supabase
          .from('news')
          .select('*')
          .order('date', { ascending: false });

        if (newsData && newsData.length > 0) {
          setSharedPosts(newsData.map((item: any) => ({
            ...item,
            highlights: typeof item.highlights === 'string' ? JSON.parse(item.highlights) : item.highlights,
            studentDetails: typeof item.studentDetails === 'string' ? JSON.parse(item.studentDetails) : item.studentDetails,
          })));
        }

        // Fetch Countries
        const { data: countryData } = await supabase.from('countries').select('*');
        if (countryData && countryData.length > 0) {
          setSharedCountries(countryData.map((item: any) => ({
            ...item,
            highlights: typeof item.highlights === 'string' ? JSON.parse(item.highlights) : item.highlights,
            intakes: typeof item.intakes === 'string' ? JSON.parse(item.intakes) : item.intakes,
            requirements: typeof item.requirements === 'string' ? JSON.parse(item.requirements) : item.requirements,
            popularCourses: typeof item.popularCourses === 'string' ? JSON.parse(item.popularCourses) : item.popularCourses,
          })));
        }

        // Fetch Stories
        const { data: storyData } = await supabase.from('success_stories').select('*');
        if (storyData && storyData.length > 0) {
          setSharedStories(storyData);
        }

        // Fetch Site Settings
        const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 'global_assets').single();
        if (settingsData) {
          setSiteSettings(prev => ({
            ...prev,
            ...settingsData
          }));
        }
      } catch (e) {
        console.error('Failed to fetch data:', e);
      }
    };

    fetchData();
  }, []);

  // Save news posts to localStorage whenever they change as a local cache fallback
  React.useEffect(() => {
    localStorage.setItem('joyfastfly_news', JSON.stringify(sharedPosts));
  }, [sharedPosts]);

  // Initial URL-to-state (on mount only)
  React.useEffect(() => {
    const path = window.location.pathname.replace(/^\/+/g, '');
    
    // Handle Custom Redirect Links
    if (path && path !== '' && path !== 'admin') {
      const savedLinks = localStorage.getItem('joyfastfly_links');
      if (savedLinks) {
        try {
          const links = JSON.parse(savedLinks);
          const link = links.find((l: any) => l.slug === path || l.id === path);
          if (link) {
            window.location.href = link.url;
            return; // Redirecting, stop further processing
          }
        } catch (e) {
          console.error('Redirect failed');
        }
      }
    }

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
            heroBanner={siteSettings.hero_banner_url}
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
      case 'explore-country':
        return (
          <ExploreCountrySection 
            setSection={setSection} 
            setSelectedCountryId={setSelectedCountryId} 
          />
        );
      case 'schengen':
        return <SchengenSection setSection={setSection} setSelectedCountryId={setSelectedCountryId} />;
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
          logoUrl={siteSettings.logo_url}
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
