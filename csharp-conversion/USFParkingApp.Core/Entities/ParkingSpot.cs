using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Core.Entities;

public class ParkingSpot
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(255)]
    public string? Address { get; set; }
    
    [StringLength(100)]
    public string? City { get; set; }
    
    [Range(0, 10000)]
    public decimal Price { get; set; }
    
    [Range(0, 10000)]
    public int AvailableSpots { get; set; }
    
    public double? Distance { get; set; }
    
    [Range(0, 5)]
    public double? Rating { get; set; }
    
    public double Latitude { get; set; }
    
    public double Longitude { get; set; }
    
    [StringLength(50)]
    public string? Source { get; set; }
    
    [StringLength(50)]
    public string? ExternalId { get; set; }
    
    // Navigation properties
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}