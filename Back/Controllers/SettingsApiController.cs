using System.Net.Mime;
using System.Threading.Tasks;

using Back.Models.Settings;

using Database.Tables;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/settings-api/[action]")]
	public class SettingsApiController : ControllerBase {
		private readonly SettingsModel _settings;
		public SettingsApiController(SettingsModel settings) {
			this._settings = settings;
		}

		/// <summary>
		/// 設定データベースの更新を行う
		/// </summary>
		/// <param name="setting">更新値</param>
		/// <returns>true固定</returns>
		[HttpPost]
		[ActionName("update-settings")]
		public async Task<JsonResult> Update([FromBody] UserSetting setting) {
			await this._settings.UpdateAsync(setting);
			return new JsonResult(true);
		}

		/// <summary>
		/// 現在の設定値取得
		/// </summary>
		/// <returns>現在の設定値</returns>
		[HttpGet]
		[ActionName("get-current-settings")]
		public async Task<JsonResult> GetAsync() {
			return new JsonResult(await this._settings.GetCurrentSettingsAsync());
		}

	}
}