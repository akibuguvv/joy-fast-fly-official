import { CountryInfo, VisaCategory, Course } from './types';

export const COUNTRIES: CountryInfo[] = [
  {
    id: 'cyprus',
    name: 'Cyprus',
    code: 'CY',
    flagUrl: 'https://flagcdn.com/w320/cy.png',
    bgImage: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=1200',
    highlights: [
      'Affordable tuition with beautiful lifestyle and high visa success rate.',
      'Option to study without IELTS under MOI or college test',
      'Excellent hospitality and business management pathways',
      'Part-time job rights (up to 20 hours/week) for international students'
    ],
    intakes: ['2 - 3 Months'],
    requirements: {
      education: 'Minimum HSC / Alim completed (GPA 2.50+)',
      ielts: 'No IELTS',
      funds: 'Bank statement of approx. €4,500 to €6,000 (Very simple documentation)'
    },
    popularCourses: ['Hotel & Tourism Management', 'Business Administration', 'Culinary Arts', 'Computer Science'],
    tuitionFee: '€3,000 - 6,000 per year',
    visaType: 'student'
  },
  {
    id: 'serbia',
    name: 'Serbia',
    code: 'RS',
    flagUrl: 'https://flagcdn.com/w320/rs.png',
    bgImage: 'https://images.unsplash.com/photo-1555979864-747248e21e25?q=80&w=1200',
    highlights: [
      'Official work permit with guaranteed salary and easy process.',
      'Renewable employment visa with guaranteed monthly salary',
      'Great path to live and work in the European continent',
      'Free or subsidized accommodation provided by many employers'
    ],
    intakes: ['2 - 3 Months'],
    requirements: {
      education: 'Minimum Class 8 / JSC or SSC completed. Practical work experience is highly preferred.',
      ielts: 'No IELTS Required',
      funds: 'No block funds or massive solvency proof. Low, flexible contract processing fees.'
    },
    popularCourses: ['Construction & Masonry', 'Factory & Packing Workers', 'Professional Drivers', 'Agriculture & Farms'],
    tuitionFee: 'Contract/Processing fees apply',
    visaType: 'work'
  },
  {
    id: 'romania',
    name: 'Romania',
    code: 'RO',
    flagUrl: 'https://flagcdn.com/w320/ro.png',
    bgImage: 'https://images.unsplash.com/photo-1568291843233-64e0023a8542?q=80&w=1200',
    highlights: [
      'Europe Work Permit with great job opportunities.',
      'Excellent employment opportunities with legal contracts',
      'Free accommodation, food allowance, and health insurance provided',
      'Highly stable pathway with simple documents and high visa success rate'
    ],
    intakes: ['3 - 4 Months'],
    requirements: {
      education: 'SSC completed or practical work experience (Must send a short work demonstration video)',
      ielts: 'No IELTS Required',
      funds: 'Flexible and secure processing fee. No bank statement or solvent block funds needed.'
    },
    popularCourses: ['Garments & Textile', 'Logistics & Warehousing', 'Food Processing & Packers', 'Construction & Masonry'],
    tuitionFee: 'Contract/Processing fees apply',
    visaType: 'work'
  },
  {
    id: 'greece',
    name: 'Greece',
    code: 'GR',
    flagUrl: 'https://flagcdn.com/w320/gr.png',
    bgImage: 'https://images.unsplash.com/photo-1503152394-c571994fd383?q=80&w=1200',
    highlights: [
      'Official Work Permit for Agriculture and seasonal sectors.',
      'Stable European employment with social security (EFKA)',
      'Opportunities in Farming, Hospitality, and Construction',
      'Legal residency pathway with renewable work contracts'
    ],
    intakes: ['3 - 5 Months'],
    requirements: {
      education: 'Minimum Class 8 or SSC completed. Practical experience in relevant field.',
      ielts: 'No IELTS Required',
      funds: 'Processing fees apply. Minimal financial documentation needed.'
    },
    popularCourses: ['Agriculture & Harvesting', 'Hotel & Restaurant Services', 'Construction Help', 'Manufacturing'],
    tuitionFee: 'Contract/Processing fees apply',
    visaType: 'work'
  }
];

export const getMergedCountries = (includeInactive = false): CountryInfo[] => {
  if (typeof window === 'undefined') return COUNTRIES;
  try {
    const saved = localStorage.getItem('joyfastfly_countries_added');
    const added: CountryInfo[] = saved ? JSON.parse(saved) : [];
    
    const overridesSaved = localStorage.getItem('joyfastfly_countries_status_override');
    const overrides: Record<string, boolean> = overridesSaved ? JSON.parse(overridesSaved) : {};
    
    const combined = [...COUNTRIES, ...added].map(c => {
      const countryId = c.id.toLowerCase();
      if (countryId in overrides) {
        return { ...c, isActive: overrides[countryId] };
      }
      if (c.isActive === undefined) {
        return { ...c, isActive: true };
      }
      return c;
    });

    if (includeInactive) {
      return combined;
    }
    return combined.filter(c => c.isActive !== false);
  } catch (e) {
    console.error('Failed to load merged countries', e);
    return COUNTRIES;
  }
};

