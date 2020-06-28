namespace Back.Models.Aquarium.ResponseDto {
	public class WaterStateResponseDto {
		public string Time {
			get;
			set;
		} = null!;

		public double MinWaterTemperature {
			get;
			set;
		}
		public double LowerQuartileWaterTemperature {
			get;
			set;
		}
		public double MedianWaterTemperature {
			get;
			set;
		}
		public double UpperQuartileWaterTemperature {
			get;
			set;
		}
		public double MaxWaterTemperature {
			get;
			set;
		}
		public double MinTemperature {
			get;
			set;
		}
		public double LowerQuartileTemperature {
			get;
			set;
		}
		public double MedianTemperature {
			get;
			set;
		}
		public double UpperQuartileTemperature {
			get;
			set;
		}
		public double MaxTemperature {
			get;
			set;
		}
		public double MinHumidity {
			get;
			set;
		}
		public double LowerQuartileHumidity {
			get;
			set;
		}
		public double MedianHumidity {
			get;
			set;
		}
		public double UpperQuartileHumidity {
			get;
			set;
		}
		public double MaxHumidity {
			get;
			set;
		}
	}
}