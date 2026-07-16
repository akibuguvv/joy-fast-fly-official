export interface NewsPost {
  id?: string;
  title: string;
  body: string;
  mediaUrl: string;
  date: string;
  fileType: 'image' | 'video';
  category: string;
  readTime?: string;
  author?: string;
  isFeatured?: boolean;
  highlights?: string[];
  studentDetails?: {
    name: string;
    country: string;
    appliedFor: string;
    university: string;
    intake: string;
  };
}

export interface CountryInfo {
  id: string;
  name: string;
  code: string;
  flagUrl: string;
  bgImage: string;
  highlights: string[];
  intakes: string[];
  requirements: {
    education: string;
    ielts: string;
    funds: string;
  };
  popularCourses: string[];
  tuitionFee: string;
  visaType?: 'student' | 'work';
  isActive?: boolean;
}

export interface VisaCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  bgImage: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  course: string;
  ieltsScore: string;
  lastGpa: string;
  message: string;
  status: 'Pending' | 'Counselling Scheduled' | 'Document Review' | 'Submitted';
  date: string;
  visaType?: 'student' | 'work';
  passportNumber?: string;
  educationLevel?: string;
  presentDistrict?: string;
  skillsExperience?: string;
  files?: string[];
}

export interface Course {
  id: string;
  name: string;
  level: string;
  duration: string;
  tuition: string;
  requirements: string;
  discipline: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  studentName: string;
  university: string;
}
