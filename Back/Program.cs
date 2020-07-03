
using System;

using Back.States;

using DataBase;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Back {
	public class Program {
		public static void Main(string[] args) {
			var host = CreateHostBuilder(args).Build();
			CreateDbIfNotExists(host);
			StartMonitoring(host);
			host.Run();
		}

		private static void CreateDbIfNotExists(IHost host) {
			using var scope = host.Services.CreateScope();
			var services = scope.ServiceProvider;
			try {
				var context = services.GetRequiredService<HomeServerDbContext>();
				context.Database.EnsureCreated();
			} catch (Exception ex) {
				var logger = services.GetRequiredService<ILogger<Program>>();
				logger.LogError(ex, "An error occurred creating the DB.");
			}
		}
		private static void StartMonitoring(IHost host) {
			using var scope = host.Services.CreateScope();
			var services = scope.ServiceProvider;
			try {
				var context = services.GetRequiredService<Monitor>();
			} catch (Exception ex) {
				var logger = services.GetRequiredService<ILogger<Program>>();
				logger.LogError(ex, "An error occurred start Monitoring.");
			}
		}

		public static IHostBuilder CreateHostBuilder(string[] args) {
			return Host.CreateDefaultBuilder(args)
				.ConfigureWebHostDefaults(webBuilder => {
					webBuilder.UseStartup<Startup>();
				});
		}
	}
}
