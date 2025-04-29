import { apiRequest } from "./queryClient";
import type { 
  ParkingSpot, 
  Reservation, 
  Favorite, 
  SearchParams,
  EnrichedReservation
} from "@/types";
import { getTampaParkingGarages } from "./tampaApi";

// Parking Spots
export async function fetchParkingSpots(): Promise<ParkingSpot[]> {
  const res = await apiRequest("GET", "/api/parking-spots", undefined);
  return res.json();
}

export async function fetchParkingSpot(id: number): Promise<ParkingSpot> {
  const res = await apiRequest("GET", `/api/parking-spots/${id}`, undefined);
  return res.json();
}

export async function searchParkingSpots(params: SearchParams): Promise<ParkingSpot[]> {
  // Get spots from our backend
  const res = await apiRequest("POST", "/api/parking-spots/search", params);
  const localSpots = await res.json();
  
  try {
    // Get spots from Tampa API
    let tampaSpots: ParkingSpot[] = [];
    
    // Only fetch Tampa spots if location contains Tampa or no location specified
    const isTampaSearch = !params.location || 
      params.location.toLowerCase().includes('tampa') || 
      params.location.toLowerCase().includes('fl');
      
    if (isTampaSearch) {
      tampaSpots = await getTampaParkingGarages();
      
      // Calculate a simple distance score if location is provided
      if (params.location && params.location.trim() !== '') {
        // For demo purposes, just assign random distances
        tampaSpots = tampaSpots.map(spot => ({
          ...spot,
          distance: Math.random() * parseFloat(params.radius)
        }));
      }
    }
    
    // Combine both sources
    return [...localSpots, ...tampaSpots];
  } catch (error) {
    // If Tampa API fails, just return local data
    return localSpots;
  }
}

// Reservations
export async function fetchReservations(userId?: number): Promise<EnrichedReservation[]> {
  const queryString = userId ? `?userId=${userId}` : '';
  const res = await apiRequest("GET", `/api/reservations${queryString}`, undefined);
  return res.json();
}

export async function fetchReservation(id: number): Promise<EnrichedReservation> {
  const res = await apiRequest("GET", `/api/reservations/${id}`, undefined);
  return res.json();
}

export interface CreateReservationData {
  user_id: number;
  parking_spot_id: number;
  date: string;
  start_time: string;
  duration: number;
  vehicle_type: string;
  license_plate: string;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export async function createReservation(data: CreateReservationData): Promise<Reservation> {
  const res = await apiRequest("POST", "/api/reservations", data);
  return res.json();
}

export async function updateReservation(id: number, data: Partial<CreateReservationData>): Promise<Reservation> {
  const res = await apiRequest("PUT", `/api/reservations/${id}`, data);
  return res.json();
}

export async function deleteReservation(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/reservations/${id}`, undefined);
}

// Favorites
export async function fetchFavorites(userId: number = 1): Promise<ParkingSpot[]> {
  const res = await apiRequest("GET", `/api/favorites?userId=${userId}`, undefined);
  return res.json();
}

export async function addFavorite(userId: number, parkingSpotId: number): Promise<Favorite> {
  const res = await apiRequest("POST", "/api/favorites", { user_id: userId, parking_spot_id: parkingSpotId });
  return res.json();
}

export async function removeFavorite(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/favorites/${id}`, undefined);
}
