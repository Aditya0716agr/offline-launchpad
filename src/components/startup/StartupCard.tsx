import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "./BookmarkButton";
import { VoteButton } from "./VoteButton";

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
    profiles?: {
      is_founding_member?: boolean;
    };
  };
  viewMode?: "grid" | "list";
}

export function StartupCard({ startup, viewMode = "grid" }: StartupCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="startup-card group bg-white border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-white rounded-lg flex items-center justify-center border border-gray-100">
                {startup.logo_url ? (
                  <img 
                    src={startup.logo_url} 
                    alt={startup.name}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-green-600">
                      {startup.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Business Name */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate group-hover:text-green-600 transition-colors">
                    {startup.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                    {startup.description}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-gray-500">
                    {startup.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{startup.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">{startup.view_count}</span>
                    </div>
                    <VoteButton 
                      startupId={startup.id}
                      currentVotes={startup.votes?.length || 0}
                      size="sm"
                      variant="ghost"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {startup.categories && (
                    <Badge className="bg-green-600 text-white border-0 shadow-sm text-xs font-medium px-2 py-1">
                      {startup.categories.name}
                    </Badge>
                  )}
                  {startup.profiles?.is_founding_member && (
                    <Badge className="bg-amber-500 text-white border-0 shadow-sm text-xs">
                      🎖
                    </Badge>
                  )}
                  <div className="flex items-center gap-2">
                    <BookmarkButton 
                      startupId={startup.id} 
                      size="sm" 
                      variant="ghost"
                      className="text-gray-500 hover:text-green-600"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="startup-card group bg-white border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Logo Section */}
        <div className="relative h-32 bg-gradient-to-br from-green-50 to-white overflow-hidden">
          {startup.logo_url ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                src={startup.logo_url} 
                alt={startup.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">
                  {startup.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
          
          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {startup.categories && (
              <Badge className="bg-green-600 text-white border-0 shadow-sm text-xs font-medium px-2 py-1">
                {startup.categories.name}
              </Badge>
            )}
            {startup.profiles?.is_founding_member && (
              <Badge className="bg-amber-500 text-white border-0 shadow-sm text-xs">
                🎖
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-5">
          {/* Business Name */}
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
            {startup.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {startup.description}
          </p>
          
          {/* Location */}
          {startup.location && (
            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{startup.location}</span>
            </div>
          )}
          
          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{startup.view_count}</span>
              </div>
              <VoteButton 
                startupId={startup.id}
                currentVotes={startup.votes?.length || 0}
                size="sm"
                variant="ghost"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <BookmarkButton 
                startupId={startup.id} 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-green-600"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}