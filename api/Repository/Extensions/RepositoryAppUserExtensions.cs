using Entities.Models;

namespace Repository.Extensions;

public static class RepositoryAppUserExtensions
{
  public static IQueryable<AppUser> Search(this IQueryable<AppUser> users, string? email)
  {
    if (email is not null)
      users = users.Where(u => u.Email != null && u.Email.ToLower().Equals(email.ToLower()));
    return users;
  }
  
}
