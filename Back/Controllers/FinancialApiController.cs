using System;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Back.Models.Financial.Parameters;
using Back.Models.Financial.RequestDto;
using DataBase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MoneyForwardViewer.DataBase.Tables;
using MoneyForwardViewer.Scraper;

namespace Back.Controllers {
	[ApiController]
	[Produces(MediaTypeNames.Application.Json)]
	[Route("api/financial-api/[action]")]
	public class FinancialApiController : ControllerBase {
		private readonly HomeServerDbContext _db;
		private readonly ILogger<FinancialApiController> _logger;
		public FinancialApiController(HomeServerDbContext dbContext, ILogger<FinancialApiController> logger) {
			this._db = dbContext;
			this._logger = logger;
			this._db.Database.EnsureCreated();
		}

		/// <summary>
		/// 財務データベースの更新リクエスト(FromTo指定)
		/// </summary>
		/// <param name="term">更新期間</param>
		/// <returns>結果</returns>
		[HttpPost]
		[ActionName("post-update-by-term-request")]
		public async Task<JsonResult> PostUpdateByTermRequest([FromBody] Term term) {
			var fromDate = term.GetFrom();
			var toDate = term.GetTo();
			this._logger.LogInformation($"{fromDate}-{toDate}の財務データベース更新開始");

			var setting = await Utility.GetUseSetting(this._db);
			var mfs = new MoneyForwardScraper(setting.MoneyForwardId, setting.MoneyForwardPassword);
			await using var tran = await this._db.Database.BeginTransactionAsync();

			// 資産推移
			var maCount = 0;
			await foreach (var ma in mfs.GetAssets(fromDate, toDate)) {
				var assets =
					ma.GroupBy(x => new { x.Date, x.Institution, x.Category })
						.Select(x => new MfAsset {
							Date = x.Key.Date,
							Institution = x.Key.Institution,
							Category = x.Key.Category,
							Amount = x.Sum(a => a.Amount)
						}).ToArray();
				var deleteAssetList = this._db.MfAssets.Where(a => a.Date == assets.First().Date);
				this._db.MfAssets.RemoveRange(deleteAssetList);
				await this._db.MfAssets.AddRangeAsync(assets);
				this._logger.LogDebug($"{ma.First().Date:yyyy/MM/dd}資産推移{assets.Length}件登録");
				maCount += assets.Length;
			}
			this._logger.LogInformation($"資産推移 計{maCount}件登録");

			// 取引履歴
			var mtCount = 0;
			await foreach (var mt in mfs.GetTransactions(fromDate, toDate)) {
				var ids = mt.Select(x => x.TransactionId).ToArray();
				var deleteTransactionList = this._db.MfTransactions.Where(t => ids.Contains(t.TransactionId));
				this._db.MfTransactions.RemoveRange(deleteTransactionList);
				await this._db.MfTransactions.AddRangeAsync(mt);
				this._logger.LogDebug($"{mt.First()?.Date:yyyy/MM}取引履歴{mt.Length}件登録");
				mtCount += mt.Length;
			}
			this._logger.LogInformation($"取引履歴 計{mtCount}件登録");

			await this._db.SaveChangesAsync();
			this._logger.LogDebug("SaveChanges");
			await tran.CommitAsync();
			this._logger.LogDebug("Commit");

			this._logger.LogInformation($"{fromDate}-{toDate}の財務データベース更新正常終了");
			return new JsonResult(true);
		}

		/// <summary>
		/// 財務データベースの更新リクエスト
		/// </summary>
		/// <param name="span">更新期間</param>
		/// <returns>結果</returns>
		[HttpPost]
		[ActionName("post-update-by-span-request/")]
		public async Task<JsonResult> PostUpdateBySpanRequest([FromBody] Span span) {
			var to=DateTime.Now;
			var from = to.AddDays(-span.Days);
			return await this.PostUpdateByTermRequest(new Term{From=from.ToShortDateString(),To=to.ToShortDateString()});
		}
	}
}