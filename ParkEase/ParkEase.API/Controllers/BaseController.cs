using Microsoft.AspNetCore.Mvc;

namespace ParkEase.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class BaseController : ControllerBase
    {
    }
}