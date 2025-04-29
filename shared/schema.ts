import { pgTable, text, serial, integer, boolean, timestamp, varchar, doublePrecision, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Table definitions
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  price: doublePrecision("price").notNull(),
  available_spots: integer("available_spots").notNull(),
  distance: doublePrecision("distance"),
  rating: doublePrecision("rating"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  source: text("source").notNull(), // 'api' or 'local'
  external_id: text("external_id"), // ID from external API if applicable
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  parking_spot_id: integer("parking_spot_id").notNull().references(() => parkingSpots.id, { onDelete: 'cascade' }),
  date: timestamp("date").notNull(),
  start_time: text("start_time").notNull(),
  duration: integer("duration").notNull(),
  vehicle_type: text("vehicle_type").notNull(),
  license_plate: text("license_plate").notNull(),
  total_price: doublePrecision("total_price").notNull(),
  status: text("status").notNull(), // 'confirmed', 'pending', 'cancelled'
  payment_id: integer("payment_id").references(() => payments.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: doublePrecision("amount").notNull(),
  payment_method: text("payment_method").notNull(), // 'credit_card', 'wallet'
  payment_status: text("payment_status").notNull(), // 'succeeded', 'pending', 'failed'
  stripe_payment_intent_id: text("stripe_payment_intent_id"),
  transaction_date: timestamp("transaction_date").defaultNow().notNull(),
  last_four: text("last_four"), // Last four digits of the card (if credit card)
  card_brand: text("card_brand"), // Visa, Mastercard, etc.
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  parking_spot_id: integer("parking_spot_id").notNull().references(() => parkingSpots.id, { onDelete: 'cascade' }),
});

// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  reservations: many(reservations),
  favorites: many(favorites),
  payments: many(payments),
}));

export const parkingSpotsRelations = relations(parkingSpots, ({ many }) => ({
  reservations: many(reservations),
  favorites: many(favorites),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.user_id],
    references: [users.id],
  }),
  parkingSpot: one(parkingSpots, {
    fields: [reservations.parking_spot_id],
    references: [parkingSpots.id],
  }),
  payment: one(payments, {
    fields: [reservations.payment_id],
    references: [payments.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  user: one(users, {
    fields: [payments.user_id],
    references: [users.id],
  }),
  reservations: many(reservations),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.user_id],
    references: [users.id],
  }),
  parkingSpot: one(parkingSpots, {
    fields: [favorites.parking_spot_id],
    references: [parkingSpots.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertParkingSpotSchema = createInsertSchema(parkingSpots).omit({ id: true });
export const insertReservationSchema = createInsertSchema(reservations).omit({ id: true, created_at: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, transaction_date: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertParkingSpot = z.infer<typeof insertParkingSpotSchema>;
export type ParkingSpot = typeof parkingSpots.$inferSelect;

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Search schema
export const searchSchema = z.object({
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  radius: z.string().min(1, "Radius is required"),
});

export type SearchParams = z.infer<typeof searchSchema>;
