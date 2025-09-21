using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WEB_API.Models;
using WEB_API.Services;

/* Controller for Login
 * All the Login Related enpoints goes here
*/

namespace WEB_API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class LoginController : Controller
    {
        private readonly MongoDBService _mongoDBService;

        private readonly ILogger<LoginController> _logger;

        public LoginController(MongoDBService mongoDBService, ILogger<LoginController> logger)
        {
            _mongoDBService = mongoDBService;
            _logger = logger;
        }

        //Login API endpoint for user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Auth user)
        {
            //Check for the user already existence
            foreach (var i in await _mongoDBService.GetUserAsync())
            {
                if (BCrypt.Net.BCrypt.Verify(user.password, i.password) && (i.email == user.email || i.nic == user.nic))
                {
                    if(i.status != "ACTIVE")
                    {
                        return Unauthorized("Your account is deactivated. Please contact Back Officer.");
                    }
                    //Generate JWT token
                    var jwtService = new JWTService();
                    var token = jwtService.GenerateJwtToken(i.username, i.email, i.type, i.nic, i.Id , i.address, i.phone);
                    return Ok(new {accessToken= token, message= "Login Successfully" });
                }

            }
            return Unauthorized("Invalid Credentials");
        }

    }
}
