

using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Service.Contracts;

namespace ExternalServices.UploadService;

public class CloudinaryManager : ICloudinaryManager
{
    private readonly Lazy<IImageUploader> _imageUploader;
    private readonly Lazy<IRawUploader> _rawUploader;
    private readonly Cloudinary _cloudinary;

    public CloudinaryManager()
    {
        Account acc = new Account(
            "dertrvymu",
            Environment.GetEnvironmentVariable("APIKEY"),
            Environment.GetEnvironmentVariable("APISECRET")
        );
        _cloudinary = new Cloudinary(acc);
        _imageUploader = new Lazy<IImageUploader>(() => new
            ImageUploader(_cloudinary)
        );
        _rawUploader = new Lazy<IRawUploader>(() => new
            RawUploader(_cloudinary)
        );
    }

    public IImageUploader ImageUploader => _imageUploader.Value;
    public IRawUploader RawUploader => _rawUploader.Value;
    public async Task<DeletionResult> DeleteFile(string publicId)
    {
        DeletionParams deleteParams = new DeletionParams(publicId);
        DeletionResult result = await _cloudinary.DestroyAsync(deleteParams);
        return result;
    }
}
