using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Models.Common {
	/// <summary>
	/// 更新処理汎用クラス
	/// </summary>
	public class Updater {
		/// <summary>
		/// 処理中リスト
		/// </summary>
		private readonly ConcurrentDictionary<int, (Task task, ProgressObject<long> progress)> _executingTasks =
			new ConcurrentDictionary<int, (Task task, ProgressObject<long> progress)>();

		/// <summary>
		/// 更新処理開始
		/// </summary>
		public int Update(Func<ProgressObject<long>, Task> updateAction) {
			var progress = new ProgressObject<long>(0);
			var task = updateAction(progress);
			// Taskのハッシュ値を更新キーとする
			var hash = task.GetHashCode();
			if (this._executingTasks.TryAdd(hash, (task, progress))) {
				return hash;
			}

			throw new Exception();
		}

		/// <summary>
		/// 処理状況取得
		/// </summary>
		/// <param name="key">更新キー</param>
		/// <returns>処理状況(0～100: 進捗率 100:完了)</returns>
		public long GetUpdateStatus(int key) {
			// 完了済みタスクの削除
			foreach (var et in this._executingTasks.Where(x => x.Value.progress.Progress == 100)) {
				this._executingTasks.TryRemove(et.Key, out _);
			}

			// 指定タスクの進捗率返却
			if (this._executingTasks.TryGetValue(key, out var value)) {
				return value.progress.Progress;
			}

			return 100;
		}
	}

	/// <summary>
	/// 処理状況オブジェクト
	/// </summary>
	/// <typeparam name="T">進捗率を表す型</typeparam>
	public class ProgressObject<T> {
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
