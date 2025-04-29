using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Core.Entities.Visualization;

public class CapacityData
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [Range(0, 10000)]
    public int Capacity { get; set; }
    
    [Required]
    [Range(0, 10000)]
    public int Available { get; set; }
    
    // Calculate percentage available
    public int PercentageAvailable => Capacity > 0 ? (int)Math.Round((double)Available / Capacity * 100) : 0;
}