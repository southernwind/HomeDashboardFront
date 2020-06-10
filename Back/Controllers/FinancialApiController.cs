using System;
using System.Net.Mime;
using System.Threading.Tasks;

using Back.Models.Financial;
using Back.Models.Financial.RequestDto;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/financial-api/[action]")]
	public class FinancialApiController : ControllerBase {
		private readonly Updater _updater;
		private readonly Getter _getter;
		public FinancialApiController(Updater updater, Getter getter) {
			this._updater = updater;
			this._getter = getter;
		}

		/// <summary>
		/// 財務データベースの更新リクエスト(FromTo指定)API
		/// </summary>
		/// <param name="term">更新期間</param>
		/// <returns>更新キー</returns>
		[HttpPost]
		[ActionName("post-update-by-term-request")]
		public JsonResult PostUpdateByTermRequest([FromBody] Term term) {
			var fromDate = term.GetFrom();
			var toDate = term.GetTo();
			return new JsonResult(new {
				key = this._updater.Update(fromDate, toDate)
			});
		}

		/// <summary>
		/// 財務データベースの更新リクエスト
		/// </summary>
		/// <param name="span">更新期間</param>API
		/// <returns>更新キー</returns>
		[HttpPost]
		[ActionName("post-update-by-span-request/")]
		public JsonResult PostUpdateBySpanRequest([FromBody] Span span) {
			if (!(span.Days is { } days)) {
				throw new ArgumentException();
			}
			var to = DateTime.Now;
			var from = to.AddDays(-days);
			return new JsonResult(new {
				key = this._updater.Update(from, to)
			});
		}

		/// <summary>
		/// 処理状況取得API
		/// </summary>
		/// <param name="key">更新キー</param>
		/// <returns>処理状況(0～100: 進捗率 101:完了)</returns>
		[HttpGet]
		[ActionName("get-update-status")]
		public JsonResult GetUpdateStatus(int key) {
			return new JsonResult(new {
				progress = this._updater.GetUpdateStatus(key)
			});
		}

		/// <summary>
		/// 資産推移取得API
		/// </summary>
		/// <param name="term">期間</param>
		/// <returns>資産推移データ</returns>
		[HttpGet]
		[ActionName("get-assets")]
		public async Task<JsonResult> GetAssetsAsync(string from, string to) {
			var fromDate = DateTime.Parse(from);
			var toDate = DateTime.Parse(to);
			return new JsonResult(await this._getter.GetAssetsAsync(fromDate, toDate));
		}
	}
}