using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace WEB_API.Models
/*
 * MONGODB Schema/DTO goes here
 * This is Account Details schema for user
*/
{
    public class Auth
    {
        /*
         * [REF] - https://www.mongodb.com/developer/languages/csharp/create-restful-api-dotnet-core-mongodb/
        */
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = null!;
        public string? nic { get; set; }   = null!;
        public string? email { get; set; } = null!;
        public string? username { get; set; } = null!;
        public string? password { get; set; } = null!;
        public string? type { get; set; } = null!;
        public string? createdAt {  get; set; } = null!;
        public string? updatedAt { get; set; } = null!;
        public string? status { get; set; } = null!;
        public string? phone { get; set; } = null!;
        public string? address { get; set; } = null!;
    }
}
