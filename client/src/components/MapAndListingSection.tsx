import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ParkingSpotItem from "./ParkingSpotItem";
import ParkingMap from "./ParkingMap";
import { ParkingSpot } from "@/types";
import { Map, AlertCircle } from "lucide-react";

interface MapAndListingSectionProps {
  parkingSpots: ParkingSpot[];
  isLoading: boolean;
  onReserve: (spot: ParkingSpot) => void;
}

const MapAndListingSection: React.FC<MapAndListingSectionProps> = ({ 
  parkingSpots, 
  isLoading,
  onReserve
}) => {
  const [sortOption, setSortOption] = useState<'distance' | 'price' | 'availability'>('distance');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  
  const sortedSpots = [...parkingSpots].sort((a, b) => {
    if (sortOption === 'distance') {
      return (a.distance || 999) - (b.distance || 999);
    } else if (sortOption === 'price') {
      return a.price - b.price;
    } else {
      return b.available_spots - a.available_spots;
    }
  });
  
  const handleParkingSpotSelect = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
  };
  
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Map */}
        <div className="lg:col-span-2">
          <Card className="h-96 lg:h-[32rem] overflow-hidden">
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Parking Locations Map</CardTitle>
                {selectedSpot && (
                  <div className="flex items-center text-sm">
                    <span className="text-primary font-medium">{selectedSpot.name}</span>
                    <span className="mx-1">•</span>
                    <span>${selectedSpot.price.toFixed(2)}/hr</span>
                    <span className="mx-1">•</span>
                    <span>{selectedSpot.available_spots} spots</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)]">
              {parkingSpots.length > 0 ? (
                <ParkingMap 
                  parkingSpots={parkingSpots} 
                  onSelectSpot={handleParkingSpotSelect} 
                />
              ) : (
                <div className="bg-neutral-200 h-full w-full flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-center p-4">
                      <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                      <Skeleton className="h-4 w-48 mx-auto mt-4" />
                      <Skeleton className="h-3 w-36 mx-auto mt-2" />
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <AlertCircle className="h-16 w-16 text-neutral-400 mx-auto" />
                      <p className="mt-2 text-neutral-600">No parking locations found</p>
                      <p className="text-sm text-neutral-500">Try searching for a different area</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side: Results List */}
        <div className="lg:col-span-1">
          <Card className="h-96 lg:h-[32rem] flex flex-col">
            <CardHeader className="py-4 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Available Parking Spots</CardTitle>
                <div className="flex items-center">
                  <span className="text-sm text-neutral-600 mr-2">Sort by:</span>
                  <Select 
                    defaultValue={sortOption} 
                    onValueChange={(value) => setSortOption(value as any)}
                  >
                    <SelectTrigger className="h-8 text-sm w-[100px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="availability">Availability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto p-2">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="mb-3 p-3 border border-neutral-200 rounded-lg">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : sortedSpots.length > 0 ? (
                sortedSpots.map((spot) => (
                  <ParkingSpotItem 
                    key={spot.id} 
                    spot={spot} 
                    onSelect={() => handleParkingSpotSelect(spot)}
                    onReserve={() => onReserve(spot)}
                    isSelected={selectedSpot?.id === spot.id}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-neutral-600">No parking spots found</p>
                  <p className="text-sm text-neutral-500">Try adjusting your search criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MapAndListingSection;
