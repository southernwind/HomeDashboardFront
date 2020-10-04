
using System;

using DataBase;

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Back.Hubs {
	public class DashboardHub : Hub {
		private readonly HomeServerDbContext _dbContext;
		private readonly ILogger<DashboardHub> _logger;
		public DashboardHub(HomeServerDbContext dbContext, ILogger<DashboardHub> logger) {
			this._dbContext = dbContext;
			this._logger = logger;
		}

		/// <summary>
		/// 電力消費量を登録し、リアルタイム配信する。
		/// </summary>
		/// <param name="dateTime">時刻</param>
		/// <param name="consumption">消費量</param>
		public void RegisterElectricPowerConsumption(DateTime dateTime, int consumption) {
			this.Clients.All.SendAsync(
				GetMethodName(Method.ElectricPowerReceived),
				dateTime,
				consumption
			);
			using var transaction = this._dbContext.Database.BeginTransaction();
			try {
				this._dbContext.ElectricPowers.Add(
					new Database.Tables.ElectricPower { TimeStamp = dateTime, ElectricPowerValue = consumption });
				this._dbContext.SaveChanges();
				transaction.Commit();
			} catch (Exception e) {
				transaction.Rollback();
				this._logger.LogWarning(e, "電力量登録時エラー");
			}
			this._logger.LogTrace((dateTime, consumption).ToString());
		}

		public enum Method {
			AquaStateChanged,
			ElectricPowerReceived
		}

		public static string GetMethodName(Method method) {
			return method switch {
				Method.AquaStateChanged => "aqua-state-changed",
				Method.ElectricPowerReceived => "electric-power-received",
				_ => throw new ArgumentOutOfRangeException(nameof(method), method, null)
			};
		}
	}
}