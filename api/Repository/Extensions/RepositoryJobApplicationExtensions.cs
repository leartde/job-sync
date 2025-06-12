using System.Linq.Expressions;
using System.Reflection;
using Entities.Enums;
using Entities.Models;

namespace Repository.Extensions;

public static class RepositoryJobApplicationExtensions
{
  public static IQueryable<JobApplication> Filter(this IQueryable<JobApplication> applications, bool? hasResume)
  {
    if (hasResume is true)
    {
      applications = applications.Where(a => a.JobSeeker != null && a.JobSeeker.ResumeLink != null);
    }

    return applications;
  }

  public static IQueryable<JobApplication> Search(this IQueryable<JobApplication> applications, string? searchTerm)
  {
    if (!string.IsNullOrEmpty(searchTerm))
    {
      
      string lowerSearch = searchTerm.ToLower();
      applications = applications.Where(a =>
        a.JobSeeker != null &&
        (a.JobSeeker.FirstName.ToLower() + (a.JobSeeker.MiddleName ?? "").ToLower() + a.JobSeeker.LastName.ToLower())
        .Contains(lowerSearch));
    }
    return applications;
  }

  public static IQueryable<JobApplication> Sort(this IQueryable<JobApplication> applications, string? orderByQueryString)
  {
    if (string.IsNullOrWhiteSpace(orderByQueryString))
      return applications.OrderBy(a => a.CreatedAt);
    string[] orderParams = orderByQueryString.Trim().Split(' ');
    string propertyName = orderParams[0];
    bool isDescending = orderByQueryString.EndsWith(" desc", StringComparison.OrdinalIgnoreCase);
    switch (propertyName.ToLower())
    {
      case "status":
        return isDescending
          ? applications.OrderByDescending(a => a.Status)
          : applications.OrderBy(e => e.Status);
      case "skills":
        return isDescending
          ? applications.OrderByDescending(a => a.JobSeeker!.Skills.Select(s => s.Skill).Intersect(a.Job!.Skills.Select(j => j.Skill)).Count())
          : applications.OrderBy(a => a.JobSeeker!.Skills.Select(s => s.Skill).Intersect(a.Job!.Skills.Select(j => j.Skill)).Count());
      default:
        PropertyInfo[] propertyInfos =
          typeof(JobApplication).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        PropertyInfo? objectProperty = propertyInfos.FirstOrDefault(pi =>
          pi.Name.Equals(propertyName, StringComparison.InvariantCultureIgnoreCase));

        if (objectProperty == null)
          throw new ArgumentException($"Invalid property name '{propertyName}'");
        
        ParameterExpression parameter = Expression.Parameter(typeof(JobSeeker), "x");
        MemberExpression propertyAccess = Expression.Property(parameter, objectProperty);
        LambdaExpression orderByExp = Expression.Lambda(propertyAccess, parameter);

        string method = isDescending ? "OrderByDescending" : "OrderBy";
        MethodCallExpression orderByCall = Expression.Call(
          typeof(Queryable),
          method,
          new[] { typeof(JobApplication), objectProperty.PropertyType },
          applications.Expression,
          Expression.Quote(orderByExp));

        return applications.Provider.CreateQuery<JobApplication>(orderByCall);
    }
  }

}