export const VISA_CATEGORIES: VisaCategory[] = [
  {
    id: 'student',
    title: 'Student Visa',
    subtitle: 'Study in Abroad',
    description: 'Generally intended for international education pathways. We provide complete guidance from admission, offer letter, to visa success.',
    iconName: 'GraduationCap',
    bgImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200'
  },
  {
    id: 'visitor',
    title: 'B-1 & B-2 Visa',
    subtitle: 'Visitor & Business',
    description: 'Visa that grants the hold of temporary business trips or leisure travel. Perfect for high success visa processing for conferences and family meetings.',
    iconName: 'Building',
    bgImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200'
  },
  {
    id: 'visit',
    title: 'Visit Visa',
    subtitle: 'Tourism & Holiday',
    description: 'Explore breathtaking world locations or meet with loved ones. We prepare professional cover letters, travel itineraries, and financial dossiers.',
    iconName: 'PlaneTakeoff',
    bgImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200'
  },
  {
    id: 'immigration',
    title: 'Immigration Visa',
    subtitle: 'Permanent Residency',
    description: 'Immigration Visas in the field of employment-sponsored and investment-based pathways. Live and work in Canada, Australia, or Europe permanently.',
    iconName: 'Globe',
    bgImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200'
  },
  {
    id: 'inquiry',
    title: 'Free Visa Inquiry',
    subtitle: 'Instant Evaluation',
    description: 'Get matched with appropriate countries, universities, and courses based on your GPA, IELTS, and funding capability in 60 seconds.',
    iconName: 'FileText',
    bgImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200'
  }
];

export const STEPS = [
  {
    num: '01',
    title: 'Complete Online Form',
    description: 'Collaborate with team & partners. Share your educational details and desired study fields with our expert consultants.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400'
  },
  {
    num: '02',
    title: 'Documents & Payments',
    description: 'Any nonimmigrant visa applicant can pay their tuition or application fee. We compile all required financial logs and certificates.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400'
  },
  {
    num: '03',
    title: 'Direct Interview Prep',
    description: 'Questions are specific questions that directly relate to your goals. We conduct detailed mock sessions for embassy interviews.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400'
  },
  {
    num: '04',
    title: 'Receive Visa',
    description: 'Compare visas to visit, work, study or join a family member already. Collect your passport with the stamped visa of your dream country.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400'
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    name: 'Bachelor of Computer Science',
    level: 'Bachelor (UG)',
    duration: '3 - 4 Years',
    tuition: 'CAD 18,000 / year',
    requirements: 'HSC with GPA 4.0/5.0, IELTS 6.0',
    discipline: 'IT & Engineering'
  },
  {
    id: 'c2',
    name: 'Master of Business Administration (MBA)',
    level: 'Master (PG)',
    duration: '1 - 2 Years',
    tuition: '£14,500 / year',
    requirements: 'Bachelor Degree CGPA 2.75+, IELTS 6.5',
    discipline: 'Business & Law'
  },
  {
    id: 'c3',
    name: 'MSc in Cybersecurity and Networking',
    level: 'Master (PG)',
    duration: '2 Years',
    tuition: 'AUD 28,000 / year',
    requirements: 'IT or Science Bachelor CGPA 3.0+, IELTS 6.5',
    discipline: 'IT & Engineering'
  },
  {
    id: 'c4',
    name: 'Master in Public Health (MPH)',
    level: 'Master (PG)',
    duration: '1.5 - 2 Years',
    tuition: 'USD 24,000 / year',
    requirements: 'Health/Science Graduate, IELTS 6.5',
    discipline: 'Medical & Life Sciences'
  },
  {
    id: 'c5',
    name: 'Bachelor of Business Administration',
    level: 'Bachelor (UG)',
    duration: '3 Years',
    tuition: '€6,500 / year',
    requirements: 'HSC Completed, IELTS 5.5 or MOI letter',
    discipline: 'Business & Law'
  },
  {
    id: 'c6',
    name: 'MSc in Sustainable Energy Systems',
    level: 'Master (PG)',
    duration: '2 Years',
    tuition: 'SEK 110,000 / year',
    requirements: 'BSc Engineering, IELTS 6.5',
    discipline: 'IT & Engineering'
  }
];

export const PARTNERS = [
  { name: 'Travel Link', text: 'Travel' },
  { name: 'Travel Slogan', text: 'Travel' },
  { name: 'Your Travel', text: 'Your Travel' },
  { name: 'Travel Go', text: 'TRAVELGO' }
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'Visa Success',
    title: 'Passport Handover Ceremony',
    studentName: 'Shamim ur Rahman',
    university: 'European University Cyprus',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    category: 'Visa Success',
    title: 'Schengen Student Visa Success',
    studentName: 'Tahmid Hasan',
    university: 'University of Debrecen, Hungary',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    category: 'Student Activities',
    title: 'Pre-Departure Orientation Program',
    studentName: 'Fall Intake',
    university: 'Joy Fast Fly Dhaka Office',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 4,
    category: 'Student Activities',
    title: 'IELTS Preparation & Class Discussion',
    studentName: 'Weekend Batch',
    university: 'IELTS Center',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 5,
    category: 'Campus Life',
    title: 'International Student Gathering on Campus',
    studentName: 'Campus Life',
    university: 'Schengen Area University',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 6,
    category: 'Campus Life',
    title: 'Group Study at University Library',
    studentName: 'Campus Life',
    university: 'European Campus Library',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 7,
    category: 'Office Events',
    title: 'Joy Fast Fly Seminar with Delegates',
    studentName: 'Seminar Event',
    university: 'Dhaka Office',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 8,
    category: 'Office Events',
    title: 'Career & Study Abroad Consultation Day',
    studentName: 'Consultation Day',
    university: 'Head Office',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600'
  }
];
