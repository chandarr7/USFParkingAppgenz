using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Core.Entities.Visualization;

public class TrendData
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Time { get; set; } = string.Empty;
    
    [Required]
    [Range(0, 10000)]
    public int Available { get; set; }
}