using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;

namespace ParkEase.Infrastructure.Services
{
    public class UniversityOfTampaParkingService : IUniversityParkingService
    {
        private readonly IList<ParkingSpot> _universityParkingSpots;

        public UniversityOfTampaParkingService()
        {
            // Initialize with static data for University of Tampa parking locations
            _universityParkingSpots = new List<ParkingSpot>
            {
                new ParkingSpot
                {
                    Name = "Thomas Parking Garage",
                    Address = "401 W Kennedy Blvd",
                    City = "Tampa",
                    Price = 2.0m,
                    AvailableSpots = 120,
                    Latitude = 27.9447,
                    Longitude = -82.4640,
                    Source = ParkingLocationSource.UniversityOfTampa,
                    ExternalId = "UT1001",
                    Rating = 4.2
                },
                new ParkingSpot
                {
                    Name = "West Parking Garage",
                    Address = "318 N North Blvd",
                    City = "Tampa",
                    Price = 1.5m,
                    AvailableSpots = 85,
                    Latitude = 27.9465,
                    Longitude = -82.4655,
                    Source = ParkingLocationSource.UniversityOfTampa,
                    ExternalId = "UT1002",
                    Rating = 3.9
                },
                new ParkingSpot
                {
                    Name = "Vaughn Center Parking",
                    Address = "200 N Boulevard",
                    City = "Tampa",
                    Price = 1.0m,
                    AvailableSpots = 65,
                    Latitude = 27.9437,
                    Longitude = -82.4637,
                    Source = ParkingLocationSource.UniversityOfTampa,
                    ExternalId = "UT1003",
                    Rating = 4.5
                },
                new ParkingSpot
                {
                    Name = "Plant Hall Visitor Parking",
                    Address = "401 W Kennedy Blvd",
                    City = "Tampa",
                    Price = 2.5m,
                    AvailableSpots = 40,
                    Latitude = 27.9444,
                    Longitude = -82.4648,
                    Source = ParkingLocationSource.UniversityOfTampa,
                    ExternalId = "UT1004",
                    Rating = 4.1
                },
                new ParkingSpot
                {
                    Name = "North Parking Lot",
                    Address = "304 N Boulevard",
                    City = "Tampa",
                    Price = 1.0m,
                    AvailableSpots = 55,
                    Latitude = 27.9475,
                    Longitude = -82.4640,
                    Source = ParkingLocationSource.UniversityOfTampa,
                    ExternalId = "UT1005",
                    Rating = 3.8
                }
            };
        }

        public Task<IEnumerable<ParkingSpot>> GetParkingSpotsAsync()
        {
            return Task.FromResult<IEnumerable<ParkingSpot>>(_universityParkingSpots);
        }

        public Task<ParkingSpot> GetParkingSpotByExternalIdAsync(string externalId)
        {
            var spot = _universityParkingSpots.FirstOrDefault(s => s.ExternalId == externalId);
            return Task.FromResult(spot);
        }
    }
}