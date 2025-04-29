using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace ParkEase.Infrastructure.Services
{
    public class TampaParkingService : IExternalParkingService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiUrl = "https://services.arcgis.com/Qmpo5vdPrOQHt7MX/arcgis/rest/services/ParkingGaragesandLots_0/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";

        public TampaParkingService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<ParkingSpot>> GetParkingDataAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync(_apiUrl);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadFromJsonAsync<TampaParkingResponse>();
                
                if (content == null || content.Features == null || !content.Features.Any())
                {
                    return new List<ParkingSpot>();
                }

                return content.Features
                    .Where(f => f.Properties != null)
                    .Select(MapFeatureToParkingSpot)
                    .ToList();
            }
            catch (Exception ex)
            {
                // In a real application, you would log this exception
                Console.WriteLine($"Error fetching Tampa parking data: {ex.Message}");
                return new List<ParkingSpot>();
            }
        }

        private ParkingSpot MapFeatureToParkingSpot(TampaParkingFeature feature)
        {
            var properties = feature.Properties;
            var geometry = feature.Geometry;
            
            decimal price = 0;
            if (!string.IsNullOrEmpty(properties.RATE))
            {
                if (decimal.TryParse(properties.RATE.Replace("$", "").Trim(), out var parsedPrice))
                {
                    price = parsedPrice;
                }
            }

            int availableSpots = properties.SPACES ?? 50; // Default to 50 if not specified

            return new ParkingSpot
            {
                Name = properties.NAME ?? "Unknown Parking",
                Address = properties.ADDRESS ?? "No address provided",
                City = "Tampa",
                Price = price,
                AvailableSpots = availableSpots,
                Latitude = geometry.Coordinates[1],  // Lat is Y coordinate (second value)
                Longitude = geometry.Coordinates[0], // Long is X coordinate (first value)
                Source = "Tampa ArcGIS",
                ExternalId = properties.OBJECTID.ToString(),
                // Set non-database fields
                Rating = 4.0, // Default rating
                Distance = null // Will be calculated based on user's location
            };
        }
    }

    public class TampaParkingResponse
    {
        public string Type { get; set; }
        public List<TampaParkingFeature> Features { get; set; }
    }

    public class TampaParkingFeature
    {
        public string Type { get; set; }
        public TampaParkingProperties Properties { get; set; }
        public TampaParkingGeometry Geometry { get; set; }
    }

    public class TampaParkingProperties
    {
        public int OBJECTID { get; set; }
        public string NAME { get; set; }
        public string ADDRESS { get; set; }
        public int? SPACES { get; set; }
        public string RATE { get; set; }
        public double? LAT { get; set; }
        public double? LON { get; set; }
    }

    public class TampaParkingGeometry
    {
        public string Type { get; set; }
        public double[] Coordinates { get; set; } // [longitude, latitude]
    }
}