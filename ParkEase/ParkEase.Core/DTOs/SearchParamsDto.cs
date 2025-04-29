using System;
using System.ComponentModel.DataAnnotations;

namespace ParkEase.Core.DTOs
{
    public class SearchParamsDto
    {
        [Required]
        public string Location { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        [Range(0.1, 50.0)]
        public double Radius { get; set; }
    }
}