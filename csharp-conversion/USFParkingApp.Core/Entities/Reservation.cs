using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Core.Entities;

public class Reservation
{
    public int Id { get; set; }
    
    [Required]
    public int ParkingSpotId { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    public DateTime StartTime { get; set; }
    
    [Required]
    public DateTime EndTime { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "pending"; // pending, confirmed, cancelled, completed
    
    [Required]
    [StringLength(20)]
    public string LicensePlate { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int? PaymentId { get; set; }
    
    // Navigation properties
    public virtual ParkingSpot ParkingSpot { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual Payment? Payment { get; set; }
}