import React from 'react';
import { ParkingSpot } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UniversityTampaParkingInfoProps {
  universityParkingSpots: ParkingSpot[];
  onSelectSpot?: (spot: ParkingSpot) => void;
}

const UniversityTampaParkingInfo: React.FC<UniversityTampaParkingInfoProps> = ({ 
  universityParkingSpots,
  onSelectSpot 
}) => {
  if (!universityParkingSpots || universityParkingSpots.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6 border-[#006747] border-2">
      <CardHeader className="bg-[#006747] text-white">
        <CardTitle className="text-lg flex items-center gap-2">
          University of Tampa Parking
          <Badge className="ml-2 bg-white text-[#006747]">
            {universityParkingSpots.length} Locations
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-100">
          Available parking spots around the University of Tampa campus
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {universityParkingSpots.map((spot) => (
            <div 
              key={spot.id}
              className="border rounded-md p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectSpot && onSelectSpot(spot)}
            >
              <h3 className="font-medium text-[#006747]">{spot.name}</h3>
              <p className="text-sm text-gray-600">{spot.address}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm">
                  <strong>${spot.price.toFixed(2)}/hr</strong>
                </span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {spot.available_spots} spots
                </span>
              </div>
              {spot.rating && (
                <div className="mt-1 text-sm text-yellow-600">
                  Rating: {spot.rating.toFixed(1)}/5.0
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversityTampaParkingInfo;