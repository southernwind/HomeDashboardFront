using System;
using System.Linq;
using System.Threading.Tasks;

using Back.Hubs;
using Back.Models.Aquarium.RequestDto;
using Back.Models.Aquarium.ResponseDto;

using Dapper;

using Database.Tables;

using DataBase;

using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
namespace Back.Models.Aquarium {
	public class AquariumModel {
		private readonly ILogger<AquariumModel> _logger;
		private readonly HomeServerDbContext _db;
		private readonly IHubContext<DashboardHub> _hubContext;

		public AquariumModel(ILogger<AquariumModel> logger, HomeServerDbContext db, IHubContext<DashboardHub> hubContext) {
			this._logger = logger;
			this._db = db;
			this._hubContext = hubContext;
		}

		public async Task RegisterWaterStateAsync(WaterStateRequestDto waterState) {
			await this._db.WaterStates.AddAsync(new WaterState {
				TimeStamp = DateTime.Parse(waterState.TimeStamp),
				WaterTemperature = waterState.WaterTemperature,
				Humidity = waterState.Humidity,
				Temperature = waterState.Temperature
			});
			await this._db.SaveChangesAsync();
			await this._hubContext.Clients.All.SendAsync(
				DashboardHub.GetMethodName(DashboardHub.Method.AquaStateChanged),
				DateTime.Parse(waterState.TimeStamp),
				waterState.WaterTemperature,
				waterState.Humidity,
				waterState.Temperature);
		}

		public async Task SendLatestWaterState(string connectionId) {
			var waterState = await this._db.WaterStates.OrderByDescending(x => x.TimeStamp).FirstAsync();

			await this._hubContext.Clients.Client(connectionId).SendAsync(
				DashboardHub.GetMethodName(DashboardHub.Method.AquaStateChanged),
				waterState.TimeStamp,
				waterState.WaterTemperature,
				waterState.Humidity,
				waterState.Temperature);
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
			return (await this._db.Database.GetDbConnection().QueryAsync<WaterStateResponseDto>($@"
SELECT
	*
FROM
	(
		SELECT 
		    DATE_FORMAT(from_unixtime(round(unix_timestamp(`TimeStamp` ) div @period) * @period),""%Y-%m-%d %T"") as Time,
		    MIN(WaterTemperature ) over (partition by Time)  as MinWaterTemperature,
		    PERCENTILE_CONT(0.25) within group ( order by WaterTemperature ) over (partition by Time) as LowerQuartileWaterTemperature,
		    median(WaterTemperature ) over (partition by Time) as MedianWaterTemperature,
		    PERCENTILE_CONT(0.75) within group ( order by WaterTemperature ) over (partition by Time) as UpperQuartileWaterTemperature,
		    MAX(WaterTemperature ) over (partition by Time)  as MaxWaterTemperature,
		    MIN(Temperature ) over (partition by Time) as MinTemperature,
		    PERCENTILE_CONT(0.25) within group ( order by Temperature ) over (partition by Time) as LowerQuartileTemperature,
		    median(Temperature ) over (partition by Time) as MedianTemperature,
		    PERCENTILE_CONT(0.75) within group ( order by Temperature ) over (partition by Time) as UpperQuartileTemperature,
		    MAX(Temperature ) over (partition by Time) as MaxTemperature,
		    MIN(Humidity ) over (partition by Time) as MinHumidity,
		    PERCENTILE_CONT(0.25) within group ( order by Humidity ) over (partition by Time) as LowerQuartileHumidity,
		    median(Humidity ) over (partition by Time) as MedianHumidity,
		    PERCENTILE_CONT(0.75) within group ( order by Humidity ) over (partition by Time) as UpperQuartileHumidity,
		    MAX(Humidity ) over (partition by Time) as MaxHumidity
		FROM 
		    WaterStates
		WHERE
			`TimeStamp` BETWEEN @from AND @to
	) as t1
GROUP BY 
    t1.Time
ORDER BY
	t1.Time
", parameters)).ToArray();

		}
	}
}
