using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataBase;
using Database.Tables;
using Microsoft.EntityFrameworkCore;

namespace Back {
	internal static class Utility {
		public static async Task<UserSetting> GetUseSetting(HomeServerDbContext dbContext) {
			return await dbContext.UserSettings.FirstAsync();
		}
	}
}
