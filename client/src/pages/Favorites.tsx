import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFavorites, addFavorite, removeFavorite } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useReservationModal } from "@/hooks/useReservationModal";
import ReservationModal from "@/components/ReservationModal";
import { ParkingSpot } from "@/types";
import { Star, MapPin, Bookmark } from "lucide-react";

const Favorites = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    isOpen: isReservationModalOpen,
    onOpen: openReservationModal,
    onClose: closeReservationModal,
    setSelectedParkingSpot,
    selectedParkingSpot
  } = useReservationModal();
  
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: () => fetchFavorites(1) // Using user ID 1 for demo
  });
  
  const removeMutation = useMutation({
    mutationFn: (id: number) => removeFavorite(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Removed from favorites",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    }
  });
  
  const handleReserve = (spot: ParkingSpot) => {
    setSelectedParkingSpot(spot);
    openReservationModal();
  };
  
  return (
    <>
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-medium">My Favorite Parking Spots</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-4">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <Skeleton className="h-4 w-3/4 mb-3" />
                      <div className="flex justify-between mt-4">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((spot) => (
                  <Card key={spot.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-neutral-800">{spot.name}</h3>
                        <span className="text-green-600 font-medium">${spot.price.toFixed(2)}/hr</span>
                      </div>
                      
                      <p className="text-sm text-neutral-600 mb-2">{spot.address}, {spot.city}</p>
                      
                      <div className="flex items-center text-sm mb-3">
                        {spot.distance && (
                          <div className="flex items-center mr-3">
                            <MapPin className="h-3.5 w-3.5 text-amber-500 mr-1" />
                            <span className="text-neutral-600">{spot.distance} miles</span>
                          </div>
                        )}
                        
                        {spot.rating && (
                          <div className="flex items-center">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
                            <span className="text-neutral-600">{spot.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button
                          onClick={() => handleReserve(spot)}
                          className="bg-primary hover:bg-primary-dark text-white"
                          size="sm"
                        >
                          <Bookmark className="h-3.5 w-3.5 mr-1" />
                          Reserve
                        </Button>
                        
                        <Button
                          onClick={() => removeMutation.mutate(spot.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-1">No favorites yet</h3>
                <p className="text-neutral-500">
                  Search for parking spots and add them to your favorites
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
        parkingSpot={selectedParkingSpot}
      />
    </>
  );
};

export default Favorites;
