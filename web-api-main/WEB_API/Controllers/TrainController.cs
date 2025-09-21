using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WEB_API.Models;
using WEB_API.Services;

namespace WEB_API.Controllers
{
    [ApiController]
    [Route("api/train")]
    public class TrainController : Controller
    {
        private readonly MongoDBService _mongoDBService;
        private readonly ILogger<TrainController> _logger;

        public TrainController(MongoDBService mongoDBService, ILogger<TrainController> logger)
        {
            _mongoDBService = mongoDBService;
            _logger = logger;
        }

        // Create train with schedules
        [HttpPost("create")]
        public async Task<dynamic> CreateTrain([FromBody] Train train)
        {
            var request = Request;

            // Check if the request is authorized using a custom middleware (Authorizer)
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }

            // Prevent travelers from accessing this resource
            else if (JWTDecoder.DecodeJwtToken(request.Headers["x-api-key"][0]).Payload.ToList()[3].Value.ToString() == "travel-agent")
            {
                return Unauthorized("Unauthorized");
            }

            // Create a new train schedule using MongoDBService
            await _mongoDBService.CreateTrain(train);
            return Ok("Train Schedule Created Successfully");
        }

        // Get all trains with schedules
        [HttpGet("schedules")]
        public async Task<dynamic> GetSchedules()
        {
            var request = Request;

            // Check if the request is authorized using a custom middleware (Authorizer)
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }

            // Retrieve schedules based on the user role extracted from the JWT token
            return await _mongoDBService.GetSchedules(JWTDecoder.DecodeJwtToken(request.Headers["x-api-key"][0]).Payload.ToList()[3].Value.ToString());
        }

        // Update a schedule
        [HttpPut("schedule/update/{id}")]
        public async Task<dynamic> UpdateSchedule(string id, [FromBody] Train train)
        {
            var request = Request;

            // Check if the request is authorized using a custom middleware (Authorizer)
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }

            // Prevent travelers from accessing this resource
            else if (JWTDecoder.DecodeJwtToken(request.Headers["x-api-key"][0]).Payload.ToList()[3].Value.ToString() == "travel-agent")
            {
                return Unauthorized("Unauthorized");
            }

            // Update a schedule using MongoDBService
            await _mongoDBService.UpdateSchedule(id, train);
            return Ok($"Schedule Updated Successfully");
        }

        // Cancel a schedule
        [HttpPut("schedule/cancel/{id}")]
        public async Task<dynamic> CancelSchedule(string id, [FromBody] Train train)
        {
            var request = Request;

            // Check if the request is authorized using a custom middleware (Authorizer)
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }

            // Prevent travelers from accessing this resource
            else if (JWTDecoder.DecodeJwtToken(request.Headers["x-api-key"][0]).Payload.ToList()[3].Value.ToString() == "travel-agent")
            {
                return Unauthorized("Unauthorized");
            }

            // Check if there are reservations before canceling
            else if (!train.reservations.IsNullOrEmpty())
            {
                return BadRequest("Cannot Cancelled. Already Have Reservations");
            }

            // Cancel a schedule using MongoDBService
            await _mongoDBService.CancelSchedule(id, train);
            return Ok($"Schedule Cancelled Successfully");
        }

    }
}
