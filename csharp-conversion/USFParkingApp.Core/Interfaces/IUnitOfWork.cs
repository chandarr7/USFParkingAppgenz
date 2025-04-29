namespace USFParkingApp.Core.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IParkingSpotRepository ParkingSpots { get; }
    IReservationRepository Reservations { get; }
    IPaymentRepository Payments { get; }
    IFavoriteRepository Favorites { get; }
    IVisualizationRepository Visualizations { get; }
    
    Task<int> CompleteAsync();
}