using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace WEB_API.Models
{
    public class Assistance
    {
        // MongoDB document ID field, automatically generated as ObjectId.
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = null!;

        // Properties for assistance details.
        public string? assistant { get; set; } = null!;
        public string? email { get; set; } = null!;
        public string? username { get; set; } = null!;
        public string? phone { get; set; } = null!;
        public string? train { get; set; } = null!;
        public string? start { get; set; } = null!;
        public string? departure { get; set; } = null!;
        public string? time { get; set; } = null!;

        // Timestamps for document creation and update.
        public string? createdAt { get; set; } = null!;
        public string? updatedAt { get; set; } = null!;

        // Status field for assistance.
        public string? status { get; set; } = null!;
    }
}
