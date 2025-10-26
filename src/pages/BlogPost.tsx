import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User, Share2, Heart, Bookmark } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogSEO } from "@/components/seo/BlogSEO";
import { getBlogPostBySlug, getRelatedPostsBySlug } from "@/data/blogPosts";

export default function BlogPost() {
  const { slug } = useParams();
  
  // Get the blog post by slug
  const blogPost = getBlogPostBySlug(slug || "");
  const relatedPosts = getRelatedPostsBySlug(slug || "", 2);

  // If blog post not found, show 404
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 text-center">
          <div className="max-w-4xl mx-auto px-8">
            <h1 className="text-4xl font-light text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO post={blogPost} />
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
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-border bg-muted/20">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-2xl font-light text-foreground mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((post) => (
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
                    
                    <Link to={`/blog/${post.slug}`}>
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
      )}

      <Footer />
    </div>
  );
}
