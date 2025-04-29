import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { 
  users, 
  type User, 
  type InsertUser, 
  parkingSpots, 
  type ParkingSpot, 
  type InsertParkingSpot,
  reservations,
  type Reservation,
  type InsertReservation,
  favorites,
  type Favorite,
  type InsertFavorite,
  payments,
  type Payment,
  type InsertPayment
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Parking spot operations
  getParkingSpots(): Promise<ParkingSpot[]>;
  getParkingSpot(id: number): Promise<ParkingSpot | undefined>;
  createParkingSpot(parkingSpot: InsertParkingSpot): Promise<ParkingSpot>;
  updateParkingSpot(id: number, parkingSpot: Partial<InsertParkingSpot>): Promise<ParkingSpot | undefined>;
  deleteParkingSpot(id: number): Promise<boolean>;
  
  // Reservation operations
  getReservations(userId?: number): Promise<Reservation[]>;
  getReservation(id: number): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: number, reservation: Partial<InsertReservation>): Promise<Reservation | undefined>;
  deleteReservation(id: number): Promise<boolean>;
  updateReservationPaymentId(id: number, paymentId: number): Promise<Reservation | undefined>;
  
  // Favorite operations
  getFavorites(userId: number): Promise<Favorite[]>;
  getFavoritesByUser(userId: number): Promise<ParkingSpot[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<boolean>;
  isFavorite(userId: number, parkingSpotId: number): Promise<boolean>;
  
  // Payment operations
  getPayments(userId?: number): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentByStripeId(stripePaymentIntentId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string): Promise<Payment | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Parking spot operations
  async getParkingSpots(): Promise<ParkingSpot[]> {
    return await db.select().from(parkingSpots);
  }

  async getParkingSpot(id: number): Promise<ParkingSpot | undefined> {
    const [spot] = await db.select().from(parkingSpots).where(eq(parkingSpots.id, id));
    return spot || undefined;
  }

  async createParkingSpot(insertParkingSpot: InsertParkingSpot): Promise<ParkingSpot> {
    const [spot] = await db.insert(parkingSpots).values(insertParkingSpot).returning();
    return spot;
  }

  async updateParkingSpot(id: number, parkingSpotUpdate: Partial<InsertParkingSpot>): Promise<ParkingSpot | undefined> {
    const [updatedSpot] = await db
      .update(parkingSpots)
      .set(parkingSpotUpdate)
      .where(eq(parkingSpots.id, id))
      .returning();
    return updatedSpot || undefined;
  }

  async deleteParkingSpot(id: number): Promise<boolean> {
    const [deletedSpot] = await db
      .delete(parkingSpots)
      .where(eq(parkingSpots.id, id))
      .returning({ id: parkingSpots.id });
    return !!deletedSpot;
  }

  // Reservation operations
  async getReservations(userId?: number): Promise<Reservation[]> {
    if (userId) {
      return await db.select().from(reservations).where(eq(reservations.user_id, userId));
    }
    return await db.select().from(reservations);
  }

  async getReservation(id: number): Promise<Reservation | undefined> {
    const [reservation] = await db.select().from(reservations).where(eq(reservations.id, id));
    return reservation || undefined;
  }

  async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
    const [reservation] = await db.insert(reservations).values(insertReservation).returning();
    return reservation;
  }

  async updateReservation(id: number, reservationUpdate: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const [updatedReservation] = await db
      .update(reservations)
      .set(reservationUpdate)
      .where(eq(reservations.id, id))
      .returning();
    return updatedReservation || undefined;
  }

  async deleteReservation(id: number): Promise<boolean> {
    const [deletedReservation] = await db
      .delete(reservations)
      .where(eq(reservations.id, id))
      .returning({ id: reservations.id });
    return !!deletedReservation;
  }

  // Favorite operations
  async getFavorites(userId: number): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.user_id, userId));
  }

  async getFavoritesByUser(userId: number): Promise<ParkingSpot[]> {
    const userFavorites = await db
      .select({
        parkingSpot: parkingSpots
      })
      .from(favorites)
      .innerJoin(
        parkingSpots,
        eq(favorites.parking_spot_id, parkingSpots.id)
      )
      .where(eq(favorites.user_id, userId));
    
    return userFavorites.map(row => row.parkingSpot);
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    // Check if favorite already exists
    const [existingFavorite] = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.user_id, insertFavorite.user_id),
          eq(favorites.parking_spot_id, insertFavorite.parking_spot_id)
        )
      );
    
    if (existingFavorite) {
      return existingFavorite;
    }
    
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    const [deletedFavorite] = await db
      .delete(favorites)
      .where(eq(favorites.id, id))
      .returning({ id: favorites.id });
    return !!deletedFavorite;
  }
  
  async isFavorite(userId: number, parkingSpotId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.user_id, userId),
          eq(favorites.parking_spot_id, parkingSpotId)
        )
      );
    return !!favorite;
  }

  // Additional reservation method for payments
  async updateReservationPaymentId(id: number, paymentId: number): Promise<Reservation | undefined> {
    const [updatedReservation] = await db
      .update(reservations)
      .set({ payment_id: paymentId })
      .where(eq(reservations.id, id))
      .returning();
    return updatedReservation || undefined;
  }

  // Payment operations
  async getPayments(userId?: number): Promise<Payment[]> {
    if (userId) {
      return await db.select().from(payments).where(eq(payments.user_id, userId));
    }
    return await db.select().from(payments);
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async getPaymentByStripeId(stripePaymentIntentId: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.stripe_payment_intent_id, stripePaymentIntentId));
    return payment || undefined;
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment | undefined> {
    const [updatedPayment] = await db
      .update(payments)
      .set({ payment_status: status })
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment || undefined;
  }
}

// Initialize the database with default data
async function initializeDatabase() {
  // Check if we have any users
  const existingUsers = await db.select().from(users);
  
  if (existingUsers.length === 0) {
    // Add default user
    await db.insert(users).values({
      username: "john.doe",
      password: "password123",
      name: "John Doe",
      email: "john.doe@example.com"
    });
    
    // Add default parking spots
    await db.insert(parkingSpots).values([
      {
        name: "Downtown Parking Garage",
        address: "123 Main Street",
        city: "City Center",
        price: 8.50,
        available_spots: 45,
        distance: 0.3,
        rating: 4.5,
        latitude: 40.7128,
        longitude: -74.0060,
        source: "local",
        external_id: null
      },
      {
        name: "City Center Lot",
        address: "456 Park Avenue",
        city: "Downtown",
        price: 5.00,
        available_spots: 12,
        distance: 0.5,
        rating: 4.2,
        latitude: 40.7142,
        longitude: -74.0064,
        source: "local",
        external_id: null
      }
    ]);
  }
}

// Create database instance
export const storage = new DatabaseStorage();

// Initialize the database
initializeDatabase().catch(console.error);
