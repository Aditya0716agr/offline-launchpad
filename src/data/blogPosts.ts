// Blog categories
export const categories = [
  { id: "all", name: "All Posts", slug: "all" },
  { id: "founder-stories", name: "Non-Tech Founder Stories", slug: "founder-stories" },
  { id: "validation", name: "Startup Validation", slug: "validation" },
  { id: "cofounders", name: "Finding Co-founders", slug: "cofounders" },
  { id: "fundraising", name: "Fundraising for Non-Tech", slug: "fundraising" },
  { id: "business-building", name: "Business Building", slug: "business-building" },
  { id: "platform-updates", name: "Platform Updates", slug: "platform-updates" }
];

// Blog posts data
export const blogPosts = [
  {
    id: "1",
    title: "From Restaurant Owner to Tech-Enabled Food Empire: Sarah's Journey",
    excerpt: "How Sarah Chen transformed her local restaurant into a multi-city food delivery platform without writing a single line of code.",
    content: `
      <div className="text-center py-16">
        <h2 className="text-2xl font-light text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">This article is currently being written. Check back soon for the full story!</p>
      </div>
    `,
    author: {
      name: "Sarah Chen",
      avatar: null,
      bio: "Founder of EcoClean Solutions"
    },
    category: "founder-stories",
    categoryName: "Non-Tech Founder Stories",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    featured: true,
    tags: ["success-story", "food-tech", "scaling"],
    image: null
  },
  {
    id: "2",
    title: "The Complete Guide to Validating Your Non-Tech Startup Idea",
    excerpt: "A step-by-step framework for testing your business concept before investing time and money into development.",
    content: `
      <div className="text-center py-16">
        <h2 className="text-2xl font-light text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">This comprehensive guide is currently being written. Check back soon for the full framework!</p>
      </div>
    `,
    author: {
      name: "Marcus Rodriguez",
      avatar: null,
      bio: "Startup Advisor & Mentor"
    },
    category: "validation",
    categoryName: "Startup Validation",
    publishedAt: "2024-01-12",
    readTime: "12 min read",
    featured: true,
    tags: ["validation", "framework", "market-research"],
    image: null
  },
  {
    id: "3",
    title: "How to Find Your Perfect Technical Co-founder",
    excerpt: "Practical strategies for non-tech founders to identify, approach, and partner with the right technical talent.",
    content: `
      <div className="text-center py-16">
        <h2 className="text-2xl font-light text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">This detailed guide is currently being written. Check back soon for practical strategies!</p>
      </div>
    `,
    author: {
      name: "Jessica Park",
      avatar: null,
      bio: "Co-founder of FitLife Studio"
    },
    category: "cofounders",
    categoryName: "Finding Co-founders",
    publishedAt: "2024-01-10",
    readTime: "10 min read",
    featured: false,
    tags: ["cofounder", "partnership", "recruitment"],
    image: null
  },
  {
    id: "4",
    title: "Fundraising Without a Technical Background: What Investors Really Want",
    excerpt: "Insights from 50+ investor conversations on how non-tech founders can successfully raise capital.",
    content: `
      <div className="text-center py-16">
        <h2 className="text-2xl font-light text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">This investor insights article is currently being written. Check back soon for valuable fundraising tips!</p>
      </div>
    `,
    author: {
      name: "David Kim",
      avatar: null,
      bio: "Investment Partner at Green Ventures"
    },
    category: "fundraising",
    categoryName: "Fundraising for Non-Tech",
    publishedAt: "2024-01-08",
    readTime: "15 min read",
    featured: false,
    tags: ["fundraising", "investors", "pitch"],
    image: null
  },
  {
    id: "5",
    title: "Building Operations That Scale: Lessons from 5 Non-Tech Founders",
    excerpt: "Real-world strategies for creating efficient systems and processes as your business grows.",
    content: `
      <div className="text-center py-16">
        <h2 className="text-2xl font-light text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">This operations guide is currently being written. Check back soon for scaling strategies!</p>
      </div>
    `,
    author: {
      name: "Amanda Foster",
      avatar: null,
      bio: "Operations Expert & Founder"
    },
    category: "business-building",
    categoryName: "Business Building",
    publishedAt: "2024-01-05",
    readTime: "11 min read",
    featured: false,
    tags: ["operations", "scaling", "systems"],
    image: null
  },
  {
    id: "6",
    title: "New Feature: Enhanced Startup Discovery and Matching",
    excerpt: "Introducing our latest platform updates designed to help founders connect more effectively.",
    content: `
      <div className="text-center py-16">
        <h2 className="text-2xl font-light text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">This platform update article is currently being written. Check back soon for the latest features!</p>
      </div>
    `,
    author: {
      name: "KnowFounders Team",
      avatar: null,
      bio: "Platform Development Team"
    },
    category: "platform-updates",
    categoryName: "Platform Updates",
    publishedAt: "2024-01-03",
    readTime: "5 min read",
    featured: false,
    tags: ["platform", "features", "updates"],
    image: null
  }
];

// Function to get a blog post by ID
export const getBlogPostById = (id: string) => {
  return blogPosts.find(post => post.id === id);
};

// Function to get related posts
export const getRelatedPosts = (currentPostId: string, limit: number = 2) => {
  const currentPost = getBlogPostById(currentPostId);
  if (!currentPost) return [];
  
  return blogPosts
    .filter(post => post.id !== currentPostId && post.category === currentPost.category)
    .slice(0, limit);
};
