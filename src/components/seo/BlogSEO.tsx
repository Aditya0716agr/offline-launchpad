import { SEOHead } from './SEOHead';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  author: string;
  published_at: string;
  updated_at: string;
  tags: string[];
  category: string;
  read_time: number;
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

  const image = post.featured_image || 'https://storage.googleapis.com/gpt-engineer-file-uploads/OVYktJbw3tZiZkzBsvSWWp5ISb23/social-images/social-1759048575325-Screenshot%202025-09-28%20140608.png';
  
  const url = `https://knowfounders.com/blog/${post.slug}`;

  const breadcrumbs = [
    { name: 'Home', url: 'https://knowfounders.com' },
    { name: 'Blog', url: 'https://knowfounders.com/blog' },
    { name: post.category, url: `https://knowfounders.com/blog/category/${post.category.toLowerCase()}` },
    { name: post.title, url }
  ];

  const structuredData = [
    generateArticleSchema({
      title: post.title,
      description: description,
      image: image,
      url: url,
      published_at: post.published_at,
      updated_at: post.updated_at,
      author: post.author,
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
      answer: `This article was written by ${post.author}, a contributor to the Know Founders blog.`
    },
    {
      question: `How long does it take to read this article?`,
      answer: `This article takes approximately ${post.read_time} minutes to read.`
    },
    {
      question: `What category is this article in?`,
      answer: `This article is categorized under ${post.category}.`
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
      author={post.author}
      publishedTime={post.published_at}
      modifiedTime={post.updated_at}
      section={post.category}
      tags={post.tags}
    />
  );
};
