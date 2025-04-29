using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Core.Entities;

public class Payment
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [Range(0.01, 10000)]
    public decimal Amount { get; set; }
    
    [Required]
    [StringLength(50)]
    public string PaymentMethod { get; set; } = "credit_card"; // credit_card, usf_wallet
    
    [Required]
    [StringLength(50)]
    public string PaymentStatus { get; set; } = "pending"; // pending, succeeded, failed, refunded
    
    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    
    [StringLength(100)]
    public string? StripePaymentIntentId { get; set; }
    
    [StringLength(4)]
    public string? LastFour { get; set; }
    
    [StringLength(20)]
    public string? CardBrand { get; set; }
    
    // Navigation properties
    public virtual ApplicationUser User { get; set; } = null!;
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}