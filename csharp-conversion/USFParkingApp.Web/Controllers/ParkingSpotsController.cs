using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using USFParkingApp.Core.Entities;
using USFParkingApp.Core.Interfaces;
using USFParkingApp.Web.Models;

namespace USFParkingApp.Web.Controllers;

public class ParkingSpotsController : ApiControllerBase
{
    public ParkingSpotsController(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }
    
    // GET: api/ParkingSpots
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ParkingSpot>>> GetParkingSpots()
    {
        var parkingSpots = await UnitOfWork.ParkingSpots.GetAllAsync();
        return Ok(parkingSpots);
    }
    
    // GET: api/ParkingSpots/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ParkingSpot>> GetParkingSpot(int id)
    {
        var parkingSpot = await UnitOfWork.ParkingSpots.GetByIdAsync(id);
        
        if (parkingSpot == null)
        {
            return NotFound();
        }
        
        return Ok(parkingSpot);
    }
    
    // POST: api/ParkingSpots/search
    [HttpPost("search")]
    public async Task<ActionResult<IEnumerable<ParkingSpot>>> SearchParkingSpots([FromBody] SearchParams searchParams)
    {
        var parkingSpots = await UnitOfWork.ParkingSpots.SearchAsync(
            searchParams.Location, 
            searchParams.Radius, 
            searchParams.MaxPrice);
            
        return Ok(parkingSpots);
    }
    
    // POST: api/ParkingSpots
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ParkingSpot>> CreateParkingSpot([FromBody] ParkingSpot parkingSpot)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var createdSpot = await UnitOfWork.ParkingSpots.AddAsync(parkingSpot);
        await UnitOfWork.CompleteAsync();
        
        return CreatedAtAction(nameof(GetParkingSpot), new { id = createdSpot.Id }, createdSpot);
    }
    
    // PUT: api/ParkingSpots/5
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateParkingSpot(int id, [FromBody] ParkingSpot parkingSpot)
    {
        if (id != parkingSpot.Id)
        {
            return BadRequest();
        }
        
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var success = await UnitOfWork.ParkingSpots.UpdateAsync(parkingSpot);
        if (!success)
        {
            return NotFound();
        }
        
        await UnitOfWork.CompleteAsync();
        
        return NoContent();
    }
    
    // DELETE: api/ParkingSpots/5
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteParkingSpot(int id)
    {
        var success = await UnitOfWork.ParkingSpots.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        
        await UnitOfWork.CompleteAsync();
        
        return NoContent();
    }
}