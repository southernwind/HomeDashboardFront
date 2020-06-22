using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

using Back.Models.Common;
using Back.Models.Network.ResponseDto;

using CsvHelper;
using CsvHelper.Configuration;

using Database.Tables;

using DataBase;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Back.Models.Network {
	public class NetworkModel {
		private readonly ILogger<NetworkModel> _logger;
		private readonly HomeServerDbContext _db;
		private readonly IHttpClientFactory _clientFactory;
		private readonly Updater _updater;
		private readonly IServiceScope _scope;
		private readonly string _dhcpLeasesUrl;

		public NetworkModel(ILogger<NetworkModel> logger, HomeServerDbContext db, IHttpClientFactory clientFactory, Updater updater, IServiceScopeFactory serviceScopeFactory, IConfiguration configuration) {
			this._logger = logger;
			this._db = db;
			this._clientFactory = clientFactory;
			this._updater = updater;
			this._scope = serviceScopeFactory.CreateScope();
			this._dhcpLeasesUrl = configuration.GetSection("DhcpLeasesUrl").Get<string>();
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

		public async Task<DhcpLease[]> GetDhcpLeasesAsync() {
			var client = this._clientFactory.CreateClient();
			var leasesString = await client.GetStringAsync(this._dhcpLeasesUrl);

			var result = leasesString
				.Split("\n")
				.Where(x => !string.IsNullOrWhiteSpace(x))
				.Select(x => x.Split(" "))
				.Select(x =>
					new DhcpLease(
						DateTimeOffset.FromUnixTimeSeconds(long.Parse(x[0])).LocalDateTime.ToString(),
						x[1],
						x[2],
						x[3],
						x[4]))
				.ToArray();

			foreach (var row in result) {
				row.Vendor = await this._db
					.MacAddressVendors
					.FirstOrDefaultAsync(x => row.MacAddress.Replace(":", "").StartsWith(x.Assignment, StringComparison.OrdinalIgnoreCase));
			}

			return result;
		}

		public int UpdateVendorList() {
			return this._updater.Update(async progress => {
				this._logger.LogInformation("ベンダーリストの更新");
				progress.Report(1);
				IDbContextTransaction? transaction = null;
				try {
					var client = this._clientFactory.CreateClient();
					var csvByteArray = await client.GetByteArrayAsync("http://standards-oui.ieee.org/oui/oui.csv");

					this._logger.LogInformation($"ベンダーリストのダウンロード完了[{csvByteArray.Length}]bytes");
					progress.Report(90);
					using var reader = new StreamReader(new MemoryStream(csvByteArray));
					using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.CurrentCulture));
					await csv.ReadAsync();
					csv.ReadHeader();
					var db = this._scope.ServiceProvider.GetService<HomeServerDbContext>();
					transaction = await db.Database.BeginTransactionAsync();
					await db.Database.ExecuteSqlRawAsync($"DELETE FROM {nameof(db.MacAddressVendors)};");
					this._logger.LogInformation("ベンダーリストDBクリア");
					var records = csv.GetRecords<MacAddressVendor>().GroupBy(x => x.Assignment).Select(x => x.First()).ToArray();
					await db.MacAddressVendors.AddRangeAsync(records);
					this._logger.LogInformation($"ベンダーリスト追加完了[{records.Length}]");
					progress.Report(99);

					await db.SaveChangesAsync();
					await transaction.CommitAsync();
					progress.Report(100);
					this._logger.LogInformation("ベンダーリストの更新完了");
				} catch (Exception e) {
					if (transaction != null) {
						await transaction.RollbackAsync();
					}
					progress.Report(100);
					this._logger.LogWarning(e.ToString());
					throw;
				}
			});
		}

	}
}
