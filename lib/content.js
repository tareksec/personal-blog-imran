/**
 * lib/content.js — Site-wide configuration and static content.
 * All facts here come from info.md (collected from imrankhanlincoln.blogspot.com).
 */

const SITE = {
  name: 'Md. Imran Khan Lincoln',
  shortName: 'Imran Khan Lincoln',
  title: 'Md Imran Khan Lincoln | Chief Experience Officer (CXO) at BEC',
  tagline: 'Real Estate & Investment Professional, Sustainability Advocate, Leadership Coach, Wellness Advisor, Author & Motivational Strategist, ESG Promoter',
  description: 'Md Imran Khan Lincoln is a Real Estate Consultant in Dhaka, Chief Experience Officer at BEC, and Business Leadership Coach in Bangladesh.',
  role: 'Chief Experience Officer (CXO)',
  organization: 'Bangladesh Executive Chamber (BEC)',
  experienceYears: '18+',
  officeAddress: 'Gulshan, Dhaka, Bangladesh',
  phones: ['+8801733-677444', '+8801511-511444'],
  // NOTE: info.md does not list an email. Replace with the real address when available.
  email: 'contact@imrankhanlincoln.com',
  blogSource: 'https://imrankhanlincoln.blogspot.com/',
  bloggerProfile: 'https://www.blogger.com/profile/15309839422780110618',
  social: {
    linkedin: 'https://www.linkedin.com/in/md-imran-khan-lincoln-890280141/',
    twitter: 'https://x.com/',
    facebook: 'https://www.facebook.com/',
    blogger: 'https://imrankhanlincoln.blogspot.com/',
  },
  // Set SITE_URL env var at build time; fallback used for local builds.
  baseUrl: process.env.SITE_URL || 'https://imranvai.vercel.app',
  locale: 'en_US',
  themeColor: '#1C2331',
  services: [
    {
      title: 'Corporate Training',
      description: 'Empowering teams with actionable leadership and business strategies.',
      detail: 'Customised workshops and training programmes that build practical leadership, sales, and communication skills — turning strategy into everyday team behaviour.',
      whoItsFor: 'Executives, sales teams, and growing companies looking to sharpen leadership and performance.',
      anchor: 'corporate-training',
      icon: 'users',
    },
    {
      title: 'Lead Generation',
      description: 'Targeted strategies to build sustainable sales pipelines.',
      detail: 'Structured lead-generation systems that identify, qualify, and convert the right prospects — so your pipeline stays full and predictable.',
      whoItsFor: 'Sales-driven businesses that want consistent, measurable lead flow.',
      anchor: 'lead-generation',
      icon: 'target',
    },
    {
      title: 'Real Estate Marketing',
      description: 'Expert marketing for commercial and residential properties.',
      detail: 'Positioning, storytelling, and go-to-market plans for residential and commercial projects — from pre-launch buzz to steady sales velocity.',
      whoItsFor: 'Developers, agencies, and property investors launching or repositioning projects.',
      anchor: 'real-estate-marketing',
      icon: 'building',
    },
    {
      title: 'Business Consulting',
      description: 'Strategic guidance for sustainable business growth.',
      detail: 'Hands-on advisory across strategy, operations, and customer experience — helping you find clarity, prioritise, and execute with confidence.',
      whoItsFor: 'Founders and leadership teams navigating growth, change, or market shifts.',
      anchor: 'business-consulting',
      icon: 'briefcase',
    },
    {
      title: 'Marketing Consulting',
      description: 'Data-driven marketing strategies for modern brands.',
      detail: 'Research-backed marketing plans that align brand, message, and channel — built to convert attention into lasting customer relationships.',
      whoItsFor: 'Brands that need direction and measurable marketing impact.',
      anchor: 'marketing-consulting',
      icon: 'pieChart',
    },
    {
      title: 'Brand Consulting',
      description: 'Building strong, recognizable corporate identities.',
      detail: 'Brand strategy and positioning that make your organisation distinct, credible, and memorable in a crowded market.',
      whoItsFor: 'Companies building, refreshing, or differentiating their brand.',
      anchor: 'brand-consulting',
      icon: 'lightbulb',
    },
    {
      title: 'Social Media Marketing',
      description: 'Engaging audiences and building brand value online.',
      detail: 'Content and community strategy that grows reach, sparks conversation, and turns followers into advocates.',
      whoItsFor: 'Businesses and personal brands aiming to grow a meaningful online presence.',
      anchor: 'social-media-marketing',
      icon: 'trendingUp',
    },
    {
      title: 'Career Development Coaching',
      description: 'Guiding professionals to achieve their career goals.',
      detail: 'One-to-one coaching on skills, mindset, and career strategy — from interview readiness to leadership transitions.',
      whoItsFor: 'Professionals and fresh graduates building a deliberate, skills-first career path.',
      anchor: 'career-development-coaching',
      icon: 'userPlus',
    },
  ],
  skills: [
    'Sales and Marketing', 'Digital Marketing', 'Team Leadership', 'Administrative Management', 'Business Development'
  ],
  experience: [
    { role: 'Chief Experience Officer (CXO)', org: 'Bangladesh Executive Chamber (BEC)', period: 'Jun 2026–present' },
    { role: 'Head of Sales & Marketing (GM)', org: "Chuti Resort Cox's Bazar", period: 'Oct 2025–Jul 2026' },
    { role: 'Head of Sales (CMO)', org: 'Article Structure Ltd.', period: 'Feb 2025–Oct 2025' },
    { role: 'Head of Sales (GM)', org: 'Swapnil Holdings Ltd.', period: 'Nov 2023–Jan 2025' },
    { role: 'Deputy General Manager', org: 'Ashiyan Group', period: 'Jan 2023–Oct 2023' }
  ],
  education: [
    { degree: "Master's Degree", institution: 'Government Tolaram College & University' },
    { degree: 'HSC', institution: 'Notre Dame College', details: 'GPA 5.00, 2002–2004' }
  ],
  project: {
    name: 'Chuti Bay',
    standard: '7-star standard',
    description: "7-star standard sea-view hotel investment scheme in Cox's Bazar. G+15 floors, 300,000 sq ft on 37 katha land.",
    address: "Kolatoli Point, Cox's Bazar (beside Hotel Simon)",
    location: "Kolatoli Point, Cox's Bazar (beside Hotel Simon)",
    overview: [
      "Chuti Bay is a landmark sea-view hotel project at Kolatoli Point, one of Cox's Bazar's most sought-after tourist locations. Positioned beside Hotel Simon, the development is designed to a 7-star standard with panoramic views of the Bay of Bengal.",
      "The project is structured as a share-based investment scheme, offering investors a stake in a premium hospitality asset in Bangladesh's leading beach destination.",
    ],
    keyFacts: [
      { label: 'Standard', value: '7-star' },
      { label: 'Structure', value: 'G+15 floors' },
      { label: 'Total area', value: '300,000 sq ft' },
      { label: 'Land', value: '37 katha' },
      { label: 'Location', value: "Kolatoli Point, Cox's Bazar" },
    ],
    investment: {
      title: 'Investment structure',
      description:
        "Chuti Bay is offered through a share-based scheme, letting investors participate in a landmark sea-view hotel project at one of Bangladesh's most popular tourist destinations.",
      structure: [
        'Share-based ownership scheme',
        '[SHARE PRICE NEEDED — per-share price to be confirmed]',
        '[ROI % NEEDED — projected return / rental yield to be confirmed]',
      ],
      notes: [
        '[FLOOR PLANS NEEDED — unit & floor layout documents to be added]',
        '[BROCHURE NEEDED — downloadable project brochure to be added]',
      ],
    },
    gallery: {
      note: 'Project photography, renders, and floor plans to be added.',
      items: [],
    },
    cta: {
      label: 'Enquire about Chuti Bay',
      href: '/contact',
    },
  }
};

