using System.Net.Mime;

using Back.Models.Network;
using Back.Models.Network.RequestDto;

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
	}
}