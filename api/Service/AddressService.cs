using Contracts;
using Entities.Exceptions;
using Entities.Models;
using Service.Contracts;
using Shared.DataTransferObjects;
using Shared.DataTransferObjects.AddressDtos;
using Shared.Mapping;

namespace Service;

internal sealed class AddressService : IAddressService
{
    private readonly IRepositoryManager _repository;
    private readonly ILoggerManager _logger;

    public AddressService(IRepositoryManager repository, ILoggerManager logger)
    {
        _repository = repository;
        _logger = logger;
    }


    public async Task<ViewAddressDto> GetAddressForJobAsync(Guid employerId, Guid jobId)
    {
        Job? job = await _repository.Job.GetJobForEmployerAsync(employerId,jobId);
        Address? address = await _repository.Address.GetAddressForJobAsync(job);
        return address.ToDto();
    
    }
    
    public async Task<ViewAddressDto> GetAddressForJobSeekerAsync(Guid jobSeekerId)
    {
        JobSeeker? jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        Address address = await _repository.Address.GetAddressForJobSeekerAsync(jobSeeker);
        return address.ToDto();
    }
    
    public async Task<ViewAddressDto> AddAddressForJobAsync(Guid employerId, Guid jobId, AddAddressDto addressDto)
    {
        Address address = new Address
        {
          Id = Guid.NewGuid()
        };
        addressDto.ToEntity(address);
         await _repository.Address.AddAddressAsync(address);
         Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
          job.AddressId = address.Id;
          _repository.Job.UpdateJob(job);
         await _repository.SaveAsync();
         return address.ToDto();
    }
    
    public async Task<ViewAddressDto> AddAddressForJobSeekerAsync(Guid jobSeekerId, AddAddressDto addressDto)
    {
      Address address = new Address
      {
        Id = Guid.NewGuid()
      };
        addressDto.ToEntity(address);
        await _repository.Address.AddAddressAsync(address);
        JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
         jobSeeker.AddressId = address.Id;
         _repository.JobSeeker.UpdateJobSeeker(jobSeeker);
        await _repository.SaveAsync();
        return address.ToDto();
    }
    
    public async Task DeleteAddressForJobAsync(Guid employerId, Guid jobId)
    {
      Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
    
      if (job.Address is null) 
        throw new NullAttributeException("Job's address is null");
    
      var addressToDelete = job.Address;
    
      job.Address = null;
      job.AddressId = null;
      _repository.Job.UpdateJob(job);
    
      await _repository.SaveAsync();
    
      _repository.Address.DeleteAddress(addressToDelete);
      await _repository.SaveAsync();
    }
    
    public async Task DeleteAddressForJobSeekerAsync(Guid jobSeekerId)
    {
        JobSeeker jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        if (jobSeeker.Address is null) throw new NullAttributeException("Job seeker's address is null");
        _repository.Address.DeleteAddress(jobSeeker.Address);
        await _repository.SaveAsync();
    }
    
    public async Task<ViewAddressDto> UpdateAddressForJobAsync(Guid employerId, Guid jobId, UpdateAddressDto addressDto)
    {
        Job job = await _repository.Job.GetJobForEmployerAsync(employerId, jobId);
        if (job.Address is null) throw new NullAttributeException("Job's address is null");
        addressDto.ToEntity(job.Address);
        _repository.Address.UpdateAddress(job.Address);
        await _repository.SaveAsync();
        return job.Address.ToDto();
    
    }
    
    public async Task<ViewAddressDto>  UpdateAddressForJobSeekerAsync(Guid jobSeekerId, UpdateAddressDto addressDto)
    {
        JobSeeker? jobSeeker = await _repository.JobSeeker.GetJobSeekerAsync(jobSeekerId);
        if (jobSeeker.Address is null) throw new NullAttributeException("Job seeker's address is null");
        addressDto.ToEntity(jobSeeker.Address);
        _repository.Address.UpdateAddress(jobSeeker.Address);
        await _repository.SaveAsync();
        return jobSeeker.Address.ToDto();
    }
    
}
