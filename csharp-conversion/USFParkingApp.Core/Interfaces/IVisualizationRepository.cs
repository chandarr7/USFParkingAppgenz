using USFParkingApp.Core.Entities.Visualization;

namespace USFParkingApp.Core.Interfaces;

public interface IVisualizationRepository
{
    // Capacity data operations
    Task<IEnumerable<CapacityData>> GetAllCapacityDataAsync();
    Task<CapacityData?> GetCapacityDataByIdAsync(int id);
    Task<CapacityData> AddCapacityDataAsync(CapacityData capacityData);
    Task<bool> UpdateCapacityDataAsync(CapacityData capacityData);
    Task<bool> DeleteCapacityDataAsync(int id);
    
    // Usage data operations
    Task<IEnumerable<UsageData>> GetAllUsageDataAsync();
    Task<UsageData?> GetUsageDataByIdAsync(int id);
    Task<UsageData> AddUsageDataAsync(UsageData usageData);
    Task<bool> UpdateUsageDataAsync(UsageData usageData);
    Task<bool> DeleteUsageDataAsync(int id);
    
    // Trend data operations
    Task<IEnumerable<TrendData>> GetAllTrendDataAsync();
    Task<TrendData?> GetTrendDataByIdAsync(int id);
    Task<TrendData> AddTrendDataAsync(TrendData trendData);
    Task<bool> UpdateTrendDataAsync(TrendData trendData);
    Task<bool> DeleteTrendDataAsync(int id);
}