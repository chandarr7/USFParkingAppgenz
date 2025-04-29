using Microsoft.EntityFrameworkCore;
using USFParkingApp.Core.Entities;
using USFParkingApp.Core.Interfaces;
using USFParkingApp.Infrastructure.Data;

namespace USFParkingApp.Infrastructure.Repositories;

public class PaymentRepository : RepositoryBase<Payment>, IPaymentRepository
{
    public PaymentRepository(ApplicationDbContext context) : base(context)
    {
    }
    
    public override async Task<IEnumerable<Payment>> GetAllAsync()
    {
        return await _dbSet
            .Include(p => p.User)
            .Include(p => p.Reservations)
            .ToListAsync();
    }
    
    public async Task<IEnumerable<Payment>> GetByUserIdAsync(string userId)
    {
        return await _dbSet
            .Include(p => p.Reservations)
            .ThenInclude(r => r.ParkingSpot)
            .Where(p => p.UserId == userId)
            .ToListAsync();
    }
    
    public override async Task<Payment?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.User)
            .Include(p => p.Reservations)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
    
    public async Task<Payment?> GetByStripePaymentIntentIdAsync(string stripePaymentIntentId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(p => p.StripePaymentIntentId == stripePaymentIntentId);
    }
    
    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        var payment = await GetByIdAsync(id);
        if (payment == null)
            return false;
            
        payment.Status = status;
        return true;
    }
}