
using CloudinaryDotNet.Actions;

namespace Service.Contracts;

public interface ICloudinaryManager
{
    IImageUploader ImageUploader { get; }
    IRawUploader RawUploader { get; }
    Task<DeletionResult> DeleteFile(string publicId);
}
