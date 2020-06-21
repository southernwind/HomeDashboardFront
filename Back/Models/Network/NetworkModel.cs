using System.Diagnostics;

using Microsoft.Extensions.Logging;

namespace Back.Models.Network {
	public class NetworkModel {
		private readonly ILogger<NetworkModel> _logger;
		public NetworkModel(ILogger<NetworkModel> logger) {
			this._logger = logger;
		}

		public bool SendMagicPacket(string target) {
			this._logger.LogInformation($"Wake on LAN {target}");
			var process = Process.Start("wakeonlan", target);
			process.WaitForExit();
			return process.ExitCode == 0;
		}
	}
}