const IMAGES = {
  hero: '/assets/images/imrankhan/hero.jpg',
  profile: '/assets/images/imrankhan/profile.jpg',
  aboutBio: '/assets/images/imrankhan/about-bio.jpg',
  aboutDesk: '/assets/images/imrankhan/about-desk.jpg',
  aboutGroup: '/assets/images/imrankhan/about-group.jpg',
  aboutTeaser: '/assets/images/imrankhan/about-teaser.jpg',
  contactSpeaking: '/assets/images/imrankhan/contact-speaking.jpg',
  expertiseGroup: '/assets/images/imrankhan/expertise-group.jpg',
  timelineAward: '/assets/images/imrankhan/timeline-award.jpg',
};

const ABOUT = {
  hero: {
    eyebrow: 'About Me',
    heading: 'A career built on people, property, and purpose.',
    intro:
      'Md. Imran Khan Lincoln is the Chief Experience Officer (CXO) at Bangladesh Executive Chamber (BEC), with more than 18 years of experience across the Real Estate industry in Bangladesh.',
  },
  bio: [
    'For over 18 years, Md. Imran Khan Lincoln has worked at the intersection of real estate, business strategy, and customer experience. As Chief Experience Officer (CXO) at Bangladesh Executive Chamber (BEC), he leads efforts to put the customer at the centre of every business decision — because he believes the real foundation of any business is not just the project, but the experience it delivers.',
    'His professional journey spans real estate investment analysis, business development, leadership, and people management. He writes regularly on topics such as bank deposits versus real estate investment, career growth, recruitment culture, customer experience, and global affairs — blending personal experience with reliable references from Bangladesh Bank, ADB, Reuters, and The Daily Star.',
    'A firm believer in lifelong learning, he encourages professionals to create their own opportunities rather than wait for them, to measure qualifications by skill rather than institution name, and to treat failure as a stepping stone. His writing style is a code-mixed blend of Bangla and English, engaging readers with personal opinion and inviting their views at the end of every post.',
  ],
  stats: [
    { value: '18+', label: 'Years in Real Estate' },
    { value: 'CXO', label: 'Leadership Role' },
    { value: '26+', label: 'Published Insights' },
    { value: '6', label: 'Core Topic Areas' },
  ],
  expertise: [
    {
      title: 'Real Estate & Investment',
      description:
        'Comparative analysis of bank deposits vs. real estate investment, risk assessment, and long-term wealth-building strategies for the Bangladeshi market.',
      detailedText:
        'As property markets evolve, investors face complex choices between traditional bank savings and dynamic real estate opportunities. I provide an in-depth look into yield optimization, property valuation, and risk mitigation. My focus is to help individuals build sustainable wealth by identifying emerging residential hubs and high-value commercial spaces that offer strong long-term ROI.',
    },
    {
      title: 'Career & Leadership',
      description:
        'Practical advice on building qualifications, creating opportunities, learning from failure, and growing into leadership roles.',
      detailedText:
        'True leadership isn\'t just about managing people; it\'s about continuously developing yourself and empowering others. I share practical strategies for professionals to overcome setbacks, take initiative, and construct a robust skill set. Whether you are aiming for a promotion or transitioning to an executive role, continuous learning and emotional intelligence are the keys to lasting success.',
    },
    {
      title: 'HR & Recruitment',
      description:
        'Opinions on recruitment culture, evaluating skill over institution name, and what job seekers and freshers should focus on.',
      detailedText:
        'The modern workforce demands more than just a prestigious university degree. I advocate for a skills-first recruitment culture where practical competence and adaptability are prioritized. My writing provides actionable guidance for fresh graduates navigating the job market, and insights for HR professionals looking to identify true talent and build a more inclusive corporate environment.',
    },
    {
      title: 'Business Strategy & CX',
      description:
        'Why customer experience is the real foundation of business, brand value, and customer relationships in a changing market.',
      detailedText:
        'A product might attract a buyer, but an exceptional experience creates a loyal customer. In an increasingly competitive landscape, Customer Experience (CX) is the ultimate differentiator. I analyze how prioritizing customer journeys, transparent communication, and empathy can dramatically boost brand equity, ensure sustainable growth, and turn everyday transactions into long-term partnerships.',
    },
    {
      title: 'Professional Etiquette',
      description:
        'Interview tips, workplace behaviour, communication, and networking guidance for professionals at every stage.',
      detailedText:
        'First impressions and sustained professionalism can make or break a career. From mastering the nuances of an important interview to navigating everyday workplace communication, etiquette plays a massive role in professional growth. I offer actionable advice on how to network authentically, communicate clearly, and maintain a reputation of integrity and respect in any corporate setting.',
    },
    {
      title: 'Global Issues & Society',
      description:
        'Perspectives on the United Nations, world peace, geopolitics, and how global events shape local business and society.',
      detailedText:
        'In our hyper-connected world, local businesses are profoundly influenced by global geopolitics. I explore the broader impact of international relations, peace initiatives, and economic shifts on society. By understanding these macroscopic trends, local entrepreneurs and leaders can better anticipate market changes and align their strategies with the evolving global landscape.',
    },
  ],
  journey: [
    {
      period: 'Present',
      role: 'Chief Experience Officer (CXO)',
      org: 'Bangladesh Executive Chamber (BEC)',
      description:
        'Leading customer experience strategy and business development, championing a customer-first culture across the organisation.',
    },
    {
      period: '18+ years',
      role: 'Real Estate Industry Professional',
      org: 'Bangladesh',
      description:
        'Two decades of hands-on experience in real estate investment, business strategy, and client relationships in one of Bangladesh’s most dynamic sectors.',
    },
    {
      period: 'Ongoing',
      role: 'Thought Leader & Writer',
      org: 'imrankhanlincoln.blogspot.com',
      description:
        'Regularly publishes insights on investment, careers, HR culture, customer experience, and global affairs — engaging a growing readership with personal, opinion-led analysis.',
    },
  ],
  mission:
    'To help individuals and businesses make smarter decisions — in real estate, careers, and customer experience — by sharing honest, experience-backed insight.',
  vision:
    'A business culture in Bangladesh where customer experience is treated as the true foundation of every enterprise, and where professionals grow by skill, integrity, and lifelong learning.',
  quote:
    'The real foundation of any business is not just the project — it is the customer experience.',
};

