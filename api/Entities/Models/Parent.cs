using System.Text.Json.Serialization;

namespace Entities.Models;

public class Parent
{
  public int Id { get; set; }
  public string Name { get; set; } = string.Empty;
  [JsonIgnore]
  public ICollection<Child>? Children { get; set; }
}
