using System.Diagnostics;
using Service.Contracts;
using NLog;

namespace ExternalServices.LoggingService;

public class LoggerManager : ILoggerManager
{
    private static readonly ILogger logger = LogManager.GetCurrentClassLogger();
    
    public LoggerManager()
    {
        string logDir = Path.Combine(Directory.GetCurrentDirectory(), "logs");
        if (!Directory.Exists(logDir))
        {
            Directory.CreateDirectory(logDir);
        }
    }

    public void LogInfo(string message) => logger.Info(message);
    public void LogWarn(string message) => logger.Warn(message);
    public void LogDebug(string message) => logger.Debug(message);
    public void LogError(string message) => logger.Error(message);
    public void LogError(string message, Exception ex) => logger.Error(ex, message);
    
    public IDisposable TrackPerformance(string message)
    {
        return new PerformanceTracker(message, logger);
    }
}

public class PerformanceTracker : IDisposable
{
    private readonly string _message;
    private readonly ILogger _logger;
    private readonly Stopwatch _stopwatch;

    public PerformanceTracker(string message, ILogger logger)
    {
        _message = message;
        _logger = logger;
        _stopwatch = Stopwatch.StartNew();
        _logger.Info($"Starting: {_message}");
    }

    public void Dispose()
    {
        _stopwatch.Stop();
        _logger.Info($"Completed: {_message} in {_stopwatch.ElapsedMilliseconds}ms");
    }
}
