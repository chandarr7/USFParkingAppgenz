using Microsoft.AspNetCore.Mvc;
using USFParkingApp.Core.Interfaces;

namespace USFParkingApp.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    protected readonly IUnitOfWork UnitOfWork;
    
    protected ApiControllerBase(IUnitOfWork unitOfWork)
    {
        UnitOfWork = unitOfWork;
    }
}