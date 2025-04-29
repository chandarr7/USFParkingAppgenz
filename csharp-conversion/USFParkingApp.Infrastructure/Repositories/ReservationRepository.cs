using Microsoft.EntityFrameworkCore;
using USFParkingApp.Core.Entities;
using USFParkingApp.Core.Interfaces;
using USFParkingApp.Infrastructure.Data;

namespace USFParkingApp.Infrastructure.Repositories;

public class ReservationRepository : RepositoryBase<Reservation>, IReservationRepository
{
    public ReservationRepository(ApplicationDbContext context) : base(context)
    {
    }
    
    public override async Task<IEnumerable<Reservation>> GetAllAsync()
    {
        return await _dbSet
            .Include(r => r.ParkingSpot)
            .Include(r => r.User)
            .Include(r => r.Payment)
            .ToListAsync();
    }
    
    public async Task<IEnumerable<Reservation>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .Include(r => r.ParkingSpot)
            .Include(r => r.Payment)
            .Where(r => r.UserId == userId)
            .ToListAsync();
    }
    
    public override async Task<Reservation?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(r => r.ParkingSpot)
            .Include(r => r.User)
            .Include(r => r.Payment)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
    
    public async Task<bool> UpdateAsync(Reservation reservation)
    {
        var existingReservation = await GetByIdAsync(reservation.Id);
        if (existingReservation == null)
            return false;
            
        _context.Entry(existingReservation).CurrentValues.SetValues(reservation);
        return true;
    }
    
    public async Task<bool> UpdatePaymentIdAsync(int reservationId, int paymentId)
    {
        var reservation = await GetByIdAsync(reservationId);
        if (reservation == null)
            return false;
            
        reservation.PaymentId = paymentId;
        return true;
    }
}