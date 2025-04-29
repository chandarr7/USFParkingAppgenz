using Microsoft.EntityFrameworkCore;
using USFParkingApp.Core.Entities.Visualization;
using USFParkingApp.Core.Interfaces;
using USFParkingApp.Infrastructure.Data;

namespace USFParkingApp.Infrastructure.Repositories;

public class VisualizationRepository : IVisualizationRepository
{
    private readonly ApplicationDbContext _context;

    public VisualizationRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // Capacity Data methods
    public async Task<IEnumerable<CapacityData>> GetAllCapacityDataAsync()
    {
        return await _context.CapacityData.ToListAsync();
    }
    
    public async Task<CapacityData?> GetCapacityDataByIdAsync(int id)
    {
        return await _context.CapacityData.FindAsync(id);
    }
    
    public async Task<CapacityData> AddCapacityDataAsync(CapacityData capacityData)
    {
        await _context.CapacityData.AddAsync(capacityData);
        return capacityData;
    }
    
    public async Task<bool> UpdateCapacityDataAsync(CapacityData capacityData)
    {
        var existingData = await GetCapacityDataByIdAsync(capacityData.Id);
        if (existingData == null)
            return false;
            
        _context.Entry(existingData).CurrentValues.SetValues(capacityData);
        return true;
    }
    
    public async Task<bool> DeleteCapacityDataAsync(int id)
    {
        var data = await GetCapacityDataByIdAsync(id);
        if (data == null)
            return false;
            
        _context.CapacityData.Remove(data);
        return true;
    }
    
    // Usage Data methods
    public async Task<IEnumerable<UsageData>> GetAllUsageDataAsync()
    {
        return await _context.UsageData.ToListAsync();
    }
    
    public async Task<UsageData?> GetUsageDataByIdAsync(int id)
    {
        return await _context.UsageData.FindAsync(id);
    }
    
    public async Task<UsageData> AddUsageDataAsync(UsageData usageData)
    {
        await _context.UsageData.AddAsync(usageData);
        return usageData;
    }
    
    public async Task<bool> UpdateUsageDataAsync(UsageData usageData)
    {
        var existingData = await GetUsageDataByIdAsync(usageData.Id);
        if (existingData == null)
            return false;
            
        _context.Entry(existingData).CurrentValues.SetValues(usageData);
        return true;
    }
    
    public async Task<bool> DeleteUsageDataAsync(int id)
    {
        var data = await GetUsageDataByIdAsync(id);
        if (data == null)
            return false;
            
        _context.UsageData.Remove(data);
        return true;
    }
    
    // Trend Data methods
    public async Task<IEnumerable<TrendData>> GetAllTrendDataAsync()
    {
        return await _context.TrendData.ToListAsync();
    }
    
    public async Task<TrendData?> GetTrendDataByIdAsync(int id)
    {
        return await _context.TrendData.FindAsync(id);
    }
    
    public async Task<TrendData> AddTrendDataAsync(TrendData trendData)
    {
        await _context.TrendData.AddAsync(trendData);
        return trendData;
    }
    
    public async Task<bool> UpdateTrendDataAsync(TrendData trendData)
    {
        var existingData = await GetTrendDataByIdAsync(trendData.Id);
        if (existingData == null)
            return false;
            
        _context.Entry(existingData).CurrentValues.SetValues(trendData);
        return true;
    }
    
    public async Task<bool> DeleteTrendDataAsync(int id)
    {
        var data = await GetTrendDataByIdAsync(id);
        if (data == null)
            return false;
            
        _context.TrendData.Remove(data);
        return true;
    }
}