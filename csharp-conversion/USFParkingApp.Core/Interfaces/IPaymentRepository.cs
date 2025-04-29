using USFParkingApp.Core.Entities;

namespace USFParkingApp.Core.Interfaces;

public interface IPaymentRepository
{
    Task<IEnumerable<Payment>> GetAllAsync();
    Task<IEnumerable<Payment>> GetByUserIdAsync(string userId);
    Task<Payment?> GetByIdAsync(int id);
    Task<Payment?> GetByStripePaymentIntentIdAsync(string stripePaymentIntentId);
    Task<Payment> AddAsync(Payment payment);
    Task<bool> UpdateStatusAsync(int id, string status);
}