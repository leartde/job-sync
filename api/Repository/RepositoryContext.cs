using Entities.Models;
using JobSync.Repository.CompiledModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Repository.Configuration;
using Repository.DataSeeders;

namespace Repository;

public class RepositoryContext : DbContext
{
    public RepositoryContext(DbContextOptions options) : base(options){}
    public DbSet<Parent> Parents { get; set; }
    public DbSet<Child> Children { get; set; }
    
    
//   protected override void OnModelCreating(ModelBuilder modelBuilder)
// {
//  
//     modelBuilder.Entity<JobSeeker>()
//         .HasOne(js => js.Address)
//         .WithOne()
//         .HasForeignKey<JobSeeker>(js => js.AddressId)
//         .OnDelete(DeleteBehavior.SetNull); 
//
//     modelBuilder.Entity<Job>()
//         .HasOne(j => j.Address)
//         .WithOne()
//         .HasForeignKey<Job>(j => j.AddressId)
//         .OnDelete(DeleteBehavior.SetNull); 
//
//     modelBuilder.Entity<Employer>()
//         .HasMany(e => e.Jobs)
//         .WithOne(j => j.Employer)
//         .HasForeignKey(j => j.EmployerId)
//         .OnDelete(DeleteBehavior.Cascade); 
//
//     modelBuilder.Entity<JobSeeker>()
//         .HasOne(js => js.User)
//         .WithOne()
//         .HasForeignKey<JobSeeker>(js => js.UserId)
//         .OnDelete(DeleteBehavior.Cascade); 
//
//     modelBuilder.Entity<Employer>()
//         .HasOne(e => e.User)
//         .WithOne()
//         .HasForeignKey<Employer>(e => e.UserId)
//         .OnDelete(DeleteBehavior.Cascade);
//
//     modelBuilder.Entity<Job>()
//       .HasMany(j => j.Applications)
//       .WithOne(a => a.Job)
//       .HasForeignKey(a => a.JobId)
//       .IsRequired()
//       .OnDelete(DeleteBehavior.ClientCascade); 
//
//     modelBuilder.Entity<Job>()
//       .HasMany(j => j.Bookmarks)
//       .WithOne(b => b.Job)
//       .HasForeignKey(b => b.JobId)
//       .IsRequired()
//       .OnDelete(DeleteBehavior.ClientCascade);
//     
//     modelBuilder.Entity<JobSeeker>()
//       .HasMany(j => j.Applications)
//       .WithOne(a => a.JobSeeker)
//       .HasForeignKey(a => a.JobSeekerId)
//       .IsRequired()
//       .OnDelete(DeleteBehavior.ClientCascade); 
//
//     modelBuilder.Entity<JobSeeker>()
//       .HasMany(j => j.Bookmarks)
//       .WithOne(b => b.JobSeeker)
//       .HasForeignKey(b => b.JobSeekerId)
//       .IsRequired()
//       .OnDelete(DeleteBehavior.ClientCascade);
//
//     modelBuilder.Entity<Job>()
//       .HasMany(j => j.Benefits)
//       .WithOne(b => b.Job)
//       .HasForeignKey(b => b.JobId)
//       .OnDelete(DeleteBehavior.Cascade);
//     
//     modelBuilder.Entity<JobSkill>()
//       .HasOne(js => js.Job)
//       .WithMany(j => j.Skills) 
//       .HasForeignKey(js => js.JobsId);
//     
//     modelBuilder.Entity<JobSkill>()
//       .HasOne(js => js.Skill)
//       .WithMany()
//       .HasForeignKey(js => js.SkillsId);
//
//     modelBuilder.Entity<JobSeekerSkill>()
//       .HasOne(js => js.JobSeeker)
//       .WithMany(js => js.Skills)
//       .HasForeignKey(js => js.JobSeekersId);
//
//     modelBuilder.Entity<JobSeekerSkill>()
//       .HasOne(js => js.Skill)
//       .WithMany()
//       .HasForeignKey(js => js.SkillsId);
//
//
//     modelBuilder.Entity<JobSkill>().HasKey(js => new { js.JobsId, js.SkillsId });
//     modelBuilder.Entity<JobApplication>().HasKey(ja => new { ja.JobId, ja.JobSeekerId });
//     modelBuilder.Entity<Bookmark>().HasKey(b => new { b.JobId, b.JobSeekerId });
//     modelBuilder.Entity<JobBenefit>().HasKey(jb => new { jb.JobId, jb.Benefit });
//     modelBuilder.Entity<JobSeekerSkill>().HasKey(jss => new { jss.JobSeekersId, jss.SkillsId });
//
//     base.OnModelCreating(modelBuilder);
//     
//     modelBuilder.ApplyConfiguration(new RoleConfiguration());
//     modelBuilder.ApplyConfiguration(new SeedAddressData());
//     modelBuilder.ApplyConfiguration(new SeedUserData());
//     modelBuilder.ApplyConfiguration(new SeedUserRoleData());
//     modelBuilder.ApplyConfiguration(new SeedEmployerData());
//     modelBuilder.ApplyConfiguration(new SeedJobSeekerData());
//     modelBuilder.ApplyConfiguration(new SeedJobData());
//     modelBuilder.ApplyConfiguration(new SeedSkillData());
//     modelBuilder.ApplyConfiguration(new SeedJobSkillData());
//     modelBuilder.ApplyConfiguration(new SeedJobSeekerSkillData());
//     modelBuilder.ApplyConfiguration(new SeedJobBenefitData());
// }
//
//     
//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//     {
//         optionsBuilder.LogTo(Console.WriteLine, LogLevel.Information)
//           .UseModel(RepositoryContextModel.Instance)
//           ;
//         
//     }

    
}
