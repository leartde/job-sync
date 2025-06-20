using Entities.Models;

namespace Service.Contracts;

public interface IMailService
{
  Task SendEmailAsync(string toEmail, string subject, string body);
}
