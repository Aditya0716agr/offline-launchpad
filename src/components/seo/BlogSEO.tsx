import { SEOHead } from './SEOHead';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string | null;
    bio: string;
  };
  category: string;
  categoryName: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  image: string | null;
}

interface BlogSEOProps {
  post: BlogPost;
}

export const BlogSEO = ({ post }: BlogSEOProps) => {
  const title = `${post.title} | Know Founders Blog`;
  const description = post.excerpt || post.content.substring(0, 160) + '...';
  
  const keywords = [
    ...post.tags,
    'startup blog',
    'entrepreneur blog',
    'non-tech startups',
    'startup advice',
    'business tips',
    'founder insights',
    'startup stories'
  ].join(', ');

  const image = post.image || 'https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png';
  
  const url = `https://knowfounders.com/blog/${post.slug}`;

  const breadcrumbs = [
    { name: 'Home', url: 'https://knowfounders.com' },
    { name: 'Blog', url: 'https://knowfounders.com/blog' },
    { name: post.categoryName, url: `https://knowfounders.com/blog/category/${post.category.toLowerCase()}` },
    { name: post.title, url }
  ];

  const structuredData = [
    generateArticleSchema({
      title: post.title,
      description: description,
      image: image,
      url: url,
      published_at: post.publishedAt,
      updated_at: post.publishedAt, // Using publishedAt as updated_at since we don't have separate updated_at
      author: post.author.name,
      content: post.content
    }),
    generateBreadcrumbSchema(breadcrumbs)
  ];

  const faq = [
    {
      question: `What is this article about?`,
      answer: post.excerpt || post.content.substring(0, 200) + '...'
    },
    {
      question: `Who wrote this article?`,
      answer: `This article was written by ${post.author.name}, ${post.author.bio}.`
    },
    {
      question: `How long does it take to read this article?`,
      answer: `This article takes approximately ${post.readTime} to read.`
    },
    {
      question: `What category is this article in?`,
      answer: `This article is categorized under ${post.categoryName}.`
    }
  ];

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      image={image}
      url={url}
      type="article"
      structuredData={structuredData}
      breadcrumbs={breadcrumbs}
      faq={faq}
      author={post.author.name}
      publishedTime={post.publishedAt}
      modifiedTime={post.publishedAt}
      section={post.categoryName}
      tags={post.tags}
    />
  );
};
