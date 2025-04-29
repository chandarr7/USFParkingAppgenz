import { useState, useEffect } from "react";
import SearchSection from "@/components/SearchSection";
import MapAndListingSection from "@/components/MapAndListingSection";
import ParkingTrends from "@/components/ParkingTrends";
import ReservationModal from "@/components/ReservationModal";
import UniversityTampaParkingInfo from "@/components/UniversityTampaParkingInfo";
import { useReservationModal } from "@/hooks/useReservationModal";
import { useQuery } from "@tanstack/react-query";
import { ParkingSpot, SearchParams } from "@/types";
import { searchParkingSpots } from "@/lib/api";
import { getTampaParkingGarages } from "@/lib/tampaApi";

const Home = () => {
  const {
    isOpen: isReservationModalOpen,
    selectedParkingSpot,
    reservationData,
    onOpen,
    onClose,
    setSelectedParkingSpot,
    setReservationData
  } = useReservationModal();
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: "",
    date: new Date().toISOString().split('T')[0],
    radius: "1"
  });
  
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [universityParkingSpots, setUniversityParkingSpots] = useState<ParkingSpot[]>([]);
  
  // Query for search results
  const { data: parkingSpots = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/parking-spots/search', searchParams],
    queryFn: () => searchParkingSpots(searchParams),
    enabled: searchPerformed
  });
  
  // Query for University of Tampa parking locations
  const { data: tampaParkingData, isLoading: isTampaDataLoading } = useQuery({
    queryKey: ['tampa-parking'],
    queryFn: getTampaParkingGarages,
    staleTime: 1000 * 60 * 15  // 15 minutes
  });
  
  // Filter out University of Tampa locations
  useEffect(() => {
    if (tampaParkingData) {
      const universitySpots = tampaParkingData.filter(
        spot => spot.source === 'university_tampa'
      );
      setUniversityParkingSpots(universitySpots);
    }
  }, [tampaParkingData]);
  
  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setSearchPerformed(true);
    await refetch();
  };
  
  const handleReserve = (spot: ParkingSpot) => {
    setSelectedParkingSpot(spot);
    onOpen();
  };
  
  return (
    <>
      <SearchSection onSearch={handleSearch} />
      
      {/* University of Tampa Parking Information */}
      {!isTampaDataLoading && universityParkingSpots.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <UniversityTampaParkingInfo 
            universityParkingSpots={universityParkingSpots}
            onSelectSpot={handleReserve}
          />
        </div>
      )}
      
      {/* Search Results */}
      {searchPerformed && (
        <MapAndListingSection 
          parkingSpots={
            searchPerformed 
              ? parkingSpots 
              : universityParkingSpots
          }
          isLoading={isLoading}
          onReserve={handleReserve}
        />
      )}
      
      {/* Show University Parking on map if no search performed */}
      {!searchPerformed && !isTampaDataLoading && universityParkingSpots.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-2xl font-bold mb-4">University of Tampa Parking Map</h2>
          <MapAndListingSection 
            parkingSpots={universityParkingSpots}
            isLoading={isTampaDataLoading}
            onReserve={handleReserve}
          />
        </div>
      )}
      
      <ParkingTrends />
      
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={onClose}
        parkingSpot={selectedParkingSpot}
        initialData={reservationData}
      />
    </>
  );
};

export default Home;
