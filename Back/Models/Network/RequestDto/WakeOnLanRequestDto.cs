namespace Back.Models.Network.RequestDto {
	public class WakeOnLanRequestDto {
		/// <summary>
		/// 対象マックアドレス(00:00:00:00:00:00)
		/// </summary>
		public string? TargetMacAddress {
			get;
			set;
		}
	}
}
