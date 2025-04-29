using System;
using System.ComponentModel.DataAnnotations;

namespace ParkEase.Core.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ParkingSpotId { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
        
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }
        
        public int Duration { get; set; } // Duration in hours
        public string VehicleType { get; set; }
        public string LicensePlate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } // confirmed, pending, cancelled
        public DateTime CreatedAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; }
        public virtual ParkingSpot ParkingSpot { get; set; }
    }
}