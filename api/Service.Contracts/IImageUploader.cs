using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace Service.Contracts;

public interface IImageUploader
{
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
}
