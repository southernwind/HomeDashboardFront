using System.Net.Mime;
using System.Threading.Tasks;

using Back.Models.Kitchen;

using Database.Tables;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/kitchen-api/[action]")]
	public class KitchenApiController : ControllerBase {

		private readonly KitchenModel _kitchenModel;

		public KitchenApiController(KitchenModel kitchenModel) {
			this._kitchenModel = kitchenModel;
		}

		/// <summary>
		/// レシピを登録
		/// </summary>
		/// <param name="recipe">登録レシピ</param>
		/// <returns>true固定</returns>
		[HttpPost]
		[ActionName("post-register-recipe")]
		public async Task<JsonResult> PostRegisterRecipe([FromBody] Recipe recipe) {
			await this._kitchenModel.RegisterWakeOnLanTarget(recipe);
			return new JsonResult(true);
		}


		/// <summary>
		/// レシピを削除
		/// </summary>
		/// <param name="recipe">削除レシピ</param>
		/// <returns>true固定</returns>
		[HttpPost]
		[ActionName("post-delete-recipe")]
		public async Task<JsonResult> PostDeleteRecipe([FromBody] Recipe recipe) {
			await this._kitchenModel.DeleteWakeOnLanTarget(recipe);
			return new JsonResult(true);
		}

		[HttpGet]
		[ActionName("get-recipe-list")]
		public async Task<JsonResult> GetRecipeList() {
			return new JsonResult(await this._kitchenModel.GetWakeOnLanTargetList());
		}
	}
}