const CONTACT = {
  heading: 'Let’s talk about <br/><span class="flip-fade-container text-primary"><span class="flip-word active">your project.</span><span class="flip-word">a partnership.</span><span class="flip-word">real estate.</span><span class="flip-word">speaking opportunities.</span></span>',
  intro:
    'Whether you want to discuss real estate investment, leadership, or a speaking opportunity — I’d love to hear from you. Fill in the form and I’ll get back to you as soon as possible.',
  mapEmbed:
    'https://www.google.com/maps?q=Gulshan,+Dhaka,+Bangladesh&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Gulshan%2C+Dhaka%2C+Bangladesh',
};

const BEC = {
  heading: 'Join the Bangladesh Executive Chamber',
  subHeading: 'Empowering Leaders, Driving Growth',
  description: 'Connect with a premier network of C-level executives, thought leaders, and industry pioneers in Bangladesh. As CXO of BEC, I invite you to join a community dedicated to professional excellence, strategic networking, and shaping the future of business.',
  ctaText: 'Discover BEC',
  linkedinUrl: 'https://www.linkedin.com/company/bangladesh-executive-chamber/posts/?feedView=all',
  pageTitle: 'Bangladesh Executive Chamber (BEC) — Empowering Leadership',
  pageContent: [
    'The Bangladesh Executive Chamber (BEC) is a premier platform dedicated to empowering leaders and driving inclusive growth across industries in Bangladesh. We believe that leadership is not a destination, but a continuous journey of learning, collaboration, and innovation.',
    'Our mission is to foster a collaborative environment where executives, entrepreneurs, and thought leaders can share insights, engage in strategic networking, and access exclusive professional development opportunities.',
    'By joining BEC, you gain access to a dynamic community that champions a skills-first culture and prioritizes exceptional customer experience as the foundation of sustainable business growth.'
  ],
  benefits: [
    { title: 'Executive Networking', description: 'Build meaningful connections with top-tier professionals and industry pioneers.' },
    { title: 'Knowledge Sharing', description: 'Access exclusive insights, seminars, and thought-leadership panels.' },
    { title: 'Professional Growth', description: 'Enhance your leadership skills and navigate the evolving corporate landscape.' }
  ]
};

