using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Service.Contracts;

public interface IRawUploader
{
    Task<RawUploadResult> AddFileAsync(IFormFile file);
}
