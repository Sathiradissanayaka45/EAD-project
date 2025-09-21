using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

/* Generate the JWT token
 * [REF] - https://mycodeblock.com/jwt-authentication-in-net-core-web-api/
 * Send the token to the client
*/

namespace WEB_API.Services {
    public class JWTService
    {
        private readonly string _secretKey = "a3Df8sG2jH5kL9pNqRtUxWz1v4y7BcEa";
        private readonly string _issuer = "https://localhost:7188/";

        public string GenerateJwtToken(string username, string email, string type, string nic, string id, string address, string phone)
        {
            var claims = new[]
            {
            new Claim("id", id),
            new Claim("username", username),
            new Claim("email", email),
            new Claim("role", type),
            new Claim("nic", nic),
            new Claim("address", address),
            new Claim("phone", phone)
        };

            try
            {
                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_secretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _issuer,
                    audience: _issuer,
                    claims: claims,
                    expires: DateTime.Now.AddDays(1), // Token expiration time
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {

                throw new Exception(ex.ToString());
            }
        }
    }

    /*
     * Decode the Provided JWT token 
     * 
    */
    public class JWTDecoder
    {
        public static JwtSecurityToken DecodeJwtToken(string token)
        {
           try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

                if (jsonToken != null)
                {
                    return jsonToken;
                }
                else
                {
                    // Token is invalid
                    throw new SecurityTokenException("Invalid JWT token.");
                }
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }

}

