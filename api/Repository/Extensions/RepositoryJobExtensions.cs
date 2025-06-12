using System.Linq.Expressions;
using System.Reflection;
using Entities.Models;

namespace Repository.Extensions;

public static class RepositoryJobExtensions
{
    public static IQueryable<Job>
        Filter(this IQueryable<Job> jobs, string? type, bool? hasMultipleSpots, bool? isTakingApplications,
            bool? isRemote, double? minimumPay)
    {
        if (!string.IsNullOrWhiteSpace(type))
        {
            jobs = jobs.Where(j => j.Type.ToLower() == type.ToLower());
        }

        if (hasMultipleSpots != null)
        {
            jobs = jobs.Where(j => j.HasMultipleSpots == hasMultipleSpots);
        }

        if (isTakingApplications != null)
        {
            jobs = jobs.Where(j => j.IsTakingApplications == isTakingApplications);
        }

        if (isRemote != null)
        {
            jobs = isRemote == true
                ? jobs.Where(j => j.Address == null)
                : jobs.Where(j => j.Address != null);
        }

        if (minimumPay != null)
        {
            jobs = jobs.Where(j => j.HourlyPay >= minimumPay);
        }
    
    return jobs;
  
        
    }

    public static IQueryable<Job> Search(this IQueryable<Job> jobs, string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm)) return jobs;
    
        string lowerSearchTerm = searchTerm.ToLower();
        if (lowerSearchTerm == "remote") return jobs.Where(j => j.Address == null);
        return jobs.Where(j =>
            j.Employer != null && (
                j.Title.ToLower().Contains(lowerSearchTerm) ||
                j.Employer.Name.ToLower().Contains(lowerSearchTerm) ||
                j.Skills.Any(s => s.Skill!.Name.ToLower().Equals(lowerSearchTerm))||
                (j.Address != null && (
                    j.Address.Country.ToLower().Contains(lowerSearchTerm) ||
                    j.Address.City.ToLower().Contains(lowerSearchTerm) ||
                    j.Address.Street.ToLower().Contains(lowerSearchTerm) ||
                    j.Address.ZipCode.ToString().Contains(searchTerm) ||
                    (j.Address.Region != null && j.Address.Region.ToLower().Contains(lowerSearchTerm)) ||
                    (j.Address.State != null && j.Address.State.ToLower().Contains(lowerSearchTerm))
                ))
            ));
    }


    
    public static IQueryable<Job> Sort(this IQueryable<Job> jobs, string? orderByQueryString)
    {
        if (string.IsNullOrWhiteSpace(orderByQueryString))
            return jobs.OrderBy(j => j.CreatedAt);

        string[] orderParams = orderByQueryString.Trim().Split(' ');
        string propertyName = orderParams[0];
        bool isDescending = orderByQueryString.EndsWith(" desc", StringComparison.OrdinalIgnoreCase);

        switch (propertyName.ToLower())
        {
            case "pay":
                return isDescending
                    ? jobs.OrderByDescending(j => j.HourlyPay)
                    : jobs.OrderBy(j => j.HourlyPay);

            default:
                PropertyInfo[] propertyInfos = typeof(Job).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                PropertyInfo? objectProperty = propertyInfos.FirstOrDefault(pi =>
                    pi.Name.Equals(propertyName, StringComparison.InvariantCultureIgnoreCase));

                if (objectProperty == null)
                    throw new ArgumentException($"Invalid property name '{propertyName}'");

                ParameterExpression parameter = Expression.Parameter(typeof(Job), "x");
                MemberExpression propertyAccess = Expression.Property(parameter, objectProperty);
                LambdaExpression orderByExp = Expression.Lambda(propertyAccess, parameter);

                string method = isDescending ? "OrderByDescending" : "OrderBy";
                MethodCallExpression orderByCall = Expression.Call(
                    typeof(Queryable),
                    method,
                    new[] { typeof(Job), objectProperty.PropertyType },
                    jobs.Expression,
                    Expression.Quote(orderByExp));

                return jobs.Provider.CreateQuery<Job>(orderByCall);
        }
    }
}
