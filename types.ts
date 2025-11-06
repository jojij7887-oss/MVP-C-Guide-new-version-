


export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'STUDENT' | 'COLLEGE_ADMIN';
  collegeId?: string;
  profilePhotoUrl?: string;
  favoriteCollegeIds: string[];
  favoriteCourseIds: string[];
  favoriteEventIds: string[];
  applications: Application[]; // This will be filtered from a central list
  notifications: Notification[];
  walletTransactions: Transaction[];
}

export interface CommunicationEntry {
    id: string;
    date: string;
    action: string;
    notes: string;
}

export interface Application {
    id: string;
    userId: string;
    collegeId: string;
    collegeName: string;
    course: string;
    status: 'Pending' | 'Verified' | 'Appointment Scheduled' | 'Confirmed' | 'Rejected';
    submittedDate: string;
    applicantName: string;
    applicantEmail: string;
    contactNumber: string;
    documentUrls: {
        cert10th?: string;
        cert12th?: string;
    };
    appointmentDetails: {
        date: string;
        time: string;
        location: string;
    } | null;
    leadScore: 'Hot' | 'Warm' | 'Cold' | null;
    assignedTo: string | null;
    communicationHistory: CommunicationEntry[];
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'credit' | 'debit';
}

export type NotificationType =
    // Admin types
    'application' | 'student' | 'system' | 'payment' |
    // Student types
    'status' | 'message' | 'offer' | 'admission' | 'update';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    timestamp: string;
    link?: string;
}

export interface FeaturedAd {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  description?: string;
  targetLink?: string;
  startDate?: string;
  endDate?: string;
  category: 'Scholarship' | 'Event' | 'Notice' | 'Others';
  status: 'Active' | 'Inactive';
}

export interface CollegeAd {
  id: string;
  title: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  description?: string;
  targetLink?: string;
  category: 'Courses' | 'Events' | 'Achievements' | 'Notices' | 'Others';
  status: 'Active' | 'Inactive';
}


export interface CourseFeaturedAd {
  adTitle: string;
  adDescription: string;
  mediaUrls: string[];
  tags: string[];
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: string;
  description: string;
  isPremium?: boolean;
  isNew?: boolean;
  enrollmentCount: number;
  eligibility?: string;
  admissionOpenDate?: string;
  admissionEndDate?: string;
  totalSeats?: number;
  featuredAd?: CourseFeaturedAd;
  courseImage?: string;
}

export interface CollegeEvent {
  id: string;
  mediaUrl: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  phone?: string;
  photoUrl: string;
  logoUrl: string;
  description: string;
  shortDescription: string;
  courses: Course[];
  admissionOpenDate: string;
  admissionCloseDate: string;
  events: CollegeEvent[];
  featuredAds: FeaturedAd[];
  collegeAds: CollegeAd[];
  isFeatured?: boolean;
  isPaid?: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
  admissionFee?: number;
  upiId?: string;
}

export interface LoanProvider {
    id: string;
    name: string;
    interestRate: string;
    terms: string;
    logoUrl: string;
    applyLink: string;
}

export interface ChatMessage {
  id: string;
  applicationId: string;
  sender: 'student' | 'admin';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface PaymentTransaction {
    paymentId: string;
    applicationId: string;
    studentId: string;
    studentName: string;
    collegeId: string;
    collegeName: string;
    courseName: string;
    amount: number;
    upiId: string;
    paymentDate: string; // ISO string
    status: 'Pending' | 'Confirmed' | 'Failed';
    screenshotUrl?: string;
    verifiedByCollege: 'Yes' | 'No';
    remarks?: string;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl?: string;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorPhotoUrl?: string;
  content: string;
  tags: string[];
  timestamp: string;
  lastActivity: string;
  views: number;
  replies: ForumReply[];
}