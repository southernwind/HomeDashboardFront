using System.Net.Mime;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/[action]")]
	public class DatabaseApiController : ControllerBase {
	}
}