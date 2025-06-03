using System.Linq.Expressions;
using System.Reflection;
using Entities.Models;

namespace Repository.Extensions;

public static class RepositoryEmployerExtensions
{
    public static IQueryable<Employer> Filter(this IQueryable<Employer> employers, string? industry)
    {
        if (!string.IsNullOrEmpty(industry))
                employers = employers.Where(e => e.IndustryString.ToLower().Equals(industry.ToLower()));
        return employers;
    }

    public static IQueryable<Employer> Search(this IQueryable<Employer> employers, string? searchTerm)
    {
        if (!string.IsNullOrEmpty(searchTerm))
        {
            string lowerSearch = searchTerm.ToLower();
            employers = employers.Where(e => e.Name.ToLower().Contains(lowerSearch));
        }

        return employers;
    }

    public  static IQueryable<Employer> Sort(this IQueryable<Employer> employers, string? orderByQueryString)
    {
        if (string.IsNullOrWhiteSpace(orderByQueryString))
            return employers.OrderBy(e => e.Founded);

        string[] orderParams = orderByQueryString.Trim().Split(' ');
        string propertyName = orderParams[0];
        bool isDescending = orderByQueryString.EndsWith(" desc", StringComparison.OrdinalIgnoreCase);

        switch (propertyName.ToLower())
        {
            case "industry":
                return isDescending
                    ? employers.OrderByDescending(e => e.Industry)
                    : employers.OrderBy(e => e.Industry);
            default:
                PropertyInfo[] propertyInfos = typeof(Job).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                PropertyInfo? objectProperty = propertyInfos.FirstOrDefault(pi =>
                    pi.Name.Equals(propertyName, StringComparison.InvariantCultureIgnoreCase));

                if (objectProperty == null)
                    throw new ArgumentException($"Invalid property name '{propertyName}'");

                ParameterExpression parameter = Expression.Parameter(typeof(Employer), "x");
                MemberExpression propertyAccess = Expression.Property(parameter, objectProperty);
                LambdaExpression orderByExp = Expression.Lambda(propertyAccess, parameter);

                string method = isDescending ? "OrderByDescending" : "OrderBy";
                MethodCallExpression orderByCall = Expression.Call(
                    typeof(Queryable),
                    method,
                    new[] { typeof(Employer), objectProperty.PropertyType },
                    employers.Expression,
                    Expression.Quote(orderByExp));

                return employers.Provider.CreateQuery<Employer>(orderByCall);
        }
    }
}
