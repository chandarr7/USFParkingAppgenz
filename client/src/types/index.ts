export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface ParkingSpot {
  id: number;
  name: string;
  address: string;
  city: string;
  price: number;
  available_spots: number;
  distance?: number;
  rating?: number;
  latitude?: number;
  longitude?: number;
  source: string;
  external_id?: string | null;
}

export interface Reservation {
  id: number;
  user_id: number;
  parking_spot_id: number;
  date: string;
  start_time: string;
  duration: number;
  vehicle_type: string;
  license_plate: string;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  parkingSpot?: ParkingSpot;
}

export interface EnrichedReservation extends Reservation {
  parkingSpot: ParkingSpot;
}

export interface Favorite {
  id: number;
  user_id: number;
  parking_spot_id: number;
}

export interface SearchParams {
  location: string;
  date: string;
  radius: string;
}
