using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WEB_API.Models;
using WEB_API.Services;

namespace WEB_API.Controllers
{
    [ApiController]
    [Route("api")]
    public class UserProfileController : Controller
    {
        private readonly MongoDBService _mongoDBService;

        private readonly ILogger<UserProfileController> _logger;

        public UserProfileController(MongoDBService mongoDBService, ILogger<UserProfileController> logger)
        {
            _mongoDBService = mongoDBService;
            _logger = logger;
        }


        //Profile Edit API endpoint for user
        [HttpPut("profile/update/{id}")]
        public async Task<IActionResult> EditProfile(string id, [FromBody] Auth user)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            await _mongoDBService.EditProfile(id, user);
            return Ok("Profile Updated Successfully");
        }

        //Activate or Deactivate endpoint for user
        [HttpPut("account/{id}")]
        public async Task<IActionResult> Account(string id, [FromBody] Auth user)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            } 
            //prevent traveller to activate his account when it is in DEACTIVATE mode
            else if ((JWTDecoder.DecodeJwtToken(request.Headers["x-api-key"][0]).Payload.ToList()[3].Value.ToString() == "travel-agent" || JWTDecoder.DecodeJwtToken(request.Headers["x-api-key"][0]).Payload.ToList()[3].Value.ToString() == "user") && user.status == "ACTIVE")
            {
                return Unauthorized("Cannot Activate Your Account. Please Contact Back Officer.");
            }
            await _mongoDBService.Account(id, user);
            return Ok($"Profile {user.status} Successfully");
        }

        //get one user 
        [HttpGet("user/{id}")]
        public async Task<dynamic> GetProfile(string id)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            return await _mongoDBService.GetProfile(id);
        }

        //get All User Profiles
        [HttpGet("all-users")]
        public async Task<dynamic> GetAllUsers()
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            return await _mongoDBService.GetAllUsers();
        }

        //get All User Profiles
        [HttpDelete("user/{id}")]
        public async Task<dynamic> DeleteUser(string id)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            await _mongoDBService.DeleteUser(id);
            return Ok("Succssfully Deleted.");
        }

    }
}
