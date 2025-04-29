using System;
using System.Collections.Generic;

namespace ParkEase.Core.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        
        // Navigation properties
        public virtual ICollection<Reservation> Reservations { get; set; }
        public virtual ICollection<Favorite> Favorites { get; set; }
    }
}