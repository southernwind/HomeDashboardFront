
using Back.States.Monitors.Aquarium;

namespace Back.States {
	public class Monitor {
		public AquariumMonitor AquariumMonitor {
			get;
		}

		public Monitor(AquariumMonitor aquariumMonitor) {
			this.AquariumMonitor = aquariumMonitor;
		}
	}
}
