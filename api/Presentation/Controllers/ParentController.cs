using Entities.Exceptions;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repository;

namespace Presentation.Controllers;

[ApiController]
public class ParentController : ControllerBase
{
  private readonly RepositoryContext _context;

  public ParentController(RepositoryContext context)
  {
    _context = context;
  }

  [HttpGet("api/parents")]
  public IActionResult GetParents()
  {
    var parents =  _context.Parents.ToList();
    return Ok(parents);
  }
  
  [HttpGet("api/children")]
  public IActionResult GetChildren()
  {
    var children =  _context.Children.ToList();
    return Ok(children);
  }


  [HttpGet("api/parents/{id}")]
  public IActionResult GetParent(int id)
  {
    var parent = _context.Parents.Include(p => p.Children)
      .FirstOrDefault(p => p.Id == id);
    return Ok(parent);
  }

  [HttpGet("api/children/{id}")]
  public IActionResult GetChild(int id)
  {
    var child = _context.Children.Find(id);
    return Ok(child);
  }

  [HttpPost("api/parents")]
  public IActionResult AddParent(Parent parent)
  {
    _context.Parents.Add(parent);
    _context.SaveChanges();
    return Ok(parent);
  }
  
  [HttpPost("api/children")]
  public IActionResult AddChild(Child child)
  {
    _context.Children.Add(child);
    _context.SaveChanges();
    return Ok(child);
  }

  [HttpGet("api/parents/{name}/children")]
  public IActionResult GetChildrenByParentName(string name)
  {
    var parent = _context.Parents.Include(p => p.Children)
      .FirstOrDefault(p => p.Name.ToLower().Equals(name.ToLower()));
    if (parent is null) throw new BadRequestException("parent not found");
    return Ok(parent.Children);
  }

  [HttpPut("api/children/{id}")]
  public IActionResult UpdateChild(int id, Child childToUpdate)
  {
    var child   = _context.Children.Find(id);
    if (child != null)
    {
      child.Name = childToUpdate.Name;
      _context.Children.Update(child);
    }
    _context.SaveChanges();
    return Ok(child);
  }
}
