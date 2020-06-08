using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Back.Controllers;
using DataBase;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MoneyForwardViewer.DataBase.Tables;
using MoneyForwardViewer.Scraper;

namespace Back.Models.Financial {
	public class Updater {
		private readonly IServiceScope _scope;
		private readonly ILogger<Updater> _logger;
		private readonly ConcurrentDictionary<int, (Task task, ProgressObject<long> progress)> _executingTasks = new ConcurrentDictionary<int, (Task task, ProgressObject<long> progress)>();

		public Updater(IServiceScopeFactory serviceScopeFactory) {
			this._scope = serviceScopeFactory.CreateScope();
			this._logger = this._scope.ServiceProvider.GetService<ILogger<Updater>>();

			// TODO : もうちょっと生成場所考える
			this._scope.ServiceProvider.GetService<HomeServerDbContext>().Database.EnsureCreated();
		}

		public int Update(DateTime from,DateTime to) {
			var progress = new ProgressObject<long>();
			var task = this.UpdateCore(from, to,progress);
			var hash = task.GetHashCode();
			if (this._executingTasks.TryAdd(hash, (task, progress))) {
				return hash;
			}
			throw new Exception();
		}

		private async Task UpdateCore(DateTime from, DateTime to, ProgressObject<long> progress) {
			// 進捗率計算の分母
			var denominator = Math.Max(1,to.Ticks - from.Ticks);
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

		public long GetUpdateStatus(int key) {
			// 完了済みタスクの削除
			foreach(var et in this._executingTasks.Where(x => x.Value.progress.Progress == 101)) {
				this._executingTasks.TryRemove(et.Key,out _);
			}

			// 指定タスクの進捗率返却
			if (this._executingTasks.TryGetValue(key,out var value)) {
				return value.progress.Progress;
			}

			return 101;
		}

		private class ProgressObject<T> {
			public T Progress {
				get;
				private set;
			}

			public void Report(T progress) {
				this.Progress = progress;
			}
		}
	}
}
