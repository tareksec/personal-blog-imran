/**
 * lib/content.js — Site-wide configuration and static content.
 * All facts here come from info.md (collected from imrankhanlincoln.blogspot.com).
 */

const SITE = {
  name: 'Md. Imran Khan Lincoln',
  shortName: 'Imran Khan Lincoln',
  title: 'Md. Imran Khan Lincoln — Blog & Insights',
  tagline: 'Insights on Real Estate, Leadership & Business Strategy',
  description:
    'Insights on Real Estate investments, Career development, HR culture, and Customer Experience from Md. Imran Khan Lincoln, Chief Experience Officer (CXO) at Bangladesh Executive Chamber (BEC).',
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

const NAV = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'Real Estate', href: '/blog/category/real-estate-investment', key: 'real-estate' },
  { label: 'Leadership', href: '/blog/category/career-leadership', key: 'leadership' },
  { label: 'BEC', href: '/bec', key: 'bec' },
  { label: 'Blog', href: '/blog', key: 'blog' },
  { label: 'About', href: '/about', key: 'about' },
  { label: 'Contact', href: '/contact', key: 'contact' },
];

module.exports = { SITE, IMAGES, ABOUT, CONTACT, BEC, NAV };