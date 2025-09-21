using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WEB_API.Models;
using WEB_API.Services;

namespace WEB_API.Controllers
{
    [ApiController]
    [Route("api/booking")]
    public class BookingController : Controller
    {
        private readonly MongoDBService _mongoDBService;

        private readonly ILogger<BookingController> _logger;

        public BookingController(MongoDBService mongoDBService, ILogger<BookingController> logger)
        {
            _mongoDBService = mongoDBService;
            _logger = logger;
        }

        //Create Reservation API
        [HttpPost("my/{id}/{name}/{time}/{start}/{departure}")]
        public async Task<dynamic> CreateReservation(string id, string name, string time, string start, string departure, [FromBody] Auth user)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            await _mongoDBService.CreateReservation(id, name, time, start, departure, user);
            return Ok("Create Reservation Successfully");
        }

        //get bookings for particular train
        [HttpGet("train/{id}")]
        public async Task<dynamic> GetBookingsForTrain(string id)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            return await _mongoDBService.GetBookingsForTrain(id);
        }

        //get bookings for particular user
        [HttpGet("user/{id}/{refId}")]
        public async Task<dynamic> GetBookingsForUser(string id, string refId)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            return await _mongoDBService.GetBookingsForUser(id, refId);
        }

        //cancel booking
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelBooking(string id , [FromBody] Booking booking)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            await _mongoDBService.CancelBooking(id , booking);
            return Ok($"You have successfully cancelled");
        }

        //get booking history
        [HttpGet("history/{id}")]
        public async Task<dynamic> BookingHistoryForUser(string id)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            return await _mongoDBService.BookingHistoryForUser(id);
        }

        // Create a new assistance request.
        [HttpPost("assistance")]
        public async Task<dynamic> CreateAssistance([FromBody] Assistance assistance)
        {
            var request = Request;

            // Check for authorization using the provided API key.
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }

            // Create the assistance request in MongoDB.
            await _mongoDBService.CreateAssistance(assistance);

            // Return a success message.
            return Ok("Create Assistance Successfully");
        }

        // Get information about an assistant by name.
        [HttpGet("assistant/{name}")]
        public async Task<dynamic> GetAssistant(string name)
        {
            var request = Request;

            // Check for authorization using the provided API key.
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }

            // Retrieve information about the assistant from MongoDB.
            return await _mongoDBService.GetAssistant(name);
        }

        //assign user 
        [HttpPut("assign/{id}")]
        public async Task<IActionResult> AssignUser(string id, [FromBody] Booking booking)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            await _mongoDBService.AssignUser(id, booking);
            return Ok($"User Assigned");
        }

        //get bookings from user name
        [HttpGet("user/{username}")]
        public async Task<dynamic> GetBookingsByUserName(string username)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            return await _mongoDBService.GetBookingsByUserName(username);
        }

        //assistant resolve
        [HttpPut("assistant/status/{id}")]
        public async Task<IActionResult> ResolveOrReject(string id, [FromBody] Assistance assistance)
        {
            var request = Request;
            if (await EventMiddleware.Authorizer(request.Headers["x-api-key"].IsNullOrEmpty() ? null : request.Headers["x-api-key"][0], _mongoDBService))
            {
                return Unauthorized("Unauthorized");
            }
            await _mongoDBService.ResolveOrReject(id, assistance);
            return Ok($"User Assigned");
        }

    }
}
