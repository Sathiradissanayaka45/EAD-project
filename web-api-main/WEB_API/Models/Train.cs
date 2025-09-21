using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Security.Cryptography.Xml;

/*
 * MONGODB Schema/DTO goes here
 * This is Train Details
*/

namespace WEB_API.Models
{
    // Define a Reservation class to represent reservation details
    public class Reservation
    {
        public string? username { get; set; } = null!;
        public string? email { get; set; } = null!;
        public string? phone { get; set; } = null!;
        public string? address { get; set; } = null!;
        public string? nic { get; set; } = null!;
        public string? userId { get; set; } = null!;
        public string? createdAt { get; set; } = null!;
        public string? updatedAt { get; set; } = null!;
        public string? status { get; set; } = null!;
    }

    // Define a Reference class to represent reference details
    public class Reference
    {
        public string? refId { get; set; } = null!;
    }

    // Define a Train class to represent train schedule details
    public class Train
    {
        /*
         * [REF] - https://www.mongodb.com/developer/languages/csharp/create-restful-api-dotnet-core-mongodb/
         */

        // Use BsonId and BsonRepresentation attributes for MongoDB ObjectId
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = null!;

        public string? name { get; set; } = null!;          // Train name
        public string? time { get; set; } = null!;          // Scheduled time
        public string? start { get; set; } = null!;         // Starting location
        public string? departure { get; set; } = null!;     // Departure location

        // Define reservations as a list of Reservation objects
        [BsonElement("reservations")]
        public List<Reservation>? reservations { get; set; } = null!;

        // Define references as a list of Reference objects
        [BsonElement("references")]
        public List<Reference>? references { get; set; } = null!;

        public string? createdAt { get; set; } = null!;     // Creation timestamp
        public string? updatedAt { get; set; } = null!;     // Last update timestamp
        public string? status { get; set; } = null!;        // Status of the train schedule
    }

}
