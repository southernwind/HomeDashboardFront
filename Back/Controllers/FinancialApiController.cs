using System;
using System.Net.Mime;

using Back.Models.Financial;
using Back.Models.Financial.RequestDto;

using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/financial-api/[action]")]
	public class FinancialApiController : ControllerBase {
		private readonly Updater _updater;
		public FinancialApiController(Updater updater) {
			this._updater = updater;
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
			var to = DateTime.Now;
			var from = to.AddDays(-span.Days);
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

	}
}