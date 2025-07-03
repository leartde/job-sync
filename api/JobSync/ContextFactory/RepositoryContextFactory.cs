using ExternalServices.LoggingService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;
using NLog;
using Repository;
using Service.Contracts;
using LogLevel = Microsoft.Extensions.Logging.LogLevel;

namespace JobSync.ContextFactory;

public class RepositoryContextFactory : IDesignTimeDbContextFactory<RepositoryContext>
{
    private readonly ILoggerManager _logger;
    public RepositoryContextFactory()
    {
        LogManager.Setup().LoadConfigurationFromFile("nlog.config");
        _logger = new LoggerManager();
    }
    public RepositoryContext CreateDbContext(string[] args)
    {
        try
        {
            _logger.LogInfo("Starting to create DbContext...");
            
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            _logger.LogDebug("Configuration built successfully");

            string? connectionString = configuration.GetConnectionString("DefaultConnection");
            _logger.LogDebug($"Using connection string: {connectionString}");

            DbContextOptionsBuilder<RepositoryContext> builder = new DbContextOptionsBuilder<RepositoryContext>()
                .UseSqlServer(
                    connectionString,
                    sqlServerOptions =>
                    {
                        sqlServerOptions.MigrationsAssembly("JobSync");
                        sqlServerOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    }
                )
                .LogTo(message => _logger.LogDebug(message),LogLevel.Information)
                .ConfigureWarnings(w => w.Throw(RelationalEventId.MultipleCollectionIncludeWarning))
                .EnableSensitiveDataLogging();

            _logger.LogDebug("DbContext options configured successfully");
            
            return new RepositoryContext(builder.Options);
        }
        catch (Exception ex)
        {
            _logger.LogError("Failed to create DbContext", ex );
            throw;
        }
    }
}
