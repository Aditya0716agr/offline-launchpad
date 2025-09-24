import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartupCardProps {
  startup: {
    id: string;
    name: string;
    description: string;
    logo_url: string | null;
    location: string | null;
    view_count: number;
    categories: {
      name: string;
      slug: string;
    } | null;
    votes: { id: string }[];
  };
  viewMode?: "grid" | "list";
}

export function StartupCard({ startup, viewMode = "grid" }: StartupCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="startup-card group">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="shrink-0">
              <Avatar className="w-20 h-20">
                <AvatarImage src={startup.logo_url || ''} alt={startup.name} />
                <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                  {startup.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Business Name */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 truncate group-hover:text-primary transition-colors">
                    {startup.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
                    {startup.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-muted-foreground">
                    {startup.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{startup.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{startup.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{startup.votes?.length || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {startup.categories && (
                    <Badge className="category-badge">
                      {startup.categories.name}
                    </Badge>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="startup-card group">
      <CardContent className="p-0">
        {/* Hero Image Area */}
        <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary">
          {startup.logo_url ? (
            <img 
              src={startup.logo_url} 
              alt={startup.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                  {startup.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          
          {/* Category Badge Overlay */}
          {startup.categories && (
            <div className="absolute top-3 right-3">
              <Badge className="category-badge shadow-sm">
                {startup.categories.name}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-6">
          {/* Business Name */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {startup.name}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
            {startup.description}
          </p>
          
          {/* Location */}
          {startup.location && (
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{startup.location}</span>
            </div>
          )}
          
          {/* Stats and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{startup.view_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{startup.votes?.length || 0}</span>
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-3 h-3 mr-2" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}