
using System;
using System.Linq;
using System.Threading.Tasks;

using Back.Models.Common;
using Back.Utils;

using DataBase;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using MoneyForwardViewer.DataBase.Tables;
using MoneyForwardViewer.Scraper;

namespace Back.Models.Financial {
	/// <summary>
	/// 財務データベースの操作
	/// </summary>
	public class FinancialModel {
		/// <summary>
		/// サービススコープ
		/// </summary>
		private readonly IServiceScope _scope;
		/// <summary>
		/// データベース
		/// </summary>
		private readonly HomeServerDbContext _db;
		/// <summary>
		/// ログ
		/// </summary>
		private readonly ILogger<FinancialModel> _logger;

		/// <summary>
		/// 非同期更新クラス
		/// </summary>
		private readonly Updater _updater;

		/// <summary>
		/// コンストラクタ
		/// </summary>
		/// <param name="serviceScopeFactory">サービススコープファクトリー</param>
		/// <param name="db">データベース</param>
		/// <param name="logger">ロガー</param>
		/// <param name="updater">更新クラス</param>
		public FinancialModel(IServiceScopeFactory serviceScopeFactory, HomeServerDbContext db, ILogger<FinancialModel> logger, Updater updater) {
			this._db = db;
			this._scope = serviceScopeFactory.CreateScope();
			this._logger = logger;
			this._updater = updater;
		}

		/// <summary>
		/// 更新処理開始
		/// </summary>
		/// <param name="from">取得対象開始日</param>
		/// <param name="to">取得対象終了日</param>
		/// <returns>更新キー</returns>
		public int Update(DateTime from, DateTime to) {
			return this._updater.Update(async progress => {
				// 進捗率計算の分母
				var denominator = Math.Max(1, to.Ticks - from.Ticks);
				progress.Report(1);
				this._logger.LogInformation($"{from}-{to}の財務データベース更新開始");

				var db = this._scope.ServiceProvider.GetService<HomeServerDbContext>();
				var setting = await Utility.GetUseSetting(db);
				var mfs = new MoneyForwardScraper(setting.MoneyForwardId, setting.MoneyForwardPassword);
				await using var tran = await db.Database.BeginTransactionAsync();

				// 資産推移
				var maCount = 0;
				await foreach (var ma in mfs.GetAssets(from, to)) {
					var assets =
						ma.GroupBy(x => new { x.Date, x.Institution, x.Category })
							.Select(x => new MfAsset {
								Date = x.Key.Date,
								Institution = x.Key.Institution,
								Category = x.Key.Category,
								Amount = x.Sum(a => a.Amount)
							}).ToArray();
					var deleteAssetList = db.MfAssets.Where(a => a.Date == assets.First().Date);
					db.MfAssets.RemoveRange(deleteAssetList);
					await db.MfAssets.AddRangeAsync(assets);
					this._logger.LogDebug($"{ma.First().Date:yyyy/MM/dd}資産推移{assets.Length}件登録");
					maCount += assets.Length;
					progress.Report(1 + ((ma.First().Date.Ticks - from.Ticks) * 89 / denominator));
				}
				this._logger.LogInformation($"資産推移 計{maCount}件登録");

				// 取引履歴
				var mtCount = 0;
				await foreach (var mt in mfs.GetTransactions(from, to)) {
					var ids = mt.Select(x => x.TransactionId).ToArray();
					var deleteTransactionList = db.MfTransactions.Where(t => ids.Contains(t.TransactionId));
					db.MfTransactions.RemoveRange(deleteTransactionList);
					await db.MfTransactions.AddRangeAsync(mt);
					this._logger.LogDebug($"{mt.First()?.Date:yyyy/MM}取引履歴{mt.Length}件登録");
					mtCount += mt.Length;
					progress.Report(90 + ((mt.First().Date.Ticks - from.Ticks) * 9 / denominator));
				}
				this._logger.LogInformation($"取引履歴 計{mtCount}件登録");
				progress.Report(99);

				await db.SaveChangesAsync();
				this._logger.LogDebug("SaveChanges");
				await tran.CommitAsync();
				this._logger.LogDebug("Commit");

				this._logger.LogInformation($"{from}-{to}の財務データベース更新正常終了");
				progress.Report(100);
			});
		}

		/// <summary>
		/// 処理状況取得
		/// </summary>
		/// <param name="key">更新キー</param>
		/// <returns>処理状況(0～100: 進捗率 100:完了)</returns>
		public long GetUpdateStatus(int key) {
			return this._updater.GetUpdateStatus(key);
		}


		/// <summary>
		/// 資産推移取得
		/// </summary>
		/// <param name="from">取得対象開始日</param>
		/// <param name="to">取得対象終了日</param>
		/// <returns>資産推移データ</returns>
		public async Task<MfAsset[]> GetAssetsAsync(DateTime from, DateTime to) {
			return await this._db.MfAssets.Where(x => from <= x.Date && to >= x.Date).ToArrayAsync();
		}


		/// <summary>
		/// 最新資産取得
		/// </summary>
		/// <param name="from">取得対象開始日</param>
		/// <param name="to">取得対象終了日</param>
		/// <returns>資産推移データ</returns>
		public async Task<MfAsset[]> GetLatestAssetAsync(DateTime from, DateTime to) {
			var max = await this._db.MfAssets.Where(x => from <= x.Date && to >= x.Date).MaxAsync(x => x.Date);
			return await this._db.MfAssets.Where(x => x.Date == max).ToArrayAsync();
		}

		/// <summary>
		/// 取引履歴取得
		/// </summary>
		/// <param name="from">取得対象開始日</param>
		/// <param name="to">取得対象終了日</param>
		/// <returns>取引履歴データ</returns>
		public async Task<MfTransaction[]> GetTransactionsAsync(DateTime from, DateTime to) {
			return await
				this._db
					.MfTransactions
					.Where(x => x.IsCalculateTarget)
					.Where(x => from <= x.Date && to >= x.Date)
					.ToArrayAsync();
		}
	}
}
