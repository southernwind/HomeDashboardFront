using System;

using Reactive.Bindings;

namespace Back.States.Models.Aquarium {
	public class AquariumStore {
		/// <summary>
		/// 最新タイムスタンプ
		/// </summary>
		public IReactiveProperty<DateTime> LatestTimeStamp {
			get;
		} = new ReactivePropertySlim<DateTime>();

		/// <summary>
		/// 最新水温
		/// </summary>
		public IReactiveProperty<double> LatestWaterTemperature {
			get;
		} = new ReactivePropertySlim<double>();

		/// <summary>
		/// 最新湿度
		/// </summary>
		public IReactiveProperty<double> LatestHumidity {
			get;
		} = new ReactivePropertySlim<double>();

		/// <summary>
		/// 最新気温
		/// </summary>
		public IReactiveProperty<double> LatestTemperature {
			get;
		} = new ReactivePropertySlim<double>();

		/// <summary>
		/// 最終警告気温
		/// </summary>
		public IReactiveProperty<double> LastWarnedWaterTemperature {
			get;
		} = new ReactivePropertySlim<double>();

		/// <summary>
		/// 最終警告水温
		/// </summary>
		public IReactiveProperty<double> LastWarnedTemperature {
			get;
		} = new ReactivePropertySlim<double>();
	}
}