const TESTIMONIALS = {
  heading: 'What clients & partners say',
  subHeading:
    'Real feedback from professionals and organisations I have worked with on real estate, leadership, and business strategy.',
  // NOTE: Replace these placeholders with real client quotes, names, and roles before launch.
  items: [
    {
      quote: '[TESTIMONIAL TEXT NEEDED — client name, company, quote]',
      name: '[CLIENT NAME NEEDED]',
      role: '[COMPANY / ROLE NEEDED]',
      image: '/assets/images/testimonials-image.png',
      rating: 5,
    },
    {
      quote: '[TESTIMONIAL TEXT NEEDED — client name, company, quote]',
      name: '[CLIENT NAME NEEDED]',
      role: '[COMPANY / ROLE NEEDED]',
      image: '/assets/images/testimonials-image02.png',
      rating: 5,
    },
    {
      quote: '[TESTIMONIAL TEXT NEEDED — client name, company, quote]',
      name: '[CLIENT NAME NEEDED]',
      role: '[COMPANY / ROLE NEEDED]',
      image: '/assets/images/testimonials-image03.png',
      rating: 5,
    },
    {
      quote: '[TESTIMONIAL TEXT NEEDED — client name, company, quote]',
      name: '[CLIENT NAME NEEDED]',
      role: '[COMPANY / ROLE NEEDED]',
      image: '/assets/images/testimonials-image04.png',
      rating: 5,
    },
  ],
};

