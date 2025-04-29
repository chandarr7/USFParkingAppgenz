using System.Collections.Generic;
using System.Threading.Tasks;
using ParkEase.Core.Models;

namespace ParkEase.Core.Interfaces
{
    public interface IUniversityParkingService
    {
        Task<IEnumerable<ParkingSpot>> GetParkingSpotsAsync();
        Task<ParkingSpot> GetParkingSpotByExternalIdAsync(string externalId);
    }
}