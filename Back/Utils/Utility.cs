using System.Threading.Tasks;

using Database.Tables;

using DataBase;

using Microsoft.EntityFrameworkCore;

namespace Back.Utils {
	internal static class Utility {
		/// <summary>
		/// ユーザー設定の取得
		/// </summary>
		/// <param name="dbContext">HomeServerDbContext</param>
		/// <returns>設定レコード</returns>
		public static async Task<UserSetting> GetUseSetting(HomeServerDbContext dbContext) {
			return await dbContext.UserSettings.FirstAsync();
		}
	}
}
