using System.Net.Mime;
using System.Threading.Tasks;

using Back.Models.Aquarium;
using Back.Models.Aquarium.RequestDto;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/aquarium-api/[action]")]
	public class AquariumApiController : ControllerBase {

		private readonly AquariumModel _aquariumModel;

		public AquariumApiController(AquariumModel kitchenModel) {
			this._aquariumModel = kitchenModel;
		}

		/// <summary>
		/// 水質情報を登録
		/// </summary>
		/// <param name="waterState">登録する水質情報</param>
		/// <returns>true固定</returns>
		[HttpPost]
		[ActionName("post-register-water-state")]
		public async Task<JsonResult> PostRegisterWaterState([FromBody] WaterStateRequestDto waterState) {
			await this._aquariumModel.RegisterWaterStateAsync(waterState);
			return new JsonResult(true);
		}

		/// <summary>
		/// 水質状態取得
		/// </summary>
		/// <param name="from">開始日時</param>
		/// <param name="to">終了日時</param>
		/// <param name="period">グルーピング間隔(秒)</param>
		/// <returns>水質状態</returns>
		[HttpGet]
		[ActionName("get-water-state-list")]
		public async Task<JsonResult> GetWaterStateListAsync(string from, string to, int? period) {
			if (from is null) {
				return new JsonResult(new BadRequestObjectResult($"{nameof(from)} is null"));
			}

			if (to is null) {
				return new JsonResult(new BadRequestObjectResult($"{nameof(to)} is null"));
			}

			if (!(period is { } notNullPeriod)) {
				return new JsonResult(new BadRequestObjectResult($"{nameof(period)} is null"));
			}
			return new JsonResult(await this._aquariumModel.GetWaterStateListAsync(from, to, notNullPeriod));
		}
	}
}
