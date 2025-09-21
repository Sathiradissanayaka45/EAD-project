namespace WEB_API.Models;
/*
 * MONGODB Settings goes here
 * Can find the environment variables at appsettings.cs
*/
public class MongoDBSettings
{
    public string ConnectionURI { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string UserCollection { get; set; } = null!;
    public string TrainCollection { get; set; } = null!;
    public string BookingCollection { get; set; } = null!;
    public string AssistanceCollection { get; set; } = null!;

}