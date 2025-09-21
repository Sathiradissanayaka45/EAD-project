using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http.Cors;
using WEB_API.Models;
using WEB_API.Services;

/* Controller for Register
 * All the Register Related enpoints goes here
*/

namespace WEB_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [ApiController]
    [Route("api/auth")]
    public class RegisterController : Controller
    {
        private readonly MongoDBService _mongoDBService;

        private readonly ILogger<RegisterController> _logger;

        public RegisterController(MongoDBService mongoDBService, ILogger<RegisterController> logger)
        {
            _mongoDBService = mongoDBService;
            _logger = logger;
        }

        //Get User endpoint ffor user
        [HttpGet("user")]
        public async Task<List<Auth>> Get()
        {
            return await _mongoDBService.GetUserAsync();
        }

        //Register API endpoint for user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Auth user) {
            //Check for the user already existence
            foreach (var i in await _mongoDBService.GetUserAsync())
            {
                if (i.email?.ToLower() == user.email?.ToLower() || i.nic?.ToLower() == user.nic?.ToLower())
                {
                    return BadRequest("Invalid User");
                }
            }
            await _mongoDBService.CreateAsync(user);
            return CreatedAtAction(nameof(Get), new { id = user.email }, user);
        }
       
    }
}