// NOTE: Analytics (if ever enabled) should be disclosed here and in the consent
// notice. Currently the site does NOT load any third-party analytics script.
const PRIVACY = {
  title: 'Privacy Policy',
  intro:
    'This Privacy Policy explains what information this website collects, how it is used, and the choices available to you. By using this website, you agree to the practices described below.',
  lastUpdated: '[LAST UPDATED DATE NEEDED]',
  sections: [
    {
      heading: 'Information We Collect',
      body: [
        'Contact form: when you use the contact form, we collect your name, email address, subject, and message so that we can respond to your enquiry.',
        'Newsletter: if you subscribe, we collect your email address to send you updates. You can unsubscribe at any time using the link in the emails.',
      ],
    },
    {
      heading: 'How We Use Your Information',
      body: [
        'To respond to enquiries submitted through the contact form.',
        'To send newsletter updates when you have opted in.',
        'To improve the content and experience of the website.',
        'We do not sell or rent your personal information to third parties.',
      ],
    },
    {
      heading: 'Cookies & Analytics',
      body: [
        'This website currently does not use advertising cookies or third-party analytics trackers.',
        'If analytics or cookies are introduced in the future, this policy will be updated and, where required by law, a consent notice will be shown.',
      ],
    },
    {
      heading: 'Third-Party Services',
      body: [
        'Embedded content (such as the Google Maps location) may collect data in line with its own privacy policy.',
        'External links to LinkedIn, X (Twitter), Facebook, and the original Blogger site are governed by those platforms’ privacy policies.',
      ],
    },
    {
      heading: 'Data Retention',
      body: [
        'Contact form messages are retained only as long as necessary to respond to your enquiry.',
        'Newsletter email addresses are retained until you unsubscribe.',
      ],
    },
    {
      heading: 'Your Rights',
      body: [
        'You may request access to, correction of, or deletion of your personal information by contacting us.',
        '[LEGAL REVIEW NEEDED — specific data-protection rights vary by jurisdiction; confirm applicable law.]',
      ],
    },
    {
      heading: 'Contact',
      body: [
        'For privacy-related questions, contact Md. Imran Khan Lincoln at contact@imrankhanlincoln.com.',
      ],
    },
  ],
};

const TERMS = {
  title: 'Terms of Service',
  intro:
    'These Terms of Service govern your use of this website. By accessing or using the site, you agree to be bound by these terms.',
  lastUpdated: '[LAST UPDATED DATE NEEDED]',
  sections: [
    {
      heading: 'Acceptance of Terms',
      body: [
        'By accessing this website you agree to these Terms of Service. If you do not agree, please do not use the site.',
      ],
    },
    {
      heading: 'Use of Content',
      body: [
        'All written content, including blog articles and insights, is provided for general information and personal development purposes.',
        'You may share links to content, but you may not reproduce or republish it without permission.',
      ],
    },
    {
      heading: 'Not Financial Advice',
      body: [
        'Content on this website — including articles on real estate investment and the Chuti Bay project — is provided for information only and does not constitute financial, investment, or legal advice.',
        'Always consult a qualified professional before making any investment decision.',
      ],
    },
    {
      heading: 'Intellectual Property',
      body: [
        'Unless otherwise stated, the content, branding, and design of this website are owned by the site owner and are protected by applicable intellectual property laws.',
      ],
    },
    {
      heading: 'Limitation of Liability',
      body: [
        'This website is provided “as is” without warranties of any kind. To the fullest extent permitted by law, the site owner is not liable for any loss or damage arising from your use of the site or reliance on its content.',
      ],
    },
    {
      heading: 'Governing Law',
      body: [
        '[LEGAL REVIEW NEEDED — governing law and jurisdiction to be confirmed.]',
      ],
    },
    {
      heading: 'Contact',
      body: [
        'For questions about these terms, contact Md. Imran Khan Lincoln at contact@imrankhanlincoln.com.',
      ],
    },
  ],
};

const NAV = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'About', href: '/about', key: 'about' },
  { label: 'Services', href: '/services', key: 'services' },
  { label: 'Projects', href: '/projects', key: 'projects' },
  { label: 'BEC', href: '/bec', key: 'bec' },
  { label: 'Testimonials', href: '/testimonials', key: 'testimonials' },
  { label: 'Blog', href: '/blog', key: 'blog' },
  { label: 'Contact', href: '/contact', key: 'contact' },
];

module.exports = { SITE, IMAGES, ABOUT, CONTACT, BEC, NAV, TESTIMONIALS, PRIVACY, TERMS };