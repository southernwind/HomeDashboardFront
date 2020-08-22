
using System.Net.Mime;
using System.Threading.Tasks;

using Back.Models.Palmie;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/palmie-api/[action]")]
	public class PalmieApiController {
		private readonly PalmieModel _palmieModel;
		public PalmieApiController(PalmieModel palmieModel) {
			this._palmieModel = palmieModel;
		}

		[HttpGet]
		[ActionName("get-all-courses")]
		public async Task<ActionResult> GetAllCoursesAsync() {
			return new ContentResult { Content = await this._palmieModel.GetAllAsync(), ContentType = "application/json" };
		}

		[HttpGet]
		[ActionName("get-courses")]
		public async Task<ActionResult<string>> GetCoursesAsync(string word) {
			return new ContentResult { Content = await this._palmieModel.GetSearchResultAsync(word), ContentType = "application/json" };
		}


	}
}
