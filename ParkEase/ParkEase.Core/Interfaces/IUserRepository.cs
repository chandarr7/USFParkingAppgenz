using System.Threading.Tasks;
using ParkEase.Core.Models;

namespace ParkEase.Core.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetByUsernameAsync(string username);
    }
}