
using System;
using System.Linq;
using System.Threading.Tasks;

using DataBase;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using MoneyForwardViewer.DataBase.Tables;

namespace Back.Models.Financial {
	/// <summary>
	/// 財務データベースの取得
	/// </summary>
	public class Getter {
		/// <summary>
		/// HomeServerDbContext
		/// </summary>
		private readonly HomeServerDbContext _db;
		/// <summary>
		/// ログ
		/// </summary>
		private readonly ILogger<Getter> _logger;
		/// <summary>
		/// コンストラクタ
		/// </summary>
		/// <param name="db">HomeServerDbContext</param>
		/// <param name="logger">ログ</param>
		public Getter(HomeServerDbContext db, ILogger<Getter> logger) {
			this._db = db;
			this._logger = logger;
		}

		/// <summary>
		/// 資産推移取得
		/// </summary>
		/// <param name="from">取得対象開始日</param>
		/// <param name="to">取得対象終了日</param>
		/// <returns>資産推移データ</returns>
		public async Task<MfAsset[]> GetAssetsAsync(DateTime from, DateTime to) {
			return await this._db.MfAssets.Where(x => from <= x.Date && to >= x.Date).ToArrayAsync();
		}


	}
}
