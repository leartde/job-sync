﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Repository;

namespace JobSync.ContextFactory;

public class RepositoryContextFactory : IDesignTimeDbContextFactory<RepositoryContext>
{
    public RepositoryContext CreateDbContext(string[] args)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        DbContextOptionsBuilder<RepositoryContext> builder =
            new DbContextOptionsBuilder<RepositoryContext>()
                .UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    sqlServerOptions => 
                    {
                        sqlServerOptions.MigrationsAssembly("JobSync");
                        sqlServerOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    }
                );
        
        return new RepositoryContext(builder.Options);
    }
}