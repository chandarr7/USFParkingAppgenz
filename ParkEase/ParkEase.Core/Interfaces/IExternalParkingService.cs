using ParkEase.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ParkEase.Core.Interfaces
{
    public interface IExternalParkingService
    {
        Task<IEnumerable<ParkingSpot>> GetParkingDataAsync();
    }
}