import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Heart, Eye } from "lucide-react";

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
      <Card className="border-0 shadow-none hover:bg-accent/5 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={startup.logo_url || ''} alt={startup.name} />
              <AvatarFallback className="text-lg font-medium">
                {startup.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1 truncate">
                    {startup.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {startup.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {startup.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{startup.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{startup.view_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{startup.votes?.length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {startup.categories && (
                    <Badge variant="secondary" className="text-xs">
                      {startup.categories.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none hover:bg-accent/5 transition-colors overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video bg-accent/10 flex items-center justify-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={startup.logo_url || ''} alt={startup.name} />
            <AvatarFallback className="text-2xl font-medium">
              {startup.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-medium text-foreground line-clamp-1">
              {startup.name}
            </h3>
            {startup.categories && (
              <Badge variant="secondary" className="text-xs shrink-0">
                {startup.categories.name}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {startup.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {startup.location && (
                <>
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{startup.location}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{startup.view_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{startup.votes?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}