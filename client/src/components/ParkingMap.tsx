import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ParkingSpot } from '@/types';
import L from 'leaflet';

// Fix leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define the DefaultIcon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Define a special icon for University of Tampa locations
let UniversityIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'university-marker', // This will be styled with CSS
});

// Set the default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

interface ParkingMapProps {
  parkingSpots: ParkingSpot[];
  onSelectSpot?: (spot: ParkingSpot) => void;
}

// Component to recenter map when center changes
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ParkingMap: React.FC<ParkingMapProps> = ({ parkingSpots, onSelectSpot }) => {
  // Default center will be University of Tampa
  const [mapCenter, setMapCenter] = useState<[number, number]>([27.9450, -82.4645]);
  const [zoom, setZoom] = useState(15);

  // Set map center based on spots and focus on University of Tampa locations
  useEffect(() => {
    if (parkingSpots.length > 0) {
      // First try to find University of Tampa spots
      const universitySpots = parkingSpots.filter(
        spot => spot.source === 'university_tampa' && spot.latitude && spot.longitude
      );
      
      if (universitySpots.length > 0) {
        // Center on first University spot
        setMapCenter([universitySpots[0].latitude!, universitySpots[0].longitude!]);
        setZoom(15); // Closer zoom for university spots
      } else {
        // Fall back to any spot with coordinates
        const spotsWithCoordinates = parkingSpots.filter(
          spot => spot.latitude && spot.longitude
        );
        
        if (spotsWithCoordinates.length > 0) {
          // Use first spot as center
          const firstSpot = spotsWithCoordinates[0];
          setMapCenter([firstSpot.latitude || 27.9506, firstSpot.longitude || -82.4572]);
          setZoom(13);
        }
      }
    }
  }, [parkingSpots]);

  const handleMarkerClick = (spot: ParkingSpot) => {
    if (onSelectSpot) {
      onSelectSpot(spot);
    }
  };

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Highlight University of Tampa campus */}
        <Circle 
          center={[27.9450, -82.4645]} 
          radius={250}
          pathOptions={{ fillColor: '#006747', fillOpacity: 0.1, color: '#006747', weight: 2 }}
        />
        
        {/* Add University of Tampa buildings as markers */}
        <Marker
          position={[27.9460, -82.4638]}
          icon={L.divIcon({
            className: 'bg-transparent',
            html: `<div class="university-label">Plant Hall</div>`,
            iconSize: [80, 20],
            iconAnchor: [40, 0]
          })}
        />
        
        <Marker
          position={[27.9437, -82.4630]}
          icon={L.divIcon({
            className: 'bg-transparent',
            html: `<div class="university-label">Vaughn Center</div>`,
            iconSize: [100, 20],
            iconAnchor: [50, 0]
          })}
        />
        
        <Marker
          position={[27.9470, -82.4655]}
          icon={L.divIcon({
            className: 'bg-transparent',
            html: `<div class="university-label">Athletic Field</div>`,
            iconSize: [100, 20],
            iconAnchor: [50, 0]
          })}
        />

        {parkingSpots.map(spot => {
          if (!spot.latitude || !spot.longitude) return null;
          
          // Determine if this is a University of Tampa location
          const isUniversity = spot.source === 'university_tampa';
          const markerIcon = isUniversity ? UniversityIcon : DefaultIcon;
          
          return (
            <Marker
              key={`${spot.source}-${spot.id}`}
              position={[spot.latitude, spot.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => handleMarkerClick(spot),
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-medium">{spot.name}</h3>
                  {isUniversity && (
                    <span className="inline-block bg-[#006747] text-white text-xs px-2 py-0.5 rounded mb-1">
                      University of Tampa
                    </span>
                  )}
                  <p className="text-sm">{spot.address}</p>
                  <p className="text-sm">
                    <strong>Price:</strong> ${spot.price.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Available spots:</strong> {spot.available_spots}
                  </p>
                  {spot.rating && (
                    <p className="text-sm">
                      <strong>Rating:</strong> {spot.rating.toFixed(1)}/5.0
                    </p>
                  )}
                  {onSelectSpot && (
                    <button
                      className="mt-2 text-xs bg-primary text-white px-2 py-1 rounded"
                      onClick={() => handleMarkerClick(spot)}
                    >
                      Select
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ParkingMap;