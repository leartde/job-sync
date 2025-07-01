using System.Text.Json.Serialization;

namespace Entities.Models;

public class Child
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  [JsonIgnore]
  public Parent? Parent { get; set; }
  public int ParentId { get; set; }
}
