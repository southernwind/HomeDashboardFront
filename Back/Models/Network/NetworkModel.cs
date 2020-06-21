using System.Diagnostics;
using System.Threading.Tasks;

using Database.Tables;

using DataBase;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Back.Models.Network {
	public class NetworkModel {
		private readonly ILogger<NetworkModel> _logger;
		private readonly HomeServerDbContext _db;

		public NetworkModel(ILogger<NetworkModel> logger, HomeServerDbContext db) {
			this._logger = logger;
			this._db = db;
		}

		public bool SendMagicPacket(string target) {
			this._logger.LogInformation($"Wake on LAN {target}");
			var process = Process.Start("wakeonlan", target);
			process.WaitForExit();
			return process.ExitCode == 0;
		}

		public async Task RegisterWakeOnLanTarget(WakeOnLanTarget target) {
			await this._db.WakeOnLanTargets.AddAsync(target);
			await this._db.SaveChangesAsync();
		}

		public async Task DeleteWakeOnLanTarget(WakeOnLanTarget target) {
			await using var tran = await this._db.Database.BeginTransactionAsync();
			var record = await this._db.WakeOnLanTargets.SingleAsync(x => x.MacAddress == target.MacAddress);
			this._db.WakeOnLanTargets.Remove(record);
			await this._db.SaveChangesAsync();
			await tran.CommitAsync();
		}

		public async Task<WakeOnLanTarget[]> GetWakeOnLanTargetList() {
			return await this._db.WakeOnLanTargets.ToArrayAsync();
		}
	}
}
