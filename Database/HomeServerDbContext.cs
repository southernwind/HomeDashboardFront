using Database.Tables;
using Microsoft.EntityFrameworkCore;

using MoneyForwardViewer.DataBase.Tables;

namespace DataBase {
	public class HomeServerDbContext : DbContext {

		public DbSet<MfTransaction> MfTransactions {
			get;
			set;
		}

		public DbSet<MfAsset> MfAssets {
			get;
			set;
		}

		public DbSet<UserSetting> UserSettings {
			get;
			set;
		}

		public HomeServerDbContext(DbContextOptions options):base(options) {
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			modelBuilder.Entity<MfTransaction>().HasKey(x => x.TransactionId);
			modelBuilder.Entity<MfAsset>().HasKey(x => new { x.Date, x.Institution, x.Category });
			modelBuilder.Entity<UserSetting>().HasKey(x => x.Id);
		}
	}
}