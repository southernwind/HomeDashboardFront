using System.Net.Mime;
using System.Threading.Tasks;

using Back.Models.Network;
using Back.Models.Network.RequestDto;

using Database.Tables;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/network-api/[action]")]
	public class NetworkApiController : ControllerBase {
		private readonly NetworkModel _networkModel;

		public NetworkApiController(NetworkModel networkModel) {
			this._networkModel = networkModel;
		}

		/// <summary>
		/// 対象マックアドレスにマジックパケットを送信する。
		/// </summary>
		/// <param name="dto">リクエストパラメータ</param>
		/// <returns>true:成功/false:失敗</returns>
		[HttpPost]
		[ActionName("post-send-magic-packet-request")]
		public JsonResult PostSendMagicPacketRequest([FromBody] WakeOnLanRequestDto dto) {
			if (dto.TargetMacAddress == null) {
				return new JsonResult(new BadRequestObjectResult($"{nameof(dto.TargetMacAddress)} is null"));
			}

			return new JsonResult(this._networkModel.SendMagicPacket(dto.TargetMacAddress));
		}

		/// <summary>
		/// Wake on LANの対象機器を登録
		/// </summary>
		/// <param name="target">登録情報</param>
		/// <returns>true固定</returns>
		[HttpPost]
		[ActionName("post-register-wake-on-lan-target")]
		public async Task<JsonResult> PostRegisterWakeOnLanTarget([FromBody] WakeOnLanTarget target) {
			await this._networkModel.RegisterWakeOnLanTarget(target);
			return new JsonResult(true);
		}


		/// <summary>
		/// Wake on LANの対象機器を削除
		/// </summary>
		/// <param name="target">削除対象情報</param>
		/// <returns>true固定</returns>
		[HttpPost]
		[ActionName("post-delete-wake-on-lan-target")]
		public async Task<JsonResult> PostDeleteWakeOnLanTarget([FromBody] WakeOnLanTarget target) {
			await this._networkModel.DeleteWakeOnLanTarget(target);
			return new JsonResult(true);
		}

		[HttpGet]
		[ActionName("get-wake-on-lan-target-list")]
		public async Task<JsonResult> GetWakeOnLanTargetList() {
			return new JsonResult(await this._networkModel.GetWakeOnLanTargetList());
		}
	}
}