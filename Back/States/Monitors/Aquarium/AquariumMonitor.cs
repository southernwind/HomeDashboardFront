using System;
using System.Reactive.Disposables;
using System.Reactive.Linq;

using Back.Hubs;

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;

using Reactive.Bindings.Extensions;

using Slack.Webhooks;

namespace Back.States.Monitors.Aquarium {
	public class AquariumMonitor : IDisposable {
		private readonly Store _store;
		private readonly IHubContext<DashboardHub> _hubContext;
		private readonly CompositeDisposable _compositeDisposable = new CompositeDisposable();
		private readonly string _webHookUrl;
		public AquariumMonitor(Store store, IHubContext<DashboardHub> hubContext, IConfiguration configuration) {
			this._store = store;
			this._hubContext = hubContext;
			this._webHookUrl = configuration.GetSection("WebHookUrl").GetSection("AquariumSlack").Get<string>();
			var slackClient = new SlackClient(this._webHookUrl).AddTo(this._compositeDisposable);
			// 更新値通知
			this._store
				.Aquarium
				.LatestTimeStamp
				.CombineLatest(
					this._store.Aquarium.LatestWaterTemperature,
					this._store.Aquarium.LatestHumidity,
					this._store.Aquarium.LatestTemperature,
					(time, water, humidity, temp) => new { time, water, humidity, temp })
				.Throttle(TimeSpan.FromMilliseconds(10))
				.Subscribe(async x => {
					await this._hubContext.Clients.All.SendAsync(
						DashboardHub.GetMethodName(DashboardHub.Method.AquaStateChanged),
						x.time,
						x.water,
						x.humidity,
						x.temp);
				}).AddTo(this._compositeDisposable);

			// 室温警告
			store
				.Aquarium
				.LatestTemperature
				.Where(x => x >= 30 && x >= this._store.Aquarium.LastWarnedTemperature.Value + 1)
				.Subscribe(async x => {
					this._store.Aquarium.LastWarnedTemperature.Value = x;
					await slackClient.PostAsync(new SlackMessage { Text = $"室温警告 : {x:##.000}℃", Username = "水槽監視員" });
				}).AddTo(this._compositeDisposable);

			// 室温警告解除
			store
				.Aquarium
				.LatestTemperature
				.Where(_ => this._store.Aquarium.LastWarnedTemperature.Value >= 29)
				.Where(x => x <= 29 || x <= this._store.Aquarium.LastWarnedTemperature.Value - 0.5)
				.Subscribe(async x => {
					this._store.Aquarium.LastWarnedTemperature.Value = x;
					if (x < 29) {
						await slackClient.PostAsync(new SlackMessage { Text = $"室温警告解除 : {x:##.000}℃", Username = "水槽監視員" });
					} else {
						await slackClient.PostAsync(new SlackMessage { Text = $"室温が{x:##.000}℃まで下がりました。", Username = "水槽監視員" });
					}
				}).AddTo(this._compositeDisposable);

			// 水温警告
			store
				.Aquarium
				.LatestWaterTemperature
				.Where(x => x >= 29 && x >= this._store.Aquarium.LastWarnedWaterTemperature.Value + 1)
				.Subscribe(async x => {
					this._store.Aquarium.LastWarnedWaterTemperature.Value = x;
					await slackClient.PostAsync(new SlackMessage { Text = $"水温警告 : {x:##.000}℃", Username = "水槽監視員" });
				}).AddTo(this._compositeDisposable);

			// 水温警告解除
			store
				.Aquarium
				.LatestWaterTemperature
				.Where(_ => this._store.Aquarium.LastWarnedWaterTemperature.Value >= 28)
				.Where(x => x <= 28 || x <= this._store.Aquarium.LastWarnedWaterTemperature.Value - 0.5)
				.Subscribe(async x => {
					this._store.Aquarium.LastWarnedWaterTemperature.Value = x;
					if (x < 28) {
						await slackClient.PostAsync(new SlackMessage { Text = $"水温警告解除 : {x:##.000}℃", Username = "水槽監視員" });
					} else {
						await slackClient.PostAsync(new SlackMessage { Text = $"水温が{x:##.000}℃まで下がりました。", Username = "水槽監視員" });
					}

				}).AddTo(this._compositeDisposable);
		}


		public void Dispose() {
			this._compositeDisposable.Dispose();
		}
	}
}
