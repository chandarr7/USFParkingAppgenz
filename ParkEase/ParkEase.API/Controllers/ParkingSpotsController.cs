using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ParkEase.Core.Interfaces;
using ParkEase.Core.Models;

namespace ParkEase.API.Controllers
{
    public class ParkingSpotsController : BaseController
    {
        private readonly IParkingSpotRepository _parkingSpotRepository;

        public ParkingSpotsController(IParkingSpotRepository parkingSpotRepository)
        {
            _parkingSpotRepository = parkingSpotRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParkingSpot>>> GetParkingSpots()
        {
            var parkingSpots = await _parkingSpotRepository.GetAllAsync();
            return Ok(parkingSpots);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ParkingSpot>> GetParkingSpot(int id)
        {
            var parkingSpot = await _parkingSpotRepository.GetByIdAsync(id);
            if (parkingSpot == null)
            {
                return NotFound();
            }
            return Ok(parkingSpot);
        }

        [HttpPost("search")]
        public async Task<ActionResult<IEnumerable<ParkingSpot>>> SearchParkingSpots([FromBody] SearchRequest request)
        {
            if (string.IsNullOrEmpty(request.Location))
            {
                return BadRequest(new { message = "Location is required" });
            }

            var parkingSpots = await _parkingSpotRepository.SearchAsync(request.Location, request.Radius);
            return Ok(parkingSpots);
        }

        [HttpPost]
        public async Task<ActionResult<ParkingSpot>> CreateParkingSpot(ParkingSpot parkingSpot)
        {
            var createdParkingSpot = await _parkingSpotRepository.AddAsync(parkingSpot);
            return CreatedAtAction(nameof(GetParkingSpot), new { id = createdParkingSpot.Id }, createdParkingSpot);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateParkingSpot(int id, ParkingSpot parkingSpot)
        {
            if (id != parkingSpot.Id)
            {
                return BadRequest();
            }

            var existingParkingSpot = await _parkingSpotRepository.GetByIdAsync(id);
            if (existingParkingSpot == null)
            {
                return NotFound();
            }

            await _parkingSpotRepository.UpdateAsync(parkingSpot);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParkingSpot(int id)
        {
            var parkingSpot = await _parkingSpotRepository.GetByIdAsync(id);
            if (parkingSpot == null)
            {
                return NotFound();
            }

            await _parkingSpotRepository.DeleteAsync(parkingSpot);
            return NoContent();
        }
    }

    public class SearchRequest
    {
        public string Location { get; set; }
        public double Radius { get; set; } = 5.0; // Default radius in miles
        public string Date { get; set; }
    }
}