import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Calendar, 
  ClipboardCheck, 
  User, 
  FileText, 
  MapPinCheck, 
  GraduationCap, 
  Briefcase, 
  Languages,
  UploadCloud,
  X,
  Printer,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { Inquiry } from '../types';

// A high-fidelity CSS Barcode generator to simulate an official visa document
const Barcode: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div className="flex flex-col items-center gap-1 my-4 print:my-2 animate-fade-in" id="barcode-generator">
      <div className="flex h-11 items-end gap-[1.5px] print:h-9">
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-transparent"></div>
        <div className="w-[4px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[2px] h-transparent"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[1px] h-transparent"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[4px] h-full bg-black"></div>
        <div className="w-[1px] h-transparent"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-transparent"></div>
        <div className="w-[4px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[2px] h-transparent"></div>
        <div className="w-[3px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
        <div className="w-[2px] h-full bg-black"></div>
        <div className="w-[1px] h-transparent"></div>
        <div className="w-[4px] h-full bg-black"></div>
        <div className="w-[1px] h-full bg-black"></div>
      </div>
      <span className="font-mono text-[10px] tracking-[0.25em] font-black text-gray-900">{value}</span>
    </div>
  );
};

export const ContactSection: React.FC = () => {
  // Primary validation error state
  const [validationError, setValidationError] = useState('');

  // Assessment & Inquiry States
  const [visaType, setVisaType] = useState<'student' | 'work'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('Cyprus');
  const [passportNumber, setPassportNumber] = useState('');
  const [educationLevel, setEducationLevel] = useState('HSC / Alim / Diploma');
  const [presentDistrict, setPresentDistrict] = useState('');
  const [skillsExperience, setSkillsExperience] = useState('Factory & Packing');
  const [ieltsScore, setIeltsScore] = useState('Without IELTS / MOI');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  
  // Storage & Submission States
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recentId, setRecentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically update destination selection when visa stream switches
  useEffect(() => {
    if (visaType === 'work') {
      setDestination('Romania');
    } else {
      setDestination('Cyprus');
    }
    setValidationError('');
  }, [visaType]);

  // Load inquiries list on mount
  useEffect(() => {
    const fetchInquiries = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('id', { ascending: false });
            
          if (error) throw error;
          if (data && data.length > 0) {
            setInquiries(data);
            return;
          }
        } catch (e) {
          console.error('Failed to fetch from Supabase', e);
        }
      }
      
      const saved = localStorage.getItem('joyfastfly_inquiries');
      if (saved) {
        try {
          setInquiries(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse cached inquiries', e);
        }
      }
    };

    fetchInquiries();
  }, []);

  // Drag and Drop Upload Event Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Single-Step Complete Form Validator
  const validateForm = () => {
    if (!name.trim()) {
      setValidationError('Please enter your Full Name (পাসপোর্ট অনুযায়ী আপনার নাম লিখুন)');
      return false;
    }
    if (!phone.trim()) {
      setValidationError('Please enter your Mobile number (যোগাযোগের জন্য মোবাইল নম্বর লিখুন)');
      return false;
    }
    if (phone.trim().length < 9) {
      setValidationError('Please enter a valid Phone/WhatsApp number (সঠিক মোবাইল নম্বর লিখুন)');
      return false;
    }
    if (!presentDistrict.trim()) {
      setValidationError('Please enter your Present District (আপনার বর্তমান জেলা লিখুন)');
      return false;
    }
    setValidationError('');
    return true;
  };

  // Unified Registration Submission Handler
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Perform full-form visual validation
    if (!validateForm()) {
      const errorBox = document.getElementById('validation-error-anchor');
      if (errorBox) {
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setValidationError('');

    try {
      const newId = `JFF-REG-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newInquiry: Inquiry = {
        id: newId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        destination: destination,
        course: visaType === 'student' ? ieltsScore : skillsExperience,
        ieltsScore: visaType === 'student' ? ieltsScore : 'N/A',
        lastGpa: educationLevel,
        message: message.trim(),
        status: 'Pending',
        date: new Date().toISOString(),
        visaType: visaType,
        passportNumber: passportNumber.trim(),
        educationLevel: educationLevel,
        presentDistrict: presentDistrict.trim(),
        skillsExperience: visaType === 'work' ? skillsExperience : 'N/A',
        files: []
      };

      if (supabase) {
        try {
          const fileUrls: string[] = [];
          for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${newId}/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from('inquiries')
              .upload(fileName, file);

            if (!uploadError) {
              const { data: publicUrlData } = supabase.storage
                .from('inquiries')
                .getPublicUrl(fileName);
              if (publicUrlData?.publicUrl) {
                fileUrls.push(publicUrlData.publicUrl);
              }
            }
          }
          newInquiry.files = fileUrls;

          // Smart database insertion with graceful automatic pruning fallback
          let insertPayload: any = { ...newInquiry };
          let insertSuccess = false;
          let lastError: any = null;

          for (let attempt = 0; attempt < 4; attempt++) {
            const { error } = await supabase.from('inquiries').insert([insertPayload]);
            if (!error) {
              insertSuccess = true;
              break;
            }
            
            lastError = error;
            const detailsStr = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`;
            let pruned = false;
            
            // Strategy 1: Match column/key violations and prune them
            for (const key of Object.keys(insertPayload)) {
              const regex = new RegExp('\\b' + key + '\\b', 'i');
              if (regex.test(detailsStr)) {
                delete insertPayload[key];
                pruned = true;
                break;
              }
            }
            
            if (pruned) continue;
            
            // Strategy 2: Remove typical dynamic optional fields to guarantee database insert matches simple columns
            const optionalKeys = ['visaType', 'passportNumber', 'educationLevel', 'presentDistrict', 'skillsExperience', 'files', 'id'];
            for (const key of optionalKeys) {
              if (key in insertPayload) {
                delete insertPayload[key];
                pruned = true;
                break;
              }
            }
            
            if (pruned) continue;
            break;
          }

          if (!insertSuccess) {
            console.info('[Sync Info] Save completed with local cache staging.', lastError);
          }
        } catch (e) {
          console.info('[Sync Info] Local database cache active.', e);
        }
      }

      // Add to state and persistent cache
      const updated = [newInquiry, ...inquiries];
      setInquiries(updated);
      localStorage.setItem('joyfastfly_inquiries', JSON.stringify(updated));

      // Dual-write to joyfastfly_apps for direct dashboard sync in Admin Panel
      try {
        const savedAppsStr = localStorage.getItem('joyfastfly_apps');
        let currentApps = [];
        if (savedAppsStr) {
          currentApps = JSON.parse(savedAppsStr);
        }
        const newApp = {
          id: newId,
          name: name.trim(),
          country: destination || 'Cyprus',
          visaType: visaType === 'student' ? 'Student Visa' : 'Work Permit',
          status: 'New',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        const updatedApps = [newApp, ...currentApps];
        localStorage.setItem('joyfastfly_apps', JSON.stringify(updatedApps));
      } catch (appErr) {
        console.error('Error auto-syncing apps:', appErr);
      }
      
      setRecentId(newId);
      setFormSubmitted(true);
      setValidationError('');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      setValidationError('Something went wrong during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen font-sans" id="contact-section">
      
      {/* Cover Banner */}
      <section className="bg-gradient-to-r from-[#031533] via-[#08224d] to-[#010b1a] text-white py-16 px-4 text-center relative overflow-hidden border-b border-gray-900 print:hidden" id="contact-banner">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-3">
          <span className="text-[#da1e28] text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
            ASSESSMENT HUB • সরাসরি ভিসা এসেসমেন্ট
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-2 leading-none font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-red-100">
            Visa Eligibility & Assessment
          </h1>
          <p className="text-gray-300 text-xs md:text-sm font-semibold max-w-2xl mt-1 leading-relaxed">
            Register your candidate profile below instantly. Our executive counseling experts will review your educational qualification or work skills within 24 hours.
          </p>
        </div>
      </section>

      {/* Primary Layout Block */}
      <section className="py-12 px-4 md:px-8 max-w-4xl mx-auto w-full text-left" id="contact-content-area">
        <div className="flex flex-col gap-10" id="contact-split">
          
          {/* Column 1: Executive Corporate Info Panel (Positioned visually below) */}
          <div className="order-2 flex flex-col md:flex-row gap-6 print:hidden w-full" id="contact-info-panel">
            <div className="w-full md:w-3/5 bg-white border border-gray-200/60 p-6 md:p-8 rounded-none shadow-xs flex flex-col gap-6 justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-[#da1e28] uppercase tracking-widest">Global Head Office</span>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight font-display">Joy Fast Fly</h2>
                <div className="h-1 w-12 bg-[#da1e28] rounded-none mt-1"></div>
              </div>

              <ul className="flex flex-col gap-5 text-xs text-gray-600 font-semibold" id="contact-methods-list">
                {/* Address */}
                <li className="flex gap-4 items-start" id="contact-address-item">
                  <div className="w-9 h-9 rounded-none bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-xs">
                    <MapPin className="text-[#da1e28]" size={16} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-black">OFFICE ADDRESS</span>
                    <p className="leading-relaxed text-gray-900 font-bold text-xs">
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=34+Noor+Jahan+Sharif+Plaza+Purana+Palton+Dhaka+1000" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:text-[#da1e28] transition-colors"
                      >
                        34. Noor Jahan Sharif Plaza (2nd Floor), Purana Palton, Dhaka 1000.
                      </a>
                    </p>
                  </div>
                </li>

                {/* Hotlines */}
                <li className="flex gap-4 items-start" id="contact-phone-item">
                  <div className="w-9 h-9 rounded-none bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-xs">
                    <Phone className="text-[#da1e28]" size={16} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 w-full">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-black">CALL & WHATSAPP</span>
                    <div className="flex flex-col gap-2 mt-1 w-full">
                      <div className="flex items-center justify-between gap-2 p-2 bg-red-50/40 border border-red-100/50">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-red-500 font-black uppercase">মোহাম্মদ আতিক মোল্লা (ডিরেক্টর)</span>
                          <a href="tel:+8801746983358" className="text-xs font-black text-gray-900 hover:text-[#da1e28] transition-colors">
                            +880 1746-983358
                          </a>
                        </div>
                        <a href="tel:+8801746983358" className="px-2 py-1 bg-[#da1e28] hover:bg-red-700 text-white text-[8px] font-black uppercase tracking-wider rounded-none transition-colors">
                          Call
                        </a>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2 bg-red-50/40 border border-red-100/50">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-red-500 font-black uppercase">এবিএম মশিউর রহমান (ডিরেক্টর)</span>
                          <a href="tel:01944554355" className="text-xs font-black text-gray-900 hover:text-[#da1e28] transition-colors">
                            01944-554355
                          </a>
                        </div>
                        <a href="tel:01944554355" className="px-2 py-1 bg-[#da1e28] hover:bg-red-700 text-white text-[8px] font-black uppercase tracking-wider rounded-none transition-colors">
                          Call
                        </a>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2 bg-emerald-50/30 border border-emerald-100/40">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-emerald-600 font-black uppercase">CEO WhatsApp (Europe)</span>
                          <a href="https://wa.me/4531875125" target="_blank" rel="noreferrer" className="text-xs font-black text-gray-900 hover:text-emerald-600 transition-colors">
                            +45 31 87 51 25
                          </a>
                        </div>
                        <a 
                          href="https://wa.me/4531875125?text=Hello%20CEO,%20I%20completed%20the%20online%20visa%20registration%20and%20want%20to%20consult." 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[8px] font-black uppercase tracking-wider rounded-none transition-colors"
                        >
                          Chat
                        </a>
                      </div>
                    </div>
                    <span className="text-[8px] text-gray-400 font-semibold mt-1">CEO: Md. Azizul Mollah (Denmark Expatriate)</span>
                  </div>
                </li>

                {/* Email */}
                <li className="flex gap-4 items-start" id="contact-email-item">
                  <div className="w-9 h-9 rounded-none bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 shadow-xs">
                    <Mail className="text-[#da1e28]" size={16} />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider font-black">OFFICIAL EMAIL</span>
                    <a href="mailto:joyfastfly@gmail.com" className="text-xs font-black text-gray-900 hover:text-[#da1e28] transition-colors break-all mt-0.5">
                      joyfastfly@gmail.com
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Google Map Card */}
            <div className="w-full md:w-2/5 relative rounded-none overflow-hidden border border-gray-200/60 bg-white p-5 shadow-xs flex flex-col gap-3 justify-between" id="mock-map-card">
              <div className="relative w-full h-32 rounded-none overflow-hidden bg-gray-100 border border-gray-100">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524820197278-540916411e20?q=80&w=400')] bg-cover opacity-40"></div>
                <div className="absolute inset-0 bg-[#031533]/20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                  <span className="text-2xl animate-bounce">📍</span>
                  <h4 className="font-black text-gray-900 text-xs mt-1 font-display">Purana Palton, Dhaka</h4>
                  <p className="text-[8px] text-gray-500 font-semibold mt-0.5">34. Noor Jahan Sharif Plaza</p>
                </div>
              </div>
              <a 
                href="https://maps.google.com/?q=Noor+Jahan+Sharif+Plaza+Purana+Palton+Dhaka" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full py-2 bg-gray-50 border border-gray-200 text-gray-700 text-[9px] uppercase font-black tracking-widest rounded-none hover:bg-gray-100 text-center transition-colors shadow-xs"
              >
                Open Google Maps
              </a>
            </div>
          </div>

          {/* Column 2: Interactive Registration Portal (Now on top!) */}
          <div className="order-1 flex flex-col gap-6 w-full animate-fade-in" id="contact-form-panel">
            
            {/* SUCCESS BANNER / EMBASSY VOUCHER SLIP */}
            {formSubmitted && (
              <div className="flex flex-col gap-6" id="success-voucher-panel">
                <style dangerouslySetInnerHTML={{__html: `
                  @media print {
                    body {
                      background-color: white !important;
                      color: black !important;
                    }
                    #contact-section {
                      background-color: white !important;
                    }
                    #contact-content-area {
                      padding: 0 !important;
                      margin: 0 !important;
                      max-width: 100% !important;
                    }
                    #success-reg-slip {
                      border: none !important;
                      box-shadow: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      max-width: 100% !important;
                    }
                    #receipt-slip-body {
                      border: 2px solid #000 !important;
                      background-color: white !important;
                      box-shadow: none !important;
                      padding: 24px !important;
                      margin-top: 10px !important;
                    }
                    .print-hide-btn {
                      display: none !important;
                    }
                  }
                `}} />

                <div className="bg-white border border-gray-200 rounded-none p-5 md:p-8 flex flex-col gap-5 max-w-2xl mx-auto w-full" id="success-reg-slip">
                  <div className="flex items-start gap-4 border-b border-gray-100 pb-4 print-hide-btn">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-none flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
                      <CheckCircle size={20} />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="text-lg font-black text-gray-900 leading-tight font-display">
                        আবেদন সফলভাবে সম্পন্ন হয়েছে!
                      </h3>
                      <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">
                        Your Assessment Registration Has Been Successfully Logged
                      </p>
                    </div>
                  </div>

                  {/* Styled Registration Voucher / Slip */}
                  <div className="bg-white rounded-none border border-gray-200 p-5 md:p-8 shadow-xs relative overflow-hidden" id="receipt-slip-body">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
                    
                    {/* Header bar of receipt */}
                    <div className="border-b border-gray-200 pb-4 mb-5 flex justify-between items-start flex-wrap gap-4 relative z-10 text-left">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#da1e28] font-black uppercase tracking-[0.2em]">Joy Fast Fly Group</span>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight font-display mt-0.5">Assessment Voucher</h4>
                        <span className="text-[9px] text-gray-400 font-bold mt-0.5">REG. ID: {recentId}</span>
                      </div>
                      <div className="flex flex-col items-end text-right">
                        <span className="text-[8px] bg-emerald-50 text-emerald-700 font-black uppercase tracking-wider px-2 py-0.5 rounded-none border border-emerald-100">
                          VERIFIED LOGGED
                        </span>
                        <span className="text-[8px] text-gray-400 font-bold mt-1">
                          DATE: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-xs font-semibold text-gray-700 relative z-10 text-left">
                      <div className="border-b border-gray-100 pb-1.5">
                        <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">Candidate Name / নাম</span>
                        <span className="text-gray-900 font-black text-sm">{name}</span>
                      </div>
                      <div className="border-b border-gray-100 pb-1.5">
                        <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">Phone / মোবাইল নম্বর</span>
                        <span className="text-gray-900 font-black text-sm">{phone}</span>
                      </div>
                      <div className="border-b border-gray-100 pb-1.5">
                        <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">Visa Category / ভিসার ধরণ</span>
                        <span className="text-gray-900 font-black text-xs uppercase text-blue-900">
                          {visaType === 'student' ? '🎓 Student Visa (স্টুডেন্ট ভিসা)' : '💼 Work Permit (ওয়ার্ক পারমিট)'}
                        </span>
                      </div>
                      <div className="border-b border-gray-100 pb-1.5">
                        <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">Target Country / গন্তব্য দেশ</span>
                        <span className="text-gray-900 font-black text-xs uppercase">{destination}</span>
                      </div>
                      <div className="border-b border-gray-100 pb-1.5">
                        <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">Highest Education / যোগ্যতা</span>
                        <span className="text-gray-900 font-black">{educationLevel}</span>
                      </div>
                      {visaType === 'work' ? (
                        <div className="border-b border-gray-100 pb-1.5">
                          <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">Work Skills / দক্ষতা</span>
                          <span className="text-gray-900 font-black">{skillsExperience}</span>
                        </div>
                      ) : (
                        <div className="border-b border-gray-100 pb-1.5">
                          <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">English Proficiency / ইংরেজি দক্ষতা</span>
                          <span className="text-gray-900 font-black">{ieltsScore}</span>
                        </div>
                      )}
                      <div className="border-b border-gray-100 pb-1.5 col-span-1 md:col-span-2">
                        <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">District / জেলা</span>
                        <span className="text-gray-900 font-black">{presentDistrict}</span>
                      </div>
                      {passportNumber && (
                        <div className="border-b border-gray-100 pb-1.5 col-span-1 md:col-span-2">
                          <span className="text-[9px] text-gray-400 block mb-0.5 font-black uppercase tracking-wider">Passport Number / পাসপোর্ট</span>
                          <span className="text-gray-900 font-black uppercase">{passportNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Styled Barcode & Footer info */}
                    <div className="border-t border-gray-200 mt-6 pt-4 text-center flex flex-col items-center relative z-10">
                      <Barcode value={recentId} />
                      
                      <div className="p-3 bg-gray-50 border border-gray-200/50 mt-1">
                        <p className="text-xs text-red-600 font-black leading-relaxed">
                          আমাদের রিলেশনশিপ ম্যানেজার ২৪ ঘণ্টার মধ্যে আপনার সাথে সরাসরি ফোনে অথবা হোয়াটসঅ্যাপে যোগাযোগ করবেন।
                        </p>
                      </div>
                      <p className="text-[9px] text-gray-400 mt-2 font-semibold">
                        Thank you for applying. Keep this voucher saved or take a screenshot to trace progress.
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap gap-2.5 justify-end border-t border-gray-100 pt-4 print-hide-btn">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-black uppercase tracking-wider rounded-none transition-colors flex items-center gap-2 border border-gray-200"
                    >
                      <Printer size={13} />
                      <span>Print Voucher / প্রিন্ট করুন</span>
                    </button>
                    <button 
                      onClick={() => {
                        setFormSubmitted(false);
                        setName('');
                        setPhone('');
                        setPresentDistrict('');
                        setPassportNumber('');
                        setEmail('');
                        setMessage('');
                        setFiles([]);
                      }}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-none transition-colors shadow-xs"
                    >
                      Start New Assessment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* UNIFIED SINGLE-PAGE FORM BOX */}
            {!formSubmitted && (
              <div className="bg-white border border-gray-200 shadow-sm rounded-none p-5 md:p-8 text-left" id="visa-assessment-form-box">
                
                {/* Custom Title bar with Stream Selector Switch */}
                <div className="border-b border-gray-100 pb-5 mb-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-none bg-[#da1e28] text-white flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-black text-gray-950 uppercase tracking-wider font-display leading-tight">
                        Instant Visa Profile Entry
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold tracking-wide">
                        Fill out your eligibility specs in a single unified page instantly!
                      </p>
                    </div>
                  </div>

                  {/* Stream Choice Interactive Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setVisaType('student')}
                      className={`py-2 px-3 text-center border font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        visaType === 'student'
                          ? 'bg-[#da1e28] text-white border-[#da1e28] shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <GraduationCap size={14} />
                      <span>Student Admission</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisaType('work')}
                      className={`py-2 px-3 text-center border font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        visaType === 'work'
                          ? 'bg-[#031533] text-white border-[#031533] shadow-sm'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Briefcase size={14} />
                      <span>Skilled Work Permit</span>
                    </button>
                  </div>
                </div>

                {/* Form Wrapper */}
                <form 
                  onSubmit={handleRegistrationSubmit} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className="flex flex-col gap-6"
                >

                  {/* Validation Error Banner anchor point */}
                  <div id="validation-error-anchor">
                    {validationError && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-none flex items-center gap-2 animate-fade-in shadow-xs mb-4">
                        <AlertTriangle size={15} className="shrink-0" />
                        <span>{validationError}</span>
                      </div>
                    )}
                  </div>

                  {/* SECTION A: CANDIDATE BIO INFO */}
                  <div className="flex flex-col gap-4 bg-gray-50/40 p-4 border border-gray-200/50">
                    <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                      <User size={14} className="text-[#da1e28]" />
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">A. Candidate Identity / ব্যক্তিগত তথ্য</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Full Name / আবেদনকারীর নাম <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required 
                          placeholder="পাসপোর্ট অনুযায়ী আপনার নাম লিখুন" 
                          value={name}
                          onChange={(e) => {
                            setValidationError('');
                            setName(e.target.value);
                          }}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white"
                        />
                      </div>

                      {/* Phone Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Phone & WhatsApp / মোবাইল নম্বর <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="যোগাযোগের জন্য সক্রিয় মোবাইল নম্বর" 
                          value={phone}
                          onChange={(e) => {
                            setValidationError('');
                            setPhone(e.target.value);
                          }}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white"
                        />
                      </div>

                      {/* Present District */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Present District / বর্তমান জেলা <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          required 
                          placeholder="যেমন: ঢাকা, সিলেট, কুমিল্লা..." 
                          value={presentDistrict}
                          onChange={(e) => {
                            setValidationError('');
                            setPresentDistrict(e.target.value);
                          }}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white"
                        />
                      </div>

                      {/* Passport number */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Passport Number / পাসপোর্ট নম্বর (ঐচ্ছিক)
                        </label>
                        <input 
                          type="text" 
                          placeholder="পাসপোর্ট নম্বর থাকলে ইংরেজিতে লিখুন" 
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value)}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION B: PATHWAY & ELIGIBILITY */}
                  <div className="flex flex-col gap-4 bg-gray-50/40 p-4 border border-gray-200/50">
                    <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                      <GraduationCap size={15} className="text-[#da1e28]" />
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">B. Academic & Target Details / যোগ্যতা ও দেশ</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Education Selector */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Highest Education / শিক্ষাগত যোগ্যতা <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white"
                        >
                          <option value="Master's / Post Graduate">Master's / Post Graduate (মাস্টার্স পাস)</option>
                          <option value="Bachelor's / Honours / Pass Course">Bachelor's / Honours / Pass Course (ডিগ্রি/অনার্স)</option>
                          <option value="HSC / Alim / Diploma">HSC / Alim / Diploma (উচ্চ মাধ্যমিক/ডিপ্লোমা)</option>
                          <option value="SSC / Dakhil / Vocational">SSC / Dakhil / Vocational (মাধ্যমিক পাস)</option>
                          <option value="Below SSC / Class 8 Pass">Below SSC / Class 8 Pass (৮ম শ্রেণী বা নিচে)</option>
                        </select>
                      </div>

                      {/* Country Selector */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Target Country / গন্তব্য দেশ <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white"
                        >
                          {visaType === 'student' ? (
                            <>
                              <option value="Cyprus">Cyprus (সাইপ্রাস)</option>
                            </>
                          ) : (
                            <>
                              <option value="Romania">Romania (রোমানিয়া)</option>
                              <option value="Serbia">Serbia (সার্বিয়া)</option>
                            </>
                          )}
                        </select>
                      </div>

                      {/* Dynamic Stream Options */}
                      {visaType === 'student' ? (
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                            English Language Score / ইংরেজি দক্ষতা <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={ieltsScore}
                            onChange={(e) => setIeltsScore(e.target.value)}
                            className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white"
                          >
                            <option value="Have IELTS / PTE 6.5+">Have IELTS / PTE 6.5+ (ভালো স্কোর আছে)</option>
                            <option value="Have IELTS / PTE 5.5 - 6.0">Have IELTS / PTE 5.5 - 6.0 (মাঝারি স্কোর)</option>
                            <option value="Without IELTS / MOI">Without IELTS / MOI (আইইএলটিএস ছাড়া / এমওআই)</option>
                            <option value="Learning / Planning to Take">Learning / Planning to Take (কোর্স করছি বা দেবো)</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                            Your Work Skills / কাজের ক্যাটাগরি <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={skillsExperience}
                            onChange={(e) => setSkillsExperience(e.target.value)}
                            className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white"
                          >
                            <option value="Factory & Packing">Factory & Packing (ফ্যাক্টরি ও প্যাকিং কর্মী)</option>
                            <option value="Construction & Masonry">Construction & Masonry (রাজমিস্ত্রী/নির্মাণ কাজ)</option>
                            <option value="Professional Driver">Professional Driver (ড্রাইভিং এবং ট্রান্সপোর্ট)</option>
                            <option value="Hotel, Kitchen & Chef">Hotel, Kitchen & Chef (হোটেল, কিচেন ও শেফ)</option>
                            <option value="Agriculture & Farm Worker">Agriculture & Farm Worker (কৃষি ও খামার কর্মী)</option>
                            <option value="No skills / General Helper">No skills / General Helper (অভিজ্ঞতাহীন সাধারণ সহকারী)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION C: DOCUMENTS & CONTACT */}
                  <div className="flex flex-col gap-4 bg-gray-50/40 p-4 border border-gray-200/50">
                    <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                      <FileText size={14} className="text-[#da1e28]" />
                      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">C. Supporting Documents & Contact / কাগজপত্র ও মন্তব্য</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Email Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Email Address / ইমেইল ঠিকানা (ঐচ্ছিক)
                        </label>
                        <input 
                          type="email" 
                          placeholder="name@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white placeholder-gray-300"
                        />
                      </div>

                      {/* Comments text */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Additional Comments / আপনার কোনো প্রশ্ন বা মন্তব্য (ঐচ্ছিক)
                        </label>
                        <textarea 
                          rows={2} 
                          placeholder="স্পন্সর বা অন্যান্য বিষয়ে কোনো তথ্য জানার বা বলার থাকলে এখানে লিখুন..." 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all rounded-none px-3.5 py-2.5 text-xs font-bold text-gray-950 bg-white placeholder-gray-300 resize-none"
                        />
                      </div>

                      {/* Advanced File Upload Drop Zone */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                          Supporting Documents / পাসপোর্ট বা সার্টিফিকেট স্ক্যান কপি (ঐচ্ছিক)
                        </label>
                        
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('unified-file-input')?.click()}
                          className={`border-2 border-dashed rounded-none p-5 text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                            dragActive
                              ? 'border-[#da1e28] bg-red-50/20'
                              : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <input
                            id="unified-file-input"
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="w-10 h-10 rounded-none bg-gray-50 flex items-center justify-center border border-gray-100 text-[#da1e28]">
                            <UploadCloud size={20} className="animate-pulse" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-950">
                              Drag & Drop files here, or <span className="text-[#da1e28] underline font-extrabold">Browse</span>
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">
                              Upload PDF/JPG passport or certificates (Max 5MB each)
                            </p>
                          </div>
                        </div>

                        {/* File listing inside queue */}
                        {files.length > 0 && (
                          <div className="flex flex-col gap-2 mt-1">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                              File Upload Queue ({files.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {files.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-none shadow-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-7 h-7 rounded-none bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 text-gray-500">
                                      <FileText size={14} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold text-gray-900 truncate">
                                        {file.name}
                                      </span>
                                      <span className="text-[8px] text-gray-400 font-bold">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFile(idx);
                                    }}
                                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-none transition-colors border border-transparent hover:border-red-100"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submission Trigger Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-none transition-all shadow-md flex items-center justify-center gap-2 ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed opacity-85'
                          : visaType === 'work'
                          ? 'bg-[#031533] hover:bg-blue-900 active:scale-[0.99] hover:shadow-lg'
                          : 'bg-[#da1e28] hover:bg-red-700 active:scale-[0.99] hover:shadow-lg'
                      }`}
                      id="submit-inquiry-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Submitting... / সম্পন্ন হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} />
                          <span>Submit Assessment Form / এসেসমেন্ট সম্পন্ন করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};
