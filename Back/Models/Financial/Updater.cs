using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;

using DataBase;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using MoneyForwardViewer.DataBase.Tables;
using MoneyForwardViewer.Scraper;

namespace Back.Models.Financial {
	/// <summary>
	/// 財務データベースの更新
	/// </summary>
	public class Updater {
		/// <summary>
		/// サービススコープ
		/// </summary>
		private readonly IServiceScope _scope;
		/// <summary>
		/// ログ
		/// </summary>
		private readonly ILogger<Updater> _logger;
		/// <summary>
		/// 処理中リスト
		/// </summary>
		private readonly ConcurrentDictionary<int, (Task task, ProgressObject<long> progress)> _executingTasks = new ConcurrentDictionary<int, (Task task, ProgressObject<long> progress)>();

		/// <summary>
		/// コンストラクタ
		/// </summary>
		/// <param name="serviceScopeFactory">サービススコープファクトリー</param>
		public Updater(IServiceScopeFactory serviceScopeFactory) {
			this._scope = serviceScopeFactory.CreateScope();
			this._logger = this._scope.ServiceProvider.GetService<ILogger<Updater>>();

			// TODO : もうちょっと生成場所考える
			this._scope.ServiceProvider.GetService<HomeServerDbContext>().Database.EnsureCreated();
		}

		/// <summary>
		/// 更新処理開始
		/// </summary>
		/// <param name="from">取得対象開始日</param>
		/// <param name="to">取得対象終了日</param>
		/// <returns>更新キー</returns>
		public int Update(DateTime from, DateTime to) {
			var progress = new ProgressObject<long>(0);
			var task = this.UpdateCore(from, to, progress);
			// Taskのハッシュ値を更新キーとする
			var hash = task.GetHashCode();
			if (this._executingTasks.TryAdd(hash, (task, progress))) {
				return hash;
			}
			throw new Exception();
		}

		/// <summary>
		/// 更新処理
		/// </summary>
		/// <param name="from">取得対象開始日</param>
		/// <param name="to">取得対象終了日</param>
		/// <param name="progress">進捗率オブジェクト</param>
		/// <returns>Task</returns>
		private async Task UpdateCore(DateTime from, DateTime to, ProgressObject<long> progress) {
			// 進捗率計算の分母
			var denominator = Math.Max(1, to.Ticks - from.Ticks);
			progress.Report(0);
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
				progress.Report((ma.First().Date.Ticks - from.Ticks) * 90 / denominator);
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
				progress.Report(90 + ((mt.First().Date.Ticks - from.Ticks) * 10 / denominator));
			}
			this._logger.LogInformation($"取引履歴 計{mtCount}件登録");
			progress.Report(100);

			await db.SaveChangesAsync();
			this._logger.LogDebug("SaveChanges");
			await tran.CommitAsync();
			this._logger.LogDebug("Commit");

			this._logger.LogInformation($"{from}-{to}の財務データベース更新正常終了");
			progress.Report(101);
		}

		/// <summary>
		/// 処理状況取得
		/// </summary>
		/// <param name="key">更新キー</param>
		/// <returns>処理状況(0～100: 進捗率 101:完了)</returns>
		public long GetUpdateStatus(int key) {
			// 完了済みタスクの削除
			foreach (var et in this._executingTasks.Where(x => x.Value.progress.Progress == 101)) {
				this._executingTasks.TryRemove(et.Key, out _);
			}

			// 指定タスクの進捗率返却
			if (this._executingTasks.TryGetValue(key, out var value)) {
				return value.progress.Progress;
			}

			return 101;
		}

		/// <summary>
		/// 処理状況オブジェクト
		/// </summary>
		/// <typeparam name="T">進捗率を表す型</typeparam>
		private class ProgressObject<T> {
			/// <summary>
			/// 進捗率
			/// </summary>
			public T Progress {
				get;
				private set;
			}

			public ProgressObject(T initialValue) {
				this.Progress = initialValue;
			}

			/// <summary>
			/// 進捗率更新
			/// </summary>
			/// <param name="progress">進捗率</param>
			public void Report(T progress) {
				this.Progress = progress;
			}
		}
	}
}
