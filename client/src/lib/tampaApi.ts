import axios from 'axios';
import { ParkingSpot } from '@/types';

const TAMPA_PARKING_API_URL = 'https://arcgis.tampagov.net/arcgis/rest/services/Parking/TampaParking/FeatureServer/1/query';

// University of Tampa parking locations
const universityOfTampaLocations: ParkingSpot[] = [
  {
    id: 10001,
    name: "Thomas Parking Garage",
    address: "401 W Kennedy Blvd",
    city: "Tampa",
    price: 2.0,
    available_spots: 120,
    latitude: 27.9447,
    longitude: -82.4640,
    source: "university_tampa",
    external_id: "UT1001",
    rating: 4.2,
  },
  {
    id: 10002,
    name: "West Parking Garage",
    address: "318 N North Blvd",
    city: "Tampa",
    price: 1.5,
    available_spots: 85,
    latitude: 27.9465,
    longitude: -82.4655,
    source: "university_tampa",
    external_id: "UT1002",
    rating: 3.9,
  },
  {
    id: 10003,
    name: "Vaughn Center Parking",
    address: "200 N Boulevard",
    city: "Tampa",
    price: 1.0,
    available_spots: 65,
    latitude: 27.9437,
    longitude: -82.4637,
    source: "university_tampa",
    external_id: "UT1003",
    rating: 4.5,
  },
  {
    id: 10004,
    name: "Plant Hall Visitor Parking",
    address: "401 W Kennedy Blvd",
    city: "Tampa",
    price: 2.5,
    available_spots: 40,
    latitude: 27.9444,
    longitude: -82.4648,
    source: "university_tampa",
    external_id: "UT1004",
    rating: 4.1,
  },
  {
    id: 10005,
    name: "North Parking Lot",
    address: "304 N Boulevard",
    city: "Tampa",
    price: 1.0,
    available_spots: 55,
    latitude: 27.9475,
    longitude: -82.4640,
    source: "university_tampa",
    external_id: "UT1005",
    rating: 3.8,
  }
];

interface TampaParkingFeature {
  type: string;
  properties: {
    OBJECTID: number;
    NAME: string;
    ADDRESS: string;
    SPACES?: number;
    RATE?: string;
    LAT?: number;
    LON?: number;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface TampaParkingResponse {
  type: string;
  features: TampaParkingFeature[];
}

/**
 * Fetches parking garages data from Tampa's ArcGIS REST API
 */
export async function getTampaParkingGarages(): Promise<ParkingSpot[]> {
  try {
    const response = await axios.get<TampaParkingResponse>(TAMPA_PARKING_API_URL, {
      params: {
        where: '1=1',
        outFields: '*',
        f: 'geojson'
      }
    });

    // Convert ArcGIS API data to our ParkingSpot format
    const tampaSpots = response.data.features.map(feature => {
      // Extract rate as a number if possible
      let price = 0;
      if (feature.properties.RATE) {
        const rateMatch = feature.properties.RATE.match(/\$(\d+(\.\d+)?)/);
        if (rateMatch) {
          price = parseFloat(rateMatch[1]);
        }
      }

      // Get coordinates
      let latitude = 0;
      let longitude = 0;
      
      if (feature.properties.LAT && feature.properties.LON) {
        latitude = feature.properties.LAT;
        longitude = feature.properties.LON;
      } else if (feature.geometry && feature.geometry.coordinates) {
        // GeoJSON format has [longitude, latitude]
        longitude = feature.geometry.coordinates[0];
        latitude = feature.geometry.coordinates[1];
      }

      return {
        id: feature.properties.OBJECTID,
        name: feature.properties.NAME || 'Unknown Garage',
        address: feature.properties.ADDRESS || 'No address provided',
        city: 'Tampa',
        price: price,
        available_spots: feature.properties.SPACES || 0,
        distance: 0, // This would be calculated based on user's location
        rating: 4, // Default rating
        latitude,
        longitude,
        source: 'tampa_api',
        external_id: `tampa_${feature.properties.OBJECTID}`
      };
    });

    // Combine Tampa API data with University of Tampa locations
    return [...tampaSpots, ...universityOfTampaLocations];
  } catch (error) {
    console.error("Error fetching Tampa parking data:", error);
    // If Tampa API fails, still return University of Tampa locations
    return universityOfTampaLocations;
  }
}