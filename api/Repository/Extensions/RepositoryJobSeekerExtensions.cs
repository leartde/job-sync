using System.Linq.Expressions;
using System.Reflection;
using Entities.Models;

namespace Repository.Extensions;

public static class RepositoryJobSeekerExtensions
{
    public static IQueryable<JobSeeker> Filter(this IQueryable<JobSeeker> jobSeekers, IEnumerable<string>? skills)
    {
        if (skills != null && skills.Any())
        {
            jobSeekers = jobSeekers.Where(js => skills.All(skill => js.Skills.Any(s => s.Name == skill)));
        }

        return jobSeekers;
    }

    public static IQueryable<JobSeeker> Search(this IQueryable<JobSeeker> jobSeekers, string? searchTerm)
    {
        if (!string.IsNullOrEmpty(searchTerm))
        {
            string lowerSearch = searchTerm.ToLower();
            jobSeekers = jobSeekers.Where(js =>
                js.FirstName.Contains(lowerSearch) ||
                (js.MiddleName != null && js.MiddleName.Contains(lowerSearch)) ||
                js.LastName.Contains(lowerSearch));
        }
        return jobSeekers;
    }

    public static IQueryable<JobSeeker> Sort(this IQueryable<JobSeeker> jobSeekers, string? orderByQueryString)
    {
        if (string.IsNullOrWhiteSpace(orderByQueryString))
            return jobSeekers.OrderBy(j => j.LastName);

        string[] orderParams = orderByQueryString.Trim().Split(' ');
        string propertyName = orderParams[0];
        bool isDescending = orderByQueryString.EndsWith(" desc", StringComparison.OrdinalIgnoreCase);

        switch (propertyName.ToLower())
        {
            case "birthday":
                return isDescending
                    ? jobSeekers.OrderByDescending(j => j.Birthday)
                    : jobSeekers.OrderBy(j => j.Birthday);
            case "skills":
                return isDescending
                    ? jobSeekers.OrderByDescending(js => js.Skills.Count)
                    : jobSeekers.OrderBy(js => js.Skills.Count);
            default:
                PropertyInfo[] propertyInfos = typeof(Job).GetProperties(BindingFlags.Public | BindingFlags.Instance);
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
                    new[] { typeof(JobSeeker), objectProperty.PropertyType },
                    jobSeekers.Expression,
                    Expression.Quote(orderByExp));

                return jobSeekers.Provider.CreateQuery<JobSeeker>(orderByCall);
        }
    }
}
