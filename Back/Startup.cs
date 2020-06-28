
using System;

using Back.Models.Aquarium;
using Back.Models.Common;
using Back.Models.Financial;
using Back.Models.Kitchen;
using Back.Models.Network;
using Back.Models.Settings;

using DataBase;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Back {
	public class Startup {
		private readonly string _crossOriginPolicyName = "anyOrigin";
		public IConfiguration Configuration {
			get;
		}


		public Startup(IWebHostEnvironment env) {
			var builder = new ConfigurationBuilder()
				.SetBasePath(env.ContentRootPath)
				.AddJsonFile("appsettings.json", false, true)
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", true, true)
				.AddEnvironmentVariables();
			this.Configuration = builder.Build();

			Console.WriteLine("設定値");
			foreach (var section in this.Configuration.GetChildren()) {
				Console.WriteLine($"{section.Path}:{section.Value}");
			}
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services) {
			// クロスドメインの許可
			services.AddCors(options => {
				options.AddPolicy(this._crossOriginPolicyName, builder => {
					builder.AllowAnyOrigin();
					builder.AllowAnyHeader();
					builder.AllowAnyMethod();
				});
			});

			services.AddMvc();
			services.AddDbContext<HomeServerDbContext>(optionsBuilder => {
				optionsBuilder.UseMySql(this.Configuration.GetConnectionString("Database"));
			});
			services.AddLogging(builder => {
				builder.AddConfiguration(this.Configuration.GetSection("Logging"))
					.AddConsole()
					.AddDebug();
			});
			services.AddHttpClient();

			services.AddSingleton<Updater>();
			services.AddTransient<FinancialModel>();
			services.AddTransient<SettingsModel>();
			services.AddTransient<NetworkModel>();
			services.AddTransient<KitchenModel>();
			services.AddTransient<AquariumModel>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
			}

			app.UseRouting();

			app.UseCors(this._crossOriginPolicyName);

			app.UseEndpoints(routes => {
				routes.MapControllers();
			});

		}
	}
}
