using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Contracts;
using Entities.Configurations;
using Entities.ErrorModel;
using Entities.Exceptions;
using Entities.Models;
using ExternalServices.LoggingService;
using ExternalServices.MailService;
using ExternalServices.UploadService;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Repository;
using Service;
using Service.Contracts;
using Service.DataShaping;
using Shared.DataTransferObjects.JobDtos;
using StackExchange.Redis;
using Validation.Validators.Job;

namespace JobSync.Extensions;

public static class ServiceExtensions
{
  public static void ConfigureCors(this IServiceCollection services) =>
    services.AddCors(options =>
      {
        options.AddPolicy("CorsPolicy", builder =>
          builder
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("x-pagination")
        );
      }
    );

  public static void ConfigureIISIntegration(this IServiceCollection services) =>
    services.Configure<IISOptions>(options => { }
    );

  public static void ConfigureRepositoryManager(this IServiceCollection services)
  {
    services.AddScoped<IRepositoryManager, RepositoryManager>();
  }

  public static void ConfigureServiceManager(this IServiceCollection services)
  {
    services.AddScoped<IServiceManager, ServiceManager>();
  }

  public static void ConfigureSqlContext(this IServiceCollection services,
    IConfiguration configuration)
  {
    services.AddDbContext<RepositoryContext>(opts => opts.UseSqlServer(
        configuration.GetConnectionString("DefaultConnection")

      )
      .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information)
      .EnableSensitiveDataLogging()
    );
  }

  public static void ConfigureIdentity(this IServiceCollection services)
  {
    services.AddIdentity<AppUser, IdentityRole<Guid>>(options =>
      {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 10;
        options.User.RequireUniqueEmail = true;
      })
      .AddEntityFrameworkStores<RepositoryContext>()
      .AddDefaultTokenProviders();
  }

  public static void ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
  {

    services.AddAuthentication(opt =>
      {
        opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
      .AddJwtBearer(options =>
      {
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateLifetime = true,
          ValidateIssuerSigningKey = true,
          ValidIssuer = "JobSyncApi",
          ValidAudience = "https://localhost:5248",
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            Environment.GetEnvironmentVariable("SECRET") ??
            throw new BadRequestException("SECRET key for encoding not found"))),
          NameClaimType = ClaimTypes.Email,
          RoleClaimType = ClaimTypes.Role,
          SaveSigninToken = true,
          LogValidationExceptions = true
        };
      });
  }

  public static void ConfigureDataShaping(this IServiceCollection services)
  {
    services.AddScoped<IDataShaper<ViewJobDto>, DataShaper<ViewJobDto>>();
  }

  public static void ConfigureFluentValidation(this IServiceCollection services)
  {
    services.AddValidatorsFromAssembly(typeof(AddJobValidator).Assembly);
    services.AddValidatorsFromAssembly(typeof(UpdateJobValidator).Assembly);
    services.AddFluentValidationAutoValidation();
  }

  public static void ConfigureControllers(this IServiceCollection services)
  {
    services.AddControllers().ConfigureApiBehaviorOptions(options =>
      {
        options.InvalidModelStateResponseFactory = context =>
        {
          IEnumerable<Error?> errors = context.ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => JsonSerializer.Deserialize<Error>(e.ErrorMessage));

          return new UnprocessableEntityObjectResult(errors);

        };
      })
      .AddApplicationPart(typeof(Presentation.AssemblyReference).Assembly);

    services.AddTransient<IValidatorInterceptor, UseCustomErrorModelInterceptor>();
  }

  public static void ConfigureHttpContextAccessor(this IServiceCollection services)
  {
    services.AddHttpContextAccessor();
  }

  public static void ConfigureExternalServices(this IServiceCollection services)
  {
    services.AddScoped<ICloudinaryManager, CloudinaryManager>();
    services.AddScoped<IMailService, MailService>();
    services.AddSingleton<ILoggerManager, LoggerManager>();
  }

  public static void ConfigureSwagger(this IServiceCollection services)
  {
    services.AddSwaggerGen(opt =>
    {
      opt.SwaggerDoc("v1", new OpenApiInfo { Title = "JobSync API", Version = "v1" });

      opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
      {
        In = ParameterLocation.Header,
        Description = "Enter JWT Bearer token (Format: 'Bearer YOUR_TOKEN')",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
      });

      opt.AddSecurityRequirement(new OpenApiSecurityRequirement
      {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
            {
              Type = ReferenceType.SecurityScheme,
              Id = "Bearer"
            },
            Scheme = "oauth2",
            Name = "Bearer",
            In = ParameterLocation.Header
          },
          new List<string>()
        }
      });
    }); }

public static void ConfigureRedis(this IServiceCollection services, int limit = 100, TimeSpan? window = null)
    {
        services.AddSingleton<IConnectionMultiplexer>(
          ConnectionMultiplexer.Connect("localhost:6379"));
    
        services.AddSingleton<RedisRateLimiter>(provider =>
        {
          IConnectionMultiplexer connection = provider.GetRequiredService<IConnectionMultiplexer>();
          return new RedisRateLimiter(connection, limit, window ?? TimeSpan.FromMinutes(1));
        });
    }

   
    
}
