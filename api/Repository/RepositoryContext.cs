using Entities.Models;
using JobSync.Repository.CompiledModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Repository.Configuration;
using Repository.DataSeeders;

namespace Repository;

public class RepositoryContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public RepositoryContext(DbContextOptions options) : base(options){}
    public DbSet<Employer>? Employers { get; set; }
    public DbSet<Job>? Jobs { get; set; }
    public DbSet<JobSeeker>? JobSeekers { get; set; }
    public DbSet<Address>? Addresses { get; set; }
    public DbSet<JobApplication>? JobApplications { get; set; }
    public DbSet<Skill>? Skills { get; set; }
    public DbSet<JobSkill>? JobSkills { get; set; }
    public DbSet<JobSeekerSkill>? JobSeekerSkills { get; set; }
    public DbSet<Bookmark>? Bookmarks { get; set; }
    public DbSet<JobBenefit>? Benefits { get; set; }
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<JobSeeker>()
            .HasOne(js => js.Address)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Address)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Employer>()
            .HasMany(e => e.Jobs)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobBenefit>()
            .HasOne(jb => jb.Job)
            .WithMany(j => j.Benefits)
            .HasForeignKey(jb => jb.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobSeeker>()
            .HasOne(js => js.User)
            .WithOne()
            .HasForeignKey<JobSeeker>(js => js.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Employer>()
            .HasOne(e => e.User)
            .WithOne()
            .HasForeignKey<Employer>(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Job>()
            .HasOne(e => e.Employer)
            .WithMany(j => j.Jobs)
            .HasForeignKey(e => e.EmployerId)
            .OnDelete(DeleteBehavior.NoAction);
      
        
        modelBuilder.Entity<JobSkill>()
            .HasKey(js => new { js.JobsId, js.SkillsId });

        modelBuilder.Entity<JobApplication>()
            .HasKey(ja => new { ja.JobId, ja.JobSeekerId });

        modelBuilder.Entity<Bookmark>()
            .HasKey(b => new { b.JobId, b.JobSeekerId });

        modelBuilder.Entity<JobBenefit>()
            .HasKey(j => new { j.JobId, j.Benefit });
        
        modelBuilder.Entity<JobSeekerSkill>()
            .HasKey(js => new { js.JobSeekersId, js.SkillsId });
        

        modelBuilder.Entity<Job>()
            .HasMany(j => j.Skills)
            .WithMany(s => s.Jobs)
            .UsingEntity<JobSkill>();

        modelBuilder.Entity<JobSeeker>()
            .HasMany(j => j.Skills)
            .WithMany(s => s.JobSeekers)
            .UsingEntity<JobSeekerSkill>();

        modelBuilder.Entity<Job>()
            .HasMany(j => j.Applications)
            .WithOne(a => a.Job)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<JobSeeker>()
            .HasMany(j => j.Applications)
            .WithOne(a => a.JobSeeker)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Job>()
            .HasMany(j => j.Bookmarks)
            .WithOne(a => a.Job)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<JobSeeker>()
            .HasMany(j => j.Bookmarks)
            .WithOne(a => a.JobSeeker)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<JobSeeker>()
            .HasMany(j => j.Applications)
            .WithOne(a => a.JobSeeker)
            .OnDelete(DeleteBehavior.NoAction);
        
        
    
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new SeedAddressData());
        modelBuilder.ApplyConfiguration(new SeedUserData());
        modelBuilder.ApplyConfiguration(new SeedEmployerData());
        modelBuilder.ApplyConfiguration(new SeedJobSeekerData());
        modelBuilder.ApplyConfiguration(new SeedJobData());
        modelBuilder.ApplyConfiguration(new SeedSkillData());
        modelBuilder.ApplyConfiguration(new SeedJobSkillData());
        modelBuilder.ApplyConfiguration(new SeedJobSeekerSkillData());
        modelBuilder.ApplyConfiguration(new SeedJobBenefitData());
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseModel(RepositoryContextModel.Instance)
        .LogTo(Console.WriteLine, LogLevel.Information);
    }

    
}