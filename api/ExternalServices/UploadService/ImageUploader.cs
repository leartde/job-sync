using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Service.Contracts;

namespace ExternalServices.UploadService;



internal sealed class ImageUploader : IImageUploader
{
    private readonly Cloudinary _cloudinary;

    public ImageUploader(Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        ImageUploadResult uploadResult = new ImageUploadResult();

        if (file.Length <= 0) return uploadResult;
        await using Stream stream = file.OpenReadStream();
        ImageUploadParams uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream)

        };

        uploadResult = await _cloudinary.UploadAsync(uploadParams);
        return uploadResult;
    }
    
    
}
