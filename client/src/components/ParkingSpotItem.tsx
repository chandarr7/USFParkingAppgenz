import { ParkingSpot } from "@/types";
import { MapPin, Star, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParkingSpotItemProps {
  spot: ParkingSpot;
  onSelect: () => void;
  onReserve: () => void;
  isSelected: boolean;
}

const ParkingSpotItem: React.FC<ParkingSpotItemProps> = ({ 
  spot, 
  onSelect, 
  onReserve,
  isSelected
}) => {
  const handleReserveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReserve();
  };
  
  return (
    <div 
      className={cn(
        "mb-3 p-3 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer",
        isSelected 
          ? "border-primary shadow-md" 
          : "border-neutral-200 hover:border-primary"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between">
        <h4 className="font-medium text-neutral-800">{spot.name}</h4>
        <span className="text-green-600 font-medium">${spot.price.toFixed(2)}/hr</span>
      </div>
      
      <p className="text-sm text-neutral-600 mt-1">{spot.address}, {spot.city}</p>
      
      <div className="flex items-center text-sm mt-2">
        {spot.distance && (
          <>
            <MapPin className="h-3.5 w-3.5 text-amber-500 mr-1" />
            <span className="text-neutral-600 mr-3">{spot.distance} miles</span>
          </>
        )}
        
        <span className="material-icons text-green-600 text-sm mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z" />
            <circle cx="7.5" cy="14.5" r="1.5" />
            <circle cx="16.5" cy="14.5" r="1.5" />
          </svg>
        </span>
        <span className="text-neutral-600">{spot.available_spots} spots available</span>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <button 
          className="text-primary text-sm font-medium flex items-center" 
          onClick={handleReserveClick}
        >
          <Bookmark className="h-3.5 w-3.5 mr-1" />
          Reserve
        </button>
        
        {spot.rating && (
          <span className="flex items-center">
            <span className="text-neutral-600 text-sm mr-1">{spot.rating}</span>
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          </span>
        )}
      </div>
    </div>
  );
};

export default ParkingSpotItem;
