using System;
using System.Linq;
using System.Threading.Tasks;

using Back.Models.Aquarium.RequestDto;
using Back.Models.Aquarium.ResponseDto;
using Back.States;

using Dapper;

using Database.Tables;

using DataBase;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace Back.Models.Aquarium {
	public class AquariumModel {
		private readonly ILogger<AquariumModel> _logger;
		private readonly HomeServerDbContext _db;
		private readonly Store _store;

		public AquariumModel(ILogger<AquariumModel> logger, HomeServerDbContext db, Store store) {
			this._logger = logger;
			this._db = db;
			this._store = store;


		}

		public async Task RegisterWaterStateAsync(WaterStateRequestDto waterState) {
			await this._db.WaterStates.AddAsync(new WaterState {
				TimeStamp = DateTime.Parse(waterState.TimeStamp),
				WaterTemperature = waterState.WaterTemperature,
				Humidity = waterState.Humidity,
				Temperature = waterState.Temperature
			});
			await this._db.SaveChangesAsync();
			this._store.Aquarium.LatestTimeStamp.Value = DateTime.Parse(waterState.TimeStamp);
			this._store.Aquarium.LatestWaterTemperature.Value = waterState.WaterTemperature;
			this._store.Aquarium.LatestHumidity.Value = waterState.Humidity;
			this._store.Aquarium.LatestTemperature.Value = waterState.Temperature;
		}

		public WaterState GetLatestWaterState() {
			return new WaterState {
				TimeStamp = this._store.Aquarium.LatestTimeStamp.Value,
				WaterTemperature = this._store.Aquarium.LatestWaterTemperature.Value,
				Humidity = this._store.Aquarium.LatestHumidity.Value,
				Temperature = this._store.Aquarium.LatestTemperature.Value
			};
		}

		/// <summary>
		/// 水質状態取得
		/// </summary>
		/// <param name="from">開始日時</param>
		/// <param name="to">終了日時</param>
		/// <param name="period">グルーピング間隔</param>
		/// <returns>水質状態</returns>
		public async Task<WaterStateResponseDto[]> GetWaterStateListAsync(string from, string to, int period) {
			var parameters = new DynamicParameters();
			parameters.Add("@period", period);
			parameters.Add("@from", from);
			parameters.Add("@to", to);
			var records = await
				this._db.WaterStates
					.Where(x => x.TimeStamp >= DateTime.Parse(from) && x.TimeStamp <= DateTime.Parse(to))
					.OrderBy(x => x.TimeStamp)
					.ToArrayAsync();

			double median(double[] data) {
				var i = (data.Length / 2d) - 0.5;
				if (i % 1 == 0) {
					return data[(int)i];
				} else {
					return (data[(int)(i - 0.5)] + data[(int)(i + 0.5)]) / 2;
				}
			};
			double lowerQ(double[] data) {
				var i = (data.Length / 4d) - 0.25;
				if (i % 1 == 0) {
					return data[(int)i];
				} else if ((i - 0.25) % 1 == 0) {
					return ((data[(int)(i - 0.25)] * 3) + data[(int)(i + 0.75)]) / 4;
				} else {
					return (data[(int)(i - 0.75)] + (data[(int)(i + 0.25)] * 3)) / 4;
				}
			}
			double upperQ(double[] data) {
				var i = (data.Length * 0.75d) - 0.75;
				if (i % 1 == 0) {
					return data[(int)i];
				} else if ((i - 0.25) % 1 == 0) {
					return ((data[(int)(i - 0.25)] * 3) + data[(int)(i + 0.75)]) / 4;
				} else {
					return (data[(int)(i - 0.75)] + (data[(int)(i + 0.25)] * 3)) / 4;
				}
			}

			return records
				.GroupBy(x => x.TimeStamp.ToFileTimeUtc() / (period * 10000000L) * period * 10000000)
				.Select(
					x => {
						var wts = x.Select(x => x.WaterTemperature).OrderBy(x => x).ToArray();
						var ts = x.Select(x => x.Temperature).OrderBy(x => x).ToArray();
						var hs = x.Select(x => x.Humidity).OrderBy(x => x).ToArray();
						return new WaterStateResponseDto() {
							Time = DateTime.FromFileTimeUtc(x.Key).ToString("yyyy-MM-dd HH:mm:ss"),
							MinWaterTemperature = wts[0],
							LowerQuartileWaterTemperature = lowerQ(wts),
							MedianWaterTemperature = median(wts),
							UpperQuartileWaterTemperature = upperQ(wts),
							MaxWaterTemperature = wts[wts.Length - 1],
							MinTemperature = ts[0],
							LowerQuartileTemperature = lowerQ(ts),
							MedianTemperature = median(ts),
							UpperQuartileTemperature = upperQ(ts),
							MaxTemperature = ts[ts.Length - 1],
							MinHumidity = hs[0],
							LowerQuartileHumidity = lowerQ(hs),
							MedianHumidity = median(hs),
							UpperQuartileHumidity = upperQ(hs),
							MaxHumidity = hs[hs.Length - 1],
						};
					}
				).ToArray();
			;
		}
	}
}
