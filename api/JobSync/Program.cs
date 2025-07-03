using Entities.Configurations;
using JobSync.Extensions;
using Microsoft.AspNetCore.HttpOverrides;
using NLog;
using Service.Contracts;


var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureSqlContext(builder.Configuration);
builder.Services.ConfigureSwagger();
builder.Services.AddEndpointsApiExplorer();
;builder.Services.ConfigureCors();
builder.Services.ConfigureExternalServices();
builder.Services.ConfigureRepositoryManager();
builder.Services.ConfigureServiceManager();
builder.Services.ConfigureDataShaping();
builder.Services.ConfigureRedis(limit: 100, window: TimeSpan.FromMinutes(1));
builder.Services.ConfigureFluentValidation();
builder.Services.ConfigureHttpContextAccessor();
builder.Services.AddAuthentication();
builder.Services.ConfigureIdentity();
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.ConfigureControllers();
builder.Logging.ClearProviders();
builder.Services.ConfigureIISIntegration();
LogManager.Setup().LoadConfigurationFromFile(string.Concat(Directory.GetCurrentDirectory(), "/nlog.config"));
var app = builder.Build();
var logger = app.Services.GetRequiredService<ILoggerManager>();
app.ConfigureExceptionHandler(logger);
if (app.Environment.IsProduction()) app.UseHsts();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.All
});
app.UseCors("CorsPolicy");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
  RedisRateLimiter limiter = context.RequestServices.GetRequiredService<RedisRateLimiter>();
  string? clientIp = context.Connection.RemoteIpAddress?.ToString();
 
  if (!await limiter.IsAllowedAsync(clientIp))
  {
    context.Response.StatusCode = 429;
    await context.Response.WriteAsync("Too many requests. Try again later.");
    return;
  }
 
  await next();
});

app.MapControllers();


app.Run();

