using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Core.Entities.Visualization;

public class UsageData
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [Range(0, 100)]
    public int Value { get; set; }
}