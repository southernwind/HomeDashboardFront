namespace Back.Models.ElectricPower.ResponseDto {
	public class ElectricPowerConsumptionResponseDto {
		public string TimeStamp {
			get;
			set;
		} = null!;

		public double ElectricPower {
			get;
			set;
		}
	}
}