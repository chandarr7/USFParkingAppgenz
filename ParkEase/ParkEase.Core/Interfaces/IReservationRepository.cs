using System.Collections.Generic;
using System.Threading.Tasks;
using ParkEase.Core.Models;

namespace ParkEase.Core.Interfaces
{
    public interface IReservationRepository : IRepository<Reservation>
    {
        Task<IEnumerable<Reservation>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Reservation>> GetByParkingSpotIdAsync(int parkingSpotId);
        Task<IEnumerable<Reservation>> GetWithDetailsAsync();
    }
}