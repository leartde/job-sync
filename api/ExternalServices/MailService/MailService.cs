
using System.Net;
using System.Net.Mail;
using Entities.Exceptions;
using Service.Contracts;

namespace ExternalServices.MailService;

public class MailService : IMailService
{
  private readonly SmtpClient _smtpClient;
  public MailService()
  {
    // const string username = "d16863f8578ec3"; <-- actual username
    string username = "placeholder"; 
    // ^^^ placeholder name to pause mailtrap Service
    string password = Environment.GetEnvironmentVariable("MAILTRAPPASSWORD")
      ?? throw new BadRequestException("Couldn't get the MailTrap password")
      ;
    _smtpClient = new SmtpClient("sandbox.smtp.mailtrap.io", 587)
    {
      Credentials = new NetworkCredential(username, password),
      EnableSsl = true,
    };
  }
  public async Task SendEmailAsync(string toEmail, string subject, string body)
  {
    MailMessage mailMessage = new MailMessage()
    {
      From = new MailAddress("jobsync@gmail.com"),
      Subject = subject,
      Body = body,
      IsBodyHtml = true
    };
    mailMessage.To.Add(toEmail);
    try
    {
      await _smtpClient.SendMailAsync(mailMessage);
    }
    catch (Exception e)
    {
      Console.WriteLine("Couldn't send email, " + e.Message);
    }
  }
   
}
