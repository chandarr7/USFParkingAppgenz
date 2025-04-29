using USFParkingApp.Core.Entities;

namespace USFParkingApp.Core.Interfaces;

public interface IReservationRepository
{
    Task<IEnumerable<Reservation>> GetAllAsync();
    Task<IEnumerable<Reservation>> GetByUserIdAsync(string userId);
    Task<Reservation?> GetByIdAsync(int id);
    Task<Reservation> AddAsync(Reservation reservation);
    Task<bool> UpdateAsync(Reservation reservation);
    Task<bool> DeleteAsync(int id);
    Task<bool> UpdatePaymentIdAsync(int reservationId, int paymentId);
}