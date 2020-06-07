
using System;
using DataBase;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Configuration;

namespace Back {
	public class Startup {
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
			services.AddMvc();
			services.AddDbContext<HomeServerDbContext>(optionsBuilder => {
				optionsBuilder.UseMySql(this.Configuration.GetConnectionString("Database"));
			});
			services.AddLogging(builder => {
				builder.AddConfiguration(this.Configuration.GetSection("Logging"))
					.AddConsole()
					.AddDebug();
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
			if (env.IsDevelopment()) {
				app.UseDeveloperExceptionPage();
			}

			app.UseRouting();

			app.UseEndpoints(routes => {
				routes.MapControllers();
			});
		}
	}
}
