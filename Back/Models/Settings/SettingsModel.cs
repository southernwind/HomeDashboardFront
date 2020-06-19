using System.Threading.Tasks;

using Database.Tables;

using DataBase;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Back.Models.Settings {
	public class SettingsModel {
		/// <summary>
		/// データベース
		/// </summary>
		private readonly HomeServerDbContext _db;
		/// <summary>
		/// ログ
		/// </summary>
		private readonly ILogger<SettingsModel> _logger;
		public SettingsModel(HomeServerDbContext db, ILogger<SettingsModel> logger) {
			this._db = db;
			this._logger = logger;
		}

		/// <summary>
		/// 現在の設定値取得
		/// </summary>
		/// <returns>現在の設定値</returns>
		public async Task<UserSetting> GetCurrentSettingsAsync() {
			var result = await this._db.UserSettings.SingleAsync();
			result.MoneyForwardPassword = result.MoneyForwardPassword?.Length.ToString();
			return result;
		}

		/// <summary>
		/// 設定データベースの更新を行う
		/// </summary>
		/// <param name="userSetting">更新値</param>
		public async Task UpdateAsync(UserSetting userSetting) {
			await using var tran = await this._db.Database.BeginTransactionAsync();
			var properties = typeof(UserSetting).GetProperties();
			var current = await this._db.UserSettings.SingleAsync();

			foreach (var property in properties) {
				// nullでないプロパティを上書きしていく
				var value = property.GetValue(userSetting);
				if (value != null) {
					property.SetValue(current, value);
				}
			}

			this._db.UserSettings.Update(current);
			await this._db.SaveChangesAsync();
			await tran.CommitAsync();
		}
	}
}
