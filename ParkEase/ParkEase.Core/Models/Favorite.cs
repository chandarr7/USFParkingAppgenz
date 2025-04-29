using System;

namespace ParkEase.Core.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ParkingSpotId { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; }
        public virtual ParkingSpot ParkingSpot { get; set; }
    }
}