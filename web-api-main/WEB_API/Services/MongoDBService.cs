using WEB_API.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System;

/*
 * In here we are creating service class for MONGODB.
 * All the db operations are handled through this
*/

namespace WEB_API.Services
{
    public class MongoDBService
    {
        //MONGO Collection
        private readonly IMongoCollection<Auth> _userCollection;
        private readonly IMongoCollection<Train> _trainColletion;
        private readonly IMongoCollection<Booking> _bookingColletion;
        private readonly IMongoCollection<Assistance> _assistanceColletion;

        //Initialize MONGO Client 
        public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _userCollection = database.GetCollection<Auth>(mongoDBSettings.Value.UserCollection);
            _trainColletion = database.GetCollection<Train>(mongoDBSettings.Value.TrainCollection);
            _bookingColletion = database.GetCollection<Booking>(mongoDBSettings.Value.BookingCollection);
            _assistanceColletion = database.GetCollection<Assistance>(mongoDBSettings.Value.AssistanceCollection);
        }

 //====================================== *** USER MANAGEMENT *** ====================================
        //Get for user login 
        public async Task<List<Auth>> GetUserAsync()
        {
           try
            {
                return await _userCollection.Find(new BsonDocument()).ToListAsync();
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //Get all users
        public async Task<List<Auth>> GetAllUsers()
        {
           try
            {
                var projection = Builders<Auth>.Projection.Exclude(u => u.password);

                return await _userCollection.Find(new BsonDocument()).Project<Auth>(projection).ToListAsync();
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //User Registration
        public async Task CreateAsync(Auth user) 
        {
           try {
                //user BCrypt for password encryption - [REF] https://jasonwatmore.com/post/2020/07/16/aspnet-core-3-hash-and-verify-passwords-with-bcrypt
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.password);
                DateTime currentDateTime = DateTime.Now;
                user.password = passwordHash;
                user.createdAt = currentDateTime.ToString();
                user.updatedAt = currentDateTime.ToString();
                await _userCollection.InsertOneAsync(user);
                return;
            } catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }
        //Edit User Profile
        public async Task EditProfile(string id, Auth user)
        {
            try
            {
                var filter = Builders<Auth>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Auth>.Update
                    .Set("nic", user.nic)
                    .Set("email", user.email)
                    .Set("username", user.username)
                    .Set("phone", user.phone)
                    .Set("address", user.address)
                    .Set("updatedAt", DateTime.Now.ToString());

                var options = new FindOneAndUpdateOptions<Auth>
                {
                    ReturnDocument = ReturnDocument.After, // Returns the updated document
                    IsUpsert = false // If the document doesn't exist, it won't be created
                };
                await _userCollection.FindOneAndUpdateAsync(filter, update, options);
                return;
            } catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }
        //Get User Profile
        public async Task<List<Auth>> GetProfile(string id)
        {
           try
            {
                var projection = Builders<Auth>.Projection.Exclude(u => u.password);
                var filter = Builders<Auth>.Filter.Eq("_id", ObjectId.Parse(id));

                return await _userCollection.Find(filter).Project<Auth>(projection).ToListAsync();
            } catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }
        //Get Profile by Email
        public async Task<List<Auth>> GetProfileByEmail(string email)
        {
            try
            {
                var filter = Builders<Auth>.Filter.Eq("email", email);

                return await _userCollection.Find(filter).ToListAsync();
            } catch (Exception ex) 
            { 
                throw new Exception(ex.ToString()); 
            }
        }
        //Update Account
        public async Task Account(string id, Auth user)
        {
            try
            {
                var filter = Builders<Auth>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Auth>.Update
                    .Set("status", user.status)
                    .Set("updatedAt", DateTime.Now.ToString());

                var options = new FindOneAndUpdateOptions<Auth>
                {
                    ReturnDocument = ReturnDocument.After, // Returns the updated document
                    IsUpsert = false // If the document doesn't exist, it won't be created
                };
                await _userCollection.FindOneAndUpdateAsync(filter, update, options);
                return;
            } catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }


 //====================================== *** TRAIN MANAGEMENT *** ====================================
        //Create Train With Schedule
        public async Task CreateTrain(Train train)
        {
            try {
                DateTime currentDateTime = DateTime.Now;
                train.createdAt = currentDateTime.ToString();
                train.updatedAt = currentDateTime.ToString();
                await _trainColletion.InsertOneAsync(train);
                return;
            } catch  (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
           
        }

        //get all train schedules
        public async Task<List<Train>> GetSchedules(string role)
        {
            try {
                //travel agent only can get the ACTIVE & PUBLISHED Schedules
                if(role == "travel-agent")
                {
                    var filter = Builders<Train>.Filter.Eq("status", "ACTIVE & PUBLISHED");
                    return await _trainColletion.Find(filter).ToListAsync();
                }
                return await _trainColletion.Find(new BsonDocument()).ToListAsync();
            } catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
           
        }

        //update schedule
        public async Task UpdateSchedule(string id, Train train)
        {
            try
            {
                var filter = Builders<Train>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Train>.Update
                    .Set("name", train.name)
                    .Set("time", train.time)
                    .Set("start", train.start)
                    .Set("departure", train.departure)
                    .Set("updatedAt", DateTime.Now.ToString());

                var options = new FindOneAndUpdateOptions<Train>
                {
                    ReturnDocument = ReturnDocument.After, // Returns the updated document
                    IsUpsert = false // If the document doesn't exist, it won't be created
                };
                await _trainColletion.FindOneAndUpdateAsync(filter, update, options);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //cancel schedule
        public async Task CancelSchedule(string id, Train train)
        {
            try
            {
                var filter = Builders<Train>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Train>.Update
                    .Set("status", train.status)
                    .Set("updatedAt", DateTime.Now.ToString());

                var options = new FindOneAndUpdateOptions<Train>
                {
                    ReturnDocument = ReturnDocument.After, // Returns the updated document
                    IsUpsert = false // If the document doesn't exist, it won't be created
                };
                await _trainColletion.FindOneAndUpdateAsync(filter, update, options);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }
        //====================================== *** BOOKING MANAGEMENT *** ====================================

        //create Reservation

        public async Task CreateReservation(string id, string name, string time, string start, string departure, Auth user)
        {
            try
            {
                Booking booking = new Booking();
                DateTime currentDateTime = DateTime.Now;
                booking.createdAt = currentDateTime.ToString();
                booking.updatedAt = currentDateTime.ToString();
                booking.train = name;
                booking.refId = id;
                booking.time = time;
                booking.start = start;
                booking.departure = departure;

                booking.userId = user.Id;
                booking.username = user.username;
                booking.email = user.email;
                booking.nic = user.nic;
                booking.phone = user.phone;
                booking.address = user.address;

                booking.status = "ACTIVE";

                await _bookingColletion.InsertOneAsync(booking);

                Reservation r = new Reservation { userId = user.Id , username = user.username , email = user.email , nic = user.nic , address = user.address , phone = user.phone, createdAt = currentDateTime.ToString() , updatedAt = currentDateTime.ToString() , status = "ACTIVE"};
                var filter = Builders<Train>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Train>.Update.Push("reservations", r);
                await _trainColletion.UpdateOneAsync(filter, update);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }

        }

        //get bookings for particular train
        public async Task<List<Booking>> GetBookingsForTrain(string id)
        {
            try
            {
                var filter = Builders<Booking>.Filter.Eq("refId", id);

                return await _bookingColletion.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //get bookings for particular user
        public async Task<List<Booking>> GetBookingsForUser(string id, string refId)
        {
            try
            {
                var filter1 = Builders<Booking>.Filter.Eq("userId", id);
                var filter2 = Builders<Booking>.Filter.Eq("refId", refId);
                var combinedFilter = Builders<Booking>.Filter.And(filter1, filter2);

                return await _bookingColletion.Find(combinedFilter).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //cancel booking
        public async Task CancelBooking(string id, Booking booking)
        {
            try
            {
                var filter = Builders<Booking>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Booking>.Update
                    .Set("status", booking.status)
                    .Set("updatedAt", DateTime.Now.ToString());

                var options = new FindOneAndUpdateOptions<Booking>
                {
                    ReturnDocument = ReturnDocument.After, // Returns the updated document
                    IsUpsert = false // If the document doesn't exist, it won't be created
                };
                await _bookingColletion.FindOneAndUpdateAsync(filter, update, options);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //get booking history for user
        public async Task<List<Booking>> BookingHistoryForUser(string id)
        {
            try
            {
                var filter = Builders<Booking>.Filter.Eq("userId", id);
               
                return await _bookingColletion.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //Create Assistant
        public async Task CreateAssistance(Assistance assistance)
        {
            try
            {
                DateTime currentDateTime = DateTime.Now;
                assistance.createdAt = currentDateTime.ToString();
                assistance.updatedAt = currentDateTime.ToString();
                assistance.status = "ACTIVE";

                await _assistanceColletion.InsertOneAsync(assistance);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }

        }

        //get assistant
        public async Task<List<Assistance>> GetAssistant(string name)
        {
            try
            {
                var filter = Builders<Assistance>.Filter.Eq("assistant", name);

                return await _assistanceColletion.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //assign user to the booking
        public async Task AssignUser(string id, Booking booking)
        {
            try
            {
                var filter = Builders<Booking>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Booking>.Update
                    .Set("assignee", booking.assignee)
                    .Set("updatedAt", DateTime.Now.ToString());

                var options = new FindOneAndUpdateOptions<Booking>
                {
                    ReturnDocument = ReturnDocument.After, // Returns the updated document
                    IsUpsert = false // If the document doesn't exist, it won't be created
                };
                await _bookingColletion.FindOneAndUpdateAsync(filter, update, options);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //get bookings from user name
        public async Task<List<Booking>> GetBookingsByUserName(string username)
        {
            try
            {
                var filter = Builders<Booking>.Filter.Eq("username", username);

                return await _bookingColletion.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //assistant resolve
        public async Task ResolveOrReject(string id, Assistance assistance)
        {
            try
            {
                var filter = Builders<Assistance>.Filter.Eq("_id", ObjectId.Parse(id));
                var update = Builders<Assistance>.Update
                    .Set("status", assistance.status)
                    .Set("updatedAt", DateTime.Now.ToString());

                var options = new FindOneAndUpdateOptions<Assistance>
                {
                    ReturnDocument = ReturnDocument.After, // Returns the updated document
                    IsUpsert = false // If the document doesn't exist, it won't be created
                };
                await _assistanceColletion.FindOneAndUpdateAsync(filter, update, options);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }

        //delete user
        public async Task DeleteUser(string id)
        {
            try
            {

                var filter = Builders<Auth>.Filter.Eq("_id", ObjectId.Parse(id));
                await _userCollection.FindOneAndDeleteAsync(filter);
                return;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
        }
    }
}
