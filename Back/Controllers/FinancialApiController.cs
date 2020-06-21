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
		private readonly FinancialModel _financial;
		public FinancialApiController(FinancialModel financial) {
			this._financial = financial;
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
				key = this._financial.Update(fromDate, toDate)
			});
		}

		/// <summary>
		/// 財務データベースの更新リクエスト
		/// </summary>
		/// <param name="span">更新期間</param>API
		/// <returns>更新キー</returns>
		[HttpPost]
		[ActionName("post-update-by-span-request")]
		public JsonResult PostUpdateBySpanRequest([FromBody] Span span) {
			if (!(span.Days is { } days)) {
				throw new ArgumentException();
			}
			var to = DateTime.Now.Date;
			var from = to.AddDays(-days);
			return new JsonResult(new {
				key = this._financial.Update(from, to)
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
				progress = this._financial.GetUpdateStatus(key)
			});
		}

		/// <summary>
		/// 資産推移取得API
		/// </summary>
		/// <param name="from">開始日</param>
		/// <param name="to">終了日</param>
		/// <returns>資産推移データ</returns>
		[HttpGet]
		[ActionName("get-assets")]
		public async Task<JsonResult> GetAssetsAsync(string from, string to) {
			var fromDate = DateTime.Parse(from);
			var toDate = DateTime.Parse(to);
			return new JsonResult(await this._financial.GetAssetsAsync(fromDate, toDate));
		}

		/// <summary>
		/// 最新資産取得API
		/// </summary>
		/// <param name="from">開始日</param>
		/// <param name="to">終了日</param>
		/// <returns>資産推移データ</returns>
		[HttpGet]
		[ActionName("get-latest-asset")]
		public async Task<JsonResult> GetLatestAssetAsync(string from, string to) {
			var fromDate = DateTime.Parse(from);
			var toDate = DateTime.Parse(to);
			return new JsonResult(await this._financial.GetLatestAssetAsync(fromDate, toDate));
		}

		/// <summary>
		/// 取引履歴取得API
		/// </summary>
		/// <param name="from">開始日</param>
		/// <param name="to">終了日</param>
		/// <returns>取引履歴データ</returns>
		[HttpGet]
		[ActionName("get-transactions")]
		public async Task<JsonResult> GetTransactionsAsync(string from, string to) {
			var fromDate = DateTime.Parse(from);
			var toDate = DateTime.Parse(to);
			return new JsonResult(await this._financial.GetTransactionsAsync(fromDate, toDate));
		}
	}
}