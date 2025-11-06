


import { College, LoanProvider, User, ForumPost } from './types';

export const COLLEGES: College[] = [
  {
    id: 'uni-1',
    name: 'Apex University of Technology',
    location: 'Silicon Valley, USA',
    phone: '1-800-555-APEX',
    photoUrl: 'https://picsum.photos/seed/uni1/800/400',
    logoUrl: 'https://picsum.photos/seed/logo1/200/200',
    shortDescription: 'A leading institution for innovation and technology.',
    description: 'Apex University of Technology is a world-renowned institution dedicated to advancing knowledge and educating students in science, technology, and other areas of scholarship that will best serve the nation and the world in the 21st century.',
    admissionOpenDate: '2024-08-01',
    admissionCloseDate: '2025-03-31',
    isFeatured: true,
    isPaid: false,
    admissionFee: 5500,
    upiId: 'apex-university@okbank',
    courses: [
      { id: 'c1-1', name: 'Computer Science', duration: '4 Years', fees: '₹16,00,000/year', description: 'Explore the depths of algorithms, data structures, and artificial intelligence.', enrollmentCount: 225, totalSeats: 250, isNew: true, eligibility: '10+2 with Physics, Chemistry, Maths (PCM) with 60% aggregate', admissionOpenDate: '2024-06-01', admissionEndDate: '2024-08-31' },
      { id: 'c1-2', name: 'Electrical Engineering', duration: '4 Years', fees: '₹15,50,000/year', description: 'Design and build the electronic systems of the future.', enrollmentCount: 178, totalSeats: 180, eligibility: '10+2 with PCM with 55% aggregate', admissionOpenDate: '2024-06-01', admissionEndDate: '2024-08-31' },
      { id: 'c1-3', name: 'Data Science', duration: '2 Years (Masters)', fees: '₹18,00,000/year', description: 'Unlock insights from massive datasets.', isPremium: true, enrollmentCount: 120, totalSeats: 120, eligibility: "Bachelor's degree in a quantitative field", admissionOpenDate: '2024-01-01', admissionEndDate: '2024-03-31',
        featuredAd: {
          adTitle: 'Master in Data Science',
          adDescription: 'Unlock the power of data. Our program offers a cutting-edge curriculum, hands-on projects, and mentorship from industry experts. Apply now to become a data leader.',
          mediaUrls: ['https://picsum.photos/seed/ad-ds1/800/400', 'https://picsum.photos/seed/ad-ds2/800/400'],
          tags: ['#1 in Rankings', 'High ROI', 'Industry Partnership']
        }
      },
    ],
    events: [
      { id: 'e1-1', title: 'Tech Fest 2024', mediaUrl: 'https://picsum.photos/seed/event1/400/300', description: 'Join us for our annual celebration of technology and innovation, featuring guest speakers from top tech companies.', date: '2024-10-25', location: 'Main Auditorium' },
      { id: 'e1-2', title: 'Annual Sports Meet', mediaUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4', description: 'A showcase of athletic talent and sportsmanship. Come cheer for your favorite teams!', date: '2024-11-15', location: 'Sports Complex' },
      { id: 'e1-3', title: 'Convocation Ceremony', mediaUrl: 'https://picsum.photos/seed/event3/400/300', description: 'Celebrating the achievements of our graduating class of 2024.', date: '2025-05-20', location: 'Graduation Hall' },
    ],
    featuredAds: [
      { 
        id: 'ad-1', 
        title: 'Early Bird Scholarship', 
        mediaUrl: 'https://picsum.photos/seed/ad-scholarship/800/450', 
        mediaType: 'image',
        description: 'Apply before August 1st to get a 10% scholarship on your first semester fees. Limited spots available!',
        category: 'Scholarship',
        status: 'Active',
        startDate: '2024-07-01',
        endDate: '2024-07-31',
      },
      { 
        id: 'ad-2', 
        title: 'Campus Tour Day', 
        mediaUrl: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4',
        mediaType: 'video',
        description: 'Join us for a virtual tour of our state-of-the-art campus. See our labs, libraries, and student life centers.',
        category: 'Event',
        status: 'Inactive',
        startDate: '2024-08-15',
        endDate: '2024-08-15',
      }
    ],
    collegeAds: [
      {
        id: 'cad-1',
        title: 'New Robotics Lab Inaugurated',
        description: 'Our new state-of-the-art robotics lab is now open for all engineering students. It features advanced equipment for AI and machine learning projects.',
        mediaUrl: 'https://picsum.photos/seed/robotics-lab/800/450',
        mediaType: 'image',
        category: 'Achievements',
        status: 'Active',
        targetLink: '#'
      },
      {
        id: 'cad-2',
        title: 'Mid-term Examination Schedule',
        description: 'The schedule for the upcoming mid-term examinations for all departments has been published. Please check the student portal for details.',
        category: 'Notices',
        status: 'Active',
      }
    ],
  },
  {
    id: 'uni-2',
    name: 'Veridian College of Arts',
    location: 'Greenwood City, USA',
    photoUrl: 'https://picsum.photos/seed/uni2/800/400',
    logoUrl: 'https://picsum.photos/seed/logo2/200/200',
    shortDescription: 'Where creativity and passion come to life.',
    description: 'Veridian College of Arts provides a vibrant and inspiring environment for students to pursue their artistic passions. Our faculty are practicing artists and scholars who are committed to helping students develop their unique creative voices.',
    admissionOpenDate: '2024-09-01',
    admissionCloseDate: '2025-05-15',
    isPaid: true,
    admissionFee: 4800,
    upiId: 'veridian-college@myupi',
    courses: [
      { id: 'c2-1', name: 'Fine Arts', duration: '3 Years', fees: '₹8,50,000/year', description: 'Master painting, sculpture, and other traditional media.', enrollmentCount: 95, totalSeats: 100, eligibility: '10+2 in any stream', admissionOpenDate: '2024-07-01', admissionEndDate: '2024-09-30' },
      { id: 'c2-2', name: 'Graphic Design', duration: '3 Years', fees: '₹9,00,000/year', description: 'Learn the principles of visual communication and digital design.', enrollmentCount: 150, totalSeats: 150, eligibility: '10+2 with a portfolio submission', admissionOpenDate: '2024-07-01', admissionEndDate: '2024-09-30',
        featuredAd: {
          adTitle: 'Creative Powerhouse: B.Des in Graphic Design',
          adDescription: 'Transform your passion for design into a profession. Join our acclaimed Graphic Design program and learn from award-winning faculty in our state-of-the-art studios.',
          mediaUrls: ['https://picsum.photos/seed/ad-gd1/800/400'],
          tags: ['Portfolio Builder', '100% Placement Asst.']
        }
      },
      { id: 'c2-3', name: 'Performing Arts', duration: '4 Years', fees: '₹9,75,000/year', description: 'Train in theatre, dance, and music performance.', enrollmentCount: 50, totalSeats: 80 }, // Missing data
    ],
    events: [
        { id: 'e2-1', title: 'Annual Art Exhibition', mediaUrl: 'https://picsum.photos/seed/event4/400/300', description: 'Discover stunning works from our talented students across all disciplines.', date: '2024-09-10', location: 'Veridian Art Gallery' },
        { id: 'e2-2', title: 'Spring Musical: The Heights', mediaUrl: 'https://picsum.photos/seed/event5/400/300', description: 'A spectacular musical performance by our performing arts department.', date: '2025-04-18', location: 'Performing Arts Center' },
    ],
    featuredAds: [],
    collegeAds: [],
  },
  {
    id: 'uni-3',
    name: 'Sterling Business School',
    location: 'Metropolis, USA',
    photoUrl: 'https://picsum.photos/seed/uni3/800/400',
    logoUrl: 'https://picsum.photos/seed/logo3/200/200',
    shortDescription: 'Shaping the next generation of business leaders.',
    description: 'Sterling Business School offers a rigorous and comprehensive curriculum designed to prepare students for the challenges of the global business environment. Our programs emphasize leadership, ethics, and innovation.',
    admissionOpenDate: '2024-07-15',
    admissionCloseDate: '2025-02-28',
    isPaid: true,
    admissionFee: 7500,
    upiId: '9876543210@ybl',
    courses: [
      { id: 'c3-1', name: 'MBA', duration: '2 Years', fees: '₹25,00,000/year', description: 'A comprehensive program for aspiring business leaders.', enrollmentCount: 15, totalSeats: 200, isPremium: true, eligibility: 'Bachelors degree + 2 years work experience', admissionOpenDate: '2024-09-01', admissionEndDate: '2025-01-15' },
      { id: 'c3-2', name: 'Finance', duration: '4 Years', fees: '₹12,00,000/year', description: 'Specialize in corporate finance, investments, and financial markets.', enrollmentCount: 175, totalSeats: 175, eligibility: '10+2 with Commerce or Maths', admissionOpenDate: '2024-07-15', admissionEndDate: '2024-10-30' },
      { id: 'c3-3', name: 'Marketing', duration: '4 Years', fees: '₹11,50,000/year', description: 'Understand consumer behavior and modern marketing strategies.', enrollmentCount: 158, totalSeats: 160, eligibility: '10+2 in any stream with 50% aggregate', admissionOpenDate: '2024-07-15', admissionEndDate: '2024-10-30' },
    ],
    events: [
        { id: 'e3-1', title: 'Global Leadership Summit', mediaUrl: 'https://picsum.photos/seed/event6/400/300', description: 'A two-day summit featuring talks from CEOs and global leaders on the future of business.', date: '2024-11-05', location: 'Grand Conference Hall' },
        { id: 'e3-2', title: 'Startup Pitch Competition', mediaUrl: 'https://picsum.photos/seed/event7/400/300', description: 'Watch our students pitch their innovative startup ideas to a panel of venture capitalists.', date: '2025-03-01', location: 'Innovation Hub' },
    ],
    featuredAds: [],
    collegeAds: [],
  },
];

export const LOAN_PROVIDERS: LoanProvider[] = [
    {
        id: 'loan-1',
        name: 'EduFinance Inc.',
        interestRate: '4.5% - 8.2%',
        terms: 'Flexible repayment options, 5-15 year terms, no prepayment penalty.',
        logoUrl: 'https://picsum.photos/seed/loan1/100/100',
        applyLink: '#',
    },
    {
        id: 'loan-2',
        name: 'StudentLoan Connect',
        interestRate: '5.1% - 9.5%',
        terms: 'Cosigner release available, interest rate reduction for autopay.',
        logoUrl: 'https://picsum.photos/seed/loan2/100/100',
        applyLink: '#',
    },
    {
        id: 'loan-3',
        name: 'Future Scholar Bank',
        interestRate: '4.8% Fixed',
        terms: 'Fixed interest rates, multiple deferment options available.',
        logoUrl: 'https://picsum.photos/seed/loan3/100/100',
        applyLink: '#',
    },
];

export const DUMMY_USER: User = {
    id: 'student-001',
    name: 'Alex Doe',
    email: 'student@cguide.com',
    phone: '1234567890',
    role: 'STUDENT',
    profilePhotoUrl: 'https://i.pravatar.cc/150?u=student-001',
    favoriteCollegeIds: [],
    favoriteCourseIds: [],
    favoriteEventIds: [],
    applications: [],
    notifications: [
        { id: 's-n1', type: 'status', title: 'Application Confirmed', message: 'Your application for Computer Science at Apex University has been confirmed!', isRead: false, timestamp: '2024-07-24 09:15 AM', link: '/status' },
        { id: 's-n2', type: 'message', title: 'New Message from Admin', message: 'Hi Alex, thanks for reaching out. We are currently reviewing your documents...', isRead: false, timestamp: '2024-07-22 11:05 AM', link: '/chat/app-1' },
        { id: 's-n3', type: 'offer', title: 'Early Bird Scholarship!', message: 'Apply before Aug 1st to get a 10% scholarship on your first semester fees.', isRead: false, timestamp: '2024-07-21 03:00 PM', link: '/ads' },
        { id: 's-n4', type: 'admission', title: 'Admission Closing Soon', message: 'Admissions for Veridian College of Arts close in 3 days.', isRead: true, timestamp: '2024-07-20 08:00 AM', link: '/college/uni-2' },
        { id: 's-n5', type: 'update', title: 'New Course Added', message: 'Sterling Business School just added a new course: "Digital Marketing".', isRead: true, timestamp: '2024-07-19 01:20 PM', link: '/college/uni-3' },
    ],
    walletTransactions: [
        { id: 'txn-1', date: '2024-07-10', description: 'Wallet Top-up', amount: 500, type: 'credit' },
        { id: 'txn-2', date: '2024-07-11', description: 'Application Fee: Apex University', amount: 50, type: 'debit' },
    ],
};

export const DUMMY_COLLEGE_ADMIN_USER: User = {
    id: 'admin-001',
    name: 'Dr. Evelyn Reed',
    email: 'admin@college.com',
    phone: '9876543210',
    role: 'COLLEGE_ADMIN',
    collegeId: 'uni-1', // Admin for Apex University of Technology
    profilePhotoUrl: 'https://i.pravatar.cc/150?u=admin-001',
    favoriteCollegeIds: [],
    favoriteCourseIds: [],
    favoriteEventIds: [],
    applications: [],
    notifications: [
        { id: 'n1', type: 'application', title: 'New Application', message: 'Jessica Martinez applied for Computer Science.', isRead: false, timestamp: '2024-07-23 11:45 AM', link: '/admin/admissions' },
        { id: 'n2', type: 'application', title: 'New Application', message: 'Chris Green applied for Data Science.', isRead: false, timestamp: '2024-07-23 10:10 AM', link: '/admin/admissions' },
        { id: 'n3', type: 'student', title: 'New Message', message: 'Alex Doe sent a message about their application.', isRead: false, timestamp: '2024-07-22 02:15 PM', link: '/admin/chat' },
        { id: 'n4', type: 'system', title: 'Profile Update', message: 'Your college description was successfully updated.', isRead: true, timestamp: '2024-07-22 09:00 AM', link: '/admin/manage-profile' },
        { id: 'n5', type: 'student', title: 'New Message', message: 'A student asked a question about the Fine Arts course.', isRead: true, timestamp: '2024-07-21 05:30 PM', link: '/admin/chat' },
    ],
    walletTransactions: [],
};

export const DUMMY_FORUM_POSTS: ForumPost[] = [
    {
        id: 'post-1',
        title: 'Is a Computer Science degree from Apex University worth it?',
        authorId: 'student-002', // Jane Smith
        authorName: 'Jane Smith',
        authorPhotoUrl: 'https://i.pravatar.cc/150?u=student-002',
        content: "Hey everyone, I've been accepted into the CS program at Apex University but also have an offer from another good college. I'm trying to decide if the higher fees at Apex are justified. Can any current students or alumni share their experiences about the faculty, internships, and job placements? Thanks in advance!",
        tags: ['Computer Science', 'Apex University', 'Admissions', 'Career'],
        timestamp: new Date('2024-07-22T14:00:00Z').toISOString(),
        lastActivity: new Date('2024-07-23T10:30:00Z').toISOString(),
        views: 124,
        replies: [
            {
                id: 'reply-1-1',
                postId: 'post-1',
                authorId: 'student-001', // Alex Doe
                authorName: 'Alex Doe',
                authorPhotoUrl: 'https://i.pravatar.cc/150?u=student-001',
                content: "Congratulations on your acceptance! I'm a current sophomore in the CS program. The faculty is top-notch, especially Prof. Alan Turing in AI. The career fairs are amazing, big companies like Google and Microsoft recruit directly from campus. The internship support is also really strong. It's challenging but definitely opens a lot of doors.",
                timestamp: new Date('2024-07-22T18:45:00Z').toISOString(),
            },
            {
                id: 'reply-1-2',
                postId: 'post-1',
                authorId: 'student-003', // Michael Brown
                authorName: 'Michael Brown',
                authorPhotoUrl: 'https://i.pravatar.cc/150?u=student-003',
                content: "Seconding what Alex said. The network you build here is invaluable. The alumni connections are super helpful for job hunting post-graduation. The fees are steep, but think of it as an investment. The ROI is one of the best in the country.",
                timestamp: new Date('2024-07-23T10:30:00Z').toISOString(),
            },
        ],
    },
    {
        id: 'post-2',
        title: 'Best on-campus housing options at Veridian College?',
        authorId: 'student-004', // Sarah Wilson
        authorName: 'Sarah Wilson',
        authorPhotoUrl: 'https://i.pravatar.cc/150?u=student-004',
        content: "Hi! I'm an incoming freshman at Veridian College of Arts and I'm a bit overwhelmed by the housing choices. Can anyone recommend the best dorms for art students? I'm looking for somewhere with a creative vibe and good studio access. Any pros and cons for different halls would be super helpful!",
        tags: ['Housing', 'Campus Life', 'Veridian College'],
        timestamp: new Date('2024-07-21T09:15:00Z').toISOString(),
        lastActivity: new Date('2024-07-21T11:00:00Z').toISOString(),
        views: 88,
        replies: [
            {
                id: 'reply-2-1',
                postId: 'post-2',
                authorId: 'student-002', // Jane Smith
                authorName: 'Jane Smith',
                authorPhotoUrl: 'https://i.pravatar.cc/150?u=student-002',
                content: "Definitely check out Willow Hall! It's known as the 'artsy' dorm and has a small workshop space in the basement. It's also right next to the main fine arts building.",
                timestamp: new Date('2024-07-21T11:00:00Z').toISOString(),
            },
        ],
    },
    {
        id: 'post-3',
        title: 'Question about portfolio submission for Graphic Design',
        authorId: 'student-001', // Alex Doe
        authorName: 'Alex Doe',
        authorPhotoUrl: 'https://i.pravatar.cc/150?u=student-001',
        content: "I'm applying for the Graphic Design course at Veridian. The website says '10-15 pieces'. Does this include sketchbook pages, or should it only be finished work? Also, is digital work preferred over traditional media?",
        tags: ['Portfolio', 'Graphic Design', 'Veridian College', 'Admissions'],
        timestamp: new Date('2024-07-23T11:00:00Z').toISOString(),
        lastActivity: new Date('2024-07-23T11:00:00Z').toISOString(),
        views: 15,
        replies: [],
    },
];