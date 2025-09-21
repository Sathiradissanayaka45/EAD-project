

using Microsoft.IdentityModel.Tokens;

/* EVENT MIDDLEWARE
 * Check whether the token is provides and the user is a valid user
 * [REF] - https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt/
*/

namespace WEB_API.Services
{
    public class EventMiddleware
    {

        public static async Task<bool> Authorizer(string headers, MongoDBService _mongoDBService)
        {
            if (headers.IsNullOrEmpty())
            {
                return true;
            }
            else
            {
                var decode = JWTDecoder.DecodeJwtToken(headers);
                var obj = decode.Payload.ToList();
                var chk = await _mongoDBService.GetProfileByEmail(obj[2].Value.ToString());
                //check whether user existance
                if (chk.IsNullOrEmpty()) return true;
                return false;

            }
        }
    }
}
