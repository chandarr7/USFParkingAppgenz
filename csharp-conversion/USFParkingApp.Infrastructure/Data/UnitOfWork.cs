using USFParkingApp.Core.Interfaces;
using USFParkingApp.Infrastructure.Repositories;

namespace USFParkingApp.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IParkingSpotRepository _parkingSpots = null!;
    private IReservationRepository _reservations = null!;
    private IPaymentRepository _payments = null!;
    private IFavoriteRepository _favorites = null!;
    private IVisualizationRepository _visualizations = null!;
    
    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public IParkingSpotRepository ParkingSpots => 
        _parkingSpots ??= new ParkingSpotRepository(_context);
        
    public IReservationRepository Reservations => 
        _reservations ??= new ReservationRepository(_context);
        
    public IPaymentRepository Payments => 
        _payments ??= new PaymentRepository(_context);
        
    public IFavoriteRepository Favorites => 
        _favorites ??= new FavoriteRepository(_context);
        
    public IVisualizationRepository Visualizations => 
        _visualizations ??= new VisualizationRepository(_context);
    
    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }
    
    public void Dispose()
    {
        _context.Dispose();
    }
}