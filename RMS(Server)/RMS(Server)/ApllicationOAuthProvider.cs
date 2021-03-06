﻿using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using RMS_Server_.Models;

namespace RMS_Server_
{
    public class ApllicationOAuthProvider  : OAuthAuthorizationServerProvider
    {

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            var user = await manager.FindAsync(context.UserName, context.Password);
            if (user != null)
            {
                ClaimsIdentity identity = new ClaimsIdentity(context.Options.AuthenticationType);
                IList<string> userRoles = manager.GetRoles(user.Id);
                foreach (string roleName in userRoles)
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, roleName));
                }
                AuthenticationProperties additionalData = new AuthenticationProperties(new Dictionary<string, string>{
                    { 
                        "role", Newtonsoft.Json.JsonConvert.SerializeObject(userRoles)
                    },
                    {
                        "userName", user.UserName
                    }
                });
                AuthenticationTicket token = new AuthenticationTicket(identity, additionalData); 
                context.Validated(token);
            }
            else
                return;
    }
        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

    }
}