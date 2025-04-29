import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertReservationSchema,
  insertFavoriteSchema,
  searchSchema,
} from "@shared/schema";
import axios from "axios";
import { setupAuth } from "./auth";
import { setupStripeRoutes } from "./stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Set up Stripe payment routes
  setupStripeRoutes(app);
  
  // Put application routes here
  // All routes are prefixed with /api

  // Get all parking spots
  app.get("/api/parking-spots", async (req: Request, res: Response) => {
    try {
      const parkingSpots = await storage.getParkingSpots();
      res.json(parkingSpots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking spots" });
    }
  });

  // Get specific parking spot
  app.get("/api/parking-spots/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const parkingSpot = await storage.getParkingSpot(id);
      
      if (!parkingSpot) {
        return res.status(404).json({ message: "Parking spot not found" });
      }
      
      res.json(parkingSpot);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking spot" });
    }
  });

  // Search parking spots
  app.post("/api/parking-spots/search", async (req: Request, res: Response) => {
    try {
      const validatedData = searchSchema.parse(req.body);
      
      // Local search from the storage
      const parkingSpots = await storage.getParkingSpots();
      
      // In a real application, would use location to filter results
      // Here we're just returning all spots and simulating distance
      
      // External API integration
      try {
        // Using Parking API from rapidapi.com
        const apiKey = process.env.PARKING_API_KEY || "";
        
        if (apiKey) {
          const options = {
            method: 'GET',
            url: 'https://parkingapi.p.rapidapi.com/search',
            params: {
              location: validatedData.location,
              radius: validatedData.radius
            },
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'parkingapi.p.rapidapi.com'
            }
          };
          
          // Would actually make this request if we had a working API key
          // const response = await axios.request(options);
          // const apiParkingSpots = response.data;
          
          // Process and store API results
          // for (const spot of apiParkingSpots) {
          //   const existingSpot = parkingSpots.find(p => p.external_id === spot.id && p.source === 'api');
          //   if (!existingSpot) {
          //     await storage.createParkingSpot({
          //       name: spot.name,
          //       address: spot.address,
          //       city: spot.city,
          //       price: spot.price,
          //       available_spots: spot.availableSpots,
          //       distance: spot.distance,
          //       rating: spot.rating,
          //       latitude: spot.coordinates.latitude,
          //       longitude: spot.coordinates.longitude,
          //       source: 'api',
          //       external_id: spot.id
          //     });
          //   }
          // }
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        // If API fails, we still return local results
      }
      
      // Get updated spots including any new ones from API
      const allSpots = await storage.getParkingSpots();
      
      res.json(allSpots);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to search parking spots" });
    }
  });

  // Reservations - CRUD operations
  
  // Get all reservations (or filtered by user_id if provided)
  app.get("/api/reservations", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const reservations = await storage.getReservations(userId);
      
      // Enrich with parking spot info
      const enrichedReservations = await Promise.all(
        reservations.map(async (reservation) => {
          const parkingSpot = await storage.getParkingSpot(reservation.parking_spot_id);
          return {
            ...reservation,
            parkingSpot: parkingSpot
          };
        })
      );
      
      res.json(enrichedReservations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  // Get specific reservation
  app.get("/api/reservations/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const reservation = await storage.getReservation(id);
      
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      const parkingSpot = await storage.getParkingSpot(reservation.parking_spot_id);
      
      res.json({
        ...reservation,
        parkingSpot
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reservation" });
    }
  });

  // Create reservation
  app.post("/api/reservations", async (req: Request, res: Response) => {
    try {
      const validatedData = insertReservationSchema.parse(req.body);
      
      // Ensure the parking spot exists
      const parkingSpot = await storage.getParkingSpot(validatedData.parking_spot_id);
      if (!parkingSpot) {
        return res.status(400).json({ message: "Parking spot not found" });
      }
      
      const reservation = await storage.createReservation(validatedData);
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reservation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });

  // Update reservation
  app.put("/api/reservations/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      // Validate the update fields
      const updateData = insertReservationSchema.partial().parse(req.body);
      
      // Check if reservation exists
      const existingReservation = await storage.getReservation(id);
      if (!existingReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      // If changing parking spot, ensure it exists
      if (updateData.parking_spot_id) {
        const parkingSpot = await storage.getParkingSpot(updateData.parking_spot_id);
        if (!parkingSpot) {
          return res.status(400).json({ message: "Parking spot not found" });
        }
      }
      
      const updatedReservation = await storage.updateReservation(id, updateData);
      res.json(updatedReservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid reservation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update reservation" });
    }
  });

  // Delete reservation
  app.delete("/api/reservations/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      // Check if reservation exists
      const existingReservation = await storage.getReservation(id);
      if (!existingReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      
      const success = await storage.deleteReservation(id);
      
      if (success) {
        res.status(204).end();
      } else {
        res.status(500).json({ message: "Failed to delete reservation" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete reservation" });
    }
  });

  // Favorites
  
  // Get user's favorites
  app.get("/api/favorites", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : 1; // Default to user 1 for demo
      const favorites = await storage.getFavoritesByUser(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add favorite
  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const validatedData = insertFavoriteSchema.parse(req.body);
      
      // Check if parking spot exists
      const parkingSpot = await storage.getParkingSpot(validatedData.parking_spot_id);
      if (!parkingSpot) {
        return res.status(400).json({ message: "Parking spot not found" });
      }
      
      // Check if already a favorite
      const isAlreadyFavorite = await storage.isFavorite(
        validatedData.user_id,
        validatedData.parking_spot_id
      );
      
      if (isAlreadyFavorite) {
        return res.status(400).json({ message: "Already in favorites" });
      }
      
      const favorite = await storage.createFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid favorite data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  // Remove favorite
  app.delete("/api/favorites/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteFavorite(id);
      
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Payments - Additional CRUD operations
  
  // Create a new payment record
  app.post("/api/payments", async (req: Request, res: Response) => {
    try {
      const { user_id, amount, payment_method, payment_status, stripe_payment_intent_id, last_four, card_brand } = req.body;
      
      if (!user_id || !amount || !payment_method || !payment_status) {
        return res.status(400).json({ error: "Required fields missing" });
      }
      
      const payment = await storage.createPayment({
        user_id,
        amount,
        payment_method,
        payment_status,
        stripe_payment_intent_id: stripe_payment_intent_id || null,
        last_four: last_four || null,
        card_brand: card_brand || null
      });
      
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Failed to create payment record" });
    }
  });
  
  // Update a payment record
  app.put("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (!id) {
        return res.status(400).json({ error: "Payment ID is required" });
      }
      
      const payment = await storage.getPayment(id);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      const { amount, payment_method, payment_status, stripe_payment_intent_id, last_four, card_brand } = req.body;
      
      const updatedPayment = await storage.updatePaymentStatus(id, payment_status);
      
      // We'd need to enhance the storage interface to support full payment updates
      // For now, the updatePaymentStatus method is the only one available
      
      res.json(updatedPayment);
    } catch (error) {
      console.error("Error updating payment:", error);
      res.status(500).json({ error: "Failed to update payment record" });
    }
  });
  
  // Delete a payment record
  app.delete("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (!id) {
        return res.status(400).json({ error: "Payment ID is required" });
      }
      
      const payment = await storage.getPayment(id);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      // Note: In a real application, you'd want to consider if payment records should
      // actually be deletable or just marked as archived/inactive
      
      // Implement deletePayment in storage interface
      // const success = await storage.deletePayment(id);
      
      // For now, we'll just return a 501 Not Implemented
      res.status(501).json({ message: "Payment deletion not implemented" });
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ error: "Failed to delete payment record" });
    }
  });

  // Create server
  const httpServer = createServer(app);
  return httpServer;
}
