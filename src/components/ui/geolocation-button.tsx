import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeolocationButtonProps {
  onLocationFound: (location: string) => void;
}

export const GeolocationButton = ({ onLocationFound }: GeolocationButtonProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get city/location name
          // For now, we'll use a simple approach with approximate location
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (response.ok) {
            const data = await response.json();
            const location = data.city || data.locality || data.principalSubdivision || "Unknown Location";
            onLocationFound(location);
            toast({
              title: "Location found",
              description: `Searching near ${location}`,
            });
          } else {
            throw new Error("Failed to get location name");
          }
        } catch (error) {
          console.error("Error getting location name:", error);
          toast({
            title: "Error",
            description: "Failed to get your location name",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        console.error("Geolocation error:", error);
        
        let message = "Failed to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGetLocation}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MapPin className="w-4 h-4" />
      )}
      Near Me
    </Button>
  );
};