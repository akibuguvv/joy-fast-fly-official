import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  LayoutDashboard,
  FileText,
  Award,
  Globe,
  BookOpen,
  FileSpreadsheet,
  Inbox,
  Image as ImageIcon,
  Bell,
  Layers,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Database,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Eye,
  Menu,
  X,
  ChevronDown,
  Upload,
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  HelpCircle,
  BookOpenCheck,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  MapPinCheck,
  Briefcase,
  Mail,
  Phone,
  RefreshCw,
  Landmark
} from 'lucide-react';
import { Inquiry, NewsPost, CountryInfo, Course } from '../types';
import { JtecLogo } from './JtecLogo';
import { COUNTRIES, getMergedCountries } from '../data';

interface AdminPanelProps {
  posts: NewsPost[];
  setPosts: React.Dispatch<React.SetStateAction<NewsPost[]>>;
  setSection: (section: string) => void;
}

// Interfaces for local state management
interface SuccessStory {
  id: string;
  name: string;
  country: string;
  visaType: string;
  imageUrl: string;
  status: 'Published' | 'Draft';
  date: string;
}

interface ApplicationItem {
  id: string;
  name: string;
  country: string;
  visaType: string;
  status: 'New' | 'In Review' | 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

interface CountryAdminItem {
  id: string;
  name: string;
  code: string;
  totalNews: number;
  status: 'Active' | 'Inactive';
}

export const AdminPanelSection: React.FC<AdminPanelProps> = ({ posts, setPosts, setSection }) => {
  const [adminUnlocked, setAdminUnlocked] = useState(() => localStorage.getItem('admin_unlocked') === 'true');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Check auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAdminUnlocked(true);
      }
    };
    checkSession();
  }, []);
  
  // Left Sidebar active tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Assets State
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [faviconUrl, setFaviconUrl] = useState<string>('/favicon.ico');
  const [heroBannerUrl, setHeroBannerUrl] = useState<string>('https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2000');

  // News & Updates Sub-Views ('list' | 'add' | 'edit' | 'details')
  const [newsSubView, setNewsSubView] = useState<'list' | 'add' | 'edit' | 'details'>('list');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);

  // Form states for News
  const [newsTitle, setNewsTitle] = useState('');
  const [newsBody, setNewsBody] = useState('');
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [newsFileUrl, setNewsFileUrl] = useState('');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [newsCategory, setNewsCategory] = useState('Student Visa');
  const [newsCountry, setNewsCountry] = useState('Cyprus');
  const [newsStatus, setNewsStatus] = useState<'Published' | 'Draft'>('Published');
  const [newsTags, setNewsTags] = useState('');
  const [newsPublishDate, setNewsPublishDate] = useState('');
  const [newsShortDescription, setNewsShortDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [readTime, setReadTime] = useState('3 min read');

  // Search and Filter states
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCatFilter, setNewsCatFilter] = useState('All Categories');
  const [newsStatusFilter, setNewsStatusFilter] = useState('All Status');

  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState('All Types');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All Status');
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const [countrySearch, setCountrySearch] = useState('');
  const [storySearch, setStorySearch] = useState('');

  // Local state databases loaded from localStorage or seeded with mockup data
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [visitorsCount, setVisitorsCount] = useState<number>(0);
  const [links, setLinks] = useState<any[]>([]);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const deleteLink = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
    localStorage.setItem('joyfastfly_links', JSON.stringify(updated));
  };

  // Country PDF Checklist Management States
  const [countryPdfs, setCountryPdfs] = useState<Record<string, { pdfName: string; pdfUrl: string; uploadedAt: string }>>(() => {
    try {
      const saved = localStorage.getItem('joyfastfly_country_pdfs');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [pdfUploadCountryId, setPdfUploadCountryId] = useState(COUNTRIES[0]?.id || '');
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfIsDragging, setPdfIsDragging] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState('');
  const [pdfUploading, setPdfUploading] = useState(false);

  // Fetch Assets
  const fetchAssets = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'global_assets').single();
      if (!error && data) {
        if (data.logo_url) setLogoUrl(data.logo_url);
        if (data.favicon_url) setFaviconUrl(data.favicon_url);
        if (data.hero_banner_url) setHeroBannerUrl(data.hero_banner_url);
      }
    } catch (e) {}
  };

  // Helper: Upload to Supabase Storage
  const uploadToStorage = async (file: File, bucket: string): Promise<string | null> => {
    if (!supabase) return null;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) {
        console.error(`Error uploading to ${bucket}:`, error.message);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e) {
      console.error('Upload failed:', e);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handlePdfUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPdfFile || !pdfUploadCountryId) {
      setPdfUploadError('Please select a country and a PDF checklist file.');
      return;
    }
    if (selectedPdfFile.type !== 'application/pdf' && !selectedPdfFile.name.endsWith('.pdf')) {
      setPdfUploadError('Only PDF documents are allowed.');
      return;
    }

    setPdfUploading(true);
    setPdfUploadError('');

    try {
      const uploadedUrl = await uploadToStorage(selectedPdfFile, 'assets');
      if (uploadedUrl) {
        const updated = {
          ...countryPdfs,
          [pdfUploadCountryId.toLowerCase()]: {
            pdfName: selectedPdfFile.name,
            pdfUrl: uploadedUrl,
            uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          }
        };
        setCountryPdfs(updated);
        localStorage.setItem('joyfastfly_country_pdfs', JSON.stringify(updated));
        
        // Save to Supabase DB
        if (supabase) {
          await supabase.from('country_checklists').upsert({
            country_id: pdfUploadCountryId.toLowerCase(),
            pdf_name: selectedPdfFile.name,
            pdf_url: uploadedUrl
          });
        }
        
        setSelectedPdfFile(null);
        alert('Checklist PDF uploaded successfully to Supabase for ' + COUNTRIES.find(c => c.id === pdfUploadCountryId)?.name + '!');
      } else {
        setPdfUploadError('Failed to upload PDF to Supabase Storage.');
      }
      setPdfUploading(false);
    } catch (err) {
      console.error(err);
      setPdfUploadError('Failed to upload PDF checklist.');
      setPdfUploading(false);
    }
  };

  const deleteCountryPdf = (countryId: string) => {
    const countryName = COUNTRIES.find(c => c.id === countryId)?.name || countryId;
    requestConfirm(
      'Delete PDF Checklist',
      `Are you sure you want to delete the PDF checklist for ${countryName}?`,
      () => {
        const updated = { ...countryPdfs };
        delete updated[countryId.toLowerCase()];
        setCountryPdfs(updated);
        localStorage.setItem('joyfastfly_country_pdfs', JSON.stringify(updated));
        alert(`Deleted PDF checklist for ${countryName}.`);
      }
    );
  };
  
  // Adding/editing states for non-news sections
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const [newCountryName, setNewCountryName] = useState('');
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newCountryStatus, setNewCountryStatus] = useState<'Active' | 'Inactive'>('Active');
  const [newCountryVisaType, setNewCountryVisaType] = useState<'student' | 'work'>('student');
  const [newCountryIntake, setNewCountryIntake] = useState('2 - 3 Months');
  const [newCountryTuition, setNewCountryTuition] = useState('');
  const [newCountryEducation, setNewCountryEducation] = useState('');
  const [newCountryIelts, setNewCountryIelts] = useState('No IELTS Required');
  const [newCountryFunds, setNewCountryFunds] = useState('');
  const [newCountryHighlights, setNewCountryHighlights] = useState('');
  const [newCountryCourses, setNewCountryCourses] = useState('');
  const [newCountryBgImage, setNewCountryBgImage] = useState('');

  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [newStoryName, setNewStoryName] = useState('');
  const [newStoryCountry, setNewStoryCountry] = useState('Cyprus');
  const [newStoryVisaType, setNewStoryVisaType] = useState('Student Visa');
  const [newStoryStatus, setNewStoryStatus] = useState<'Published' | 'Draft'>('Published');

  // Applications Sub-Views
  const [appSubView, setAppSubView] = useState<'list' | 'add' | 'edit' | 'details'>('list');
  const [viewingAppId, setViewingAppId] = useState<string | null>(null);

  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCountry, setNewAppCountry] = useState('Cyprus');
  const [newAppVisaType, setNewAppVisaType] = useState('Student Visa');
  const [newAppStatus, setNewAppStatus] = useState<'New' | 'In Review' | 'Pending' | 'Approved'>('New');

  // State-based Confirmation Modal to avoid browser sandboxing iframe block
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const requestConfirm = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        try {
          await onConfirm();
        } catch (e) {
          console.error("Confirmation execution failed", e);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // 1. Fetch Inquiries (from Supabase + localStorage merge)
  const fetchInquiries = async () => {
    let dbInquiries: Inquiry[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('id', { ascending: false });
        if (!error && data) {
          dbInquiries = data;
        }
      } catch (e) {
        console.error('Supabase fetch failed', e);
      }
    }
    
    let localInquiries: Inquiry[] = [];
    const saved = localStorage.getItem('joyfastfly_inquiries');
    if (saved) {
      try {
        localInquiries = JSON.parse(saved);
      } catch (e) {}
    }

    const mergedMap = new Map<string, Inquiry>();
    
    // Fill from db first
    dbInquiries.forEach(item => {
      mergedMap.set(String(item.id), item);
    });
    
    // Fill from local cache, filtering out any legacy demo registrations
    localInquiries.forEach(item => {
      const isDemo = ['1', '2', '3', '4', '5'].includes(item.id) && 
        ['Arman Hossain', 'Mim Akter', 'Sajib Khan', 'Nayeem Hasan', 'Tahsin Ahmed'].includes(item.name);
      if (!isDemo) {
        if (!mergedMap.has(item.id)) {
          mergedMap.set(item.id, item);
        }
      }
    });

    const finalInquiries = Array.from(mergedMap.values());
    
    // Sort by date descending
    finalInquiries.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });

    setInquiries(finalInquiries);
    localStorage.setItem('joyfastfly_inquiries', JSON.stringify(finalInquiries));
  };

  // 2. Fetch Success Stories (removing demo items)
  const fetchStories = async () => {
    let dbStories: SuccessStory[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from('success_stories').select('*');
        if (!error && data) dbStories = data;
      } catch (e) {}
    }

    const saved = localStorage.getItem('joyfastfly_stories');
    let localStories: SuccessStory[] = [];
    if (saved) {
      try {
        localStories = JSON.parse(saved);
      } catch (e) {}
    }

    const merged = [...dbStories];
    const dbIds = new Set(dbStories.map(s => s.id));
    localStories.forEach(s => {
      if (!dbIds.has(s.id)) merged.push(s);
    });

    const filtered = merged.filter((item: any) => !['1', '2', '3', '4', '5'].includes(item.id) || !item.name.includes('Rahim'));
    setSuccessStories(filtered);
  };

  // 3. Fetch Applications (removing demo items & automatically mirroring from online inquiries)
  const fetchApps = () => {
    const saved = localStorage.getItem('joyfastfly_apps');
    let loadedApps: ApplicationItem[] = [];
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        loadedApps = loaded.filter((item: any) => !['1', '2', '3', '4'].includes(item.id) || !item.name.includes('Rahim'));
      } catch (e) {}
    }

    // Fetch and merge online inquiries so they are automatically visible under Applications too
    const savedInq = localStorage.getItem('joyfastfly_inquiries');
    let localInqs: Inquiry[] = [];
    if (savedInq) {
      try {
        localInqs = JSON.parse(savedInq);
      } catch (e) {}
    }

    const mergedList = [...loadedApps];
    const existingIds = new Set(loadedApps.map(item => item.id));

    localInqs.forEach(inq => {
      if (!existingIds.has(inq.id)) {
        mergedList.push({
          id: inq.id,
          name: inq.name,
          country: inq.destination || 'Cyprus',
          visaType: inq.visaType === 'student' ? 'Student Visa' : 'Work Permit',
          status: (inq.status || 'New') as any,
          date: new Date(inq.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        });
      }
    });

    setApplications(mergedList);
  };

  // 4. Fetch Countries
  const fetchCountries = async () => {
    let dbCountries: CountryInfo[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase.from('countries').select('*');
        if (!error && data) dbCountries = data;
      } catch (e) {}
    }

    const baseCountries = getMergedCountries(true);
    const merged = [...baseCountries];
    const baseIds = new Set(baseCountries.map(c => c.id.toLowerCase()));

    dbCountries.forEach(c => {
      if (!baseIds.has(c.id.toLowerCase())) {
        merged.push({
          ...c,
          highlights: typeof c.highlights === 'string' ? JSON.parse(c.highlights) : c.highlights,
          intakes: typeof c.intakes === 'string' ? JSON.parse(c.intakes) : c.intakes,
          requirements: typeof c.requirements === 'string' ? JSON.parse(c.requirements) : c.requirements,
          popularCourses: typeof c.popularCourses === 'string' ? JSON.parse(c.popularCourses) : c.popularCourses,
        });
      }
    });

    setCountries(merged);
  };

  const fetchLinks = () => {
    const saved = localStorage.getItem('joyfastfly_links');
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load links');
      }
    }
  };

  // Synchronize on mount or unlock
  useEffect(() => {
    if (adminUnlocked) {
      fetchInquiries();
      fetchStories();
      fetchApps();
      fetchCountries();
      fetchLinks();
      fetchAssets();
    }
  }, [adminUnlocked]);

  // Listen for storage events (e.g., from other tabs during candidate registration)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (adminUnlocked && e.key === 'joyfastfly_inquiries') {
        fetchInquiries();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [adminUnlocked]);

  // Global manual refresh handler
  const handleFullRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchInquiries();
      fetchStories();
      fetchApps();
      fetchCountries();
    } catch (e) {
      console.error('Failed to sync databases:', e);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 700);
    }
  };

  // Clean Slate / Reset All Database to 0
  const handleClearAllData = async () => {
    requestConfirm(
      'Reset Entire Database',
      'Are you sure you want to completely reset the database to a clean slate (0 entries everywhere)? This will wipe out all local data and clear Supabase records.',
      async () => {
        if (supabase) {
          try {
            const { error } = await supabase
              .from('inquiries')
              .delete()
              .neq('id', '');
            if (error) {
              console.error('Error clearing Supabase inquiries:', error);
            }
          } catch (e) {
            console.error('Failed to clear Supabase inquiries:', e);
          }
        }

        localStorage.removeItem('joyfastfly_inquiries');
        localStorage.removeItem('joyfastfly_stories');
        localStorage.removeItem('joyfastfly_apps');
        localStorage.removeItem('joyfastfly_countries_admin');
        
        setInquiries([]);
        setSuccessStories([]);
        setApplications([]);
        setCountries([]);
        setPosts([]);
        setVisitorsCount(0);
        
        alert('Database successfully reset to 0! All metrics and Supabase records are now completely clean.');
      }
    );
  };

  // Handle Admin Password Unlock
  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setAdminError('Supabase not initialized');
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (error) {
      setAdminError(error.message);
    } else {
      setAdminUnlocked(true);
      setAdminError('');
    }
  };

  // Manage News CRUD Actions
  const handlePostNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsBody) {
      alert('Please fill out Title and Content.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    let determinedFileType: 'image' | 'video' = 'image';
    let finalMediaUrl = '';

    if (newsFile) {
      determinedFileType = newsFile.type.startsWith('video') ? 'video' : 'image';
      const uploadedUrl = await uploadToStorage(newsFile, 'news');
      if (uploadedUrl) {
        finalMediaUrl = uploadedUrl;
      } else {
        alert('File upload failed. Using local preview.');
        finalMediaUrl = URL.createObjectURL(newsFile);
      }
    } else if (newsVideoUrl) {
      determinedFileType = 'video';
      finalMediaUrl = newsVideoUrl;
    } else if (newsFileUrl) {
      determinedFileType = 'image';
      finalMediaUrl = newsFileUrl;
    } else {
      determinedFileType = 'image';
      finalMediaUrl = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800';
    }

    if (newsSubView === 'add') {
      // Create new news post
      const newPost: NewsPost = {
        id: String(Date.now()),
        title: newsTitle,
        body: newsBody,
        mediaUrl: finalMediaUrl,
        date: newsPublishDate || todayStr,
        fileType: determinedFileType,
        category: newsCategory,
        isFeatured: isFeatured,
        readTime: readTime || '4 min read',
        author: 'Joy Fast Fly Admin',
        highlights: newsShortDescription ? [newsShortDescription] : []
      };

      // Save to Supabase if available
      if (supabase) {
        supabase
          .from('news')
          .insert([{
            ...newPost,
            highlights: JSON.stringify(newPost.highlights),
            studentDetails: JSON.stringify(newPost.studentDetails || {})
          }])
          .then(({ error }) => {
            if (error) console.error('Error saving news to Supabase:', error);
          });
      }

      setPosts(prev => [newPost, ...prev]);
      alert('News published successfully!');
    } else if (newsSubView === 'edit' && editingPostId) {
      // Edit news post
      const updatedPostData: any = {
        title: newsTitle,
        body: newsBody,
        category: newsCategory,
        date: newsPublishDate,
        isFeatured: isFeatured,
        readTime: readTime,
        highlights: newsShortDescription ? [newsShortDescription] : [],
        fileType: determinedFileType,
        mediaUrl: finalMediaUrl
      };

      // Save to Supabase if available
      if (supabase) {
        supabase
          .from('news')
          .update({
            ...updatedPostData,
            highlights: JSON.stringify(updatedPostData.highlights),
            studentDetails: JSON.stringify(updatedPostData.studentDetails || {})
          })
          .eq('id', editingPostId)
          .then(({ error }) => {
            if (error) console.error('Error updating news in Supabase:', error);
          });
      }

      setPosts(prev => prev.map(post => {
        if (post.id === editingPostId) {
          return {
            ...post,
            ...updatedPostData
          };
        }
        return post;
      }));
      alert('News post updated successfully!');
    }

    // Reset Form
    resetNewsForm();
    setNewsSubView('list');
  };

  const startEditNews = (post: NewsPost) => {
    setEditingPostId(post.id || null);
    setNewsTitle(post.title);
    setNewsBody(post.body);
    setNewsCategory(post.category);
    setNewsShortDescription(post.highlights && post.highlights[0] ? post.highlights[0] : '');
    setIsFeatured(post.isFeatured || false);
    setReadTime(post.readTime || '3 min read');
    setNewsPublishDate(post.date);
    if (post.fileType === 'video') {
      setNewsVideoUrl(post.mediaUrl);
      setNewsFileUrl('');
    } else {
      setNewsFileUrl(post.mediaUrl);
      setNewsVideoUrl('');
    }
    setNewsSubView('edit');
  };

  const deleteNews = (id: string | undefined) => {
    if (!id) return;
    requestConfirm(
      'Delete News Post',
      'Are you sure you want to delete this news post? This action cannot be undone.',
      () => {
        // Delete from Supabase if available
        if (supabase) {
          supabase
            .from('news')
            .delete()
            .eq('id', id)
            .then(({ error }) => {
              if (error) console.error('Error deleting news from Supabase:', error);
            });
        }
        setPosts(prev => prev.filter(post => post.id !== id));
      }
    );
  };

  const resetNewsForm = () => {
    setNewsTitle('');
    setNewsBody('');
    setNewsFile(null);
    setNewsFileUrl('');
    setNewsVideoUrl('');
    setNewsCategory('Student Visa');
    setNewsCountry('Cyprus');
    setNewsStatus('Published');
    setNewsTags('');
    setNewsPublishDate('');
    setNewsShortDescription('');
    setIsFeatured(false);
    setReadTime('3 min read');
    setEditingPostId(null);
  };

  // Inquiry actions
  const deleteInquiry = async (id: string) => {
    requestConfirm(
      'Delete Record',
      'Are you sure you want to delete this record? This will permanently remove it from both the website and the Supabase database.',
      async () => {
        if (supabase) {
          try {
            const { error } = await supabase.from('inquiries').delete().eq('id', id);
            if (error) {
              console.error('Error deleting from supabase:', error);
              alert('Supabase database error: ' + error.message);
            }
          } catch (error) {
            console.error('Error deleting from supabase:', error);
          }
        }

        const updated = inquiries.filter(item => item.id !== id);
        setInquiries(updated);
        localStorage.setItem('joyfastfly_inquiries', JSON.stringify(updated));

        // Dual-sync deletion with applications
        const savedAppsStr = localStorage.getItem('joyfastfly_apps');
        if (savedAppsStr) {
          try {
            const currentApps = JSON.parse(savedAppsStr);
            const updatedApps = currentApps.filter((item: any) => item.id !== id);
            setApplications(updatedApps);
            localStorage.setItem('joyfastfly_apps', JSON.stringify(updatedApps));
          } catch (e) {}
        } else {
          setApplications(prev => prev.filter(item => item.id !== id));
        }

        alert('Deleted successfully! The entry has been removed from the website dashboard and the database.');
      }
    );
  };

  const handleClearAllInquiries = async () => {
    requestConfirm(
      'Delete All Inquiries',
      'Are you sure you want to permanently delete ALL inquiries/registrations? This will clear them from both Supabase database and local storage.',
      async () => {
        if (supabase) {
          try {
            const { error } = await supabase
              .from('inquiries')
              .delete()
              .neq('id', '');
            if (error) {
              console.error('Error deleting all inquiries from Supabase:', error);
              alert('Supabase error: ' + error.message);
            }
          } catch (err) {
            console.error('Failed to clear Supabase inquiries:', err);
          }
        }
        localStorage.removeItem('joyfastfly_inquiries');
        
        // Also clear applications that came from inquiries
        const savedAppsStr = localStorage.getItem('joyfastfly_apps');
        if (savedAppsStr) {
          try {
            const currentApps = JSON.parse(savedAppsStr);
            const updatedApps = currentApps.filter((item: any) => !item.id.startsWith('JFF-REG'));
            setApplications(updatedApps);
            localStorage.setItem('joyfastfly_apps', JSON.stringify(updatedApps));
          } catch (e) {}
        } else {
          setApplications([]);
        }
        
        setInquiries([]);
        alert('All inquiries/registrations have been successfully deleted!');
      }
    );
  };

  const updateInquiryStatus = async (id: string, newStatus: any) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .update({ status: newStatus })
          .eq('id', id);
        if (error) {
          console.error('Error updating status in Supabase:', error);
        }
      } catch (e) {
        console.error('Failed to update status in Supabase', e);
      }
    }

    const updated = inquiries.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setInquiries(updated);
    localStorage.setItem('joyfastfly_inquiries', JSON.stringify(updated));
  };

  // Country admin actions
  const handleAddCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryName || !newCountryCode) return;
    
    const countryId = newCountryName.toLowerCase().trim().replace(/\s+/g, '-');
    
    const newCountry: CountryInfo = {
      id: countryId,
      name: newCountryName,
      code: newCountryCode.toUpperCase(),
      flagUrl: `https://flagcdn.com/w320/${newCountryCode.toLowerCase()}.png`,
      bgImage: newCountryBgImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200',
      highlights: newCountryHighlights ? newCountryHighlights.split(',').map(s => s.trim()).filter(Boolean) : ['Added from admin panel'],
      intakes: [newCountryIntake || '2 - 3 Months'],
      requirements: {
        education: newCountryEducation || 'Contact office for details',
        ielts: newCountryIelts || 'No IELTS Required',
        funds: newCountryFunds || 'Contact office for details'
      },
      popularCourses: newCountryCourses ? newCountryCourses.split(',').map(s => s.trim()).filter(Boolean) : [],
      tuitionFee: newCountryTuition || 'Contact office for details',
      visaType: newCountryVisaType,
      isActive: newCountryStatus === 'Active'
    };
    
    const saved = localStorage.getItem('joyfastfly_countries_added');
    const added: CountryInfo[] = saved ? JSON.parse(saved) : [];
    
    const updatedAdded = [...added.filter(c => c.id.toLowerCase() !== countryId), newCountry];
    localStorage.setItem('joyfastfly_countries_added', JSON.stringify(updatedAdded));
    
    // Save to Supabase if available
    if (supabase) {
      supabase
        .from('countries')
        .insert([{
          ...newCountry,
          highlights: JSON.stringify(newCountry.highlights),
          intakes: JSON.stringify(newCountry.intakes),
          requirements: JSON.stringify(newCountry.requirements),
          popularCourses: JSON.stringify(newCountry.popularCourses)
        }])
        .then(({ error }) => {
          if (error) console.error('Error saving country to Supabase:', error);
        });
    }

    setNewCountryName('');
    setNewCountryCode('');
    setNewCountryHighlights('');
    setNewCountryTuition('');
    setNewCountryEducation('');
    setNewCountryIelts('No IELTS Required');
    setNewCountryFunds('');
    setNewCountryCourses('');
    setNewCountryBgImage('');
    setShowAddCountryModal(false);
    
    fetchCountries();
  };

  const deleteCountry = (id: string) => {
    const defaultIds = COUNTRIES.map(c => c.id.toLowerCase());
    if (defaultIds.includes(id.toLowerCase())) {
      alert('Cannot delete system default countries. You can toggle their active status instead.');
      return;
    }
    
    requestConfirm(
      'Delete Country',
      'Are you sure you want to delete this custom added country from the directory?',
      () => {
        // Delete from Supabase if available
        if (supabase) {
          supabase
            .from('countries')
            .delete()
            .eq('id', id)
            .then(({ error }) => {
              if (error) console.error('Error deleting country from Supabase:', error);
            });
        }

        const saved = localStorage.getItem('joyfastfly_countries_added');
        const added: CountryInfo[] = saved ? JSON.parse(saved) : [];
        const updated = added.filter(item => item.id.toLowerCase() !== id.toLowerCase());
        localStorage.setItem('joyfastfly_countries_added', JSON.stringify(updated));
        
        const overridesSaved = localStorage.getItem('joyfastfly_countries_status_override');
        if (overridesSaved) {
          try {
            const overrides = JSON.parse(overridesSaved);
            delete overrides[id.toLowerCase()];
            localStorage.setItem('joyfastfly_countries_status_override', JSON.stringify(overrides));
          } catch (e) {
            console.error(e);
          }
        }
        
        fetchCountries();
      }
    );
  };

  const toggleCountryStatus = (id: string) => {
    const countryId = id.toLowerCase();
    const overridesSaved = localStorage.getItem('joyfastfly_countries_status_override');
    const overrides: Record<string, boolean> = overridesSaved ? JSON.parse(overridesSaved) : {};
    
    const currentList = getMergedCountries(true);
    const country = currentList.find(c => c.id.toLowerCase() === countryId);
    if (!country) return;
    
    const newActiveState = !(country.isActive !== false);
    overrides[countryId] = newActiveState;
    localStorage.setItem('joyfastfly_countries_status_override', JSON.stringify(overrides));
    
    const saved = localStorage.getItem('joyfastfly_countries_added');
    if (saved) {
      try {
        const added: CountryInfo[] = JSON.parse(saved);
        const updatedAdded = added.map(c => {
          if (c.id.toLowerCase() === countryId) {
            return { ...c, isActive: newActiveState };
          }
          return c;
        });
        localStorage.setItem('joyfastfly_countries_added', JSON.stringify(updatedAdded));
      } catch (e) {
        console.error(e);
      }
    }
    
    fetchCountries();
  };

  // Story actions
  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryName) return;
    const newItem: SuccessStory = {
      id: String(Date.now()),
      name: newStoryName,
      country: newStoryCountry,
      visaType: newStoryVisaType,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      status: newStoryStatus,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const updated = [newItem, ...successStories];
    setSuccessStories(updated);
    localStorage.setItem('joyfastfly_stories', JSON.stringify(updated));

    // Save to Supabase if available
    if (supabase) {
      supabase
        .from('success_stories')
        .insert([newItem])
        .then(({ error }) => {
          if (error) console.error('Error saving success story to Supabase:', error);
        });
    }

    setNewStoryName('');
    setShowAddStoryModal(false);
  };

  const deleteStory = (id: string) => {
    requestConfirm(
      'Delete Success Story',
      'Are you sure you want to delete this success story?',
      () => {
        // Delete from Supabase if available
        if (supabase) {
          supabase
            .from('success_stories')
            .delete()
            .eq('id', id)
            .then(({ error }) => {
              if (error) console.error('Error deleting success story from Supabase:', error);
            });
        }
        const updated = successStories.filter(item => item.id !== id);
        setSuccessStories(updated);
        localStorage.setItem('joyfastfly_stories', JSON.stringify(updated));
      }
    );
  };

  // Application actions
  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName) return;
    const newItem: ApplicationItem = {
      id: String(Date.now()),
      name: newAppName,
      country: newAppCountry,
      visaType: newAppVisaType,
      status: newAppStatus,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const updated = [newItem, ...applications];
    setApplications(updated);
    localStorage.setItem('joyfastfly_apps', JSON.stringify(updated));
    setNewAppName('');
    setAppSubView('list');
    setShowAddAppModal(false);
  };

  const updateAppStatus = (id: string, newStatus: any) => {
    const updated = applications.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setApplications(updated);
    localStorage.setItem('joyfastfly_apps', JSON.stringify(updated));

    // Also update inquiry if synced
    if (id.includes('JFF-REG')) {
      updateInquiryStatus(id, newStatus);
    }
  };

  const deleteApp = async (id: string) => {
    requestConfirm(
      'Delete Application',
      'Are you sure you want to delete this application? This will permanently remove it from both the website and the Supabase database.',
      async () => {
        if (id.includes('JFF-REG') && supabase) {
          try {
            const { error } = await supabase.from('inquiries').delete().eq('id', id);
            if (error) {
              console.error('Error deleting from supabase via deleteApp:', error);
            }
          } catch (error) {
            console.error('Error in deleteApp Supabase connection:', error);
          }
        }

        const updated = applications.filter(item => item.id !== id);
        setApplications(updated);
        localStorage.setItem('joyfastfly_apps', JSON.stringify(updated));

        // Also delete from inquiries if synced
        if (id.includes('JFF-REG')) {
          const savedInq = localStorage.getItem('joyfastfly_inquiries');
          if (savedInq) {
            try {
              const localInqs = JSON.parse(savedInq);
              const filteredInqs = localInqs.filter((item: any) => item.id !== id);
              setInquiries(filteredInqs);
              localStorage.setItem('joyfastfly_inquiries', JSON.stringify(filteredInqs));
            } catch (e) {}
          }
        }

        alert('Deleted successfully! The entry has been removed from the website dashboard and the database.');
      }
    );
  };

  const handleLogout = () => {
    setAdminUnlocked(false);
    localStorage.removeItem('admin_unlocked');
    setAdminPassword('');
    setSection('home');
  };

  // Sidebar List
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'news', label: 'News & Updates', icon: FileText },
    { id: 'countries', label: 'Countries Directory', icon: Globe },
    { id: 'stories', label: 'Success Stories', icon: Award },
    { id: 'applications', label: 'Applications', icon: FileSpreadsheet },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox },
    { id: 'pdfs', label: 'Country PDFs', icon: Upload },
    { id: 'assets', label: 'Website Assets', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col md:flex-row text-slate-800 font-sans" id="admin-panel-container">
      
      {/* 1. PASSWORD LOCK / SIGN IN SCREEN */}
      {!adminUnlocked ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-900 min-h-screen relative overflow-hidden">
          {/* Subtle design accents in background */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          <div className="bg-slate-850/90 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl max-w-md w-full relative z-10 text-center flex flex-col items-center">
            <JtecLogo inverted className="mb-6 scale-110" />
            
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 text-[#da1e28]">
              <Lock size={28} />
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Admin Workspace</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Sign in with your admin credentials to access the workspace.
            </p>

            <form onSubmit={handleAdminUnlock} className="w-full flex flex-col gap-4">
              <input 
                type="email"
                required
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3.5 bg-slate-800 text-white font-medium placeholder:text-slate-500"
              />
              <input 
                type="password"
                required
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3.5 bg-slate-800 text-white font-medium placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-[#da1e28] text-white font-black rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-lg shadow-red-600/20"
              >
                <Unlock size={16} />
                Unlock Dashboard
              </button>

              {adminError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold mt-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}
            </form>

            <button 
              onClick={() => setSection('home')} 
              className="text-slate-400 hover:text-white font-semibold text-xs tracking-wider uppercase mt-8 transition-colors"
            >
              ← Back to Main Website
            </button>
          </div>
        </div>
      ) : (
        
        // 2. STUNNING MULTI-TAB DASHBOARD WORKSPACE (99% Match with Uploaded Design)
        <div className="flex-grow flex flex-col md:flex-row min-h-screen">
          
          {/* SIDEBAR */}
          <aside className={`w-72 bg-[#0c1a30] shrink-0 text-white flex flex-col border-r border-slate-800 min-h-screen md:sticky md:top-0 z-30 transition-transform md:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0 shadow-2xl' : '-translate-x-full fixed inset-y-0 left-0 md:relative'}`}>
            
            {/* BRAND HEADER */}
            <div className="h-20 px-6 border-b border-slate-800/80 flex items-center justify-between">
              <div className="cursor-pointer" onClick={() => setSection('home')}>
                <JtecLogo inverted className="scale-95 origin-left" />
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden p-1 bg-slate-800 rounded-lg hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            {/* SIDEBAR NAVIGATION ITEMS */}
            <nav className="flex-grow py-6 px-4 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                      if (item.id === 'news') {
                        setNewsSubView('list');
                      }
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-tight text-left transition-all ${
                      isActive 
                        ? 'bg-[#da1e28] text-white shadow-md shadow-red-900/10' 
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    <IconComponent size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* LOGOUT FOOTER */}
            <div className="p-4 border-t border-slate-800/80">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-tight text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* OVERLAY FOR MOBILE SIDEBAR */}
          {mobileSidebarOpen && (
            <div 
              onClick={() => setMobileSidebarOpen(false)} 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-20 md:hidden"
            />
          )}

          {/* RIGHT MAIN WORKSPACE */}
          <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
            
            {/* WORKSPACE HEADER BAR */}
            <header className="h-20 bg-white border-b border-gray-150 flex items-center justify-between px-6 md:px-8 shrink-0 select-none">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setMobileSidebarOpen(true)} 
                  className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Menu size={22} />
                </button>
                <h1 className="text-xl font-extrabold text-blue-950 capitalize tracking-tight flex items-center gap-2">
                  <span>
                    {activeTab === 'news' ? (
                      newsSubView === 'details' ? 'News Details' : 
                      newsSubView === 'add' ? 'Add News' :
                      newsSubView === 'edit' ? 'Edit News' : 'News & Updates'
                    ) : activeTab}
                  </span>
                </h1>
                <a 
                  href="https://joyfastfly.vercel.app/admin" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 hover:bg-blue-100 transition-all ml-2"
                >
                  <Globe size={12} />
                  Main Admin Panel
                </a>
              </div>

              {/* RIGHT HEADER CONTROLS */}
              <div className="flex items-center gap-5">
                <button 
                  onClick={handleClearAllData}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider bg-white text-slate-700 hover:bg-slate-50 hover:text-[#da1e28] transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Clear All Database Data & Reset Metrics to 0"
                >
                  <Trash2 size={13} />
                  <span>Reset All (০ করুন)</span>
                </button>

                <button 
                  onClick={handleFullRefresh}
                  disabled={isRefreshing}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all ${
                    isRefreshing 
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-[#da1e28] text-white border-transparent hover:bg-red-700 active:scale-95 cursor-pointer shadow-sm shadow-red-600/10'
                  }`}
                  title="Full Refresh Database & Local Sync"
                >
                  <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>{isRefreshing ? 'Refreshed' : 'Full Sync'}</span>
                </button>

                <button className="text-slate-500 hover:text-slate-800 transition-colors hidden sm:block">
                  <Globe size={18} />
                </button>
                <div className="relative">
                  <button className="text-slate-500 hover:text-[#da1e28] transition-colors relative p-1.5 hover:bg-slate-50 rounded-full">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#da1e28] text-white text-[9px] font-black rounded-full flex items-center justify-center">5</span>
                  </button>
                </div>

                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                {/* USER PROFILE INFO */}
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-blue-100 border border-slate-200 rounded-full overflow-hidden shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120" 
                      alt="Admin" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left leading-tight hidden sm:block">
                    <div className="font-extrabold text-slate-900 text-sm">Admin</div>
                    <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Administrator</div>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </div>
              </div>
            </header>

            {/* DYNAMIC CONTENT SPACE */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  
                  {/* HERO HEADER & ACTION */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-left">
                      <h2 className="text-2xl font-black text-blue-950 tracking-tight">Good Evening, Admin! 👋</h2>
                      <p className="text-sm font-bold text-gray-400 mt-1">Welcome back to Joy Fast Fly Admin Panel</p>
                    </div>
                    <button 
                      onClick={() => {
                        setActiveTab('news');
                        setNewsSubView('add');
                      }}
                      className="bg-[#da1e28] hover:bg-red-700 text-white font-black text-sm px-5 py-3 rounded-xl shadow-lg shadow-red-600/10 transition-all flex items-center justify-center gap-2 uppercase tracking-wide shrink-0"
                    >
                      <Plus size={16} />
                      Add News
                    </button>
                  </div>

                  {/* STATS CARDS GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {/* STAT CARD 1: Total News */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                        <FileText size={22} />
                      </div>
                      <div className="leading-tight">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider">Total News</div>
                        <div className="text-2xl font-black text-blue-950 mt-1">{posts.length}</div>
                        <button onClick={() => { setActiveTab('news'); setNewsSubView('list'); }} className="text-[10px] font-black text-blue-600 hover:underline mt-1.5 block uppercase tracking-wide">
                          View all news
                        </button>
                      </div>
                    </div>

                    {/* STAT CARD 2: Success Stories */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                        <Award size={22} />
                      </div>
                      <div className="leading-tight">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider">Success Stories</div>
                        <div className="text-2xl font-black text-blue-950 mt-1">{successStories.length}</div>
                        <button onClick={() => setActiveTab('stories')} className="text-[10px] font-black text-emerald-600 hover:underline mt-1.5 block uppercase tracking-wide">
                          View all stories
                        </button>
                      </div>
                    </div>

                    {/* STAT CARD 3: Applications */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                        <FileSpreadsheet size={22} />
                      </div>
                      <div className="leading-tight">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider">Applications</div>
                        <div className="text-2xl font-black text-blue-950 mt-1">{applications.length}</div>
                        <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-amber-600 hover:underline mt-1.5 block uppercase tracking-wide">
                          View all apps
                        </button>
                      </div>
                    </div>

                    {/* STAT CARD 4: Inquiries */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 shrink-0">
                        <Inbox size={22} />
                      </div>
                      <div className="leading-tight">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider">Inquiries</div>
                        <div className="text-2xl font-black text-blue-950 mt-1">{inquiries.length}</div>
                        <button onClick={() => setActiveTab('inquiries')} className="text-[10px] font-black text-teal-600 hover:underline mt-1.5 block uppercase tracking-wide">
                          View all inquiries
                        </button>
                      </div>
                    </div>

                    {/* STAT CARD 5: Visitors Today */}
                    <div className="bg-white rounded-3xl p-5 border border-gray-150/80 shadow-xs flex items-center gap-4 text-left">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 shrink-0">
                        <Eye size={22} />
                      </div>
                      <div className="leading-tight">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-wider">Visitors Today</div>
                        <div className="text-2xl font-black text-blue-950 mt-1">{visitorsCount}</div>
                        <span className="text-[10px] font-black text-pink-600 mt-1.5 block uppercase tracking-wide select-none">
                          View all visitors
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* 3-COLUMN CONTENT GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Latest News card */}
                    <div className="bg-white rounded-3xl border border-gray-150/80 p-6 shadow-xs flex flex-col text-left">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                        <h3 className="font-black text-blue-950 text-base">Latest News</h3>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#da1e28]"></span>
                      </div>
                      <div className="flex flex-col gap-4 flex-grow">
                        {posts.slice(0, 4).map((post, i) => (
                          <div key={post.id || i} className="flex items-start gap-3 hover:bg-slate-50 p-1 rounded-lg transition-colors cursor-pointer" onClick={() => { setActiveTab('news'); setNewsSubView('list'); }}>
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></div>
                            <div className="leading-snug">
                              <div className="font-extrabold text-blue-950 text-sm line-clamp-2 hover:text-[#da1e28] transition-colors">{post.title}</div>
                              <div className="text-xs text-gray-400 font-semibold mt-1">{post.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => { setActiveTab('news'); setNewsSubView('list'); }}
                        className="text-xs font-extrabold text-[#da1e28] hover:underline mt-6 flex items-center gap-1.5 w-fit"
                      >
                        View all news →
                      </button>
                    </div>

                    {/* Recent Applications card */}
                    <div className="bg-white rounded-3xl border border-gray-150/80 p-6 shadow-xs flex flex-col text-left">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                        <h3 className="font-black text-blue-950 text-base">Recent Applications</h3>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="flex flex-col gap-4.5 flex-grow">
                        {applications.slice(0, 4).map((app) => (
                          <div key={app.id} className="flex items-center justify-between">
                            <div className="leading-snug">
                              <div className="font-extrabold text-slate-950 text-sm">{app.name}</div>
                              <div className="text-xs text-gray-400 font-semibold mt-0.5">{app.country} • {app.visaType}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                app.status === 'New' ? 'bg-emerald-100 text-emerald-800' :
                                app.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                                app.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {app.status}
                              </span>
                              <span className="text-[10px] text-gray-400 font-semibold">{app.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setActiveTab('applications')}
                        className="text-xs font-extrabold text-[#da1e28] hover:underline mt-6 flex items-center gap-1.5 w-fit"
                      >
                        View all applications →
                      </button>
                    </div>

                    {/* Recent Inquiries card */}
                    <div className="bg-white rounded-3xl border border-gray-150/80 p-6 shadow-xs flex flex-col text-left">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                        <h3 className="font-black text-blue-950 text-base">Recent Inquiries</h3>
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                      </div>
                      <div className="flex flex-col gap-4.5 flex-grow">
                        {inquiries.slice(0, 4).map((inq) => (
                          <div key={inq.id} className="flex items-center justify-between">
                            <div className="leading-snug">
                              <div className="font-extrabold text-slate-950 text-sm">{inq.name}</div>
                              <div className="text-xs text-gray-400 font-semibold mt-0.5">{inq.visaType === 'work' ? 'Work Permit' : 'Student Visa'} - {inq.destination}</div>
                            </div>
                            <span className="text-[10px] text-gray-400 font-semibold shrink-0">{inq.date}</span>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => setActiveTab('inquiries')}
                        className="text-xs font-extrabold text-[#da1e28] hover:underline mt-6 flex items-center gap-1.5 w-fit"
                      >
                        View all inquiries →
                      </button>
                    </div>

                    
                  </div>

                </div>
              )}

              {/* TAB 2: NEWS & UPDATES (ALL NEWS & ADD NEWS VIEWS) */}
              {activeTab === 'news' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  {isUploading && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 animate-pulse mb-4">
                      <RefreshCw className="animate-spin text-blue-600" size={20} />
                      <span className="text-blue-700 font-bold">Uploading media to Supabase Storage...</span>
                    </div>
                  )}
                  
                  {/* subview 1: ALL NEWS LIST */}
                  {newsSubView === 'list' && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Title & Breadcrumbs & Add Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-black text-blue-950">All News</h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / News & Updates / All News
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            resetNewsForm();
                            setNewsSubView('add');
                          }}
                          className="bg-[#da1e28] hover:bg-red-700 text-white font-black text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide shrink-0"
                        >
                          <Plus size={16} />
                          Add News
                        </button>
                      </div>

                      {/* SEARCH & FILTERS BAR */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text"
                            placeholder="Search news..."
                            value={newsSearch}
                            onChange={(e) => setNewsSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                          <select 
                            value={newsCatFilter}
                            onChange={(e) => setNewsCatFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold w-full sm:w-44 focus:outline-hidden"
                          >
                            <option>All Categories</option>
                            <option>Student Visa</option>
                            <option>Work Permit</option>
                            <option>Visa Update</option>
                            <option>Embassy Notice</option>
                            <option>Success Story</option>
                            <option>Admission</option>
                            <option>Scholarship</option>
                          </select>

                          <select 
                            value={newsStatusFilter}
                            onChange={(e) => setNewsStatusFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold w-full sm:w-40 focus:outline-hidden"
                          >
                            <option>All Status</option>
                            <option>Published</option>
                            <option>Draft</option>
                          </select>

                          <button className="bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto">
                            <Filter size={16} />
                            Filter
                          </button>
                        </div>
                      </div>

                      {/* NEWS POSTS TABLE */}
                      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500 select-none">
                                <th className="px-6 py-4.5">#</th>
                                <th className="px-6 py-4.5">Title</th>
                                <th className="px-6 py-4.5">Category</th>
                                <th className="px-6 py-4.5">Country</th>
                                <th className="px-6 py-4.5">Status</th>
                                <th className="px-6 py-4.5">Date</th>
                                <th className="px-6 py-4.5 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-semibold text-slate-800">
                              {posts
                                .filter(post => {
                                  const matchesSearch = post.title.toLowerCase().includes(newsSearch.toLowerCase()) || 
                                                        post.body.toLowerCase().includes(newsSearch.toLowerCase());
                                  const matchesCat = newsCatFilter === 'All Categories' || post.category === newsCatFilter;
                                  const matchesStatus = newsStatusFilter === 'All Status' || 
                                                        (newsStatusFilter === 'Published' && !post.isFeatured) || // approximation
                                                        (newsStatusFilter === 'Draft' && post.isFeatured); // approximation
                                  return matchesSearch && matchesCat;
                                })
                                .map((post, idx) => (
                                  <tr key={post.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4.5 text-gray-400 font-extrabold">{idx + 1}</td>
                                    <td className="px-6 py-4.5">
                                      <div className="flex items-center gap-3 max-w-sm">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                                          {post.fileType === 'video' ? (
                                            <div className="w-full h-full bg-slate-950 flex items-center justify-center text-white text-[9px] font-black">VID</div>
                                          ) : (
                                            <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                                          )}
                                        </div>
                                        <span className="font-extrabold text-blue-950 line-clamp-2">{post.title}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4.5">
                                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold">
                                        {post.category}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4.5 text-slate-600">Cyprus</td>
                                    <td className="px-6 py-4.5">
                                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        Published
                                      </span>
                                    </td>
                                    <td className="px-6 py-4.5 text-gray-400 font-bold">{post.date}</td>
                                    <td className="px-6 py-4.5 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button 
                                          onClick={() => {
                                            setViewingPostId(post.id || null);
                                            setNewsSubView('details');
                                          }}
                                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                          title="View News Details"
                                        >
                                          <Eye size={16} />
                                        </button>
                                        <button 
                                          onClick={() => startEditNews(post)}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Edit News"
                                        >
                                          <Edit size={16} />
                                        </button>
                                        <button 
                                          onClick={() => deleteNews(post.id)}
                                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete News"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Bar */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-bold">Showing 1 to {posts.length} entries</span>
                          <div className="flex items-center gap-1">
                            <button className="px-2.5 py-1 text-xs font-bold text-gray-400 bg-white border border-gray-200 rounded-md">&lt;</button>
                            <button className="px-3 py-1 text-xs font-black text-white bg-[#da1e28] rounded-md">1</button>
                            <button className="px-3 py-1 text-xs font-bold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-md">2</button>
                            <button className="px-2.5 py-1 text-xs font-bold text-gray-400 bg-white border border-gray-200 rounded-md">&gt;</button>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* subview 4: DETAILS VIEW */}
                  {newsSubView === 'details' && viewingPostId && (
                    <div className="flex flex-col gap-6">
                      
                      {/* Breadcrumbs */}
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2">
                        <button onClick={() => setNewsSubView('list')} className="hover:text-blue-600 transition-colors">Dashboard</button>
                        <ChevronDown className="-rotate-90" size={12} />
                        <button onClick={() => setNewsSubView('list')} className="hover:text-blue-600 transition-colors">News & Updates</button>
                        <ChevronDown className="-rotate-90" size={12} />
                        <button onClick={() => setNewsSubView('list')} className="hover:text-blue-600 transition-colors">All News</button>
                        <ChevronDown className="-rotate-90" size={12} />
                        <span className="text-gray-800">News Details</span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* LEFT COLUMN: MAIN CONTENT */}
                        <div className="flex-1 w-full bg-white rounded-3xl border border-gray-150 shadow-xs p-6 md:p-8">
                          {(() => {
                            const post = posts.find(p => p.id === viewingPostId);
                            if (!post) return <div className="text-slate-500">Post not found.</div>;
                            return (
                              <>
                                <div className="mb-4">
                                  <span className="bg-blue-100 text-blue-600 font-black uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-full inline-block">
                                    VISA UPDATE
                                  </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-blue-950 mb-6 leading-tight tracking-tight">
                                  {post.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 mb-8 border-b border-gray-100 pb-6">
                                  <div className="flex items-center gap-1.5 text-slate-600">
                                    <Calendar size={16} className="text-gray-400" /> {post.date}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-slate-600">
                                    <Clock size={16} className="text-gray-400" /> {post.readTime || '5 min read'}
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120" className="w-6 h-6 rounded-full border border-gray-200" alt="Author" /> 
                                    By {post.author || 'Joy Fast Fly Admin'}
                                  </div>
                                </div>
                                
                                {post.mediaUrl && (
                                  <div className="rounded-2xl overflow-hidden mb-8 max-h-[500px]">
                                    <img src={post.mediaUrl} className="w-full h-full object-cover" alt="News cover" />
                                  </div>
                                )}

                                <div className="prose prose-sm md:prose-base max-w-none text-slate-700 font-medium leading-relaxed mb-8 whitespace-pre-wrap">
                                  {post.body}
                                </div>

                                {/* Mocked Extra Sections to match the design exactly */}
                                <div className="mb-8">
                                  <h3 className="font-black text-lg text-blue-950 mb-3">Key Highlights:</h3>
                                  <ul className="flex flex-col gap-2">
                                    <li className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                                      <CheckCircle size={18} fill="currentColor" stroke="white" className="text-blue-600 shrink-0 mt-0.5" />
                                      Affordable tuition fees
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                                      <CheckCircle size={18} fill="currentColor" stroke="white" className="text-blue-600 shrink-0 mt-0.5" />
                                      Wide opportunity while studying
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                                      <CheckCircle size={18} fill="currentColor" stroke="white" className="text-blue-600 shrink-0 mt-0.5" />
                                      Post study work visa available
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                                      <CheckCircle size={18} fill="currentColor" stroke="white" className="text-blue-600 shrink-0 mt-0.5" />
                                      High visa success rate
                                    </li>
                                    <li className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                                      <CheckCircle size={18} fill="currentColor" stroke="white" className="text-blue-600 shrink-0 mt-0.5" />
                                      Easy admission process
                                    </li>
                                  </ul>
                                </div>

                                <div className="mb-8">
                                  <h3 className="font-black text-lg text-blue-950 mb-4">Important Dates:</h3>
                                  <div className="border border-gray-150 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                      <tbody className="divide-y divide-gray-150">
                                        <tr>
                                          <td className="px-5 py-3.5 font-bold text-slate-700 bg-slate-50 border-r border-gray-150 w-1/2">Application Start Date</td>
                                          <td className="px-5 py-3.5 font-semibold text-slate-600 w-1/2 bg-white">10 July 2026</td>
                                        </tr>
                                        <tr>
                                          <td className="px-5 py-3.5 font-bold text-slate-700 bg-slate-50 border-r border-gray-150">Application Deadline</td>
                                          <td className="px-5 py-3.5 font-semibold text-slate-600 bg-white">30 September 2026</td>
                                        </tr>
                                        <tr>
                                          <td className="px-5 py-3.5 font-bold text-slate-700 bg-slate-50 border-r border-gray-150">Interview Date</td>
                                          <td className="px-5 py-3.5 font-semibold text-slate-600 bg-white">05 October 2026</td>
                                        </tr>
                                        <tr>
                                          <td className="px-5 py-3.5 font-bold text-slate-700 bg-slate-50 border-r border-gray-150">Visa Processing Time</td>
                                          <td className="px-5 py-3.5 font-semibold text-slate-600 bg-white">4 - 6 Weeks</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="mb-8">
                                  <h3 className="font-black text-lg text-blue-950 mb-3">Documents Required:</h3>
                                  <ul className="flex flex-col gap-3">
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                      <FileText size={16} className="text-[#da1e28]" /> Academic Certificates
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                      <FileText size={16} className="text-[#da1e28]" /> Passport Copy
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                      <FileText size={16} className="text-[#da1e28]" /> Passport Size Photo
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                      <FileText size={16} className="text-[#da1e28]" /> Motivation Letter
                                    </li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                      <FileText size={16} className="text-[#da1e28]" /> Financial Documents
                                    </li>
                                  </ul>
                                </div>

                                {/* Bottom Tags */}
                                <div className="pt-6 border-t border-gray-100">
                                  <h3 className="font-black text-blue-950 text-sm mb-3">Tags:</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {['#Romania', '#Student Visa', '#Intake 2026', '#Visa Update', '#Study Abroad'].map((tag, i) => (
                                      <span key={i} className="px-3 py-1.5 border border-gray-200 bg-white text-slate-600 rounded-lg text-xs font-bold">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* RIGHT COLUMN: ACTIONS & METADATA */}
                        {(() => {
                          const post = posts.find(p => p.id === viewingPostId);
                          if (!post) return null;
                          return (
                            <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5">
                              
                              {/* Top Actions */}
                              <div className="flex items-center gap-2">
                                <button className="flex-1 py-3 border border-gray-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-black text-slate-700 flex justify-center items-center gap-2 transition-colors">
                                  <Eye size={16}/> Preview
                                </button>
                                <button 
                                  onClick={() => startEditNews(post)}
                                  className="flex-1 py-3 border border-gray-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-black text-slate-700 flex justify-center items-center gap-2 transition-colors"
                                >
                                  <Edit size={16}/> Edit
                                </button>
                                <button 
                                  onClick={() => {
                                    deleteNews(post.id);
                                    setNewsSubView('list');
                                  }}
                                  className="flex-1 py-3 bg-[#da1e28] hover:bg-red-700 rounded-xl text-xs font-black text-white flex justify-center items-center gap-2 transition-colors shadow-sm shadow-red-600/20"
                                >
                                  <Trash2 size={16}/> Delete
                                </button>
                              </div>

                              {/* Publish Information */}
                              <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6">
                                <h3 className="font-black text-blue-950 text-sm mb-5">Publish Information</h3>
                                <div className="flex flex-col gap-4 text-xs">
                                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                    <span className="font-bold text-slate-500">Status</span>
                                    <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-md">Published</span>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                    <span className="font-bold text-slate-500">Publish Date</span>
                                    <span className="font-extrabold text-blue-950">{post.date}</span>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                    <span className="font-bold text-slate-500">Publish Time</span>
                                    <span className="font-extrabold text-blue-950">10:30 AM</span>
                                  </div>
                                  <div className="flex justify-between items-center pb-1">
                                    <span className="font-bold text-slate-500">Last Updated</span>
                                    <span className="font-extrabold text-blue-950">{post.date}, 10:30 AM</span>
                                  </div>
                                </div>
                              </div>

                              {/* News Category */}
                              <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6">
                                <h3 className="font-black text-blue-950 text-sm mb-4">News Category</h3>
                                <span className="bg-blue-50 text-blue-700 border border-blue-100 font-extrabold px-3 py-1.5 text-xs rounded-lg inline-block">
                                  {post.category}
                                </span>
                              </div>

                              {/* Country */}
                              <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6">
                                <h3 className="font-black text-blue-950 text-sm mb-4">Country</h3>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-3.5 rounded-sm overflow-hidden shrink-0 border border-gray-200">
                                    <img src="https://flagcdn.com/w40/ro.png" className="w-full h-full object-cover" alt="Romania" />
                                  </div>
                                  <span className="text-sm font-extrabold text-slate-700">Romania</span>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6">
                                <h3 className="font-black text-blue-950 text-sm mb-4">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-3 py-1.5 border border-gray-200 text-slate-700 rounded-lg text-xs font-bold">Student Visa</span>
                                  <span className="px-3 py-1.5 border border-gray-200 text-slate-700 rounded-lg text-xs font-bold">Romania</span>
                                  <span className="px-3 py-1.5 border border-gray-200 text-slate-700 rounded-lg text-xs font-bold">Intake 2026</span>
                                  <span className="px-3 py-1.5 border border-gray-200 text-slate-700 rounded-lg text-xs font-bold">Visa Update</span>
                                </div>
                              </div>

                              {/* SEO Information */}
                              <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6">
                                <h3 className="font-black text-blue-950 text-sm mb-4">SEO Information</h3>
                                <div className="flex flex-col gap-4">
                                  <div>
                                    <div className="text-[10px] font-black uppercase text-slate-800 mb-2">Meta Title</div>
                                    <div className="border border-gray-200 rounded-xl p-3 text-xs font-semibold text-slate-700 bg-white shadow-sm">
                                      {post.title}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-black uppercase text-slate-800 mb-2">Meta Description</div>
                                    <div className="border border-gray-200 rounded-xl p-3 text-xs font-semibold text-slate-700 bg-white shadow-sm">
                                      {post.shortDescription || 'Apply for Romania Student Visa 2026 intake. Check fees, documents, deadlines and admission process.'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] font-black uppercase text-slate-800 mb-2">Slug</div>
                                    <div className="border border-gray-200 rounded-xl p-3 text-xs font-semibold text-slate-700 bg-white shadow-sm">
                                      {post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Featured Image */}
                              <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6">
                                <h3 className="font-black text-blue-950 text-sm mb-4">Featured Image</h3>
                                {post.mediaUrl ? (
                                  <div className="rounded-xl overflow-hidden mb-4 max-h-[160px] border border-gray-100">
                                    <img src={post.mediaUrl} className="w-full h-full object-cover" alt="Featured" />
                                  </div>
                                ) : (
                                  <div className="rounded-xl bg-slate-100 h-24 mb-4 flex items-center justify-center text-xs font-bold text-slate-400">
                                    No Image
                                  </div>
                                )}
                                <button className="w-full py-2.5 border border-gray-200 rounded-xl text-xs font-black text-slate-700 flex justify-center items-center gap-2 hover:bg-slate-50 transition-colors">
                                  <Upload size={16} /> Change Image
                                </button>
                              </div>

                              {/* Actions */}
                              <div className="bg-white rounded-3xl border border-gray-150 shadow-xs p-6">
                                <h3 className="font-black text-blue-950 text-sm mb-4">Actions</h3>
                                <div className="flex flex-col gap-2">
                                  <button className="w-full py-2.5 border border-gray-200 rounded-xl text-xs font-black text-blue-600 flex justify-center items-center gap-2 hover:bg-blue-50 transition-colors">
                                    <FileText size={16} /> Duplicate News
                                  </button>
                                  <button className="w-full py-2.5 border border-red-200 rounded-xl text-xs font-black text-[#da1e28] flex justify-center items-center gap-2 hover:bg-red-50 transition-colors">
                                    <Inbox size={16} /> Move to Draft
                                  </button>
                                </div>
                              </div>

                            </div>
                          );
                        })()}
                      </div>
                      
                      {/* Previous / Next Pagination at Bottom */}
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
                        <button className="flex-1 bg-white p-5 rounded-3xl border border-gray-150 shadow-xs hover:border-blue-200 transition-colors text-left group">
                          <div className="flex items-center gap-2 text-sm font-black text-blue-600 mb-1 group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft size={16} /> Previous News
                          </div>
                          <div className="text-xs font-extrabold text-slate-700">Cyprus Work Permit New Update</div>
                        </button>
                        <button className="flex-1 bg-white p-5 rounded-3xl border border-gray-150 shadow-xs hover:border-blue-200 transition-colors text-right group">
                          <div className="flex items-center justify-end gap-2 text-sm font-black text-blue-600 mb-1 group-hover:translate-x-1 transition-transform">
                            Next News <ArrowRight size={16} />
                          </div>
                          <div className="text-xs font-extrabold text-slate-700">Serbia Student Visa Processing Time Reduced</div>
                        </button>
                      </div>

                    </div>
                  )}

                  {/* subview 2 & 3: ADD OR EDIT NEWS FORM (Perfect visual identical layout) */}
                  {(newsSubView === 'add' || newsSubView === 'edit') && (
                    <div className="flex flex-col gap-6 max-w-4xl">
                      
                      {/* Header and Breadcrumbs */}
                      <div>
                        <h2 className="text-2xl font-black text-blue-950">
                          {newsSubView === 'add' ? 'Add News' : 'Edit News'}
                        </h2>
                        <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                          Dashboard / News & Updates / {newsSubView === 'add' ? 'Add News' : 'Edit News'}
                        </div>
                      </div>

                      {/* Main Form container */}
                      <form onSubmit={handlePostNews} className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Title input */}
                          <div className="flex flex-col gap-1 text-left md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Title</label>
                            <input 
                              type="text" 
                              placeholder="Enter news title"
                              value={newsTitle}
                              onChange={(e) => setNewsTitle(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:ring-1 focus:ring-[#da1e28] focus:outline-hidden"
                              required
                            />
                          </div>

                          {/* Status */}
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</label>
                            <select
                              value={newsStatus}
                              onChange={(e) => setNewsStatus(e.target.value as any)}
                              className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:outline-hidden"
                            >
                              <option value="Published">Published</option>
                              <option value="Draft">Draft</option>
                            </select>
                          </div>

                          {/* Category */}
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Category</label>
                            <select
                              value={newsCategory}
                              onChange={(e) => setNewsCategory(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:outline-hidden"
                            >
                              <option value="Student Visa">Student Visa</option>
                              <option value="Work Permit">Work Permit</option>
                              <option value="Visa Update">Visa Update</option>
                              <option value="Embassy Notice">Embassy Notice</option>
                              <option value="Success Story">Success Story</option>
                              <option value="Admission">Admission</option>
                              <option value="Scholarship">Scholarship</option>
                            </select>
                          </div>

                          {/* Country */}
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Country</label>
                            <select
                              value={newsCountry}
                              onChange={(e) => setNewsCountry(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:outline-hidden"
                            >
                              <option value="Cyprus">Cyprus</option>
                              <option value="Romania">Romania</option>
                              <option value="Serbia">Serbia</option>
                              <option value="Hungary">Hungary</option>
                              <option value="Italy">Italy</option>
                              <option value="Poland">Poland</option>
                              <option value="Malta">Malta</option>
                            </select>
                          </div>

                          {/* Publish Date */}
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Publish Date</label>
                            <input 
                              type="text" 
                              placeholder="dd/mm/yyyy"
                              value={newsPublishDate}
                              onChange={(e) => setNewsPublishDate(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:outline-hidden"
                            />
                          </div>

                          {/* Short Description */}
                          <div className="flex flex-col gap-1 text-left md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Short Description</label>
                            <textarea 
                              placeholder="Enter short description..."
                              value={newsShortDescription}
                              onChange={(e) => setNewsShortDescription(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold h-20 resize-none focus:border-[#da1e28] focus:outline-hidden"
                            />
                          </div>

                          {/* Reading time */}
                          <div className="flex flex-col gap-1 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Reading Time</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 5 min read"
                              value={readTime}
                              onChange={(e) => setReadTime(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Image upload box */}
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Image / Video</label>
                          <div className="border border-dashed border-gray-200 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center relative cursor-pointer hover:bg-slate-100/50 transition-colors">
                            <input 
                              type="file" 
                              accept="image/*,video/*"
                              onChange={(e) => e.target.files && setNewsFile(e.target.files[0])}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload className="text-gray-400 mb-2" size={28} />
                            <div className="font-extrabold text-blue-950 text-sm">Upload Image</div>
                            <div className="text-xs text-gray-400 font-bold mt-1">Recommended size 1200x675px</div>
                            {newsFile && (
                              <div className="mt-3 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                                <CheckCircle size={14} />
                                {newsFile.name}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image URL fallback */}
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Or Image URL</label>
                          <input 
                            type="text" 
                            placeholder="https://example.com/image.jpg"
                            value={newsFileUrl}
                            onChange={(e) => setNewsFileUrl(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:outline-hidden"
                          />
                        </div>

                        {/* Video URL fallback */}
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Or Video URL (YouTube, Vimeo, MP4, etc.)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 link"
                            value={newsVideoUrl}
                            onChange={(e) => setNewsVideoUrl(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold focus:border-[#da1e28] focus:outline-hidden"
                          />
                          <p className="text-[10px] text-gray-400 font-medium">
                            If you paste a YouTube/Vimeo link or direct video URL, the news post will automatically be configured as a Video post.
                          </p>
                        </div>

                        {/* Rich text body editor area */}
                        <div className="flex flex-col gap-1 text-left">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Content</label>
                          
                          {/* Rich Text Toolbar Mock */}
                          <div className="border border-gray-200 rounded-xl bg-white overflow-hidden flex flex-col">
                            <div className="bg-slate-50 border-b border-gray-150 px-4 py-2 flex items-center flex-wrap gap-2 select-none">
                              <span className="text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded px-2 py-0.5 shadow-2xs">Normal</span>
                              <div className="h-4 w-px bg-gray-200 mx-1"></div>
                              <button type="button" className="font-serif font-black px-2 py-0.5 text-xs text-slate-700 hover:bg-gray-200 rounded">B</button>
                              <button type="button" className="italic px-2 py-0.5 text-xs text-slate-700 hover:bg-gray-200 rounded">I</button>
                              <button type="button" className="underline px-2 py-0.5 text-xs text-slate-700 hover:bg-gray-200 rounded">U</button>
                              <div className="h-4 w-px bg-gray-200 mx-1"></div>
                              <button type="button" className="px-2 py-0.5 text-xs text-slate-700 hover:bg-gray-200 rounded">Align</button>
                              <button type="button" className="px-2 py-0.5 text-xs text-slate-700 hover:bg-gray-200 rounded">List</button>
                              <button type="button" className="px-2 py-0.5 text-xs text-slate-700 hover:bg-gray-200 rounded">Link</button>
                            </div>
                            
                            <textarea 
                              placeholder="Write news content here..."
                              value={newsBody}
                              onChange={(e) => setNewsBody(e.target.value)}
                              className="w-full px-4 py-3 h-52 text-sm font-semibold focus:outline-hidden resize-none border-0"
                              required
                            />
                          </div>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex items-center justify-end gap-3.5 pt-4 border-t border-gray-100">
                          <button 
                            type="button"
                            onClick={() => { resetNewsForm(); setNewsSubView('list'); }}
                            className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            className="px-6 py-3 bg-[#da1e28] text-white font-black rounded-xl text-sm hover:bg-red-700 transition-colors uppercase tracking-wider shadow-md shadow-red-600/10"
                          >
                            {newsSubView === 'add' ? 'Save News' : 'Update News'}
                          </button>
                        </div>

                      </form>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: SUCCESS STORIES */}
              {activeTab === 'stories' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-blue-950">Success Stories</h2>
                      <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                        Dashboard / Success Stories / All Stories
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowAddStoryModal(true)}
                      className="bg-[#da1e28] hover:bg-red-700 text-white font-black text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide shrink-0"
                    >
                      <Plus size={16} />
                      Add Story
                    </button>
                  </div>

                  {/* Stories list */}
                  <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500 select-none">
                            <th className="px-6 py-4.5">#</th>
                            <th className="px-6 py-4.5">Student Name</th>
                            <th className="px-6 py-4.5">Country</th>
                            <th className="px-6 py-4.5">Visa Type</th>
                            <th className="px-6 py-4.5">Image</th>
                            <th className="px-6 py-4.5">Status</th>
                            <th className="px-6 py-4.5">Date</th>
                            <th className="px-6 py-4.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm font-semibold text-slate-800">
                          {successStories.map((story, idx) => (
                            <tr key={story.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4.5 text-gray-400 font-extrabold">{idx + 1}</td>
                              <td className="px-6 py-4.5 font-extrabold text-blue-950">{story.name}</td>
                              <td className="px-6 py-4.5 text-slate-600">{story.country}</td>
                              <td className="px-6 py-4.5 text-slate-600">{story.visaType}</td>
                              <td className="px-6 py-4.5">
                                <img src={story.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                              </td>
                              <td className="px-6 py-4.5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  story.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {story.status}
                                </span>
                              </td>
                              <td className="px-6 py-4.5 text-gray-400">{story.date}</td>
                              <td className="px-6 py-4.5 text-right">
                                <button 
                                  onClick={() => deleteStory(story.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Story Modal */}
                  {showAddStoryModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 text-left">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                          <h3 className="font-black text-blue-950 text-lg">Add Success Story</h3>
                          <button onClick={() => setShowAddStoryModal(false)} className="text-gray-400 hover:text-slate-600"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleAddStory} className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-black text-slate-500">Student Name</label>
                            <input 
                              type="text"
                              required
                              value={newStoryName}
                              onChange={(e) => setNewStoryName(e.target.value)}
                              placeholder="e.g. Nusrat Jahan"
                              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-black text-slate-500">Country</label>
                            <input 
                              type="text"
                              required
                              value={newStoryCountry}
                              onChange={(e) => setNewStoryCountry(e.target.value)}
                              placeholder="e.g. Romania"
                              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-black text-slate-500">Visa Type</label>
                            <select 
                              value={newStoryVisaType}
                              onChange={(e) => setNewStoryVisaType(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden"
                            >
                              <option value="Student Visa">Student Visa</option>
                              <option value="Work Permit">Work Permit</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-black text-slate-500">Status</label>
                            <select 
                              value={newStoryStatus}
                              onChange={(e) => setNewStoryStatus(e.target.value as any)}
                              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden"
                            >
                              <option value="Published">Published</option>
                              <option value="Draft">Draft</option>
                            </select>
                          </div>
                          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
                            <button type="button" onClick={() => setShowAddStoryModal(false)} className="px-4 py-2 text-sm font-black text-gray-500 border border-gray-200 rounded-xl hover:bg-slate-50">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-[#da1e28] text-white text-sm font-black rounded-xl hover:bg-red-700">Add Story</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 6: APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  
                  {appSubView === 'list' && (
                    <>
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-black text-blue-950">Manage Applications</h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Applications / All Applicants
                          </div>
                        </div>
                        <button 
                          onClick={() => setAppSubView('add')}
                          className="bg-[#da1e28] hover:bg-red-700 text-white font-black text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide shrink-0 shadow-sm"
                        >
                          <Plus size={16} />
                          Add Application
                        </button>
                      </div>

                      {/* Table of applications */}
                      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500 select-none">
                                <th className="px-6 py-4.5">#</th>
                                <th className="px-6 py-4.5">Student Name</th>
                                <th className="px-6 py-4.5">Target Country</th>
                                <th className="px-6 py-4.5">Visa Category</th>
                                <th className="px-6 py-4.5">Status</th>
                                <th className="px-6 py-4.5 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-semibold text-slate-800">
                              {applications.map((app, idx) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4.5 text-gray-400 font-extrabold">{idx + 1}</td>
                                  <td className="px-6 py-4.5">
                                    <div className="flex flex-col">
                                      <span className="font-extrabold text-blue-950">{app.name}</span>
                                      <span className="text-xs text-gray-400 mt-0.5">{app.date}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4.5 text-slate-600 font-bold">{app.country}</td>
                                  <td className="px-6 py-4.5 text-slate-600">{app.visaType}</td>
                                  <td className="px-6 py-4.5">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                                      app.status === 'New' ? 'bg-emerald-100 text-emerald-800' :
                                      app.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                                      app.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                      app.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {app.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4.5 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button 
                                        onClick={() => { setViewingAppId(app.id); setAppSubView('details'); }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      >
                                        <Eye size={16} />
                                      </button>
                                      <button 
                                        onClick={() => deleteApp(app.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Add / Details View for Applications */}
                  {(appSubView === 'add' || appSubView === 'details') && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                      {/* Subview Header */}
                      <div className="flex items-center gap-4 border-b border-gray-150 pb-4">
                        <button 
                          onClick={() => setAppSubView('list')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-950 transition-colors shadow-sm"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <div>
                          <h2 className="text-xl font-black text-blue-950">
                            {appSubView === 'add' ? 'Add Online Registration' : 'Registration Details'}
                          </h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Applications / {appSubView === 'add' ? 'New Entry' : 'View Details'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs">
                            <h3 className="font-black text-blue-950 text-base mb-6 border-b border-gray-100 pb-3">Applicant Information</h3>
                            
                            {appSubView === 'add' ? (
                              <form onSubmit={handleAddApp} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <input 
                                      type="text" required value={newAppName} onChange={(e) => setNewAppName(e.target.value)}
                                      placeholder="e.g. Fahim Hasan"
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Country</label>
                                    <input 
                                      type="text" required value={newAppCountry} onChange={(e) => setNewAppCountry(e.target.value)}
                                      placeholder="e.g. Romania"
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Visa Category</label>
                                    <select 
                                      value={newAppVisaType} onChange={(e) => setNewAppVisaType(e.target.value)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden bg-slate-50"
                                    >
                                      <option value="Student Visa">Student Visa</option>
                                      <option value="Work Permit">Work Permit</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Initial Status</label>
                                    <select 
                                      value={newAppStatus} onChange={(e) => setNewAppStatus(e.target.value as any)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden bg-slate-50"
                                    >
                                      <option value="New">New</option>
                                      <option value="In Review">In Review</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                  <button type="button" onClick={() => setAppSubView('list')} className="px-6 py-2.5 text-sm font-black text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
                                  <button type="submit" className="px-8 py-2.5 bg-[#da1e28] text-white text-sm font-black rounded-xl hover:bg-red-700 shadow-md">Register App</button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex flex-col gap-6">
                                {(() => {
                                  const app = applications.find(a => a.id === viewingAppId);
                                  if (!app) return <div>App not found</div>;
                                  return (
                                    <>
                                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Student Name</div>
                                          <div className="text-lg font-black text-blue-950">{app.name}</div>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Target Country</div>
                                          <div className="text-lg font-black text-blue-950 flex items-center gap-2">
                                            <MapPinCheck size={18} className="text-[#da1e28]" />
                                            {app.country}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Visa Category</div>
                                          <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                            <Briefcase size={16} className="text-blue-500" />
                                            {app.visaType}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Date Applied</div>
                                          <div className="text-base font-bold text-slate-700">{app.date}</div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-4 pt-6 border-t border-gray-100">
                                        <h4 className="font-black text-sm text-blue-950 mb-3">Internal Notes</h4>
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm font-medium text-amber-900 leading-relaxed">
                                          No special notes added for this applicant yet. Contact them immediately to proceed with the document collection step.
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Sidebar Column */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                          {/* Publish/Status Card */}
                          <div className="bg-slate-50 rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="p-5 border-b border-gray-200 bg-white">
                              <h3 className="font-black text-blue-950 text-sm">Application Workflow</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                              {appSubView === 'details' && (() => {
                                const app = applications.find(a => a.id === viewingAppId);
                                if (!app) return null;
                                return (
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Update Status</label>
                                    <select 
                                      value={app.status}
                                      onChange={(e) => updateAppStatus(app.id, e.target.value as any)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-900 cursor-pointer shadow-sm"
                                    >
                                      <option value="New">New</option>
                                      <option value="In Review">In Review</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </div>
                                );
                              })()}

                              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border border-gray-200">
                                <Clock size={16} className="text-gray-400" />
                                Last updated: Just now
                              </div>
                              
                              <button className="w-full py-3 bg-blue-950 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-900 shadow-md flex justify-center items-center gap-2">
                                <CheckCircle size={14} /> 
                                {appSubView === 'add' ? 'Save Entry' : 'Update Application'}
                              </button>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-xs">
                            <h3 className="font-black text-blue-950 text-sm mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">Send Email Update</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">Log Phone Call</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <FileText size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">Request Documents</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}


              {/* TAB 7: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  
                  {appSubView === 'list' && (
                    <>
                      {/* Header and counter */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-black text-blue-950">Inquiries (Online Registrations)</h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Inquiries / All Inquiries
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="bg-blue-950 text-white text-xs font-black uppercase tracking-widest px-4.5 py-2.5 rounded-xl w-fit select-none shadow-sm">
                            {inquiries.length} Registered Entries
                          </span>
                        </div>
                      </div>

                      {/* SEARCH & FILTERS BAR */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text"
                            placeholder="Search inquiries by name, phone or passport..."
                            value={inquirySearch}
                            onChange={(e) => setInquirySearch(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                          <select 
                            value={inquiryTypeFilter}
                            onChange={(e) => setInquiryTypeFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold w-full sm:w-44 focus:outline-hidden"
                          >
                            <option>All Types</option>
                            <option>Student Visa</option>
                            <option>Work Permit</option>
                          </select>

                          <select 
                            value={inquiryStatusFilter}
                            onChange={(e) => setInquiryStatusFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold w-full sm:w-40 focus:outline-hidden"
                          >
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Counselling Scheduled</option>
                            <option>Document Review</option>
                            <option>Submitted</option>
                          </select>

                          <button className="bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto">
                            <Filter size={16} />
                            Filter
                          </button>
                        </div>
                      </div>

                      {/* Table of Inquiries */}
                      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500 select-none">
                                <th className="px-5 py-4.5">#</th>
                                <th className="px-5 py-4.5">Name & Details</th>
                                <th className="px-5 py-4.5">Visa Category</th>
                                <th className="px-5 py-4.5">Destination</th>
                                <th className="px-5 py-4.5">Status</th>
                                <th className="px-5 py-4.5 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-semibold text-slate-800">
                              {inquiries
                                .filter(item => {
                                  const matchesSearch = item.name.toLowerCase().includes(inquirySearch.toLowerCase()) || 
                                                        item.phone.includes(inquirySearch) || 
                                                        (item.passportNumber && item.passportNumber.toLowerCase().includes(inquirySearch.toLowerCase()));
                                  const isWork = item.visaType === 'work';
                                  const matchesType = inquiryTypeFilter === 'All Types' || 
                                                      (inquiryTypeFilter === 'Student Visa' && !isWork) || 
                                                      (inquiryTypeFilter === 'Work Permit' && isWork);
                                  const matchesStatus = inquiryStatusFilter === 'All Status' || item.status === inquiryStatusFilter;
                                  return matchesSearch && matchesType && matchesStatus;
                                })
                                .map((item, idx) => (
                                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-4.5 text-gray-400 font-extrabold">{idx + 1}</td>
                                    <td className="px-5 py-4.5">
                                      <div className="flex flex-col leading-tight">
                                        <span className="font-extrabold text-blue-950">{item.name}</span>
                                        <span className="text-xs text-slate-500 mt-0.5">Phone: {item.phone}</span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4.5">
                                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide font-black ${
                                        item.visaType === 'work' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {item.visaType === 'work' ? 'Work Permit' : 'Student Visa'}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4.5">
                                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                                        {item.destination}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4.5">
                                      <select 
                                        value={item.status}
                                        onChange={(e) => updateInquiryStatus(item.id, e.target.value as any)}
                                        className="border-0 bg-slate-100 focus:ring-1 focus:ring-blue-950 rounded-lg py-1 px-2 text-xs font-black text-blue-950 cursor-pointer"
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Counselling Scheduled">Scheduled</option>
                                        <option value="Document Review">Doc Review</option>
                                        <option value="Submitted">Submitted</option>
                                      </select>
                                    </td>
                                    <td className="px-5 py-4.5 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={() => { setViewingAppId(item.id); setAppSubView('details'); }}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="View Details"
                                        >
                                          <Eye size={16} />
                                        </button>
                                        <button 
                                          onClick={() => deleteInquiry(item.id)}
                                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete Entry"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Details View for Inquiries */}
                  {appSubView === 'details' && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                      {/* Subview Header */}
                      <div className="flex items-center gap-4 border-b border-gray-150 pb-4">
                        <button 
                          onClick={() => setAppSubView('list')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-950 transition-colors shadow-sm"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <div>
                          <h2 className="text-xl font-black text-blue-950">
                            Online Registration Details
                          </h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Inquiries / View Registration
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs">
                            <h3 className="font-black text-blue-950 text-base mb-6 border-b border-gray-100 pb-3">Applicant Information</h3>
                            
                            {(() => {
                              const inq = inquiries.find(i => i.id === viewingAppId);
                              if (!inq) return <div>Inquiry not found</div>;
                              return (
                                <>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Full Name</div>
                                      <div className="text-lg font-black text-blue-950">{inq.name}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Phone Number</div>
                                      <div className="text-base font-bold text-blue-950 flex items-center gap-2">
                                        <Phone size={14} className="text-slate-400" />
                                        {inq.phone}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Email Address</div>
                                      <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                        <Mail size={14} className="text-slate-400" />
                                        {inq.email || 'N/A'}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Passport Number</div>
                                      <div className="text-base font-bold text-slate-700 uppercase">{inq.passportNumber || 'N/A'}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Education Level</div>
                                      <div className="text-base font-bold text-slate-700">{inq.educationLevel || 'N/A'}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Present District</div>
                                      <div className="text-base font-bold text-slate-700">{inq.presentDistrict || 'N/A'}</div>
                                    </div>
                                  </div>

                                  <h3 className="font-black text-blue-950 text-base mt-8 mb-6 border-b border-gray-100 pb-3">Visa Requirements</h3>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Visa Category</div>
                                      <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                        <Briefcase size={16} className="text-blue-500" />
                                        {inq.visaType === 'work' ? 'Work Permit' : 'Student Visa'}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Target Country</div>
                                      <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                        <MapPinCheck size={16} className="text-[#da1e28]" />
                                        {inq.destination}
                                      </div>
                                    </div>
                                    {inq.visaType === 'work' ? (
                                      <div>
                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Skills & Experience</div>
                                        <div className="text-base font-bold text-blue-800">{inq.skillsExperience || 'N/A'}</div>
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">IELTS Score</div>
                                        <div className="text-base font-bold text-emerald-800">{inq.ieltsScore || 'N/A'}</div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Message / Special Notes</div>
                                    <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 text-sm font-medium text-slate-700 leading-relaxed min-h-[80px]">
                                      {inq.message || 'No additional message provided by the applicant.'}
                                    </div>
                                  </div>

                                  {inq.files && inq.files.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3">
                                        Uploaded Documents / Attachments ({inq.files.length})
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {inq.files.map((fileUrl, fIdx) => (
                                          <a 
                                            key={fIdx}
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 border border-gray-200 hover:border-[#da1e28] rounded-xl hover:bg-slate-50 transition-all text-left group"
                                          >
                                            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#da1e28] flex items-center justify-center shrink-0 group-hover:bg-[#da1e28] group-hover:text-white transition-colors">
                                              <FileText size={20} />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                              <span className="text-xs font-black text-slate-800 truncate group-hover:text-[#da1e28] transition-colors">
                                                Document #{fIdx + 1}
                                              </span>
                                              <span className="text-[9px] text-gray-400 font-extrabold uppercase mt-0.5 tracking-wider">
                                                Click to View File
                                              </span>
                                            </div>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Right Sidebar Column */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                          {/* Publish/Status Card */}
                          <div className="bg-slate-50 rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="p-5 border-b border-gray-200 bg-white">
                              <h3 className="font-black text-blue-950 text-sm">Processing Status</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                              {(() => {
                                const inq = inquiries.find(i => i.id === viewingAppId);
                                if (!inq) return null;
                                return (
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Update Status</label>
                                    <select 
                                      value={inq.status}
                                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-900 cursor-pointer shadow-sm"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Counselling Scheduled">Scheduled</option>
                                      <option value="Document Review">Doc Review</option>
                                      <option value="Submitted">Submitted</option>
                                    </select>
                                  </div>
                                );
                              })()}

                              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border border-gray-200">
                                <Clock size={16} className="text-gray-400" />
                                Applied on: {inquiries.find(i => i.id === viewingAppId)?.date || 'Today'}
                              </div>
                              
                              <button className="w-full py-3 bg-blue-950 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-900 shadow-md flex justify-center items-center gap-2">
                                <CheckCircle size={14} /> 
                                Save Status
                              </button>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-xs">
                            <h3 className="font-black text-blue-950 text-sm mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Phone size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold text-slate-700">Call Applicant</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Mail size={16} className="text-blue-500" />
                                <span className="text-xs font-bold text-slate-700">Email Applicant</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <FileText size={16} className="text-amber-500" />
                                <span className="text-xs font-bold text-slate-700">Request Documents</span>
                              </button>
                              <button 
                                onClick={async () => {
                                  if (viewingAppId) {
                                    await deleteInquiry(viewingAppId);
                                    setAppSubView('list');
                                  }
                                }}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 rounded-xl text-left transition-colors border border-transparent hover:border-red-200 group w-full cursor-pointer"
                              >
                                <Trash2 size={16} className="text-red-500 group-hover:text-red-600" />
                                <span className="text-xs font-bold text-slate-700 group-hover:text-red-600">Delete Entry</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 7: LINKS */}
              {activeTab === 'false' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-blue-950">Link Manager</h2>
                      <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                        Dashboard / Links / Manage URLs
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowAddLinkModal(true)}
                      className="bg-[#da1e28] hover:bg-red-700 text-white font-black text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                    >
                      <Plus size={16} /> Add New Link
                    </button>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500">
                            <th className="px-6 py-4.5">Title</th>
                            <th className="px-6 py-4.5">Short Link</th>
                            <th className="px-6 py-4.5">Category</th>
                            <th className="px-6 py-4.5">Destination</th>
                            <th className="px-6 py-4.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm font-semibold text-slate-800">
                          {links.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold">
                                No links created yet. Click "Add New Link" to get started.
                              </td>
                            </tr>
                          ) : (
                            links.map((link) => (
                              <tr key={link.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4.5 font-extrabold text-blue-950">{link.title}</td>
                                <td className="px-6 py-4.5">
                                  <div className="flex items-center gap-2">
                                    <code className="bg-slate-100 px-2 py-1 rounded text-[#da1e28] text-xs font-bold">
                                      /{link.slug}
                                    </code>
                                    <button 
                                      onClick={() => {
                                        const fullUrl = `${window.location.origin}/${link.slug}`;
                                        navigator.clipboard.writeText(fullUrl);
                                        alert('Link copied to clipboard!');
                                      }}
                                      className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer"
                                      title="Copy full link"
                                    >
                                      <RefreshCw size={12} />
                                    </button>
                                  </div>
                                </td>
                                <td className="px-6 py-4.5">
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-sm">
                                    {link.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4.5 text-gray-500 truncate max-w-[150px]">{link.url}</td>
                                <td className="px-6 py-4.5 text-right">
                                  <button 
                                    onClick={() => deleteLink(link.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: COUNTRIES DIRECTORY */}
              {activeTab === 'countries' && (
                <div className="flex flex-col gap-8 animate-fade-in text-left">
                  
                  {/* Header and Add Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-blue-950">Countries Directory</h2>
                      <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                        Dashboard / Directory / Countries Manager
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddCountryModal(true)}
                      className="bg-[#da1e28] hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-red-500/10 cursor-pointer"
                    >
                      <Plus size={18} />
                      <span>Add New Country</span>
                    </button>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-xs">
                      <div className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Total Countries</div>
                      <div className="text-3xl font-black text-blue-950 mt-1">{countries.length}</div>
                    </div>
                    <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-xs">
                      <div className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Study Abroad (Porasuna)</div>
                      <div className="text-3xl font-black text-red-600 mt-1">
                        {countries.filter(c => c.visaType !== 'work').length}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-xs">
                      <div className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Work Permits (Kaj)</div>
                      <div className="text-3xl font-black text-blue-600 mt-1">
                        {countries.filter(c => c.visaType === 'work').length}
                      </div>
                    </div>
                  </div>

                  {/* Countries Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {countries.map((country) => {
                      const isSystemDefault = COUNTRIES.some(c => c.id.toLowerCase() === country.id.toLowerCase());
                      const isWork = country.visaType === 'work';
                      
                      return (
                        <div key={country.id} className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                          
                          {/* Banner */}
                          <div className="h-36 relative bg-slate-900 overflow-hidden">
                            <img 
                              src={country.bgImage} 
                              alt={country.name} 
                              className="w-full h-full object-cover opacity-60"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                            
                            {/* Absolute top tags */}
                            <div className="absolute top-4 left-4 flex gap-2">
                              {isSystemDefault ? (
                                <span className="bg-slate-800/80 text-white backdrop-blur-xs text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                                  System Default
                                </span>
                              ) : (
                                <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                                  Custom Added
                                </span>
                              )}
                              
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                country.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {country.isActive !== false ? 'Active' : 'Inactive'}
                              </span>
                            </div>

                            {/* Banner details */}
                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                              <div className="flex items-center gap-3">
                                {country.flagUrl && (
                                  <img 
                                    src={country.flagUrl} 
                                    alt={country.name} 
                                    className="w-9 h-6 object-cover rounded-md border border-white/20 shadow-xs"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div>
                                  <h3 className="font-black text-lg tracking-tight leading-none">{country.name}</h3>
                                  <span className="text-[10px] text-gray-300 font-bold uppercase">{country.code}</span>
                                </div>
                              </div>
                              
                              {/* Visa type badge */}
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 ${
                                isWork ? 'bg-blue-600 text-white' : 'bg-[#da1e28] text-white'
                              }`}>
                                {isWork ? 'Work Permit' : 'Study Visa'}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-grow flex flex-col gap-4 text-xs font-semibold text-slate-600">
                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Intake</span>
                                <div className="font-extrabold text-blue-950 mt-0.5">{country.intakes?.[0] || 'N/A'}</div>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cost / Tuition</span>
                                <div className="font-extrabold text-blue-950 mt-0.5 truncate">{country.tuitionFee || 'N/A'}</div>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Key Requirements</span>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-400 font-bold">Edu:</span>
                                  <span className="text-blue-950 font-extrabold text-right truncate pl-2">{country.requirements?.education || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 font-bold">English:</span>
                                  <span className="text-blue-950 font-extrabold text-right truncate pl-2">{country.requirements?.ielts || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400 font-bold">Solvency:</span>
                                  <span className="text-blue-950 font-extrabold text-right truncate pl-2">{country.requirements?.funds || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {country.popularCourses && country.popularCourses.length > 0 && (
                              <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                  {isWork ? 'Job Fields' : 'Popular Courses'}
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {country.popularCourses.map((item, idx) => (
                                    <span key={idx} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                            <button
                              onClick={() => toggleCountryStatus(country.id)}
                              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                                country.isActive !== false
                                  ? 'bg-green-100 hover:bg-green-200 text-green-800'
                                  : 'bg-red-100 hover:bg-red-200 text-red-800'
                              }`}
                            >
                              <span>{country.isActive !== false ? 'Active' : 'Inactive'}</span>
                            </button>

                            <button
                              disabled={isSystemDefault}
                              onClick={() => deleteCountry(country.id)}
                              className={`p-2 rounded-xl transition-colors ${
                                isSystemDefault 
                                  ? 'text-gray-300 cursor-not-allowed' 
                                  : 'text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer'
                              }`}
                              title={isSystemDefault ? 'Cannot delete default system countries' : 'Delete country'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty State */}
                  {countries.length === 0 && (
                    <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center max-w-md mx-auto">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe size={32} />
                      </div>
                      <h3 className="text-lg font-black text-blue-950">No Countries Found</h3>
                      <p className="text-gray-400 font-semibold text-sm mt-1">
                        There are no countries in your database right now. Add one using the button above.
                      </p>
                    </div>
                  )}

                  {/* Add Country Modal */}
                  {showAddCountryModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
                      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 text-left my-8">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
                          <div>
                            <h3 className="font-black text-blue-950 text-lg">Add New Country Destination</h3>
                            <p className="text-xs text-gray-400 font-bold mt-0.5">Define Study or Work permit pathways for candidates</p>
                          </div>
                          <button onClick={() => setShowAddCountryModal(false)} className="text-gray-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"><X size={18} /></button>
                        </div>

                        <form onSubmit={handleAddCountry} className="flex flex-col gap-5">
                          
                          {/* Two Column Section */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            
                            {/* Name */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Country Name</label>
                              <input 
                                type="text"
                                required
                                value={newCountryName}
                                onChange={(e) => setNewCountryName(e.target.value)}
                                placeholder="e.g. Portugal"
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                              />
                            </div>

                            {/* Code */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Country Code (2 letters)</label>
                              <input 
                                type="text"
                                required
                                maxLength={2}
                                value={newCountryCode}
                                onChange={(e) => setNewCountryCode(e.target.value)}
                                placeholder="e.g. PT"
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28] uppercase"
                              />
                            </div>

                            {/* Visa Category */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Visa Pathway Category</label>
                              <select 
                                value={newCountryVisaType}
                                onChange={(e) => setNewCountryVisaType(e.target.value as any)}
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                              >
                                <option value="student">Study Abroad (Porasunar Jonno)</option>
                                <option value="work">Work Permit (Kajer Jonno)</option>
                              </select>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Visibility Status</label>
                              <select 
                                value={newCountryStatus}
                                onChange={(e) => setNewCountryStatus(e.target.value as any)}
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                              >
                                <option value="Active">Active / Visible on Portal</option>
                                <option value="Inactive">Inactive / Hidden from Portal</option>
                              </select>
                            </div>

                            {/* Intake duration */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Processing Timeline / Intake</label>
                              <input 
                                type="text"
                                value={newCountryIntake}
                                onChange={(e) => setNewCountryIntake(e.target.value)}
                                placeholder="e.g. 3 - 4 Months"
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                              />
                            </div>

                            {/* Tuition / processing costs */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Tuition Fee / Processing Cost</label>
                              <input 
                                type="text"
                                value={newCountryTuition}
                                onChange={(e) => setNewCountryTuition(e.target.value)}
                                placeholder="e.g. €3,000 - 4,500 / year"
                                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                              />
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4 mt-1">
                            <h4 className="font-extrabold text-blue-950 text-sm mb-3 uppercase tracking-wider">Pathway Requirements</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Education Requirement</label>
                                <input 
                                  type="text"
                                  value={newCountryEducation}
                                  onChange={(e) => setNewCountryEducation(e.target.value)}
                                  placeholder="e.g. Minimum HSC / Alim"
                                  className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#da1e28]"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">IELTS / English Score</label>
                                <input 
                                  type="text"
                                  value={newCountryIelts}
                                  onChange={(e) => setNewCountryIelts(e.target.value)}
                                  placeholder="e.g. No IELTS or MOI"
                                  className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#da1e28]"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Solvency / Funds Proof</label>
                                <input 
                                  type="text"
                                  value={newCountryFunds}
                                  onChange={(e) => setNewCountryFunds(e.target.value)}
                                  placeholder="e.g. Solvency approx. €4,500"
                                  className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-hidden focus:border-[#da1e28]"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Key Highlights (Comma-separated)</label>
                            <input 
                              type="text"
                              value={newCountryHighlights}
                              onChange={(e) => setNewCountryHighlights(e.target.value)}
                              placeholder="e.g. Legal employment contract, Schengen travel rights, Low processing cost"
                              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Popular Courses / Job Fields (Comma-separated)</label>
                            <input 
                              type="text"
                              value={newCountryCourses}
                              onChange={(e) => setNewCountryCourses(e.target.value)}
                              placeholder="e.g. Food Packers, Drivers, Hospitality, Software Engineering"
                              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Background Banner Image URL (Optional)</label>
                            <input 
                              type="text"
                              value={newCountryBgImage}
                              onChange={(e) => setNewCountryBgImage(e.target.value)}
                              placeholder="e.g. https://images.unsplash.com/photo-..."
                              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-[#da1e28]"
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                            <button type="button" onClick={() => setShowAddCountryModal(false)} className="px-5 py-2.5 text-sm font-black text-gray-500 border border-gray-200 rounded-xl hover:bg-slate-50 cursor-pointer">Cancel</button>
                            <button type="submit" className="px-6 py-2.5 bg-[#da1e28] text-white text-sm font-black rounded-xl hover:bg-red-700 cursor-pointer">Save Country</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: COUNTRY CHECKLISTS (PDF MANAGER) */}
              {activeTab === 'pdfs' && (
                <div className="flex flex-col gap-8 animate-fade-in text-left">
                  
                  {/* Header and counter */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-blue-950">Country PDF Checklists</h2>
                      <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                        Dashboard / Country Checklists / Upload Manager
                      </div>
                    </div>
                    <span className="bg-blue-950 text-white text-xs font-black uppercase tracking-widest px-4.5 py-2.5 rounded-xl w-fit select-none shadow-sm">
                      {Object.keys(countryPdfs).length} Uploaded Checklists
                    </span>
                  </div>

                  {/* TWO COLUMN GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Upload Form (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                      <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs">
                        <h3 className="font-black text-blue-950 text-base mb-5 border-b border-gray-100 pb-3">Upload New Checklist</h3>
                        
                        <form onSubmit={handlePdfUploadSubmit} className="flex flex-col gap-5">
                          
                          {/* Country Selection */}
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Target Country</label>
                            <select
                              value={pdfUploadCountryId}
                              onChange={(e) => setPdfUploadCountryId(e.target.value)}
                              className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50 cursor-pointer w-full"
                            >
                              {COUNTRIES.map((country) => (
                                <option key={country.id} value={country.id}>
                                  {country.name} ({country.visaType === 'work' ? 'Work Permit' : 'Student Visa'})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Drag and Drop Zone */}
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">PDF File</label>
                            
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setPdfIsDragging(true);
                              }}
                              onDragLeave={() => setPdfIsDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setPdfIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                  const file = e.dataTransfer.files[0];
                                  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                                    setSelectedPdfFile(file);
                                    setPdfUploadError('');
                                  } else {
                                    setPdfUploadError('Only PDF files are supported.');
                                  }
                                }
                              }}
                              onClick={() => {
                                const el = document.getElementById('country-pdf-file-picker');
                                if (el) el.click();
                              }}
                              className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                                pdfIsDragging 
                                  ? 'border-[#da1e28] bg-red-50/20' 
                                  : selectedPdfFile 
                                    ? 'border-emerald-300 bg-emerald-50/10' 
                                    : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/50'
                              }`}
                            >
                              <input 
                                type="file"
                                id="country-pdf-file-picker"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setSelectedPdfFile(e.target.files[0]);
                                    setPdfUploadError('');
                                  }
                                }}
                              />
                              
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                selectedPdfFile ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-[#da1e28]'
                              }`}>
                                <Upload size={20} />
                              </div>

                              <div className="leading-snug">
                                {selectedPdfFile ? (
                                  <div className="flex flex-col gap-1 items-center">
                                    <span className="text-xs font-black text-slate-800 line-clamp-1">{selectedPdfFile.name}</span>
                                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                                      {(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black text-slate-800">Drag & drop your PDF file here</span>
                                    <span className="text-[10px] text-gray-400 font-bold">or click to browse local files</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Error Message */}
                          {pdfUploadError && (
                            <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
                              <AlertCircle size={14} className="shrink-0" />
                              <span>{pdfUploadError}</span>
                            </div>
                          )}

                          {/* Buttons */}
                          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 justify-end">
                            {selectedPdfFile && (
                              <button
                                type="button"
                                onClick={() => setSelectedPdfFile(null)}
                                className="px-5 py-2.5 text-xs font-black text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                            <button
                              type="submit"
                              disabled={pdfUploading}
                              className="px-6 py-2.5 bg-[#da1e28] hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-600/10 cursor-pointer flex items-center gap-2"
                            >
                              {pdfUploading ? (
                                <>
                                  <RefreshCw size={12} className="animate-spin" />
                                  <span>Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={12} />
                                  <span>Save Checklist</span>
                                </>
                              )}
                            </button>
                          </div>

                        </form>

                      </div>
                    </div>

                    {/* Right Column: Checklists List (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                      <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs">
                        <h3 className="font-black text-blue-950 text-base mb-5 border-b border-gray-100 pb-3">Active Document Checklists</h3>
                        
                        <div className="flex flex-col gap-4">
                          {COUNTRIES.map((country) => {
                            const pdfItem = countryPdfs[country.id.toLowerCase()];
                            return (
                              <div key={country.id} className="flex flex-col sm:flex-row items-center sm:justify-between p-4 bg-slate-50 border border-slate-150/60 rounded-2xl gap-4">
                                
                                {/* Flag & Country */}
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                  <div className="w-12 h-8 rounded-sm overflow-hidden border border-slate-200 shadow-sm shrink-0">
                                    <img 
                                      src={country.flagUrl} 
                                      alt="" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="text-left leading-tight">
                                    <div className="font-black text-slate-900 text-sm">{country.name}</div>
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                      {country.visaType === 'work' ? 'Work Permit' : 'Student Visa'}
                                    </span>
                                  </div>
                                </div>

                                {/* PDF Status / Filename */}
                                <div className="flex-1 text-left sm:text-right px-2">
                                  {pdfItem ? (
                                    <div className="flex flex-col leading-tight sm:items-end">
                                      <span className="text-xs font-black text-blue-950 line-clamp-1" title={pdfItem.pdfName}>
                                        {pdfItem.pdfName}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-bold mt-1">
                                        Uploaded: {pdfItem.uploadedAt}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-200/60 text-slate-600">
                                      Fallback Active (Text Checklist)
                                    </span>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                                  {pdfItem ? (
                                    <>
                                      <a
                                        href={pdfItem.pdfUrl}
                                        download={pdfItem.pdfName}
                                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                        title="Download and test PDF checklist file"
                                      >
                                        <Eye size={15} />
                                      </a>
                                      <button
                                        onClick={() => deleteCountryPdf(country.id)}
                                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                                        title="Delete PDF checklist"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPdfUploadCountryId(country.id);
                                        const picker = document.getElementById('country-pdf-file-picker');
                                        if (picker) picker.click();
                                      }}
                                      className="text-xs font-black text-[#da1e28] hover:underline px-2.5 py-1"
                                    >
                                      + Upload PDF
                                    </button>
                                  )}
                                </div>

                              </div>
                            );
                          })}
                        </div>

                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB: ASSETS VIEW */}
              {activeTab === 'assets' && (
                <div className="flex flex-col gap-8 animate-fade-in text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-blue-950">Website Global Assets</h2>
                      <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                        Dashboard / Settings / Assets Manager
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Logo Settings */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                          <Image size={20} />
                        </div>
                        <h3 className="font-black text-blue-950 text-base">Main Logo</h3>
                      </div>
                      
                      <div className="bg-slate-100 rounded-2xl p-8 flex items-center justify-center min-h-[160px] border border-slate-200">
                        <img src={logoUrl} alt="Main Logo" className="max-h-24 object-contain" />
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Upload New Logo (Permanent)</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToStorage(file, 'assets');
                              if (url) {
                                setLogoUrl(url);
                                if (supabase) await supabase.from('site_settings').upsert({ id: 'global_assets', logo_url: url });
                                alert('Logo updated permanently on Supabase Storage!');
                              }
                            }
                          }}
                          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>

                    {/* Hero Banner Settings */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
                      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                          <Layout size={20} />
                        </div>
                        <h3 className="font-black text-blue-950 text-base">Hero Banner</h3>
                      </div>
                      
                      <div className="bg-slate-100 rounded-2xl overflow-hidden aspect-video border border-slate-200">
                        <img src={heroBannerUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Upload New Banner (Permanent)</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToStorage(file, 'assets');
                              if (url) {
                                setHeroBannerUrl(url);
                                if (supabase) await supabase.from('site_settings').upsert({ id: 'global_assets', hero_banner_url: url });
                                alert('Hero banner updated permanently on Supabase Storage!');
                              }
                            }
                          }}
                          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TABS 9 to 14 FALLBACK PLATFORM INTERFACES */}
              {!['dashboard', 'news', 'stories', 'applications', 'inquiries', 'pdfs'].includes(activeTab) && (
                <div className="bg-white border border-gray-150 rounded-3xl p-10 shadow-xs text-center flex flex-col items-center justify-center gap-4 animate-fade-in min-h-[350px]">
                  <div className="w-14 h-14 bg-blue-50 text-blue-950 rounded-full flex items-center justify-center">
                    <SettingsIcon size={26} />
                  </div>
                  <div className="max-w-md">
                    <h3 className="font-black text-blue-950 text-lg capitalize">{activeTab} Manager</h3>
                    <p className="text-sm font-bold text-gray-400 mt-2">
                      This settings/management panel is configured dynamically to control your Joy Fast Fly portal parameters, meta-descriptions, backups and authorization layers.
                    </p>
                  </div>
                  <div className="mt-4 px-4.5 py-2 bg-[#da1e28]/5 border border-[#da1e28]/15 rounded-full text-xs font-extrabold text-[#da1e28] uppercase tracking-wider">
                    Online & fully operational
                  </div>
                </div>
              )}

            </main>
          </div>

        </div>
      )}

      {/* BEAUTIFUL CUSTOM STATE-BASED CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}></div>
          <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl animate-scale-up text-left">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-5">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-950 tracking-tight">{confirmModal.title}</h3>
            <p className="text-sm font-semibold text-slate-650 mt-2.5 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4.5 py-2.5 rounded-xl border border-gray-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-md shadow-red-500/10"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
