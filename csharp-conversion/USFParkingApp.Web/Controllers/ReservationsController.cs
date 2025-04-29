using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using USFParkingApp.Core.Entities;
using USFParkingApp.Core.Interfaces;

namespace USFParkingApp.Web.Controllers;

[Authorize]
public class ReservationsController : ApiControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    
    public ReservationsController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager) 
        : base(unitOfWork)
    {
        _userManager = userManager;
    }
    
    // GET: api/Reservations
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        var reservations = await UnitOfWork.Reservations.GetByUserIdAsync(userId);
        return Ok(reservations);
    }
    
    // GET: api/Reservations/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Reservation>> GetReservation(int id)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        var reservation = await UnitOfWork.Reservations.GetByIdAsync(id);
        
        if (reservation == null)
        {
            return NotFound();
        }
        
        // Ensure user can only access their own reservations
        if (reservation.UserId != userId)
        {
            return Forbid();
        }
        
        return Ok(reservation);
    }
    
    // POST: api/Reservations
    [HttpPost]
    public async Task<ActionResult<Reservation>> CreateReservation([FromBody] Reservation reservation)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        // Ensure the user is creating a reservation for themselves
        reservation.UserId = userId;
        
        var createdReservation = await UnitOfWork.Reservations.AddAsync(reservation);
        await UnitOfWork.CompleteAsync();
        
        return CreatedAtAction(nameof(GetReservation), new { id = createdReservation.Id }, createdReservation);
    }
    
    // PUT: api/Reservations/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReservation(int id, [FromBody] Reservation reservation)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        if (id != reservation.Id)
        {
            return BadRequest();
        }
        
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        // Verify the reservation exists and belongs to the user
        var existingReservation = await UnitOfWork.Reservations.GetByIdAsync(id);
        if (existingReservation == null)
        {
            return NotFound();
        }
        
        if (existingReservation.UserId != userId)
        {
            return Forbid();
        }
        
        // Ensure the user doesn't change the ownership
        reservation.UserId = userId;
        
        var success = await UnitOfWork.Reservations.UpdateAsync(reservation);
        if (!success)
        {
            return NotFound();
        }
        
        await UnitOfWork.CompleteAsync();
        
        return NoContent();
    }
    
    // DELETE: api/Reservations/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(int id)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null)
        {
            return Unauthorized();
        }
        
        // Verify the reservation exists and belongs to the user
        var reservation = await UnitOfWork.Reservations.GetByIdAsync(id);
        if (reservation == null)
        {
            return NotFound();
        }
        
        if (reservation.UserId != userId)
        {
            return Forbid();
        }
        
        var success = await UnitOfWork.Reservations.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        
        await UnitOfWork.CompleteAsync();
        
        return NoContent();
    }
}