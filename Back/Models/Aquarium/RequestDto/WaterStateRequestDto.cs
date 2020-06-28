namespace Back.Models.Aquarium.RequestDto {
	public class WaterStateRequestDto {
		public string TimeStamp {
			get;
			set;
		} = null!;

		public double Temperature {
			get;
			set;
		}

		public double WaterTemperature {
			get;
			set;
		}

		public double Humidity {
			get;
			set;
		}
	}
}
