using System.Net.Mime;
using System.Threading.Tasks;

using Back.Models.ElectricPower;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/electric-power-api/[action]")]
	public class ElectricPowerApiController : ControllerBase {

		private readonly ElectricPowerModel _aquariumModel;

		public ElectricPowerApiController(ElectricPowerModel kitchenModel) {
			this._aquariumModel = kitchenModel;
		}

		/// <summary>
		/// 期間指定電力消費量取得
		/// </summary>
		/// <param name="from">開始日時</param>
		/// <param name="to">終了日時</param>
		/// <returns>電力消費量リスト</returns>
		[HttpGet]
		[ActionName("get-electric-power-consumption-list")]
		public async Task<JsonResult> GetElectricPowerConsumptionListAsync(string? from, string? to) {
			if (from is null) {
				return new JsonResult(new BadRequestObjectResult($"{nameof(from)} is null"));
			}

			if (to is null) {
				return new JsonResult(new BadRequestObjectResult($"{nameof(to)} is null"));
			}
			return new JsonResult(await this._aquariumModel.GetElectricPowerConsumptionListAsync(from, to));
		}
	}
}
