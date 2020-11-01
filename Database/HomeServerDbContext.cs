using Database.Tables;

using Microsoft.EntityFrameworkCore;

namespace DataBase {
	public class HomeServerDbContext : DbContext {
		/// <summary>
		/// 取引履歴
		/// </summary>

		public DbSet<LockableMfTransaction> MfTransactions {
			get;
			set;
		} = null!;

		/// <summary>
		/// 資産推移
		/// </summary>
		public DbSet<LockableMfAsset> MfAssets {
			get;
			set;
		} = null!;

		/// <summary>
		/// ユーザー設定
		/// </summary>
		public DbSet<UserSetting> UserSettings {
			get;
			set;
		} = null!;

		/// <summary>
		/// ユーザー設定(WakeOnLan
		/// </summary>
		public DbSet<WakeOnLanTarget> WakeOnLanTargets {
			get;
			set;
		} = null!;

		/// <summary>
		/// Macアドレスベンダーコード
		/// </summary>
		public DbSet<MacAddressVendor> MacAddressVendors {
			get;
			set;
		} = null!;


		/// <summary>
		/// レシピリスト
		/// </summary>
		public DbSet<Recipe> Recipes {
			get;
			set;
		} = null!;

		/// <summary>
		/// 水質情報
		/// </summary>
		public DbSet<WaterState> WaterStates {
			get;
			set;
		} = null!;

		/// <summary>
		/// 電力情報
		/// </summary>
		public DbSet<ElectricPower> ElectricPowers {
			get;
			set;
		} = null!;

		/// <summary>
		/// パルミー動画
		/// </summary>
		public DbSet<Palmie> Palmies {
			get;
			set;
		} = null!;

		/// <summary>
		/// コンストラクタ
		/// </summary>
		/// <param name="options">DbContextOptions</param>
		public HomeServerDbContext(DbContextOptions options) : base(options) {
		}

		/// <summary>
		/// DBモデル設定
		/// </summary>
		/// <param name="modelBuilder">ModelBuilder</param>
		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			modelBuilder.Entity<LockableMfTransaction>().HasKey(x => x.TransactionId);
			modelBuilder.Entity<LockableMfAsset>().HasKey(x => new { x.Date, x.Institution, x.Category });
			modelBuilder.Entity<UserSetting>().HasKey(x => x.Id);
			modelBuilder.Entity<WakeOnLanTarget>().HasKey(x => x.MacAddress);
			modelBuilder.Entity<MacAddressVendor>().HasKey(x => x.Assignment);
			modelBuilder.Entity<Recipe>().HasKey(x => x.Id);
			modelBuilder.Entity<Recipe>().Property(x => x.Id).ValueGeneratedOnAdd();
			modelBuilder.Entity<WaterState>().HasKey(x => x.TimeStamp);
			modelBuilder.Entity<ElectricPower>().HasKey(x => x.TimeStamp);
			modelBuilder.Entity<Palmie>().HasKey(x => x.Id);
			modelBuilder.Entity<Palmie>().Property(x => x.Id).ValueGeneratedOnAdd();
		}
	}
}