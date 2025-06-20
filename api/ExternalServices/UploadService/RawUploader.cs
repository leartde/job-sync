using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Service.Contracts;

namespace ExternalServices.UploadService;

internal sealed class RawUploader : IRawUploader
{
    private readonly Cloudinary _cloudinary;
    public RawUploader(Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }

    public async Task<RawUploadResult> AddFileAsync(IFormFile file)
    {
        RawUploadResult uploadResult = new RawUploadResult();

        if (file.Length <= 0) return uploadResult;

        await using Stream stream = file.OpenReadStream();
        RawUploadParams uploadParams = new RawUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            PublicId = Guid.NewGuid().ToString(),
            Overwrite = true,
            Type = "upload" 
        };

        uploadResult = await _cloudinary.UploadAsync(uploadParams);
        
        if (uploadResult.Url != null)
        {
            string newUri = uploadResult.Url.AbsoluteUri.Replace("upload/", "upload/fl_attachment/");
            uploadResult.Url = new Uri(newUri);
        }
        
        return uploadResult;
    }

}
