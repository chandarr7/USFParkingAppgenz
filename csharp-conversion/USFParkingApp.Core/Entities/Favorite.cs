using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Core.Entities;

public class Favorite
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public int ParkingSpotId { get; set; }
    
    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual ParkingSpot ParkingSpot { get; set; } = null!;
}