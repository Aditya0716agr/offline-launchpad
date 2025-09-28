import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, Bookmark } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Sample blog post data (in real app, this would come from API)
const blogPost = {
  id: "1",
  title: "From Restaurant Owner to Tech-Enabled Food Empire: Sarah's Journey",
  excerpt: "How Sarah Chen transformed her local restaurant into a multi-city food delivery platform without writing a single line of code.",
  content: `
    <p>When Sarah Chen opened her first restaurant in San Francisco's Mission District in 2018, she never imagined that five years later, she'd be running a tech-enabled food empire spanning three cities with over 50 employees.</p>
    
    <p>But that's exactly what happened when she decided to embrace technology to solve the problems she was facing as a restaurant owner.</p>
    
    <h2>The Problem: Scaling a Restaurant Business</h2>
    
    <p>Sarah's restaurant, "EcoClean Eats," was successful from day one. Her focus on sustainable, locally-sourced ingredients and innovative plant-based dishes resonated with San Francisco's health-conscious community.</p>
    
    <p>But success brought its own challenges:</p>
    
    <ul>
      <li>Long wait times during peak hours</li>
      <li>Difficulty managing delivery orders</li>
      <li>Limited seating capacity</li>
      <li>High operational costs</li>
    </ul>
    
    <p>"I was turning away customers every night," Sarah recalls. "I knew there had to be a better way to serve more people without compromising on quality."</p>
    
    <h2>The Solution: Embracing Technology</h2>
    
    <p>Instead of opening more physical locations, Sarah decided to explore technology solutions. But here's the thing – Sarah had no technical background whatsoever.</p>
    
    <p>"I didn't know the first thing about coding or app development," she says. "But I knew my customers' pain points, and I was determined to solve them."</p>
    
    <h3>Step 1: Finding the Right Technical Partner</h3>
    
    <p>Sarah's first move was to find a technical co-founder who could help bring her vision to life. She attended local startup meetups and networking events, but struggled to find someone who understood the restaurant industry.</p>
    
    <p>"Most developers I met wanted to build the next social media app," she explains. "I needed someone who understood that restaurants have unique challenges – inventory management, food safety, customer service."</p>
    
    <p>Eventually, she found her technical co-founder through a mutual connection. "He had worked in the food industry before and understood the operational challenges. That shared experience was crucial."</p>
    
    <h3>Step 2: Building the MVP</h3>
    
    <p>Together, they built a simple app that allowed customers to:</p>
    
    <ul>
      <li>Pre-order meals for pickup</li>
      <li>Join a virtual waitlist</li>
      <li>Track their order status in real-time</li>
      <li>Provide feedback directly to the kitchen</li>
    </ul>
    
    <p>"We started simple," Sarah says. "The goal was to solve one problem at a time, not to build the next Uber Eats."</p>
    
    <h2>The Results: Scaling Without Compromise</h2>
    
    <p>Within six months of launching the app, Sarah's restaurant saw:</p>
    
    <ul>
      <li>40% increase in order volume</li>
      <li>25% reduction in wait times</li>
      <li>60% improvement in customer satisfaction scores</li>
      <li>35% increase in average order value</li>
    </ul>
    
    <p>"The app didn't just solve our operational problems," Sarah explains. "It actually improved the entire customer experience. People could plan their meals, avoid waiting, and feel more connected to our brand."</p>
    
    <h2>Expanding to New Markets</h2>
    
    <p>Buoyed by success in San Francisco, Sarah decided to expand to Portland and Austin. But instead of opening new restaurants, she partnered with existing local restaurants that shared her values.</p>
    
    <p>"We became a platform for sustainable, local restaurants," she says. "Each city has its own culinary identity, and we wanted to celebrate that while maintaining our quality standards."</p>
    
    <h2>Key Lessons for Non-Tech Founders</h2>
    
    <p>Sarah's journey offers several important lessons for non-tech entrepreneurs:</p>
    
    <h3>1. Start with the Problem, Not the Solution</h3>
    
    <p>"I didn't set out to build a tech company," Sarah says. "I set out to solve real problems in my business. Technology was just the tool that helped me do it better."</p>
    
    <h3>2. Find the Right Technical Partner</h3>
    
    <p>"Domain expertise matters," she emphasizes. "My co-founder's experience in the food industry was just as valuable as his technical skills."</p>
    
    <h3>3. Build Incrementally</h3>
    
    <p>"We didn't try to build everything at once. We started with one problem and solved it really well before moving to the next."</p>
    
    <h3>4. Stay True to Your Values</h3>
    
    <p>"Technology should enhance your business, not change who you are. We used tech to scale our commitment to sustainability and quality, not to compromise on it."</p>
    
    <h2>Looking Ahead</h2>
    
    <p>Today, EcoClean Solutions operates in three cities with plans to expand to five more by the end of the year. Sarah has hired a full technical team and is exploring new features like AI-powered menu recommendations and automated inventory management.</p>
    
    <p>"The journey from restaurant owner to tech founder wasn't easy," she reflects. "But it was worth it. I get to solve problems I'm passionate about while building something that makes a real difference in people's lives."</p>
    
    <p>Her advice to other non-tech founders? "Don't let your lack of technical background hold you back. Your domain expertise and customer insights are just as valuable as any technical skill. Find the right partners, start small, and stay focused on solving real problems."</p>
  `,
  author: {
    name: "Sarah Chen",
    avatar: null,
    bio: "Founder of EcoClean Solutions, a tech-enabled sustainable food platform operating in San Francisco, Portland, and Austin.",
    social: {
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen"
    }
  },
  category: "founder-stories",
  categoryName: "Non-Tech Founder Stories",
  publishedAt: "2024-01-15",
  readTime: "8 min read",
  featured: true,
  tags: ["success-story", "food-tech", "scaling", "cofounder", "restaurant"],
  image: null,
  relatedPosts: [
    {
      id: "2",
      title: "The Complete Guide to Validating Your Non-Tech Startup Idea",
      excerpt: "A step-by-step framework for testing your business concept before investing time and money into development.",
      categoryName: "Startup Validation",
      readTime: "12 min read"
    },
    {
      id: "3",
      title: "How to Find Your Perfect Technical Co-founder",
      excerpt: "Practical strategies for non-tech founders to identify, approach, and partner with the right technical talent.",
      categoryName: "Finding Co-founders",
      readTime: "10 min read"
    }
  ]
};

export default function BlogPost() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Article Header */}
      <section className="pt-24 pb-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-8">
          <div className="mb-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
            
            <div className="flex items-center gap-3 mb-6">
              <Badge className="category-badge">
                {blogPost.categoryName}
              </Badge>
              <span className="text-sm text-muted-foreground">{blogPost.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-tight">
              {blogPost.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {blogPost.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={blogPost.author.avatar || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {blogPost.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{blogPost.author.name}</p>
                  <p className="text-sm text-muted-foreground">{blogPost.author.bio}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-light prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-2xl font-light text-foreground mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPost.relatedPosts.map((post) => (
              <Card key={post.id} className="startup-card group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="category-badge text-xs">
                      {post.categoryName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-light text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Article
                      <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
