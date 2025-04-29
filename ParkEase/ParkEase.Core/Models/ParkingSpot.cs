using System;

namespace ParkEase.Core.Models
{
    public class ParkingSpot
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public decimal Price { get; set; }
        public int AvailableSpots { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public ParkingLocationSource Source { get; set; }
        public string ExternalId { get; set; }
        public double? Rating { get; set; }
        public double? Distance { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}