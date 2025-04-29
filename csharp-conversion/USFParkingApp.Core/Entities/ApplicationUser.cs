using Microsoft.AspNetCore.Identity;

namespace USFParkingApp.Core.Entities;

public class ApplicationUser : IdentityUser
{
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    
    // Navigation properties
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public virtual ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}