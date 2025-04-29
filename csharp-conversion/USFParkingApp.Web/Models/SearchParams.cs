using System.ComponentModel.DataAnnotations;

namespace USFParkingApp.Web.Models;

public class SearchParams
{
    public string? Location { get; set; }
    
    [Range(0, 100)]
    public double? Radius { get; set; }
    
    [Range(0, 1000)]
    public decimal? MaxPrice { get; set; }
}